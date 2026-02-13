import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User } from '@arabiaaislamia/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GoogleUserDto } from './dto/google-auth.dto';
import { renderWelcomeAdminEmail, renderInviteAdminSetPasswordEmail } from '@arabiaaislamia/email';
import { EmailLogService } from '../email-logs/email-log.service';

const INVITE_TOKEN_EXPIRY_DAYS = 7;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailLogService: EmailLogService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase().trim() },
    });
    if (existing) throw new ConflictException('User already exists');

    const user = this.userRepository.create({
      email: registerDto.email.toLowerCase().trim(),
      name: registerDto.name.trim(),
      password: registerDto.password,
      role: 'user',
    });
    const saved = await this.userRepository.save(user);
    return { user: this.toResponse(saved), tokens: this.generateTokens(saved) };
  }

  async createAdmin(registerDto: RegisterDto): Promise<UserResponseDto> {
    const existing = await this.userRepository.findOne({
      where: { email: registerDto.email.toLowerCase().trim() },
    });
    if (existing) throw new ConflictException('User already exists');

    const user = this.userRepository.create({
      email: registerDto.email.toLowerCase().trim(),
      name: registerDto.name.trim(),
      password: registerDto.password,
      role: 'admin',
    });
    const saved = await this.userRepository.save(user);
    try {
      const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');
      const html = renderWelcomeAdminEmail({
        name: saved.name,
        logoUrl: logoUrl || undefined,
        brandName: 'Jamia Arabia',
      });
      await this.emailLogService.sendAndLog({
        to: saved.email,
        subject: 'Welcome Admin – Jamia Arabia',
        text: `Hello ${saved.name},\n\nYour admin account has been created. You can now sign in to the admin dashboard.\n\nRegards,\nJamia Arabia Team`,
        html,
        recipientName: saved.name,
        context: 'welcome_admin',
      });
    } catch (err) {
      console.error('Error sending admin email', err);
    }
    return this.toResponse(saved);
  }

  async inviteAdmin(name: string, email: string): Promise<UserResponseDto> {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existing) throw new ConflictException('User already exists');

    const token = this.generateInviteToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_TOKEN_EXPIRY_DAYS);

    const user = this.userRepository.create({
      email: normalizedEmail,
      name: name.trim(),
      password: null,
      role: 'admin',
      inviteToken: token,
      inviteTokenExpiresAt: expiresAt,
    });
    const saved = await this.userRepository.save(user);

    const baseUrl = this.configService.get<string>('NEXT_PUBLIC_SECONDARY_APP_URL');
    const setPasswordUrl = `${baseUrl}/registration/set-password?token=${encodeURIComponent(token)}`;
    const logoUrl = this.configService.get<string>('EMAIL_LOGO_URL_SECONDARY');

    try {
      const html = renderInviteAdminSetPasswordEmail({
        name: saved.name,
        setPasswordUrl,
        logoUrl: logoUrl || undefined,
        brandName: 'Jamia Arabia',
        expiresInDays: INVITE_TOKEN_EXPIRY_DAYS,
      });
      await this.emailLogService.sendAndLog({
        to: saved.email,
        subject: 'Set your password – Jamia Arabia',
        text: `Hello ${saved.name},\n\nYou have been invited to join as an admin. Set your password here: ${setPasswordUrl}\n\nThis link expires in ${INVITE_TOKEN_EXPIRY_DAYS} days.\n\nRegards,\nJamia Arabia Team`,
        html,
        recipientName: saved.name,
        context: 'invite_admin',
      });
    } catch (err) {
      console.error('Error sending invite email', err);
    }
    return this.toResponse(saved);
  }

  async setPasswordByToken(token: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { inviteToken: token },
    });
    if (!user) throw new BadRequestException('Invalid or expired link');
    if (!user.inviteTokenExpiresAt || user.inviteTokenExpiresAt < new Date()) {
      throw new BadRequestException('This link has expired');
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.inviteToken = null;
    user.inviteTokenExpiresAt = null;
    await this.userRepository.save(user);
  }

  private generateInviteToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  async deleteAdmin(userId: string, currentUserId: string): Promise<void> {
    if (userId === currentUserId) {
      throw new BadRequestException('Cannot delete your own account');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');
    await this.userRepository.remove(user);
  }

  async findAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((u) => this.toResponse(u));
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email.toLowerCase().trim() },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await user.comparePassword(loginDto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return { user: this.toResponse(user), tokens: this.generateTokens(user) };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: userId } });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
      });
      const user = await this.validateUser(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    if (dto.name) user.name = dto.name.trim();
    const saved = await this.userRepository.save(user);
    return this.toResponse(saved);
  }

  async updatePassword(userId: string, dto: UpdatePasswordDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new UnauthorizedException();
    const valid = await user.comparePassword(dto.currentPassword);
    if (!valid) throw new BadRequestException('Current password incorrect');
    user.password = dto.newPassword;
    await this.userRepository.save(user);
  }

  async googleAuth(googleUser: GoogleUserDto) {
    let user = await this.userRepository.findOne({
      where: { oauthProvider: 'google', oauthId: googleUser.googleId },
    });
    let isNewUser = false;
    if (!user) {
      user = await this.userRepository.findOne({
        where: { email: googleUser.email.toLowerCase() },
      });
      if (user) {
        user.oauthProvider = 'google';
        user.oauthId = googleUser.googleId;
        if (googleUser.picture) user.avatar = googleUser.picture;
        await this.userRepository.save(user);
      } else {
        isNewUser = true;
        user = this.userRepository.create({
          email: googleUser.email.toLowerCase(),
          name: googleUser.name || googleUser.email.split('@')[0],
          avatar: googleUser.picture,
          oauthProvider: 'google',
          oauthId: googleUser.googleId,
          password: null,
        });
        user = await this.userRepository.save(user);
      }
    }
    return {
      user: this.toResponse(user),
      tokens: this.generateTokens(user),
      isNewUser,
    };
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRES_IN', '1h'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return { accessToken, refreshToken };
  }

  private toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role ?? 'user',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

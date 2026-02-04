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
import { User } from '@arabiaaislamia/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserResponseDto } from './dto/auth-response.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { GoogleUserDto } from './dto/google-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

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
    return this.toResponse(saved);
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

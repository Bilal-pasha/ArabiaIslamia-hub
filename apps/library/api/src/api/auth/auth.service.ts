import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LibraryUser } from '@arabiaaislamia/database';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LibraryUserResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(LibraryUser)
    private readonly userRepository: Repository<LibraryUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  async register(registerDto: RegisterDto) {
    const existing = await this.userRepository.findOne({
      where: { username: registerDto.username.trim() },
    });
    if (existing) throw new ConflictException('User already exists');

    const user = this.userRepository.create({
      username: registerDto.username.trim(),
      password: registerDto.password,
    });
    const saved = await this.userRepository.save(user);
    return { user: this.toResponse(saved), tokens: this.generateTokens(saved) };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { username: loginDto.username.trim() },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await user.comparePassword(loginDto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return { user: this.toResponse(user), tokens: this.generateTokens(user) };
  }

  async validateUser(userId: string): Promise<LibraryUser | null> {
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

  private generateTokens(user: LibraryUser) {
    const payload = { sub: user.id, username: user.username };
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

  private toResponse(user: LibraryUser): LibraryUserResponseDto {
    return {
      id: user.id,
      username: user.username,
      isSuperAdmin: user.username === 'admin',
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CmsAdmin } from '@arabiaaislamia/database';
import { LoginDto } from './dto/login.dto';
import { AdminResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CmsAdmin)
    private readonly adminRepository: Repository<CmsAdmin>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ user: AdminResponseDto; accessToken: string }> {
    const admin = await this.adminRepository.findOne({
      where: { email: dto.email.toLowerCase().trim() },
    });
    if (!admin) throw new UnauthorizedException('Invalid credentials');
    const valid = await admin.comparePassword(dto.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const accessToken = this.jwtService.sign(
      { sub: admin.id },
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    );
    return { user: this.toResponse(admin), accessToken };
  }

  async validateAdmin(adminId: string): Promise<CmsAdmin | null> {
    return this.adminRepository.findOne({ where: { id: adminId } });
  }

  private toResponse(admin: CmsAdmin): AdminResponseDto {
    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt.toISOString(),
      updatedAt: admin.updatedAt.toISOString(),
    };
  }
}

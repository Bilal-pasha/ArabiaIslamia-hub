import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentAdmin } from './decorators/current-user.decorator';
import { CmsAdmin } from '@arabiaaislamia/database';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookie.utils';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private cookieConfig() {
    const isProd = this.config.get('NODE_ENV') === 'production';
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN');
    return {
      isProd,
      cookieDomain: cookieDomain || undefined,
      accessExp: this.config.get('JWT_EXPIRES_IN', '8h'),
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken } = await this.authService.login(dto);
    const { isProd, cookieDomain, accessExp } = this.cookieConfig();
    setAuthCookie(res, accessToken, isProd, accessExp, cookieDomain);
    return {
      success: true,
      message: 'Login successful',
      data: { user },
    } satisfies AuthResponseDto;
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const { cookieDomain } = this.cookieConfig();
    clearAuthCookie(res, cookieDomain);
    return { success: true, message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentAdmin() admin: CmsAdmin) {
    return {
      success: true,
      message: 'Admin retrieved',
      data: {
        user: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.createdAt.toISOString(),
          updatedAt: admin.updatedAt.toISOString(),
        },
      },
    } satisfies AuthResponseDto;
  }
}

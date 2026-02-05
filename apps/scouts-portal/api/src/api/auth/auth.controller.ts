import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, RefreshTokenDto, ResetPasswordDto } from './dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ScoutsUser } from '@arabiaaislamia/database';
import { COOKIE_NAMES } from '../../common/constants';
import { setAuthCookies, clearAuthCookies } from '../../utils/cookie.utils';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) { }

  private cookieConfig() {
    const isProd = this.config.get('NODE_ENV') === 'production';
    const cookieDomain = this.config.get<string>('COOKIE_DOMAIN');
    return {
      isProd,
      cookieDomain: cookieDomain || undefined,
      accessExp: this.config.get('JWT_EXPIRES_IN', '1h'),
      refreshExp: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    };
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.register(dto);
    const { isProd, cookieDomain, accessExp, refreshExp } = this.cookieConfig();
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, isProd, accessExp, refreshExp, cookieDomain);
    return { success: true, message: 'Account created', data: { user } } satisfies AuthResponseDto;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { user, tokens } = await this.authService.login(dto);
    const { isProd, cookieDomain, accessExp, refreshExp } = this.cookieConfig();
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, isProd, accessExp, refreshExp, cookieDomain);
    return { success: true, message: 'Login successful', data: { user } } satisfies AuthResponseDto;
  }

  @Post('token/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request, @Body() body: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] ?? body?.refreshToken;
    if (!token) throw new UnauthorizedException('Refresh token required');
    const tokens = await this.authService.refreshToken(token);
    const { isProd, cookieDomain, accessExp, refreshExp } = this.cookieConfig();
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken, isProd, accessExp, refreshExp, cookieDomain);
    return { success: true, message: 'Token refreshed' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) res: Response) {
    const { cookieDomain } = this.cookieConfig();
    clearAuthCookies(res, cookieDomain);
    return { success: true, message: 'Logout successful' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: ScoutsUser) {
    return {
      success: true,
      message: 'User retrieved',
      data: {
        user: {
          id: user.id,
          username: user.username,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
    } satisfies AuthResponseDto;
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(dto);
    return { success: true, message: 'Password has been reset successfully.' };
  }
}

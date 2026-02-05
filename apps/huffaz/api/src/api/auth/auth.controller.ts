import {
  Controller,
  Post,
  Body,
  Get,
  Put,
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
import { RegisterDto, LoginDto, RefreshTokenDto, UpdateProfileDto, UpdatePasswordDto, GoogleAuthDto } from './dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '@arabiaaislamia/database';
import { COOKIE_NAMES } from '../../common/constants';
import { setAuthCookies, clearAuthCookies } from '../../utils/cookie.utils';
import { OAuth2Client } from 'google-auth-library';

@Controller('api/auth')
export class AuthController {
  private googleClient: OAuth2Client | null = null;

  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
    const clientId = this.config.get('GOOGLE_CLIENT_ID');
    if (clientId) this.googleClient = new OAuth2Client(clientId);
  }

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
  async me(@CurrentUser() user: User) {
    return {
      success: true,
      message: 'User retrieved',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
      },
    } satisfies AuthResponseDto;
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    const updated = await this.authService.updateProfile(user.id, dto);
    return { success: true, message: 'Profile updated', data: { user: updated } } satisfies AuthResponseDto;
  }

  @Put('password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updatePassword(@CurrentUser() user: User, @Body() dto: UpdatePasswordDto) {
    await this.authService.updatePassword(user.id, dto);
    return { success: true, message: 'Password updated' };
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async google(@Body() dto: GoogleAuthDto, @Res({ passthrough: true }) res: Response) {
    if (!this.googleClient) throw new UnauthorizedException('Google auth not configured');
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: this.config.get('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload?.email) throw new UnauthorizedException('Invalid Google token');
      const { user, tokens, isNewUser } = await this.authService.googleAuth({
        googleId: payload.sub,
        email: payload.email,
        name: payload.name || payload.email.split('@')[0],
        picture: payload.picture,
      });
      const { isProd, cookieDomain, accessExp, refreshExp } = this.cookieConfig();
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken, isProd, accessExp, refreshExp, cookieDomain);
      return {
        success: true,
        message: isNewUser ? 'Account created' : 'Login successful',
        data: { user },
      } satisfies AuthResponseDto;
    } catch {
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}

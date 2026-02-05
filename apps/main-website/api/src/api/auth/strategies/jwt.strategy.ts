import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { CmsAdmin } from '@arabiaaislamia/database';
import { COOKIE_NAMES } from '../../../common/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          req?.cookies?.[COOKIE_NAMES.ACCESS_TOKEN] ??
          ExtractJwt.fromAuthHeaderAsBearerToken()(req),
      ]),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET', 'cms-secret-change-in-prod'),
    });
  }

  async validate(payload: { sub: string }): Promise<CmsAdmin> {
    const admin = await this.authService.validateAdmin(payload.sub);
    if (!admin) throw new UnauthorizedException();
    return admin;
  }
}

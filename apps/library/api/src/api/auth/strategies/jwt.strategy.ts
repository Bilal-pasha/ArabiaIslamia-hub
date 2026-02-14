import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { LibraryUser } from '@arabiaaislamia/database';
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
      secretOrKey: config.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  async validate(payload: { sub: string }): Promise<LibraryUser> {
    const user = await this.authService.validateUser(payload.sub);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}

import type { Response } from 'express';
import { COOKIE_NAMES } from '../common/constants';

function parseExpiresMs(exp: string): number {
  const m = exp.match(/^(\d+)([smhd])$/);
  if (!m) return 3600000;
  const v = parseInt(m[1], 10);
  const u: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };
  return v * (u[m[2]] || 3600000);
}

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
  isProd: boolean,
  accessExp: string,
  refreshExp: string,
): void {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: parseExpiresMs(accessExp),
    path: '/',
  });
  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: parseExpiresMs(refreshExp),
    path: '/',
  });
}

export function clearAuthCookies(res: Response): void {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
}

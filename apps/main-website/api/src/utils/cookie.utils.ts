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

export function setAuthCookie(
  res: Response,
  accessToken: string,
  isProd: boolean,
  accessExp: string,
  cookieDomain?: string,
): void {
  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'strict' : 'lax') as 'lax' | 'strict' | 'none',
    path: '/',
    maxAge: parseExpiresMs(accessExp),
    ...(cookieDomain && { domain: cookieDomain }),
  });
}

export function clearAuthCookie(res: Response, cookieDomain?: string): void {
  const opts = { path: '/', ...(cookieDomain && { domain: cookieDomain }) };
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, opts);
}

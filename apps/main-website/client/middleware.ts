import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminRoutes } from '@/constants/route';

const ACCESS_TOKEN_COOKIE = 'access_token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE);
  const pathname = request.nextUrl.pathname;

  const isLogin =
    pathname === adminRoutes.login || pathname.startsWith(`${adminRoutes.login}/`);
  const isProtectedAdmin = pathname.startsWith('/admin') && !isLogin;

  if (!token?.value && isProtectedAdmin) {
    const loginUrl = new URL(adminRoutes.login, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token?.value && isLogin) {
    return NextResponse.redirect(new URL(adminRoutes.dashboard, request.url));
  }

  return NextResponse.next();
}

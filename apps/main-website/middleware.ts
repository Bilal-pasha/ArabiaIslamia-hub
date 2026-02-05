import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminRoutes } from '@/constants/route';

const ACCESS_TOKEN_COOKIE = 'access_token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE);
  const pathname = request.nextUrl.pathname;

  const isSignin =
    pathname === adminRoutes.signin || pathname.startsWith(`${adminRoutes.signin}/`);
  const isProtectedAdmin = pathname.startsWith('/admin') && !isSignin;

  if (!token?.value && isProtectedAdmin) {
    const signin = new URL(adminRoutes.signin, request.url);
    signin.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signin);
  }

  if (token?.value && isSignin) {
    return NextResponse.redirect(new URL(adminRoutes.dashboard, request.url));
  }

  return NextResponse.next();
}

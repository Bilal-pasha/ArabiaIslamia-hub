import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { privateRoutes } from '@/constants/route';

const ACCESS_TOKEN_COOKIE = 'access_token';
const SIGNIN_PATH = '/registration/admin/signin';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE);
  const pathname = request.nextUrl.pathname;

  const isSignin = pathname === SIGNIN_PATH || pathname.startsWith(`${SIGNIN_PATH}/`);
  const isProtectedAdmin = pathname.startsWith('/registration/admin') && !isSignin;

  if (!token && isProtectedAdmin) {
    const signin = new URL(SIGNIN_PATH, request.url);
    signin.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signin);
  }

  if (token && isSignin) {
    return NextResponse.redirect(new URL(privateRoutes.dashboard, request.url));
  }

  return NextResponse.next();
}

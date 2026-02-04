import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { publicRoutes, protectedRoutes } from '@/utils/routes';

const ACCESS_TOKEN_COOKIE = 'access_token';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE);

  const protectedRoutesList = Object.values(protectedRoutes);
  const isProtectedRoute = protectedRoutesList.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL(publicRoutes.AUTH_SIGN_IN, request.url));
  }

  const publicRoutesList = Object.values(publicRoutes);
  const isPublicRoute = publicRoutesList.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (token && isPublicRoute) {
    return NextResponse.redirect(new URL(protectedRoutes.HOME, request.url));
  }

  return NextResponse.next();
}

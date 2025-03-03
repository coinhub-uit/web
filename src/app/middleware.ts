import { auth } from '@/auth/next-auth';
import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ['/'];

export const middleware = auth(async (req) => {
  const path = req.nextUrl.pathname;
  if (req.auth || PUBLIC_ROUTES.includes(path)) {
    return NextResponse.next();
  }
  const url = new URL('/auth/login', req.url);
  url.searchParams.set('callbackUrl', req.nextUrl.pathname);
  return NextResponse.redirect(url);
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

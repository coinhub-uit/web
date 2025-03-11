export { auth as middleware } from '@/lib/auth/next-auth';

export const config = {
  matcher: [
    // '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

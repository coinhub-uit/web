import NextAuth, { CredentialsSignin, Session } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import Credentials from 'next-auth/providers/credentials';

const PUBLIC_ROUTES = ['/'];

// TODO: Should declare custom error page for handling more error, and show more specific
// If so... have to split root layout?

class BadServerError extends CredentialsSignin {
  code = 'Bad server error';
}

class BadClientError extends CredentialsSignin {
  code = 'Bad client error';
}

export function refreshAccessToken() {}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', autofocus: true },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const response: Response = await fetch(
          process.env.API_SERVER_URL || '',
          {
            cache: 'no-store',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          },
        );

        if (response.status >= 500) {
          throw new BadServerError();
        }

        if (response.status >= 400) {
          throw new BadClientError();
        }

        if (!response.ok) {
          throw new Error('Invalid credentials. Check again your credentials.');
        }

        return (await response.json()) ?? null;
      },
    }),
  ],
  callbacks: {
    authorized: async ({
      auth,
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }) => {
      const path: string = request.nextUrl.pathname;
      if (PUBLIC_ROUTES.includes(path)) {
        return NextResponse.next();
      }
      if (!!auth && path === '/api/auth/signin') {
        const url: URL = new URL('/', request.nextUrl.origin);
        return NextResponse.redirect(url);
      }
      if (!auth && path === '/api/auth/signout') {
        const url: URL = new URL('/api/auth/signin', request.nextUrl.origin);
        return NextResponse.redirect(url);
      }
      const url: URL = new URL('/api/auth/signin', request.nextUrl.origin);
      url.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(url);
    },
  },
});

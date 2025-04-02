import NextAuth, {
  AuthValidity,
  BackendJWT,
  CredentialsSignin,
  DecodedAccessJWT,
  DecodedRefreshJWT,
  Session,
  User,
  UserInfo,
} from 'next-auth';
import { NextRequest } from 'next/server';
import Credentials from 'next-auth/providers/credentials';
import {
  API_URL_REFRESH_ACCESS_TOKEN,
  API_URL_SIGNIN,
} from '@/constants/api-urls';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { JWT } from 'next-auth/jwt';

const PUBLIC_ROUTES = ['/'];

class BadServerError extends CredentialsSignin {
  code = 'Bad server error';
}

class BadClientError extends CredentialsSignin {
  code = 'Bad client error';
}

export async function refreshAccessToken(nextAuthJWTCookie: JWT) {
  const response: Response = await fetch(API_URL_REFRESH_ACCESS_TOKEN, {
    cache: 'no-store',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${nextAuthJWTCookie.tokens.token}`,
    },
  });
  if (!response.ok) {
    redirect('/api/auth/signin');
  }

  const backendJwt: BackendJWT = await response.json();
  const { exp: accessExp }: DecodedAccessJWT = jwtDecode(
    backendJwt.accessToken,
  );
  const { exp: refreshExp }: DecodedAccessJWT = jwtDecode(
    backendJwt.refreshToken,
  );
  nextAuthJWTCookie.validity.valid_until = accessExp;
  nextAuthJWTCookie.validity.refresh_until = refreshExp;
  nextAuthJWTCookie.tokens.token = backendJwt.accessToken;
  nextAuthJWTCookie.tokens.refreshToken = backendJwt.refreshToken;
  return { ...nextAuthJWTCookie };
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', autofocus: true },
        password: { label: 'Password', type: 'password' },
      },
      // this function is called when using credentials provider
      authorize: async (credentials) => {
        const response: Response = await fetch(API_URL_SIGNIN, {
          cache: 'no-store',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: credentials.username,
            password: credentials.password,
          }),
        });

        if (response.status >= 500) {
          throw new BadServerError();
        }

        if (response.status >= 400) {
          throw new BadClientError();
        }

        if (!response.ok) {
          throw new CredentialsSignin(
            'Invalid credentials. Check again your credentials.',
          );
        }
        const tokens: BackendJWT = await response.json();

        const accessToken: DecodedAccessJWT = jwtDecode(tokens.accessToken);
        const refreshToken: DecodedRefreshJWT = jwtDecode(tokens.refreshToken);

        try {
          const userInfo: UserInfo = {
            username: accessToken.sub,
            accessToken: tokens.accessToken,
          };

          const validity: AuthValidity = {
            valid_until: accessToken.exp,
            refresh_until: refreshToken.exp,
          };

          const user: User = {
            tokens,
            userInfo,
            validity,
          };
          return user;
        } catch (e) {
          console.error('Error decoding tokens', e);
          return null;
        }
      },
    }),
  ],

  // This is not need to be equal to the backend. It will refresh the new session. But it need to be less than the backend
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 - 60, // 1h - 1m
    updateAge: 7 * 24 * 60 * 60 - 60, // 7d - 1m
  },

  callbacks: {
    // Allow redirect if the URL started with basedUrl
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    },

    authorized: async ({
      auth,
      request,
    }: {
      auth: Session | null;
      request: NextRequest;
    }) => {
      const path: string = request.nextUrl.pathname;
      return PUBLIC_ROUTES.includes(path) || !!auth;
      // TODO: Clean up this or refactor this

      // if (!!auth && path === '/api/auth/signin') {
      //   const url: URL = new URL('/', request.nextUrl.origin);
      //   return NextResponse.redirect(url);
      // }
      // if (!auth && path === '/api/auth/signout') {
      //   const url: URL = new URL('/api/auth/signin', request.nextUrl.origin);
      //   return NextResponse.redirect(url);
      // }
      // const url: URL = new URL('/api/auth/signin', request.nextUrl.origin);
      // url.searchParams.set('callbackUrl', path);
      // return NextResponse.redirect(url);
    },

    jwt: async ({ token, user, account }) => {
      // Initial signin contains a 'User' object from authorize method
      // Or token is still valid
      if (user && account) {
        return { ...token, ...user } as JWT;
      }

      if (Date.now() < token.validity.valid_until * 1000) {
        return { ...token } as JWT;
      }

      // The refresh token is still valid
      if (Date.now() < token.validity.refresh_until * 1000) {
        return await refreshAccessToken(token);
      }

      return null;
    },

    session: async ({ session, token }) => {
      session.user = { ...session.user, ...token.userInfo };
      return session;
    },
  },
});

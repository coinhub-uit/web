import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  /**
   * The user information return from the backend and which field we want to keep to use
   */
  export interface UserInfo {
    username: string;
  }

  /**
   * The initial backend authentication response contains both a `token` (access token) and a `refreshToken`
   */
  export interface BackendJWT {
    accessToken: string;
    refreshToken: string;
  }

  /**
   * The decoded contents of a JWT token returned from the backend
   * (both access and refresh tokens). It contains both the user
   * information and other token metadata.
   * `iat` is the time the token was issued,
   * `exp` is the time the token expires
   * `jti` is the token id.
   */
  export interface DecodedAccessJWT {
    sub: string;
    exp: number;
    iat: number;
    isAdmin: true;
  }

  /**
   * The decoded contents of a JWT refresh token returned from the backend
   */
  export interface DecodedRefreshJWT extends UserInfo {
    sub: string;
    exp: number;
    iat: number;
  }

  /**
   * Information extracted from our decoded backend tokens so that we
   * don't need to decode them again.
   * `valid_until` is the time the access token becomes invalid
   * `refresh_until` is the time the refresh token becomes invalid
   */
  export interface AuthValidity {
    valid_until: number;
    refresh_until: number;
  }

  /**
   * The returned data from the authorize method
   * This is data we extract from our own backend JWT tokens.
   */
  export interface User {
    userInfo: UserInfo;
    tokens: BackendJWT;
    validity: AuthValidity;
  }

  /**
   * Returned by `useSession`, `getSession`, returned by the `session`
   * callback and also the shape received as a prop on the SessionProvider
   * React Context
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Session extends UserInfo {}
}

declare module 'next-auth/jwt' {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  export interface JWT {
    tokens?: BackendJWT;
    userInfo?: UserInfo;
    validity?: AuthValidity;
  }
}

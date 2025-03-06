// https://github.com/nextauthjs/next-auth/issues/11295#issuecomment-2525430099import type { User, UserObject } from 'next-auth'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module 'next-auth' {
  export interface BackendAccessJWT {
    access_token?: string;
    expires_in?: number;
    id_token?: string;
    'not-before-policy'?: number;
    refresh_expires_in?: number;
    refresh_token?: string;
    scope?: string;
    session_state?: string;
    token_type?: string;
  }
  /**
   * What user information we expect to be able to extract
   * from our backend response
   */
  export interface UserObject {
    username: string;
  }

  export interface DecodedJWT {
    exp: number;
    iat: number;
    jti: string;
    iss: string;
    aud: string;
    sub: string;
    typ: string;
    azp: string;
    sid: string;
    acr: string;
    'allowed-origins': string[];
    realm_access: {
      roles: string[];
    };
    resource_access: {
      [key: string]: {
        roles: string[];
      };
    };
    scope: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
  }

  /**
   * The initial backend authentication response contains both an `access` token and a `refresh` token.\
   * The refresh token is a long-lived token that is used to obtain a new access token\
   * when the current access token expires
   */
  export interface RefreshToken extends BackendAccessJWT {
    refresh_token: string;
  }

  /**
   * The decoded contents of a JWT token returned from the backend (both access and refresh tokens).\
   * It contains both the user information and other token metadata.\
   * `iat` is the time the token was issued, `exp` is the time the token expires, `jti` is the token id.
   */
  export interface DecodedJWT extends UserObject {
    token_type: 'refresh' | 'access';
    exp: number;
    iat: number;
    jti: string;
  }

  /**
   * Information extracted from our decoded backend tokens so that we don't need to decode them again.\
   * `valid_until` is the time the access token becomes invalid\
   * `refresh_until` is the time the refresh token becomes invalid
   */
  export interface AuthValidity {
    valid_until: number;
    refresh_until: number;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    tokens: BackendJWT;
    user: UserObject;
    validity: AuthValidity;
  }
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  export interface Session {
    user: {
      first_name: string;
      last_name: string;
      email: string;
      sub: string;
      realm_roles: string[];
      resource_roles: {
        [key: string]: string[];
      };
      tokens: BackendJWT;
      validity: AuthValidity;
    } & DefaultSession['user'];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from 'next-auth/jwt'; // eslint-disable-line @typescript-eslint/no-unused-vars

declare module 'next-auth/jwt' {
  /**
   * The contents of our refresh call to the backend is a new access token
   */

  export interface BackendAccessJWT {
    access_token?: string;
    expires_in?: number;
    id_token?: string;
    'not-before-policy'?: number;
    refresh_expires_in?: number;
    refresh_token?: string;
    scope?: string;
    session_state?: string;
    token_type?: string;
  }
  /**
   * The initial backend authentication response contains both an `access` token and a `refresh` token.\
   * The refresh token is a long-lived token that is used to obtain a new access token\
   * when the current access token expires
   */
  export interface BackendJWT extends BackendAccessJWT {
    refresh_token: string;
  }

  export interface UserObject {
    sub: string;
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    realm_roles: string[];
    resource_roles: {
      [key: string]: string[];
    };
  }

  /**
   * Information extracted from our decoded backend tokens so that we don't need to decode them again.\
   * `valid_until` is the time the access token becomes invalid\
   * `refresh_until` is the time the refresh token becomes invalid
   */
  export interface AuthValidity {
    valid_until: number;
    refresh_until: number;
  }

  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    tokens: BackendJWT;
    user: UserObject;
    validity: AuthValidity;
  }
}

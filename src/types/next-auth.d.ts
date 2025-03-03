// Need this because ...
import NextAuth from 'next-auth'; // eslint-disable-line  @typescript-eslint/no-unused-vars

declare module 'next-auth' {
  interface User {
    username: string;
    refreshToken: string;
    accessToken: string;
  }
  // interface Session {}
}

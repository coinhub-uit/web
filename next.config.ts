import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // compiler: {
  //   removeConsole: false,
  // },
  // experimental: {
  // typedRoutes: true, // Because using turbopack, cannot use this
  // },
  output: 'standalone',
  images: {
    domains: [
      'cloudflare-ipfs.com',
      'coinhub.up.railway.app',
      'avatars.githubusercontent.com',
    ],
  },
};

export default nextConfig;

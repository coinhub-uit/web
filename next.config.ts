import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // typedRoutes: true, // Because using turbopack, cannot use this
  },
};

export default nextConfig;

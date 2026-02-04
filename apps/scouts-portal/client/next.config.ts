import type { NextConfig } from 'next';

export default {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@arabiaaislamia/ui', '@arabiaaislamia/animations'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '**',
        pathname: '/**',
      },
    ],
  },
} satisfies NextConfig;

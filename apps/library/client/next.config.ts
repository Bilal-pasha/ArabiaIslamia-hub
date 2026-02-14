import type { NextConfig } from 'next';

export default {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: ['@arabiaaislamia/ui', '@arabiaaislamia/animations'],
} satisfies NextConfig;

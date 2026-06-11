import type { NextConfig } from 'next';
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/menu.*/i,
      handler: 'StaleWhileRevalidate',
      options: { cacheName: 'menu-cache', expiration: { maxEntries: 50, maxAgeSeconds: 3600 } },
    },
  ],
});

const nextConfig: NextConfig = {
  images: {
    domains: ['*.supabase.co', 'supabase.co'],
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
};

module.exports = withPWA(nextConfig);

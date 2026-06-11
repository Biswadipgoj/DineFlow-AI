const withPWA = require('next-pwa')({ dest: 'public', disable: process.env.NODE_ENV === 'development' });
module.exports = withPWA({ images: { remotePatterns: [{ protocol: 'https' as const, hostname: '**.supabase.co' }] } });

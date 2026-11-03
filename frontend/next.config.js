/** @type {import('next').NextConfig} */

// URL backend — di production selalu ke celenganku-api.vercel.app
// di lokal pakai localhost:4000
const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.VERCEL ? 'https://celenganku-api.vercel.app' : 'http://localhost:4000');

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Proxy semua /api/* → backend langsung (sebelum Next.js cek pages/api)
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;

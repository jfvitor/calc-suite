import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  output: 'export', // SSG para Cloudflare Pages
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;

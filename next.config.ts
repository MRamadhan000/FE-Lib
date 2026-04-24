import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  allowedDevOrigins: ['313e-2402-8780-1075-2b96-714c-7a04-c0c-7eb4.ngrok-free.app'],
};

export default nextConfig;

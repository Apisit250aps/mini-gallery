import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'standalone',
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/arch_gallery/**',
      },
    ],
  },
}

export default nextConfig

import type { NextConfig } from "next";

const isStaticExportEnabled =
  process.env.NEXT_PUBLIC_ENABLE_STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  output: isStaticExportEnabled ? 'export' : undefined,
  trailingSlash: true,
  distDir: isStaticExportEnabled ? 'dist' : '.next',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure.meetupstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'secure-content.meetupstatic.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

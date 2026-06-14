import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';
import path from 'path';

/**
 * Enterprise Next.js Configuration for Vzsoluciones
 * Focus: High-performance SSR, Medical SEO, and Cloud Storage readiness.
 */
const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.elitemedicaljourney.com',
          },
        ],
        destination: 'https://elitemedicaljourney.com/:path*',
        permanent: true,
      },
    ];
  },
  // 1. CORE PERFORMANCE & SECURITY
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Esto asegura que siempre busque en la misma ruta absoluta
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
  // 2. CSS/SSR RESOLUTION FIX
  transpilePackages: ['react-image-crop'],

  // 3. MEDICAL TOURISM IMAGE OPTIMIZATION (CLOUD READY)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elements-resized.envatousercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      //  Vercel Preview/Production URL
      {
        protocol: 'https',
        hostname: 'turismomedicoq-7zodzx3g2-juliobsrs-projects.vercel.app',
      },
      //  VERCEL BLOB STORAGE (For permanent production images)
      {
        protocol: 'https',
        hostname: '**.public.blob.vercel-storage.com',
        port: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
    ],
  },
};

// devBundleServerPackages: false optimiza el uso de memoria RAM local
export default withPayload(nextConfig, { devBundleServerPackages: false });

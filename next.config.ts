import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

/**
 * Enterprise Next.js Configuration for Vzsoluciones
 * Focus: High-performance SSR, Medical SEO, and Cloud Storage readiness.
 */
const nextConfig: NextConfig = {
  // 1. CORE PERFORMANCE & SECURITY
  reactStrictMode: false,

  // 2. CSS/SSR RESOLUTION FIX
  transpilePackages: ['react-image-crop'],

  // 3. MEDICAL TOURISM IMAGE OPTIMIZATION (CLOUD READY)
  images: {
    // 🚀 TECH LEAD TIP: Auto-serve lighter formats to boost Core Web Vitals
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
      // ☁️ VZSOLUCIONES FIX: Vercel Preview/Production URL (Strict Hostname)
      {
        protocol: 'https',
        hostname: 'turismomedicoq-7zodzx3g2-juliobsrs-projects.vercel.app',
      },
      // ☁️ VERCEL BLOB STORAGE (For permanent production images)
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
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

// devBundleServerPackages: false optimizes local memory usage
export default withPayload(nextConfig, { devBundleServerPackages: false });
// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload';
import type { NextConfig } from 'next';

/**
 * Enterprise Next.js Configuration for Vzsoluciones
 * Focus: High-performance SSR, Medical SEO, and Admin UI stability.
 */
const nextConfig: NextConfig = {
  // 1. CORE PERFORMANCE & SECURITY
  reactStrictMode: true,

  // 2. CSS/SSR RESOLUTION FIX
  // We explicitly tell Next.js to transpile this specific package.
  // This allows Turbopack/Webpack to process the .css file inside node_modules
  // BEFORE Node.js attempts to execute it during Server-Side Rendering.
  transpilePackages: ['react-image-crop'],

  // NOTE: We deliberately removed 'serverExternalPackages: ["@payloadcms/next"]'
  // The 'withPayload' wrapper handles the exact dependency tree required 
  // so the Admin Panel doesn't crash on CSS imports.

  // 3. MEDICAL TOURISM IMAGE OPTIMIZATION
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elements-resized.envatousercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
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
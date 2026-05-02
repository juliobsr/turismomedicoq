// next.config.ts
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

/**
 * Enterprise-grade Next.js Configuration
 * Version: Optimized for Next.js 15+ & Payload CMS 3.0
 * Focus: High-performance SSR and strict workspace resolution.
 */
const nextConfig: NextConfig = {
  // Fix: Move experimental.serverComponentsExternalPackages to top-level
  serverExternalPackages: ['@payloadcms/next'],
  
  // SEO & Core Web Vitals Optimization
  reactStrictMode: true,
  
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

  // Webpack Fallbacks for Payload 3.0 TypeScript resolution
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return config
  },
}

// Ensure devBundleServerPackages is false to avoid excessive memory usage in dev
export default withPayload(nextConfig, { devBundleServerPackages: false })
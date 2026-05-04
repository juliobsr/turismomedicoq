// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

/**
 * Enterprise Collection: Media
 * Purpose: Centralized asset management for medical profiles and clinic galleries.
 * Security: Restricted MIME types to prevent malicious executable uploads.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'System',
  },
  access: {
    // SECURITY: Public read access is required for Next.js <Image /> component
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  upload: {
    // Next.js Image Optimization requires to know where images are stored locally
    staticDir: '../public/media',
    // SECURITY: Only allow web-safe image formats
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
    // Auto-generate multiple sizes for Responsive Design (Core Web Vitals)
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      // SEO CRITICAL: Alt text is mandatory for medical accessibility and Google Images
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alternative Text (SEO & Accessibility)',
    },
  ],
}
import type { CollectionConfig } from 'payload';
import path from 'path';
import { backendAccess } from '@/access/backendRoles'

/**
 * Enterprise Collection: Globals Media (Flattened for Debugging)
 * Architecture: Explicit configuration to guarantee Next.js/Payload 3.x registration.
 */
export const GlobalMedia: CollectionConfig = {
  slug: 'medical-assets',
  admin: {
    group: 'Media Library',
    useAsTitle: 'alt',
    description: 'Media assets exclusively for global pages like the Patient Journey.',
  },
  access: {
    // SECURITY: Public read access for Next.js SSR image optimization
    read: () => true,
    create: backendAccess('medical-assets', 'create'),
    update: backendAccess('medical-assets', 'update'),
    delete: backendAccess('medical-assets', 'delete'),
  },
  upload: {
    // NODE.JS: Safe absolute path resolution pointing to the Next.js public directory
    staticDir: path.resolve(process.cwd(), 'public/media/globals'),
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      }
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Crucial for SEO and Accessibility. Describe the image content.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
    },
  ],
};

// Ensure default export is also available just in case
export default GlobalMedia;

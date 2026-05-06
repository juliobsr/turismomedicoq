import { CollectionConfig } from 'payload';
import path from 'path';
/**
 * Enterprise Base Media Configuration
 * Purpose: Provides standard upload settings, access control, and SEO fields.
 */
export const createMediaCollection = (
  slug: string, 
  label: string, 
  uploadFolder: string
): CollectionConfig => ({
  slug,
  labels: {
    singular: label,
    plural: `${label} Library`,
  },
  access: {
    // Public read for Next.js SSR/SEO, restricted updates
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'filename',
    group: 'Media Assets',
  },
  upload: {
    staticDir: `../storage/${uploadFolder}`,
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
      {
        name: 'hero',
        width: 1920,
        height: 1080,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
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
});
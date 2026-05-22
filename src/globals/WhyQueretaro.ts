import type { GlobalConfig, Block } from 'payload';
import { backendAccess } from '@/access/backendRoles'

/**
 * Modern Advantage Block
 * Designed for high-impact visual storytelling
 */
const AdvantageSection: Block = {
  slug: 'advantageSection',
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'imageLeft',
      options: [
        { label: 'Image on Left', value: 'imageLeft' },
        { label: 'Image on Right', value: 'imageRight' },
      ],
    },
    {
      name: 'anchorSlug',
      type: 'text',
      required: true,
      admin: {
        description: 'URL-friendly identifier for the sticky nav (e.g., "safety", "connectivity").',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'highlightSubtitle',
      type: 'text',
      required: true,
      admin: {
        description: 'A punchy, aggressive subtitle to catch attention.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'sectionImage',
      type: 'relationship',
      relationTo: 'medical-assets',
      required: true,
    },
  ],
};

export const WhyQueretaro: GlobalConfig = {
  slug: 'why-queretaro',
  admin: {
    group: 'Platform Content',
  },
  access: {
    read: () => true,
    update: backendAccess('why-queretaro', 'update'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'hero',
          label: 'Hero Header',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'subtitle', type: 'textarea', required: true },
            { name: 'mainImage', type: 'relationship', relationTo: 'medical-assets', required: true },
          ],
        },
        {
          name: 'content',
          label: 'Page Content',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              blocks: [AdvantageSection],
              required: true,
            },
          ],
        },
        {
          name: 'seo',
          label: 'SEO Metadata',
          fields: [
            { name: 'metaTitle', type: 'text', required: true },
            { name: 'metaDescription', type: 'textarea', required: true },
          ],
        },
      ],
    },
  ],
};

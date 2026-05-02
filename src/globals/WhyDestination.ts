// src/globals/WhyDestination.ts
import type { GlobalConfig } from 'payload'

/**
 * Enterprise Global Configuration: Why Queretaro Destination Page
 * Purpose: Allows Marketing team to manage destination selling points and SEO metadata.
 */
export const WhyDestination: GlobalConfig = {
  slug: 'why-destination',
  admin: {
    group: 'Marketing & Landing Pages',
    description: 'Manage the content and SEO for the "Why Queretaro" medical tourism page.',
  },
  access: {
    // Read access must be completely public so Next.js SSR can fetch it
    read: () => true,
    // Only authenticated staff can update
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs', // Tabs for a clean, Enterprise-grade Admin UI
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
              label: 'Main Headline (H1)',
              defaultValue: 'Discover Queretaro: The Hidden Gem of Medical Tourism',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              required: true,
              label: 'Supporting Subtitle (H2)',
            },
            {
              name: 'heroBackgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Hero Background Image',
            },
          ],
        },
        {
          label: 'Value Proposition',
          fields: [
            {
              name: 'advantages',
              type: 'array',
              label: 'Destination Advantages',
              minRows: 3, // Enforce at least 3 points for good UI balance
              maxRows: 6,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  required: true,
                  label: 'Icon Emoji (e.g., 🛡️, ✈️, 🏥)',
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Advantage Title',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                  label: 'Advantage Description',
                },
              ],
            },
          ],
        },
        {
          label: 'SEO Metadata',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              required: true,
              label: 'SEO Meta Title',
              defaultValue: 'Why Queretaro for Medical Tourism | Queretaro Medical',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              required: true,
              label: 'SEO Meta Description',
            },
          ],
        },
      ],
    },
  ],
}
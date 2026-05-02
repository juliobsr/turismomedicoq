// src/globals/WhyDestination.ts
import type { GlobalConfig } from 'payload'

export const WhyDestination: GlobalConfig = {
  slug: 'why-destination',
  admin: {
    group: 'Pages Content',
    description: 'Content for the "Why Choose Us / Destination" landing page.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroHeadline',
              type: 'text',
              required: true,
              defaultValue: 'Discover Queretaro: The Hidden Gem of Medical Tourism',
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              required: true,
              defaultValue: 'Experience world-class healthcare in one of Mexico’s safest, most culturally rich, and highly connected cities.',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        {
          label: 'Selling Points',
          fields: [
            {
              name: 'advantages',
              type: 'array',
              label: 'Destination Advantages',
              minRows: 3,
              maxRows: 6,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  label: 'Icon / Emoji (e.g., 🛡️, ✈️, 🏥)',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Advantage Title (e.g., Unmatched Safety)',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Metadata',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              defaultValue: 'Why Queretaro for Medical Tourism | Queretaro Medical',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              defaultValue: 'Discover why Queretaro is the safest and most advanced destination for medical tourism in Mexico. World-class hospitals and a peaceful recovery environment.',
            },
          ],
        },
      ],
    },
  ],
}
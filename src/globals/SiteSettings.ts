// src/globals/SiteSettings.ts
import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * Enterprise Global: SiteSettings
 * Purpose: Centralized configuration for white-labeling, contact info, and dynamic UI theming.
 * Architecture: Fetched once by Next.js at build time (SSG) to inject CSS variables.
 */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings & Theme',
  access: {
    // SECURITY: Next.js needs public read access to generate the static HTML and CSS
    read: () => true,
    // MUTATION: Strictly limited to authenticated Vzsoluciones staff
    update: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [
      ({ doc, req }) => {
        /**
         * 🚀 TECH LEAD FIX:
         * In Next.js 15+, revalidateTag requires a second argument.
         * We pass an empty object to satisfy the required 'profile' configuration.
         */
        try {
          revalidateTag('site-settings', {})
          req.payload.logger.info('[Payload Hook] SiteSettings updated. Next.js cache purged successfully.')
        } catch (err) {
          req.payload.logger.error(`[Payload Hook] Failed to purge Next.js cache: ${err}`)
        }
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ====================================================================
        // TAB 1: General & Contact Information
        // ====================================================================
        {
          label: 'General Info',
          fields: [
            {
              name: 'companyName',
              type: 'text',
              required: true,
              admin: {
                description: 'The official name of the business. Used in SEO meta tags and footers.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  required: true,
                },
                {
                  name: 'contactPhone',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Recommended format: +1 (555) 123-4567 for global Click-to-Call compatibility.',
                  },
                },
              ],
            },
            {
              // Structured address for better future integration with Google Maps API or Schema.org LocalBusiness
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text', required: false },
                { 
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', required: false },
                    { name: 'state', type: 'text', required: false },
                    { name: 'zipCode', type: 'text', required: false },
                  ]
                },
                { name: 'country', type: 'text', required: true, defaultValue: 'USA' },
              ],
            },
          ],
        },
        // ====================================================================
        // TAB 2: Dynamic Theming (White-labeling)
        // ====================================================================
        {
          label: 'Theme Colors',
          description: 'Define the visual identity. MUST be valid HEX codes (e.g., #2563EB).',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'primaryColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#2563EB', // Tailwind Blue 600
                  admin: { description: 'Main brand color (Buttons, active links).' },
                  validate: (val: string | null | undefined) => {
                    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
                    return (val && hexRegex.test(val)) ? true : 'Must be a valid HEX color code.'
                  },
                },
                {
                  name: 'secondaryColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#1E3A8A', // Tailwind Blue 900
                  admin: { description: 'Secondary elements (Headers, footers, accents).' },
                  validate: (val: string | null | undefined) => {
                    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
                    return (val && hexRegex.test(val)) ? true : 'Must be a valid HEX color code.'
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'accentColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#F59E0B', // Tailwind Amber 500
                  admin: { description: 'Call to Actions, highlight badges, alert icons.' },
                  validate: (val: string | null | undefined) => {
                    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
                    return (val && hexRegex.test(val)) ? true : 'Must be a valid HEX color code.'
                  },
                },
                {
                  name: 'backgroundColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#F8FAFC', // Tailwind Slate 50
                  admin: { description: 'Global application background color.' },
                  validate: (val: string | null | undefined) => {
                    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
                    return (val && hexRegex.test(val)) ? true : 'Must be a valid HEX color code.'
                  },
                },
                {
                  name: 'textColor',
                  type: 'text',
                  required: true,
                  defaultValue: '#0F172A', // Tailwind Slate 900
                  admin: { description: 'Default typography color for high contrast.' },
                  validate: (val: string | null | undefined) => {
                    const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/
                    return (val && hexRegex.test(val)) ? true : 'Must be a valid HEX color code.'
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
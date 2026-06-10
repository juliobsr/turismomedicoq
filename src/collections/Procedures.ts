// src/collections/Procedures.ts
import type { CollectionConfig } from 'payload'
import { backendAccess } from '@/access/backendRoles'

/**
 * Enterprise Collection: Procedures
 * Architecture: Relational PostgreSQL table via Drizzle ORM.
 * Purpose: Catalog of surgical and medical treatments. Highly optimized for Next.js SSG and SEO.
 */
export const Procedures: CollectionConfig = {
  slug: 'procedures',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Directory',
    defaultColumns: ['name', 'specialty', 'isActive'],
  },
  access: {
    // SECURITY: Public read for Next.js Build Time (SSG) & Client fetching
    read: () => true,
    // MUTATIONS: Restricted strictly to authenticated Vzsoluciones staff
    create: backendAccess('procedures', 'create'),
    update: backendAccess('procedures', 'update'),
    delete: backendAccess('procedures', 'delete'),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Info',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Procedure Name',
            },
            {
              // SEO CRITICAL: URL identifier (e.g., 'rhinoplasty-nose-job')
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true, // SQL Index for O(1) query performance in Next.js dynamic routes
            },
            {
              // STRICT RELATIONSHIP: Belongs to a medical specialty
              name: 'specialty',
              type: 'relationship',
              relationTo: 'specialties', // Assuming this collection exists
              required: true,
            },
            {
              name: 'coverImage',
              type: 'relationship',
              relationTo: 'procedures-media',
              required: false,
            },
            {
              name: 'shortSummary',
              type: 'textarea',
              required: true,
              admin: {
                description: 'Used for procedure cards and SEO Meta Description (Max 160 chars).',
              },
            },
            {
              name: 'fullDescription',
              type: 'richText', // Stored as JSONB in Postgres for rendering with Lexical
              required: true,
            },
          ],
        },
        {
          label: 'Medical & Pricing',
          fields: [
            {
              // STRUCTURED DATA: Better for database querying and filtering
              name: 'pricing',
              type: 'group',
              fields: [
                {
                  name: 'startingPriceUSD',
                  type: 'number',
                  required: true,
                  admin: {
                    description: 'Numeric value for sorting/filtering. Displayed in USD.',
                  },
                },
                {
                  name: 'financingAvailable',
                  type: 'checkbox',
                  defaultValue: true,
                },
              ],
            },
            {
              type: 'row', // UI formatting for the admin panel
              fields: [
                {
                  name: 'recoveryTime',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., "1 to 2 weeks"' },
                },
                {
                  name: 'surgeryDuration',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., "2 to 3 hours"' },
                },
                {
                  name: 'anesthesiaType',
                  type: 'select',
                  options: [
                    { label: 'General', value: 'general' },
                    { label: 'Local with Sedation', value: 'local_sedation' },
                    { label: 'Local', value: 'local' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Media Gallery',
          fields: [
            {
              name: 'procedureGallery',
              type: 'relationship',
              relationTo: 'procedures-media',
              hasMany: true,
              required: false,
              label: 'Procedure gallery media',
              admin: {
                description: 'Images or uploaded videos shown in the public procedure gallery.',
              },
            },
            {
              name: 'procedureVideoLinks',
              type: 'array',
              label: 'Procedure gallery video links',
              admin: {
                description: 'External YouTube, Vimeo or public video URLs shown inside the procedure gallery.',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Video URL',
                },
                {
                  name: 'caption',
                  type: 'textarea',
                },
                {
                  name: 'thumbnail',
                  type: 'relationship',
                  relationTo: 'procedures-media',
                  admin: {
                    description: 'Optional image thumbnail for this external procedure video.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & FAQs',
          fields: [
            {
              // SEO CRITICAL: Populates Schema.org JSON-LD in Next.js
              name: 'faqs',
              type: 'array',
              labels: {
                singular: 'FAQ',
                plural: 'FAQs',
              },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
              admin:{
                description: "Provide common questions regarding this medical procedure."
              }
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true, // Automates createdAt/updatedAt for Next.js ISR cache invalidation
}

export default Procedures

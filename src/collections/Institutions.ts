// src/collections/Institutions.ts
import type { CollectionConfig } from 'payload'
import { backendAccess } from '@/access/backendRoles'

/**
 * Enterprise Collection: Institutions
 * Architecture: Relational PostgreSQL table via Drizzle ORM.
 * Purpose: Directory of medical institutions/hospital networks (e.g., Grupo Ángeles).
 * SEO Impact: Enables generation of authoritative landing pages for medical networks.
 */
export const Institutions: CollectionConfig = {
  slug: 'institutions',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Network',
    defaultColumns: ['name', 'website', 'isActive'],
  },
  access: {
    // SECURITY: Public read access is mandatory so Next.js can fetch this via API for SSG
    read: () => true,
    // Only authenticated Vzsoluciones staff can create/update/delete records
    create: backendAccess('institutions', 'create'),
    update: backendAccess('institutions', 'update'),
    delete: backendAccess('institutions', 'delete'),
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
              label: 'Institution Name',
              admin: {
                description: 'The official name of the medical network or institution.',
              },
            },
            {
              // SEO CRITICAL: URL-friendly identifier for Next.js dynamic routing
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true, // SQL Index for hyper-fast lookups in Neon Postgres
            },
            {
              name: 'description',
              type: 'richText', // Stored efficiently as JSONB in PostgreSQL
              required: true,
              admin: {
                description: 'Detailed content for the institution landing page. Crucial for SEO.',
              },
            },
          ],
        },
        {
          label: 'Media & External Links',
          fields: [
            {
              // STRICT RELATIONSHIP: Foreign Key mapping to the Media collection
              name: 'logo',
              type: 'relationship',
              relationTo: 'institutions-media',
              required: true,
            },
            {
              name: 'website',
              type: 'text',
              admin: {
                description: 'Official external website URL (e.g., https://www.institucion.com). Ensure to include https://',
              },
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
        description: 'Uncheck to hide this institution from the public Next.js frontend.',
      },
    },
  ],
  timestamps: true, // Auto-generates 'createdAt' and 'updatedAt' for ISR cache invalidation in Next.js
}

// src/collections/Facilities.ts
import type { CollectionConfig } from 'payload'

/**
 * Enterprise Collection: Facilities (Hospitals & Clinics)
 * Architecture: Relational PostgreSQL table via Drizzle ORM.
 * Purpose: Directory of medical centers for Next.js SSG. Crucial for patient trust.
 */
export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Directory',
    defaultColumns: ['name', 'city', 'isActive'],
  },
  access: {
    // SECURITY: Public read is mandatory for Next.js build time (SSG)
    read: () => true,
    // Only authenticated Vzsoluciones staff can mutate infrastructure data
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
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
              label: 'Facility Name',
            },
            {
              // SEO CRITICAL: Unique URL identifier (e.g., 'hospital-san-jose')
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true, // SQL Index for O(1) lookups in Next.js dynamic routes
            },
            {
              name: 'description',
              type: 'richText', // Stored as JSONB in PostgreSQL
              required: true,
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              admin: {
                description: 'City where the facility is located (e.g., Hermosillo, Ciudad Obregón).',
              },
            },
          ],
        },
        {
          label: 'Medical & Trust',
          fields: [
            {
              // STRICT RELATIONSHIP: Replaced raw text array with a Postgres Foreign Key mapping
              // Links directly to our Certificates collection to display official logos
              name: 'accreditations',
              type: 'relationship',
              relationTo: 'certificates',
              hasMany: true,
              admin: {
                description: 'Select official accreditations (e.g., JCI, ISO) from the database.',
              },
            },
            {
              // STRICT RELATIONSHIP: What specialties are treated here?
              name: 'specialtiesOffered',
              type: 'relationship',
              relationTo: 'specialties',
              hasMany: true,
              required: true,
            },
          ],
        },
        {
          label: 'Media Gallery',
          fields: [
            {
              // ARCHITECTURE FIX: Payload 'upload' cannot be hasMany. 
              // We use an array to build a robust gallery with SEO captions.
              name: 'gallery',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [
                {
                  name: 'photo',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'altText',
                  type: 'text',
                  required: true,
                  label: 'SEO Alt Text',
                  admin: {
                    description: 'Crucial for Google Images. Describe the photo (e.g., "Operating room at Hospital San Jose").',
                  },
                },
              ],
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
  timestamps: true, // Automates 'createdAt' and 'updatedAt' for Next.js Cache Invalidation
}

export default Facilities
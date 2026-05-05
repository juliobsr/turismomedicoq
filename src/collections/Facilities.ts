import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
/**
 * Enterprise Collection: Facilities
 * Refactored for High-Performance Filtering and Relational Integrity.
 */
export const Facilities: CollectionConfig = {
  slug: 'facilities',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Directory',
    defaultColumns: ['name', 'city', 'isActive'],
  },
  access: {
    read: () => true, // Essential for SSG/ISR in Next.js
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
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true, // SQL Index for high-speed dynamic routing
            },
            {
              name: 'description',
              type: 'richText',
              required: true,
              
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              index: true, // Optimized for City-based filtering
              admin: {
                description: 'Location city.',
              },
            },
          ],
        },
        {
          label: 'Medical Network',
          fields: [
            {
              name: 'specialtiesOffered',
              type: 'relationship',
              relationTo: 'specialties',
              hasMany: true,
              required: true,
              index: true, // Critical for Specialty filtering
            },
            {
              name: 'doctors',
              type: 'relationship',
              relationTo: 'doctors',
              hasMany: true,
              index: true, // Enables filtering Hospitals by specific Doctors
              admin: {
                description: 'List of specialists practicing at this facility.',
              },
            },
            {
              name: 'accreditations',
              type: 'relationship',
              relationTo: 'certificates',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Media & SEO',
          fields: [
            {
              name: 'heroImage',
              type: 'relationship',
              relationTo: 'facilities-media',
              required: true,
              admin: {
                description: 'Main image for the facility header and cards.',
              },
            },
            {
              name: 'infrastructureGallery',
              type: 'relationship',
              relationTo: 'facilities-media',
              hasMany: true,
              admin: {
                description: 'Showcase photos of rooms and equipment.',
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
      },
    },
  ],
  timestamps: true,
}

export default Facilities
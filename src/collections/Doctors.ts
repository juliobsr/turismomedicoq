// src/collections/Doctors.ts
import type { CollectionConfig } from 'payload'
// ✅ IMPORT THE NEW HOOK
import { revalidateNavigationCache } from '../hooks/revalidateCache'
/**
 * Enterprise Collection: Doctors
 * Architecture: Relational PostgreSQL table.
 * Purpose: Central hub for Medical Specialists, linking to Procedures, Specialties, and Facilities.
 */
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'fullName',
    group: 'Medical Directory',
    defaultColumns: ['fullName', 'medicalLicense', 'isActive'],
  },
  access: {
    // SECURITY: Public read access required for Next.js SSG
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    afterChange: [revalidateNavigationCache],
    afterDelete: [revalidateNavigationCache], // Don't forget to purge if a doctor is deleted!
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Info',
          fields: [
            {
              name: 'fullName',
              type: 'text',
              required: true,
              label: 'Full Name (with Titles)',
            },
            {
              // SEO CRITICAL: e.g., 'dr-julio-valdez'
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              index: true,
            },
            {
              name: 'medicalLicense',
              type: 'text',
              required: false,
              label: 'Medical License Number (Cédula)',
            },
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
              required: false,
            },
          ],
        },
        {
          label: 'Clinical Profile',
          fields: [
            {
              // RELATIONSHIP: What branches of medicine do they practice?
              name: 'specialties',
              type: 'relationship',
              relationTo: 'specialties',
              hasMany: true,
              required: false,
            },
            {
              // RELATIONSHIP: What specific surgeries/treatments do they perform?
              name: 'procedures',
              type: 'relationship',
              relationTo: 'procedures',
              hasMany: true,
              required: false,
              admin: {
                description: 'Select the specific procedures this doctor is authorized to perform.',
              },
            },
            {
              // RELATIONSHIP: Where do they operate?
              name: 'facilities',
              type: 'relationship',
              relationTo: 'facilities',
              hasMany: true,
              required: false,
              admin: {
                description: 'Hospitals or clinics where this specialist attends patients.',
              },
            },
            {
              name: 'biography',
              type: 'richText', // JSONB storage
              required: false,
            },
          ],
        },
        {
          label: 'SEO & Meta',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
            },
            {
              name: 'metaDescription',
              type: 'textarea',
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
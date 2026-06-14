// src/collections/Doctors.ts
import type { CollectionConfig } from 'payload'
// ✅ IMPORT THE NEW HOOK
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateCache'
import { backendAccess } from '@/access/backendRoles'
/**
 * Enterprise Collection: Doctors
 * Architecture: Relational PostgreSQL table.
 * Purpose: Central hub for Medical Specialists, linking to Procedures, Specialties, and Facilities.
 */
export const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'fullName',
    group: 'Medical Network',
    defaultColumns: ['fullName', 'medicalLicense', 'isActive'],
  },
  access: {
    // SECURITY: Public read access required for Next.js SSG
    read: () => true,
    create: backendAccess('doctors', 'create'),
    update: backendAccess('doctors', 'update'),
    delete: backendAccess('doctors', 'delete'),
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete], // Don't forget to purge if a doctor is deleted!
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
            // Main profile picture (Single relationship)
    {
      name: 'profilePicture',
      type: 'relationship',
      relationTo: 'doctors-media',
      required: true,
      admin: {
        description: 'Primary headshot for directory cards.',
      },
    },
    // Additional images (One-to-Many relationship)
    {
      name: 'officeGallery',
      type: 'relationship',
      relationTo: 'doctors-media',
      hasMany: true, // This enables multiple selection
      admin: {
        description: 'Photos of the doctor\'s office or consultation rooms.',
      },
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
          label: 'Media & Testimonials',
          fields: [
            {
              name: 'heroBackground',
              type: 'relationship',
              relationTo: 'doctors-media',
              required: false,
              admin: {
                description: 'Optional hero background image for the public doctor profile.',
              },
            },
            {
              name: 'heroVideoUrl',
              type: 'text',
              required: false,
              admin: {
                description: 'Optional direct MP4/WebM URL for the hero background. If present, it overrides the hero image.',
              },
            },
            {
              name: 'procedureGallery',
              type: 'relationship',
              relationTo: 'doctors-media',
              hasMany: true,
              required: false,
              admin: {
                description: 'Procedure, technology, OR or treatment images/videos shown as a clinical gallery on the doctor profile.',
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
                  relationTo: 'doctors-media',
                  admin: {
                    description: 'Optional image thumbnail for this external procedure video.',
                  },
                },
              ],
            },
            {
              name: 'patientTestimonials',
              type: 'array',
              required: false,
              labels: {
                singular: 'Patient Testimonial Video',
                plural: 'Patient Testimonial Videos',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'videoUrl',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'YouTube, Vimeo or direct hosted video URL.',
                  },
                },
                {
                  name: 'patientLocation',
                  type: 'text',
                  required: false,
                  admin: {
                    description: 'Example: Dallas, Texas or Phoenix, Arizona.',
                  },
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  required: false,
                },
              ],
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
        {
          label: 'Contact Info',
          fields: [
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'email',
              type: 'text',
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

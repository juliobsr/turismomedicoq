import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { backendAccess } from '@/access/backendRoles'
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
    create: backendAccess('facilities', 'create'),
    update: backendAccess('facilities', 'update'),
    delete: backendAccess('facilities', 'delete'),
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
              label: 'Hero background media',
              admin: {
                description: 'Main uploaded image or video used as the facility hero background. Images are also used for cards and SEO previews.',
              },
            },
            {
              name: 'heroVideoUrl',
              type: 'text',
              label: 'Hero external video URL',
              admin: {
                description: 'Optional YouTube, Vimeo or direct MP4/WebM URL for the hero background. If filled, it takes priority over the uploaded hero media.',
              },
            },
            {
              name: 'infrastructureGallery',
              type: 'relationship',
              relationTo: 'facilities-media',
              hasMany: true,
              label: 'Infrastructure gallery media',
              admin: {
                description: 'Showcase photos or uploaded videos of rooms, equipment and patient areas.',
              },
            },
            {
              name: 'infrastructureVideoLinks',
              type: 'array',
              label: 'Gallery video links',
              admin: {
                description: 'External video links shown inside the facility gallery. Use this for YouTube, Vimeo, Instagram or other public video URLs.',
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
                  relationTo: 'facilities-media',
                  admin: {
                    description: 'Optional image thumbnail for this external video link.',
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
  timestamps: true,
}

export default Facilities

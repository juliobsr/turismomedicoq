import type { GlobalConfig } from 'payload'

/**
 * Enterprise Global: Patient Journey
 * Architecture: Singleton data structure for the "How it Works" / Journey page.
 * Features: Supports nested options for rich UI (e.g., multiple recovery destinations)
 * and references the dedicated 'globals-media' collection for strict asset management.
 */
export const PatientJourney: GlobalConfig = {
  slug: 'patient-journey',
  admin: {
    group: 'Platform Content',
  },
  access: {
    // SECURITY: Publicly readable for Next.js SSR, editable only by authenticated admins
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero Section',
          fields: [
            {
              name: 'heroTitle',
              type: 'text',
              required: true,
              defaultValue: 'Your Medical Journey to Queretaro',
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              required: true,
              defaultValue: 'Experience world-class healthcare combined with the luxury of recovering in Mexico\'s most beautiful colonial cities.',
            },
            {
              // STRICT RELATIONSHIP: Uses the segregated media collection for global assets
              name: 'heroCover',
              type: 'relationship',
              relationTo: 'medical-assets', 
              required: true,
            },
          ],
        },
        {
          label: 'Journey Steps',
          fields: [
            {
              name: 'steps',
              type: 'array',
              required: true,
              minRows: 3,
              labels: {
                singular: 'Step',
                plural: 'Steps',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g., "Arrival", "Surgery", "Recovery"' }
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'duration',
                  type: 'text',
                  admin: { description: 'e.g., "Day 1", "Days 2-4"' }
                },
                {
                  // Main image for the step (Optional if options are provided)
                  name: 'image',
                  type: 'relationship',
                  relationTo: 'medical-assets',
                  required: false,
                },
                {
                  // ENTERPRISE ARCHITECTURE: Nested Array for Destination Choices
                  name: 'options',
                  type: 'array',
                  admin: {
                    description: 'Optional: Add multiple choices for this step (e.g., different recovery cities or hotels).',
                  },
                  labels: {
                    singular: 'Option',
                    plural: 'Options',
                  },
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g., "Recovery in Bernal"' }
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      required: true,
                    },
                    {
                      name: 'image',
                      type: 'relationship',
                      relationTo: 'medical-assets',
                      required: true, // Enforced to maintain visual consistency in the UI grid
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'SEO Metadata',
          fields: [
            {
              name: 'metaTitle',
              type: 'text',
              admin: { description: 'Overrides the default SEO title. Keep under 60 characters.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              admin: { description: 'Meta description for Google search results. Keep under 160 characters.' },
            },
          ]
        }
      ]
    }
  ]
}

export default PatientJourney
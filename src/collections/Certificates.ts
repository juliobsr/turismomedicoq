// src/collections/Certificates.ts
import type { CollectionConfig } from 'payload'

/**
 * Enterprise Collection: Certificates
 * Architecture: PostgreSQL mapped table via Drizzle ORM.
 * Purpose: Manages medical board certifications and clinic accreditations (e.g., JCI, ISO).
 * SEO Impact: Crucial for Google's YMYL and E-E-A-T signals.
 */
export const Certificates: CollectionConfig = {
  slug: 'certificates',
  admin: {
    useAsTitle: 'name',
    group: 'Medical Directory',
    defaultColumns: ['name', 'issuer', 'isActive'],
  },
  access: {
    // SECURITY & SSR: Public read is mandatory so Next.js can fetch this during 'next build'
    read: () => true,
    // Only authenticated staff can modify accreditations
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Certificate Name',
      admin: {
        description: 'e.g., Board Certified Plastic Surgeon, Joint Commission International.',
      },
    },
    {
      name: 'issuer',
      type: 'text',
      required: true,
      label: 'Issuing Organization',
      admin: {
        description: 'Entity that granted the certificate (e.g., Consejo Mexicano de Cirugía Plástica).',
      },
    },
    {
      // TRUST SIGNAL: Linking to the official verification builds immense SEO trust
      name: 'verificationUrl',
      type: 'text',
      label: 'Verification URL (Optional)',
      admin: {
        description: 'Public link to verify this accreditation online.',
      },
    },
    {
      // STRICT RELATIONSHIP: Foreign Key to the Media table for the badge/logo
      name: 'logo',
      type: 'relationship',
      relationTo: 'certificates-media',
      required: true,
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide this certificate from the frontend without deleting it.',
      },
    },
  ],
  timestamps: true, // Auto-generates 'createdAt' and 'updatedAt' for cache invalidation strategies
}
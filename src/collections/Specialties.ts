// src/collections/Specialties.ts
import type { CollectionConfig } from 'payload'
// ✅ IMPORT THE NEW HOOK
import { revalidateNavigationCache } from '../hooks/revalidateCache'
/**
 * Enterprise Collection: Specialties
 * Purpose: Relational catalog for medical branches. Powers category pages in Next.js.
 */
export const Specialties: CollectionConfig = {
  slug: 'specialties',
  admin: {
    useAsTitle: 'title',
    group: 'Medical Directory',
  },
  access: {
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Specialty Name (e.g., Plastic Surgery)',
    },
    {
      // SEO CRITICAL: URL-friendly identifier
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true, // Speeds up PostgreSQL lookups during Next.js SSG
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief description of the specialty for the category landing page.',
      },
    },
  ],
}
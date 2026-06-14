// src/collections/Specialties.ts
import type { CollectionConfig } from 'payload'
// ✅ IMPORT THE NEW HOOK
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidateCache'
import { formatSlug } from '../utils/formatSlug'
import { backendAccess } from '@/access/backendRoles'
/**
 * Enterprise Collection: Specialties
 * Purpose: Relational catalog for medical branches. Powers category pages in Next.js.
 */
export const Specialties: CollectionConfig = {
  slug: 'specialties',
  admin: {
    useAsTitle: 'title',
    group: 'Medical Network',
  },
  access: {
    read: () => true,
    create: backendAccess('specialties', 'create'),
    update: backendAccess('specialties', 'update'),
    delete: backendAccess('specialties', 'delete'),
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete], // Don't forget to purge if a doctor is deleted!
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
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
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

import { CollectionConfig } from 'payload'

export const Institutions: CollectionConfig = {
  slug: 'institutions',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', required: true },
    { name: 'website', type: 'text' }, // Opcional por si quieres linkear al hospital
  ],
}
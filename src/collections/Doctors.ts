import type { CollectionConfig } from 'payload'

const Doctors: CollectionConfig = {
  slug: 'doctors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'specialty', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'specialty',
      type: 'relationship',
      relationTo: 'specialties', // Apunta a nuestra nueva colección
      required: true,
      hasMany: true,
      admin: {
        allowCreate: true, // Permite crear una especialidad nueva desde el perfil del doctor
      },
    },
    {
      name: 'profilePicture',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'biography',
      type: 'richText',
      required: true,
    },
    {
      name: 'procedures',
      type: 'relationship',
      relationTo: 'procedures',
      hasMany: true,
    },
    {
      name: 'facilities',
      type: 'relationship',
      relationTo: 'facilities',
      hasMany: true,
    },
    // En src/collections/Doctors.ts
{
  name: 'certifications',
  type: 'relationship',
  relationTo: 'certificates',
  hasMany: true,
  label: 'Professional Certifications',
},
{
  name: 'affiliations',
  type: 'relationship',
  relationTo: 'institutions',
  hasMany: true,
  label: 'Hospital Affiliations',
},
  ],
}

export default Doctors
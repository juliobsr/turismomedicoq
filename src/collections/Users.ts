import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin', // Organiza el menú lateral
  },
  auth: true, // Habilita login/password automáticamente
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['patient'],
      required: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Patient', value: 'patient' },
      ],
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
  ],
}

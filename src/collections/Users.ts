import type { CollectionConfig } from 'payload'

import { backendAccess, isPrincipalAdmin, isPrincipalAdminField } from '@/access/backendRoles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
  },
  access: {
    create: isPrincipalAdmin,
    read: backendAccess('users', 'read'),
    update: isPrincipalAdmin,
    delete: isPrincipalAdmin,
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      defaultValue: ['patient'],
      required: true,
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Doctor', value: 'doctor' },
        { label: 'Patient', value: 'patient' },
      ],
      access: {
        update: isPrincipalAdminField,
      },
      admin: {
        description: 'The Admin option is the principal administrator role and can create backend roles.',
      },
    },
    {
      name: 'backendRoles',
      type: 'relationship',
      relationTo: 'backend-roles',
      hasMany: true,
      saveToJWT: true,
      admin: {
        description: 'Configurable backend permissions. Only the principal admin can assign these roles.',
      },
      access: {
        update: isPrincipalAdminField,
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
  ],
}

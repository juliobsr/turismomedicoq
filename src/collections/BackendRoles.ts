import type { CollectionConfig } from 'payload'

import { backendPermissionTargets, isPrincipalAdmin } from '@/access/backendRoles'

export const BackendRoles: CollectionConfig = {
  slug: 'backend-roles',
  labels: {
    singular: 'Backend Role',
    plural: 'Backend Roles',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
    defaultColumns: ['name', 'slug', 'isActive', 'updatedAt'],
  },
  access: {
    create: isPrincipalAdmin,
    read: isPrincipalAdmin,
    update: isPrincipalAdmin,
    delete: isPrincipalAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Internal identifier, for example lead-coordinator or content-editor.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'permissions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'target',
          type: 'select',
          required: true,
          options: [...backendPermissionTargets],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'read',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'create',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'update',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '25%' },
            },
            {
              name: 'delete',
              type: 'checkbox',
              defaultValue: false,
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}

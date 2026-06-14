import type { CollectionConfig } from 'payload'
import { backendAccess } from '@/access/backendRoles'
import { notifyLeadFileUpload } from '@/hooks/notifyLeadFileUpload'

export const LeadFiles: CollectionConfig = {
  slug: 'lead-files',
  labels: {
    singular: 'Lead File',
    plural: 'Lead Files',
  },
  admin: {
    useAsTitle: 'originalName',
    group: 'Patient Care',
    defaultColumns: ['originalName', 'lead', 'createdAt'],
  },
  access: {
    create: backendAccess('lead-files', 'create'),
    read: backendAccess('lead-files', 'read'),
    update: backendAccess('lead-files', 'update'),
    delete: backendAccess('lead-files', 'delete'),
  },
  upload: {
    staticDir: '../storage/lead-files',
    mimeTypes: ['application/pdf', 'image/*'],
  },
  hooks: {
    afterChange: [notifyLeadFileUpload],
  },
  fields: [
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
      required: true,
      index: true,
    },
    {
      name: 'originalName',
      type: 'text',
      required: true,
    },
    {
      name: 'patientNote',
      type: 'textarea',
    },
  ],
  timestamps: true,
}

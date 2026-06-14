// src/collections/Leads.ts
import type { 
  CollectionConfig, 
  CollectionBeforeChangeHook, 
  CollectionAfterChangeHook 
} from 'payload'
import { notifyLeadCreation } from '../hooks/notifyLeadCreation';
import { sendLeadResponse } from '../hooks/sendLeadResponse'
import { notifyLeadUpdate } from '@/hooks/notifyLeadUpdate'
import { backendAccess } from '@/access/backendRoles'
import crypto from 'crypto'
import {
  lexicalEditor,
  HTMLConverterFeature,
} from '@payloadcms/richtext-lexical'
// 1. STRICT TYPING: Define the expected shape of the Lead document
interface LeadDocument {
  id?: string;
  name: string;
  folio?: string;
  email: string;
  phone: string;
  doctor: string | object; // Can be an ID or the populated Doctor object
  notes?: string;
  status: 'new' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
}

// ============================================================================
// HOOKS: Enterprise Business Logic
// ============================================================================

const generateSecureFolio: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create') {
    // Generate a secure, uppercase 6-character alphanumeric string
    const secureRandom = crypto.randomBytes(3).toString('hex').toUpperCase();
    return {
      ...data,
      folio: `QM-${secureRandom}`,
    }
  }
  return data;
}



/**
 * Enterprise Collection: Leads (Patient Inquiries)
 * Architecture: PostgreSQL mapped table via Drizzle ORM.
 */
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name', 
    group: 'Patient Care',
    defaultColumns: ['folio', 'name','doctor','procedure', 'status', 'createdAt'],
  },
  
  // 2. SECURITY: Hardened access control for Medical PII
  access: {
    // Anyone (Next.js public forms) can create a lead
    create: () => true,
    // ONLY authenticated clinical staff/admins can read the leads
    read: backendAccess('leads', 'read'),
    update: backendAccess('leads', 'update'),
    delete: backendAccess('leads', 'delete'),
  },

  hooks: {
    beforeChange: [generateSecureFolio],
    afterChange: [notifyLeadCreation, notifyLeadUpdate, sendLeadResponse],
  },

  fields: [
    {
      name: 'folio',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-generated secure tracking identifier.',
      },
      label: 'Case Folio',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'contactNotes',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          // We add HTML conversion in case we need to export these notes later
          HTMLConverterFeature(),
        ],
      }),
      access: {
        // CRITICAL: This ensures the data is NEVER sent to the frontend
        read: ({ req: { user } }) => Boolean(user), 
      },
      admin: {
        position: 'sidebar', // Keeps the main layout clean for contact data
        description: 'Internal notes for lead follow-up. Not visible to the patient.',
      },
    },
    {
      name: 'lastResponseSentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Last manual response sent from the backend.',
      },
    },
    {
      name: 'name', 
      type: 'text',
      required: true,
      label: 'Patient Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          // RELATIONSHIP 1: The Specialist
          name: 'doctor',
          type: 'relationship',
          relationTo: 'doctors',
          required: true,
          admin: { width: '50%' }
        },
        {
          // RELATIONSHIP 2: The Treatment (NEW)
          name: 'procedure',
          type: 'relationship',
          relationTo: 'procedures',
          required: false,
          admin: { width: '50%' }
        },
      ]
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Patient Notes'
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Response Center',
          fields: [
            {
              name: 'responseTemplate',
              type: 'select',
              defaultValue: 'request_medical_records',
              options: [
                {
                  label: 'Request medical records upload',
                  value: 'request_medical_records',
                },
                {
                  label: 'Consultation next steps',
                  value: 'consultation_next_steps',
                },
                {
                  label: 'General follow-up',
                  value: 'general_follow_up',
                },
              ],
              admin: {
                description: 'Choose the email template to send to the patient.',
              },
            },
            {
              name: 'responseSubject',
              type: 'text',
              admin: {
                description: 'Optional. Leave empty to use the template subject.',
              },
            },
            {
              name: 'responseMessage',
              type: 'textarea',
              admin: {
                rows: 6,
                description: 'Optional custom message added to the selected template.',
              },
            },
            {
              name: 'sendResponseNow',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Check this box and save the lead to email the selected response to the patient.',
              },
            },
          ],
        },
        {
          label: 'Uploaded Files',
          fields: [
            {
              name: 'patientFilesViewer',
              type: 'ui',
              admin: {
                components: {
                  Field: 'src/app/components/admin/LeadFilesViewer#LeadFilesViewer',
                },
              },
            },
            {
              name: 'uploadedFiles',
              type: 'relationship',
              relationTo: 'lead-files',
              hasMany: true,
              admin: {
                description: 'Files uploaded by the patient through the secure folio link.',
              },
            },
          ],
        },
        {
          label: 'Communication History',
          fields: [
            {
              name: 'communicationHistory',
              type: 'array',
              admin: {
                readOnly: true,
                description: 'Audit trail for patient contact, file uploads and internal follow-up events.',
              },
              fields: [
                {
                  name: 'direction',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Inbound', value: 'inbound' },
                    { label: 'Outbound', value: 'outbound' },
                    { label: 'Internal', value: 'internal' },
                  ],
                },
                {
                  name: 'eventType',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Lead created', value: 'lead_created' },
                    { label: 'Email sent', value: 'email_sent' },
                    { label: 'Email failed', value: 'email_failed' },
                    { label: 'File uploaded', value: 'file_uploaded' },
                    { label: 'Internal note', value: 'internal_note' },
                  ],
                },
                {
                  name: 'template',
                  type: 'text',
                },
                {
                  name: 'subject',
                  type: 'text',
                },
                {
                  name: 'message',
                  type: 'textarea',
                },
                {
                  name: 'file',
                  type: 'relationship',
                  relationTo: 'lead-files',
                },
                {
                  name: 'occurredAt',
                  type: 'date',
                  required: true,
                },
                {
                  name: 'createdBy',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  timestamps: true, // Auto-generates createdAt for funnel tracking
  
}

export default Leads

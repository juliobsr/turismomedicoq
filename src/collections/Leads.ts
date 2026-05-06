// src/collections/Leads.ts
import type { 
  CollectionConfig, 
  CollectionBeforeChangeHook, 
  CollectionAfterChangeHook 
} from 'payload'
import { notifyLeadCreation } from '../hooks/notifyLeadCreation';
import crypto from 'crypto'
import {
  lexicalEditor,
  HTMLConverterFeature,
  lexicalHTML,
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
    group: 'Medical Directory',
    defaultColumns: ['folio', 'name','doctor','procedure', 'status', 'createdAt'],
  },
  
  // 2. SECURITY: Hardened access control for Medical PII
  access: {
    // Anyone (Next.js public forms) can create a lead
    create: () => true,
    // ONLY authenticated clinical staff/admins can read the leads
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },

  hooks: {
    beforeChange: [generateSecureFolio],
    afterChange: [notifyLeadCreation],
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
  ],
  timestamps: true, // Auto-generates createdAt for funnel tracking
  
}

export default Leads
// src/collections/Leads.ts
import type { 
  CollectionConfig, 
  CollectionBeforeChangeHook, 
  CollectionAfterChangeHook 
} from 'payload'
import crypto from 'crypto'

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

const sendNotificationEmails: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation === 'create') {
    const lead = doc as LeadDocument; // Type assertion for strict TS

    try {
      // 1. Internal Staff Notification
      await req.payload.sendEmail({
        to: process.env.ADMIN_EMAIL || 'jcvaldez@outlook.com', 
        from: 'onboarding@resend.dev',
        subject: `[ACTION REQUIRED] New Patient Inquiry: ${lead.name} - Folio: ${lead.folio}`,
        html: `
          <div style="font-family: sans-serif;">
            <h2>New Patient Lead Alert</h2>
            <p>A new request has been submitted. Please review the admin panel.</p>
            <ul>
              <li><strong>Patient:</strong> ${lead.name}</li>
              <li><strong>Folio:</strong> ${lead.folio}</li>
              <li><strong>Contact:</strong> ${lead.phone} | ${lead.email}</li>
            </ul>
          </div>
        `,
      });

      // 2. Patient Confirmation (Fixed dynamic email routing)
      await req.payload.sendEmail({
        to: lead.email, // DYNAMIC: Sends directly to the patient's submitted email
        from: 'Queretaro Medical <onboarding@resend.dev>',
        subject: `We've received your request - Folio: ${lead.folio}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #2563eb;">Queretaro Medical</h2>
            <p>Dear <strong>${lead.name}</strong>,</p>
            <p>Thank you for reaching out to us. We have successfully received your consultation request.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">YOUR TRACKING FOLIO</p>
              <h3 style="margin: 5px 0; color: #1e293b; font-size: 24px; letter-spacing: 2px;">${lead.folio}</h3>
            </div>
            <p>Our medical coordinator will contact you shortly via phone or email to finalize the details of your appointment.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 12px; color: #94a3b8;">
              This is an automated message, please do not reply directly to this email.
            </p>
          </div>
        `,
      });

      req.payload.logger.info(`Successfully dispatched notification emails for Lead Folio: ${lead.folio}`);
    } catch (error) {
      // Avoid breaking the API response if the email provider (Resend) fails
      req.payload.logger.error(`Critical error sending emails for Lead ${lead.folio}:`, error);
    }
  }
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
    defaultColumns: ['folio', 'name', 'status', 'createdAt'],
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
    afterChange: [sendNotificationEmails],
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
      // RELATIONSHIP: Links the patient inquiry directly to the target Specialist
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  timestamps: true, // Auto-generates createdAt for funnel tracking
}

export default Leads
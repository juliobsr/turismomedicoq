// src/collections/Leads.ts
import type { CollectionConfig } from 'payload'

const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    // 1. Este valor DEBE existir abajo en la lista de fields
    useAsTitle: 'name', 
    group: 'Medical Directory',
    defaultColumns: ['name', 'doctor', 'status'],
  },
  access: {
    create: () => true,
    read: () => true,
  },
 
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Generamos un folio aleatorio si es un registro nuevo
        // Ejemplo: QM-7823
        if (operation === 'create') {
          const randomDigits = Math.floor(1000 + Math.random() * 9000);
          return {
            ...data,
            folio: `QM-${randomDigits}`,
          };
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation === 'create') {
          try {
            // 1. Correo para el STAFF (Admin)
            await req.payload.sendEmail({
              to: 'jcvaldez@outlook.com', // Tu correo de pruebas
              from: 'onboarding@resend.dev',
              subject: `[New Lead] ${doc.name} - Folio: ${doc.folio}`,
              html: `<h2>New Patient Inquiry</h2><p>Check the admin panel for Folio: <b>${doc.folio}</b></p>`,
            });
  
            // 2. Correo para el PACIENTE (Confirmación)
            await req.payload.sendEmail({
              to: 'jcvaldez@outlook.com', // Correo que el paciente puso en el formulario
              from: 'Queretaro Medical <onboarding@resend.dev>',
              subject: `We've received your request - Folio: ${doc.folio}`,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
                  <h2 style="color: #2563eb;">Queretaro Medical</h2>
                  <p>Dear <strong>${doc.name}</strong>,</p>
                  <p>Thank you for reaching out to us. We have successfully received your consultation request.</p>
                  <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 14px;">YOUR TRACKING FOLIO</p>
                    <h3 style="margin: 5px 0; color: #1e293b; font-size: 24px; letter-spacing: 2px;">${doc.folio}</h3>
                  </div>
                  <p>Our medical coordinator will contact you shortly via phone or email to finalize the details of your appointment.</p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                  <p style="font-size: 12px; color: #94a3b8;">
                    This is an automated message, please do not reply directly to this email.
                  </p>
                </div>
              `,
            });
  
            console.log(`Emails sent for Folio: ${doc.folio}`);
          } catch (error) {
            console.error('Error sending emails:', error);
          }
        }
      },
    ],
  },
  fields: [
    {
      name: 'name', // 2. Verifica que este sea EXACTAMENTE 'name'
      type: 'text',
      required: true,
      label: 'Patient Name',
    },
    {
        name: 'folio',
        type: 'text',
        admin: {
          position: 'sidebar', // Lo ponemos a un lado en el admin
          readOnly: true,
        },
        label: 'Case Folio',
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
      name: 'doctor',
      type: 'relationship',
      relationTo: 'doctors',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    
  ],
}

export default Leads
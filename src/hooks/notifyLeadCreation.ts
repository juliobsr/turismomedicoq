// src/hooks/notifyLeadCreation.ts
import { CollectionAfterChangeHook } from 'payload'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'

/**
 * Enterprise Notification Hook
 * Optimized for Resend Sandbox and production environments.
 */
export const notifyLeadCreation: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return;

  const { payload } = req;
  // Logic: Ensure we have a fallback if folio or name are missing in the doc object
  const patientName = doc.name || 'Value Patient';
  const caseFolio = doc.folio || 'N/A';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_SERVER_URL ||
    'http://localhost:3000';
  const adminLeadUrl = `${siteUrl.replace(/\/$/, '')}/admin/collections/leads/${doc.id}`;

  const emailSettings = await getEmailDeliverySettings(payload);
  const from = formatFromAddress(emailSettings);

  try {
    payload.logger.info(`[Email Dispatch] Sending lead creation emails for Folio: ${caseFolio} from ${from}`);

    // 1. Patient Confirmation
    const patientResult = await payload.sendEmail({
      from,
      to: doc.email,
      replyTo: emailSettings.replyTo,
      subject: `Inquiry Received - Folio: ${caseFolio}`,
      html: `<h2>Hello ${patientName}</h2><p>Your request is being processed.</p>`,
    });

    // 2. Admin Alert
    if (emailSettings.adminEmail) {
      const adminResult = await payload.sendEmail({
        from,
        to: emailSettings.adminEmail,
        replyTo: doc.email,
        subject: `[NEW CONSULTATION] ${caseFolio} - ${patientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h2>New patient consultation</h2>
            <p>A new lead was created in the backend.</p>
            <ul>
              <li><strong>Folio:</strong> ${caseFolio}</li>
              <li><strong>Patient:</strong> ${patientName}</li>
              <li><strong>Email:</strong> ${doc.email}</li>
              <li><strong>Phone:</strong> ${doc.phone}</li>
              <li><strong>Status:</strong> ${doc.status || 'new'}</li>
            </ul>
            ${doc.notes ? `<p><strong>Patient notes:</strong><br />${doc.notes}</p>` : ''}
            <p>
              <a href="${adminLeadUrl}" style="display: inline-block; background: #1d4ed8; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
                Open lead in backend
              </a>
            </p>
          </div>
        `,
      });

      payload.logger.info(
        `[Resend Success] Lead ${caseFolio}. Patient message: ${JSON.stringify(patientResult)}. Admin message: ${JSON.stringify(adminResult)}`,
      );
    } else {
      payload.logger.warn(`[Lead Notification] No admin notification email configured for Folio: ${caseFolio}`);
      payload.logger.info(`[Resend Success] Lead ${caseFolio}. Patient message: ${JSON.stringify(patientResult)}.`);
    }
  } catch (error: any) {
    payload.logger.error(`[Resend Failure] Critical Error: ${error.message}`);
  }
}

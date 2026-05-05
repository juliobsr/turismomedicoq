// src/hooks/notifyLeadCreation.ts
import { CollectionAfterChangeHook } from 'payload'

/**
 * Enterprise Notification Hook
 * Optimized for Resend Sandbox and production environments.
 */
export const notifyLeadCreation: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req: { payload },
}) => {
  if (operation !== 'create') return;

  // Logic: Ensure we have a fallback if folio or name are missing in the doc object
  const patientName = doc.name || 'Value Patient';
  const caseFolio = doc.folio || 'N/A';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;

  try {
    payload.logger.info(`[Email Dispatch] Initiating Resend transport for Folio: ${caseFolio}`);

    // 1. Patient Confirmation
    await payload.sendEmail({
      to: doc.email,
      subject: `Inquiry Received - Folio: ${caseFolio}`,
      html: `<h2>Hello ${patientName}</h2><p>Your request is being processed.</p>`,
    });

    // 2. Admin Alert
    if (adminEmail) {
      await payload.sendEmail({
        to: adminEmail,
        subject: `[NEW LEAD] ${caseFolio} - ${doc.email}`,
        html: `<p>New inquiry from ${patientName} (${doc.email}).</p>`,
      });
    }

    payload.logger.info(`[Resend Success] Emails dispatched to ${doc.email} and ${adminEmail}`);
  } catch (error: any) {
    payload.logger.error(`[Resend Failure] Critical Error: ${error.message}`);
  }
}
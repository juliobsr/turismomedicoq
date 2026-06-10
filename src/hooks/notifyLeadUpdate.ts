import type { CollectionAfterChangeHook } from 'payload'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'
import { getLeadEmailContext, leadContextHtml, leadContextPlainText } from '@/lib/leadEmailContext'
import { getSiteUrl } from '@/lib/siteUrl'

const ignoredFields = new Set([
  'updatedAt',
  'createdAt',
  'communicationHistory',
  'lastResponseSentAt',
])

const changedFieldNames = (doc: Record<string, unknown>, previousDoc?: Record<string, unknown>) => {
  if (!previousDoc) return []

  return Object.keys(doc)
    .filter((key) => !ignoredFields.has(key))
    .filter((key) => JSON.stringify(doc[key]) !== JSON.stringify(previousDoc[key]))
}

export const notifyLeadUpdate: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'update') return doc
  if (context?.skipLeadUpdateNotification) return doc

  const changedFields = changedFieldNames(doc, previousDoc)

  if (!changedFields.length) return doc

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in this environment.')
    }

    const emailSettings = await getEmailDeliverySettings(req.payload)

    if (!emailSettings.adminEmail) {
      req.payload.logger.warn(`[Lead Update] No admin notification email configured for lead ${doc.folio || doc.id}`)
      return doc
    }

    const from = formatFromAddress(emailSettings)
    const leadContext = await getLeadEmailContext(req.payload, doc.id)
    const adminLeadUrl = `${getSiteUrl()}/admin/collections/leads/${doc.id}`
    const contextText = leadContextPlainText(leadContext)
    const contextHtml = leadContextHtml(leadContext)
    const changedText = changedFields.join(', ')

    await req.payload.sendEmail({
      from,
      to: emailSettings.adminEmail,
      subject: `[LEAD UPDATED] ${doc.folio || doc.id} - ${doc.name || 'Patient'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2>Lead updated</h2>
          <p>A patient lead was updated in the backend.</p>
          <ul>
            <li><strong>Folio:</strong> ${doc.folio || doc.id}</li>
            <li><strong>Patient:</strong> ${doc.name || 'Patient'}</li>
            <li><strong>Email:</strong> ${doc.email || 'N/A'}</li>
            <li><strong>Phone:</strong> ${doc.phone || 'N/A'}</li>
            <li><strong>Status:</strong> ${doc.status || 'N/A'}</li>
            <li><strong>Changed fields:</strong> ${changedText}</li>
          </ul>
          ${contextHtml}
          <p>
            <a href="${adminLeadUrl}" style="display: inline-block; background: ${emailSettings.primaryColor}; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
              Open lead in backend
            </a>
          </p>
        </div>
      `,
      text: [
        'Lead updated',
        `Folio: ${doc.folio || doc.id}`,
        `Patient: ${doc.name || 'Patient'}`,
        `Email: ${doc.email || 'N/A'}`,
        `Phone: ${doc.phone || 'N/A'}`,
        `Status: ${doc.status || 'N/A'}`,
        `Changed fields: ${changedText}`,
        contextText,
        `Open lead: ${adminLeadUrl}`,
      ].filter(Boolean).join('\n'),
      headers: {
        'X-Lead-Folio': doc.folio || String(doc.id),
      },
    })
  } catch (error: any) {
    req.payload.logger.error(`[Lead Update] Notification failed for lead ${doc.folio || doc.id}: ${error.message}`)
  }

  return doc
}

import type { CollectionAfterChangeHook } from 'payload'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'
import { getLeadEmailContext, leadContextHtml, leadContextPlainText } from '@/lib/leadEmailContext'
import { getSiteUrl } from '@/lib/siteUrl'

const absoluteUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getSiteUrl()}${url.startsWith('/') ? url : `/${url}`}`
}

export const notifyLeadFileUpload: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in this environment.')
    }

    const emailSettings = await getEmailDeliverySettings(req.payload)

    if (!emailSettings.adminEmail) {
      req.payload.logger.warn(`[Lead File Upload] No admin notification email configured for file ${doc.id}`)
      return doc
    }

    const leadId = typeof doc.lead === 'object' ? doc.lead?.id : doc.lead

    if (!leadId) {
      req.payload.logger.warn(`[Lead File Upload] File ${doc.id} has no related lead.`)
      return doc
    }

    const lead = await req.payload.findByID({
      collection: 'leads',
      id: leadId,
      depth: 0,
    })
    const leadContext = await getLeadEmailContext(req.payload, leadId)
    const contextText = leadContextPlainText(leadContext)
    const contextHtml = leadContextHtml(leadContext)
    const from = formatFromAddress(emailSettings)
    const adminLeadUrl = `${getSiteUrl()}/admin/collections/leads/${leadId}`
    const fileUrl = absoluteUrl(doc.url)

    await req.payload.sendEmail({
      from,
      to: emailSettings.adminEmail,
      subject: `[NEW MEDICAL FILE] ${lead.folio || leadId} - ${doc.originalName || doc.filename || 'Uploaded file'}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2>New patient file uploaded</h2>
          <p>A patient uploaded a new medical file through the secure upload page.</p>
          <ul>
            <li><strong>Folio:</strong> ${lead.folio || leadId}</li>
            <li><strong>Patient:</strong> ${lead.name || 'Patient'}</li>
            <li><strong>File:</strong> ${doc.originalName || doc.filename || 'Uploaded file'}</li>
            <li><strong>Type:</strong> ${doc.mimeType || 'N/A'}</li>
          </ul>
          ${contextHtml}
          ${doc.patientNote ? `<p><strong>Patient note:</strong><br />${doc.patientNote}</p>` : ''}
          <p>
            <a href="${adminLeadUrl}" style="display: inline-block; background: ${emailSettings.primaryColor}; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
              Open lead in backend
            </a>
          </p>
          ${fileUrl ? `<p><a href="${fileUrl}" style="color: ${emailSettings.primaryColor};">Open uploaded file</a></p>` : ''}
        </div>
      `,
      text: [
        'New patient file uploaded',
        `Folio: ${lead.folio || leadId}`,
        `Patient: ${lead.name || 'Patient'}`,
        `File: ${doc.originalName || doc.filename || 'Uploaded file'}`,
        `Type: ${doc.mimeType || 'N/A'}`,
        contextText,
        doc.patientNote ? `Patient note: ${doc.patientNote}` : '',
        `Open lead: ${adminLeadUrl}`,
        fileUrl ? `Open file: ${fileUrl}` : '',
      ].filter(Boolean).join('\n'),
      headers: {
        'X-Lead-Folio': lead.folio || String(leadId),
      },
    })
  } catch (error: any) {
    req.payload.logger.error(`[Lead File Upload] Notification failed for file ${doc.id}: ${error.message}`)
  }

  return doc
}

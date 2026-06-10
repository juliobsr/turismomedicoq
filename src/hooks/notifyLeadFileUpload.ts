import type { CollectionAfterChangeHook, Payload } from 'payload'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'
import { getLeadEmailContext, leadContextHtml, leadContextPlainText } from '@/lib/leadEmailContext'
import { getSiteUrl } from '@/lib/siteUrl'

const absoluteUrl = (url?: string | null) => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${getSiteUrl()}${url.startsWith('/') ? url : `/${url}`}`
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

type UploadedLeadFile = {
  id?: string | number
  lead?: any
  originalName?: string | null
  patientNote?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
}

export const sendLeadFilesUploadNotification = async ({
  payload,
  leadId,
  files,
}: {
  payload: Payload
  leadId: string | number
  files: UploadedLeadFile[]
}) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in this environment.')
    }

    const emailSettings = await getEmailDeliverySettings(payload)

    if (!emailSettings.adminEmail) {
      payload.logger.warn(`[Lead File Upload] No admin notification email configured for lead ${leadId}`)
      return
    }

    const lead = await payload.findByID({
      collection: 'leads',
      id: leadId,
      depth: 0,
    })
    const leadContext = await getLeadEmailContext(payload, leadId)
    const contextText = leadContextPlainText(leadContext)
    const contextHtml = leadContextHtml(leadContext)
    const from = formatFromAddress(emailSettings)
    const adminLeadUrl = `${getSiteUrl()}/admin/collections/leads/${leadId}`
    const fileRows = files.map((file) => {
      const fileName = file.originalName || file.filename || 'Uploaded file'
      const fileUrl = absoluteUrl(file.url)

      return {
        fileName,
        fileUrl,
        mimeType: file.mimeType || 'N/A',
        patientNote: file.patientNote,
      }
    })
    const fileListHtml = fileRows
      .map((file) => `
        <li>
          <strong>${escapeHtml(file.fileName)}</strong>
          <br />
          <span>Type: ${escapeHtml(file.mimeType)}</span>
          ${file.fileUrl ? `<br /><a href="${file.fileUrl}" style="color: ${emailSettings.primaryColor};">Open uploaded file</a>` : ''}
        </li>
      `)
      .join('')
    const patientNotes = [...new Set(fileRows.map((file) => file.patientNote).filter(Boolean))]

    await payload.sendEmail({
      from,
      to: emailSettings.adminEmail,
      subject:
        files.length === 1
          ? `[NEW MEDICAL FILE] ${lead.folio || leadId} - ${fileRows[0]?.fileName || 'Uploaded file'}`
          : `[NEW MEDICAL FILES] ${lead.folio || leadId} - ${files.length} files uploaded`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
          <h2>${files.length === 1 ? 'New patient file uploaded' : 'New patient files uploaded'}</h2>
          <p>A patient uploaded ${files.length === 1 ? 'a new medical file' : `${files.length} new medical files`} through the secure upload page.</p>
          <ul>
            <li><strong>Folio:</strong> ${escapeHtml(String(lead.folio || leadId))}</li>
            <li><strong>Patient:</strong> ${escapeHtml(lead.name || 'Patient')}</li>
          </ul>
          ${contextHtml}
          <h3>Uploaded files</h3>
          <ol>${fileListHtml}</ol>
          ${patientNotes.length ? `<p><strong>Patient note:</strong><br />${patientNotes.map((note) => escapeHtml(String(note))).join('<br />')}</p>` : ''}
          <p>
            <a href="${adminLeadUrl}" style="display: inline-block; background: ${emailSettings.primaryColor}; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
              Open lead in backend
            </a>
          </p>
        </div>
      `,
      text: [
        files.length === 1 ? 'New patient file uploaded' : 'New patient files uploaded',
        `Folio: ${lead.folio || leadId}`,
        `Patient: ${lead.name || 'Patient'}`,
        `Files: ${files.length}`,
        contextText,
        '',
        ...fileRows.flatMap((file, index) => [
          `${index + 1}. ${file.fileName}`,
          `Type: ${file.mimeType}`,
          file.fileUrl ? `Open file: ${file.fileUrl}` : '',
        ]),
        patientNotes.length ? `Patient note: ${patientNotes.join('\n')}` : '',
        `Open lead: ${adminLeadUrl}`,
      ].filter(Boolean).join('\n'),
      headers: {
        'X-Lead-Folio': lead.folio || String(leadId),
      },
    })
  } catch (error: any) {
    payload.logger.error(`[Lead File Upload] Notification failed for lead ${leadId}: ${error.message}`)
  }
}

export const notifyLeadFileUpload: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create') return doc
  if (context?.skipLeadFileNotification) return doc

  const leadId = typeof doc.lead === 'object' ? doc.lead?.id : doc.lead

  if (!leadId) {
    req.payload.logger.warn(`[Lead File Upload] File ${doc.id} has no related lead.`)
    return doc
  }

  await sendLeadFilesUploadNotification({
    payload: req.payload,
    leadId,
    files: [doc],
  })

  return doc
}

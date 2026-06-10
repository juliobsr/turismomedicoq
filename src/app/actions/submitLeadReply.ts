'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'
import { getSiteUrl } from '@/lib/siteUrl'
import { getLeadEmailContext, leadContextHtml, leadContextPlainText } from '@/lib/leadEmailContext'

const leadReplySchema = z.object({
  folio: z.string().min(4),
  patientName: z.string().min(2, 'Please enter your name.').max(120),
  patientEmail: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Please write a little more detail.').max(2500),
})

export type SubmitLeadReplyState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

export async function submitLeadReplyAction(
  _prevState: SubmitLeadReplyState | null,
  formData: FormData,
): Promise<SubmitLeadReplyState> {
  const parsed = leadReplySchema.safeParse({
    folio: formData.get('folio'),
    patientName: formData.get('patientName'),
    patientEmail: formData.get('patientEmail'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Please check the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'leads',
      depth: 0,
      limit: 1,
      where: {
        folio: { equals: parsed.data.folio },
      },
    })

    const lead = result.docs[0]

    if (!lead) {
      return {
        success: false,
        message: 'We could not find this case folio. Please contact your coordinator.',
      }
    }

    const communicationHistory = Array.isArray(lead.communicationHistory)
      ? lead.communicationHistory
      : []
    const subject = `Patient reply - ${lead.folio}`
    const adminLeadUrl = `${getSiteUrl()}/admin/collections/leads/${lead.id}`
    const leadContext = await getLeadEmailContext(payload, lead.id)

    await payload.update({
      collection: 'leads',
      id: lead.id,
      data: {
        status: 'contacted',
        communicationHistory: [
          ...communicationHistory,
          {
            direction: 'inbound',
            eventType: 'internal_note',
            subject,
            message: [
              `From: ${parsed.data.patientName} <${parsed.data.patientEmail}>`,
              '',
              parsed.data.message,
            ].join('\n'),
            occurredAt: new Date().toISOString(),
            createdBy: parsed.data.patientEmail,
          },
        ],
      },
      context: {
        skipLeadResponse: true,
        skipLeadUpdateNotification: true,
      },
    })

    const emailSettings = await getEmailDeliverySettings(payload)

    if (emailSettings.adminEmail && process.env.RESEND_API_KEY) {
      try {
        const contextHtml = leadContextHtml(leadContext)
        const contextText = leadContextPlainText(leadContext)

        await payload.sendEmail({
          from: formatFromAddress(emailSettings),
          to: emailSettings.adminEmail,
          replyTo: parsed.data.patientEmail,
          subject: `[LEAD REPLY] ${lead.folio} - ${parsed.data.patientName}`,
          html: `
            <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
              <h2>New patient reply</h2>
              <p>A patient submitted a reply from the secure lead reply page.</p>
              <ul>
                <li><strong>Folio:</strong> ${escapeHtml(String(lead.folio || parsed.data.folio))}</li>
                <li><strong>Patient:</strong> ${escapeHtml(parsed.data.patientName)}</li>
                <li><strong>Email:</strong> ${escapeHtml(parsed.data.patientEmail)}</li>
              </ul>
              ${contextHtml}
              <p style="white-space: pre-line;">${escapeHtml(parsed.data.message)}</p>
              <p>
                <a href="${adminLeadUrl}" style="display: inline-block; background: #1d4ed8; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
                  Open lead in backend
                </a>
              </p>
            </div>
          `,
          text: [
            `New patient reply for ${lead.folio}`,
            `Patient: ${parsed.data.patientName}`,
            `Email: ${parsed.data.patientEmail}`,
            contextText,
            '',
            parsed.data.message,
            '',
            adminLeadUrl,
          ].join('\n'),
        })
      } catch (error: any) {
        payload.logger.error(`[Lead Reply] Admin notification failed for lead ${lead.folio}: ${error.message}`)
      }
    }

    return {
      success: true,
      message: 'Your message was sent securely. Your coordinator will review it shortly.',
    }
  } catch (error) {
    console.error('[LEAD REPLY ERROR]', error)
    return {
      success: false,
      message: 'We could not send your reply. Please try again or contact your coordinator directly.',
    }
  }
}

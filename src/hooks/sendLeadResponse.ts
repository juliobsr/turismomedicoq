import type { CollectionAfterChangeHook } from 'payload'
import {
  buildLeadResponseEmail,
  getLeadUploadUrl,
  type LeadResponseTemplate,
} from '@/lib/leadResponseTemplates'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'

export const sendLeadResponse: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'update') return doc
  if (context?.skipLeadResponse) return doc
  if (!doc.sendResponseNow || previousDoc?.sendResponseNow) return doc

  const template = (doc.responseTemplate || 'general_follow_up') as LeadResponseTemplate
  const caseFolio = doc.folio || `LEAD-${doc.id}`
  const uploadUrl = getLeadUploadUrl(caseFolio)
  const email = buildLeadResponseEmail(template, {
    patientName: doc.name || 'Patient',
    caseFolio,
    uploadUrl,
    customMessage: doc.responseMessage,
  })
  const subject = doc.responseSubject?.trim() || email.subject

  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured in this environment.')
    }

    const emailSettings = await getEmailDeliverySettings(req.payload)
    const from = formatFromAddress(emailSettings)
    const result = await req.payload.sendEmail({
      from,
      to: doc.email,
      replyTo: emailSettings.replyTo,
      subject,
      html: email.html,
      text: email.plainText,
    })

    const communicationHistory = Array.isArray(doc.communicationHistory)
      ? doc.communicationHistory
      : []

    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        status: 'contacted',
        sendResponseNow: false,
        lastResponseSentAt: new Date().toISOString(),
        communicationHistory: [
          ...communicationHistory,
          {
            direction: 'outbound',
            eventType: 'email_sent',
            template,
            subject,
            message: `${doc.responseMessage || email.plainText}\n\nProvider result: ${JSON.stringify(result)}`,
            occurredAt: new Date().toISOString(),
            createdBy: req.user?.email || req.user?.id || 'admin',
          },
        ],
      },
      req,
      context: {
        skipLeadResponse: true,
      },
    })

    req.payload.logger.info(`[Lead Response] Sent ${template} email for lead ${caseFolio} from ${from}. Provider result: ${JSON.stringify(result)}`)
  } catch (error: any) {
    req.payload.logger.error(`[Lead Response] Failed for lead ${caseFolio}: ${error.message}`)

    const communicationHistory = Array.isArray(doc.communicationHistory)
      ? doc.communicationHistory
      : []

    await req.payload.update({
      collection: 'leads',
      id: doc.id,
      data: {
        sendResponseNow: false,
        communicationHistory: [
          ...communicationHistory,
          {
            direction: 'internal',
            eventType: 'email_failed',
            template,
            subject,
            message: error.message,
            occurredAt: new Date().toISOString(),
            createdBy: req.user?.email || req.user?.id || 'system',
          },
        ],
      },
      req,
      context: {
        skipLeadResponse: true,
      },
    })
  }

  return doc
}

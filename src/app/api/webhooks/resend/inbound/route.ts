import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { formatFromAddress, getEmailDeliverySettings } from '@/lib/emailDeliverySettings'
import { getSiteUrl } from '@/lib/siteUrl'

type InboundEmail = {
  from?: unknown
  to?: unknown
  subject?: unknown
  text?: unknown
  html?: unknown
  headers?: unknown
}

const folioPattern = /\bQM-[A-F0-9]{6}\b/i

const stringifyValue = (value: unknown): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(stringifyValue).filter(Boolean).join(', ')
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    return String(record.email || record.address || record.text || record.name || JSON.stringify(value))
  }
  return String(value)
}

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const getField = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key]
  }
}

const normalizeInboundEmail = (payload: Record<string, unknown>): InboundEmail => {
  const data = (payload.data || payload.email || payload.message || payload) as Record<string, unknown>

  return {
    from: getField(data, ['from', 'sender', 'from_email']),
    to: getField(data, ['to', 'recipient', 'recipients', 'delivered_to', 'envelope_to']),
    subject: getField(data, ['subject']),
    text: getField(data, ['text', 'text_body', 'plain', 'plainText', 'plain_text', 'body']),
    html: getField(data, ['html', 'html_body', 'htmlBody']),
    headers: getField(data, ['headers', 'raw_headers']),
  }
}

const getWebhookEventType = (payload: Record<string, unknown>) =>
  stringifyValue(payload.type || payload.event || payload.event_type)

const isTransactionalEmailEvent = (payload: Record<string, unknown>, inboundEmail: InboundEmail) => {
  const eventType = getWebhookEventType(payload).toLowerCase()
  const hasReadableBody = Boolean(stringifyValue(inboundEmail.text) || stringifyValue(inboundEmail.html))

  if (!eventType) return !hasReadableBody

  return [
    'email.sent',
    'email.delivered',
    'email.delivery_delayed',
    'email.complained',
    'email.bounced',
    'email.failed',
    'email.opened',
    'email.clicked',
  ].includes(eventType)
}

const parseBody = async (request: NextRequest) => {
  const contentType = request.headers.get('content-type') || ''

  if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData()
    return Object.fromEntries(formData.entries())
  }

  const rawBody = await request.text()
  if (!rawBody) return {}

  try {
    return JSON.parse(rawBody)
  } catch {
    return { text: rawBody }
  }
}

const verifyWebhookSecret = (request: NextRequest) => {
  const expectedSecret = process.env.RESEND_INBOUND_WEBHOOK_SECRET

  if (!expectedSecret) {
    return process.env.NODE_ENV !== 'production'
  }

  const authorization = request.headers.get('authorization')
  const bearerToken = authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : undefined
  const headerSecret =
    request.headers.get('x-webhook-secret') ||
    request.headers.get('x-resend-webhook-secret') ||
    request.headers.get('x-inbound-webhook-secret')
  const querySecret = request.nextUrl.searchParams.get('secret')

  return [bearerToken, headerSecret, querySecret].some((value) => value === expectedSecret)
}

const extractFolio = (email: InboundEmail) => {
  const haystack = [
    stringifyValue(email.to),
    stringifyValue(email.subject),
    stringifyValue(email.text),
    stringifyValue(email.html),
    stringifyValue(email.headers),
  ].join('\n')

  return haystack.match(folioPattern)?.[0]?.toUpperCase()
}

const findLeadByFolio = async (payload: Awaited<ReturnType<typeof getPayload>>, folio: string) => {
  const result = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: 1,
    where: {
      folio: {
        equals: folio,
      },
    },
  })

  return result.docs[0]
}

const appendInternalHistory = async ({
  payload,
  lead,
  subject,
  message,
  createdBy,
}: {
  payload: Awaited<ReturnType<typeof getPayload>>
  lead: any
  subject: string
  message: string
  createdBy: string
}) => {
  const communicationHistory = Array.isArray(lead.communicationHistory)
    ? lead.communicationHistory
    : []

  await payload.update({
    collection: 'leads',
    id: lead.id,
    data: {
      communicationHistory: [
        ...communicationHistory,
        {
          direction: 'internal',
          eventType: 'internal_note',
          subject,
          message,
          occurredAt: new Date().toISOString(),
          createdBy,
        },
      ],
    },
  })
}

const summarizePayload = (payload: Record<string, unknown>, inboundEmail: InboundEmail) => {
  const data = (payload.data || payload.email || payload.message || payload) as Record<string, unknown>

  return {
    eventType: getWebhookEventType(payload) || 'unknown',
    topLevelKeys: Object.keys(payload).sort(),
    dataKeys: Object.keys(data).sort(),
    from: stringifyValue(inboundEmail.from),
    to: stringifyValue(inboundEmail.to),
    subject: stringifyValue(inboundEmail.subject),
    hasText: Boolean(stringifyValue(inboundEmail.text)),
    hasHtml: Boolean(stringifyValue(inboundEmail.html)),
  }
}

export async function POST(request: NextRequest) {
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized webhook request.' }, { status: 401 })
  }

  const body = await parseBody(request)
  const inboundEmail = normalizeInboundEmail(body as Record<string, unknown>)
  const payload = await getPayload({ config: configPromise })
  const folio = extractFolio(inboundEmail)

  if (isTransactionalEmailEvent(body as Record<string, unknown>, inboundEmail)) {
    const summary = summarizePayload(body as Record<string, unknown>, inboundEmail)
    payload.logger.info(`[Inbound Email] Ignored transactional Resend event: ${JSON.stringify(summary)}`)

    if (folio) {
      const lead = await findLeadByFolio(payload, folio)

      if (lead) {
        await appendInternalHistory({
          payload,
          lead,
          subject: `Ignored Resend event for ${folio}`,
          message: JSON.stringify(summary, null, 2),
          createdBy: 'resend webhook',
        })
      }
    }

    return NextResponse.json({ ok: true, ignored: 'transactional_email_event' }, { status: 202 })
  }

  if (!folio) {
    payload.logger.warn(`[Inbound Email] No folio found: ${JSON.stringify(summarizePayload(body as Record<string, unknown>, inboundEmail))}`)
    return NextResponse.json({ error: 'No lead folio found in inbound email.' }, { status: 422 })
  }

  const lead = await findLeadByFolio(payload, folio)

  if (!lead) {
    return NextResponse.json({ error: `Lead ${folio} was not found.` }, { status: 404 })
  }

  const communicationHistory = Array.isArray(lead.communicationHistory)
    ? lead.communicationHistory
    : []
  const subject = stringifyValue(inboundEmail.subject) || `Inbound reply for ${folio}`
  const message = [
    `From: ${stringifyValue(inboundEmail.from) || 'unknown sender'}`,
    `To: ${stringifyValue(inboundEmail.to) || 'unknown recipient'}`,
    '',
    stringifyValue(inboundEmail.text) || stringifyValue(inboundEmail.html) || 'No readable email body was provided.',
  ].join('\n')

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
          message,
          occurredAt: new Date().toISOString(),
          createdBy: stringifyValue(inboundEmail.from) || 'patient reply',
        },
      ],
    },
  })

  const emailSettings = await getEmailDeliverySettings(payload)
  const adminLeadUrl = `${getSiteUrl()}/admin/collections/leads/${lead.id}`

  if (emailSettings.adminEmail && process.env.RESEND_API_KEY) {
    try {
      const bodyText = stringifyValue(inboundEmail.text) || stringifyValue(inboundEmail.html) || 'No readable email body was provided.'

      await payload.sendEmail({
        from: formatFromAddress(emailSettings),
        to: emailSettings.adminEmail,
        replyTo: stringifyValue(inboundEmail.from) || emailSettings.replyTo,
        subject: `[LEAD REPLY] ${folio} - ${lead.name || 'Patient'}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
            <h2>New patient reply</h2>
            <p>A patient replied to a lead email.</p>
            <ul>
              <li><strong>Folio:</strong> ${escapeHtml(folio)}</li>
              <li><strong>Patient:</strong> ${escapeHtml(stringifyValue(lead.name) || 'N/A')}</li>
              <li><strong>From:</strong> ${escapeHtml(stringifyValue(inboundEmail.from) || 'unknown sender')}</li>
              <li><strong>Subject:</strong> ${escapeHtml(subject)}</li>
            </ul>
            <p style="white-space: pre-line;">${escapeHtml(bodyText)}</p>
            <p>
              <a href="${adminLeadUrl}" style="display: inline-block; background: #1d4ed8; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
                Open lead in backend
              </a>
            </p>
          </div>
        `,
        text: [
          `New patient reply for ${folio}`,
          `Patient: ${lead.name || 'N/A'}`,
          `From: ${stringifyValue(inboundEmail.from) || 'unknown sender'}`,
          `Subject: ${subject}`,
          '',
          bodyText,
          '',
          adminLeadUrl,
        ].join('\n'),
      })
    } catch (error: any) {
      payload.logger.error(`[Inbound Email] Admin notification failed for lead ${folio}: ${error.message}`)
    }
  }

  payload.logger.info(`[Inbound Email] Registered patient reply for lead ${folio}.`)

  return NextResponse.json({ ok: true, leadId: lead.id, folio })
}

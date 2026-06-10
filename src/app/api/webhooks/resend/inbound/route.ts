import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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

const getField = (record: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key]
  }
}

const normalizeInboundEmail = (payload: Record<string, unknown>): InboundEmail => {
  const data = (payload.data || payload.email || payload.message || payload) as Record<string, unknown>

  return {
    from: getField(data, ['from', 'sender']),
    to: getField(data, ['to', 'recipient', 'recipients']),
    subject: getField(data, ['subject']),
    text: getField(data, ['text', 'text_body', 'plain', 'plainText']),
    html: getField(data, ['html', 'html_body']),
    headers: getField(data, ['headers']),
  }
}

const getWebhookEventType = (payload: Record<string, unknown>) =>
  stringifyValue(payload.type || payload.event || payload.event_type)

const isTransactionalEmailEvent = (payload: Record<string, unknown>, inboundEmail: InboundEmail) => {
  const eventType = getWebhookEventType(payload).toLowerCase()
  const hasReadableBody = Boolean(stringifyValue(inboundEmail.text) || stringifyValue(inboundEmail.html))

  if (!eventType) return !hasReadableBody

  return eventType.startsWith('email.') && !eventType.includes('inbound') && !eventType.includes('received')
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

export async function POST(request: NextRequest) {
  if (!verifyWebhookSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized webhook request.' }, { status: 401 })
  }

  const body = await parseBody(request)
  const inboundEmail = normalizeInboundEmail(body as Record<string, unknown>)

  if (isTransactionalEmailEvent(body as Record<string, unknown>, inboundEmail)) {
    return NextResponse.json({ ok: true, ignored: 'transactional_email_event' }, { status: 202 })
  }

  const folio = extractFolio(inboundEmail)

  if (!folio) {
    return NextResponse.json({ error: 'No lead folio found in inbound email.' }, { status: 422 })
  }

  const payload = await getPayload({ config: configPromise })
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

  const lead = result.docs[0]

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

  payload.logger.info(`[Inbound Email] Registered patient reply for lead ${folio}.`)

  return NextResponse.json({ ok: true, leadId: lead.id, folio })
}

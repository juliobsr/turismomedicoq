import type { Payload } from 'payload'

type RelatedDoc = {
  id?: string | number
  fullName?: string | null
  name?: string | null
  slug?: string | null
}

export type LeadEmailContext = {
  doctorName?: string
  procedureName?: string
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const relatedLabel = (value: unknown, preferredKeys: Array<'fullName' | 'name'>) => {
  if (!value || typeof value !== 'object') return undefined

  const doc = value as RelatedDoc

  for (const key of preferredKeys) {
    if (doc[key]) return doc[key] || undefined
  }

  return undefined
}

export const getLeadEmailContext = async (
  payload: Payload,
  leadId: string | number,
): Promise<LeadEmailContext> => {
  try {
    const lead = await payload.findByID({
      collection: 'leads',
      id: leadId,
      depth: 1,
    })

    return {
      doctorName: relatedLabel(lead.doctor, ['fullName', 'name']),
      procedureName: relatedLabel(lead.procedure, ['name', 'fullName']),
    }
  } catch (error: any) {
    payload.logger.warn(`[Lead Email Context] Could not resolve lead ${leadId}. ${error.message}`)
    return {}
  }
}

export const leadContextPlainText = (context: LeadEmailContext) => {
  const lines = [
    context.doctorName ? `Doctor: ${context.doctorName}` : null,
    context.procedureName ? `Procedure: ${context.procedureName}` : null,
  ].filter(Boolean)

  return lines.length ? lines.join('\n') : ''
}

export const leadContextHtml = (context: LeadEmailContext) => {
  const rows = [
    context.doctorName
      ? `<p style="margin: 0 0 8px;"><strong>Doctor:</strong> ${escapeHtml(context.doctorName)}</p>`
      : '',
    context.procedureName
      ? `<p style="margin: 0;"><strong>Procedure:</strong> ${escapeHtml(context.procedureName)}</p>`
      : '',
  ].filter(Boolean)

  if (!rows.length) return ''

  return `
    <div style="margin: 22px 0; padding: 16px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155;">
      <p style="margin: 0 0 10px; color: #0f172a; font-size: 13px; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase;">Case details</p>
      ${rows.join('')}
    </div>
  `
}

import { getSiteUrl } from '@/lib/siteUrl'

export type LeadResponseTemplate = 'request_medical_records' | 'consultation_next_steps' | 'general_follow_up'

type LeadTemplateInput = {
  patientName: string
  caseFolio: string
  uploadUrl: string
  replyUrl: string
  customMessage?: string | null
}

type LeadCreationInput = {
  patientName: string
  caseFolio: string
  replyUrl: string
}

type LeadTemplateOutput = {
  subject: string
  plainText: string
  html: string
}

const brandName = 'Elite Medical Journey'

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatMultilineHtml = (value: string) => escapeHtml(value).replace(/\n/g, '<br />')

const button = (href: string, label: string, variant: 'primary' | 'reply' = 'primary') => {
  const background = variant === 'reply' ? '#f97316' : '#0ea5a3'
  const shadow = variant === 'reply' ? '0 12px 28px rgba(249, 115, 22, 0.28)' : '0 10px 24px rgba(14, 165, 163, 0.22)'
  const padding = variant === 'reply' ? '17px 28px' : '14px 22px'
  const fontSize = variant === 'reply' ? '16px' : '14px'

  return `
    <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse: separate;">
      <tr>
        <td bgcolor="${background}" style="border-radius: 999px; background: ${background}; box-shadow: ${shadow};">
          <a href="${href}" style="display: inline-block; background: ${background}; color: #ffffff; padding: ${padding}; border-radius: 999px; text-decoration: none; font-weight: 900; font-size: ${fontSize}; line-height: 1.2; letter-spacing: 0.01em;">
            ${label}
          </a>
        </td>
      </tr>
    </table>
  `
}

const replyNotice = (replyUrl: string) => `
  <div style="margin-top: 28px; padding: 24px; border-radius: 20px; background: #f0fdfa; border: 1px solid #99f6e4;">
    <p style="margin: 0 0 10px; color: #0f172a; font-size: 16px; font-weight: 900;">Please use the secure reply link</p>
    <p style="margin: 0 0 20px; color: #334155; font-size: 14px; line-height: 1.7;">
      For your privacy and information security, please respond through your secure patient page. This email reply address is not monitored.
    </p>
    ${button(replyUrl, 'Reply securely to my coordinator', 'reply')}
    <p style="margin: 18px 0 0; color: #475569; font-size: 12px; line-height: 1.55;">
      Secure reply link:<br />
      <a href="${replyUrl}" style="color: #0f766e; word-break: break-all;">${replyUrl}</a>
    </p>
  </div>
`

const caseCard = (caseFolio: string) => `
  <div style="margin-top: 22px; padding: 14px 16px; border-radius: 16px; background: #f8fafc; border: 1px solid #e2e8f0;">
    <p style="margin: 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 800;">Case folio</p>
    <p style="margin: 4px 0 0; color: #0f172a; font-size: 18px; font-weight: 900;">${escapeHtml(caseFolio)}</p>
  </div>
`

const wrapEmail = (title: string, subtitle: string, body: string) => `
  <div style="margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background: #f4f7fb;">
      <tr>
        <td align="center" style="padding: 32px 14px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 640px;">
            <tr>
              <td style="padding: 0 0 16px;">
                <table role="presentation" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <tr>
                    <td style="width: 48px; height: 48px; border-radius: 14px; background: #0ea5a3; color: #ffffff; font-size: 18px; font-weight: 900; text-align: center;">
                      EMJ
                    </td>
                    <td style="padding-left: 12px;">
                      <p style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 900; line-height: 1.2;">Elite <span style="color: #0ea5a3;">Medical Journey</span></p>
                      <p style="margin: 3px 0 0; color: #64748b; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;">Medical tourism coordination</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="overflow: hidden; border-radius: 26px; background: #ffffff; border: 1px solid #dbeafe; box-shadow: 0 24px 70px rgba(15, 23, 42, 0.10);">
                <div style="padding: 34px 32px 34px; background: #f0fdfa; border-bottom: 1px solid #99f6e4;">
                  <p style="margin: 0 0 10px; color: #0f766e; font-size: 12px; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase;">${brandName}</p>
                  <h1 style="margin: 0; color: #0f172a; font-size: 30px; line-height: 1.15; font-weight: 900;">${title}</h1>
                  <p style="margin: 12px 0 0; color: #334155; font-size: 15px; line-height: 1.6;">${subtitle}</p>
                </div>
                <div style="padding: 32px 32px 44px; color: #334155; font-size: 15px; line-height: 1.7;">
                  ${body}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding: 18px 6px 0; text-align: center;">
                <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                  ${brandName} helps patients coordinate medical care, travel logistics, and recovery support in Queretaro, Mexico.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
`

export const getLeadUploadUrl = (folio: string) => {
  return `${getSiteUrl()}/lead-upload/${encodeURIComponent(folio)}`
}

export const getLeadReplyUrl = (folio: string) => {
  return `${getSiteUrl()}/lead-reply/${encodeURIComponent(folio)}`
}

export const buildLeadCreationConfirmationEmail = (
  input: LeadCreationInput
): LeadTemplateOutput => {
  const patientName = escapeHtml(input.patientName)
  const replyUrl = escapeHtml(input.replyUrl)
  const subject = `Inquiry received - ${input.caseFolio}`
  const plainText = [
    `Hello ${input.patientName},`,
    '',
    `Thank you for contacting ${brandName}. Your request has been received and our coordination team is reviewing your information.`,
    '',
    `Secure reply link: ${input.replyUrl}`,
    'For privacy and information security, please use the secure reply link instead of replying to this email. This reply address is not monitored.',
    '',
    `Case folio: ${input.caseFolio}`,
  ].join('\n')

  return {
    subject,
    plainText,
    html: wrapEmail(
      'Your inquiry has been received',
      'Elite Medical Journey has opened your secure patient case and our coordination team is reviewing your request.',
      `
        <p style="margin: 0 0 16px;">Hello ${patientName},</p>
        <p style="margin: 0 0 18px;">Thank you for contacting ${brandName}. Your request has been received and our coordination team is reviewing your information.</p>
        <div style="margin: 22px 0; padding: 18px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0;">
          <p style="margin: 0 0 8px; color: #0f172a; font-weight: 800;">What to expect</p>
          <p style="margin: 0; color: #475569;">A bilingual medical coordinator will review your request and follow up with the next step for your consultation, medical record review, or procedure pathway.</p>
        </div>
        ${replyNotice(replyUrl)}
        ${caseCard(input.caseFolio)}
      `
    ),
  }
}

export const buildLeadResponseEmail = (
  template: LeadResponseTemplate,
  input: LeadTemplateInput
): LeadTemplateOutput => {
  const patientName = escapeHtml(input.patientName)
  const replyUrl = escapeHtml(input.replyUrl)
  const uploadUrl = escapeHtml(input.uploadUrl)
  const customBlock = input.customMessage
    ? `<div style="margin: 22px 0; padding: 18px; border-left: 4px solid #0ea5a3; background: #f8fafc; border-radius: 0 16px 16px 0; color: #334155;">${formatMultilineHtml(input.customMessage)}</div>`
    : ''

  if (template === 'request_medical_records') {
    const subject = `Medical records request - ${input.caseFolio}`
    const plainText = [
      `Hello ${input.patientName},`,
      '',
      'Thank you for contacting us. To help the medical team review your case, please upload any relevant PDF or image files from your studies, imaging reports, lab results or previous medical notes.',
      '',
      `Secure upload link: ${input.uploadUrl}`,
      `Secure reply link: ${input.replyUrl}`,
      'For privacy and information security, please use the secure reply link instead of replying to this email. This reply address is not monitored.',
      '',
      input.customMessage || '',
      '',
      `Case folio: ${input.caseFolio}`,
    ].filter(Boolean).join('\n')

    return {
      subject,
      plainText,
      html: wrapEmail(
        'Please upload your medical records',
        'Your secure file upload page helps our coordination team route your information to the right medical reviewer.',
        `
          <p style="margin: 0 0 16px;">Hello ${patientName},</p>
          <p style="margin: 0 0 18px;">Thank you for contacting ${brandName}. To help the medical team review your case, please upload any relevant PDF or image files from your studies, imaging reports, lab results, or previous medical notes.</p>
          ${customBlock}
          <div style="margin: 22px 0;">
            ${button(uploadUrl, 'Upload my medical files')}
          </div>
          <p style="margin: 0; color: #64748b; font-size: 13px;">If the button does not work, copy this link into your browser:<br /><a href="${uploadUrl}" style="color: #0f766e; word-break: break-all;">${uploadUrl}</a></p>
          ${replyNotice(replyUrl)}
          ${caseCard(input.caseFolio)}
        `
      ),
    }
  }

  if (template === 'consultation_next_steps') {
    const subject = `Next steps for your medical consultation - ${input.caseFolio}`
    const plainText = [
      `Hello ${input.patientName},`,
      '',
      'Our coordination team has received your inquiry. The next step is to review your medical background and confirm the right specialist or procedure pathway.',
      '',
      input.customMessage || '',
      `Secure reply link: ${input.replyUrl}`,
      'For privacy and information security, please use the secure reply link instead of replying to this email. This reply address is not monitored.',
      '',
      `Case folio: ${input.caseFolio}`,
    ].filter(Boolean).join('\n')

    return {
      subject,
      plainText,
      html: wrapEmail(
        'Next steps for your consultation',
        'Your care coordination pathway is moving forward with a secure, privacy-first communication channel.',
        `
          <p style="margin: 0 0 16px;">Hello ${patientName},</p>
          <p style="margin: 0 0 18px;">Our coordination team has received your inquiry. The next step is to review your medical background and confirm the right specialist or procedure pathway.</p>
          ${customBlock}
          <div style="margin: 22px 0; padding: 18px; border-radius: 18px; background: #f8fafc; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 8px; color: #0f172a; font-weight: 800;">What happens next</p>
            <p style="margin: 0; color: #475569;">We will review your information, identify the most appropriate clinical path, and follow up with clear next steps for your consultation.</p>
          </div>
          ${replyNotice(replyUrl)}
          ${caseCard(input.caseFolio)}
        `
      ),
    }
  }

  const subject = `Follow-up from your medical coordinator - ${input.caseFolio}`
  const plainText = [
    `Hello ${input.patientName},`,
    '',
    input.customMessage || 'Thank you for contacting us. A medical coordinator is following up on your request.',
    `Secure reply link: ${input.replyUrl}`,
    'For privacy and information security, please use the secure reply link instead of replying to this email. This reply address is not monitored.',
    '',
    `Case folio: ${input.caseFolio}`,
  ].join('\n')

  return {
    subject,
    plainText,
    html: wrapEmail(
      'Follow-up from your medical coordinator',
      'A dedicated coordinator from Elite Medical Journey is following up on your consultation request.',
      `
        <p style="margin: 0 0 16px;">Hello ${patientName},</p>
        ${customBlock || `<p style="margin: 0 0 18px;">Thank you for contacting ${brandName}. A medical coordinator is following up on your request.</p>`}
        ${replyNotice(replyUrl)}
        ${caseCard(input.caseFolio)}
      `
    ),
  }
}

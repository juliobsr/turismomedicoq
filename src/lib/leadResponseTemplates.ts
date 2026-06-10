import { getSiteUrl } from '@/lib/siteUrl'

export type LeadResponseTemplate = 'request_medical_records' | 'consultation_next_steps' | 'general_follow_up'

type LeadTemplateInput = {
  patientName: string
  caseFolio: string
  uploadUrl: string
  replyUrl: string
  customMessage?: string | null
}

type LeadTemplateOutput = {
  subject: string
  plainText: string
  html: string
}

const wrapEmail = (title: string, body: string) => `
  <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
    <h2 style="color: #0f172a;">${title}</h2>
    ${body}
  </div>
`

export const getLeadUploadUrl = (folio: string) => {
  return `${getSiteUrl()}/lead-upload/${encodeURIComponent(folio)}`
}

export const getLeadReplyUrl = (folio: string) => {
  return `${getSiteUrl()}/lead-reply/${encodeURIComponent(folio)}`
}

const replyButton = (replyUrl: string) => `
  <p>
    <a href="${replyUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
      Reply securely to my coordinator
    </a>
  </p>
  <p>If you prefer not to reply by email, use this secure link:<br />${replyUrl}</p>
`

export const buildLeadResponseEmail = (
  template: LeadResponseTemplate,
  input: LeadTemplateInput
): LeadTemplateOutput => {
  const customBlock = input.customMessage
    ? `<p style="white-space: pre-line;">${input.customMessage}</p>`
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
        `
          <p>Hello ${input.patientName},</p>
          <p>Thank you for contacting us. To help the medical team review your case, please upload any relevant PDF or image files from your studies, imaging reports, lab results or previous medical notes.</p>
          ${customBlock}
          <p>
            <a href="${input.uploadUrl}" style="display: inline-block; background: #1d4ed8; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: 700;">
              Upload my medical files
            </a>
          </p>
          <p>If the button does not work, copy this link into your browser:<br />${input.uploadUrl}</p>
          ${replyButton(input.replyUrl)}
          <p>Case folio: <strong>${input.caseFolio}</strong></p>
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
      '',
      `Case folio: ${input.caseFolio}`,
    ].filter(Boolean).join('\n')

    return {
      subject,
      plainText,
      html: wrapEmail(
        'Next steps for your consultation',
        `
          <p>Hello ${input.patientName},</p>
          <p>Our coordination team has received your inquiry. The next step is to review your medical background and confirm the right specialist or procedure pathway.</p>
          ${customBlock}
          ${replyButton(input.replyUrl)}
          <p>Case folio: <strong>${input.caseFolio}</strong></p>
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
    '',
    `Case folio: ${input.caseFolio}`,
  ].join('\n')

  return {
    subject,
    plainText,
    html: wrapEmail(
      'Follow-up from your medical coordinator',
      `
        <p>Hello ${input.patientName},</p>
        ${customBlock || '<p>Thank you for contacting us. A medical coordinator is following up on your request.</p>'}
        ${replyButton(input.replyUrl)}
        <p>Case folio: <strong>${input.caseFolio}</strong></p>
      `
    ),
  }
}

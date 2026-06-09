import type { Payload } from 'payload'

export type EmailDeliverySettings = {
  adminEmail?: string
  fromAddress: string
  fromName: string
  replyTo?: string
}

export const getEmailDeliverySettings = async (payload: Payload): Promise<EmailDeliverySettings> => {
  let settings: any

  try {
    settings = await payload.findGlobal({
      slug: 'site-settings',
      depth: 0,
      overrideAccess: true,
    })
  } catch (error: any) {
    payload.logger.warn(`[Email Settings] Could not load Site Settings. Falling back to env. ${error.message}`)
  }

  const contactEmail = settings?.contactEmail || process.env.EMAIL_FROM_ADDRESS
  const fromAddress =
    settings?.transactionalEmailFromAddress ||
    process.env.RESEND_SENDER_EMAIL ||
    process.env.EMAIL_FROM_ADDRESS ||
    'onboarding@resend.dev'

  return {
    adminEmail: settings?.leadNotificationEmail || contactEmail || process.env.ADMIN_NOTIFICATION_EMAIL,
    fromAddress,
    fromName:
      settings?.transactionalEmailFromName ||
      process.env.RESEND_SENDER_NAME ||
      process.env.EMAIL_FROM_NAME ||
      'Queretaro Medical',
    replyTo: contactEmail,
  }
}

export const formatFromAddress = ({ fromAddress, fromName }: Pick<EmailDeliverySettings, 'fromAddress' | 'fromName'>) =>
  `${fromName} <${fromAddress}>`

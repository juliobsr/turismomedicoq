import type { EmailDeliverySettings } from '@/lib/emailDeliverySettings'

const safeFolioForEmail = (folio: string) => folio.toLowerCase().replace(/[^a-z0-9-]/g, '')

const getDomainFromAddress = (address: string) => address.split('@')[1]?.trim()

export const buildLeadReplyToAddress = (
  folio: string,
  emailSettings: Pick<EmailDeliverySettings, 'fromAddress' | 'fromName' | 'replyTo'>,
) => {
  const configuredAddress = process.env.LEAD_REPLY_EMAIL_ADDRESS || emailSettings.replyTo || emailSettings.fromAddress
  const configuredDomain = process.env.LEAD_REPLY_EMAIL_DOMAIN || getDomainFromAddress(configuredAddress)

  if (!configuredDomain) {
    return configuredAddress
  }

  const localPart = process.env.LEAD_REPLY_EMAIL_LOCAL_PART || 'leads'

  return `${emailSettings.fromName} <${localPart}+${safeFolioForEmail(folio)}@${configuredDomain}>`
}

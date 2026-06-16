export const getSiteUrl = () => {
  const productionUrl = 'https://elitemedicaljourney.com'
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL

  if (process.env.VERCEL_ENV === 'production') {
    return productionUrl
  }

  if (configuredUrl) {
    return configuredUrl
      .replace(/^https?:\/\/www\.elitemedicaljourney\.com/i, productionUrl)
      .replace(/\/$/, '')
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL

  if (process.env.VERCEL_ENV === 'preview' && vercelUrl) {
    return `https://${vercelUrl}`.replace(/\/$/, '')
  }

  return productionUrl
}

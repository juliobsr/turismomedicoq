export const getSiteUrl = () => {
  const productionUrl = 'https://elitemedicaljourney.com'
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL

  if (configuredUrl) {
    if (process.env.VERCEL_ENV === 'production' && configuredUrl.includes('localhost')) {
      return productionUrl
    }

    return configuredUrl.replace(/\/$/, '')
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL

  if (process.env.VERCEL_ENV === 'preview' && vercelUrl) {
    return `https://${vercelUrl}`.replace(/\/$/, '')
  }

  return productionUrl
}

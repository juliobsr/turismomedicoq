export const getSiteUrl = () => {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SERVER_URL

  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, '')
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL

  if (vercelUrl) {
    return `https://${vercelUrl}`.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

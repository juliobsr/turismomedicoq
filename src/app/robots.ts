import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/siteUrl'

const siteUrl = getSiteUrl()

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/lead-reply', '/lead-upload', '/my-route'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}

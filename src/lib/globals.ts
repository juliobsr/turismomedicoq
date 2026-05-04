// src/lib/api/globals.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { SiteSetting } from '@/payload-types' // Ensure types are generated!

/**
 * Enterprise Utility: getSiteSettings
 * Purpose: Fetches the global site configuration from Payload CMS.
 * Performance: Cached globally. Invalidates only every hour or on-demand via tags.
 */
export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSetting | null> => {
    try {
      const payload = await getPayload({ config: configPromise })
      
      // Fetch the global 'site-settings' configuration
      const settings = await payload.findGlobal({
        slug: 'site-settings',
      })
      
      return settings as SiteSetting
    } catch (error) {
      console.error('[API ERROR] Failed to fetch SiteSettings:', error)
      return null
    }
  },
  ['global-site-settings'], // Unique cache key
  {
    revalidate: 3600, // ISR: Refresh every hour automatically
    tags: ['site-settings'], // Tag for Next.js On-Demand Revalidation
  }
)
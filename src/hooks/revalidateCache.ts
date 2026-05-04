// src/hooks/revalidateCache.ts
import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Enterprise Utility: Revalidate Next.js Cache
 * Purpose: A reusable Payload CMS hook to instantly purge Next.js static cache 
 * whenever database records change, ensuring absolute UI freshness without losing SSR performance.
 */
export const revalidateNavigationCache: CollectionAfterChangeHook | CollectionAfterDeleteHook = ({ 
  doc, 
  req 
}) => {
  // Purge the exact tags we defined in our unstable_cache utility (src/lib/api/navigation.ts)
  revalidateTag('global-header-specialties')
  revalidateTag('doctors')
  revalidateTag('specialties')

  // Log to the server console for easy debugging during content updates
  req.payload.logger.info('[Cache Invalidation] Successfully purged Next.js navigation tags.')

  return doc
}
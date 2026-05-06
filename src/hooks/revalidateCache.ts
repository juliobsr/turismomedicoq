import { revalidateTag } from 'next/cache';
import type { 
  CollectionAfterChangeHook, 
  CollectionAfterDeleteHook 
} from 'payload';

/**
 * Enterprise Utility: Revalidate Next.js Cache
 * Purpose: Purges Next.js static tags using the new Next.js 15+ Data Cache signature.
 * Note: The second argument is now required by the compiler in our current Next.js version.
 */
const revalidateNavigation = (req: any): void => {
  // We define the purge list to maintain DRY principle
  const tagsToPurge = [
    'global-header-specialties',
    'doctors',
    'specialties'
  ];

  tagsToPurge.forEach((tag) => {
    /**
     * 🚀 TECH LEAD FIX:
     * In the new Next.js Cache API, revalidateTag expects a 'profile' as 2nd argument.
     * We pass an empty configuration object or 'default' to satisfy the signature.
     */
    revalidateTag(tag, {}); 
  });

  req.payload.logger.info(
    `[Cache Invalidation] Successfully purged ${tagsToPurge.length} Next.js navigation tags.`
  );
};

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  revalidateNavigation(req);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  revalidateNavigation(req);
  return doc;
};
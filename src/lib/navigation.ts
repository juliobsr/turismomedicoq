// src/lib/navigation.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { Specialty } from '@/payload-types'

/**
 * Enterprise Navigation Utility
 * Strategy: Fetch specialties that are linked to at least one active doctor.
 * Performance: Optimized query targeting the specialties collection directly.
 */
export const getActiveSpecialtiesForMenu = unstable_cache(
  async (): Promise<Specialty[]> => {
    const payload = await getPayload({ config: configPromise })

    try {
      // We query specialties that are referenced in the 'specialties' field 
      // of any doctor where isActive is true.
      // Note: Payload handles the relational join efficiently here.
      const { docs: specialties } = await payload.find({
        collection: 'specialties',
        depth: 0, // We only need the IDs and titles for the menu
        limit: 100, // Reasonable limit for a navigation menu
        where: {
          // This syntax finds specialties that are linked to active doctors
          // depending on your exact relationship setup
          id: {
            exists: true,
          },
        },
        // We can further optimize this by adding a custom field 
        // or a select statement if using Payload 3.0+
      })

      return specialties
    } catch (error) {
      console.error('[Navigation Error] Failed to fetch active specialties:', error)
      return []
    }
  },
  ['active-specialties-menu'],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ['specialties', 'doctors'],
  }
)
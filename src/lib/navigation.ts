// src/lib/api/navigation.ts
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import type { Specialty } from '@/payload-types'

/**
 * Enterprise Utility: getActiveSpecialtiesForMenu
 * Purpose: Fetches and deduplicates specialties that have active doctors.
 * Performance: Wrapped in Next.js Data Cache to prevent DB hits on every page load.
 */
export const getActiveSpecialtiesForMenu = unstable_cache(
  async (): Promise<Specialty[]> => {
    const payload = await getPayload({ config: configPromise })

    // 1. Fetch all active doctors, but ONLY extract their populated specialties.
    // This is highly memory-efficient.
    const { docs: doctors } = await payload.find({
      collection: 'doctors',
      where: { isActive: { equals: true } },
      limit: 5000,
      pagination: false,
      select: { specialties: true }, // Security & RAM optimization
      depth: 1, // Populate the relation
    })

    // 2. Deduplicate using a Map
    const specialtiesMap = new Map<string, Specialty>()

    doctors.forEach((doctor) => {
      const docSpecialties = doctor.specialties as Specialty[] | undefined
      
      if (docSpecialties && Array.isArray(docSpecialties)) {
        docSpecialties.forEach((spec) => {
          if (spec && typeof spec === 'object' && spec.id) {
            // Only add if not already in the Map
            if (!specialtiesMap.has(spec.id)) {
              specialtiesMap.set(spec.id, spec)
            }
          }
        })
      }
    })

    // 3. Convert Map to Array and Sort alphabetically for better UX
    const activeSpecialties = Array.from(specialtiesMap.values()).sort((a, b) =>
      a.title.localeCompare(b.title)
    )

    return activeSpecialties
  },
  ['global-header-specialties'], // Cache key
  {
    revalidate: 3600, // ISR: Regenerate cache every 1 hour automatically
    tags: ['doctors', 'specialties'], // Tags for manual on-demand revalidation
  }
)
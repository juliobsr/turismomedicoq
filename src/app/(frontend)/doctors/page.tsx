// src/app/(frontend)/doctors/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import Link from 'next/link'
import { CardDoctor } from '@/app/components/CardDoctor'

// ============================================================================
// ENTERPRISE TYPES: Next.js 15+ strict searchParams handling
// ============================================================================
interface DoctorsDirectoryProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

// Generate dynamic metadata based on the search parameter for SEO
export async function generateMetadata({ searchParams }: DoctorsDirectoryProps): Promise<Metadata> {
  const resolvedParams = await searchParams
  const specialtySlug = typeof resolvedParams.specialty === 'string' ? resolvedParams.specialty : undefined

  let title = 'Our Medical Specialists | Queretaro Medical'
  
  if (specialtySlug) {
    // Format the slug for the title (e.g., 'plastic-surgery' -> 'Plastic Surgery')
    const formattedTitle = specialtySlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    title = `${formattedTitle} Specialists | Queretaro Medical`
  }

  return {
    title,
    description: 'Browse our directory of board-certified surgeons and medical specialists.',
  }
}

/**
 * Enterprise Page: Medical Directory (Filtered via URL Parameters)
 * Architecture: React Server Component (RSC) with Dynamic SSR.
 */
export default async function DoctorsDirectoryPage({ searchParams }: DoctorsDirectoryProps) {
  const payload = await getPayload({ config: configPromise })
  
  // 1. Resolve Next.js Search Params Promise securely
  const resolvedParams = await searchParams
  const specialtySlug = typeof resolvedParams.specialty === 'string' ? resolvedParams.specialty : undefined

  let specialtyId: string | undefined = undefined
  let specialtyTitle: string | undefined = undefined

  // 2. Step One Query: If a filter exists, securely fetch the Specialty ID
  if (specialtySlug) {
    const { docs: specs } = await payload.find({
      collection: 'specialties',
      where: { slug: { equals: specialtySlug } },
      limit: 1, // Optimize: We only need the first match
      select: { id: true, title: true }, // Memory optimization
    })

    if (specs.length > 0) {
      specialtyId = specs[0].id
      specialtyTitle = specs[0].title
    }
  }

  // 3. Step Two Query: Build the secure Where clause for Doctors
  // Using explicit typing for the Payload Where clause to prevent type errors
  const baseWhere: Record<string, any> = {
    isActive: { equals: true },
  }

  // If we found a valid specialty ID, append it to the Postgres query
  // The 'contains' operator works perfectly for 'hasMany' relationship arrays in Payload
  if (specialtyId) {
    baseWhere.specialties = { contains: specialtyId }
  } else if (specialtySlug && !specialtyId) {
    // Edge Case Protection: User typed a non-existent slug in the URL
    baseWhere.id = { equals: '00000000-0000-0000-0000-000000000000' } // Force empty result
  }

  // 4. Fetch the doctors based on the constructed conditions
  const { docs: doctors } = await payload.find({
    collection: 'doctors',
    depth: 1,
    limit: 100,
    where: baseWhere,
    sort: 'fullName',
  })

  return (
    <main className="min-h-screen bg-brand-bg py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Header Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-brand-text tracking-tight sm:text-5xl mb-4">
            {specialtyTitle ? `${specialtyTitle} Specialists` : 'Meet Our Specialists'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Every doctor in our network is board-certified and vetted for international patient care.
          </p>

          {/* Active Filter Indicator & Clear Button */}
          {specialtySlug && (
            <div className="flex items-center justify-center gap-4 animate-fade-in">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-brand-primary text-sm font-semibold border border-brand-primary/20">
                Active Filter: {specialtyTitle || 'Unknown Specialty'}
              </span>
              <Link 
                href="/doctors"
                className="text-sm font-semibold text-gray-500 hover:text-red-600 transition-colors underline underline-offset-4"
              >
                Clear Filter
              </Link>
            </div>
          )}
        </header>

        {/* Directory Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-text">No specialists found</h2>
            <p className="mt-2 text-gray-500 mb-6">
              {specialtySlug 
                ? `We currently don't have active doctors listed for this specialty.` 
                : `We are currently updating our medical directory.`}
            </p>
            {specialtySlug && (
              <Link 
                href="/doctors"
                className="inline-block bg-brand-primary text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-all shadow-sm"
              >
                View All Doctors
              </Link>
            )}
          </div>
        ) : (
          <section 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            aria-label="Medical Specialists Directory"
          >
            {doctors.map((doctor) => (
              <CardDoctor key={doctor.id} doctor={doctor} />
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
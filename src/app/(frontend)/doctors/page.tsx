// src/app/(frontend)/doctors/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata } from 'next'
import Link from 'next/link'

import { getActiveSpecialtiesForMenu } from '@/lib/navigation'
import { SpecialtyFilter } from '@/app/components/Directory/SpecialtyFilter'
import { CardDoctor } from '@/app/components/CardDoctor'

// ✅ 1. Import our cached global settings utility
import { getSiteSettings } from '@/lib/globals'

interface DoctorsDirectoryProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


// ============================================================================
// DYNAMIC SEO METADATA (ENTERPRISE GRADE)
// ============================================================================
export async function generateMetadata({ searchParams }: DoctorsDirectoryProps): Promise<Metadata> {
  const resolvedParams = await searchParams
  const specialtySlug = typeof resolvedParams.specialty === 'string' ? resolvedParams.specialty : undefined

  // ✅ Fetch globals for SEO. (Cached instantly, 0ms overhead)
  const settings = await getSiteSettings()
  const companyName = settings?.companyName || 'Medical Directory'

  // Default SEO setup
  let title = `Our Medical Specialists `
  let description = `Browse the comprehensive directory of board-certified surgeons and medical specialists at ${companyName}.`
  const canonicalUrl = '/doctors'

  // Dynamic SEO when a specialty filter is applied
  if (specialtySlug) {
    const formattedTitle = specialtySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      
    title = `${formattedTitle} Specialists | ${companyName}`
    description = `Find the top-rated ${formattedTitle} specialists and board-certified doctors at ${companyName}. Secure your consultation today.`
  }

  return {
    title,
    description,
    // 🚀 ALERTS GOOGLE TO AVOID DUPLICATE CONTENT PENALTIES
    alternates: {
      canonical: canonicalUrl,
    },
    // 🚀 SOCIAL MEDIA SHARING CARDS
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: companyName,
      // You can also map a global fallback image from settings here
      // images: settings?.ogImage?.url ? [{ url: settings.ogImage.url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  }
}

/**
 * Enterprise Page: Medical Directory
 * Architecture: React Server Component (RSC) with parallel data fetching.
 */
export default async function DoctorsDirectoryPage({ searchParams }: DoctorsDirectoryProps) {
  const payload = await getPayload({ config: configPromise })
  const resolvedParams = await searchParams
  const specialtySlug = typeof resolvedParams.specialty === 'string' ? resolvedParams.specialty : undefined

  let specialtyId: string | undefined = undefined
  let specialtyTitle: string | undefined = undefined

  if (specialtySlug) {
    const { docs: specs } = await payload.find({
      collection: 'specialties',
      where: { slug: { equals: specialtySlug } },
      limit: 1,
      select: { id: true, title: true },
    })

    if (specs.length > 0) {
      specialtyId = String(specs[0].id)
      specialtyTitle = specs[0].title
    }
  }

  const baseWhere: Record<string, any> = {
    isActive: { equals: true },
  }

  if (specialtyId) {
    baseWhere.specialties = { contains: specialtyId }
  } else if (specialtySlug && !specialtyId) {
    baseWhere.id = { equals: '00000000-0000-0000-0000-000000000000' } 
  }

  // ✅ 3. Add getSiteSettings to our Parallel Fetching engine
  // This guarantees all 3 distinct data sources resolve concurrently.
  const [doctorsResponse, activeSpecialties, settings] = await Promise.all([
    payload.find({
      collection: 'doctors',
      depth: 1,
      limit: 100,
      where: baseWhere,
      sort: 'fullName',
    }),
    getActiveSpecialtiesForMenu(),
    getSiteSettings() // Fetches the company name for the UI
  ])

  const doctors = doctorsResponse.docs
  const companyName = settings?.companyName 

  return (
    <main className="min-h-screen bg-brand-bg py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dynamic Header Section */}
        <header className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-brand-text tracking-tight sm:text-5xl mb-4">
            {specialtyTitle ? `${specialtyTitle} Specialists` : 'Meet Our Specialists'}
          </h1>
          
          {/* ✅ 4. Inject the dynamic company name into the UI text */}
          <p className="text-lg text-gray-600 mb-8">
            Every doctor in the <strong className="text-brand-primary">{companyName}</strong> network is board-certified and strictly vetted for international patient care.
          </p>

          <SpecialtyFilter 
            specialties={activeSpecialties} 
            currentSlug={specialtySlug} 
          />
        </header>

        {/* Directory Grid */}
        {doctors.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-semibold text-brand-text">No specialists found</h2>
            <p className="mt-2 text-gray-500 mb-6">
              {specialtySlug 
                ? `We currently don't have active doctors listed for this specialty at ${companyName}.` 
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

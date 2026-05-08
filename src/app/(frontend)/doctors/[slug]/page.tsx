// src/app/(frontend)/doctors/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SparklesIcon } from '@heroicons/react/24/outline'
import type { Doctor, MedicalAsset, Specialty, Procedure, Facility } from '@/payload-types'

// Services & Context
import { getSiteSettings } from '@/lib/globals'

// Core Components
import { LexicalRenderer } from '@/app/components/LexicalRenderer'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'
import DoctorGallery from '@/app/components/DoctorsGallery'

interface DoctorProfileProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // ISR: Re-generate page every hour

// ============================================================================
// SSG: STATIC PATH GENERATION
// Pre-builds all doctor routes at compile time for 0ms TTFB.
// ============================================================================
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'doctors',
    limit: 1000,
    where: { 
      isActive: { equals: true },
      slug: { exists: true },
    },
    select: { slug: true },
  })

  return docs
    .filter((doc) => typeof doc.slug === 'string' && doc.slug.trim() !== '')
    .map((doc) => ({
      slug: String(doc.slug),
    }))
}

// ============================================================================
// DYNAMIC SEO METADATA
// ============================================================================
export async function generateMetadata({ params }: DoctorProfileProps): Promise<Metadata> {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })
  
  // 🚀 PERFORMANCE: Fetch globals and doctor concurrently
  const [settings, { docs }] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'doctors',
      where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
      depth: 1, // Depth 1 to fetch Image URLs
    })
  ])

  const doctor = docs[0] as Doctor | undefined
  if (!doctor) return {}

  const companyName = settings?.companyName || 'Queretaro Medical'
  const primaryImage = (doctor.profilePicture as MedicalAsset)?.url || (doctor.officeGallery?.[0] as MedicalAsset)?.url
  
  // SEO Safe Fallback Title
  const pageTitle = doctor.metaTitle 
  ? `${doctor.metaTitle} | ${doctor.fullName}` 
  : doctor.fullName;

  return {
    title: pageTitle,
    description: doctor.metaDescription || `View the medical profile of ${doctor.fullName}. Specialist in Queretaro.`,
    alternates: {
      canonical: `/doctors/${resolvedParams.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description: doctor.metaDescription || `Medical profile of ${doctor.fullName}`,
      type: 'profile',
      images: primaryImage ? [{ url: primaryImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      images: primaryImage ? [primaryImage] : [],
    }
  }
}

// ============================================================================
// SERVER COMPONENT: DOCTOR PROFILE
// ============================================================================
export default async function DoctorProfilePage({ params }: DoctorProfileProps) {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })

  // 🚀 PERFORMANCE: Parallel fetching for layout data and global settings
  const [settings, { docs }] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'doctors',
      where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
      depth: 2, 
    })
  ])

  const doctor = docs[0] as Doctor | undefined
  if (!doctor) notFound()

  // Branding Colors
  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a' // default: bg-blue-900

  // Relationship extraction
  const profilePicture = doctor.profilePicture as MedicalAsset | undefined
  const specialties = doctor.specialties as Specialty[] | undefined
  const proceduresRaw = doctor.procedures as Procedure[] | undefined
  const facilities = doctor.facilities as Facility[] | undefined
  const showForbesBadge = doctor.slug === 'dr-jose-larrinua'

  // 🚀 DEFENSIVE PROGRAMMING: Safely extract procedures for the Lead Form
  // Prevents 'Cannot read properties of undefined (reading 'map')'
  const availableProcedures = Array.isArray(proceduresRaw)
    ? proceduresRaw
        .map((p) => {
          // Type Guard: Ensure 'p' is a populated object and not just an ID string
          if (typeof p === 'object' && p !== null && 'id' in p && 'name' in p) {
            return { id: String(p.id), name: String(p.name) }
          }
          return null
        })
        .filter((p): p is { id: string; name: string } => p !== null)
    : [];

  /**
   * JSON-LD: Physician Schema for Google Rich Snippets
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.fullName,
    image: profilePicture?.url || (doctor.officeGallery?.[0] as MedicalAsset)?.url,
    medicalSpecialty: specialties?.map(s => s.title).join(', '),
    description: doctor.metaDescription || `Medical specialist profile for ${doctor.fullName}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Queretaro',
      addressCountry: 'MX'
    }
  }
  const galleryImages = doctor.officeGallery 
  ? (doctor.officeGallery as any[]).filter(img => typeof img === 'object') 
  : [];
  return (
    <main className="min-h-screen bg-white">
      {/* 🚀 Injected Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section with Dynamic Branding */}
      <section style={{ backgroundColor: brandPrimaryColor }} className="text-white py-16 lg:py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0 shadow-xl bg-white/10">
            {profilePicture?.url && (
              <Image
                src={profilePicture.url}
                alt={profilePicture.alt || doctor.fullName}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{doctor.fullName}</h1>
            {doctor.metaTitle && <h2 className="text-xl text-white/80 font-medium mb-4">{doctor.metaTitle}</h2>}

            {showForbesBadge && (
              <div className="mb-5 inline-flex max-w-2xl items-center gap-3 rounded-lg bg-amber-400 px-4 py-3 text-left text-sm font-extrabold text-slate-950 shadow-lg shadow-amber-950/20">
                <SparklesIcon className="h-5 w-5 shrink-0" />
                <span>
                  Featured by Forbes Mexico as one of the country’s leading physicians in 2022.
                </span>
              </div>
            )}
            
            {specialties && specialties.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {specialties.map((spec) => (
                  <span key={spec.id} className="bg-white/20 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-semibold">
                    {spec.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">About the Specialist</h2>
          {doctor.biography ? (
            <LexicalRenderer data={doctor.biography} />
          ) : (
            <p className="text-gray-500 italic">No biography available.</p>
          )}
        </div>

        <aside className="space-y-8">
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            
            <h3 className="text-xl font-bold text-gray-900 mb-6">Facilities</h3>
            {facilities && facilities.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {facilities.map(facility => (
                  <li key={facility.id}>
                    {/* 🚀 Next.js SPA Routing for zero page reloads */}
                    <Link 
                      href={`/facilities/${facility.slug}`} 
                      className="text-gray-700 font-medium hover:text-blue-600 transition-colors flex items-center group"
                    >
                      <span className="mr-2 group-hover:scale-110 transition-transform">🏥</span> {facility.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-8 text-sm">No facilities assigned.</p>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-6">Procedures</h3>
            {proceduresRaw && proceduresRaw.length > 0 ? (
              <ul className="space-y-3">
                {proceduresRaw.map(procedure => (
                  <li key={procedure.id}>
                    {/* 🚀 Next.js SPA Routing */}
                    <Link 
                      href={`/procedures/${procedure.slug}`} 
                      className="text-gray-700 hover:text-blue-700 hover:underline flex items-center transition-colors"
                    >
                      <span style={{ backgroundColor: brandPrimaryColor }} className="w-2 h-2 rounded-full mr-3 opacity-70"></span>
                      {procedure.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No procedures listed.</p>
            )}
          </div>
          
          {/* Dynamic Contextual Lead Capture */}
          <div className="sticky top-8">
            <LeadCaptureForm 
              context="doctor"
              fixedEntityId={doctor.id}
              fixedEntityName={doctor.fullName} // 🚀 FIXED TYPO
              dynamicOptions={availableProcedures}
            />
          </div>
        </aside>
      </section>

      {/* Integrated Gallery */}
      {doctor.officeGallery && doctor.officeGallery.length > 0 && (
        <DoctorGallery images={doctor.officeGallery} />
      )}
    </main>
  )
}

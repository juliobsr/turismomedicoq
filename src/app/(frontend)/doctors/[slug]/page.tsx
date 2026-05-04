// src/app/(frontend)/doctors/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import type { Doctor, Media, Specialty, Procedure, Facility } from '@/payload-types'

// Core Components
import { LexicalRenderer } from '@/app/components/LexicalRenderer'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'

interface DoctorProfileProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // ISR: Re-generate page every hour

/**
 * Enterprise Architecture: Static Path Generation (SSG)
 * Fix: Implemented strict type checking and null-safety to prevent build crashes.
 */
export async function generateStaticParams() {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'doctors',
      limit: 1000,
      where: { 
        isActive: { equals: true },
        // 1. DB-Level Safety: Only fetch records that actually have a slug
        slug: { exists: true },
      },
      select: { slug: true },
    })
  
    // 2. Application-Level Safety: Strict filtering and string casting
    return docs
      // Ensure the slug is a valid string and not empty
      .filter((doc) => typeof doc.slug === 'string' && doc.slug.trim() !== '')
      // Map to the exact shape Next.js requires, forcing a String cast
      .map((doc) => ({
        slug: String(doc.slug),
      }))
  }

/**
 * Enterprise Architecture: Dynamic SEO Metadata
 */
export async function generateMetadata({ params }: DoctorProfileProps): Promise<Metadata> {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'doctors',
    where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
    depth: 0,
  })

  const doctor = docs[0] as Doctor | undefined
  if (!doctor) return {}

  return {
    title: doctor.metaTitle || `${doctor.fullName} | Queretaro Medical`,
    description: doctor.metaDescription || `View the medical profile of ${doctor.fullName}.`,
    openGraph: { title: doctor.fullName, type: 'profile' },
  }
}

/**
 * Enterprise Page: Doctor Profile
 */
export default async function DoctorProfilePage({ params }: DoctorProfileProps) {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'doctors',
    where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
    depth: 2, 
  })

  const doctor = docs[0] as Doctor | undefined
  if (!doctor) notFound()

  const profilePicture = doctor.profilePicture as Media | undefined
  const specialties = doctor.specialties as Specialty[] | undefined
  const procedures = doctor.procedures as Procedure[] | undefined
  const facilities = doctor.facilities as Facility[] | undefined

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0 shadow-xl">
            {profilePicture?.url && (
              <Image
                src={profilePicture.url}
                alt={profilePicture.alt || doctor.fullName}
                fill
                className="object-cover"
                priority // LCP image
              />
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{doctor.fullName}</h1>
            <p className="text-blue-200 text-lg font-mono mb-6">Lic: {doctor.medicalLicense}</p>
            {specialties && specialties.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {specialties.map((spec) => (
                  <span key={spec.id} className="bg-white/10 px-4 py-2 rounded-full text-sm font-semibold">
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
        
        {/* Left Column: Biography */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Specialist</h2>
          {doctor.biography ? (
            <LexicalRenderer data={doctor.biography} />
          ) : (
            <p className="text-gray-500 italic">No biography available.</p>
          )}
        </div>

        {/* Right Column: Interactive Form & Relationships */}
        <aside className="space-y-8">
          {/* Lead Capture Widget */}
          <LeadCaptureForm doctorId={doctor.id} doctorName={doctor.fullName} />

          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Facilities</h3>
            {facilities && facilities.length > 0 ? (
              <ul className="space-y-4 mb-8">
                {facilities.map(facility => (
                  <li key={facility.id} className="text-gray-700 font-medium">🏥 {facility.name}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 mb-8">No facilities assigned.</p>
            )}

            <h3 className="text-xl font-bold text-gray-900 mb-6">Procedures</h3>
            {procedures && procedures.length > 0 ? (
              <ul className="space-y-3">
                {procedures.map(procedure => (
                  <li key={procedure.id} className="flex items-center text-blue-700">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    {procedure.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No procedures listed.</p>
            )}
          </div>
        </aside>

      </section>
    </main>
  )
}
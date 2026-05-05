// src/app/(frontend)/doctors/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata, ResolvingMetadata } from 'next'
import type { Doctor, Media, Specialty, Procedure, Facility } from '@/payload-types'
import { getSiteSettings } from '@/lib/globals'
// Core Components
import { LexicalRenderer } from '@/app/components/LexicalRenderer';
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'
import DoctorGallery from '@/app/components/DoctorsGallery'

interface DoctorProfileProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // ISR: Re-generate page every hour

/**
 * Enterprise Architecture: Static Path Generation (SSG)
 */
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

/**
 * Enterprise Architecture: Dynamic SEO Metadata
 * Optimized to include Profile or Gallery images for Social Preview.
 */
export async function generateMetadata({ params }: DoctorProfileProps): Promise<Metadata> {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })
  const settings = await getSiteSettings()
  const { docs } = await payload.find({
    collection: 'doctors',
    where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
    depth: 1, // Depth 1 to fetch Image URLs
  })

  const doctor = docs[0] as Doctor | undefined
  if (!doctor) return {}

  const primaryImage = (doctor.profilePicture as Media)?.url || (doctor.officeGallery?.[0] as Media)?.url

  return {
    title: `${doctor.fullName} | ${doctor.metaTitle }`,
    description: doctor.metaDescription || `View the medical profile of ${doctor.fullName}. Specialist in Queretaro.`,
    openGraph: {
      title: doctor.fullName,
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

/**
 * Enterprise Page: Doctor Profile with JSON-LD for Google Rich Snippets
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

  /**
   * JSON-LD: Physician Schema
   * This structure is what allows Google to show the doctor's photo and info in search results.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.fullName,
    image: profilePicture?.url || (doctor.officeGallery?.[0] as Media)?.url,
    medicalSpecialty: specialties?.map(s => s.title).join(', '),
    description: doctor.metaDescription || `Medical specialist profile for ${doctor.fullName}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Queretaro',
      addressCountry: 'MX'
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* 🚀 Injected Structured Data for Google Indexing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
                priority
              />
            )}
          </div>
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{doctor.fullName}</h1>
            <h4 className="mb-4">{doctor.metaTitle}</h4>
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
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About the Specialist</h2>
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
                  <li key={facility.id} className="text-gray-700 font-medium">
                  <a 
                      href={`/facilities/${facility.slug}`} 
                      className="text-gray-700 font-medium hover:text-blue-600 transition-colors flex items-center"
                    >
                      <span className="mr-2">🏥</span> {facility.name}
                    </a>
                  </li>
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
                    <a href="/procedures" className="hover:underline flex items-center">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                      {procedure.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No procedures listed.</p>
            )}
          </div>
          <LeadCaptureForm doctorId={doctor.id} doctorName={doctor.fullName} />
        </aside>
      </section>

      {/* Integrated Gallery */}
      <DoctorGallery images={doctor.officeGallery || []} />
    </main>
  )
}
// src/app/(frontend)/doctors/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PlayCircleIcon, SparklesIcon } from '@heroicons/react/24/outline'
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

const toVideoEmbedUrl = (url?: string | null) => {
  if (!url) return null

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      const videoId = parsed.searchParams.get('v')
      if (videoId) return `https://www.youtube.com/embed/${videoId}`
      if (parsed.pathname.startsWith('/embed/')) return url
      if (parsed.pathname.startsWith('/shorts/')) {
        const videoIdFromPath = parsed.pathname.split('/').filter(Boolean)[1]
        return videoIdFromPath ? `https://www.youtube.com/embed/${videoIdFromPath}` : url
      }
    }

    if (host === 'vimeo.com') {
      const videoId = parsed.pathname.split('/').filter(Boolean)[0]
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url
    }

    return url
  } catch {
    return url
  }
}

const isDirectVideoUrl = (url?: string | null) => {
  if (!url) return false
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url)
}

const isEmbeddableVideoUrl = (url?: string | null) => {
  if (!url) return false

  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    return host === 'youtu.be' || host === 'youtube.com' || host === 'm.youtube.com' || host === 'vimeo.com'
  } catch {
    return false
  }
}

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
  const primaryImage =
    (doctor.heroBackground as MedicalAsset)?.url ||
    (doctor.profilePicture as MedicalAsset)?.url ||
    (doctor.officeGallery?.[0] as MedicalAsset)?.url
  
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
  const heroBackground = doctor.heroBackground as MedicalAsset | undefined
  const specialties = doctor.specialties as Specialty[] | undefined
  const proceduresRaw = doctor.procedures as Procedure[] | undefined
  const facilities = doctor.facilities as Facility[] | undefined
  const showForbesBadge = doctor.slug === 'dr-jose-larrinua'
  const procedureGallery = doctor.procedureGallery
    ? (doctor.procedureGallery as any[]).filter((img) => typeof img === 'object')
    : []
  const officeGallery = doctor.officeGallery
    ? (doctor.officeGallery as any[]).filter((img) => typeof img === 'object')
    : []
  const patientTestimonials = doctor.patientTestimonials || []
  const heroImage = heroBackground || officeGallery[0] || profilePicture

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
    image: heroImage?.url,
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
      {/* 🚀 Injected Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section with Dynamic Media Background */}
      <section style={{ backgroundColor: brandPrimaryColor }} className="relative overflow-hidden text-white py-16 lg:py-24 transition-colors duration-300">
        {doctor.heroVideoUrl && isDirectVideoUrl(doctor.heroVideoUrl) ? (
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
            poster={heroImage?.url}
          >
            <source src={doctor.heroVideoUrl} />
          </video>
        ) : heroImage?.url ? (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || doctor.fullName}
            fill
            className="absolute inset-0 object-cover opacity-45"
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-slate-950/55" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
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

            {doctor.heroVideoUrl && !isDirectVideoUrl(doctor.heroVideoUrl) && (
              <a
                href={doctor.heroVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-extrabold text-slate-950 shadow-lg transition hover:bg-blue-50"
              >
                <PlayCircleIcon className="h-5 w-5 text-blue-700" />
                Watch profile video
              </a>
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

      {procedureGallery.length > 0 && (
        <DoctorGallery
          images={procedureGallery}
          eyebrow="Clinical procedure gallery"
          title={`${doctor.fullName} Procedure Gallery`}
          itemActionLabel="View procedure image"
        />
      )}

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
      {officeGallery.length > 0 && (
        <DoctorGallery
          images={officeGallery}
          eyebrow="Practice environment"
          title="Clinic and consultation spaces"
          itemActionLabel="View clinic image"
        />
      )}

      {patientTestimonials.length > 0 && (
        <section className="bg-slate-950 py-20 text-white">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">
                Patient stories
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                Video testimonials from patients who trusted the process.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-300">
                These stories help future patients understand the care experience, communication and recovery support before making a decision.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {patientTestimonials.map((testimonial, index) => {
                const embedUrl = toVideoEmbedUrl(testimonial.videoUrl)
                const isDirectVideo = isDirectVideoUrl(embedUrl)
                const canEmbed = isEmbeddableVideoUrl(testimonial.videoUrl)

                return (
                  <article key={testimonial.id || `${testimonial.title}-${index}`} className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-white/10 bg-white/5 shadow-2xl shadow-slate-950/30">
                    <div className="relative aspect-[9/16] bg-slate-900">
                      {embedUrl && isDirectVideo ? (
                        <video className="h-full w-full object-cover" controls preload="metadata" playsInline>
                          <source src={embedUrl} />
                        </video>
                      ) : embedUrl && canEmbed ? (
                        <iframe
                          src={embedUrl}
                          title={testimonial.title}
                          className="absolute inset-0 h-full w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                          <PlayCircleIcon className="h-14 w-14 text-white/60" />
                          <a
                            href={testimonial.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-blue-50"
                          >
                            Open patient video
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-extrabold">{testimonial.title}</h3>
                      {testimonial.patientLocation && (
                        <p className="mt-2 text-sm font-bold uppercase tracking-[0.16em] text-blue-300">
                          {testimonial.patientLocation}
                        </p>
                      )}
                      {testimonial.quote && (
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                          {testimonial.quote}
                        </p>
                      )}
                      {testimonial.videoUrl && !canEmbed && (
                        <a
                          href={testimonial.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-extrabold text-white transition hover:border-blue-300 hover:text-blue-200"
                        >
                          Watch video
                          <PlayCircleIcon className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

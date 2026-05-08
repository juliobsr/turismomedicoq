// src/app/(frontend)/procedures/[slug]/page.tsx
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import type { Procedure, MedicalAsset, Doctor, Facility } from '@/payload-types'

// Core Utilities & Components
import { getSiteSettings } from '@/lib/globals'
import { LexicalRenderer } from '@/app/components/LexicalRenderer'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'

interface ProcedurePageProps {
  params: Promise<{
    slug: string
  }>
}

export const revalidate = 3600 // ISR: Cache for 1 hour

const procedureFallbackImage = '/media/globals/queretaro-panoramica-1-1920x1080.jpg'

// ============================================================================
// SSG: STATIC PATH GENERATION
// Pre-builds all active procedures at compile time for 0ms TTFB.
// ============================================================================
export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await payload.find({
    collection: 'procedures',
    limit: 1000,
    where: { isActive: { equals: true }, slug: { exists: true } },
    select: { slug: true },
  })

  return docs.map((doc) => ({ slug: String(doc.slug) }))
}

// ============================================================================
// DYNAMIC METADATA (ENTERPRISE SEO)
// ============================================================================
export async function generateMetadata({ params }: ProcedurePageProps): Promise<Metadata> {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })
  
  // 🚀 PERFORMANCE: Parallel Fetch Global Settings and Procedure Data
  const [settings, { docs }] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'procedures',
      where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
      depth: 1, 
    })
  ])

  const procedure = docs[0] as Procedure | undefined
  if (!procedure) return {}

  const companyName = settings?.companyName || 'Medical Network'
  const coverImage = (procedure.coverImage as MedicalAsset)?.url || procedureFallbackImage
  
  const pageTitle = `${procedure.name} | Spine Surgery in Queretaro for US Patients`
  const description = `${procedure.shortSummary} Learn candidacy, recovery planning, bilingual support and treatment options in Queretaro, Mexico.`

  return {
    title: pageTitle,
    description,
    alternates: {
      canonical: `/procedures/${resolvedParams.slug}`,
    },
    openGraph: {
      title: pageTitle,
      description,
      type: 'article',
      siteName: companyName,
      images: [{ url: coverImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [coverImage],
    }
  }
}

// ============================================================================
// SERVER COMPONENT: PROCEDURE DETAIL PAGE
// ============================================================================
export default async function ProcedurePage({ params }: ProcedurePageProps) {
  const resolvedParams = await params
  const payload = await getPayload({ config: configPromise })

  // 1. Parallel Fetch: Procedure Details & Global Settings
  const [procedureRes, settings] = await Promise.all([
    payload.find({
      collection: 'procedures',
      where: { slug: { equals: resolvedParams.slug }, isActive: { equals: true } },
      depth: 2, 
    }),
    getSiteSettings()
  ])

  const procedure = procedureRes.docs[0] as Procedure | undefined
  if (!procedure) notFound()

  // 2. REVERSE LOOKUP: Find Doctors authorized for this procedure
  const doctorsRes = await payload.find({
    collection: 'doctors',
    where: { 
      isActive: { equals: true },
      procedures: { contains: procedure.id } 
    },
    depth: 1, // Depth 1 populates the facilities inside each doctor
  })

  const performingDoctors = doctorsRes.docs as Doctor[]

  // 🚀 DEFENSIVE PROGRAMMING: Safely extract doctors for the Contextual Lead Form
  // Maps the Doctor's 'fullName' to the generic 'name' required by the SelectOption interface
  const availableDoctors = performingDoctors
    .map((d) => {
      if (typeof d === 'object' && d !== null && 'id' in d && 'fullName' in d) {
        return { 
          id: String(d.id), 
          name: String(d.fullName) 
        }
      }
      return null
    })
    .filter((d): d is { id: string; name: string } => d !== null)

  // 3. Extract unique facilities via Map Deduplication
  const facilitiesMap = new Map<string, Facility>()
  performingDoctors.forEach(doctor => {
    if (doctor.facilities && Array.isArray(doctor.facilities)) {
      doctor.facilities.forEach(facility => {
        const fac = facility as Facility
        if (fac.isActive && !facilitiesMap.has(String(fac.id))) {
          facilitiesMap.set(String(fac.id), fac)
        }
      })
    }
  })
  const availableFacilities = Array.from(facilitiesMap.values())

  // Visual Branding Fallbacks
  const coverImage = procedure.coverImage as MedicalAsset | undefined
  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a'

  // ==========================================================================
  // ADVANCED SCHEMA.ORG: MEDICAL PROCEDURE + FAQ PAGE
  // ==========================================================================
  const schemaGraph: any[] = [
    {
      '@type': 'MedicalProcedure',
      name: procedure.name,
      description: procedure.shortSummary,
      preparation: procedure.recoveryTime,
      procedureType: 'SurgicalProcedure',
      provider: availableFacilities.map(fac => ({
        '@type': 'MedicalClinic',
        name: fac.name,
      })),
      offers: procedure.pricing?.startingPriceUSD && procedure.pricing.startingPriceUSD > 0 ? {
        '@type': 'Offer',
        priceCurrency: 'USD',
        price: procedure.pricing.startingPriceUSD,
      } : undefined
    }
  ]

  // Conditionally inject FAQ Schema
  if (procedure.faqs && procedure.faqs.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      mainEntity: procedure.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    })
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': schemaGraph
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 🚀 Inject Structured Data Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section
        style={{ backgroundColor: brandPrimaryColor }}
        className="relative flex min-h-[560px] w-full items-center overflow-hidden transition-colors duration-300"
      >
        <Image
          src={coverImage?.url || procedureFallbackImage}
          alt={coverImage?.alt || procedure.name}
          fill
          className="absolute inset-0 z-0 object-cover object-center opacity-45"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 z-0 bg-slate-950/55" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 pt-24 text-center">
          <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
            <ShieldCheckIcon className="h-4 w-4" />
            Spine treatment in Queretaro for international patients
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
            {procedure.name}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
            {procedure.shortSummary}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12 -mt-16 relative z-20">
        
        {/* Left Column: Clinical Info & Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Facts Card */}
          <section className="flex flex-col items-start justify-between gap-6 rounded-lg border border-slate-100 bg-white p-6 shadow-lg md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-1">Starting Price</p>
              <p className="text-3xl font-extrabold text-slate-900">
                {procedure.pricing?.startingPriceUSD && procedure.pricing.startingPriceUSD > 0
                  ? `$${procedure.pricing.startingPriceUSD.toLocaleString()} USD` 
                  : 'Personalized Quote'
                }
              </p>
              {procedure.pricing?.financingAvailable && (
                <p className="text-sm text-green-600 font-medium mt-1 flex items-center">
                  <CurrencyDollarIcon className="mr-1 h-4 w-4" />
                  Financing Available
                </p>
              )}
            </div>
            
            <div className="flex gap-6 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 w-full md:w-auto">
              {procedure.surgeryDuration && (
                <div>
                  <p className="text-slate-500 text-sm font-semibold mb-1 flex items-center">
                    <ClockIcon className="mr-1 h-4 w-4" />
                    Duration
                  </p>
                  <p className="font-semibold text-slate-900">{procedure.surgeryDuration}</p>
                </div>
              )}
              {procedure.recoveryTime && (
                <div>
                  <p className="text-slate-500 text-sm font-semibold mb-1 flex items-center">
                    <CheckCircleIcon className="mr-1 h-4 w-4" />
                    Recovery
                  </p>
                  <p className="font-semibold text-slate-900">{procedure.recoveryTime}</p>
                </div>
              )}
            </div>
          </section>

          {/* Procedure Description (RichText) */}
          <article className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm md:p-12">
            <h2 className="mb-8 border-b border-slate-100 pb-4 text-3xl font-bold text-slate-900">
              About this procedure
            </h2>
            <LexicalRenderer data={procedure.fullDescription} />
          </article>

          {/* FAQs Section */}
          {procedure.faqs && procedure.faqs.length > 0 && (
            <section className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm md:p-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {procedure.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">{faq.question}</h3>
                    <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Dynamic Referrals & Contextual Lead Gen */}
        <aside className="space-y-8">
          
          {/* Specialists Roster */}
          <div className="rounded-lg border border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Certified Specialists</h3>
            {performingDoctors.length > 0 ? (
              <ul className="space-y-4">
                {performingDoctors.map(doctor => {
                  const docImg = doctor.profilePicture as MedicalAsset | undefined
                  return (
                    <li key={doctor.id}>
                      <Link 
                        href={`/doctors/${doctor.slug}`}
                        className="flex items-center group hover:bg-slate-50 p-2 rounded-xl transition-colors"
                      >
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-slate-200 mr-4 shadow-sm">
                          {docImg?.url ? (
                            <Image src={docImg.url} alt={doctor.fullName} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-slate-200" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {doctor.fullName}
                          </p>
                          <p className="text-xs font-medium text-slate-500 mt-0.5">View Full Profile →</p>
                        </div>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            ) : (
              <p className="text-slate-500 text-sm">Our specialists roster is being updated.</p>
            )}
          </div>

          {/* 🚀 Dynamic Contextual Lead Capture Form */}
          <div className="sticky top-8">
            <LeadCaptureForm 
              context="procedure"
              fixedEntityId={procedure.id}
              fixedEntityName={procedure.name}
              dynamicOptions={availableDoctors}
            />
          </div>

        </aside>
      </div>
    </main>
  )
}

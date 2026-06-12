import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

import type { Doctor, Procedure, ProceduresMedia, Specialty } from '@/payload-types'
import { ProcedureDirectory } from '@/app/components/Procedures/ProcedureDirectory'
import { getSiteSettings } from '@/lib/globals'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const companyName = settings?.companyName || 'Elite Medical Journey'

  const title = 'Medical Procedures in Queretaro, Mexico'
  const description =
    'Explore medical procedures in Queretaro, Mexico with vetted specialists, bilingual coordination, modern hospitals and recovery planning for international patients.'

  return {
    title,
    description,
    alternates: {
      canonical: '/procedures',
    },
    keywords: [
      'medical procedures Queretaro',
      'surgery in Queretaro',
      'medical tourism procedures Mexico',
      'spine surgery Mexico',
      'orthopedic procedures Queretaro',
      'international patient surgery Mexico',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: companyName,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function ProceduresPage() {
  const payload = await getPayload({ config: configPromise })

  const [settings, proceduresResponse, doctorsResponse] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'procedures',
      depth: 1,
      limit: 200,
      sort: 'name',
      where: { isActive: { equals: true } },
    }),
    payload.find({
      collection: 'doctors',
      depth: 1,
      limit: 200,
      sort: 'fullName',
      where: { isActive: { equals: true } },
    }),
  ])

  const companyName = settings?.companyName || 'Elite Medical Journey'
  const doctors = doctorsResponse.docs as Doctor[]
  const doctorOptions = doctors.map((doctor) => ({
    id: String(doctor.id),
    fullName: doctor.fullName,
  }))

  const doctorsByProcedure = new Map<string, { id: string; fullName: string; slug?: string | null }[]>()

  doctors.forEach((doctor) => {
    const procedures = Array.isArray(doctor.procedures) ? doctor.procedures : []

    procedures.forEach((procedure) => {
      if (typeof procedure !== 'object' || procedure === null || !('id' in procedure)) return

      const procedureId = String(procedure.id)
      const currentDoctors = doctorsByProcedure.get(procedureId) || []

      currentDoctors.push({
        id: String(doctor.id),
        fullName: doctor.fullName,
        slug: doctor.slug,
      })

      doctorsByProcedure.set(procedureId, currentDoctors)
    })
  })

  const procedures = (proceduresResponse.docs as Procedure[]).map((procedure) => {
    const coverImage = procedure.coverImage as ProceduresMedia | undefined
    const heroBackground = procedure.heroBackground as ProceduresMedia | undefined
    const specialty = procedure.specialty as Specialty | undefined
    const cardImage =
      heroBackground?.mimeType?.startsWith('image/') || (heroBackground?.url && !heroBackground.mimeType)
        ? heroBackground
        : coverImage

    return {
      id: String(procedure.id),
      name: procedure.name,
      slug: procedure.slug,
      shortSummary: procedure.shortSummary,
      recoveryTime: procedure.recoveryTime,
      surgeryDuration: procedure.surgeryDuration,
      startingPriceUSD: procedure.pricing?.startingPriceUSD || null,
      coverImage: cardImage
        ? {
            url: cardImage.url,
            alt: cardImage.alt,
            mimeType: cardImage.mimeType,
          }
        : null,
      specialty:
        specialty && typeof specialty === 'object'
          ? {
              title: specialty.title,
            }
          : null,
      doctors: doctorsByProcedure.get(String(procedure.id)) || [],
    }
  })

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Medical Procedures in Queretaro, Mexico',
    description:
      'Directory of medical procedures available through Elite Medical Journey for international patients traveling to Queretaro, Mexico.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://elitemedicaljourney.com'}/procedures`,
    publisher: {
      '@type': 'Organization',
      name: companyName,
    },
    hasPart: procedures.map((procedure) => ({
      '@type': 'MedicalProcedure',
      name: procedure.name,
      description: procedure.shortSummary,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://elitemedicaljourney.com'}/procedures/${procedure.slug}`,
    })),
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_38%),linear-gradient(135deg,rgba(15,23,42,1),rgba(15,23,42,0.94))]" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.72fr] lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-blue-100 backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4" />
              Procedure directory
            </p>
            <h1 className="text-5xl font-black leading-tight tracking-tight md:text-7xl">
              Find the right medical procedure and specialist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Compare treatment options available in Queretaro, Mexico, and see which vetted specialists can review your case with bilingual support.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-100">
              International patient support
            </p>
            <h2 className="mt-4 text-3xl font-black">Not sure where to start?</h2>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Search by procedure name or filter by doctor. If you are comparing options, our coordinators can help organize records, specialist review and travel planning.
            </p>
            <Link
              href="/patient-journey"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-blue-50"
            >
              View patient journey
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-blue-700">
            Active procedures
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
            Procedures available through {companyName}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Each procedure page includes clinical context, recovery expectations, estimated pricing when available and the specialists connected to that treatment path.
          </p>
        </header>

        <ProcedureDirectory procedures={procedures} doctors={doctorOptions} />
      </section>
    </main>
  )
}

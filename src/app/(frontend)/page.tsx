import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

import configPromise from '@payload-config'
import { HomeLeadForm } from '@/app/components/HomeLeadForm'
import { getSiteSettings } from '@/lib/globals'

export const revalidate = 3600

const heroImage =
  'https://elements-resized.envatousercontent.com/envato-dam-assets-production/EVA/TRX/16/38/c6/40/8b/v1_E11/E117OW06.jpg?w=1600&cf_fit=scale-down&mark-alpha=18&mark=https%3A%2F%2Felements-assets.envato.com%2Fstatic%2Fwatermark4.png&q=85&format=auto&s=1968228562e3f1ac81aff123d89abafcc51bfe5b336a70b538b1fdc533650720'

const cityImage = '/media/globals/queretaro-panoramica-1-1920x1080.jpg'
const aqueductImage = '/media/globals/ACUEDUCTO-DE-QUERETARO1-1.jpg'

const journeySteps = [
  {
    title: 'Clinical review',
    description:
      'Share your diagnosis, goals or symptoms. We match you with a vetted specialist and outline the right next step.',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    title: 'Specialist plan',
    description:
      'Receive guidance on consultations, medical records, timelines and treatment expectations before you travel.',
    icon: HeartIcon,
  },
  {
    title: 'Travel coordination',
    description:
      'Plan a safe arrival in Queretaro with appointment logistics, hospital access and recovery support aligned in advance.',
    icon: MapPinIcon,
  },
  {
    title: 'Recovery follow-up',
    description:
      'Continue your recovery with clear post-care instructions and communication between your coordinator and specialist.',
    icon: SparklesIcon,
  },
]

const queretaroAdvantages = [
  'One of Mexico’s safest and most orderly major cities',
  'Modern private hospitals with advanced specialty care',
  'A calmer recovery environment than larger medical tourism hubs',
  'Strong connectivity to Mexico City, Bajio and international travel routes',
]

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const companyName = settings?.companyName || 'Premium Surgery'

  const title = `Medical Tourism in Queretaro, Mexico | ${companyName}`
  const description =
    'Plan safe, high-quality medical tourism in Queretaro with vetted specialists, modern hospitals, private coordination and a patient journey designed for international care.'

  return {
    title,
    description,
    alternates: {
      canonical: '/',
    },
    keywords: [
      'medical tourism Queretaro',
      'medical tourism Mexico',
      'surgery in Queretaro',
      'private hospitals Mexico',
      'orthopedic surgery Queretaro',
      'spine surgery Mexico',
      'medical travel Mexico',
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: companyName,
      images: [{ url: heroImage }],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImage],
    },
  }
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const [settings, doctorsResponse, proceduresResponse] = await Promise.all([
    getSiteSettings(),
    payload.find({
      collection: 'doctors',
      depth: 0,
      limit: 20,
      sort: 'fullName',
      where: { isActive: { equals: true } },
      select: { id: true, fullName: true },
    }),
    payload.find({
      collection: 'procedures',
      depth: 0,
      limit: 20,
      sort: 'name',
      where: { isActive: { equals: true } },
      select: { id: true, name: true },
    }),
  ])

  const companyName = settings?.companyName || 'Premium Surgery'
  const doctors = doctorsResponse.docs.map((doctor) => ({
    id: String(doctor.id),
    name: doctor.fullName,
  }))
  const procedures = proceduresResponse.docs.map((procedure) => ({
    id: String(procedure.id),
    name: procedure.name,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: companyName,
    description:
      'Medical tourism coordination in Queretaro, Mexico for international patients seeking vetted specialists and modern private care.',
    areaServed: {
      '@type': 'City',
      name: 'Queretaro',
      addressCountry: 'MX',
    },
    medicalSpecialty: ['Orthopedic Surgery', 'Spine Surgery', 'Medical Tourism Coordination'],
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  }

  return (
    <main className="bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-slate-950">
        <Image
          src={heroImage}
          alt="Modern private hospital environment for medical tourism in Queretaro"
          fill
          priority
          className="object-cover object-center opacity-45"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/45" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4" />
              Medical tourism in Queretaro, Mexico
            </p>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Safer medical travel starts with the right specialist.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100 md:text-xl">
              Access vetted doctors, modern private hospitals and concierge-level coordination in Queretaro, Mexico’s hidden gem for premium medical care and calm recovery.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-slate-100"
              >
                Meet specialists
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/why-queretaro"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Why Queretaro
              </Link>
            </div>

            <dl className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/20 pt-8">
              <div>
                <dt className="text-3xl font-black">10+</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-200">Years of specialist experience</dd>
              </div>
              <div>
                <dt className="text-3xl font-black">24h</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-200">Coordinator response target</dd>
              </div>
              <div>
                <dt className="text-3xl font-black">MX</dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-200">Modern care, easier recovery</dd>
              </div>
            </dl>
          </div>

          <HomeLeadForm doctors={doctors} procedures={procedures} />
        </div>
      </section>

      <section className="bg-slate-950 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            ['Vetted specialists', 'Clinical profiles are structured so patients can compare expertise, focus and availability.'],
            ['Private hospitals', 'Queretaro offers modern medical infrastructure without the friction of oversized destination cities.'],
            ['Transparent journey', 'Patients understand the path before traveling: review, appointment, procedure and recovery.'],
            ['English-first coordination', 'Clear communication for international patients from first inquiry to follow-up.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <CheckCircleIcon className="h-6 w-6 text-blue-300" />
              <h2 className="mt-4 text-lg font-extrabold text-white">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#eef5f2] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="relative min-h-[520px] overflow-hidden rounded-lg bg-slate-900 shadow-2xl shadow-slate-900/20">
            <Image
              src={cityImage}
              alt="Panoramic view of Queretaro for medical tourism recovery"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 560px"
            />
            <div className="absolute inset-0 bg-slate-950/35" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                Planned care, calmer recovery
              </p>
              <p className="mt-3 max-w-md text-2xl font-extrabold leading-tight">
                A medical journey designed before the patient boards a plane.
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              Patient journey
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              A medical trip should feel planned, not improvised.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Our platform turns uncertainty into a clear sequence of decisions, documents, consultations and recovery steps.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {journeySteps.map((step, index) => {
                const Icon = step.icon
                return (
                  <article key={step.title} className="rounded-lg border border-white bg-white/80 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-primary text-white">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="text-sm font-black text-slate-300">0{index + 1}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-extrabold text-slate-950">{step.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              Why Queretaro
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              The hidden gem of medical tourism in Mexico.
            </h2>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-900/15">
              <Image
                src={aqueductImage}
                alt="Historic aqueduct in Queretaro, Mexico"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-6 ring-1 ring-slate-200 md:p-8">
            <p className="text-lg leading-8 text-slate-700">
              Queretaro combines the standards international patients expect with the calm they need while recovering. The city is known for safety, order, modern infrastructure, strong business culture and a quality of life that feels more personal than the typical medical tourism corridor.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              For patients, that means less noise around the medical decision: easier mobility, premium private care, reliable hotels, a beautiful historic center and access to a city that feels secure, modern and quietly sophisticated.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {queretaroAdvantages.map((advantage) => (
                <li key={advantage} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                  {advantage}
                </li>
              ))}
            </ul>

            <Link
              href="/patient-journey"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:brightness-110"
            >
              Explore the patient journey
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

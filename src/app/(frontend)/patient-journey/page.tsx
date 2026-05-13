import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRightIcon,
  ArrowUpTrayIcon,
  BeakerIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon,
  HomeModernIcon,
  LanguageIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import type { PatientJourney as PatientJourneyType, MedicalAsset } from '@/payload-types'

import { getSiteSettings } from '@/lib/globals'
import { HomeLeadForm } from '@/app/components/HomeLeadForm'

export const revalidate = 3600

const stepFallbackImages = [
  '/media/globals/queretaro-panoramica-1-1920x1080.jpg',
  '/media/globals/ACUEDUCTO-DE-QUERETARO1-1.jpg',
  '/media/globals/queretaro-panoramica-1.jpg',
  '/media/globals/ACUEDUCTO-DE-QUERETARO1-1-768x1024.jpg',
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const conciergeTimeline = [
  {
    phase: 'Phase 1',
    title: 'Welcome and VIP Transfer',
    subtitle: 'The Touchdown',
    description:
      'This is often the most nervous moment for the patient. The priority is simple: you are met, guided and never left to figure things out alone.',
    icon: TruckIcon,
    items: [
      'Airport reception at Queretaro International Airport (AIQ) or Mexico City with bilingual coordination.',
      'Private executive transportation to the hospital or recovery hotel.',
      'Assisted check-in at the hotel or clinic to remove language barriers from the first hour.',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Pre-op and Hospital Admission',
    subtitle: 'Clinical safety check',
    description:
      'Before treatment begins, the clinical plan is confirmed in person and the patient receives the final safety checks.',
    icon: BeakerIcon,
    items: [
      'Final face-to-face consultation with the specialist to resolve last-minute questions.',
      'Clinical labs, imaging review and pre-anesthesia evaluations in qualified facilities.',
      'Hospital admission into a medical suite designed for privacy, comfort and international patient expectations.',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Procedure and Immediate Recovery',
    subtitle: 'The medical core',
    description:
      'The procedure is performed by the selected surgeon, supported by hospital teams and a clear post-op plan.',
    icon: HeartIcon,
    items: [
      'Surgical intervention performed by the specialist selected and reviewed by the patient.',
      'Hospital stay with 24/7 monitoring by nursing staff familiar with international patient needs.',
      'Clear post-op updates for the patient and companion so the next steps are understood.',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Concierge Recovery',
    subtitle: 'More than a hotel stay',
    description:
      'Patients often worry about recovering in an ordinary hotel. This phase is designed around comfort, follow-up and safe daily support.',
    icon: HomeModernIcon,
    items: [
      'Medical discharge and private transfer to a recovery hotel or suitable recovery setting.',
      'Follow-up visits in the patient’s room for wound care, medication control and recovery checks when appropriate.',
      'Optional light tourism, if medically cleared, such as guided visits through Queretaro’s Historic Center.',
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Final Review and Fit to Fly',
    subtitle: 'Safe return home',
    description:
      'The return trip is planned around medical clearance, airline documentation and a final transfer back to the airport.',
    icon: PaperAirplaneIcon,
    items: [
      'Final doctor review with discharge instructions for home care.',
      'Fit-to-fly documentation when required for post-surgical airline boarding.',
      'Private transfer back to the airport for the return flight.',
    ],
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })

  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const companyName = settings?.companyName || 'Queretaro Medical'
  const heroImage = (journey.heroCover as MedicalAsset)?.url
  const pageTitle =
    journey.metaTitle?.trim() ||
    `Patient Journey for Medical Tourism in Queretaro | ${companyName}`

  return {
    title: pageTitle,
    description:
      journey.metaDescription ||
      'A clear, bilingual patient journey for medical tourism in Queretaro, from specialist matching and travel planning to recovery support.',
    alternates: {
      canonical: '/patient-journey',
    },
    openGraph: {
      title: pageTitle,
      description: journey.metaDescription || journey.heroDescription,
      type: 'website',
      siteName: companyName,
      images: heroImage ? [{ url: heroImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      images: heroImage ? [heroImage] : [],
    },
  }
}

export default async function PatientJourneyPage() {
  const payload = await getPayload({ config: configPromise })

  const [settings, journeyData, doctorsResponse, proceduresResponse] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
    payload.find({
      collection: 'doctors',
      depth: 0,
      limit: 30,
      sort: 'fullName',
      where: { isActive: { equals: true } },
      select: { id: true, fullName: true },
    }),
    payload.find({
      collection: 'procedures',
      depth: 0,
      limit: 30,
      sort: 'name',
      where: { isActive: { equals: true } },
      select: { id: true, name: true },
    }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const companyName = settings?.companyName || 'Queretaro Medical'
  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a'
  const heroImage = journey.heroCover as MedicalAsset | undefined
  const doctors = doctorsResponse.docs.map((doctor) => ({
    id: String(doctor.id),
    name: doctor.fullName,
  }))
  const procedures = proceduresResponse.docs.map((procedure) => ({
    id: String(procedure.id),
    name: procedure.name,
  }))

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: journey.heroTitle,
    description: journey.heroDescription,
    step: journey.steps?.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.title,
      text: step.description,
      image:
        (step.image as MedicalAsset)?.url ||
        stepFallbackImages[index % stepFallbackImages.length],
    })),
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section className="relative flex min-h-[560px] w-full items-center overflow-hidden bg-slate-950">
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || 'Medical tourism patient journey in Queretaro'}
            fill
            className="absolute inset-0 z-0 object-cover object-center opacity-55"
            priority
          />
        )}
        <div className="absolute inset-0 z-0 bg-slate-950/55" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4" />
              Step-by-step medical travel
            </span>
            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-6xl">
              {journey.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              {journey.heroDescription}
            </p>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/95 p-6 shadow-2xl shadow-slate-950/30">
            <div className="flex items-start gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: brandPrimaryColor }}
              >
                <LanguageIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                  No language barrier, no guesswork.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  International patients are supported by fully bilingual staff throughout the entire process: intake, medical record review, appointment coordination, hospital arrival, discharge instructions and recovery follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-3">
          {[
            ['100% bilingual support', 'English and Spanish coordination from first contact through recovery.'],
            ['Clear medical handoffs', 'Your records, questions and instructions are translated into a practical care plan.'],
            ['Human guidance', 'A coordinator helps you understand what happens before, during and after treatment.'],
          ].map(([title, description]) => (
            <div key={title} className="flex gap-3">
              <CheckCircleIcon className="mt-1 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#eef5f2] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
                Concierge patient journey
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                From touchdown to fit-to-fly, every step is guided.
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">
              Medical travel should not feel like the patient is managing a surgery, a foreign city and a recovery plan alone. This timeline shows how the platform turns each stage into a coordinated, bilingual experience.
            </p>
          </div>

          <div className="mt-14">
            <ol className="relative space-y-6 before:absolute before:left-6 before:top-4 before:hidden before:h-[calc(100%-2rem)] before:w-px before:bg-slate-300 md:before:block">
              {conciergeTimeline.map((step, index) => {
                const Icon = step.icon
                const isLast = index === conciergeTimeline.length - 1

                return (
                  <li key={step.title} className="group relative md:pl-20">
                    <div className="absolute left-0 top-6 hidden h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-lg transition group-hover:bg-brand-primary md:flex">
                      <Icon className="h-6 w-6" />
                    </div>

                    <article className="rounded-lg border border-white bg-white/85 p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl md:p-8">
                      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-2xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white">
                              {step.phase}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
                              {step.subtitle}
                            </span>
                          </div>
                          <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                            {step.title}
                          </h3>
                          <p className="mt-3 text-base leading-7 text-slate-600">
                            {step.description}
                          </p>
                        </div>

                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white md:hidden">
                          <Icon className="h-7 w-7" />
                        </div>
                      </div>

                      <ul className="mt-6 grid gap-3">
                        {step.items.map((item) => (
                          <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-700">
                            <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                            {item}
                          </li>
                        ))}
                      </ul>

                      {isLast && (
                        <Link
                          href="#start-journey"
                          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:brightness-110"
                        >
                          Start my journey today
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>
                      )}
                    </article>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </section>

      <section id="start-journey" className="scroll-mt-24 bg-slate-950 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div className="text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
              Start my journey today
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Tell us what you need and we will route your case to the right medical team.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              A bilingual coordinator can help review your goals, match you with a specialist,
              explain the next step and keep communication clear before you travel.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-200 sm:grid-cols-2">
              {[
                'English and Spanish coordination',
                'Doctor or procedure matching',
                'Travel and recovery guidance',
                'Private follow-up by the concierge team',
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <HomeLeadForm doctors={doctors} procedures={procedures} />
        </div>
      </section>


    </main>
  )
}

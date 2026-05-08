import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  LanguageIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import type { PatientJourney as PatientJourneyType, MedicalAsset } from '@/payload-types'

import { getSiteSettings } from '@/lib/globals'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'

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

  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const companyName = settings?.companyName || 'Queretaro Medical'
  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a'
  const heroImage = journey.heroCover as MedicalAsset | undefined

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

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-16 lg:grid-cols-3 lg:gap-16">
        <div className="lg:col-span-2">
          <ol className="space-y-14">
            {journey.steps?.map((step, index) => {
              const mainStepMedia = step.image as MedicalAsset | undefined
              const imageSrc = mainStepMedia?.url || stepFallbackImages[index % stepFallbackImages.length]
              const hasOptions = Boolean(step.options?.length)

              return (
                <li key={index} className="grid gap-6 border-b border-slate-200 pb-14 md:grid-cols-[240px_minmax(0,1fr)]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-200 md:sticky md:top-8">
                    <Image
                      src={imageSrc}
                      alt={mainStepMedia?.alt || step.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 240px"
                    />
                    <div
                      className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg text-sm font-extrabold text-white shadow-lg"
                      style={{ backgroundColor: brandPrimaryColor }}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <article className="min-w-0">
                    {step.duration && (
                      <span className="mb-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                        <ClockIcon className="h-4 w-4" />
                        {step.duration}
                      </span>
                    )}

                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
                      {step.title}
                    </h2>

                    <p className="mt-4 text-lg leading-8 text-slate-600">
                      {step.description}
                    </p>

                    {hasOptions && (
                      <div className="mt-8">
                        <h3 className="text-xl font-extrabold text-slate-900">
                          Recovery options
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                          Choose a recovery setting that matches the pace, privacy and support level you want after treatment.
                        </p>

                        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                          {step.options!.map((option, optIdx) => {
                            const optionImg = option.image as MedicalAsset | undefined
                            const optionSlug = slugify(option.title)
                            const optionImageSrc =
                              optionImg?.url ||
                              stepFallbackImages[(index + optIdx + 1) % stepFallbackImages.length]

                            return (
                              <Link
                                key={optionSlug}
                                href={`/patient-journey/recovery/${optionSlug}`}
                                className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
                              >
                                <div className="relative h-44 overflow-hidden bg-slate-200">
                                  <Image
                                    src={optionImageSrc}
                                    alt={optionImg?.alt || option.title}
                                    fill
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                    sizes="(max-width: 768px) 100vw, 360px"
                                  />
                                  <div className="absolute inset-0 bg-slate-950/25" />
                                </div>
                                <div className="p-5">
                                  <h4 className="flex items-center justify-between gap-3 text-lg font-extrabold text-slate-950">
                                    {option.title}
                                    <ArrowRightIcon className="h-5 w-5 shrink-0 text-blue-700 transition group-hover:translate-x-1" />
                                  </h4>
                                  <p className="mt-3 text-sm leading-6 text-slate-600">
                                    {option.description}
                                  </p>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                </li>
              )
            })}
          </ol>
        </div>

        <aside className="relative">
          <div className="sticky top-8 space-y-8">
            <div className="rounded-lg bg-slate-950 p-8 text-white shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                {companyName}
              </p>
              <h3 className="mt-3 text-2xl font-extrabold">Start Your Journey</h3>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                From airport arrival to medical appointments, discharge instructions and recovery, our concierge team keeps the journey organized and understandable in English and Spanish.
              </p>
            </div>

            <LeadCaptureForm
              context="doctor"
              fixedEntityId="general"
              fixedEntityName="Our Concierge Team"
              dynamicOptions={[]}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}

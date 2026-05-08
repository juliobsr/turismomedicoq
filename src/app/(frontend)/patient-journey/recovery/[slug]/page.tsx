import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  ArrowLeftIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  HeartIcon,
  LanguageIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import type { PatientJourney as PatientJourneyType, MedicalAsset } from '@/payload-types'

import { getSiteSettings } from '@/lib/globals'
import { LeadCaptureForm } from '@/app/components/LeadCaptureForm'

type RecoveryPageProps = {
  params: Promise<{
    slug: string
  }>
}

type RecoveryOption = {
  slug: string
  title: string
  description: string
  image?: MedicalAsset
  stepTitle: string
}

export const revalidate = 3600

const fallbackImage = '/media/globals/queretaro-panoramica-1-1920x1080.jpg'

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const getRecoveryOptions = (journey: PatientJourneyType): RecoveryOption[] =>
  (journey.steps || []).flatMap((step) =>
    (step.options || []).map((option) => ({
      slug: slugify(option.title),
      title: option.title,
      description: option.description,
      image: option.image as MedicalAsset | undefined,
      stepTitle: step.title,
    }))
  )

const getRecoveryOptionBySlug = (journey: PatientJourneyType, slug: string) =>
  getRecoveryOptions(journey).find((option) => option.slug === slug)

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const journeyData = await payload.findGlobal({ slug: 'patient-journey' })
  const journey = journeyData as unknown as PatientJourneyType

  return getRecoveryOptions(journey).map((option) => ({ slug: option.slug }))
}

export async function generateMetadata({ params }: RecoveryPageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const option = getRecoveryOptionBySlug(journey, slug)
  if (!option) return {}

  const companyName = settings?.companyName || 'Queretaro Medical'
  const title = `${option.title} | Medical Recovery in Queretaro`
  const description = `${option.description} Bilingual support keeps the recovery plan clear for international patients.`
  const image = option.image?.url

  return {
    title,
    description,
    alternates: {
      canonical: `/patient-journey/recovery/${option.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      siteName: companyName,
      images: image ? [{ url: image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      images: image ? [image] : [],
    },
  }
}

export default async function RecoveryOptionPage({ params }: RecoveryPageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const option = getRecoveryOptionBySlug(journey, slug)
  if (!option) notFound()

  const brandPrimaryColor = settings?.primaryColor || '#1e3a8a'
  const imageSrc = option.image?.url || fallbackImage

  const advantages = [
    {
      title: 'Bilingual recovery coordination',
      description:
        'English-speaking staff help patients understand medication schedules, warning signs, follow-up instructions and next appointments.',
      icon: LanguageIcon,
    },
    {
      title: 'A calmer place to heal',
      description:
        'The recovery setting is selected around comfort, privacy, mobility and the type of support the patient needs after treatment.',
      icon: HeartIcon,
    },
    {
      title: 'Clear logistics',
      description:
        'Transportation, check-ins and communication with the medical team are coordinated so the patient can focus on recovery.',
      icon: MapPinIcon,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <section className="relative min-h-[520px] overflow-hidden bg-slate-950">
        <Image
          src={imageSrc}
          alt={option.image?.alt || option.title}
          fill
          className="object-cover opacity-55"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="relative z-10 mx-auto flex min-h-[520px] max-w-7xl flex-col justify-end px-4 py-16">
          <Link
            href="/patient-journey"
            className="mb-8 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to patient journey
          </Link>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            {option.stepTitle}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white md:text-6xl">
            {option.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-100">
            {option.description}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[1fr_380px]">
        <div>
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-6">
            <div className="flex gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: brandPrimaryColor }}
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
                  Recovery support in the language you trust.
                </h2>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  Patients are not left to interpret medical instructions alone. Bilingual staff supports communication with doctors, nurses, coordinators and family members so each recovery decision is clear.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {advantages.map((advantage) => {
              const Icon = advantage.icon

              return (
                <article key={advantage.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <Icon className="h-7 w-7 text-blue-700" />
                  <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                    {advantage.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {advantage.description}
                  </p>
                </article>
              )
            })}
          </div>

          <div className="mt-10 rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-950">
              What this recovery option is designed to provide
            </h2>
            <ul className="mt-6 space-y-4">
              {[
                'A practical recovery environment aligned with the procedure, mobility needs and discharge instructions.',
                'English and Spanish communication support during follow-up questions and care coordination.',
                'A smoother transition from hospital care to rest, monitoring and return travel planning.',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-8 lg:h-fit">
          <LeadCaptureForm
            context="doctor"
            fixedEntityId="general"
            fixedEntityName="Our Concierge Team"
            dynamicOptions={[]}
          />
        </aside>
      </section>
    </main>
  )
}

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
  ClipboardDocumentCheckIcon,
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

const journeyHeroTitle = 'The Experience: Your Peace-of-Mind Journey'
const journeyHeroDescription =
  'A seamless, end-to-end concierge experience built around your health, comfort and confidence before, during and after medical travel.'

const journeyPhases = [
  {
    phase: 'Phase 1',
    title: 'Intake & Expert Clinical Assessment',
    subtitle: 'Clinical clarity before decisions are made',
    description:
      'Your journey begins with a secure intake process, bilingual case management and remote specialist review before you commit to travel.',
    icon: ClipboardDocumentCheckIcon,
    steps: [
      {
        title: 'Initial Inquiry & Connected Care',
        icon: LanguageIcon,
        items: [
          'Submit a secure inquiry through encrypted web forms, phone, WhatsApp or secure email.',
          'A dedicated bilingual English/Spanish Medical Case Manager contacts you within 24 business hours.',
          'We coordinate an introductory virtual discovery call to understand your healthcare goals, concerns and timeline.',
        ],
      },
      {
        title: 'Remote Medical Evaluation & Transparent Pricing',
        icon: ArrowUpTrayIcon,
        items: [
          'Securely upload clinical history, recent lab work and diagnostic imaging such as DICOM or JPEG files.',
          'Our local medical board and top-tier specialists review your records thoroughly.',
          'A private telemedicine consultation is scheduled with your lead operating specialist.',
          'You receive a tailored clinical treatment path and an all-inclusive financial quote with no hidden fees.',
        ],
      },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Logistics & Premium Executive Concierge',
    subtitle: 'Travel, scheduling and arrival handled for you',
    description:
      'Once your plan is approved, our logistics team synchronizes the medical, hospitality and ground transportation details.',
    icon: TruckIcon,
    steps: [
      {
        title: 'Elite Travel Coordination',
        icon: SparklesIcon,
        items: [
          'Reservations at premium, recovery-friendly partner hotels.',
          'Dedicated private executive ground transportation throughout your stay.',
          'Comprehensive medical, laboratory and surgical scheduling.',
          'Pre-operative laboratory screenings and specialist clearances.',
          'Professional on-site medical translation and interpretation services.',
          'Tailored international travel health insurance and specialized medical complication insurance policies when applicable.',
        ],
      },
      {
        title: 'Executive Airport Reception & Touchdown',
        icon: PaperAirplaneIcon,
        items: [
          'A uniformed Medical Concierge representative with official identification greets you personally upon arrival in Mexico.',
          'VIP personalized welcome and baggage assistance.',
          'Immediate transfer to a secure private executive fleet vehicle.',
          'Chauffeured transport directly to your designated hotel with fully assisted check-in.',
        ],
      },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Clinical Pre-Op & Dedicated On-Site Logistics',
    subtitle: 'Every clinical touchpoint is coordinated',
    description:
      'Before the procedure, we remove administrative friction and keep the patient supported through testing, consultations and transport.',
    icon: BeakerIcon,
    steps: [
      {
        title: 'Pre-Operative Preparation Staging',
        icon: BeakerIcon,
        items: [
          'Scheduled private transfers between your hotel and the clinical campus.',
          'In-person specialist consultations and final physical evaluations.',
          'On-site diagnostic imaging, laboratory blood work and pre-anesthesia clearance.',
          'Dedicated administrative assistance and fluent translation during all clinical interactions.',
        ],
      },
      {
        title: 'Seamless Intra-City Chauffeur Services',
        icon: TruckIcon,
        items: [
          'Transportation to accredited hospitals, surgical centers and outpatient clinics.',
          'Private transfers to specialist offices and external laboratories.',
          'Chauffeured access to pharmacies, recommended restaurants and shopping centers.',
          'Approved light tourism destinations when explicitly authorized by your treating physician.',
        ],
      },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Surgical Procedure, Ward Care & Recovery',
    subtitle: 'Hospital care and recovery support stay connected',
    description:
      'On treatment day and after discharge, the concierge team coordinates the operational details so the patient can focus on healing.',
    icon: HeartIcon,
    steps: [
      {
        title: 'In-Patient Care & Surgical Management',
        icon: HeartIcon,
        items: [
          'Escorting and advocacy during hospital admission and registration.',
          'Real-time administrative coordination with the hospital international wing.',
          'Continuous proactive updates for family members and emergency contacts.',
          'Post-operative follow-up and on-site hospitality management.',
        ],
      },
      {
        title: 'Post-Operative Concierge & Recovery Care',
        icon: HomeModernIcon,
        items: [
          'Specialized medical transport from the hospital to your recovery suite.',
          'In-suite nursing visits, surgical dressing changes and wound care management.',
          'Coordinated private transit to physical rehabilitation centers if clinically required.',
          'Prescription fulfillment and delivery of post-op medications.',
          'Around-the-clock concierge emergency and logistical support.',
        ],
      },
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Specialized Executive Protection & Curated Leisure',
    subtitle: 'Bespoke support when the patient profile requires it',
    description:
      'For selected patients, the experience can include advanced private protection and curated local culture once medically cleared.',
    icon: ShieldCheckIcon,
    steps: [
      {
        title: 'Specialized Executive Security & Close Protection',
        icon: ShieldCheckIcon,
        items: [
          'Certified close protection officers for high-net-worth individuals, executives or public figures.',
          'Asset protection teams and private security details.',
          'Armored executive vehicles with B6/B7 ballistic level protection and secure motorcades.',
          'Security operations dispatched exclusively through licensed, federally authorized private security firms in Mexico.',
        ],
      },
      {
        title: 'Post-Recovery Curated Leisure & Local Culture',
        icon: MapPinIcon,
        items: [
          'Reservations at award-winning fine dining restaurants.',
          'Private curated cultural tours and excursions.',
          'Chauffeured day trips to premium vineyards and historic downtown districts.',
          'Private shopping experiences with dedicated executive transport.',
        ],
      },
    ],
  },
  {
    phase: 'Phase 6',
    title: 'Departure & Continuous International Care',
    subtitle: 'A safe return with follow-up continuity',
    description:
      'The journey continues through departure, telemedicine follow-up and long-term bilingual patient advocacy.',
    icon: UserGroupIcon,
    steps: [
      {
        title: 'Safe Return Journey',
        icon: PaperAirplaneIcon,
        items: [
          'Assisted hotel check-out and comprehensive luggage handling.',
          'Private executive transfer back to the international airport.',
          'Gate-side logistics support during boarding and international departure.',
        ],
      },
      {
        title: 'Lifelong International Follow-Up Continuity',
        icon: ClockIcon,
        items: [
          'Scheduled virtual telemedicine follow-up appointments with your surgeon.',
          'Remote review of post-op local labs and recovery diagnostic imaging.',
          'Direct communication channel with your specialist for long-term health monitoring.',
          'Continuous bilingual patient advocacy and support.',
        ],
      },
    ],
  },
]

const premiumServices = [
  {
    title: 'Elite Logistics',
    description: 'VIP airport reception, private chauffeured executive ground fleets and complete luggage management.',
    icon: TruckIcon,
  },
  {
    title: 'Luxury Hospitality',
    description: 'Partnered stays at top-tier, recovery-optimized hotels and resorts.',
    icon: HomeModernIcon,
  },
  {
    title: 'Clinical Excellence',
    description: 'Globally accredited hospital networks, advanced diagnostic facilities and elite board-certified specialists.',
    icon: BeakerIcon,
  },
  {
    title: 'Concierge Care',
    description: '24/7 local support, dedicated bilingual medical case managers and continuous family communication channels.',
    icon: UserGroupIcon,
  },
  {
    title: 'Bespoke Options',
    description: 'Tailored local tourism, private chef dietary adjustments and accredited close protection security details.',
    icon: SparklesIcon,
  },
]

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })

  const [settings, journeyData] = await Promise.all([
    getSiteSettings(),
    payload.findGlobal({ slug: 'patient-journey' }),
  ])

  const journey = journeyData as unknown as PatientJourneyType
  const companyName = settings?.companyName || 'Elite Medical Journey'
  const heroImage = (journey.heroCover as MedicalAsset)?.url

  return {
    title: `Patient Journey for Medical Tourism in Mexico | ${companyName}`,
    description:
      'A premium bilingual medical tourism patient journey with clinical review, executive logistics, hospital coordination, concierge recovery and international follow-up.',
    alternates: {
      canonical: '/patient-journey',
    },
    openGraph: {
      title: `${journeyHeroTitle} | ${companyName}`,
      description: journeyHeroDescription,
      type: 'website',
      siteName: companyName,
      images: heroImage ? [{ url: heroImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${journeyHeroTitle} | ${companyName}`,
      description: journeyHeroDescription,
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

  const howToSteps = journeyPhases.flatMap((phase) =>
    phase.steps.map((step) => ({
      phase: phase.title,
      ...step,
    })),
  )

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: journeyHeroTitle,
    description: journeyHeroDescription,
    step: howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `${step.phase}: ${step.title}`,
      text: step.items.join(' '),
    })),
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section className="relative flex min-h-[640px] w-full items-center overflow-hidden bg-slate-950">
        {heroImage?.url && (
          <Image
            src={heroImage.url}
            alt={heroImage.alt || 'Medical tourism patient journey in Mexico'}
            fill
            className="absolute inset-0 z-0 object-cover object-center opacity-50"
            priority
          />
        )}
        <div className="absolute inset-0 z-0 bg-slate-950/55" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.86fr] lg:items-end lg:px-8">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100 backdrop-blur">
              <ShieldCheckIcon className="h-4 w-4" />
              Premium medical travel coordination
            </span>
            <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-6xl">
              {journeyHeroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg font-medium leading-8 text-slate-100 md:text-xl">
              {journeyHeroDescription}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#start-journey"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-blue-50"
              >
                Start my journey today
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/procedures"
                className="inline-flex items-center justify-center rounded-lg border border-white/35 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                Explore procedures
              </Link>
            </div>
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
                  Bilingual care, from first contact to follow-up.
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Patients are supported by English/Spanish medical case managers, professional interpreters and a local concierge team across intake, records, hospital arrival, discharge, recovery and return-home follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ['Secure clinical intake', 'Encrypted forms, medical record upload and specialist review before travel.'],
            ['Executive logistics', 'VIP reception, private transportation, assisted check-in and synchronized scheduling.'],
            ['Continuous recovery support', 'Concierge recovery care, family updates and international telemedicine follow-up.'],
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
                Patient journey
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                A clean, crawlable roadmap from inquiry to lifelong follow-up.
              </h2>
            </div>
            <p className="text-lg leading-8 text-slate-700">
              The experience is organized into six phases. On desktop, each phase is presented in a scan-friendly grid. On mobile, the same content becomes a linear timeline so patients can follow the journey step by step.
            </p>
          </div>

          <ol className="mt-14 grid gap-6 lg:grid-cols-2">
            {journeyPhases.map((phase) => {
              const PhaseIcon = phase.icon

              return (
                <li
                  key={phase.title}
                  className="relative border-l border-slate-300 pl-6 lg:border-l-0 lg:pl-0"
                >
                  <span className="absolute -left-[19px] top-7 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-950 text-white shadow-lg lg:hidden">
                    <PhaseIcon className="h-5 w-5" />
                  </span>

                  <article className="h-full rounded-lg border border-white bg-white/90 p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl md:p-8">
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-white">
                            {phase.phase}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
                            {phase.subtitle}
                          </span>
                        </div>
                        <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-950 md:text-3xl">
                          {phase.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-slate-600">
                          {phase.description}
                        </p>
                      </div>
                      <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white lg:flex">
                        <PhaseIcon className="h-7 w-7" />
                      </div>
                    </div>

                    <div className="mt-8 grid gap-5">
                      {phase.steps.map((step) => {
                        const StepIcon = step.icon

                        return (
                          <section key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                            <div className="flex gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-brand-primary shadow-sm ring-1 ring-slate-200">
                                <StepIcon className="h-5 w-5" />
                              </span>
                              <div>
                                <h4 className="text-lg font-extrabold text-slate-950">{step.title}</h4>
                                <ul className="mt-4 grid gap-3">
                                  {step.items.map((item) => (
                                    <li key={item} className="flex gap-3 text-sm font-medium leading-6 text-slate-700">
                                      <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                                      {item}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </section>
                        )
                      })}
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              All-inclusive premium services
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              The operational details are handled for you.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
            {premiumServices.map((service) => {
              const Icon = service.icon

              return (
                <article key={service.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
            Our unwavering commitment
          </p>
          <blockquote className="mt-6 text-2xl font-black leading-tight tracking-tight md:text-4xl">
            We manage every operational and logistical detail so your mind and body can focus exclusively on healing.
          </blockquote>
          <p className="mx-auto mt-6 max-w-4xl text-lg leading-8 text-slate-300">
            From the moment your plane lands in Mexico until the moment you safely return to your home country, our elite team stands beside you with world-class clinical coordination, reliable logistics, secure transportation and highly personalized service.
          </p>
          <Link
            href="#start-journey"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-blue-50"
          >
            Start my journey today
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="start-journey" className="scroll-mt-24 bg-[#eef5fb] py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
              Start my journey today
            </p>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Tell us what you need and we will route your case to the right medical team.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              A bilingual coordinator can help review your goals, match you with a specialist,
              explain the next step and keep communication clear before you travel.
            </p>
            <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              {[
                'English and Spanish coordination',
                'Doctor or procedure matching',
                'Travel and recovery guidance',
                'Private follow-up by the concierge team',
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
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

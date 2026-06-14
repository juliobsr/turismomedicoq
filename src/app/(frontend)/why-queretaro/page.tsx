import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  CheckCircleIcon,
  GlobeAmericasIcon,
  HeartIcon,
  HomeModernIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export const revalidate = 3600

const heroImage = '/media/globals/queretaro-panoramica-1-1920x1080.jpg'
const aqueductImage = '/media/globals/ACUEDUCTO-DE-QUERETARO1-1.jpg'
const cityImage = '/media/globals/queretaro-panoramica-1.jpg'

export const metadata: Metadata = {
  title: 'Why Queretaro for Medical Tourism in Mexico',
  description:
    'Why American patients choose Queretaro for medical treatment in Mexico: modern private care, bilingual coordination, direct US flight access, calm recovery zones and access to San Miguel de Allende, Bernal and the historic center.',
  alternates: {
    canonical: '/why-queretaro',
  },
  keywords: [
    'medical tourism Queretaro',
    'medical treatment Mexico for Americans',
    'Queretaro recovery after surgery',
    'San Miguel de Allende medical tourism',
    'private hospitals Queretaro',
    'Queretaro airport direct flights US',
    'QRO airport medical tourism',
  ],
  openGraph: {
    title: 'Why Queretaro for Medical Tourism in Mexico',
    description:
      'A safer, calmer and more sophisticated base for American patients seeking medical treatment in Mexico.',
    type: 'website',
    images: [{ url: heroImage }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Queretaro for Medical Tourism in Mexico',
    description:
      'Modern medical care, bilingual support and recovery settings designed for international patients.',
    images: [heroImage],
  },
}

const decisionPoints = [
  {
    title: 'Modern private care without border-city chaos',
    description:
      'Queretaro gives American patients access to a sophisticated urban environment, strong private medical infrastructure and a calmer rhythm than many high-volume medical tourism corridors.',
    icon: BuildingOffice2Icon,
  },
  {
    title: 'A recovery city that feels secure and orderly',
    description:
      'Patients and companions can move through a city known for business, education, clean urban development and a quality of life that feels measured rather than overwhelming.',
    icon: ShieldCheckIcon,
  },
  {
    title: 'Bilingual support for the whole journey',
    description:
      'The patient experience is designed around English and Spanish communication: intake, records, appointments, discharge instructions and follow-up.',
    icon: GlobeAmericasIcon,
  },
]

const recoveryZones = [
  {
    title: 'Centro Sur',
    subtitle: 'Practical, close and medical-focused',
    description:
      'Ideal for patients who want to stay near major private hospital corridors, modern hotels, business services and easy transportation while recovering with less friction.',
    icon: HomeModernIcon,
    href: '/patient-journey',
  },
  {
    title: 'Historic Center of Queretaro',
    subtitle: 'Culture within an easy pace',
    description:
      'A strong option for later-stage recovery or companions who want walkable plazas, restaurants, colonial architecture and a UNESCO-listed historic environment.',
    icon: MapPinIcon,
    href: '/patient-journey/recovery/colonial-queretaro',
  },
  {
    title: 'San Miguel de Allende',
    subtitle: 'International community and refined long-stay appeal',
    description:
      'A world-famous colonial city with a large international community, boutique hospitality and a familiar social environment for many American visitors.',
    icon: SparklesIcon,
    href: '/patient-journey/recovery/recovery-in-san-miguel-de-allende',
  },
  {
    title: 'Bernal',
    subtitle: 'Quiet scenery and restorative energy',
    description:
      'A peaceful Pueblo Magico known for Pena de Bernal, local gastronomy and a slower pace that can fit patients looking for a quiet, scenic recovery setting.',
    icon: HeartIcon,
    href: '/patient-journey/recovery/recovery-in-bernal',
  },
]

const proofPoints = [
  'A UNESCO-listed historic center with architecture, plazas and cultural depth.',
  'San Miguel de Allende nearby for patients who value an established international lifestyle scene.',
  'Bernal and the wine-and-cheese region for peaceful recovery weekends and companion travel.',
  'Centro Sur for practical post-treatment stays close to hospitals, hotels and mobility routes.',
]

const airportConnections = [
  {
    city: 'Houston',
    detail: 'Direct service through IAH gives patients access to one of the largest US connection hubs.',
  },
  {
    city: 'Dallas-Fort Worth',
    detail: 'DFW connectivity helps patients from Texas and beyond reach Queretaro with fewer travel steps.',
  },
  {
    city: 'San Antonio',
    detail: 'A short direct route makes Queretaro especially practical for patients in South Texas.',
  },
  {
    city: 'Denver and Orlando',
    detail: 'Recently announced routes expand the US footprint and make Queretaro easier to consider from more regions.',
  },
]

export default function WhyQueretaroPage() {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="relative min-h-[720px] bg-slate-950">
        <Image
          src={heroImage}
          alt="Panoramic view of Queretaro, Mexico"
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-950/50" />
        <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl flex-col justify-end px-4 py-20 sm:px-6 lg:px-8">
          <p className="mb-5 inline-flex w-fit items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100 backdrop-blur">
            <ShieldCheckIcon className="h-4 w-4" />
            Medical tourism in Mexico, rethought
          </p>
          <h1 className="max-w-5xl text-5xl font-black leading-[1.02] tracking-tight text-white md:text-7xl">
            Why American patients should look beyond the obvious.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100 md:text-xl">
            Queretaro offers a rare balance for medical travel: modern private care, bilingual coordination, a safer-feeling urban experience and recovery settings that make the patient journey feel planned instead of improvised.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/patient-journey"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-slate-950 transition hover:bg-slate-100"
            >
              Plan the journey
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link
              href="/doctors"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/35 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
            >
              Meet specialists
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-8 text-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            ['For patients', 'Less uncertainty, clearer communication and a calmer place to heal.'],
            ['For companions', 'A city with culture, restaurants, hotels and practical mobility.'],
            ['For recovery', 'Options that range from hospital-close stays to historic and scenic escapes.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-lg border border-white/10 bg-white/[0.06] p-5">
              <h2 className="text-lg font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              href: '/medical-tourism-mexico',
              title: 'Medical tourism in Mexico',
              description: 'Understand why Mexico attracts U.S. patients and how Queretaro changes the experience.',
            },
            {
              href: '/affordable-medical-treatments-mexico',
              title: 'Affordable treatments in Mexico',
              description: 'Compare treatment value with safety, hospital quality and bilingual coordination in mind.',
            },
            {
              href: '/medical-tourism-mexico-costs',
              title: 'Medical tourism costs',
              description: 'Review the factors that shape the real cost of treatment, travel and recovery.',
            },
          ].map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="rounded-lg border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl"
            >
              <h2 className="text-lg font-black text-slate-950">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{resource.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#eef5f2] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              The strategic advantage
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Queretaro is built for patients who want quality without feeling exposed.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Many American patients compare Mexico through a narrow lens: price, distance and procedure availability. Queretaro adds something more important to the decision: a complete environment for care. The city feels modern, orderly and connected, while still offering the hospitality, culture and recovery value that make Mexico attractive.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              For patients traveling with a spouse, adult child or friend, that matters. Recovery is not just what happens after discharge. It is where you sleep, how easily you move, whether instructions are understood, and whether your companion feels comfortable staying by your side.
            </p>
          </div>

          <div className="grid gap-5">
            {decisionPoints.map((point) => {
              const Icon = point.icon

              return (
                <article key={point.title} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <div className="flex gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-950">{point.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{point.description}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              Air access from the United States
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Getting to Queretaro is easier than many patients expect.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              For medical travel, connectivity matters. Fewer transfers can mean less stress before a consultation and a smoother return home after the doctor clears travel. Queretaro International Airport gives patients direct and expanding access to several US cities, while still keeping the arrival experience smaller and calmer than Mexico’s largest airports.
            </p>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              That combination is useful for patients and companions: direct flights into QRO, straightforward ground access to Centro Sur, and recovery zones that are close enough to feel planned rather than improvised.
            </p>
          </div>

          <div className="grid gap-4">
            {airportConnections.map((connection) => (
              <article key={connection.city} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
                <div className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-950">{connection.city}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{connection.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-8">
          <div className="relative min-h-[560px] overflow-hidden rounded-lg bg-slate-200 shadow-2xl shadow-slate-900/15">
            <Image
              src={aqueductImage}
              alt="Historic aqueduct in Queretaro"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              A stronger recovery setting
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              The best treatment destination is also a good place to recover.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              Queretaro gives patients more than an appointment. It gives them a base. The historic center offers culture and a walkable colonial atmosphere. Centro Sur offers the practical side of recovery: modern hotels, hospital access and straightforward mobility. San Miguel de Allende and Bernal add memorable recovery options for patients who want a longer, quieter or more scenic stay after the critical medical window.
            </p>

            <ul className="mt-8 space-y-4">
              {proofPoints.map((point) => (
                <li key={point} className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-700">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-blue-300">
              Recovery zones
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              Four ways to make recovery feel less clinical.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Every patient is different. Some want to stay close to medical services. Others want a beautiful, quiet place once the doctor clears them for a more relaxed phase of recovery.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {recoveryZones.map((zone) => {
              const Icon = zone.icon

              return (
                <Link
                  key={zone.title}
                  href={zone.href}
                  className="group rounded-lg border border-white/10 bg-white/[0.06] p-6 transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-slate-950">
                      <Icon className="h-6 w-6" />
                    </span>
                    <ArrowRightIcon className="h-5 w-5 text-blue-300 transition group-hover:translate-x-1" />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                    {zone.subtitle}
                  </p>
                  <h3 className="mt-3 text-2xl font-extrabold">{zone.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{zone.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="relative bg-[#eef5f2] py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-primary">
              Built for United States patients
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              Familiar expectations, Mexican hospitality, better recovery value.
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-700">
              American patients often need more than a lower procedure cost. They need confidence that medical instructions will be clear, that a companion can participate, that the city is comfortable to navigate and that recovery will not feel isolating. Queretaro is one of the few Mexican destinations that can support that full picture.
            </p>
            <Link
              href="/patient-journey"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-brand-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white transition hover:brightness-110"
            >
              See the patient journey
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          <div className="relative min-h-[460px] overflow-hidden rounded-lg bg-slate-200 shadow-xl shadow-slate-900/10">
            <Image
              src={cityImage}
              alt="Queretaro city landscape"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 620px"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

import Link from 'next/link'
import {
  ArrowRightIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  CurrencyDollarIcon,
  GlobeAmericasIcon,
  HeartIcon,
  MapPinIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

type HeroCta = {
  href: string
  label: string
}

type Feature = {
  title: string
  description: string
}

type Faq = {
  question: string
  answer: string
}

type RelatedLink = {
  href: string
  title: string
  description: string
}

interface MedicalTourismPageProps {
  eyebrow: string
  title: string
  description: string
  primaryCta: HeroCta
  secondaryCta: HeroCta
  introTitle: string
  introBody: string[]
  featuresTitle: string
  features: Feature[]
  costTitle: string
  costBody: string[]
  safetyTitle: string
  safetyBody: string[]
  faqs: Faq[]
  relatedLinks: RelatedLink[]
  jsonLd: Record<string, unknown>
}

const icons = [
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ClipboardDocumentCheckIcon,
  GlobeAmericasIcon,
  HeartIcon,
  SparklesIcon,
]

export const MedicalTourismPage = ({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  introTitle,
  introBody,
  featuresTitle,
  features,
  costTitle,
  costBody,
  safetyTitle,
  safetyBody,
  faqs,
  relatedLinks,
  jsonLd,
}: MedicalTourismPageProps) => {
  return (
    <main className="bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(14,165,233,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.22),transparent_30%),linear-gradient(135deg,#020617,#0f172a_54%,#082f49)]" />
        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_0.78fr] lg:px-8">
          <div className="max-w-4xl text-white">
            <p className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.22em] text-cyan-100 backdrop-blur">
              <GlobeAmericasIcon className="h-4 w-4" />
              {eyebrow}
            </p>
            <h1 className="text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              {title}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-100 md:text-xl">
              {description}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-50"
              >
                {primaryCta.label}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-lg border border-white/35 px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/10"
              >
                {secondaryCta.label}
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-white/10 bg-white/10 p-6 text-white shadow-2xl backdrop-blur">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-100">
              What patients compare
            </p>
            <div className="mt-5 space-y-4">
              {[
                'Total treatment cost and what is included',
                'Specialist credentials and hospital environment',
                'English-speaking coordination before and after travel',
                'Recovery location, follow-up and fit-to-fly planning',
              ].map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-200" />
                  <p className="text-sm leading-6 text-slate-100">{item}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#eef7f5] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
              Patient-first medical travel
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {introTitle}
            </h2>
          </div>
          <div className="space-y-5 text-lg leading-8 text-slate-700">
            {introBody.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
              Why it matters
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
              {featuresTitle}
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = icons[index % icons.length]

              return (
                <article key={feature.title} className="rounded-lg border border-slate-200 bg-slate-50 p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-black text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <article>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
              Cost clarity
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              {costTitle}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-200">
              {costBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-white/10 bg-white/[0.06] p-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">
              Safety and trust
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
              {safetyTitle}
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-8 text-slate-200">
              {safetyBody.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
                Questions patients ask
              </p>
              <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Medical tourism FAQs
              </h2>
            </div>
            <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-slate-50">
              {faqs.map((faq) => (
                <article key={faq.question} className="p-6">
                  <h3 className="text-xl font-black text-slate-950">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#eef5fb] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-700">
              Keep researching
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-slate-950">
              Related medical tourism resources
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <MapPinIcon className="h-7 w-7 text-blue-700" />
                <h3 className="mt-4 text-xl font-black text-slate-950 group-hover:text-blue-700">
                  {link.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-lg bg-slate-950 p-8 text-center text-white md:p-12">
          <h2 className="text-4xl font-black tracking-tight">Start with a clinical review, not a guess.</h2>
          <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            Tell us what procedure you are considering, what records you already have and what timeline you are comparing. A bilingual coordinator can help route your case to the right specialist.
          </p>
          <Link
            href="/procedures"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-slate-950 transition hover:bg-cyan-50"
          >
            Explore procedures
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  )
}

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ChatBubbleLeftRightIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

import { LeadReplyForm } from '@/app/components/LeadReplyForm'

type LeadReplyPageProps = {
  params: Promise<{
    folio: string
  }>
}

export const metadata: Metadata = {
  title: 'Secure Lead Reply',
  description: 'Send a secure reply to your medical coordinator.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LeadReplyPage({ params }: LeadReplyPageProps) {
  const { folio } = await params
  const decodedFolio = decodeURIComponent(folio)
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: 1,
    where: {
      folio: { equals: decodedFolio },
    },
  })

  const lead = result.docs[0]

  if (!lead) notFound()

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <span className="mb-5 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
              <ShieldCheckIcon className="h-4 w-4" />
              Secure coordinator reply
            </span>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Send a private message to your coordinator.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Your message will be attached to case <strong>{lead.folio}</strong> and routed to the coordination team.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-6">
            <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-200" />
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Use this page for questions, scheduling preferences, symptom updates, travel details or
              anything your coordinator should review before the next step.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <LeadReplyForm
          folio={lead.folio || decodedFolio}
          patientEmail={lead.email}
          patientName={lead.name}
        />
      </section>
    </main>
  )
}

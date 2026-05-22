import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ShieldCheckIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline'

import { LeadFileUploadForm } from '@/app/components/LeadFileUploadForm'

type LeadUploadPageProps = {
  params: Promise<{
    folio: string
  }>
}

export const metadata: Metadata = {
  title: 'Secure Medical File Upload',
  description: 'Upload medical records, images and PDF files for your medical tourism case review.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LeadUploadPage({ params }: LeadUploadPageProps) {
  const { folio } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'leads',
    depth: 0,
    limit: 1,
    where: {
      folio: { equals: decodeURIComponent(folio) },
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
              Secure case upload
            </span>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Upload your medical records for review.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Your coordinator will attach these files to case <strong>{lead.folio}</strong> and route them to the medical team.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/10 p-6">
            <DocumentArrowUpIcon className="h-10 w-10 text-blue-200" />
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Please upload only files related to your case, such as imaging studies, lab reports,
              prescriptions, diagnosis notes or previous treatment summaries.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-14">
        <LeadFileUploadForm folio={lead.folio || decodeURIComponent(folio)} />
      </section>
    </main>
  )
}

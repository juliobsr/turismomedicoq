'use client'

import { useState, useTransition } from 'react'
import {
  uploadLeadFileAction,
  type UploadLeadFileState,
} from '@/app/actions/uploadLeadFile'

type LeadFileUploadFormProps = {
  folio: string
}

export const LeadFileUploadForm = ({ folio }: LeadFileUploadFormProps) => {
  const [state, setState] = useState<UploadLeadFileState | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await uploadLeadFileAction(null, formData)
      setState(result)
      if (result.success) form.reset()
    })
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-2xl shadow-slate-950/15 ring-1 ring-slate-200 md:p-8">
      {state && (
        <div
          className={`mb-5 rounded-lg border p-4 text-sm font-semibold ${
            state.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <input type="hidden" name="folio" value={folio} />

        <div>
          <label htmlFor="file" className="mb-2 block text-sm font-extrabold text-slate-800">
            Medical file
          </label>
          <input
            id="file"
            name="file"
            type="file"
            required
            accept="application/pdf,image/*"
            disabled={isPending}
            className="block w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-bold file:text-blue-700 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            Accepted formats: PDF, JPG, PNG or other image files. Maximum size: 15 MB.
          </p>
        </div>

        <div>
          <label htmlFor="patientNote" className="mb-2 block text-sm font-extrabold text-slate-800">
            Note for your coordinator
          </label>
          <textarea
            id="patientNote"
            name="patientNote"
            rows={4}
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            placeholder="Example: MRI report from March 2026, lumbar spine."
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Uploading securely...' : 'Upload file'}
        </button>
      </form>
    </div>
  )
}

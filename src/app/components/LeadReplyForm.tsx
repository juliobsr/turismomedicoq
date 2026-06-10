'use client'

import { useState, useTransition } from 'react'
import {
  submitLeadReplyAction,
  type SubmitLeadReplyState,
} from '@/app/actions/submitLeadReply'

type LeadReplyFormProps = {
  folio: string
  patientEmail?: string | null
  patientName?: string | null
}

export const LeadReplyForm = ({ folio, patientEmail, patientName }: LeadReplyFormProps) => {
  const [state, setState] = useState<SubmitLeadReplyState | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await submitLeadReplyAction(null, formData)
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

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="patientName" className="mb-2 block text-sm font-extrabold text-slate-800">
              Your name
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              required
              defaultValue={patientName || ''}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            {state?.errors?.patientName && <p className="mt-2 text-xs font-semibold text-red-600">{state.errors.patientName[0]}</p>}
          </div>

          <div>
            <label htmlFor="patientEmail" className="mb-2 block text-sm font-extrabold text-slate-800">
              Your email
            </label>
            <input
              id="patientEmail"
              name="patientEmail"
              type="email"
              required
              defaultValue={patientEmail || ''}
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            />
            {state?.errors?.patientEmail && <p className="mt-2 text-xs font-semibold text-red-600">{state.errors.patientEmail[0]}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-extrabold text-slate-800">
            Message for your coordinator
          </label>
          <textarea
            id="message"
            name="message"
            rows={8}
            required
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            placeholder="Write your questions, updates, symptoms, travel notes or scheduling preferences."
          />
          {state?.errors?.message && <p className="mt-2 text-xs font-semibold text-red-600">{state.errors.message[0]}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-blue-700 px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Sending securely...' : 'Send secure reply'}
        </button>
      </form>
    </div>
  )
}

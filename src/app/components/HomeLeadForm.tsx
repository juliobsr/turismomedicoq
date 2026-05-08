'use client'

import { useState, useTransition } from 'react'
import {
  submitHomeLeadAction,
  type SubmitHomeLeadState,
} from '@/app/actions/submitHomeLead'

type Option = {
  id: string
  name: string
}

type HomeLeadFormProps = {
  doctors: Option[]
  procedures: Option[]
}

export const HomeLeadForm = ({ doctors, procedures }: HomeLeadFormProps) => {
  const [state, setState] = useState<SubmitHomeLeadState | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await submitHomeLeadAction(null, formData)
      setState(result)
      if (result.success) form.reset()
    })
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-2xl shadow-slate-950/20 ring-1 ring-white/40 md:p-8">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
          Private case review
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950">
          Match me with a specialist
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Tell us what you need. Our team will route your request to the right doctor or treatment coordinator.
        </p>
      </div>

      {state && (
        <div
          className={`mb-5 rounded-lg border p-4 text-sm font-medium ${
            state.success
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-800'
          }`}
        >
          {state.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="doctorId" className="mb-1 block text-sm font-semibold text-slate-700">
            Preferred specialist
          </label>
          <select
            id="doctorId"
            name="doctorId"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            disabled={isPending}
            defaultValue="any"
          >
            <option value="any">Help me choose</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="procedureId" className="mb-1 block text-sm font-semibold text-slate-700">
            Treatment interest
          </label>
          <select
            id="procedureId"
            name="procedureId"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            disabled={isPending}
            defaultValue="general"
          >
            <option value="general">General medical consultation</option>
            {procedures.map((procedure) => (
              <option key={procedure.id} value={procedure.id}>
                {procedure.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="name" className="mb-1 block text-sm font-semibold text-slate-700">
            Full name
          </label>
          <input
            id="name"
            name="name"
            required
            disabled={isPending}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
          {state?.errors?.name && <p className="mt-1 text-xs text-red-600">{state.errors.name[0]}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
            {state?.errors?.email && <p className="mt-1 text-xs text-red-600">{state.errors.email[0]}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-semibold text-slate-700">
              Phone / WhatsApp
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
            />
            {state?.errors?.phone && <p className="mt-1 text-xs text-red-600">{state.errors.phone[0]}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="mb-1 block text-sm font-semibold text-slate-700">
            What are you hoping to solve?
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            disabled={isPending}
            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-brand-primary px-5 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-lg shadow-blue-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? 'Submitting securely...' : 'Request my consultation'}
        </button>
      </form>
    </div>
  )
}

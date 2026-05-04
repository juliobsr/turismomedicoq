// src/components/LeadCaptureForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { submitLeadAction, type SubmitLeadState } from '@/app/actions/submitLead'

interface LeadCaptureFormProps {
  doctorId: string 
  doctorName: string
}

/**
 * Enterprise Component: LeadCaptureForm
 * Purpose: Interactive Client Component for patient inquiries.
 * Architecture: Uses Next.js Server Actions for JavaScript-disabled fallback & security.
 */
export const LeadCaptureForm = ({ doctorId, doctorName }: LeadCaptureFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<SubmitLeadState | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    // Execute the Server Action inside a transition to maintain UI responsiveness
    startTransition(async () => {
      const result = await submitLeadAction(null, formData)
      setFormState(result)
      
      if (result.success) {
        (event.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Request a Consultation</h3>
      <p className="text-sm text-gray-500 mb-6">
        Leave your details and our team will coordinate your appointment with <strong>{doctorName}</strong>.
      </p>

      {formState?.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium">
          {formState.message}
        </div>
      )}

      {formState?.success === false && !formState.errors && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg font-medium">
          {formState.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* HIDDEN INPUT: Links the Lead to the Doctor relationship in PostgreSQL */}
        <input type="hidden" name="doctor" value={doctorId} />

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
          />
          {formState?.errors?.name && <p className="mt-1 text-sm text-red-600">{formState.errors.name[0]}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
            {formState?.errors?.email && <p className="mt-1 text-sm text-red-600">{formState.errors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              disabled={isPending}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            />
            {formState?.errors?.phone && <p className="mt-1 text-sm text-red-600">{formState.errors.phone[0]}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Medical Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            disabled={isPending}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 resize-none"
          />
          {formState?.errors?.notes && <p className="mt-1 text-sm text-red-600">{formState.errors.notes[0]}</p>}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-70 transition-all"
        >
          {isPending ? 'Submitting securely...' : 'Request Consultation'}
        </button>
      </form>
    </div>
  )
}
'use client'

import { useState, useTransition } from 'react'
import { submitLeadAction, type SubmitLeadState } from '@/app/actions/submitLead'

// STRICT TYPING: For the dynamic dropdown options
export interface SelectOption {
  id: string;
  name: string;
}

export interface LeadCaptureFormProps {
  // 'doctor' means we are on a doctor's page. 'procedure' means we are on a procedure page.
  context: 'doctor' | 'procedure'; 
  fixedEntityId: string;
  fixedEntityName: string;
  dynamicOptions: SelectOption[];
}

/**
 * Enterprise Component: Context-Aware LeadCaptureForm
 * Architecture: Adapts its UI depending on whether it's rendered on a 
 * Doctor profile or a Procedure detail page.
 */
export const LeadCaptureForm = ({ 
  context, 
  fixedEntityId, 
  fixedEntityName, 
  dynamicOptions = [] 
}: LeadCaptureFormProps) => {
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<SubmitLeadState | null>(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await submitLeadAction(null, formData)
      setFormState(result)
      if (result.success) (event.target as HTMLFormElement).reset()
    })
  }

  // Derived UI states based on context
  const isDoctorContext = context === 'doctor'
  const title = isDoctorContext ? `Consult with ${fixedEntityName}` : `Inquire about ${fixedEntityName}`
  const selectLabel = isDoctorContext ? 'Select a Procedure' : 'Select a Specialist'
  const selectName = isDoctorContext ? 'procedureId' : 'doctorId'

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">
        Leave your details and our medical team will coordinate your appointment.
      </p>

      {/* Status Messages */}
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
        {/* 
          HIDDEN INPUTS: 
          If context is 'doctor', we hide doctorId and let them select procedureId.
          If context is 'procedure', we hide procedureId and let them select doctorId.
        */}
        {isDoctorContext ? (
          <input type="hidden" name="doctorId" value={fixedEntityId} />
        ) : (
          <input type="hidden" name="procedureId" value={fixedEntityId} />
        )}

        {/* DYNAMIC SELECTOR */}
        <div>
          <label htmlFor={selectName} className="block text-sm font-medium text-gray-700 mb-1">
            {selectLabel}
          </label>
          <select
            id={selectName}
            name={selectName}
            required
            disabled={isPending || dynamicOptions.length === 0} // 🚀 UX: Disable if no options
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 bg-white disabled:bg-gray-100 disabled:text-gray-400"
          >
            {dynamicOptions.length === 0 ? (
              <option value="" disabled selected>No options available</option>
            ) : (
              <option value="" disabled selected>-- Choose an option --</option>
            )}
            {/* 🚀 UX FIX: Inject General Consultation only on Doctor Profiles */}
            {isDoctorContext && dynamicOptions.length > 0 && (
              <option value="general" className="font-semibold text-blue-700">
                General Consultation / Evaluation
              </option>
            )}
            {/* Safe mapping: dynamicOptions is guaranteed to be an array here */}
            {dynamicOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          {formState?.errors?.[selectName] && (
            <p className="mt-1 text-sm text-red-600">{formState.errors[selectName][0]}</p>
          )}
        </div>

        {/* ... (Keep your existing name, email, phone, and notes inputs here) ... */}
        {/* standard fields omitted for brevity, keep them exactly as they were */}
        
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input type="text" id="name" name="name" required disabled={isPending} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" required disabled={isPending} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input type="tel" id="phone" name="phone" required disabled={isPending} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
          </div>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
          <textarea id="notes" name="notes" rows={3} disabled={isPending} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 resize-none" />
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
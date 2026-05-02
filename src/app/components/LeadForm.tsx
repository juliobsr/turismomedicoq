'use client'

import { useState } from 'react'
import { createLeadAction } from '../(frontend)/actions/createLead'

export default function LeadForm({ doctorId }: { doctorId: string }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleFormSubmit(formData: FormData) {
    setStatus('submitting')
    const result = await createLeadAction(null, formData)
    
    if (result.success) {
      setStatus('success')
      // Sobrescribimos el mensaje del backend para que sea nativo
      setMessage('Your request has been successfully submitted.')
    } else {
      setStatus('error')
      setMessage('There was an issue processing your request. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 p-6 rounded-xl border border-green-200 my-8 text-center">
        <h3 className="text-xl font-bold text-green-800 mb-2">Request Received!</h3>
        <p className="text-green-700">{message}</p>
        <p className="text-sm text-green-600 mt-2">
          Our patient coordinator will reach out within 24 hours to schedule your consultation.
        </p>
      </div>
    )
  }

  return (
    <form action={handleFormSubmit} className="space-y-4 mt-8 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Request a Consultation</h3>
      
      <input type="hidden" name="doctorId" value={doctorId} />
      
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
        <input type="text" name="name" required className="w-full rounded-md border-gray-300 px-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="e.g., John Doe" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
          <input type="email" name="email" required className="w-full rounded-md border-gray-300 px-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="john@example.com" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input type="tel" name="phone" required className="w-full rounded-md border-gray-300 px-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">How can we help you?</label>
        <textarea name="notes" rows={3} className="w-full rounded-md border-gray-300 px-4 py-2 border focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="I have some questions regarding..."></textarea>
      </div>

      <button 
        type="submit" 
        disabled={status === 'submitting'}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
      >
        {status === 'submitting' ? 'Submitting...' : 'Book My Consultation'}
      </button>
      
      {status === 'error' && <p className="text-red-600 text-sm font-medium text-center">{message}</p>}
    </form>
  )
}
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'

// ============================================================================
// ENTERPRISE SECURITY: Contextual Lead Schema
// ============================================================================
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please provide a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  doctorId: z.string().uuid('Invalid Doctor Reference.'),
  
  // 🚀 ENTERPRISE UX: Handle "General Consultation" explicitly
  // We accept a UUID, the string 'general', or empty string, then transform it.
  procedureId: z.union([
    z.string().uuid(),
    z.literal('general'),
    z.literal('')
  ]).optional(),
  
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
})

export type SubmitLeadState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function submitLeadAction(
  prevState: SubmitLeadState | null,
  formData: FormData
): Promise<SubmitLeadState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    doctorId: formData.get('doctorId'),
    procedureId: formData.get('procedureId'),
    notes: formData.get('notes'),
  }

  const validatedData = leadSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the fields below.',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { procedureId, ...restData } = validatedData.data;

    // Check if it's a specific procedure or a general consultation
    const isSpecificProcedure = procedureId && procedureId !== 'general';

    await payload.create({
      collection: 'leads',
      data: {
        name: restData.name,
        email: restData.email,
        phone: restData.phone,
        doctor: restData.doctorId,
        // Only attach the procedure relationship if a valid UUID was sent
        ...(isSpecificProcedure && { procedure: procedureId }),
        notes: restData.notes || '',
        status: 'new',
      },
    })

    return { 
      success: true, 
      message: 'Your request has been successfully submitted. Our medical coordinator will contact you shortly!' 
    }
  } catch (error) {
    console.error('[SERVER ACTION ERROR] Failed to create Lead:', error)
    return { success: false, message: 'An internal server error occurred.' }
  }
}
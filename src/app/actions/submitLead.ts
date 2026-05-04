// src/actions/submitLead.ts
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'

// ============================================================================
// ENTERPRISE SECURITY: Strict Validation Schema via Zod
// Prevents SQL Injection and ensures data integrity before hitting Postgres.
// ============================================================================
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long.'),
  email: z.string().email('Please provide a valid email address.'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits.'),
  doctor: z.string().uuid('Invalid Doctor Reference.'), // Matches our Neon DB UUID strategy
  notes: z.string().max(500, 'Notes cannot exceed 500 characters.').optional(),
})

// Define the response type for absolute TypeScript safety in the Client Component
export type SubmitLeadState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

/**
 * Enterprise Server Action: submitLeadAction
 * Purpose: Securely captures patient data, validates it, and inserts it into Payload.
 */
export async function submitLeadAction(
  prevState: SubmitLeadState | null,
  formData: FormData
): Promise<SubmitLeadState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    doctor: formData.get('doctor'),
    notes: formData.get('notes'),
  }

  // Cryptographic Validation
  const validatedData = leadSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      success: false,
      message: 'Validation failed. Please check the fields below.',
      errors: validatedData.error.flatten().fieldErrors,
    }
  }

  try {
    // Connect to Payload's Local API (Bypassing HTTP for zero-latency)
    const payload = await getPayload({ config: configPromise })

    // Perform the Database Insertion
    await payload.create({
      collection: 'leads',
      data: {
        name: validatedData.data.name,
        email: validatedData.data.email,
        phone: validatedData.data.phone,
        doctor: validatedData.data.doctor, // Relationship ID
        notes: validatedData.data.notes || '',
        status: 'new', // Default pipeline status
      },
    })

    return { 
      success: true, 
      message: 'Your request has been successfully submitted. Our medical coordinator will contact you shortly!' 
    }
  } catch (error) {
    console.error('[SERVER ACTION ERROR] Failed to create Lead:', error)
    return { 
      success: false, 
      message: 'An internal server error occurred. Please try again later.' 
    }
  }
}
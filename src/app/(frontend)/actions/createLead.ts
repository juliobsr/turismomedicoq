// src/app/actions/createLead.ts
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'

// 1. Strict validation schema for incoming patient inquiries
const LeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required for international contact'),
  doctor: z.string().min(1, 'Doctor is required'),
  notes: z.string().max(1000, 'Message is too long').optional(),
  status: z.enum(['new', 'contacted', 'scheduled', 'completed', 'cancelled']).default('new'),
})

// Define the expected return type for our frontend component
export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

//Aqui comienza la funcion para crear el lead nuevo
export async function createLeadAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // 2. Extract and validate data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      doctor: formData.get('doctorId') as string,
      notes: formData.get('notes') as string,
      status: 'new' as const,// Estado inicial por defecto
    }
    const validatedData = LeadSchema.parse(rawData)
    // 3. Initialize Payload via Local API (No HTTP overhead, highly secure)
    const payload = await getPayload({ config: configPromise })
    await payload.create({
      collection: 'leads',
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        // Assuming your 'leads' collection has these fields configured
        doctor: validatedData.doctor, 
        notes: validatedData.notes,
        status: 'new', // Default status for operations team
       
      },
    })
    return {
      success: true,
      message: 'Thank you. Our medical concierge will contact you shortly.',
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please correct the highlighted fields.',
        errors: error.flatten().fieldErrors,
      }
    }
    console.error('Error al guardar lead:', error)
    return { success: false, message: 'Hubo un error al procesar tu solicitud.' }
  }
}


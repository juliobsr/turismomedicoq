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
  
  // 🚀 El doctor siempre será un número en Postgres
  doctorId: z.coerce.number(),
  
  // 🛡️ TECH LEAD FIX: Pre-procesamiento Inteligente para PostgreSQL
  // Si el formulario envía "general" o un string vacío, lo volvemos "undefined" 
  // para que no rompa la llave foránea (Foreign Key). Si es un número, lo parseamos.
  procedureId: z.preprocess((val) => {
    if (!val || val === 'general' || val === '') return undefined;
    const parsed = Number(val);
    return isNaN(parsed) ? undefined : parsed;
  }, z.number().optional()),
  
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
  // Extraemos los datos crudos del FormData
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    doctorId: formData.get('doctorId'),
    procedureId: formData.get('procedureId'),
    notes: formData.get('notes'),
  }

  // Parseo Seguro con Zod
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

    // 🚀 TECH LEAD FIX: Inyección Limpia
    await payload.create({
      collection: 'leads',
      data: {
        name: restData.name,
        email: restData.email,
        phone: restData.phone,
        // Corregido: Usamos restData.doctorId (que Zod ya convirtió en número)
        doctor: restData.doctorId, 
        status: 'new',
        // Inyectamos procedure SOLO si procedureId es un número válido
        ...(procedureId !== undefined ? { procedure: procedureId } : {}),
        notes: restData.notes || '',
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
'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'

const homeLeadSchema = z.object({
  name: z.string().min(2, 'Please enter your full name.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  doctorId: z.preprocess((value) => {
    if (!value || value === 'any') return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }, z.number().optional()),
  procedureId: z.preprocess((value) => {
    if (!value || value === 'general') return undefined
    const parsed = Number(value)
    return Number.isNaN(parsed) ? undefined : parsed
  }, z.number().optional()),
  notes: z.string().max(700, 'Please keep notes under 700 characters.').optional(),
})

export type SubmitHomeLeadState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function submitHomeLeadAction(
  _prevState: SubmitHomeLeadState | null,
  formData: FormData
): Promise<SubmitHomeLeadState> {
  const parsed = homeLeadSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    doctorId: formData.get('doctorId'),
    procedureId: formData.get('procedureId'),
    notes: formData.get('notes'),
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'Please check the highlighted fields.',
      errors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const { doctorId, procedureId, notes, ...contact } = parsed.data

    let resolvedDoctorId = doctorId

    if (!resolvedDoctorId && procedureId) {
      const doctorMatch = await payload.find({
        collection: 'doctors',
        depth: 0,
        limit: 1,
        where: {
          and: [
            { isActive: { equals: true } },
            { procedures: { contains: String(procedureId) } },
          ],
        },
      })

      resolvedDoctorId = Number(doctorMatch.docs[0]?.id)
    }

    if (!resolvedDoctorId) {
      const fallbackDoctor = await payload.find({
        collection: 'doctors',
        depth: 0,
        limit: 1,
        where: { isActive: { equals: true } },
        sort: 'fullName',
      })

      resolvedDoctorId = Number(fallbackDoctor.docs[0]?.id)
    }

    if (!resolvedDoctorId || Number.isNaN(resolvedDoctorId)) {
      return {
        success: false,
        message: 'No active specialists are available yet. Please contact us by phone.',
      }
    }

    await payload.create({
      collection: 'leads',
      data: {
        ...contact,
        doctor: resolvedDoctorId,
        status: 'new',
        ...(procedureId ? { procedure: procedureId } : {}),
        notes: [
          'Homepage medical tourism inquiry.',
          notes ? `Patient notes: ${notes}` : '',
        ].filter(Boolean).join('\n\n'),
      },
    })

    return {
      success: true,
      message: 'Your request is in. A medical coordinator will contact you shortly.',
    }
  } catch (error) {
    console.error('[HOME LEAD ERROR]', error)
    return {
      success: false,
      message: 'We could not submit your request. Please try again or contact us directly.',
    }
  }
}

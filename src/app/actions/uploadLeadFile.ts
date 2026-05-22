'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'

const uploadLeadFileSchema = z.object({
  folio: z.string().min(4),
  patientNote: z.string().max(700).optional(),
})

export type UploadLeadFileState = {
  success: boolean
  message: string
}

export async function uploadLeadFileAction(
  _prevState: UploadLeadFileState | null,
  formData: FormData
): Promise<UploadLeadFileState> {
  const parsed = uploadLeadFileSchema.safeParse({
    folio: formData.get('folio'),
    patientNote: formData.get('patientNote') || undefined,
  })

  if (!parsed.success) {
    return {
      success: false,
      message: 'We could not identify this case. Please use the secure link from your email.',
    }
  }

  const file = formData.get('file')

  if (!(file instanceof File) || file.size === 0) {
    return {
      success: false,
      message: 'Please choose a PDF or image file before submitting.',
    }
  }

  const isAllowedType = file.type === 'application/pdf' || file.type.startsWith('image/')

  if (!isAllowedType) {
    return {
      success: false,
      message: 'Only PDF and image files can be uploaded.',
    }
  }

  if (file.size > 15 * 1024 * 1024) {
    return {
      success: false,
      message: 'Please upload a file smaller than 15 MB.',
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const leadResult = await payload.find({
      collection: 'leads',
      depth: 0,
      limit: 1,
      where: {
        folio: { equals: parsed.data.folio },
      },
    })

    const lead = leadResult.docs[0]

    if (!lead) {
      return {
        success: false,
        message: 'We could not find this case folio. Please contact your coordinator.',
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadedFile = await payload.create({
      collection: 'lead-files',
      data: {
        lead: lead.id,
        originalName: file.name,
        patientNote: parsed.data.patientNote,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    })

    const existingFiles = Array.isArray(lead.uploadedFiles) ? lead.uploadedFiles : []
    const existingHistory = Array.isArray(lead.communicationHistory) ? lead.communicationHistory : []

    await payload.update({
      collection: 'leads',
      id: lead.id,
      data: {
        uploadedFiles: [...existingFiles.map((item) => (typeof item === 'object' ? item.id : item)), uploadedFile.id],
        communicationHistory: [
          ...existingHistory,
          {
            direction: 'inbound',
            eventType: 'file_uploaded',
            subject: file.name,
            message: parsed.data.patientNote || 'Patient uploaded a medical file.',
            file: uploadedFile.id,
            occurredAt: new Date().toISOString(),
            createdBy: 'patient',
          },
        ],
      },
      context: {
        skipLeadResponse: true,
      },
    })

    return {
      success: true,
      message: 'File uploaded successfully. Your coordinator can now review it.',
    }
  } catch (error) {
    console.error('[LEAD FILE UPLOAD ERROR]', error)
    return {
      success: false,
      message: 'We could not upload your file. Please try again or contact your coordinator.',
    }
  }
}

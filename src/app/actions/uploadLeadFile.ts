'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { z } from 'zod'
import { sendLeadFilesUploadNotification } from '@/hooks/notifyLeadFileUpload'

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

  const files = formData
    .getAll('file')
    .filter((item): item is File => item instanceof File && item.size > 0)

  if (!files.length) {
    return {
      success: false,
      message: 'Please choose one or more PDF or image files before submitting.',
    }
  }

  if (files.length > 10) {
    return {
      success: false,
      message: 'Please upload up to 10 files at a time.',
    }
  }

  for (const file of files) {
    const isAllowedType = file.type === 'application/pdf' || file.type.startsWith('image/')

    if (!isAllowedType) {
      return {
        success: false,
        message: `Only PDF and image files can be uploaded. Please remove "${file.name}" and try again.`,
      }
    }

    if (file.size > 15 * 1024 * 1024) {
      return {
        success: false,
        message: `"${file.name}" is larger than 15 MB. Please upload smaller files.`,
      }
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

    const uploadedFiles = []

    for (const file of files) {
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
        context: {
          skipLeadFileNotification: true,
        },
      })

      uploadedFiles.push(uploadedFile)
    }

    const existingFiles = Array.isArray(lead.uploadedFiles) ? lead.uploadedFiles : []
    const existingHistory = Array.isArray(lead.communicationHistory) ? lead.communicationHistory : []
    const uploadedFileIds = uploadedFiles.map((file) => file.id)

    await payload.update({
      collection: 'leads',
      id: lead.id,
      data: {
        uploadedFiles: [
          ...existingFiles.map((item) => (typeof item === 'object' ? item.id : item)),
          ...uploadedFileIds,
        ],
        communicationHistory: [
          ...existingHistory,
          ...uploadedFiles.map((uploadedFile) => ({
            direction: 'inbound',
            eventType: 'file_uploaded',
            subject: uploadedFile.originalName || uploadedFile.filename || 'Patient file',
            message: parsed.data.patientNote || 'Patient uploaded a medical file.',
            file: uploadedFile.id,
            occurredAt: new Date().toISOString(),
            createdBy: 'patient',
          } as const)),
        ],
      },
      context: {
        skipLeadResponse: true,
        skipLeadUpdateNotification: true,
      },
    })

    await sendLeadFilesUploadNotification({
      payload,
      leadId: lead.id,
      files: uploadedFiles,
    })

    return {
      success: true,
      message:
        uploadedFiles.length === 1
          ? 'File uploaded successfully. Your coordinator can now review it.'
          : `${uploadedFiles.length} files uploaded successfully. Your coordinator can now review them.`,
    }
  } catch (error) {
    console.error('[LEAD FILE UPLOAD ERROR]', error)
    return {
      success: false,
      message: 'We could not upload your file. Please try again or contact your coordinator.',
    }
  }
}

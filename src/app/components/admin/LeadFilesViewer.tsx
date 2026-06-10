'use client'

import { useDocumentInfo } from '@payloadcms/ui'
import { useEffect, useMemo, useState } from 'react'

type LeadFile = {
  id: number | string
  originalName?: string | null
  patientNote?: string | null
  url?: string | null
  filename?: string | null
  mimeType?: string | null
  filesize?: number | null
  createdAt?: string | null
}

type LeadFilesResponse = {
  docs?: LeadFile[]
}

const formatBytes = (bytes?: number | null) => {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const LeadFilesViewer = () => {
  const { id } = useDocumentInfo()
  const [files, setFiles] = useState<LeadFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const leadId = useMemo(() => (id ? String(id) : ''), [id])

  useEffect(() => {
    if (!leadId) return

    const controller = new AbortController()

    const loadFiles = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({
          depth: '0',
          limit: '100',
          sort: '-createdAt',
        })
        params.set('where[lead][equals]', leadId)

        const response = await fetch(`/api/lead-files?${params.toString()}`, {
          credentials: 'include',
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Could not load patient files.')
        }

        const data = (await response.json()) as LeadFilesResponse
        setFiles(data.docs || [])
      } catch (loadError: any) {
        if (loadError.name !== 'AbortError') {
          setError(loadError.message || 'Could not load patient files.')
        }
      } finally {
        setIsLoading(false)
      }
    }

    void loadFiles()

    return () => controller.abort()
  }, [leadId])

  if (!leadId) {
    return (
      <div style={{ padding: '16px', border: '1px solid var(--theme-elevation-200)', borderRadius: 8 }}>
        Save this lead before reviewing uploaded files.
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>Patient file viewer</h3>
        <p style={{ margin: 0, color: 'var(--theme-elevation-600)' }}>
          Review medical records uploaded through the secure patient portal.
        </p>
      </div>

      {isLoading ? (
        <div style={{ padding: 16, border: '1px solid var(--theme-elevation-200)', borderRadius: 8 }}>
          Loading patient files...
        </div>
      ) : null}

      {error ? (
        <div style={{ padding: 16, border: '1px solid var(--theme-error-500)', borderRadius: 8 }}>
          {error}
        </div>
      ) : null}

      {!isLoading && !error && files.length === 0 ? (
        <div style={{ padding: 16, border: '1px solid var(--theme-elevation-200)', borderRadius: 8 }}>
          No files have been uploaded for this lead yet.
        </div>
      ) : null}

      {files.map((file) => {
        const url = file.url || ''
        const isImage = file.mimeType?.startsWith('image/')
        const isPdf = file.mimeType === 'application/pdf'
        const title = file.originalName || file.filename || `File ${file.id}`

        return (
          <article
            key={file.id}
            style={{
              overflow: 'hidden',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: 10,
              background: 'var(--theme-elevation-0)',
            }}
          >
            <div style={{ padding: 14, borderBottom: '1px solid var(--theme-elevation-150)' }}>
              <strong>{title}</strong>
              <div style={{ marginTop: 4, color: 'var(--theme-elevation-600)', fontSize: 13 }}>
                {[file.mimeType, formatBytes(file.filesize)].filter(Boolean).join(' · ')}
              </div>
              {file.patientNote ? (
                <p style={{ margin: '10px 0 0', whiteSpace: 'pre-wrap' }}>{file.patientNote}</p>
              ) : null}
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 10 }}>
                  Open file in new tab
                </a>
              ) : null}
            </div>

            {url && isImage ? (
              <img
                src={url}
                alt={title}
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: 620,
                  objectFit: 'contain',
                  background: 'var(--theme-elevation-50)',
                }}
              />
            ) : null}

            {url && isPdf ? (
              <iframe
                title={title}
                src={url}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 620,
                  border: 0,
                  background: 'var(--theme-elevation-50)',
                }}
              />
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export default LeadFilesViewer

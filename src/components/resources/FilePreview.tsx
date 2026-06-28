import { useState, useEffect } from 'react'
import { getFileInfo, getDownloadUrl } from '@/services/driveService'
import { FileText, FileImage, FileVideo, File as FileIcon, Download } from 'lucide-react'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'

interface FilePreviewProps {
  fileId: string
}

export function FilePreview({ fileId }: FilePreviewProps) {
  const [fileInfo, setFileInfo] = useState<{ name: string; mimeType: string; webViewLink?: string } | null>(null)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const info = await getFileInfo(fileId)
        if (cancelled) return
        setFileInfo(info)
        const url = await getDownloadUrl(fileId)
        if (!cancelled) setDownloadUrl(url)
      } catch {
        if (!cancelled) setError(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [fileId])

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-4 w-48" />
      </div>
    )
  }

  if (error || !fileInfo) {
    return (
      <div className="flex flex-col items-center justify-center h-64 rounded-xl bg-surface-hover border border-border">
        <FileIcon className="h-12 w-12 text-text-muted mb-3" />
        <p className="text-sm text-text-secondary">Preview not available</p>
      </div>
    )
  }

  const isImage = fileInfo.mimeType.startsWith('image/')
  const isVideo = fileInfo.mimeType.startsWith('video/')
  const isPdf = fileInfo.mimeType === 'application/pdf'
  const isText = fileInfo.mimeType.startsWith('text/')

  const Icon = isImage ? FileImage : isVideo ? FileVideo : FileText

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-border bg-surface-hover overflow-hidden">
        {isImage && (
          <img
            src={downloadUrl}
            alt={fileInfo.name}
            className="max-h-96 w-full object-contain bg-surface"
          />
        )}
        {isVideo && (
          <video
            src={downloadUrl}
            controls
            className="w-full max-h-96 bg-black"
          />
        )}
        {isPdf && (
          <iframe
            src={`https://docs.google.com/viewer?embedded=true&url=${encodeURIComponent(downloadUrl)}`}
            className="w-full h-96"
            title={fileInfo.name}
          />
        )}
        {!isImage && !isVideo && !isPdf && (
          <div className="flex flex-col items-center justify-center h-48">
            <Icon className="h-16 w-16 text-text-muted mb-3" />
            <p className="text-sm font-medium text-text-primary">{fileInfo.name}</p>
            <p className="text-xs text-text-muted">{fileInfo.mimeType}</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {fileInfo.webViewLink && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => window.open(fileInfo.webViewLink, '_blank')}
          >
            <FileText className="h-4 w-4" />
            Open in Drive
          </Button>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => window.open(downloadUrl, '_blank')}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>
    </div>
  )
}

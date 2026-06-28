import { FileText, FileImage, FileVideo, File as FileIcon } from 'lucide-react'

interface FilePreviewProps {
  file: File
}

export function FilePreview({ file }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (isImage) {
    return (
      <img
        src={URL.createObjectURL(file)}
        alt={file.name}
        className="max-h-48 rounded-lg object-cover"
      />
    )
  }

  if (isVideo) {
    return (
      <video
        src={URL.createObjectURL(file)}
        className="max-h-48 rounded-lg"
        controls
      />
    )
  }

  const Icon = file.type.includes('pdf') ? FileText : FileIcon

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-surface-hover">
      <Icon className="h-8 w-8 text-text-muted" />
      <div>
        <p className="text-sm font-medium text-text-primary">{file.name}</p>
        <p className="text-xs text-text-muted">
          {(file.size / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>
    </div>
  )
}

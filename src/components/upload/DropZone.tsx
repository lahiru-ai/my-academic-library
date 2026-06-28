import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface DropZoneProps {
  files: File[]
  onFilesSelected: (files: File[]) => void
  onFileRemove: (index: number) => void
}

export function DropZone({ files, onFilesSelected, onFileRemove }: DropZoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesSelected(accepted)
    },
    [onFilesSelected],
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: undefined,
  })

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer',
          isDragActive && !isDragReject && 'border-accent bg-accent/5',
          isDragReject && 'border-danger bg-danger/5',
          !isDragActive && 'border-border hover:border-accent/50 hover:bg-surface-hover',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-3 text-text-muted" />
        {isDragActive ? (
          <p className="text-sm text-accent font-medium">Drop files here...</p>
        ) : (
          <>
            <p className="text-sm text-text-primary font-medium">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-text-muted mt-1">
              Supports all file types. Max file size depends on your Google Drive quota.
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border"
            >
              <File className="h-5 w-5 text-text-muted shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {file.name}
                </p>
                <p className="text-xs text-text-muted">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <button
                onClick={() => onFileRemove(idx)}
                className="p-1 rounded-md text-text-muted hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface UploadProgressItem {
  fileName: string
  percent: number
  status: 'uploading' | 'done' | 'error'
}

interface UploadProgressProps {
  items: UploadProgressItem[]
}

export function UploadProgress({ items }: UploadProgressProps) {
  if (items.length === 0) return null

  const done = items.filter((i) => i.status === 'done').length
  const total = items.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">
          Uploading {done}/{total}
        </span>
        <span className="text-xs text-text-muted">
          {Math.round(items.reduce((a, b) => a + b.percent, 0) / total)}%
        </span>
      </div>

      <div className="h-1.5 rounded-full bg-surface-hover overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{
            width: `${Math.round(items.reduce((a, b) => a + b.percent, 0) / total)}%`,
          }}
        />
      </div>

      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 text-xs text-text-secondary"
          >
            {item.status === 'uploading' && (
              <Loader2 className="h-3.5 w-3.5 text-accent animate-spin" />
            )}
            {item.status === 'done' && (
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            )}
            {item.status === 'error' && (
              <XCircle className="h-3.5 w-3.5 text-danger" />
            )}
            <span className="flex-1 truncate">{item.fileName}</span>
            <span
              className={cn(
                item.status === 'done' && 'text-success',
                item.status === 'error' && 'text-danger',
              )}
            >
              {item.status === 'uploading' && `${item.percent}%`}
              {item.status === 'done' && 'Done'}
              {item.status === 'error' && 'Failed'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

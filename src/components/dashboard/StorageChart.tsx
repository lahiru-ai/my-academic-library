import { Card } from '@/components/common/Card'
import { getStorageQuota } from '@/services/driveService'
import { useState, useEffect } from 'react'
import { formatFileSize } from '@/utils/helpers'
import { HardDrive } from 'lucide-react'

export function StorageChart() {
  const [quota, setQuota] = useState<{ limit: number; usage: number } | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    getStorageQuota()
      .then((data) => {
        if (data?.storageQuota) {
          setQuota({
            limit: Number(data.storageQuota.limit),
            usage: Number(data.storageQuota.usage),
          })
        }
      })
      .catch(() => setError(true))
  }, [])

  if (error || !quota || quota.limit === 0) return null

  const percent = Math.round((quota.usage / quota.limit) * 100)

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">
          <HardDrive className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-text-primary text-sm">Drive Storage</h3>
        </div>
      </div>
      <div className="h-2 rounded-full bg-surface-hover overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      <p className="text-xs text-text-muted">
        {formatFileSize(quota.usage)} of {formatFileSize(quota.limit)} used
      </p>
    </Card>
  )
}

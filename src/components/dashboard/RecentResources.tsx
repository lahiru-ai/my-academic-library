import { Link } from 'react-router-dom'
import type { Resource } from '@/types'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { EmptyState } from '@/components/common/EmptyState'
import { FileText, Clock } from 'lucide-react'
import { formatDateRelative } from '@/utils/helpers'

interface RecentResourcesProps {
  resources: Resource[]
  title: string
  emptyMessage: string
}

export function RecentResources({ resources, title, emptyMessage }: RecentResourcesProps) {
  if (resources.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="font-semibold text-text-primary mb-4">{title}</h3>
        <EmptyState
          icon={<Clock className="h-8 w-8" />}
          title={emptyMessage}
        />
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-text-primary mb-4">{title}</h3>
      <div className="space-y-2">
        {resources.slice(0, 5).map((resource) => (
          <Link
            key={resource.id}
            to={`/resources/${resource.id}`}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-hover transition-colors"
          >
            <FileText className="h-4 w-4 text-text-muted shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {resource.title}
              </p>
              <p className="text-xs text-text-muted">
                {resource.module} &middot; {resource.resourceType}
              </p>
            </div>
            <span className="text-xs text-text-muted shrink-0">
              {formatDateRelative(resource.uploadDate)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  )
}

import { Link } from 'react-router-dom'
import type { Resource } from '@/types'
import { Card } from '@/components/common/Card'
import { Badge } from '@/components/common/Badge'
import { Heart, BookMarked, FileText, Star } from 'lucide-react'
import { formatDateRelative, truncate, parseTags } from '@/utils/helpers'
import type { Module } from '@/types'
import { cn } from '@/utils/helpers'

interface ResourceCardProps {
  resource: Resource
  module?: Module
  view?: 'grid' | 'list'
}

export function ResourceCard({ resource, module: mod, view = 'grid' }: ResourceCardProps) {
  const tags = parseTags(resource.tags)

  if (view === 'list') {
    return (
      <Link to={`/resources/${resource.id}`}>
        <div className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-surface-hover transition-colors border-b border-border last:border-b-0">
          <div
            className="w-1 h-8 rounded-full shrink-0"
            style={{ backgroundColor: mod?.color || '#6b7280' }}
          />
          <FileText className="h-4 w-4 text-text-muted shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">
              {resource.title}
            </p>
            <p className="text-xs text-text-muted">
              {resource.module} &middot; {resource.resourceType}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {resource.favorite && <Heart className="h-3.5 w-3.5 text-danger fill-current" />}
            {resource.needRevision && <BookMarked className="h-3.5 w-3.5 text-warning" />}
          </div>
          <span className="text-xs text-text-muted shrink-0 hidden sm:block">
            {formatDateRelative(resource.uploadDate)}
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/resources/${resource.id}`}>
      <Card hover className="p-4 h-full">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${mod?.color || '#6b7280'}15` }}
          >
            <FileText
              className="h-5 w-5"
              style={{ color: mod?.color || '#6b7280' }}
            />
          </div>
          <div className="flex items-center gap-1">
            {resource.favorite && (
              <Heart className="h-4 w-4 text-danger fill-current" />
            )}
            {resource.needRevision && (
              <BookMarked className="h-4 w-4 text-warning" />
            )}
          </div>
        </div>

        <h3 className="font-medium text-text-primary text-sm mb-1 line-clamp-2">
          {resource.title}
        </h3>

        <p className="text-xs text-text-muted mb-2">
          {resource.module} &middot; {resource.resourceType}
        </p>

        {resource.topic && (
          <p className="text-xs text-text-secondary mb-2 line-clamp-1">
            {resource.topic}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="default">+{tags.length - 3}</Badge>
            )}
          </div>
        )}

        <p className="text-xs text-text-muted mt-auto">
          {formatDateRelative(resource.uploadDate)}
        </p>
      </Card>
    </Link>
  )
}

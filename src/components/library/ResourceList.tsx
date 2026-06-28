import type { Resource } from '@/types'
import { ResourceCard } from './ResourceCard'
import { useModules } from '@/hooks/useModules'

interface ResourceListProps {
  resources: Resource[]
  isLoading?: boolean
}

export function ResourceList({ resources, isLoading }: ResourceListProps) {
  const { getModule } = useModules()

  if (resources.length === 0 && !isLoading) return null

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="hidden sm:flex items-center gap-4 px-4 py-2.5 border-b border-border bg-surface-secondary text-xs font-medium text-text-muted uppercase tracking-wider">
        <div className="w-1 shrink-0" />
        <div className="w-4 shrink-0" />
        <div className="flex-1">Title</div>
        <div className="w-12 shrink-0" />
        <div className="w-24 text-right hidden md:block">Date</div>
      </div>
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          module={getModule(resource.module)}
          view="list"
        />
      ))}
    </div>
  )
}

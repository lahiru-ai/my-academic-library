import type { Resource } from '@/types'
import { ResourceCard } from './ResourceCard'
import { useModules } from '@/hooks/useModules'
import type { Module } from '@/types'

interface ResourceGridProps {
  resources: Resource[]
  isLoading?: boolean
}

export function ResourceGrid({ resources, isLoading }: ResourceGridProps) {
  const { getModule } = useModules()

  if (resources.length === 0 && !isLoading) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          module={getModule(resource.module)}
        />
      ))}
    </div>
  )
}

import { useState } from 'react'
import { useResources } from '@/hooks/useResources'
import { usePagination } from '@/hooks/usePagination'
import { useDebounce } from '@/hooks/useDebounce'
import { PageHeader } from '@/components/layout/PageHeader'
import { ResourceGrid } from '@/components/library/ResourceGrid'
import { ResourceList } from '@/components/library/ResourceList'
import { ViewToggle } from '@/components/library/ViewToggle'
import { SearchBar } from '@/components/library/SearchBar'
import { EmptyState } from '@/components/common/EmptyState'
import { ResourceCardSkeleton } from '@/components/common/Skeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import type { ViewMode } from '@/types'
import { BookMarked } from 'lucide-react'

export default function RevisionPage() {
  const { resources, isLoading } = useResources()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const debouncedSearch = useDebounce(search, 300)

  const revision = resources
    .filter((r) => r.needRevision)
    .filter(
      (r) =>
        !debouncedSearch ||
        r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.module.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.topic.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )

  const { paginatedItems } = usePagination(revision, 24)

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 space-y-6">
        <PageHeader
          title="Revision Mode"
          description={`${revision.length} resources marked for revision`}
        />

        <div className="flex items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search revision resources..."
            className="flex-1 max-w-md"
          />
          <ViewToggle view={view} onChange={setView} />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : paginatedItems.length === 0 ? (
          <EmptyState
            icon={<BookMarked className="h-12 w-12" />}
            title="Nothing to revise"
            description="Mark resources as 'Need Revision' to see them here"
          />
        ) : view === 'grid' ? (
          <ResourceGrid resources={paginatedItems} />
        ) : (
          <ResourceList resources={paginatedItems} />
        )}
      </div>
    </ErrorBoundary>
  )
}

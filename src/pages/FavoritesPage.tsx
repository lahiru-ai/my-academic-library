import { useResources } from '@/hooks/useResources'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/layout/PageHeader'
import { ResourceGrid } from '@/components/library/ResourceGrid'
import { ResourceList } from '@/components/library/ResourceList'
import { ViewToggle } from '@/components/library/ViewToggle'
import { EmptyState } from '@/components/common/EmptyState'
import { ResourceCardSkeleton } from '@/components/common/Skeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { useState } from 'react'
import type { ViewMode } from '@/types'
import { Heart, Search } from 'lucide-react'
import { SearchBar } from '@/components/library/SearchBar'
import { useDebounce } from '@/hooks/useDebounce'

export default function FavoritesPage() {
  const { resources, isLoading } = useResources()
  const [search, setSearch] = useState('')
  const [view, setView] = useState<ViewMode>('grid')
  const debouncedSearch = useDebounce(search, 300)

  const favorites = resources
    .filter((r) => r.favorite)
    .filter(
      (r) =>
        !debouncedSearch ||
        r.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.module.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.topic.toLowerCase().includes(debouncedSearch.toLowerCase()),
    )

  const { paginatedItems } = usePagination(favorites, 24)

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 space-y-6">
        <PageHeader
          title="Favorites"
          description={`${favorites.length} favorited resources`}
        />

        <div className="flex items-center gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search favorites..."
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
            icon={<Heart className="h-12 w-12" />}
            title="No favorites yet"
            description="Mark resources as favorites by toggling the heart icon"
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

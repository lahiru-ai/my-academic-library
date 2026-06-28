import { useState } from 'react'
import { useResources } from '@/hooks/useResources'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { PageHeader } from '@/components/layout/PageHeader'
import { SearchBar } from '@/components/library/SearchBar'
import { FilterPanel } from '@/components/library/FilterPanel'
import { SortDropdown } from '@/components/library/SortDropdown'
import { ViewToggle } from '@/components/library/ViewToggle'
import { ResourceGrid } from '@/components/library/ResourceGrid'
import { ResourceList } from '@/components/library/ResourceList'
import { EmptyState } from '@/components/common/EmptyState'
import { ResourceCardSkeleton } from '@/components/common/Skeleton'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import type { ResourceFilters, SortField, SortDirection, ViewMode } from '@/types'
import { Button } from '@/components/common/Button'
import { Link } from 'react-router-dom'
import { Upload, Search } from 'lucide-react'

const defaultFilters: ResourceFilters = {
  module: '',
  resourceType: '',
  tags: '',
  favorite: null,
  needRevision: null,
  search: '',
}

export default function LibraryPage() {
  const { getFilteredResources, isLoading } = useResources()
  const [filters, setFilters] = useState<ResourceFilters>(defaultFilters)
  const [sortField, setSortField] = useState<SortField>('uploadDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [view, setView] = useState<ViewMode>('grid')

  const debouncedSearch = useDebounce(filters.search, 300)

  const filtered = getFilteredResources(
    { ...filters, search: debouncedSearch },
    sortField,
    sortDirection,
  )

  const { paginatedItems, currentPage, totalPages, goToPage, hasNext, hasPrev } =
    usePagination(filtered, 24)

  return (
    <ErrorBoundary>
      <div className="p-4 lg:p-6 space-y-6">
        <PageHeader
          title="Resource Library"
          description={`${filtered.length} resources found`}
          actions={
            <Link to="/upload">
              <Button variant="primary">
                <Upload className="h-4 w-4" />
                Upload
              </Button>
            </Link>
          }
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <SearchBar
            value={filters.search}
            onChange={(search) => setFilters({ ...filters, search })}
            className="flex-1 w-full sm:max-w-md"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SortDropdown
              field={sortField}
              direction={sortDirection}
              onFieldChange={setSortField}
              onDirectionChange={() =>
                setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))
              }
            />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>

        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(defaultFilters)}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ResourceCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="No resources found"
            description={
              filters.search
                ? 'Try a different search term or clear filters'
                : 'Upload your first resource to get started'
            }
            action={
              !filters.search ? (
                <Link to="/upload">
                  <Button variant="primary">
                    <Upload className="h-4 w-4" />
                    Upload Resource
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : view === 'grid' ? (
          <ResourceGrid resources={paginatedItems} />
        ) : (
          <ResourceList resources={paginatedItems} />
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasPrev}
              onClick={() => goToPage(currentPage - 1)}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2,
              )
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-text-muted">...</span>
                  )}
                  <Button
                    variant={p === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => goToPage(p)}
                  >
                    {p}
                  </Button>
                </span>
              ))}
            <Button
              variant="ghost"
              size="sm"
              disabled={!hasNext}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  )
}

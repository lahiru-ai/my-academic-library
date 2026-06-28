import type { ResourceFilters, ResourceType } from '@/types'
import { RESOURCE_TYPES } from '@/types'
import { useModules } from '@/hooks/useModules'
import { Select } from '@/components/common/Select'
import { Toggle } from '@/components/common/Toggle'
import { Input } from '@/components/common/Input'
import { X } from 'lucide-react'

interface FilterPanelProps {
  filters: ResourceFilters
  onChange: (filters: ResourceFilters) => void
  onClear: () => void
}

export function FilterPanel({ filters, onChange, onClear }: FilterPanelProps) {
  const { modules } = useModules()
  const activeModules = modules.filter((m) => !m.archived)

  const hasFilters =
    filters.module || filters.resourceType || filters.tags || filters.favorite || filters.needRevision

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-primary">Filters</h3>
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-xs text-accent hover:text-accent-dark flex items-center gap-1 cursor-pointer"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Select
          placeholder="All Modules"
          value={filters.module}
          onChange={(e) => onChange({ ...filters, module: e.target.value })}
          options={activeModules.map((m) => ({ value: m.name, label: m.name }))}
        />

        <Select
          placeholder="All Types"
          value={filters.resourceType}
          onChange={(e) => onChange({ ...filters, resourceType: e.target.value })}
          options={RESOURCE_TYPES.map((t) => ({ value: t, label: t }))}
        />

        <Input
          placeholder="Filter by tags..."
          value={filters.tags}
          onChange={(e) => onChange({ ...filters, tags: e.target.value })}
        />

        <div className="flex items-center gap-4">
          <Toggle
            id="filter-fav"
            label="Favorites"
            checked={filters.favorite === true}
            onChange={(e) =>
              onChange({
                ...filters,
                favorite: e.target.checked ? true : null,
              })
            }
          />
          <Toggle
            id="filter-rev"
            label="Need Revision"
            checked={filters.needRevision === true}
            onChange={(e) =>
              onChange({
                ...filters,
                needRevision: e.target.checked ? true : null,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}

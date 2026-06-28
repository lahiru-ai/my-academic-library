import type { SortField, SortDirection } from '@/types'
import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface SortDropdownProps {
  field: SortField
  direction: SortDirection
  onFieldChange: (field: SortField) => void
  onDirectionChange: () => void
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'title', label: 'Name' },
  { value: 'uploadDate', label: 'Date' },
  { value: 'module', label: 'Module' },
  { value: 'resourceType', label: 'Type' },
]

export function SortDropdown({
  field,
  direction,
  onFieldChange,
  onDirectionChange,
}: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={field}
        onChange={(e) => onFieldChange(e.target.value as SortField)}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent/50"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        onClick={onDirectionChange}
        className={cn(
          'p-2 rounded-lg border border-border hover:bg-surface-hover transition-colors cursor-pointer',
          direction === 'desc' && 'bg-accent/10 text-accent',
        )}
        title={direction === 'asc' ? 'Ascending' : 'Descending'}
      >
        <ArrowUpDown className="h-4 w-4" />
      </button>
    </div>
  )
}

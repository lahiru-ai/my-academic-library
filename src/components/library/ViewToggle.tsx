import type { ViewMode } from '@/types'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-surface p-0.5">
      <button
        onClick={() => onChange('grid')}
        className={cn(
          'p-1.5 rounded-md transition-colors cursor-pointer',
          view === 'grid' ? 'bg-surface-hover text-text-primary' : 'text-text-muted hover:text-text-secondary',
        )}
        title="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={cn(
          'p-1.5 rounded-md transition-colors cursor-pointer',
          view === 'list' ? 'bg-surface-hover text-text-primary' : 'text-text-muted hover:text-text-secondary',
        )}
        title="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  )
}

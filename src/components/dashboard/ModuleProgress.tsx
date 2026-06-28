import type { Module } from '@/types'
import { Card } from '@/components/common/Card'

interface ModuleProgressProps {
  modules: Module[]
}

export function ModuleProgress({ modules }: ModuleProgressProps) {
  const active = modules.filter((m) => !m.archived)
  if (active.length === 0) return null

  const maxCount = Math.max(...active.map((m) => m.resourceCount), 1)

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-text-primary mb-4">Progress by Module</h3>
      <div className="space-y-3">
        {active.map((mod) => (
          <div key={mod.id}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: mod.color }}
                />
                <span className="text-sm font-medium text-text-primary">{mod.name}</span>
              </div>
              <span className="text-xs text-text-muted">{mod.resourceCount} resources</span>
            </div>
            <div className="h-2 rounded-full bg-surface-hover overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(mod.resourceCount / maxCount) * 100}%`,
                  backgroundColor: mod.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

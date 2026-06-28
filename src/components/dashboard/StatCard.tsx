import type { ReactNode } from 'react'
import { cn } from '@/utils/helpers'
import { Card } from '@/components/common/Card'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: string
  className?: string
}

export function StatCard({ icon, label, value, trend, className }: StatCardProps) {
  return (
    <Card className={cn('p-4', className)}>
      <div className="flex items-start justify-between">
        <div className="p-2 rounded-lg bg-accent/10 text-accent">{icon}</div>
        {trend && (
          <span className="text-xs text-success font-medium">{trend}</span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </Card>
  )
}

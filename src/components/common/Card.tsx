import { type ReactNode } from 'react'
import { cn } from '@/utils/helpers'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function Card({ children, className, onClick, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-surface',
        hover && 'transition-all duration-200 hover:shadow-md hover:border-accent/30',
        onClick && 'cursor-pointer',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

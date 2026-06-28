import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/helpers'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer',
          variant === 'primary' && 'bg-accent text-white hover:bg-accent-dark shadow-sm',
          variant === 'secondary' && 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
          variant === 'ghost' && 'text-text-secondary hover:bg-surface-hover hover:text-text-primary',
          variant === 'danger' && 'bg-danger text-white hover:bg-red-600 shadow-sm',
          size === 'sm' && 'px-3 py-1.5 text-xs',
          size === 'md' && 'px-4 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    )
  },
)

Button.displayName = 'Button'

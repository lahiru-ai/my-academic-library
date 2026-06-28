import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/helpers'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-text-secondary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border bg-surface px-3 py-2 text-sm text-text-primary transition-colors placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50',
            error ? 'border-danger' : 'border-border',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-danger">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/utils/helpers'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn('inline-flex items-center gap-3 cursor-pointer', className)}
      >
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-surface-hover rounded-full peer-checked:bg-accent transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4" />
        </div>
        {label && <span className="text-sm text-text-primary">{label}</span>}
      </label>
    )
  },
)

Toggle.displayName = 'Toggle'

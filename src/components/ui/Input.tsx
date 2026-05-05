import { cn } from '../../lib/cn'
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string
  error?: string
  hint?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

export function Input({ label, error, hint, prefix, suffix, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}
      <div
        className={cn(
          'flex items-center gap-2 rounded-xl border bg-surface px-4 h-13 transition-colors',
          error ? 'border-error ring-1 ring-error/30' : 'border-border focus-within:border-crown-gold focus-within:ring-1 focus-within:ring-crown-gold/30'
        )}
      >
        {prefix && <span className="text-muted shrink-0">{prefix}</span>}
        <input
          id={inputId}
          className={cn(
            'flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none h-full',
            className
          )}
          {...props}
        />
        {suffix && <span className="text-muted shrink-0">{suffix}</span>}
      </div>
      {error && <p className="text-xs text-error">{error}</p>}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

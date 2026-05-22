import { cn } from '../../lib/cn'
import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 active:scale-[0.97] select-none',
        {
          // variants
          'bg-crown-gold text-crown-navy shadow-sm hover:bg-crown-gold-light disabled:opacity-50 disabled:cursor-not-allowed':
            variant === 'primary',
          'bg-crown-navy text-white hover:bg-crown-deep disabled:opacity-50 disabled:cursor-not-allowed':
            variant === 'secondary',
          'bg-transparent text-crown-gold-dim hover:bg-crown-gold/10 disabled:opacity-50':
            variant === 'ghost',
          'bg-red-50 text-error border border-error/30 hover:bg-red-100 disabled:opacity-50':
            variant === 'danger',
          'bg-transparent border border-border text-text hover:bg-subtle disabled:opacity-50':
            variant === 'outline',
          // sizes
          'text-xs px-3 py-2 h-8': size === 'sm',
          'text-sm px-4 py-3 h-11': size === 'md',
          'text-base px-6 py-4 h-14': size === 'lg',
          // width
          'w-full': fullWidth,
        },
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : null}
      {children}
    </button>
  )
}

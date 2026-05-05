import { cn } from '../../lib/cn'
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  dark?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({ children, className, onClick, dark, padding = 'md' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl',
        dark ? 'bg-crown-deep text-white' : 'bg-surface border border-border',
        {
          'p-0': padding === 'none',
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-5': padding === 'lg',
        },
        onClick && 'cursor-pointer active:scale-[0.98] transition-transform',
        className
      )}
    >
      {children}
    </div>
  )
}

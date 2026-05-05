import { cn } from '../../lib/cn'
import type { OperationStatus } from '../../data/mock-operations'

const statusConfig: Record<OperationStatus, { label: string; className: string }> = {
  pendiente_pago:    { label: 'Pendiente de pago',   className: 'bg-warning-bg text-warning' },
  validando_voucher: { label: 'Validando voucher',   className: 'bg-info-bg text-info' },
  procesando:        { label: 'Procesando',           className: 'bg-info-bg text-info' },
  completado:        { label: 'Completado',           className: 'bg-success-bg text-success' },
  observado:         { label: 'Observado',            className: 'bg-warning-bg text-warning' },
  rechazado:         { label: 'Rechazado',            className: 'bg-error-bg text-error' },
}

interface StatusBadgeProps {
  status: OperationStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { label, className } = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1',
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'gold'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1',
        {
          'bg-gray-100 text-gray-600': variant === 'default',
          'bg-success-bg text-success': variant === 'success',
          'bg-warning-bg text-warning': variant === 'warning',
          'bg-error-bg text-error': variant === 'error',
          'bg-info-bg text-info': variant === 'info',
          'bg-crown-gold/15 text-crown-gold-dim': variant === 'gold',
        },
        className
      )}
    >
      {children}
    </span>
  )
}

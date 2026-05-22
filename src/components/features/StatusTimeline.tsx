import { Check, Clock, AlertCircle, XCircle } from 'lucide-react'
import type { TimelineEvent, OperationStatus } from '../../data/mock-operations'
import { formatDateTime } from '../../lib/format'
import { cn } from '../../lib/cn'

const statusIcons: Record<OperationStatus, React.ReactNode> = {
  pendiente_pago:    <Clock size={14} />,
  validando_voucher: <Clock size={14} />,
  procesando:        <Clock size={14} />,
  completado:        <Check size={14} strokeWidth={3} />,
  observado:         <AlertCircle size={14} />,
  rechazado:         <XCircle size={14} />,
}

interface StatusTimelineProps {
  events: TimelineEvent[]
  currentStatus: OperationStatus
}

export function StatusTimeline({ events, currentStatus }: StatusTimelineProps) {
  return (
    <div className="flex flex-col">
      {events.map((event, idx) => {
        const isDone = event.timestamp !== null && !event.isCurrent
        const isCurrent = event.isCurrent
        const isPending = !isDone && !isCurrent

        return (
          <div key={idx} className="flex gap-4">
            {/* Left column: icon + connector */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all',
                  isDone && 'bg-crown-gold text-crown-navy',
                  isCurrent && currentStatus === 'observado'
                    ? 'bg-warning text-white'
                    : isCurrent && currentStatus === 'rechazado'
                      ? 'bg-error text-white'
                      : isCurrent
                        ? 'bg-crown-navy text-white ring-4 ring-crown-navy/20'
                        : '',
                  isPending && 'bg-subtle text-muted'
                )}
              >
                {isDone
                  ? <Check size={14} strokeWidth={3} />
                  : statusIcons[event.status]
                }
              </div>
              {idx < events.length - 1 && (
                <div className={cn('w-0.5 flex-1 my-1', isDone ? 'bg-crown-gold' : 'bg-border')} />
              )}
            </div>

            {/* Right column: content */}
            <div className={cn('flex-1 pb-6', idx === events.length - 1 && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-semibold',
                  isDone && 'text-crown-gold-dim',
                  isCurrent && 'text-crown-navy',
                  isPending && 'text-muted'
                )}
              >
                {event.label}
              </p>
              <p className="text-xs text-muted mt-0.5">{event.description}</p>
              {event.timestamp && (
                <p className="text-xs text-muted/60 mt-1">{formatDateTime(event.timestamp)}</p>
              )}
              {isCurrent && currentStatus !== 'completado' && (
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 bg-crown-gold rounded-full animate-pulse" />
                  <span className="text-xs text-crown-gold-dim font-medium">En curso</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

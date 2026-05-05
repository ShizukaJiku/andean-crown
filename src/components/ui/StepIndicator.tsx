import { cn } from '../../lib/cn'
import { Check } from 'lucide-react'

interface StepIndicatorProps {
  steps: string[]
  current: number
}

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, idx) => {
        const done = idx < current
        const active = idx === current
        return (
          <div key={idx} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  done && 'bg-crown-gold text-crown-navy',
                  active && 'bg-crown-navy text-white ring-2 ring-crown-gold ring-offset-2',
                  !done && !active && 'bg-gray-100 text-muted'
                )}
              >
                {done ? <Check size={14} strokeWidth={3} /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-[10px] font-medium whitespace-nowrap',
                  active ? 'text-crown-navy' : done ? 'text-crown-gold-dim' : 'text-muted'
                )}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-1 mb-5 transition-colors',
                  idx < current ? 'bg-crown-gold' : 'bg-border'
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

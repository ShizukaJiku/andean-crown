import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, ChevronRight } from 'lucide-react'
import type { Operation } from '../../data/mock-operations'
import { StatusBadge } from '../ui/Badge'
import { formatPEN, formatUSD, formatDate } from '../../lib/format'

interface OperationCardProps {
  operation: Operation
}

export function OperationCard({ operation }: OperationCardProps) {
  const navigate = useNavigate()
  const isBuy = operation.type === 'buy'

  return (
    <div
      onClick={() => navigate(`/operations/${operation.id}`)}
      className="flex items-center gap-3 p-4 bg-surface border border-border rounded-2xl cursor-pointer active:scale-[0.98] transition-transform"
    >
      {/* Icon */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isBuy ? 'bg-success-bg' : 'bg-info-bg'}`}>
        {isBuy
          ? <ArrowDownLeft size={20} className="text-success" />
          : <ArrowUpRight size={20} className="text-info" />
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              {isBuy ? 'Compra USD' : 'Venta USD'}
            </p>
            <p className="text-xs text-muted mt-0.5 truncate">{operation.number}</p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-sm font-bold ${isBuy ? 'text-success' : 'text-info'}`}>
              {isBuy ? `+${formatUSD(operation.amountReceived)}` : `+${formatPEN(operation.amountReceived)}`}
            </p>
            <p className="text-xs text-muted">
              {isBuy ? formatPEN(operation.amountSent) : formatUSD(operation.amountSent)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <StatusBadge status={operation.status} size="sm" />
          <div className="flex items-center gap-1 text-muted">
            <span className="text-xs">{formatDate(operation.createdAt)}</span>
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  )
}

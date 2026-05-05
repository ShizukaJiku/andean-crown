import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, AlertTriangle, Upload } from 'lucide-react'
import { StatusBadge } from '../components/ui/Badge'
import { StatusTimeline } from '../components/features/StatusTimeline'
import { Button } from '../components/ui/Button'
import { useOperationsStore } from '../store/operations.store'
import { formatPEN, formatUSD, formatDateTime } from '../lib/format'

export function OperationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { operations } = useOperationsStore()
  const op = operations.find((o) => o.id === id)

  if (!op) {
    return (
      <div className="mobile-shell flex items-center justify-center">
        <div className="text-center px-6">
          <p className="text-lg font-bold text-text">Operación no encontrada</p>
          <Button className="mt-4" onClick={() => navigate('/operations')}>Volver al historial</Button>
        </div>
      </div>
    )
  }

  const isBuy = op.type === 'buy'

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-4 border-b border-border bg-surface sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft size={22} className="text-text" />
        </button>
        <div className="flex-1">
          <p className="font-bold text-sm text-text">Detalle de operación</p>
          <p className="text-xs text-muted font-mono">{op.number}</p>
        </div>
        <StatusBadge status={op.status} size="sm" />
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-8 space-y-5">
        {/* Amount hero */}
        <div className="bg-gradient-to-br from-crown-navy to-crown-deep rounded-2xl p-5 text-white">
          <p className="text-xs text-white/50 mb-1">{isBuy ? 'Compraste' : 'Vendiste'}</p>
          <p className="text-3xl font-bold text-crown-gold-light">
            {isBuy ? formatUSD(op.amountReceived) : formatPEN(op.amountReceived)}
          </p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
            <div>
              <p className="text-xs text-white/40">Enviaste</p>
              <p className="text-sm font-semibold">{isBuy ? formatPEN(op.amountSent) : formatUSD(op.amountSent)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Tipo de cambio</p>
              <p className="text-sm font-semibold">S/ {op.rate.toFixed(4)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/40">Banco</p>
              <p className="text-sm font-semibold">{op.bank}</p>
            </div>
          </div>
        </div>

        {/* Observation alert */}
        {op.status === 'observado' && op.observationNote && (
          <div className="bg-warning-bg border border-warning/30 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle size={18} className="text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-warning">Operación observada</p>
              <p className="text-xs text-muted mt-1">{op.observationNote}</p>
              <Button size="sm" className="mt-3 gap-1.5" onClick={() => navigate('/exchange')}>
                <Upload size={13} /> Subir nuevo voucher
              </Button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-surface border border-border rounded-2xl p-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
            Estado de la operación
          </p>
          <StatusTimeline
            events={op.timeline}
            currentStatus={op.status}
          />
        </div>

        {/* Details */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Información</p>
          </div>
          <div className="p-4 space-y-3">
            <DetailRow label="Número de operación" value={op.number} mono />
            <DetailRow label="Fecha de creación" value={formatDateTime(op.createdAt)} />
            <DetailRow label="Tipo" value={isBuy ? 'Compra de dólares' : 'Venta de dólares'} />
            <DetailRow label="Banco de depósito" value={op.bank} />
            {op.voucherRef && <DetailRow label="Ref. voucher" value={op.voucherRef} mono />}
          </div>
        </div>

        {op.status === 'completado' && (
          <div className="bg-success-bg border border-success/20 rounded-2xl p-4 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm font-semibold text-success">Operación completada</p>
            <p className="text-xs text-muted mt-1">El abono fue acreditado en tu cuenta bancaria</p>
          </div>
        )}

        <Button variant="outline" fullWidth onClick={() => navigate('/operations')}>
          Volver al historial
        </Button>
      </div>
    </div>
  )
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs text-muted shrink-0">{label}</span>
      <span className={`text-xs text-text text-right ${mono ? 'font-mono' : 'font-medium'}`}>{value}</span>
    </div>
  )
}

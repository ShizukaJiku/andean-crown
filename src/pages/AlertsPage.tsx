import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Bell, BellOff, Trash2, ArrowDownLeft, ArrowUpRight, Plus } from 'lucide-react'
import { BottomNav } from '../components/ui/BottomNav'
import { Button } from '../components/ui/Button'
import { useAlertsStore, useUserAlerts } from '../store/alerts.store'
import { useExchangeStore } from '../store/exchange.store'
import { useAuthStore } from '../store/auth.store'
import { toast } from '../store/toast.store'

/**
 * FX-32 — Rate watch (alertas de tipo de cambio).
 * Diferenciador funcional: ninguna casa de cambio digital peruana lo ofrece.
 */
export function AlertsPage() {
  const navigate = useNavigate()
  const { addAlert, removeAlert, toggleAlert } = useAlertsStore()
  const alerts = useUserAlerts()
  const { user } = useAuthStore()
  const { rate } = useExchangeStore()

  const [direction, setDirection] = useState<'buy' | 'sell'>('buy')
  const [targetRate, setTargetRate] = useState('')
  const [confirmId, setConfirmId] = useState<string | null>(null)

  const targetNum = parseFloat(targetRate) || 0
  const currentForDirection = direction === 'buy' ? rate.sell : rate.buy
  const isReasonable = targetNum > 0 && Math.abs(targetNum - currentForDirection) / currentForDirection < 0.10

  if (!user) return null

  const handleCreate = () => {
    if (!isReasonable) return
    addAlert(user.id, direction, targetNum)
    setTargetRate('')
  }

  return (
    <div className="mobile-shell">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-border bg-surface sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          type="button"
          aria-label="Volver"
          className="tap-target -ml-2 rounded-xl hover:bg-subtle"
        >
          <ChevronLeft size={22} className="text-text" aria-hidden="true" />
        </button>
        <div>
          <h1 className="font-bold text-sm text-text">Alertas de tipo de cambio</h1>
          <p className="text-xs text-muted">Te avisamos cuando llegue a tu precio</p>
        </div>
      </header>

      <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        {/* Crear nueva alerta */}
        <section
          aria-labelledby="new-alert-title"
          className="bg-surface border border-border rounded-2xl p-4 mb-5"
        >
          <h2 id="new-alert-title" className="text-sm font-bold text-text mb-3">Nueva alerta</h2>

          {/* Dirección */}
          <fieldset className="mb-3">
            <legend className="text-xs text-muted mb-2">¿Qué quieres hacer?</legend>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de operación">
              <button
                type="button"
                role="radio"
                aria-checked={direction === 'buy'}
                onClick={() => setDirection('buy')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                  direction === 'buy'
                    ? 'border-crown-gold bg-crown-gold/5'
                    : 'border-border bg-surface'
                }`}
              >
                <ArrowDownLeft size={16} className="text-success" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-text">Comprar USD</p>
                  <p className="text-[10px] text-muted">cuando baje</p>
                </div>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={direction === 'sell'}
                onClick={() => setDirection('sell')}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all min-h-[44px] ${
                  direction === 'sell'
                    ? 'border-crown-gold bg-crown-gold/5'
                    : 'border-border bg-surface'
                }`}
              >
                <ArrowUpRight size={16} className="text-info" aria-hidden="true" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-text">Vender USD</p>
                  <p className="text-[10px] text-muted">cuando suba</p>
                </div>
              </button>
            </div>
          </fieldset>

          {/* Tasa objetivo */}
          <label className="block">
            <span className="text-xs text-muted mb-1.5 block">
              Avisarme cuando el USD esté en{' '}
              <span className="text-text font-medium">
                S/ {currentForDirection.toFixed(3)} hoy
              </span>
            </span>
            <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-crown-gold">
              <span className="text-base font-bold text-muted" aria-hidden="true">S/</span>
              <input
                type="number"
                step="0.001"
                inputMode="decimal"
                placeholder={currentForDirection.toFixed(3)}
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value.replace(/[^0-9.]/g, ''))}
                aria-label="Tasa objetivo en soles por dólar"
                aria-invalid={targetRate !== '' && !isReasonable}
                className="flex-1 text-lg font-bold text-text bg-transparent outline-none min-w-0"
              />
            </div>
            {targetRate && !isReasonable && (
              <p className="text-xs text-error mt-1.5" role="alert">
                La tasa debe estar dentro de ±10% del valor actual.
              </p>
            )}
          </label>

          <Button
            variant="primary" fullWidth size="md"
            className="mt-3"
            disabled={!isReasonable}
            onClick={handleCreate}
          >
            <Plus size={16} aria-hidden="true" />
            Crear alerta
          </Button>
        </section>

        {/* Lista de alertas */}
        <section aria-labelledby="alerts-list-title">
          <h2 id="alerts-list-title" className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Tus alertas ({alerts.length})
          </h2>

          {alerts.length === 0 ? (
            <div className="bg-surface border border-border border-dashed rounded-2xl p-6 text-center">
              <Bell size={24} className="text-muted mx-auto mb-2" aria-hidden="true" />
              <p className="text-sm text-muted">
                Aún no tienes alertas. Crea una arriba para que te avisemos cuando el dólar
                llegue a tu precio.
              </p>
            </div>
          ) : (
            <ul className="space-y-2" aria-label="Lista de alertas activas">
              {alerts.map((a) => {
                const isBuy = a.direction === 'buy'
                const triggered = !!a.triggeredAt
                return (
                  <li
                    key={a.id}
                    className={`bg-surface border rounded-2xl p-3 ${
                      triggered ? 'border-success bg-success-bg/30' : 'border-border'
                    }`}
                  >
                    {confirmId === a.id ? (
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-text">¿Eliminar esta alerta?</p>
                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              removeAlert(user.id, a.id)
                              setConfirmId(null)
                              toast('Alerta eliminada')
                            }}
                            className="text-xs font-semibold text-error bg-error-bg rounded-lg px-3 min-h-[40px]"
                          >
                            Eliminar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="text-xs font-semibold text-muted bg-subtle rounded-lg px-3 min-h-[40px]"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          triggered ? 'bg-success/20' : isBuy ? 'bg-success-bg' : 'bg-info-bg'
                        }`} aria-hidden="true">
                          {triggered
                            ? <Bell size={16} className="text-success" />
                            : isBuy
                              ? <ArrowDownLeft size={16} className="text-success" />
                              : <ArrowUpRight size={16} className="text-info" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text">
                            {isBuy ? 'Comprar' : 'Vender'} USD a S/ {a.targetRate.toFixed(3)}
                          </p>
                          <p className="text-[11px] text-muted">
                            {triggered
                              ? `¡Disparada el ${a.triggeredAt!.toLocaleString('es-PE')}!`
                              : a.active
                                ? 'Activa · te avisaremos por push'
                                : 'Pausada'}
                          </p>
                        </div>
                        {!triggered && (
                          <button
                            type="button"
                            aria-label={a.active ? 'Pausar alerta' : 'Activar alerta'}
                            onClick={() => toggleAlert(user.id, a.id)}
                            className="tap-target rounded-lg hover:bg-subtle"
                          >
                            {a.active
                              ? <Bell size={14} className="text-crown-gold-dim" aria-hidden="true" />
                              : <BellOff size={14} className="text-muted" aria-hidden="true" />}
                          </button>
                        )}
                        <button
                          type="button"
                          aria-label="Eliminar alerta"
                          onClick={() => setConfirmId(a.id)}
                          className="tap-target rounded-lg hover:bg-error-bg"
                        >
                          <Trash2 size={14} className="text-error" aria-hidden="true" />
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}

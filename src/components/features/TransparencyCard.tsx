import { useExchangeStore } from '../../store/exchange.store'
import { formatPEN } from '../../lib/format'

/**
 * Detalle de la tasa aplicada.
 *
 * Muestra, con cifras, el desglose del tipo de cambio: referencia
 * interbancaria, tasa aplicada, spread y el ahorro frente a un banco
 * tradicional. Es dato, no discurso — el cálculo habla por sí solo.
 */

// Referencias mock (en producción vienen de BCRP API y de tu banco principal)
const INTERBANK_RATE_USD = 3.745   // SBS/BCRP referencial
const BANK_RETAIL_SPREAD = 0.08    // ~2.1% que cobran los bancos en retail

export function TransparencyCard() {
  const { rate, getAppliedRate, direction } = useExchangeStore()

  const appliedRate = getAppliedRate()
  const isBuy = direction === 'buy'

  // Spread Andean Crown vs interbancario, en %
  const spreadACPct = Math.abs(((appliedRate - INTERBANK_RATE_USD) / INTERBANK_RATE_USD) * 100)

  // Tasa típica del banco (peor que la nuestra)
  const bankRate = isBuy
    ? INTERBANK_RATE_USD + BANK_RETAIL_SPREAD
    : INTERBANK_RATE_USD - BANK_RETAIL_SPREAD

  // Diferencia por cada USD operado (ahorro absoluto vs banco)
  const savingPerUsd = Math.abs(bankRate - appliedRate)

  // Demostración con monto referencial USD 1,000
  const sampleAmount = 1000
  const sampleSaving = savingPerUsd * sampleAmount

  return (
    <div className="bg-surface border border-border rounded-2xl p-4">
      <p className="text-xs font-semibold text-text mb-3">Detalle de la tasa</p>

      {/* Tabla de desglose */}
      <dl className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Interbancario (BCRP)</dt>
          <dd className="font-mono text-text">S/ {INTERBANK_RATE_USD.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Tu tasa</dt>
          <dd className="font-mono font-bold text-crown-navy">S/ {appliedRate.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between pb-1.5 border-b border-border">
          <dt className="text-muted">Spread</dt>
          <dd className="font-semibold text-success">{spreadACPct.toFixed(2)}%</dd>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <dt className="text-muted">Tasa típica en banco</dt>
          <dd className="font-mono text-muted line-through">S/ {bankRate.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between bg-success-bg rounded-lg px-2 py-2 mt-1">
          <dt className="text-xs font-semibold text-success">Ahorro por cada USD 1,000</dt>
          <dd className="font-bold text-success text-sm">{formatPEN(sampleSaving)}</dd>
        </div>
      </dl>

      <p className="sr-only">
        Tasa interbancaria S/ {INTERBANK_RATE_USD.toFixed(4)}. Tu tasa S/ {appliedRate.toFixed(4)}.
        Spread {spreadACPct.toFixed(2)} por ciento. Ahorro de {formatPEN(sampleSaving)} por cada mil
        dólares respecto a un banco. Actualizado {rate.updatedAt.toLocaleTimeString('es-PE')}.
      </p>
    </div>
  )
}

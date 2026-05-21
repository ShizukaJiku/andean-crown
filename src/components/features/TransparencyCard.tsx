import { useState } from 'react'
import { Info, X } from 'lucide-react'
import { useExchangeStore } from '../../store/exchange.store'
import { formatPEN } from '../../lib/format'

/**
 * Card de "Tasa transparente".
 *
 * Diferenciador frente a Kambista/Rextie/Instakash: muestra abiertamente
 * - tasa interbancaria de referencia (BCRP),
 * - spread aplicado por Andean Crown (en %),
 * - ahorro estimado vs tu banco tradicional para el monto que estás operando.
 *
 * Los competidores ocultan el spread; nosotros lo exhibimos porque el respaldo
 * SMV lo permite comunicar como ventaja competitiva.
 */

// Referencias mock (en producción vienen de BCRP API y de tu banco principal)
const INTERBANK_RATE_USD = 3.745   // SBS/BCRP referencial
const BANK_RETAIL_SPREAD = 0.08    // ~2.1% que cobran BCP/BBVA/IBK/SBK en retail

export function TransparencyCard() {
  const [showHelp, setShowHelp] = useState(false)
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
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-semibold text-text">Tasa transparente</p>
          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            aria-label="Cómo calculamos la tasa"
            aria-expanded={showHelp}
            className="tap-target -m-2"
          >
            <Info size={14} className="text-muted" aria-hidden="true" />
          </button>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wide bg-success-bg text-success rounded px-1.5 py-0.5">
          Sin sorpresas
        </span>
      </div>

      {/* Tabla de transparencia */}
      <dl className="space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Tipo de cambio interbancario (BCRP)</dt>
          <dd className="font-mono text-text">S/ {INTERBANK_RATE_USD.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Tu tasa en Andean Crown</dt>
          <dd className="font-mono font-bold text-crown-navy">S/ {appliedRate.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between pb-1.5 border-b border-border">
          <dt className="text-muted">Spread Andean Crown</dt>
          <dd className="font-semibold text-success">{spreadACPct.toFixed(2)}%</dd>
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <dt className="text-muted">Tasa típica en tu banco</dt>
          <dd className="font-mono text-muted line-through">S/ {bankRate.toFixed(4)}</dd>
        </div>
        <div className="flex items-center justify-between bg-success-bg rounded-lg px-2 py-2 mt-1">
          <dt className="text-xs font-semibold text-success">Ahorras por cada USD 1,000</dt>
          <dd className="font-bold text-success text-sm">{formatPEN(sampleSaving)}</dd>
        </div>
      </dl>

      {/* Tooltip expandible */}
      {showHelp && (
        <div className="mt-3 pt-3 border-t border-border relative">
          <button
            type="button"
            onClick={() => setShowHelp(false)}
            aria-label="Cerrar ayuda"
            className="absolute right-0 top-2 tap-target"
          >
            <X size={14} className="text-muted" aria-hidden="true" />
          </button>
          <p className="text-xs text-muted leading-relaxed pr-6">
            <span className="font-semibold text-text">¿Por qué te lo mostramos?</span> Las
            casas de cambio ocultan cuánto ganan. Como Andean Crown está supervisada por la
            SMV, te exhibimos el spread real frente a la tasa interbancaria del BCRP. Sin
            sorpresas al confirmar.
          </p>
        </div>
      )}

      <p className="sr-only">
        Tasa interbancaria S/ {INTERBANK_RATE_USD.toFixed(4)}. Tu tasa S/ {appliedRate.toFixed(4)}.
        Spread {spreadACPct.toFixed(2)} por ciento. Ahorras {formatPEN(sampleSaving)} por cada mil dólares
        respecto a tu banco. Actualizado {rate.updatedAt.toLocaleTimeString('es-PE')}.
      </p>
    </div>
  )
}

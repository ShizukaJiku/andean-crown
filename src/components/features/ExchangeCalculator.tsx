import { useEffect, useRef, useState } from 'react'
import { ArrowUpDown, Clock } from 'lucide-react'
import { useExchangeStore } from '../../store/exchange.store'
import { formatPEN, formatUSD, formatCountdown, groupThousands } from '../../lib/format'
import { Button } from '../ui/Button'

interface ExchangeCalculatorProps {
  onConfirm: () => void
}

export function ExchangeCalculator({ onConfirm }: ExchangeCalculatorProps) {
  const {
    direction, amountInput,
    countdownSeconds, isCountingDown,
    setDirection, setAmountInput,
    startCountdown, tickCountdown, resetCountdown,
    getAmountResult, getAppliedRate,
  } = useExchangeStore()

  const [touched, setTouched] = useState(false)
  const [amountFocused, setAmountFocused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const result = getAmountResult()
  const appliedRate = getAppliedRate()
  const amount = parseFloat(amountInput) || 0

  useEffect(() => {
    if (isCountingDown) {
      timerRef.current = setInterval(tickCountdown, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isCountingDown, tickCountdown])

  const handleToggleDirection = () => {
    setDirection(direction === 'buy' ? 'sell' : 'buy')
    resetCountdown()
    setTouched(false)
  }

  const handleAmountChange = (v: string) => {
    setAmountInput(v.replace(/[^0-9.]/g, ''))
    setTouched(true)
    if (isCountingDown) resetCountdown()
  }

  const handleCotizar = () => {
    startCountdown()
  }

  const isBuy = direction === 'buy'
  const timerColor = countdownSeconds > 60 ? 'text-success' : 'text-warning'
  const expired = countdownSeconds === 0

  return (
    <div className="flex flex-col gap-4">
      {/* Rate banner */}
      <div className="flex items-center justify-between bg-crown-navy/5 rounded-xl px-4 py-2.5">
        <span className="text-xs text-muted">Tipo de cambio aplicado</span>
        <span className="text-sm font-bold text-crown-navy">S/ {appliedRate.toFixed(3)}</span>
      </div>

      {/* Direction toggle */}
      <div className="relative">
        {/* Send */}
        <div className="bg-surface border border-border rounded-2xl p-4 pb-8 transition-colors focus-within:border-crown-gold">
          <p className="text-xs text-muted mb-2 font-medium">
            {isBuy ? 'Envías (Soles)' : 'Envías (Dólares)'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-muted">{isBuy ? 'S/' : '$'}</span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amountFocused ? amountInput : groupThousands(amountInput)}
              onChange={(e) => handleAmountChange(e.target.value)}
              onFocus={() => setAmountFocused(true)}
              onBlur={() => setAmountFocused(false)}
              aria-label={isBuy ? 'Monto a enviar en soles' : 'Monto a enviar en dólares'}
              aria-invalid={touched && amount <= 0 ? 'true' : 'false'}
              className="flex-1 text-3xl font-bold text-text bg-transparent outline-none placeholder:text-placeholder min-w-0"
            />
            <span className="text-sm font-semibold bg-crown-navy/8 rounded-lg px-2.5 py-1 text-crown-navy">
              {isBuy ? 'PEN' : 'USD'}
            </span>
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={handleToggleDirection}
          type="button"
          aria-label={isBuy ? 'Cambiar a vender dólares' : 'Cambiar a comprar dólares'}
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 w-11 h-11 bg-crown-gold rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform"
        >
          <ArrowUpDown size={18} className="text-crown-navy" strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Receive */}
        <div className="bg-crown-navy/5 border border-transparent rounded-2xl p-4 pt-8 -mt-2">
          <p className="text-xs text-muted mb-2 font-medium">
            {isBuy ? 'Recibes (Dólares)' : 'Recibes (Soles)'}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-muted" aria-hidden="true">{isBuy ? '$' : 'S/'}</span>
            <span
              className="flex-1 text-3xl font-bold text-crown-navy"
              aria-live="polite"
              aria-atomic="true"
              aria-label={`Recibirás ${touched && amount > 0 ? result.toFixed(2) : '0.00'} ${isBuy ? 'dólares' : 'soles'}`}
            >
              {touched && amount > 0
                ? isBuy
                  ? result.toFixed(2)
                  : result.toFixed(2)
                : <span className="text-placeholder" aria-hidden="true">0.00</span>
              }
            </span>
            <span className="text-sm font-semibold bg-crown-gold/15 rounded-lg px-2.5 py-1 text-crown-gold-dim">
              {isBuy ? 'USD' : 'PEN'}
            </span>
          </div>
          {touched && amount > 0 && (
            <p className="text-xs text-muted mt-2">
              {isBuy
                ? `${formatPEN(amount)} ÷ ${appliedRate.toFixed(3)} = ${formatUSD(result)}`
                : `${formatUSD(amount)} × ${appliedRate.toFixed(3)} = ${formatPEN(result)}`
              }
            </p>
          )}

          {/* Validación en vivo: monto mínimo (Nielsen #5 — Error prevention) */}
          {touched && amount > 0 && amount < (isBuy ? 50 : 20) && (
            <p className="text-xs text-warning mt-1.5" role="status" aria-live="polite">
              Monto mínimo recomendado: {isBuy ? formatPEN(50) : formatUSD(20)}.
            </p>
          )}
        </div>
      </div>

      {/* Countdown or cotizar */}
      {isCountingDown && !expired ? (
        <div className="flex items-center justify-between bg-warning-bg rounded-xl px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className={timerColor} />
            <span className="text-xs font-medium text-text">Cotización vigente por</span>
          </div>
          <span className={`text-base font-bold tabular-nums ${timerColor}`}>
            {formatCountdown(countdownSeconds)}
          </span>
        </div>
      ) : expired ? (
        <div className="bg-error-bg rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-xs text-error font-medium">Cotización expirada</span>
          <button type="button" onClick={handleCotizar} className="text-xs font-bold text-error underline min-h-[44px] px-2">
            Recotizar
          </button>
        </div>
      ) : null}

      {/* CTA */}
      {!isCountingDown && !expired && (
        <Button
          variant="secondary"
          fullWidth
          size="lg"
          disabled={!touched || amount <= 0}
          onClick={handleCotizar}
        >
          Cotizar tipo de cambio
        </Button>
      )}

      {isCountingDown && !expired && (
        <Button
          variant="primary"
          fullWidth
          size="lg"
          disabled={!touched || amount <= 0}
          onClick={onConfirm}
        >
          Continuar con S/ {amount > 0 ? amount.toFixed(2) : '0.00'}
        </Button>
      )}

    </div>
  )
}

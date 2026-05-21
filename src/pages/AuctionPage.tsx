import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, Gavel, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { BottomNav } from '../components/ui/BottomNav'
import { Button } from '../components/ui/Button'
import { useExchangeStore } from '../store/exchange.store'
import { formatPEN, formatUSD } from '../lib/format'

/**
 * FX-29 — Subasta de tipo de cambio (modelo inDrive).
 * Pantalla mock que demuestra el flujo de propuesta de tasa para operaciones desde USD 5,000.
 * El backoffice acepta, rechaza o contraoferta dentro de 3 minutos.
 */
type AuctionStatus = 'idle' | 'submitted' | 'counter' | 'accepted'

const MIN_AMOUNT = 5000

export function AuctionPage() {
  const navigate = useNavigate()
  const { rate } = useExchangeStore()
  const [amount, setAmount] = useState('')
  const [proposedRate, setProposedRate] = useState('')
  const [status, setStatus] = useState<AuctionStatus>('idle')
  const [counterRate, setCounterRate] = useState<number | null>(null)

  const amountNum = parseFloat(amount) || 0
  const proposedNum = parseFloat(proposedRate) || 0
  const marketRate = rate.sell
  const minAllowedRate = parseFloat((marketRate * 0.985).toFixed(4))  // ±1.5% del mercado
  const maxAllowedRate = parseFloat((marketRate * 1.015).toFixed(4))

  const amountValid = amountNum >= MIN_AMOUNT
  const rateValid = proposedNum >= minAllowedRate && proposedNum <= maxAllowedRate

  const handleSubmit = () => {
    setStatus('submitted')
    // Simulación: 50/50 acepta o contraoferta a un valor intermedio
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setStatus('accepted')
      } else {
        const mid = parseFloat(((proposedNum + marketRate) / 2).toFixed(4))
        setCounterRate(mid)
        setStatus('counter')
      }
    }, 1800)
  }

  const handleAcceptCounter = () => setStatus('accepted')
  const handleReset = () => {
    setStatus('idle')
    setCounterRate(null)
  }

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-border bg-surface sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft size={22} className="text-text" />
        </button>
        <div>
          <p className="font-bold text-sm text-text">Subasta de tipo de cambio</p>
          <p className="text-xs text-muted">Propón tu propia tasa (Fase 2)</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        {/* Hero explicativo */}
        <div className="bg-gradient-to-br from-crown-navy to-crown-deep rounded-2xl p-5 text-white mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-crown-gold/20 rounded-xl flex items-center justify-center">
              <Gavel size={20} className="text-crown-gold-light" />
            </div>
            <div>
              <p className="font-bold text-base text-crown-gold-light">¿Cómo funciona?</p>
              <p className="text-xs text-white/60">Modelo subasta tipo inDrive</p>
            </div>
          </div>
          <ol className="text-xs text-white/80 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>Operaciones desde USD {MIN_AMOUNT.toLocaleString('en-US')}.</li>
            <li>Propones tu tasa dentro de ±1.5% del mercado.</li>
            <li>Nuestro backoffice acepta, rechaza o contraoferta en 3 minutos.</li>
            <li>Si aceptas, congelamos la tasa y continúas el flujo normal.</li>
          </ol>
        </div>

        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              {/* Tasa de mercado */}
              <div className="flex items-center justify-between bg-crown-navy/5 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-success" />
                  <span className="text-xs text-muted">Tasa de mercado hoy</span>
                </div>
                <span className="text-sm font-bold text-crown-navy">S/ {marketRate.toFixed(4)}</span>
              </div>

              {/* Monto */}
              <div className="bg-surface border border-border rounded-2xl p-4">
                <label className="text-xs text-muted mb-2 font-medium block">
                  Monto en USD (mínimo {formatUSD(MIN_AMOUNT)})
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-muted">$</span>
                  <input
                    type="number"
                    placeholder="5,000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="flex-1 text-2xl font-bold text-text bg-transparent outline-none placeholder:text-gray-200 min-w-0"
                  />
                  <span className="text-sm font-semibold bg-crown-navy/8 rounded-lg px-2.5 py-1 text-crown-navy">USD</span>
                </div>
                {amount && !amountValid && (
                  <p className="text-xs text-error mt-2">El monto mínimo para subasta es {formatUSD(MIN_AMOUNT)}.</p>
                )}
              </div>

              {/* Tasa propuesta */}
              <div className="bg-surface border border-border rounded-2xl p-4">
                <label className="text-xs text-muted mb-2 font-medium block">
                  Tu propuesta (entre S/ {minAllowedRate.toFixed(4)} y S/ {maxAllowedRate.toFixed(4)})
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-muted">S/</span>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder={marketRate.toFixed(4)}
                    value={proposedRate}
                    onChange={(e) => setProposedRate(e.target.value.replace(/[^0-9.]/g, ''))}
                    className="flex-1 text-2xl font-bold text-text bg-transparent outline-none placeholder:text-gray-200 min-w-0"
                  />
                  <span className="text-sm font-semibold bg-crown-gold/15 rounded-lg px-2.5 py-1 text-crown-gold-dim">por 1 USD</span>
                </div>
                {proposedRate && !rateValid && (
                  <p className="text-xs text-error mt-2">
                    Tu propuesta debe estar entre S/ {minAllowedRate.toFixed(4)} y S/ {maxAllowedRate.toFixed(4)}.
                  </p>
                )}
              </div>

              {amountValid && rateValid && (
                <div className="bg-crown-gold/10 rounded-xl p-3">
                  <p className="text-xs text-crown-navy">
                    Recibirías aproximadamente <span className="font-bold">{formatPEN(amountNum * proposedNum)}</span> si tu tasa es aceptada.
                  </p>
                </div>
              )}

              <Button
                variant="primary" fullWidth size="lg"
                disabled={!amountValid || !rateValid}
                onClick={handleSubmit}
              >
                Enviar propuesta a subasta
              </Button>
            </motion.div>
          )}

          {status === 'submitted' && (
            <motion.div
              key="submitted"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center text-center pt-10"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-crown-gold border-t-transparent rounded-full mb-5"
              />
              <p className="font-bold text-base text-text mb-1">Evaluando tu propuesta…</p>
              <p className="text-sm text-muted">El backoffice responde en máximo 3 minutos.</p>
            </motion.div>
          )}

          {status === 'counter' && counterRate !== null && (
            <motion.div
              key="counter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col gap-4"
            >
              <div className="bg-warning-bg rounded-2xl p-4 flex items-center gap-3">
                <Clock size={20} className="text-warning shrink-0" />
                <p className="text-sm text-text">Recibimos tu propuesta y queremos contraofertarte.</p>
              </div>

              <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
                <Row label="Tu propuesta" value={`S/ ${proposedNum.toFixed(4)}`} />
                <Row label="Nuestra contraoferta" value={`S/ ${counterRate.toFixed(4)}`} highlight />
                <Row label="Recibirías" value={formatPEN(amountNum * counterRate)} />
              </div>

              <Button variant="primary" fullWidth size="lg" onClick={handleAcceptCounter}>
                Aceptar contraoferta
              </Button>
              <Button variant="outline" fullWidth onClick={handleReset}>
                Volver a proponer
              </Button>
            </motion.div>
          )}

          {status === 'accepted' && (
            <motion.div
              key="accepted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center text-center pt-6"
            >
              <div className="w-20 h-20 bg-success/15 rounded-full flex items-center justify-center mb-5">
                <CheckCircle2 size={40} className="text-success" strokeWidth={1.5} />
              </div>
              <p className="font-bold text-lg text-text mb-1">¡Propuesta aceptada!</p>
              <p className="text-sm text-muted mb-6">
                Tasa congelada a <span className="font-bold">S/ {(counterRate ?? proposedNum).toFixed(4)}</span> por 10 minutos.
              </p>
              <div className="bg-info-bg rounded-xl p-3 mb-5 w-full">
                <p className="text-xs text-info">
                  En el siguiente paso seleccionarás el banco para depósito y subirás tu voucher.
                </p>
              </div>
              <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/exchange')}>
                Continuar a banco y voucher
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  )
}

function Row({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-border last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? 'text-crown-navy text-base' : 'text-text'}`}>
        {value}
      </span>
    </div>
  )
}

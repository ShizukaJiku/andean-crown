import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { BottomNav } from '../components/ui/BottomNav'
import { StepIndicator } from '../components/ui/StepIndicator'
import { ExchangeCalculator } from '../components/features/ExchangeCalculator'
import { BankSelector } from '../components/features/BankSelector'
import { VoucherUpload } from '../components/features/VoucherUpload'
import { Button } from '../components/ui/Button'
import { useExchangeStore } from '../store/exchange.store'
import { useOperationsStore } from '../store/operations.store'
import { useAuthStore } from '../store/auth.store'
import { formatPEN, formatUSD } from '../lib/format'
import type { Operation } from '../data/mock-operations'

const EXCHANGE_STEPS = ['Cotizar', 'Banco', 'Voucher', 'Confirmar']

export function ExchangePage() {
  const navigate = useNavigate()
  const {
    direction, amountInput, currentStep,
    selectedBankId, voucherRef,
    setCurrentStep, setSelectedBankId, setVoucherRef,
    getAmountResult, getAppliedRate, resetExchange,
  } = useExchangeStore()
  const { addOperation } = useOperationsStore()
  const { user } = useAuthStore()

  const isBuy = direction === 'buy'
  const amount = parseFloat(amountInput) || 0
  const result = getAmountResult()
  const rate = getAppliedRate()

  const handleBack = () => {
    if (currentStep === 0) { resetExchange(); navigate('/home') }
    else setCurrentStep(currentStep - 1)
  }

  const handleCreateOperation = () => {
    const newOp: Operation = {
      id: `op-${Date.now()}`,
      number: `AC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      type: direction,
      amountSent: amount,
      amountReceived: parseFloat(result.toFixed(2)),
      currencySent: isBuy ? 'PEN' : 'USD',
      currencyReceived: isBuy ? 'USD' : 'PEN',
      rate,
      status: 'validando_voucher',
      bank: selectedBankId ?? 'BCP',
      createdAt: new Date(),
      voucherRef,
      timeline: [
        { status: 'pendiente_pago', label: 'Pendiente de pago', description: 'Orden creada.', timestamp: new Date(Date.now() - 5 * 60000) },
        { status: 'validando_voucher', label: 'Validando voucher', description: 'Verificando comprobante.', timestamp: new Date(), isCurrent: true },
        { status: 'procesando', label: 'Procesando', description: 'Confirmamos tu pago.', timestamp: null },
        { status: 'completado', label: 'Completado', description: 'Abono acreditado.', timestamp: null },
      ],
    }
    addOperation(newOp)
    resetExchange()
    navigate(`/status/${newOp.id}`)
  }

  const stepTitles = ['Simular cambio', 'Seleccionar banco', 'Cargar voucher', 'Confirmar operación']
  const stepSubtitles = [
    'Ingresa el monto que deseas cambiar',
    'Elige dónde realizarás tu transferencia',
    'Sube tu comprobante de pago',
    'Revisa y confirma los detalles',
  ]

  const variants = {
    enter: { x: 20, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
  }

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-border bg-surface sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft size={22} className="text-text" />
        </button>
        <div>
          <p className="font-bold text-sm text-text">{stepTitles[currentStep]}</p>
          <p className="text-xs text-muted">{stepSubtitles[currentStep]}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-5 pt-4 pb-3 bg-surface border-b border-border">
        <StepIndicator steps={EXCHANGE_STEPS} current={currentStep} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
          >
            {currentStep === 0 && (
              <ExchangeCalculator onConfirm={() => setCurrentStep(1)} />
            )}

            {currentStep === 1 && (
              <div className="flex flex-col gap-4">
                <BankSelector
                  selectedId={selectedBankId}
                  onSelect={setSelectedBankId}
                  filterCurrency={isBuy ? 'PEN' : 'USD'}
                />
                <Button
                  variant="primary" fullWidth size="lg"
                  disabled={!selectedBankId}
                  onClick={() => setCurrentStep(2)}
                >
                  Confirmar banco
                </Button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-4">
                {/* Summary */}
                <div className="bg-crown-navy/5 rounded-2xl p-4">
                  <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">Resumen de operación</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted">Envías</span>
                    <span className="font-semibold">{isBuy ? formatPEN(amount) : formatUSD(amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted">Recibirás</span>
                    <span className="font-bold text-crown-navy">{isBuy ? formatUSD(result) : formatPEN(result)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted">Tipo de cambio</span>
                    <span className="font-medium">S/ {rate.toFixed(3)}</span>
                  </div>
                </div>
                <VoucherUpload onVoucherReady={setVoucherRef} />
                <Button
                  variant="primary" fullWidth size="lg"
                  disabled={!voucherRef}
                  onClick={() => setCurrentStep(3)}
                >
                  Continuar
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col gap-4">
                <div className="bg-surface border border-border rounded-2xl overflow-hidden">
                  <div className="bg-crown-navy px-4 py-3">
                    <p className="text-xs text-white/60 uppercase tracking-wide">Operación a confirmar</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <Row label="Tipo" value={isBuy ? '🟢 Compra USD' : '🔵 Venta USD'} />
                    <Row label="Envías" value={isBuy ? formatPEN(amount) : formatUSD(amount)} />
                    <Row label="Recibirás" value={isBuy ? formatUSD(result) : formatPEN(result)} highlight />
                    <Row label="Tipo de cambio" value={`S/ ${rate.toFixed(4)}`} />
                    <Row label="Banco seleccionado" value={selectedBankId ?? '-'} />
                    <Row label="Cuenta destino" value={user?.accounts[0]?.cci.slice(-8).padStart(20, '*') ?? '-'} />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-crown-navy/5 to-crown-gold/10 border border-crown-gold/30 rounded-xl p-3">
                  <p className="text-xs font-semibold text-crown-navy mb-0.5">
                    🛡 Garantía SLA de 15 minutos
                  </p>
                  <p className="text-xs text-text/80">
                    Si tu abono no llega en 15 min desde la validación del voucher, te
                    compensamos automáticamente con tasa preferencial en tu siguiente cambio.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-muted">
                    Al confirmar aceptas los términos de la operación y autorizas a Andean Crown a procesar el cambio de divisas.
                  </p>
                </div>

                <Button variant="primary" fullWidth size="lg" onClick={handleCreateOperation}>
                  Confirmar operación
                </Button>
                <Button variant="ghost" fullWidth onClick={handleBack}>
                  Revisar datos
                </Button>
              </div>
            )}
          </motion.div>
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
      <span className={`text-sm font-semibold ${highlight ? 'text-crown-navy text-base' : 'text-text'}`}>{value}</span>
    </div>
  )
}

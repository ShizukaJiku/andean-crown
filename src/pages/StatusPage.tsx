import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, Home, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { useOperationsStore } from '../store/operations.store'
import { formatUSD, formatPEN } from '../lib/format'

export function StatusPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { operations } = useOperationsStore()
  const op = operations.find((o) => o.id === id)
  const [countdown, setCountdown] = useState(15 * 60) // 15 min in seconds

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(t)
  }, [])

  const mins = Math.floor(countdown / 60)
  const secs = countdown % 60

  if (!op) return null

  const isBuy = op.type === 'buy'

  return (
    <div className="mobile-shell flex flex-col">
      {/* Success animation */}
      <div className="bg-gradient-to-br from-crown-navy via-crown-deep to-[#1a3a2a] flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 bg-success/20 rounded-full flex items-center justify-center mb-6"
        >
          <div className="w-16 h-16 bg-success/30 rounded-full flex items-center justify-center">
            <CheckCircle2 size={36} className="text-green-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-white/60 text-sm mb-2">¡Solicitud recibida!</p>
          <p className="text-3xl font-bold text-crown-gold-light">
            {isBuy ? formatUSD(op.amountReceived) : formatPEN(op.amountReceived)}
          </p>
          <p className="text-white/50 text-sm mt-1">
            {isBuy ? 'Dólares en camino a tu cuenta' : 'Soles en camino a tu cuenta'}
          </p>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white/10 rounded-2xl px-6 py-4 w-full max-w-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-white/60" />
              <span className="text-sm text-white/60">Tiempo estimado</span>
            </div>
            <span className="text-base font-bold text-crown-gold-light tabular-nums">
              {mins}:{secs.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="mt-3 bg-white/10 rounded-full h-1.5">
            <motion.div
              className="bg-crown-gold h-full rounded-full"
              animate={{ width: `${(countdown / (15 * 60)) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Operation number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-white/30">N° de operación</p>
          <p className="text-sm font-mono text-white/60 mt-0.5">{op.number}</p>
        </motion.div>
      </div>

      {/* What's next */}
      <div className="bg-surface px-5 pt-6 pb-10">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">¿Qué sigue?</p>
        <div className="space-y-3 mb-6">
          {[
            { icon: '🔍', title: 'Validamos tu voucher', desc: 'Nuestro equipo verifica tu comprobante' },
            { icon: '💸', title: 'Procesamos el abono', desc: 'Transferimos a tu cuenta bancaria' },
            { icon: '📱', title: 'Te notificamos', desc: 'Recibirás una notificación al completarse' },
          ].map((step, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-base shrink-0">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{step.title}</p>
                <p className="text-xs text-muted">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="secondary" fullWidth size="lg"
            onClick={() => navigate(`/operations/${op.id}`)}
          >
            <Eye size={16} /> Ver estado de operación
          </Button>
          <Button
            variant="outline" fullWidth size="lg"
            onClick={() => navigate('/home')}
          >
            <Home size={16} /> Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}

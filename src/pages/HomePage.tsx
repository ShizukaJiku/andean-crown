import { useNavigate } from 'react-router-dom'
import { ArrowDownLeft, ArrowUpRight, Bell, ChevronRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { BottomNav } from '../components/ui/BottomNav'
import { ExchangeRateCard } from '../components/features/ExchangeRateCard'
import { OperationCard } from '../components/features/OperationCard'
import { useAuthStore } from '../store/auth.store'
import { useOperationsStore } from '../store/operations.store'
import { useExchangeStore } from '../store/exchange.store'

export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { operations } = useOperationsStore()
  const { setDirection } = useExchangeStore()

  const recentOps = operations.slice(0, 3)
  const firstName = user?.firstName ?? 'Usuario'

  const handleBuy = () => { setDirection('buy'); navigate('/exchange') }
  const handleSell = () => { setDirection('sell'); navigate('/exchange') }

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="bg-gradient-to-br from-crown-navy to-crown-deep px-5 pt-safe pt-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-crown-gold rounded-xl flex items-center justify-center">
              <span className="text-base">♛</span>
            </div>
            <div>
              <p className="text-white/60 text-xs">Buenos días,</p>
              <p className="text-white font-bold text-base">{firstName}</p>
            </div>
          </div>
          <button className="relative w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Bell size={18} className="text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-crown-gold rounded-full" />
          </button>
        </div>

        {/* KYC badge */}
        {user?.kycStatus === 'verified' && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1.5 mb-4 bg-success/20 rounded-full px-3 py-1 w-fit"
          >
            <Sparkles size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">Cuenta verificada</span>
          </motion.div>
        )}
      </div>

      {/* Floating rate card */}
      <div className="px-4 -mt-4">
        <ExchangeRateCard />
      </div>

      {/* Quick actions */}
      <div className="px-4 mt-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Operaciones rápidas</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleBuy}
            className="bg-surface border border-border rounded-2xl p-4 text-left active:scale-[0.97] transition-transform"
          >
            <div className="w-10 h-10 bg-success-bg rounded-xl flex items-center justify-center mb-3">
              <ArrowDownLeft size={20} className="text-success" />
            </div>
            <p className="font-bold text-text text-sm">Comprar USD</p>
            <p className="text-xs text-muted mt-0.5">Envía soles, recibe dólares</p>
          </button>
          <button
            onClick={handleSell}
            className="bg-surface border border-border rounded-2xl p-4 text-left active:scale-[0.97] transition-transform"
          >
            <div className="w-10 h-10 bg-info-bg rounded-xl flex items-center justify-center mb-3">
              <ArrowUpRight size={20} className="text-info" />
            </div>
            <p className="font-bold text-text text-sm">Vender USD</p>
            <p className="text-xs text-muted mt-0.5">Envía dólares, recibe soles</p>
          </button>
        </div>
      </div>

      {/* Recent operations */}
      <div className="px-4 mt-6 pb-28">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider">Operaciones recientes</p>
          <button onClick={() => navigate('/operations')} className="flex items-center gap-0.5 text-xs text-crown-gold-dim font-medium">
            Ver todo <ChevronRight size={14} />
          </button>
        </div>
        {recentOps.length > 0 ? (
          <div className="flex flex-col gap-2">
            {recentOps.map((op) => (
              <OperationCard key={op.id} operation={op} />
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center">
            <p className="text-sm text-muted">Aún no tienes operaciones</p>
            <button onClick={handleBuy} className="mt-3 text-sm font-semibold text-crown-gold-dim">
              Realizar primer cambio
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

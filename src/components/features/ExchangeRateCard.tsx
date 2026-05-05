import { useEffect, useRef } from 'react'
import { TrendingUp, RefreshCw } from 'lucide-react'
import { useExchangeStore } from '../../store/exchange.store'
import { formatTimeAgo } from '../../lib/format'

export function ExchangeRateCard() {
  const { rate, setRate } = useExchangeStore()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // Simulate slight rate fluctuation every 5 minutes
      setRate({
        buy: parseFloat((rate.buy + (Math.random() * 0.004 - 0.002)).toFixed(4)),
        sell: parseFloat((rate.sell + (Math.random() * 0.004 - 0.002)).toFixed(4)),
        updatedAt: new Date(),
      })
    }, 5 * 60 * 1000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [rate, setRate])

  return (
    <div className="bg-gradient-to-br from-crown-navy to-crown-deep rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-white/60">Tipo de cambio en vivo</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-white/40">
          <RefreshCw size={11} />
          <span>{formatTimeAgo(rate.updatedAt)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/50 mb-1 uppercase tracking-wide">Compra</p>
          <p className="text-2xl font-bold text-crown-gold-light">
            {rate.buy.toFixed(3)}
          </p>
          <p className="text-xs text-white/40 mt-0.5">USD → PEN</p>
        </div>
        <div className="bg-white/10 rounded-xl p-3">
          <p className="text-xs text-white/50 mb-1 uppercase tracking-wide">Venta</p>
          <p className="text-2xl font-bold text-crown-gold-light">
            {rate.sell.toFixed(3)}
          </p>
          <p className="text-xs text-white/40 mt-0.5">PEN → USD</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
        <TrendingUp size={12} className="text-green-400" />
        <p className="text-xs text-white/50">
          Tipo de cambio efectivo · se actualiza cada 5 min
        </p>
      </div>
    </div>
  )
}

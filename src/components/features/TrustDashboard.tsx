import { ShieldCheck, Clock, TrendingUp } from 'lucide-react'

/**
 * Trust dashboard en vivo.
 *
 * Convierte la promesa abstracta "Garantía SLA 15 min" (FX-30) en evidencia
 * cuantitativa visible al usuario. Es el diferenciador conductual frente a
 * Kambista/Rextie/Instakash, que prometen plazos pero no los muestran.
 *
 * En el mock, los números son realistas; en producción salen de un endpoint
 * que agrega operaciones de las últimas 24 horas.
 */

interface TrustStats {
  totalOps24h: number
  avgMinutes: number
  slaCompliancePct: number
  fastestMinutes: number
}

const stats: TrustStats = {
  totalOps24h: 142,
  avgMinutes: 8.2,
  slaCompliancePct: 99.3,
  fastestMinutes: 2.4,
}

export function TrustDashboard() {
  return (
    <section
      aria-labelledby="trust-dashboard-title"
      className="bg-surface border border-border rounded-2xl overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <ShieldCheck size={16} className="text-success" aria-hidden="true" />
        <p id="trust-dashboard-title" className="text-xs font-semibold text-text">
          Rendimiento de hoy
        </p>
        <span
          className="ml-auto flex items-center gap-1 text-[10px] text-muted"
          aria-label="Datos en vivo"
        >
          <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" aria-hidden="true" />
          En vivo · 24h
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-1 px-4 py-3" aria-label="Estadísticas de cumplimiento del SLA">
        <Stat
          icon={<Clock size={14} className="text-crown-gold-dim" aria-hidden="true" />}
          label="Tiempo prom."
          value={`${stats.avgMinutes.toFixed(1)} min`}
          srLabel={`Tiempo promedio de abono: ${stats.avgMinutes.toFixed(1)} minutos`}
        />
        <Stat
          icon={<TrendingUp size={14} className="text-success" aria-hidden="true" />}
          label="SLA cumplido"
          value={`${stats.slaCompliancePct}%`}
          srLabel={`Cumplimiento del SLA de 15 minutos: ${stats.slaCompliancePct} por ciento`}
          accent
        />
        <Stat
          icon={<ShieldCheck size={14} className="text-info" aria-hidden="true" />}
          label="Operaciones"
          value={String(stats.totalOps24h)}
          srLabel={`Operaciones procesadas en las últimas 24 horas: ${stats.totalOps24h}`}
        />
      </dl>

      <div className="px-4 py-2.5 bg-success-bg/50 border-t border-success-bg">
        <p className="text-[11px] text-text leading-relaxed">
          Más rápida hoy: <span className="font-semibold">{stats.fastestMinutes.toFixed(1)} min</span>
          {' · '}SLA objetivo: <span className="font-semibold">15 min</span>
        </p>
      </div>
    </section>
  )
}

function Stat({
  icon, label, value, srLabel, accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  srLabel: string
  accent?: boolean
}) {
  return (
    <div className="flex flex-col items-center text-center" role="group">
      <span className="sr-only">{srLabel}</span>
      <div aria-hidden="true">{icon}</div>
      <dt className="text-[10px] text-muted uppercase tracking-wide mt-1" aria-hidden="true">{label}</dt>
      <dd
        className={`text-base font-bold mt-0.5 ${accent ? 'text-success' : 'text-text'}`}
        aria-hidden="true"
      >
        {value}
      </dd>
    </div>
  )
}

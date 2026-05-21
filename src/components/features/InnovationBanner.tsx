import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Gavel, Euro, ChevronRight } from 'lucide-react'

/**
 * Diferenciadores de Andean Crown frente a la competencia (Kambista, Rextie, Instakash).
 * Materializa las 3 innovaciones del TB1:
 *   - FX-30: Garantía SLA de 15 minutos (MVP)
 *   - FX-29: Subasta de tipo de cambio (Fase 2)
 *   - FX-31: Multidivisa en Euros (Fase 2)
 */
export function InnovationBanner() {
  const navigate = useNavigate()

  return (
    <div className="px-4 mt-6">
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Por qué Andean Crown
      </p>

      {/* Garantía SLA (MVP) — la única casa de cambio en Perú que compensa si no cumple el plazo */}
      <div className="bg-gradient-to-br from-crown-navy to-crown-deep rounded-2xl p-4 text-white mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-crown-gold/20 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck size={20} className="text-crown-gold-light" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-crown-gold-light">Garantía SLA 15 min</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-success/30 text-green-300 rounded px-1.5 py-0.5">
                MVP
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              Si tu abono no llega en 15 minutos desde la validación del voucher, te
              compensamos con tasa preferencial en tu siguiente cambio.
            </p>
          </div>
        </div>
      </div>

      {/* Subasta de tasa (Fase 2) — tipo inDrive */}
      <button
        onClick={() => navigate('/auction')}
        className="w-full bg-surface border border-border rounded-2xl p-4 text-left active:scale-[0.98] transition-transform mb-3 hover:border-crown-gold/40"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-crown-gold/15 rounded-xl flex items-center justify-center shrink-0">
            <Gavel size={20} className="text-crown-gold-dim" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-text">Propón tu propia tasa</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-crown-gold/15 text-crown-gold-dim rounded px-1.5 py-0.5">
                Fase 2
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Para operaciones desde USD 5,000. Modelo subasta tipo inDrive: tú propones,
              nosotros aceptamos o contraofertamos en 3 min.
            </p>
          </div>
          <ChevronRight size={18} className="text-muted shrink-0 mt-1" />
        </div>
      </button>

      {/* Multidivisa EUR (Fase 2) */}
      <div className="bg-surface border border-border border-dashed rounded-2xl p-4 mb-2">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-info-bg rounded-xl flex items-center justify-center shrink-0">
            <Euro size={20} className="text-info" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-bold text-sm text-text">Próximamente: Euros</p>
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-crown-gold/15 text-crown-gold-dim rounded px-1.5 py-0.5">
                Fase 2
              </span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Compra y venta de EUR↔PEN con cuentas operativas en BCP y BBVA. Pensado
              para quienes viajan o pagan servicios en Europa.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

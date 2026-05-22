import { useNavigate } from 'react-router-dom'
import { Gavel, ChevronRight } from 'lucide-react'

/**
 * Acceso directo a la subasta de tipo de cambio.
 * Es un punto de navegación, no un bloque de marketing: una sola tarjeta
 * tappable, sin discurso comparativo ni etiquetas de roadmap.
 */
export function InnovationBanner() {
  const navigate = useNavigate()

  return (
    <section aria-labelledby="auction-entry-title" className="px-4 mt-6">
      <p
        id="auction-entry-title"
        className="text-xs font-semibold text-muted uppercase tracking-wider mb-3"
      >
        Más opciones
      </p>
      <button
        type="button"
        onClick={() => navigate('/auction')}
        aria-label="Abrir subasta de tipo de cambio"
        className="w-full bg-surface border border-border rounded-2xl p-4 text-left flex items-center gap-3 active:scale-[0.98] transition-transform hover:border-crown-gold/40 min-h-[44px]"
      >
        <div className="w-10 h-10 bg-crown-gold/15 rounded-xl flex items-center justify-center shrink-0" aria-hidden="true">
          <Gavel size={20} className="text-crown-gold-dim" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-text">Propón tu propia tasa</p>
          <p className="text-xs text-muted mt-0.5">Subasta para operaciones desde USD 5,000</p>
        </div>
        <ChevronRight size={18} className="text-muted shrink-0" aria-hidden="true" />
      </button>
    </section>
  )
}

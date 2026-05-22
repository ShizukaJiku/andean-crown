import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, AlertCircle } from 'lucide-react'
import { useToastStore } from '../../store/toast.store'

const icons = {
  success: CheckCircle2,
  info: Info,
  error: AlertCircle,
}

const iconTone = {
  success: 'text-green-400',
  info: 'text-info',
  error: 'text-error',
}

/**
 * Pila de notificaciones efímeras. Se monta una vez en App y flota sobre
 * cualquier pantalla, por encima de la barra de navegación.
 */
export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[60] w-full max-w-[358px] px-4 flex flex-col gap-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = icons[t.variant]
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2.5 bg-crown-navy text-white rounded-xl px-4 py-3 shadow-lg"
            >
              <Icon size={18} className={iconTone[t.variant]} aria-hidden="true" />
              <span className="text-sm font-medium">{t.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

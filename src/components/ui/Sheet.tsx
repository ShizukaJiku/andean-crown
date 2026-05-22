import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Hoja inferior (bottom sheet) modal. Se desliza desde abajo dentro del
 * marco del mockup, con fondo oscurecido, cierre por Escape / backdrop.
 */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-crown-navy/50 z-[70]"
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] z-[71] bg-surface rounded-t-3xl max-h-[88dvh] flex flex-col outline-none"
          >
            <div className="flex flex-col items-center pt-2.5">
              <span className="w-9 h-1 rounded-full bg-border" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between px-5 pt-2 pb-3 border-b border-border">
              <h2 className="text-base font-bold text-text">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="tap-target -mr-2 rounded-xl hover:bg-subtle"
              >
                <X size={20} className="text-muted" aria-hidden="true" />
              </button>
            </div>
            <div className="overflow-y-auto px-5 py-4 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

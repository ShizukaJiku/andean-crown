import { useEffect, useState } from 'react'

/**
 * Hook que detecta si el usuario tiene activada la preferencia
 * "Reducir movimiento" en su sistema operativo (WCAG 2.3.3).
 * Usar para deshabilitar animaciones no esenciales.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reduced
}

/**
 * Devuelve variantes de framer-motion neutralizadas si el usuario pidió reducir movimiento.
 * Úsalo para fade-in/slide-in decorativos.
 */
export function getMotionVariants(reduced: boolean) {
  if (reduced) {
    return {
      enter: { opacity: 1, x: 0, y: 0, scale: 1 },
      center: { opacity: 1, x: 0, y: 0, scale: 1 },
      exit: { opacity: 1, x: 0, y: 0, scale: 1 },
    }
  }
  return {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }
}

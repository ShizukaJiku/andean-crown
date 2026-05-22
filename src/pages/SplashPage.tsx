import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShieldCheck, Zap, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'

export function SplashPage() {
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const features = [
    { icon: TrendingUp, text: 'Mejor tipo de cambio del mercado' },
    { icon: Zap, text: 'Operación lista en ~15 minutos' },
    { icon: ShieldCheck, text: 'Plataforma registrada en la SBS' },
  ]

  return (
    <div className="mobile-shell">
      {/* Hero */}
      <main id="main-content" tabIndex={-1} className="bg-gradient-to-b from-crown-navy via-crown-navy to-crown-deep flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-crown-gold/5 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-crown-gold/5 rounded-full translate-y-24 -translate-x-24" />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          {/* Logo */}
          <div className="w-20 h-20 bg-crown-gold rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-crown-gold/30">
            <span className="text-3xl">♛</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Andean Crown</h1>
          <p className="text-crown-gold-light text-sm font-medium mt-1">Casa de Cambio Digital</p>

          <p className="text-white/60 text-sm mt-6 leading-relaxed max-w-xs">
            Cambia soles y dólares de forma rápida, segura y 100% digital desde tu celular.
          </p>
        </motion.div>

        {/* Exchange rate preview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="relative z-10 flex gap-3 mt-10 w-full max-w-xs"
        >
          <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Compra</p>
            <p className="text-2xl font-bold text-crown-gold-light">3.720</p>
          </div>
          <div className="flex-1 bg-white/10 backdrop-blur rounded-2xl p-4 text-center">
            <p className="text-xs text-white/70 uppercase tracking-wide mb-1">Venta</p>
            <p className="text-2xl font-bold text-crown-gold-light">3.760</p>
          </div>
        </motion.div>
      </main>

      {/* Bottom section */}
      <div className="bg-surface px-6 pt-8 pb-10 flex flex-col gap-5">
        {/* Features */}
        <div className="flex flex-col gap-3">
          {features.map(({ icon: Icon, text }, idx) => (
            <motion.div
              key={idx}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 bg-crown-gold/10 rounded-xl flex items-center justify-center shrink-0">
                <Icon size={16} className="text-crown-gold-dim" />
              </div>
              <span className="text-sm text-text">{text}</span>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Button variant="primary" fullWidth size="lg" onClick={() => navigate('/register')}>
            Crear cuenta gratis
          </Button>
          <Button variant="outline" fullWidth size="lg" onClick={() => navigate('/login')}>
            Ya tengo cuenta
          </Button>
        </div>

        <p className="text-center text-xs text-muted">
          Al continuar aceptas los{' '}
          <span className="text-crown-gold-dim font-medium">Términos y Condiciones</span>
        </p>
      </div>
    </div>
  )
}

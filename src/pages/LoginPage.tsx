import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ChevronLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../store/auth.store'
import { isEmail } from '../lib/validation'

type LoginStep = 'credentials' | 'otp'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [step, setStep] = useState<LoginStep>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCredentials = async () => {
    if (!email || !password) { setError('Completa todos los campos'); return }
    if (!isEmail(email)) { setError('Ingresa un correo electrónico válido'); return }
    setError('')
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setStep('otp')
  }

  const handleOtp = async () => {
    const code = otp.join('')
    if (code.length < 6) { setError('Ingresa el código completo'); return }
    setError('')
    setLoading(true)
    const ok = await login(email, password)
    setLoading(false)
    if (ok) navigate('/home', { replace: true })
    else setError('Credenciales incorrectas. Usa: sofia.martinez@gmail.com')
  }

  const handleOtpChange = (idx: number, val: string) => {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus()
    }
  }

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      document.getElementById(`otp-${idx - 1}`)?.focus()
    }
  }

  return (
    <div className="mobile-shell bg-surface">
      {/* Header */}
      <div className="flex items-center px-4 pt-safe pt-4 pb-2">
        <button
          type="button"
          aria-label="Volver"
          onClick={() => step === 'otp' ? setStep('credentials') : navigate('/')}
          className="p-2 -ml-2 rounded-xl hover:bg-subtle"
        >
          <ChevronLeft size={22} className="text-text" aria-hidden="true" />
        </button>
      </div>

      {/* Logo mini */}
      <div className="flex items-center gap-3 px-6 pb-6">
        <div className="w-10 h-10 bg-crown-navy rounded-xl flex items-center justify-center">
          <span className="text-lg text-crown-gold">♛</span>
        </div>
        <div>
          <p className="font-bold text-text text-base">Andean Crown</p>
          <p className="text-xs text-muted">Casa de Cambio Digital</p>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="px-6 flex-1">
        {step === 'credentials' ? (
          <motion.div
            key="credentials"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-text">Iniciar sesión</h1>
              <p className="text-sm text-muted mt-1">Ingresa con tu correo y contraseña</p>
            </div>

            <div className="flex flex-col gap-4">
              <Input
                label="Correo electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                prefix={<Mail size={16} />}
                autoComplete="email"
              />
              <Input
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                prefix={<Lock size={16} />}
                suffix={
                  <button
                    type="button"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="tap-target"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                autoComplete="current-password"
              />
            </div>

            {error && <p role="alert" className="text-sm text-error bg-error-bg rounded-xl px-4 py-3">{error}</p>}

            <button
              type="button"
              className="text-sm text-crown-gold-dim font-medium text-right -mt-2 min-h-[44px] self-end"
            >
              ¿Olvidaste tu contraseña?
            </button>

            {/* Demo hint */}
            <div className="bg-info-bg rounded-xl p-3">
              <p className="text-xs text-info">
                <strong>Demo:</strong> sofia.martinez@gmail.com / cualquier contraseña
              </p>
            </div>

            <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handleCredentials}>
              Continuar
            </Button>

            <p className="text-center text-sm text-muted pb-6">
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => navigate('/register')} className="text-crown-gold-dim font-semibold">
                Regístrate
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="otp"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col gap-6"
          >
            <div>
              <h1 className="text-2xl font-bold text-text">Verificación</h1>
              <p className="text-sm text-muted mt-1">
                Ingresa el código enviado a{' '}
                <span className="text-text font-medium">{email}</span>
              </p>
            </div>

            <div className="bg-success-bg rounded-xl p-3 text-center">
              <p className="text-xs text-success font-medium">
                Demo: ingresa cualquier 6 dígitos (ej. 123456)
              </p>
            </div>

            {/* OTP inputs */}
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  aria-label={`Dígito ${idx + 1} de 6`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-colors
                    border-border focus:border-crown-gold focus:ring-2 focus:ring-crown-gold/20 bg-surface text-text"
                />
              ))}
            </div>

            {error && <p role="alert" className="text-sm text-error bg-error-bg rounded-xl px-4 py-3">{error}</p>}

            <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handleOtp}>
              Verificar e ingresar
            </Button>

            <p className="text-center text-sm text-muted">
              ¿No recibiste el código?{' '}
              <button type="button" className="text-crown-gold-dim font-semibold">Reenviar</button>
            </p>
          </motion.div>
        )}
      </main>
    </div>
  )
}

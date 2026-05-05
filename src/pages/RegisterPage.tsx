import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff, CreditCard, Building2, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { StepIndicator } from '../components/ui/StepIndicator'
import { useAuthStore } from '../store/auth.store'

const STEPS = ['Datos', 'DNI', 'PEP', 'Cuenta']

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  dni: string
  dniType: 'DNI' | 'CE' | 'Pasaporte'
  isPEP: boolean | null
  bank: string
  accountType: string
  cci: string
}

const banks = ['BCP', 'BBVA', 'Interbank', 'Scotiabank', 'Otro']

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState<FormData>({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    dni: '', dniType: 'DNI', isPEP: null, bank: '', accountType: 'Ahorros', cci: '',
  })

  const update = (k: keyof FormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const prev = () => { if (step > 0) setStep((s) => s - 1); else navigate('/') }

  const handleFinish = async () => {
    setLoading(true)
    await register({ firstName: form.firstName, lastName: form.lastName, email: form.email })
    setLoading(false)
    navigate('/home', { replace: true })
  }

  const variants = {
    enter: { x: 30, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -30, opacity: 0 },
  }

  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-4 pb-4 border-b border-border">
        <button onClick={prev} className="p-2 -ml-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft size={22} className="text-text" />
        </button>
        <div>
          <p className="font-bold text-sm text-text">Crear cuenta</p>
          <p className="text-xs text-muted">Paso {step + 1} de {STEPS.length}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="px-6 pt-5 pb-4">
        <StepIndicator steps={STEPS} current={step} />
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 pb-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-5"
          >
            {/* Step 0: Personal data */}
            {step === 0 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-text">Datos personales</h2>
                  <p className="text-sm text-muted mt-1">Completa tu información básica</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Nombre" placeholder="Sofía" value={form.firstName}
                    onChange={(e) => update('firstName', e.target.value)} prefix={<User size={15} />} />
                  <Input label="Apellido" placeholder="Martínez" value={form.lastName}
                    onChange={(e) => update('lastName', e.target.value)} />
                </div>
                <Input label="Correo electrónico" type="email" placeholder="correo@ejemplo.com"
                  value={form.email} onChange={(e) => update('email', e.target.value)}
                  prefix={<Mail size={15} />} />
                <Input label="Celular" type="tel" placeholder="+51 987 654 321"
                  value={form.phone} onChange={(e) => update('phone', e.target.value)}
                  prefix={<Phone size={15} />} />
                <Input label="Contraseña" type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres" value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  prefix={<Lock size={15} />}
                  suffix={
                    <button onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  } />
              </>
            )}

            {/* Step 1: DNI */}
            {step === 1 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-text">Documento de identidad</h2>
                  <p className="text-sm text-muted mt-1">
                    Necesitamos verificar tu identidad (KYC) para cumplir con las normas de la SBS
                  </p>
                </div>
                {/* Doc type selector */}
                <div>
                  <p className="text-sm font-medium text-text mb-2">Tipo de documento</p>
                  <div className="flex gap-2">
                    {(['DNI', 'CE', 'Pasaporte'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => update('dniType', t)}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-colors
                          ${form.dniType === t ? 'border-crown-gold bg-crown-gold/5 text-crown-navy' : 'border-border text-muted'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label={`Número de ${form.dniType}`} placeholder="Ej. 72345678"
                  value={form.dni} onChange={(e) => update('dni', e.target.value)}
                  prefix={<CreditCard size={15} />}
                  hint={form.dniType === 'DNI' ? '8 dígitos' : 'Sin espacios ni guiones'} />
                {/* Mock upload area */}
                <div>
                  <p className="text-sm font-medium text-text mb-2">Foto del documento (frente)</p>
                  <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-2 bg-gray-50">
                    <div className="w-16 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <CreditCard size={20} className="text-muted" />
                    </div>
                    <p className="text-xs text-muted text-center">
                      Toca para tomar foto o subir archivo
                    </p>
                    <button className="text-xs font-semibold text-crown-gold-dim border border-crown-gold/30 rounded-lg px-4 py-1.5">
                      Seleccionar archivo
                    </button>
                  </div>
                  <p className="text-xs text-muted mt-2 text-center">
                    Para esta demo, omite la carga de foto
                  </p>
                </div>
              </>
            )}

            {/* Step 2: PEP */}
            {step === 2 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-text">Declaración PEP</h2>
                  <p className="text-sm text-muted mt-1">
                    Por regulación de la SBS, debemos conocer tu vinculación con cargos públicos
                  </p>
                </div>
                <div className="bg-info-bg rounded-2xl p-4">
                  <p className="text-xs text-info leading-relaxed">
                    <strong>¿Qué es una PEP?</strong> Una Persona Expuesta Políticamente es quien
                    ejerce o ha ejercido funciones públicas relevantes, o tiene familiares directos
                    que lo hacen.
                  </p>
                </div>
                <p className="text-sm font-medium text-text">
                  ¿Eres o tienes un familiar directo que sea Persona Expuesta Políticamente (PEP)?
                </p>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'No, no soy PEP ni tengo vinculación', value: false, desc: 'No ejerzo ni tengo familiares que ejerzan cargos públicos relevantes' },
                    { label: 'Sí, soy PEP o tengo vinculación', value: true, desc: 'Declaro que ejerzo o tengo familiares que ejercen funciones públicas' },
                  ].map(({ label, value, desc }) => (
                    <button
                      key={String(value)}
                      onClick={() => update('isPEP', value)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all
                        ${form.isPEP === value ? 'border-crown-gold bg-crown-gold/5' : 'border-border'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors
                          ${form.isPEP === value ? 'border-crown-gold bg-crown-gold' : 'border-border'}`}>
                          {form.isPEP === value && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text">{label}</p>
                          <p className="text-xs text-muted mt-0.5">{desc}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                {form.isPEP === true && (
                  <div className="bg-warning-bg rounded-xl p-3">
                    <p className="text-xs text-warning font-medium">
                      Tu cuenta será revisada por nuestro equipo de cumplimiento antes de activarse.
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Step 3: Bank account */}
            {step === 3 && (
              <>
                <div>
                  <h2 className="text-xl font-bold text-text">Cuenta bancaria</h2>
                  <p className="text-sm text-muted mt-1">
                    Registra la cuenta donde recibirás tus abonos
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-text mb-2">Banco</p>
                  <div className="grid grid-cols-3 gap-2">
                    {banks.map((b) => (
                      <button
                        key={b}
                        onClick={() => update('bank', b)}
                        className={`py-3 text-sm font-medium rounded-xl border-2 transition-colors
                          ${form.bank === b ? 'border-crown-gold bg-crown-gold/5 text-crown-navy' : 'border-border text-muted'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-text mb-2">Tipo de cuenta</p>
                  <div className="flex gap-2">
                    {['Ahorros', 'Corriente'].map((t) => (
                      <button
                        key={t}
                        onClick={() => update('accountType', t)}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-xl border-2 transition-colors
                          ${form.accountType === t ? 'border-crown-gold bg-crown-gold/5 text-crown-navy' : 'border-border text-muted'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <Input label="CCI (Código de Cuenta Interbancario)" placeholder="20 dígitos"
                  value={form.cci} onChange={(e) => update('cci', e.target.value)}
                  prefix={<Building2 size={15} />}
                  hint="El CCI tiene 20 dígitos y está en tu app o estado de cuenta" />
                <div className="bg-success-bg rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
                  <p className="text-xs text-success">
                    Solo se aceptan cuentas a nombre del titular registrado
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <div className="px-6 pb-8 pt-4 border-t border-border">
        {step < STEPS.length - 1 ? (
          <Button variant="primary" fullWidth size="lg" onClick={next}>
            Continuar
          </Button>
        ) : (
          <Button variant="primary" fullWidth size="lg" loading={loading} onClick={handleFinish}>
            Crear mi cuenta
          </Button>
        )}
        {step === 0 && (
          <p className="text-center text-sm text-muted mt-4">
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} className="text-crown-gold-dim font-semibold">
              Iniciar sesión
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

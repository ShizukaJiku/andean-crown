import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, CreditCard, Plus, Trash2,
  ChevronRight, ShieldCheck, LogOut, Bell, HelpCircle,
} from 'lucide-react'
import { BottomNav } from '../components/ui/BottomNav'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/auth.store'
import type { BankAccount } from '../data/mock-user'

const bankColors: Record<string, string> = {
  BCP: '#003F8A', BBVA: '#004A97', Interbank: '#00A859', Scotiabank: '#EC111A',
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="mobile-shell">
      {/* Header */}
      <div className="bg-gradient-to-br from-crown-navy to-crown-deep px-5 pt-safe pt-6 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-crown-gold rounded-2xl flex items-center justify-center shrink-0">
            <span className="text-2xl font-bold text-crown-navy">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-lg">{user.name}</p>
            <p className="text-white/50 text-sm truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Badge variant="success" size="sm">
                <ShieldCheck size={11} className="mr-0.5" />
                KYC Verificado
              </Badge>
              {!user.isPEP && <Badge variant="default" size="sm">No PEP</Badge>}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-5">
        {/* Personal info */}
        <Section title="Datos personales">
          <InfoRow icon={<User size={15} />} label="Nombre completo" value={user.name} />
          <InfoRow icon={<Mail size={15} />} label="Correo" value={user.email} />
          <InfoRow icon={<Phone size={15} />} label="Celular" value={user.phone} />
          <InfoRow icon={<CreditCard size={15} />} label="DNI" value={user.dni} />
        </Section>

        {/* Bank accounts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider">Cuentas bancarias</p>
            <button className="flex items-center gap-1 text-xs font-semibold text-crown-gold-dim">
              <Plus size={14} /> Agregar
            </button>
          </div>
          <div className="space-y-2">
            {user.accounts.map((acc) => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>
        </div>

        {/* Settings */}
        <Section title="Configuración">
          <MenuRow icon={<Bell size={15} />} label="Notificaciones" />
          <MenuRow icon={<ShieldCheck size={15} />} label="Seguridad y acceso" />
          <MenuRow icon={<HelpCircle size={15} />} label="Centro de ayuda" />
        </Section>

        {/* Logout */}
        {showLogoutConfirm ? (
          <div className="bg-error-bg border border-error/20 rounded-2xl p-4">
            <p className="text-sm font-semibold text-error mb-3">¿Cerrar sesión?</p>
            <div className="flex gap-3">
              <Button variant="danger" size="sm" fullWidth onClick={handleLogout}>Salir</Button>
              <Button variant="outline" size="sm" fullWidth onClick={() => setShowLogoutConfirm(false)}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 w-full text-left p-4 bg-surface border border-border rounded-2xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-error-bg rounded-xl flex items-center justify-center shrink-0">
              <LogOut size={15} className="text-error" />
            </div>
            <span className="text-sm font-medium text-error">Cerrar sesión</span>
          </button>
        )}

        {/* Version */}
        <p className="text-center text-xs text-muted pb-2">
          Andean Crown v1.0.0 · Registrado en SBS
        </p>
      </div>

      <BottomNav />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">{title}</p>
      <div className="bg-surface border border-border rounded-2xl overflow-hidden divide-y divide-border">
        {children}
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="text-muted shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-text truncate">{value}</p>
      </div>
    </div>
  )
}

function MenuRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-gray-50 transition-colors">
      <div className="text-muted shrink-0">{icon}</div>
      <span className="flex-1 text-sm text-text text-left">{label}</span>
      <ChevronRight size={15} className="text-muted" />
    </button>
  )
}

function AccountCard({ account }: { account: BankAccount }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
        style={{ backgroundColor: bankColors[account.bank] ?? '#64748B' }}
      >
        {account.bank.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-text">{account.bank}</p>
          {account.isPrimary && <Badge variant="gold" size="sm">Principal</Badge>}
        </div>
        <p className="text-xs text-muted">{account.currency} · {account.type}</p>
        <p className="text-xs font-mono text-muted mt-0.5">
          ···{account.cci.slice(-6)}
        </p>
      </div>
      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
        <Trash2 size={15} className="text-muted" />
      </button>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, Mail, Phone, CreditCard, Plus, Trash2,
  ChevronRight, ShieldCheck, LogOut, Bell, HelpCircle,
} from 'lucide-react'
import { BottomNav } from '../components/ui/BottomNav'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Sheet } from '../components/ui/Sheet'
import { AddAccountForm } from '../components/features/AddAccountForm'
import { useAuthStore } from '../store/auth.store'
import { toast } from '../store/toast.store'
import type { BankAccount } from '../data/mock-user'

const bankColors: Record<string, string> = {
  BCP: '#003F8A', BBVA: '#004A97', Interbank: '#00A859', Scotiabank: '#EC111A',
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout, addAccount, removeAccount } = useAuthStore()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showAddAccount, setShowAddAccount] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const handleDeleteAccount = (id: string) => {
    removeAccount(id)
    toast('Cuenta bancaria eliminada')
  }

  const handleAddAccount = (account: Omit<BankAccount, 'id' | 'isPrimary'>) => {
    addAccount(account)
    setShowAddAccount(false)
    toast('Cuenta bancaria agregada')
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
            <p className="text-white/70 text-sm truncate">{user.email}</p>
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

      <main id="main-content" tabIndex={-1} className="flex-1 overflow-y-auto px-4 py-5 pb-28 space-y-5">
        <h1 className="sr-only">Mi perfil</h1>
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
            <button
              type="button"
              onClick={() => setShowAddAccount(true)}
              className="flex items-center gap-1 text-xs font-semibold text-crown-gold-dim min-h-[44px]"
            >
              <Plus size={14} aria-hidden="true" /> Agregar
            </button>
          </div>
          <div className="space-y-2">
            {user.accounts.length > 0 ? (
              user.accounts.map((acc) => (
                <AccountCard
                  key={acc.id}
                  account={acc}
                  onDelete={() => handleDeleteAccount(acc.id)}
                />
              ))
            ) : (
              <p className="text-xs text-muted bg-surface border border-border border-dashed rounded-2xl p-4 text-center">
                No tienes cuentas registradas.
              </p>
            )}
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
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center gap-3 w-full text-left p-4 bg-surface border border-border rounded-2xl hover:bg-subtle transition-colors"
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
      </main>

      <BottomNav />

      <Sheet
        open={showAddAccount}
        onClose={() => setShowAddAccount(false)}
        title="Agregar cuenta bancaria"
      >
        <AddAccountForm onSubmit={handleAddAccount} onCancel={() => setShowAddAccount(false)} />
      </Sheet>
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
    <button type="button" className="flex items-center gap-3 px-4 py-3 w-full min-h-[44px] hover:bg-subtle transition-colors">
      <div className="text-muted shrink-0">{icon}</div>
      <span className="flex-1 text-sm text-text text-left">{label}</span>
      <ChevronRight size={15} className="text-muted" aria-hidden="true" />
    </button>
  )
}

function AccountCard({ account, onDelete }: { account: BankAccount; onDelete: () => void }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <div className="bg-surface border border-error/30 rounded-2xl p-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text">¿Eliminar esta cuenta?</p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onDelete}
            className="text-xs font-semibold text-error bg-error-bg rounded-lg px-3 min-h-[40px]"
          >
            Eliminar
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="text-xs font-semibold text-muted bg-subtle rounded-lg px-3 min-h-[40px]"
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

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
      <button
        type="button"
        aria-label={`Eliminar cuenta ${account.bank}`}
        onClick={() => setConfirming(true)}
        className="tap-target hover:bg-subtle rounded-xl transition-colors"
      >
        <Trash2 size={15} className="text-muted" aria-hidden="true" />
      </button>
    </div>
  )
}

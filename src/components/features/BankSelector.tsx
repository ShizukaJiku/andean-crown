import { useEffect, useRef, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { companyAccounts, type CompanyAccount } from '../../data/mock-rates'
import { cn } from '../../lib/cn'
import { toast } from '../../store/toast.store'


interface BankSelectorProps {
  selectedId: string | null
  onSelect: (id: string) => void
  filterCurrency?: 'PEN' | 'USD' | 'EUR'
  /** When false (default), hide Fase 2 EUR accounts. Set to true on the EUR flow. */
  includeFase2?: boolean
  /** Restringe las cuentas a los bancos donde el usuario tiene cuenta registrada. */
  userBanks?: string[]
  /** Banco a preseleccionar (el de la cuenta principal del usuario). */
  preferredBank?: string
}

const currencyLabel = (c: 'PEN' | 'USD' | 'EUR') =>
  c === 'PEN' ? 'Soles' : c === 'USD' ? 'Dólares' : 'Euros'

export function BankSelector({
  selectedId, onSelect, filterCurrency, includeFase2 = false, userBanks, preferredBank,
}: BankSelectorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const didInit = useRef(false)

  const baseAccounts = companyAccounts
    .filter((a) => (filterCurrency ? a.currency === filterCurrency : true))
    .filter((a) => (a.phase === 'fase2' ? includeFase2 : true))

  // Solo bancos donde el usuario tiene cuenta registrada. Si ninguno coincide
  // (p. ej. transferencia interbancaria), se muestran todos para no bloquear.
  const matchedByUser = userBanks
    ? baseAccounts.filter((a) => userBanks.includes(a.bank))
    : baseAccounts
  const accounts = matchedByUser.length > 0 ? matchedByUser : baseAccounts

  // Preselecciona, una sola vez, la cuenta del banco principal del usuario.
  useEffect(() => {
    if (didInit.current) return
    didInit.current = true
    if (selectedId || accounts.length === 0) return
    const preferred = accounts.find((a) => a.bank === preferredBank)
    onSelect((preferred ?? accounts[0]).id)
  }, [selectedId, accounts, preferredBank, onSelect])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      toast('CCI copiado al portapapeles')
      setTimeout(() => setCopiedId(null), 2000)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted">
        Selecciona el banco donde realizarás tu transferencia:
      </p>
      {accounts.map((account: CompanyAccount) => (
        <div
          key={account.id}
          role="button"
          tabIndex={0}
          aria-pressed={selectedId === account.id}
          aria-label={`Seleccionar ${account.bank}, cuenta en ${currencyLabel(account.currency)}`}
          onClick={() => onSelect(account.id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelect(account.id)
            }
          }}
          className={cn(
            'border-2 rounded-2xl p-4 cursor-pointer transition-all',
            selectedId === account.id
              ? 'border-crown-gold bg-crown-gold/5'
              : 'border-border bg-surface hover:border-crown-gold/40'
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Bank logo placeholder */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ backgroundColor: account.color }}
              >
                {account.logo}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-text text-sm">{account.bank}</p>
                <p className="text-xs text-muted">{currencyLabel(account.currency)} · Ahorros</p>
              </div>
            </div>
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors',
                selectedId === account.id
                  ? 'border-crown-gold bg-crown-gold'
                  : 'border-border'
              )}
            >
              {selectedId === account.id && (
                <Check size={11} className="text-crown-navy" strokeWidth={3} />
              )}
            </div>
          </div>

          {selectedId === account.id && (
            <div className="mt-3 pt-3 border-t border-crown-gold/20 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted">N° de cuenta</p>
                  <p className="text-sm font-mono text-text">{account.accountNumber}</p>
                </div>
              </div>
              <div className="flex items-center justify-between bg-subtle rounded-xl px-3 py-2">
                <div>
                  <p className="text-xs text-muted">CCI (para transferencia interbancaria)</p>
                  <p className="text-sm font-mono text-text font-medium">{account.cci}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(account.cci, account.id) }}
                  type="button"
                  aria-label={`Copiar CCI del ${account.bank}`}
                  className="tap-target rounded-lg hover:bg-subtle transition-colors shrink-0"
                >
                  {copiedId === account.id
                    ? <Check size={16} className="text-success" aria-hidden="true" />
                    : <Copy size={16} className="text-muted" aria-hidden="true" />
                  }
                  {copiedId === account.id && <span className="sr-only">CCI copiado al portapapeles</span>}
                </button>
              </div>
              <p className="text-xs text-muted">Titular: <span className="text-text font-medium">{account.holder}</span></p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { companyAccounts, type CompanyAccount } from '../../data/mock-rates'
import { cn } from '../../lib/cn'


interface BankSelectorProps {
  selectedId: string | null
  onSelect: (id: string) => void
  filterCurrency?: 'PEN' | 'USD'
}

export function BankSelector({ selectedId, onSelect, filterCurrency }: BankSelectorProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const accounts = filterCurrency
    ? companyAccounts.filter((a) => a.currency === filterCurrency)
    : companyAccounts

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
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
          onClick={() => onSelect(account.id)}
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
                <p className="text-xs text-muted">{account.currency === 'PEN' ? 'Soles' : 'Dólares'} · Ahorros</p>
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
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                <div>
                  <p className="text-xs text-muted">CCI (para transferencia interbancaria)</p>
                  <p className="text-sm font-mono text-text font-medium">{account.cci}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); copyToClipboard(account.cci, account.id) }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                >
                  {copiedId === account.id
                    ? <Check size={15} className="text-success" />
                    : <Copy size={15} className="text-muted" />
                  }
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

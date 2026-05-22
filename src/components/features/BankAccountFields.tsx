import { Building2, Hash } from 'lucide-react'
import { Input } from '../ui/Input'
import { digitsOnly, isCCI, isAccountNumber } from '../../lib/validation'
import type { BankAccount } from '../../data/mock-user'
import type { BankAccountDraft } from '../../lib/bank-account'

const BANKS: BankAccount['bank'][] = ['BCP', 'BBVA', 'Interbank', 'Scotiabank']

const optionClass = (selected: boolean) =>
  `py-2.5 text-sm font-medium rounded-xl border-2 transition-colors ${
    selected
      ? 'border-crown-gold bg-crown-gold/5 text-crown-navy'
      : 'border-border text-muted'
  }`

interface BankAccountFieldsProps {
  value: BankAccountDraft
  onChange: (value: BankAccountDraft) => void
}

/**
 * Campos de una cuenta bancaria, compartidos entre el registro de usuario
 * y el alta de cuentas desde el perfil — así ambos piden exactamente lo mismo.
 */
export function BankAccountFields({ value, onChange }: BankAccountFieldsProps) {
  const set = <K extends keyof BankAccountDraft>(key: K, v: BankAccountDraft[K]) =>
    onChange({ ...value, [key]: v })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-text mb-2">Banco</p>
        <div className="grid grid-cols-2 gap-2">
          {BANKS.map((b) => (
            <button key={b} type="button" onClick={() => set('bank', b)} className={optionClass(value.bank === b)}>
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text mb-2">Moneda</p>
        <div className="flex gap-2">
          {(['PEN', 'USD'] as const).map((c) => (
            <button key={c} type="button" onClick={() => set('currency', c)} className={`flex-1 ${optionClass(value.currency === c)}`}>
              {c === 'PEN' ? 'Soles (PEN)' : 'Dólares (USD)'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text mb-2">Tipo de cuenta</p>
        <div className="flex gap-2">
          {(['Ahorros', 'Corriente'] as const).map((t) => (
            <button key={t} type="button" onClick={() => set('type', t)} className={`flex-1 ${optionClass(value.type === t)}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Número de cuenta"
        placeholder="Ej. 191-1234567-0-12"
        inputMode="numeric"
        value={value.accountNumber}
        onChange={(e) => set('accountNumber', e.target.value.replace(/[^\d-]/g, ''))}
        prefix={<Building2 size={15} />}
        error={value.accountNumber !== '' && !isAccountNumber(value.accountNumber) ? 'Número de cuenta no válido' : undefined}
      />

      <Input
        label="CCI (Código de Cuenta Interbancario)"
        placeholder="20 dígitos"
        inputMode="numeric"
        value={value.cci}
        onChange={(e) => set('cci', digitsOnly(e.target.value).slice(0, 20))}
        prefix={<Hash size={15} />}
        error={value.cci !== '' && !isCCI(value.cci) ? 'El CCI debe tener 20 dígitos' : undefined}
        hint="20 dígitos, solo números"
      />
    </div>
  )
}

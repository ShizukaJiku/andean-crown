import { useState } from 'react'
import { Button } from '../ui/Button'
import { BankAccountFields } from './BankAccountFields'
import {
  emptyBankAccountDraft,
  isBankAccountDraftValid,
  type BankAccountDraft,
} from '../../lib/bank-account'

interface AddAccountFormProps {
  onSubmit: (account: BankAccountDraft) => void
  onCancel: () => void
}

export function AddAccountForm({ onSubmit, onCancel }: AddAccountFormProps) {
  const [draft, setDraft] = useState<BankAccountDraft>(emptyBankAccountDraft)
  const valid = isBankAccountDraftValid(draft)

  return (
    <div className="flex flex-col gap-4">
      <BankAccountFields value={draft} onChange={setDraft} />
      <div className="flex gap-3 pt-1">
        <Button variant="outline" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          fullWidth
          disabled={!valid}
          onClick={() => valid && onSubmit(draft)}
        >
          Agregar cuenta
        </Button>
      </div>
    </div>
  )
}

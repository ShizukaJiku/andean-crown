import { isCCI, isAccountNumber } from './validation'
import type { BankAccount } from '../data/mock-user'

/** Datos de una cuenta bancaria antes de asignarle id / cuenta principal. */
export type BankAccountDraft = Omit<BankAccount, 'id' | 'isPrimary'>

export const emptyBankAccountDraft: BankAccountDraft = {
  bank: 'BCP',
  currency: 'PEN',
  type: 'Ahorros',
  accountNumber: '',
  cci: '',
}

/** Una cuenta es válida cuando tiene número de cuenta y CCI correctos. */
export const isBankAccountDraftValid = (d: BankAccountDraft): boolean =>
  isAccountNumber(d.accountNumber) && isCCI(d.cci)

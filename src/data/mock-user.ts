export interface BankAccount {
  id: string
  bank: 'BCP' | 'BBVA' | 'Interbank' | 'Scotiabank'
  currency: 'PEN' | 'USD'
  type: 'Ahorros' | 'Corriente'
  accountNumber: string
  cci: string
  isPrimary: boolean
}

export interface MockUser {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dni: string
  isPEP: boolean
  kycStatus: 'pending' | 'verified' | 'rejected'
  accounts: BankAccount[]
  createdAt: Date
}

export const mockUser: MockUser = {
  id: 'usr-001',
  name: 'Sofía Martínez',
  firstName: 'Sofía',
  lastName: 'Martínez',
  email: 'sofia.martinez@gmail.com',
  phone: '+51 987 654 321',
  dni: '72345678',
  isPEP: false,
  kycStatus: 'verified',
  accounts: [
    {
      id: 'acc-001',
      bank: 'BCP',
      currency: 'PEN',
      type: 'Ahorros',
      accountNumber: '191-12345678-0-12',
      cci: '00219100123456780120',
      isPrimary: true,
    },
    {
      id: 'acc-002',
      bank: 'BBVA',
      currency: 'USD',
      type: 'Ahorros',
      accountNumber: '0011-0175-0123456789',
      cci: '01101750012345678900',
      isPrimary: false,
    },
  ],
  createdAt: new Date('2026-01-15'),
}

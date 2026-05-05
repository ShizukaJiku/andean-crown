export interface ExchangeRate {
  buy: number   // Compra (cuántos soles paga la casa por 1 USD)
  sell: number  // Venta (cuántos soles cobra la casa por 1 USD)
  updatedAt: Date
}

export const initialRate: ExchangeRate = {
  buy: 3.720,
  sell: 3.760,
  updatedAt: new Date(),
}

// Company bank accounts for deposits (shown to client)
export interface CompanyAccount {
  id: string
  bank: 'BCP' | 'BBVA' | 'Interbank' | 'Scotiabank'
  currency: 'PEN' | 'USD'
  accountNumber: string
  cci: string
  holder: string
  color: string
  logo: string
}

export const companyAccounts: CompanyAccount[] = [
  {
    id: 'ca-001',
    bank: 'BCP',
    currency: 'PEN',
    accountNumber: '191-98765432-0-01',
    cci: '00219100987654320010',
    holder: 'Andean Crown S.A.C.',
    color: '#003F8A',
    logo: 'BCP',
  },
  {
    id: 'ca-002',
    bank: 'BBVA',
    currency: 'PEN',
    accountNumber: '0011-0175-9876543210',
    cci: '01101750987654321000',
    holder: 'Andean Crown S.A.C.',
    color: '#004A97',
    logo: 'BBVA',
  },
  {
    id: 'ca-003',
    bank: 'Interbank',
    currency: 'PEN',
    accountNumber: '898-3012345678',
    cci: '00389800301234567800',
    holder: 'Andean Crown S.A.C.',
    color: '#00A859',
    logo: 'IBK',
  },
  {
    id: 'ca-004',
    bank: 'Scotiabank',
    currency: 'USD',
    accountNumber: '000-1234567',
    cci: '00900001234567000000',
    holder: 'Andean Crown S.A.C.',
    color: '#EC111A',
    logo: 'SBK',
  },
]

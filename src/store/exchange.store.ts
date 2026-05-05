import { create } from 'zustand'
import { initialRate, type ExchangeRate } from '../data/mock-rates'

type ExchangeDirection = 'buy' | 'sell' // buy = client buys USD (sends PEN), sell = client sells USD (sends USD)

interface ExchangeState {
  rate: ExchangeRate
  direction: ExchangeDirection
  amountInput: string
  countdownSeconds: number
  isCountingDown: boolean
  currentStep: number // 0-3 within ExchangePage
  selectedBankId: string | null
  voucherRef: string

  setRate: (rate: ExchangeRate) => void
  setDirection: (d: ExchangeDirection) => void
  setAmountInput: (v: string) => void
  startCountdown: () => void
  tickCountdown: () => void
  resetCountdown: () => void
  setCurrentStep: (step: number) => void
  setSelectedBankId: (id: string) => void
  setVoucherRef: (ref: string) => void
  resetExchange: () => void

  // Derived
  getAmountResult: () => number
  getAppliedRate: () => number
}

export const useExchangeStore = create<ExchangeState>((set, get) => ({
  rate: { ...initialRate },
  direction: 'buy',
  amountInput: '',
  countdownSeconds: 180,
  isCountingDown: false,
  currentStep: 0,
  selectedBankId: null,
  voucherRef: '',

  setRate: (rate) => set({ rate }),
  setDirection: (direction) => set({ direction, amountInput: '' }),
  setAmountInput: (amountInput) => set({ amountInput }),

  startCountdown: () => set({ isCountingDown: true, countdownSeconds: 180 }),
  tickCountdown: () =>
    set((state) => {
      const next = state.countdownSeconds - 1
      if (next <= 0) return { countdownSeconds: 0, isCountingDown: false }
      return { countdownSeconds: next }
    }),
  resetCountdown: () => set({ isCountingDown: false, countdownSeconds: 180 }),

  setCurrentStep: (currentStep) => set({ currentStep }),
  setSelectedBankId: (selectedBankId) => set({ selectedBankId }),
  setVoucherRef: (voucherRef) => set({ voucherRef }),

  resetExchange: () =>
    set({
      direction: 'buy',
      amountInput: '',
      countdownSeconds: 180,
      isCountingDown: false,
      currentStep: 0,
      selectedBankId: null,
      voucherRef: '',
    }),

  getAmountResult: () => {
    const { amountInput, direction, rate } = get()
    const amount = parseFloat(amountInput) || 0
    if (direction === 'buy') {
      // Client sends PEN, receives USD
      return amount / rate.sell
    } else {
      // Client sends USD, receives PEN
      return amount * rate.buy
    }
  },

  getAppliedRate: () => {
    const { direction, rate } = get()
    return direction === 'buy' ? rate.sell : rate.buy
  },
}))

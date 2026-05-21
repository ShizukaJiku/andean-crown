import { create } from 'zustand'

/**
 * Rate alerts (avísame cuando el USD esté en S/ X).
 * Diferenciador funcional: ningún competidor peruano (Kambista, Rextie, Instakash)
 * lo ofrece hoy. Convierte la app de reactiva (el usuario entra y mira la tasa)
 * a proactiva (la app le avisa al usuario cuando conviene).
 */

export interface RateAlert {
  id: string
  direction: 'buy' | 'sell'   // buy = compro USD, espero tasa baja; sell = vendo USD, espero tasa alta
  targetRate: number
  active: boolean
  createdAt: Date
  triggeredAt?: Date
}

interface AlertsState {
  alerts: RateAlert[]
  addAlert: (direction: 'buy' | 'sell', targetRate: number) => void
  removeAlert: (id: string) => void
  toggleAlert: (id: string) => void
  evaluate: (currentBuy: number, currentSell: number) => void
}

export const useAlertsStore = create<AlertsState>((set) => ({
  alerts: [],

  addAlert: (direction, targetRate) =>
    set((s) => ({
      alerts: [
        {
          id: `alert-${Date.now()}`,
          direction,
          targetRate,
          active: true,
          createdAt: new Date(),
        },
        ...s.alerts,
      ],
    })),

  removeAlert: (id) =>
    set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),

  toggleAlert: (id) =>
    set((s) => ({
      alerts: s.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
    })),

  /**
   * Reglas:
   *   - Si compras dólares (direction "buy"), te interesa que el tipo de venta BAJE.
   *     Disparo cuando currentSell <= targetRate.
   *   - Si vendes dólares (direction "sell"), te interesa que el tipo de compra SUBA.
   *     Disparo cuando currentBuy >= targetRate.
   */
  evaluate: (currentBuy, currentSell) =>
    set((s) => ({
      alerts: s.alerts.map((a) => {
        if (!a.active || a.triggeredAt) return a
        const hit =
          (a.direction === 'buy' && currentSell <= a.targetRate) ||
          (a.direction === 'sell' && currentBuy >= a.targetRate)
        return hit ? { ...a, triggeredAt: new Date(), active: false } : a
      }),
    })),
}))

// Selector helper para uso fuera del componente
export const getActiveAlerts = () => useAlertsStore.getState().alerts.filter((a) => a.active)

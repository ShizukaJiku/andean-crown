import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { dateAwareStorage } from '../lib/persist'
import { useAuthStore } from './auth.store'

/**
 * Rate alerts (avísame cuando el USD esté en S/ X), propias de cada usuario.
 */
export interface RateAlert {
  id: string
  direction: 'buy' | 'sell'
  targetRate: number
  active: boolean
  createdAt: Date
  triggeredAt?: Date
}

interface AlertsState {
  /** Alertas por usuario. */
  byUser: Record<string, RateAlert[]>
  addAlert: (userId: string, direction: 'buy' | 'sell', targetRate: number) => void
  removeAlert: (userId: string, id: string) => void
  toggleAlert: (userId: string, id: string) => void
}

// Referencia estable para "sin alertas".
const EMPTY: RateAlert[] = []

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set) => ({
      byUser: {},

      addAlert: (userId, direction, targetRate) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: [
              {
                id: `alert-${Date.now()}`,
                direction,
                targetRate,
                active: true,
                createdAt: new Date(),
              },
              ...(state.byUser[userId] ?? EMPTY),
            ],
          },
        })),

      removeAlert: (userId, id) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: (state.byUser[userId] ?? EMPTY).filter((a) => a.id !== id),
          },
        })),

      toggleAlert: (userId, id) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: (state.byUser[userId] ?? EMPTY).map((a) =>
              a.id === id ? { ...a, active: !a.active } : a,
            ),
          },
        })),
    }),
    { name: 'andean-alerts-v2', storage: dateAwareStorage<AlertsState>() },
  ),
)

/** Alertas del usuario autenticado actual. */
export function useUserAlerts(): RateAlert[] {
  const userId = useAuthStore((s) => s.currentUserId)
  return useAlertsStore((s) => (userId ? s.byUser[userId] ?? EMPTY : EMPTY))
}

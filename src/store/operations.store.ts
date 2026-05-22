import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockOperations, type Operation, type OperationStatus } from '../data/mock-operations'
import { mockUser } from '../data/mock-user'
import { dateAwareStorage } from '../lib/persist'
import { useAuthStore } from './auth.store'

interface OperationsState {
  /** Operaciones por usuario: cada cuenta tiene su propio historial. */
  byUser: Record<string, Operation[]>
  addOperation: (userId: string, op: Operation) => void
  updateStatus: (userId: string, id: string, status: OperationStatus) => void
}

// Referencia estable para "sin operaciones" (evita renders en bucle).
const EMPTY: Operation[] = []

export const useOperationsStore = create<OperationsState>()(
  persist(
    (set) => ({
      byUser: { [mockUser.id]: [...mockOperations] },

      addOperation: (userId, op) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: [op, ...(state.byUser[userId] ?? EMPTY)],
          },
        })),

      updateStatus: (userId, id, status) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: (state.byUser[userId] ?? EMPTY).map((op) =>
              op.id === id ? { ...op, status } : op,
            ),
          },
        })),
    }),
    { name: 'andean-operations-v2', storage: dateAwareStorage<OperationsState>() },
  ),
)

/** Operaciones del usuario autenticado actual. */
export function useUserOperations(): Operation[] {
  const userId = useAuthStore((s) => s.currentUserId)
  return useOperationsStore((s) => (userId ? s.byUser[userId] ?? EMPTY : EMPTY))
}

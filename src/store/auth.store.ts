import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser, type MockUser, type BankAccount } from '../data/mock-user'
import { dateAwareStorage } from '../lib/persist'

/** Datos que entrega el flujo de registro para crear una cuenta nueva. */
export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dni: string
  isPEP: boolean
  account: Omit<BankAccount, 'id' | 'isPrimary'>
}

interface AuthState {
  /** Registro de todas las cuentas creadas (incluida la mock). */
  users: MockUser[]
  currentUserId: string | null
  /** Espejo del usuario actual, sincronizado con `users`. */
  user: MockUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<MockUser>) => void
  addAccount: (account: Omit<BankAccount, 'id' | 'isPrimary'>) => void
  removeAccount: (id: string) => void
}

/** Aplica un cambio al usuario actual manteniendo `user` y `users` en sync. */
function patchCurrentUser(
  state: AuthState,
  patch: (u: MockUser) => MockUser,
): Partial<AuthState> {
  if (!state.user) return {}
  const updated = patch(state.user)
  return {
    user: updated,
    users: state.users.map((u) => (u.id === updated.id ? updated : u)),
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [mockUser],
      currentUserId: null,
      user: null,
      isAuthenticated: false,

      // Sin backend: el login solo busca el email en el registro local.
      login: async (email) => {
        await new Promise((r) => setTimeout(r, 800))
        const found = get().users.find(
          (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
        )
        if (!found) return false
        set({ currentUserId: found.id, user: found, isAuthenticated: true })
        return true
      },

      // Crea una cuenta nueva con los datos del registro. Nunca falla.
      register: async (data) => {
        await new Promise((r) => setTimeout(r, 1200))
        const id = `usr-${Date.now()}`
        const accounts: BankAccount[] =
          data.account.cci.trim() !== ''
            ? [{ ...data.account, id: `acc-${Date.now()}`, isPrimary: true }]
            : []
        const newUser: MockUser = {
          id,
          name: `${data.firstName} ${data.lastName}`.trim(),
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          dni: data.dni,
          isPEP: data.isPEP,
          kycStatus: 'verified',
          accounts,
          createdAt: new Date(),
        }
        set((state) => ({
          users: [...state.users, newUser],
          currentUserId: id,
          user: newUser,
          isAuthenticated: true,
        }))
      },

      logout: () => set({ currentUserId: null, user: null, isAuthenticated: false }),

      updateUser: (data) =>
        set((state) => patchCurrentUser(state, (u) => ({ ...u, ...data }))),

      // Agrega una cuenta al usuario actual; la primera queda como principal.
      addAccount: (account) =>
        set((state) =>
          patchCurrentUser(state, (u) => {
            const isFirst = u.accounts.length === 0
            const newAccount: BankAccount = {
              ...account,
              id: `acc-${Date.now()}`,
              isPrimary: isFirst,
            }
            return { ...u, accounts: [...u.accounts, newAccount] }
          }),
        ),

      // Elimina una cuenta; si era la principal, promueve a la siguiente.
      removeAccount: (id) =>
        set((state) =>
          patchCurrentUser(state, (u) => {
            const remaining = u.accounts.filter((a) => a.id !== id)
            if (remaining.length > 0 && !remaining.some((a) => a.isPrimary)) {
              remaining[0] = { ...remaining[0], isPrimary: true }
            }
            return { ...u, accounts: remaining }
          }),
        ),
    }),
    { name: 'andean-auth-v2', storage: dateAwareStorage<AuthState>() },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockUser, type MockUser } from '../data/mock-user'

interface AuthState {
  isAuthenticated: boolean
  user: MockUser | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: Partial<MockUser>) => Promise<void>
  logout: () => void
  updateUser: (data: Partial<MockUser>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, _password: string) => {
        await new Promise((r) => setTimeout(r, 1000))
        if (email === mockUser.email || email === 'demo@andean.com') {
          set({ isAuthenticated: true, user: mockUser })
          return true
        }
        return false
      },

      register: async (_data: Partial<MockUser>) => {
        await new Promise((r) => setTimeout(r, 1500))
        set({ isAuthenticated: true, user: { ...mockUser, ..._data } })
      },

      logout: () => set({ isAuthenticated: false, user: null }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    { name: 'andean-auth' }
  )
)

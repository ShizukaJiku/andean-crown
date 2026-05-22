import { create } from 'zustand'

export type ToastVariant = 'success' | 'info' | 'error'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, variant?: ToastVariant) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = 'success') => {
    const id = ++counter
    set((s) => ({ toasts: [...s.toasts, { id, message, variant }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 2600)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

/** Atajo para disparar un toast desde cualquier parte sin hook. */
export const toast = (message: string, variant?: ToastVariant) =>
  useToastStore.getState().show(message, variant)

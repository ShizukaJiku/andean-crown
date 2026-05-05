import { create } from 'zustand'
import { mockOperations, type Operation, type OperationStatus } from '../data/mock-operations'

interface OperationsState {
  operations: Operation[]
  addOperation: (op: Operation) => void
  updateStatus: (id: string, status: OperationStatus) => void
}

export const useOperationsStore = create<OperationsState>((set) => ({
  operations: [...mockOperations],

  addOperation: (op) =>
    set((state) => ({ operations: [op, ...state.operations] })),

  updateStatus: (id, status) =>
    set((state) => ({
      operations: state.operations.map((op) =>
        op.id === id ? { ...op, status } : op
      ),
    })),
}))

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface DevState {
  simulateErrors: boolean
  toggleErrorSimulation: () => void
  simulateNewOrders: boolean
  toggleNewOrderSimulation: () => void
}

export const useDevStore = create<DevState>()(
  devtools(
    (set) => ({
      simulateErrors: false,
      toggleErrorSimulation: () => set((s) => ({ simulateErrors: !s.simulateErrors })),
      simulateNewOrders: false,
      toggleNewOrderSimulation: () => set((s) => ({ simulateNewOrders: !s.simulateNewOrders })),
    }),
    { name: 'cmpnion-dev-store' }
  )
)

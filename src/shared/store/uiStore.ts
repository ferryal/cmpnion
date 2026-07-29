import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

type Theme = 'light' | 'dark'

interface UIState {
  selectedOrderId: string | null
  isDrawerOpen: boolean
  isDevPanelOpen: boolean
  theme: Theme
  openDrawer: (orderId: string) => void
  closeDrawer: () => void
  toggleTheme: () => void
  toggleDevPanel: () => void
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        selectedOrderId: null,
        isDrawerOpen: false,
        isDevPanelOpen: false,
        theme: 'light',
        openDrawer: (orderId) => set({ selectedOrderId: orderId, isDrawerOpen: true }),
        closeDrawer: () => set({ isDrawerOpen: false, selectedOrderId: null }),
        toggleTheme: () => {
          const next = get().theme === 'light' ? 'dark' : 'light'
          applyTheme(next)
          set({ theme: next })
        },
        toggleDevPanel: () => set({ isDevPanelOpen: !get().isDevPanelOpen }),
      }),
      {
        name: 'cmpnion-ui',
        partialize: (state) => ({ theme: state.theme }) as UIState,
        onRehydrateStorage: () => (state) => {
          if (state?.theme) applyTheme(state.theme)
        },
      }
    ),
    { name: 'cmpnion-ui-store' }
  )
)

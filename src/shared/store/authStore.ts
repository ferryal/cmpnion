import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Staff {
  id: string
  name: string
  email: string
  role: 'admin' | 'front-desk' | 'housekeeping' | 'manager'
  avatar?: string
}

interface AuthState {
  isAuthenticated: boolean
  staff: Staff | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const MOCK_CREDENTIALS: Record<string, { password: string; staff: Staff }> = {
  'admin@cmpnion.com': {
    password: 'password',
    staff: { id: 'USR-001', name: 'Admin User', email: 'admin@cmpnion.com', role: 'admin' },
  },
  'front@cmpnion.com': {
    password: 'password',
    staff: { id: 'USR-002', name: 'Staff Member', email: 'front@cmpnion.com', role: 'front-desk' },
  },
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        isAuthenticated: false,
        staff: null,
        login: async (email, password) => {
          // Simulate API delay
          await new Promise((r) => setTimeout(r, 600))
          const match = MOCK_CREDENTIALS[email]
          if (match && match.password === password) {
            set({ isAuthenticated: true, staff: match.staff })
            return true
          }
          return false
        },
        logout: () => set({ isAuthenticated: false, staff: null }),
      }),
      {
        name: 'cmpnion-auth',
        partialize: (state) =>
          ({
            isAuthenticated: state.isAuthenticated,
            staff: state.staff,
          }) as AuthState,
      }
    ),
    { name: 'cmpnion-auth-store' }
  )
)

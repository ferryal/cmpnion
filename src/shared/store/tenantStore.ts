import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface Hotel {
  id: string
  name: string
  brand: string
  location: string
}

const MOCK_HOTELS: Hotel[] = [
  { id: 'HTL-001', name: 'The Grand Palace', brand: 'CMPNION Luxury', location: 'Jakarta' },
  { id: 'HTL-002', name: 'Skyline Boutique', brand: 'CMPNION Select', location: 'Bali' },
  { id: 'HTL-003', name: 'Harbor View Inn', brand: 'CMPNION Express', location: 'Surabaya' },
]

interface TenantState {
  currentHotelId: string
  hotels: Hotel[]
  currentHotel: () => Hotel
  switchHotel: (id: string) => void
}

export const useTenantStore = create<TenantState>()(
  devtools(
    persist(
      (set, get) => ({
        currentHotelId: 'HTL-001',
        hotels: MOCK_HOTELS,
        currentHotel: () =>
          get().hotels.find((h) => h.id === get().currentHotelId) ?? MOCK_HOTELS[0]!,
        switchHotel: (id) => set({ currentHotelId: id }),
      }),
      { name: 'cmpnion-tenant' }
    ),
    { name: 'cmpnion-tenant-store' }
  )
)

import type { OrderFilters } from '@entities/order/model/types'
import { useTenantStore } from '@shared/store/tenantStore'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

export function useOrderFilters(): {
  filters: OrderFilters
  setFilter: <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => void
  clearAll: () => void
  activeCount: number
} {
  const [params, setParams] = useSearchParams()
  const hotelId = useTenantStore((s) => s.currentHotelId)

  const filters: OrderFilters = {
    hotelId,
    q: params.get('q') ?? undefined,
    status: (params.get('status') as OrderFilters['status']) ?? undefined,
    service: (params.get('service') as OrderFilters['service']) ?? undefined,
    paymentStatus: (params.get('paymentStatus') as OrderFilters['paymentStatus']) ?? undefined,
    sort: (params.get('sort') as 'newest' | 'oldest') ?? 'newest',
    page: Number(params.get('page') ?? 1),
    limit: 25,
  }

  const setFilter = useCallback(
    <K extends keyof OrderFilters>(key: K, value: OrderFilters[K]) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev)
        if (value === undefined || value === '' || value === 'All') {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
        // Reset page when filters change (except page itself)
        if (key !== 'page') next.delete('page')
        return next
      })
    },
    [setParams]
  )

  const clearAll = useCallback(() => {
    setParams({})
  }, [setParams])

  const activeCount = [filters.q, filters.status, filters.service, filters.paymentStatus].filter(
    Boolean
  ).length

  return { filters, setFilter, clearAll, activeCount }
}

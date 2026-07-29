import { useTenantStore } from '@shared/store/tenantStore'
import { useQuery } from '@tanstack/react-query'
import { getDashboardMetrics } from '../dashboardApi'
import { dashboardKeys } from './queryKeys'

export function useDashboardMetrics() {
  const hotelId = useTenantStore((s) => s.currentHotelId)
  return useQuery({
    queryKey: dashboardKeys.metrics(hotelId),
    queryFn: () => getDashboardMetrics(hotelId),
    staleTime: 15_000,
  })
}

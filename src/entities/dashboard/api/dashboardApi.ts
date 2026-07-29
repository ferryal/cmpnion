import { apiClient } from '@shared/api/client'
import type { DashboardMetrics } from '../model/types'

export async function getDashboardMetrics(hotelId?: string): Promise<DashboardMetrics> {
  const qs = hotelId ? `?hotelId=${hotelId}` : ''
  return apiClient.get<DashboardMetrics>(`/dashboard/metrics${qs}`)
}

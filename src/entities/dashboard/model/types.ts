import type { ServiceType } from '@entities/order/model/types'

export interface DashboardMetrics {
  activeGuests: number
  pendingOrders: number
  revenueToday: number
  completedOrders: number
  averageOrderValue: number
  slaBreachedCount: number
  failedPaymentsCount: number
  topServices: TopServiceEntry[]
}

export interface TopServiceEntry {
  service: ServiceType
  count: number
}

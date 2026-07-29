import { apiClient } from '@shared/api/client'
import type { Order, OrderFilters, OrderListResponse } from '../model/types'

function buildQuery(filters: OrderFilters): string {
  const params = new URLSearchParams()
  if (filters.hotelId) params.set('hotelId', filters.hotelId)
  if (filters.q) params.set('q', filters.q)
  if (filters.status && filters.status !== 'All') params.set('status', filters.status)
  if (filters.service && filters.service !== 'All') params.set('service', filters.service)
  if (filters.paymentStatus && filters.paymentStatus !== 'All')
    params.set('paymentStatus', filters.paymentStatus)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

export async function getOrders(filters: OrderFilters = {}): Promise<OrderListResponse> {
  return apiClient.get<OrderListResponse>(`/orders${buildQuery(filters)}`)
}

export async function getOrderById(id: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/${id}`)
}

export async function updateOrderStatus(
  id: string,
  body: { status: string; staffNote?: string }
): Promise<Order> {
  return apiClient.patch<Order>(`/orders/${id}/status`, body)
}

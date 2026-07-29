import type { DashboardMetrics } from '@entities/dashboard/model/types'
import type { ServiceType } from '@entities/order/model/types'
import { isToday } from '@shared/lib/date'
import { http, HttpResponse, delay } from 'msw'
import { mockOrders } from '../fixtures/orders'

const BASE = '/api'

function computeMetrics(hotelId?: string): DashboardMetrics {
  const hotelOrders = hotelId ? mockOrders.filter((o) => o.hotelId === hotelId) : mockOrders
  const todayOrders = hotelOrders.filter((o) => isToday(o.orderTime))
  const paidToday = todayOrders.filter((o) => o.paymentStatus === 'Paid' && o.amount > 0)

  // Unique guests with active orders
  const activeGuests = new Set(
    hotelOrders
      .filter((o) => o.status !== 'Completed' && o.status !== 'Cancelled')
      .map((o) => o.guestName)
  ).size

  const pendingOrders = hotelOrders.filter(
    (o) => o.status === 'New' || o.status === 'Acknowledged' || o.status === 'In Progress'
  ).length

  const revenueToday = paidToday.reduce((sum, o) => sum + o.amount, 0)

  const completedOrders = todayOrders.filter((o) => o.status === 'Completed').length

  const averageOrderValue =
    paidToday.length > 0
      ? Math.round(paidToday.reduce((sum, o) => sum + o.amount, 0) / paidToday.length)
      : 0

  const slaBreachedCount = hotelOrders.filter(
    (o) =>
      o.status === 'New' && new Date().getTime() - new Date(o.orderTime).getTime() > 15 * 60_000
  ).length

  const failedPaymentsCount = hotelOrders.filter((o) => o.paymentStatus === 'Failed').length

  const serviceCounts: Partial<Record<ServiceType, number>> = {}
  for (const order of hotelOrders) {
    serviceCounts[order.service] = (serviceCounts[order.service] ?? 0) + 1
  }

  const topServices = (Object.entries(serviceCounts) as [ServiceType, number][])
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    activeGuests,
    pendingOrders,
    revenueToday,
    completedOrders,
    averageOrderValue,
    slaBreachedCount,
    failedPaymentsCount,
    topServices,
  }
}

import { useDevStore } from '@shared/store/devStore'

export const dashboardHandlers = [
  http.get(`${BASE}/dashboard/metrics`, async ({ request }) => {
    await delay(300)

    // Error simulation
    if (useDevStore.getState().simulateErrors && Math.random() < 0.1) {
      return new HttpResponse(JSON.stringify({ error: 'Internal Server Error (Simulated)' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(request.url)
    const hotelId = url.searchParams.get('hotelId') ?? undefined
    return HttpResponse.json(computeMetrics(hotelId))
  }),
]

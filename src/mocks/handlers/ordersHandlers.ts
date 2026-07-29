import type { Order, OrderFilters } from '@entities/order/model/types'
import { http, HttpResponse, delay } from 'msw'
import {
  addMockOrder,
  generateOrderId,
  getMockOrderById,
  mockOrders,
  updateMockOrder,
} from '../fixtures/orders'

import { useDevStore } from '@shared/store/devStore'

const BASE = '/api'
const DELAY_RANGE = [300, 800] as const

function randomDelay() {
  const ms = Math.floor(Math.random() * (DELAY_RANGE[1] - DELAY_RANGE[0]) + DELAY_RANGE[0])
  return delay(ms)
}

function applyFilters(orders: Order[], filters: OrderFilters): Order[] {
  let result = [...orders]

  if (filters.hotelId) {
    result = result.filter((o) => o.hotelId === filters.hotelId)
  }

  if (filters.q) {
    const q = filters.q.toLowerCase()
    result = result.filter(
      (o) =>
        o.guestName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.roomNumber.toLowerCase().includes(q)
    )
  }

  if (filters.status && filters.status !== 'All') {
    result = result.filter((o) => o.status === filters.status)
  }

  if (filters.service && filters.service !== 'All') {
    result = result.filter((o) => o.service === filters.service)
  }

  if (filters.paymentStatus && filters.paymentStatus !== 'All') {
    result = result.filter((o) => o.paymentStatus === filters.paymentStatus)
  }

  // Sort
  const sort = filters.sort ?? 'newest'
  result.sort((a, b) => {
    const diff = new Date(a.orderTime).getTime() - new Date(b.orderTime).getTime()
    return sort === 'newest' ? -diff : diff
  })

  return result
}

export const ordersHandlers = [
  // GET /api/orders
  http.get(`${BASE}/orders`, async ({ request }) => {
    await randomDelay()

    // Error simulation
    if (useDevStore.getState().simulateErrors && Math.random() < 0.1) {
      return new HttpResponse(JSON.stringify({ error: 'Internal Server Error (Simulated)' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const url = new URL(request.url)

    const filters: OrderFilters = {
      hotelId: url.searchParams.get('hotelId') ?? undefined,
      q: url.searchParams.get('q') ?? undefined,
      status: (url.searchParams.get('status') as never) ?? undefined,
      service: (url.searchParams.get('service') as never) ?? undefined,
      paymentStatus: (url.searchParams.get('paymentStatus') as never) ?? undefined,
      sort: (url.searchParams.get('sort') as 'newest' | 'oldest') ?? 'newest',
      page: Number(url.searchParams.get('page') ?? 1),
      limit: Number(url.searchParams.get('limit') ?? 25),
    }

    const filtered = applyFilters(mockOrders, filters)
    const page = filters.page ?? 1
    const limit = filters.limit ?? 25
    const start = (page - 1) * limit
    const paginated = filtered.slice(start, start + limit)

    return HttpResponse.json({
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        hasMore: start + limit < filtered.length,
      },
    })
  }),

  // GET /api/orders/:id
  http.get(`${BASE}/orders/:id`, async ({ params }) => {
    await randomDelay()
    const order = getMockOrderById(params.id as string)
    if (!order) {
      return HttpResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    return HttpResponse.json(order)
  }),

  // PATCH /api/orders/:id/status
  http.patch(`${BASE}/orders/:id/status`, async ({ params, request }) => {
    await randomDelay()
    const body = (await request.json()) as { status: string; staffNote?: string }
    const id = params.id as string

    const updates: Partial<Order> = { status: body.status as never }
    if (body.staffNote) updates.staffNote = body.staffNote
    if (body.status === 'Completed') updates.completedAt = new Date().toISOString()
    if (body.status === 'Cancelled') updates.cancelledAt = new Date().toISOString()

    const updated = updateMockOrder(id, updates)
    if (!updated) {
      return HttpResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return HttpResponse.json(updated)
  }),

  // POST /api/orders (for new order simulation)
  http.post(`${BASE}/orders`, async ({ request }) => {
    await delay(200)
    const body = (await request.json()) as Partial<Order>
    const newOrder: Order = {
      id: generateOrderId(),
      hotelId: body.hotelId ?? 'HTL-001',
      guestName: body.guestName ?? 'New Guest',
      roomNumber: body.roomNumber ?? '100',
      service: body.service ?? 'Room Service',
      quantity: body.quantity ?? 1,
      amount: body.amount ?? 20,
      specialRequest: body.specialRequest ?? '',
      orderTime: body.orderTime ?? new Date().toISOString(),
      status: 'New',
      paymentStatus: body.paymentStatus ?? 'Pending',
    }
    addMockOrder(newOrder)
    return HttpResponse.json(newOrder, { status: 201 })
  }),
]

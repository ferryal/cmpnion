import type { Order } from '@entities/order/model/types'

// Current time minus various minutes for realistic data
const now = new Date()
const minsAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString()

// Hotel IDs mapping (for multi-tenancy demo)
const H1 = 'HTL-001'
const H2 = 'HTL-002'
const H3 = 'HTL-003'

export let mockOrders: Order[] = [
  // ── Assignment spec orders ──────────────────────────────
  {
    id: 'ORD-1001',
    hotelId: H1,
    guestName: 'John Smith',
    roomNumber: '204',
    service: 'Room Service',
    quantity: 2,
    amount: 45,
    specialRequest: 'Please deliver to the room before 8 PM.',
    orderTime: minsAgo(20), // SLA BREACH (>15 min, status=New)
    status: 'New',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-1002',
    hotelId: H1,
    guestName: 'Sarah Johnson',
    roomNumber: '312',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Please clean the room after 2 PM.',
    orderTime: minsAgo(95),
    status: 'In Progress',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-1003',
    hotelId: H1,
    guestName: 'Michael Tan',
    roomNumber: '105',
    service: 'Laundry',
    quantity: 3,
    amount: 25,
    specialRequest: 'Express service requested.',
    orderTime: minsAgo(210),
    status: 'Completed',
    paymentStatus: 'Paid',
    completedAt: minsAgo(120),
  },
  {
    id: 'ORD-1004',
    hotelId: H1,
    guestName: 'Emma Wilson',
    roomNumber: '408',
    service: 'Extra Bed',
    quantity: 1,
    amount: 30,
    specialRequest: '',
    orderTime: minsAgo(35),
    status: 'Acknowledged',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-1005',
    hotelId: H1,
    guestName: 'David Lee',
    roomNumber: '201',
    service: 'Spa & Massage',
    quantity: 1,
    amount: 75,
    specialRequest: 'Preferred time: 7 PM.',
    orderTime: minsAgo(180),
    status: 'Cancelled',
    paymentStatus: 'Failed',
    cancelledAt: minsAgo(90),
  },
  // ── Extended mock data (H1) ─────────────────────────────
  {
    id: 'ORD-1006',
    hotelId: H1,
    guestName: 'Priya Patel',
    roomNumber: '516',
    service: 'Room Service',
    quantity: 1,
    amount: 22,
    specialRequest: 'No onions please.',
    orderTime: minsAgo(18), // SLA BREACH
    status: 'New',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-1007',
    hotelId: H1,
    guestName: 'Carlos Rivera',
    roomNumber: '307',
    service: 'Laundry',
    quantity: 4,
    amount: 40,
    specialRequest: 'Dry clean only.',
    orderTime: minsAgo(130),
    status: 'Completed',
    paymentStatus: 'Paid',
    completedAt: minsAgo(60),
  },
  {
    id: 'ORD-1008',
    hotelId: H1,
    guestName: 'Yuki Tanaka',
    roomNumber: '204',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: '',
    orderTime: minsAgo(10),
    status: 'New',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-1009',
    hotelId: H1,
    guestName: 'Amira Hassan',
    roomNumber: '620',
    service: 'Spa & Massage',
    quantity: 2,
    amount: 150,
    specialRequest: 'Swedish massage, please.',
    orderTime: minsAgo(55),
    status: 'Acknowledged',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-1010',
    hotelId: H1,
    guestName: 'Thomas Müller',
    roomNumber: '102',
    service: 'Extra Bed',
    quantity: 1,
    amount: 30,
    specialRequest: 'King size if available.',
    orderTime: minsAgo(5),
    status: 'Pending Approval',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-1011',
    hotelId: H1,
    guestName: 'Sophie Laurent',
    roomNumber: '412',
    service: 'Room Service',
    quantity: 3,
    amount: 67,
    specialRequest: 'Vegetarian options only.',
    orderTime: minsAgo(75),
    status: 'In Progress',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-1012',
    hotelId: H1,
    guestName: 'James Okafor',
    roomNumber: '223',
    service: 'Laundry',
    quantity: 2,
    amount: 18,
    specialRequest: '',
    orderTime: minsAgo(300),
    status: 'Completed',
    paymentStatus: 'Paid',
    completedAt: minsAgo(200),
  },
  {
    id: 'ORD-1013',
    hotelId: H1,
    guestName: 'Mei Chen',
    roomNumber: '511',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Extra towels needed.',
    orderTime: minsAgo(45),
    status: 'Acknowledged',
    paymentStatus: 'Pending',
  },
  // ── Hotel 2 orders (Skyline Boutique) ───────────────────
  {
    id: 'ORD-2001',
    hotelId: H2,
    guestName: 'Rafael Santos',
    roomNumber: '309',
    service: 'Spa & Massage',
    quantity: 1,
    amount: 85,
    specialRequest: 'Hot stone therapy preferred.',
    orderTime: minsAgo(25), // SLA BREACH
    status: 'New',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-2002',
    hotelId: H2,
    guestName: 'Olivia Thompson',
    roomNumber: '715',
    service: 'Room Service',
    quantity: 1,
    amount: 33,
    specialRequest: 'Gluten-free bread please.',
    orderTime: minsAgo(160),
    status: 'Cancelled',
    paymentStatus: 'Failed',
    cancelledAt: minsAgo(100),
  },
  {
    id: 'ORD-2003',
    hotelId: H2,
    guestName: 'Kwame Asante',
    roomNumber: '118',
    service: 'Extra Bed',
    quantity: 2,
    amount: 60,
    specialRequest: 'For two children.',
    orderTime: minsAgo(8),
    status: 'Pending Approval',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-2004',
    hotelId: H2,
    guestName: 'Nadia Volkov',
    roomNumber: '602',
    service: 'Laundry',
    quantity: 5,
    amount: 55,
    specialRequest: 'Handle with care, silk items.',
    orderTime: minsAgo(420),
    status: 'Completed',
    paymentStatus: 'Paid',
    completedAt: minsAgo(300),
  },
  // ── Hotel 3 orders (Harbor View Inn) ────────────────────
  {
    id: 'ORD-3001',
    hotelId: H3,
    guestName: 'Lucas Fernandez',
    roomNumber: '333',
    service: 'Housekeeping',
    quantity: 1,
    amount: 0,
    specialRequest: 'Do not disturb before 11 AM.',
    orderTime: minsAgo(50),
    status: 'In Progress',
    paymentStatus: 'Pending',
  },
  {
    id: 'ORD-3002',
    hotelId: H3,
    guestName: 'Aisha Kamara',
    roomNumber: '204',
    service: 'Spa & Massage',
    quantity: 1,
    amount: 95,
    specialRequest: 'Aromatherapy session.',
    orderTime: minsAgo(22), // SLA BREACH
    status: 'New',
    paymentStatus: 'Paid',
  },
  {
    id: 'ORD-3003',
    hotelId: H3,
    guestName: 'Henrik Larsen',
    roomNumber: '801',
    service: 'Room Service',
    quantity: 4,
    amount: 120,
    specialRequest: 'Birthday cake included please.',
    orderTime: minsAgo(240),
    status: 'Completed',
    paymentStatus: 'Paid',
    completedAt: minsAgo(180),
  },
]

export function getMockOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export function updateMockOrder(id: string, updates: Partial<Order>): Order | null {
  const idx = mockOrders.findIndex((o) => o.id === id)
  if (idx === -1) return null
  const updated = { ...mockOrders[idx]!, ...updates, updatedAt: new Date().toISOString() }
  mockOrders[idx] = updated
  return updated
}

export function addMockOrder(order: Order): void {
  mockOrders = [order, ...mockOrders]
}

let orderCounter = 1021

export function generateOrderId(): string {
  return `ORD-${orderCounter++}`
}

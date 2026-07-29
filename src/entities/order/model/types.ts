export type ServiceType =
  | 'Room Service'
  | 'Housekeeping'
  | 'Laundry'
  | 'Extra Bed'
  | 'Spa & Massage'

export type OrderStatus =
  | 'New'
  | 'Acknowledged'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Pending Approval'

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed'

export interface Order {
  id: string
  hotelId: string
  guestName: string
  roomNumber: string
  service: ServiceType
  quantity: number
  amount: number
  specialRequest: string
  orderTime: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  updatedAt?: string
  staffNote?: string
  cancelledAt?: string
  completedAt?: string
}

export interface OrderListResponse {
  data: Order[]
  meta: {
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
}

export interface OrderFilters {
  hotelId?: string
  q?: string
  status?: OrderStatus | 'All'
  service?: ServiceType | 'All'
  paymentStatus?: PaymentStatus | 'All'
  sort?: 'newest' | 'oldest'
  page?: number
  limit?: number
}

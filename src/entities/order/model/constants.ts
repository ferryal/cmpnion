import type { OrderStatus, PaymentStatus, ServiceType } from './types'

// Status display labels
export const STATUS_LABELS: Record<OrderStatus, string> = {
  New: 'New',
  Acknowledged: 'Acknowledged',
  'In Progress': 'In Progress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  'Pending Approval': 'Pending Approval',
}

// Tailwind classes for status badges — works in light & dark
export const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string; dot: string }> = {
  New: {
    bg: 'bg-blue-50 dark:bg-blue-950/60',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  Acknowledged: {
    bg: 'bg-violet-50 dark:bg-violet-950/60',
    text: 'text-violet-700 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  'In Progress': {
    bg: 'bg-amber-50 dark:bg-amber-950/60',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  Completed: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  Cancelled: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-600 dark:text-gray-400',
    dot: 'bg-gray-400',
  },
  'Pending Approval': {
    bg: 'bg-orange-50 dark:bg-orange-950/60',
    text: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
}

// Payment status colors
export const PAYMENT_COLORS: Record<PaymentStatus, { bg: string; text: string }> = {
  Paid: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/60',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  Pending: { bg: 'bg-amber-50 dark:bg-amber-950/60', text: 'text-amber-700 dark:text-amber-400' },
  Failed: { bg: 'bg-red-50 dark:bg-red-950/60', text: 'text-red-700 dark:text-red-400' },
}

// Service type labels
export const SERVICE_LABELS: Record<ServiceType, string> = {
  'Room Service': 'Room Service',
  Housekeeping: 'Housekeeping',
  Laundry: 'Laundry',
  'Extra Bed': 'Extra Bed',
  'Spa & Massage': 'Spa & Massage',
}

export const ALL_SERVICE_TYPES: ServiceType[] = [
  'Room Service',
  'Housekeeping',
  'Laundry',
  'Extra Bed',
  'Spa & Massage',
]

export const ALL_ORDER_STATUSES: OrderStatus[] = [
  'New',
  'Acknowledged',
  'In Progress',
  'Completed',
  'Cancelled',
  'Pending Approval',
]

export const ALL_PAYMENT_STATUSES: PaymentStatus[] = ['Paid', 'Pending', 'Failed']

export const SLA_THRESHOLD_MINUTES = 15

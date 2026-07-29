import type { OrderStatus } from './types'

export interface Transition {
  toStatus: OrderStatus
  label: string
  variant: 'default' | 'destructive' | 'outline'
  requiresConfirm?: boolean
}

export const ORDER_TRANSITIONS: Record<OrderStatus, Transition[]> = {
  New: [
    { toStatus: 'Acknowledged', label: 'Acknowledge', variant: 'default' },
    { toStatus: 'Cancelled', label: 'Cancel Order', variant: 'destructive', requiresConfirm: true },
  ],
  Acknowledged: [
    { toStatus: 'In Progress', label: 'Start Processing', variant: 'default' },
    { toStatus: 'Cancelled', label: 'Cancel Order', variant: 'destructive', requiresConfirm: true },
  ],
  'In Progress': [
    { toStatus: 'Completed', label: 'Mark Completed', variant: 'default' },
    { toStatus: 'Cancelled', label: 'Cancel Order', variant: 'destructive', requiresConfirm: true },
  ],
  Completed: [],
  Cancelled: [],
  'Pending Approval': [
    { toStatus: 'New', label: 'Approve', variant: 'default' },
    { toStatus: 'Cancelled', label: 'Reject', variant: 'destructive', requiresConfirm: true },
  ],
}

export function getAvailableTransitions(status: OrderStatus): Transition[] {
  return ORDER_TRANSITIONS[status] ?? []
}

export function isTerminalStatus(status: OrderStatus): boolean {
  return status === 'Completed' || status === 'Cancelled'
}

// Timeline steps (for the visual progress indicator)
export const TIMELINE_STEPS: OrderStatus[] = ['New', 'Acknowledged', 'In Progress', 'Completed']

export function getTimelineStepIndex(status: OrderStatus): number {
  if (status === 'Cancelled') return -1
  if (status === 'Pending Approval') return 0
  return TIMELINE_STEPS.indexOf(status)
}

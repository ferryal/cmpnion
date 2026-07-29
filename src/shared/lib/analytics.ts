type EventName =
  | 'order_acknowledged'
  | 'order_started'
  | 'order_completed'
  | 'order_cancelled'
  | 'order_approved'
  | 'order_rejected'
  | 'filter_applied'
  | 'search_performed'
  | 'hotel_switched'
  | 'drawer_opened'
  | 'theme_toggled'

interface EventPayload {
  orderId?: string
  status?: string
  query?: string
  hotelId?: string
  [key: string]: unknown
}

const isDev = import.meta.env.DEV

export function track(event: EventName, payload: EventPayload = {}): void {
  const data = { event, timestamp: new Date().toISOString(), ...payload }

  if (isDev) {
    console.log('[analytics]', data)
    return
  }

  // PROD: send to analytics endpoint
  // navigator.sendBeacon('/api/analytics/track', JSON.stringify(data))
}

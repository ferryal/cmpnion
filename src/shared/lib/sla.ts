const SLA_THRESHOLD_MS = 15 * 60 * 1000 // 15 minutes

export function isSlaBreached(orderTime: string, status: string): boolean {
  if (status !== 'New') return false
  const elapsed = Date.now() - new Date(orderTime).getTime()
  return elapsed > SLA_THRESHOLD_MS
}

export function getSlaRemainingMs(orderTime: string): number {
  const elapsed = Date.now() - new Date(orderTime).getTime()
  return Math.max(0, SLA_THRESHOLD_MS - elapsed)
}

export function getSlaElapsedMs(orderTime: string): number {
  return Date.now() - new Date(orderTime).getTime()
}

export function formatSlaLabel(orderTime: string, status: string): string | null {
  if (status !== 'New') return null
  const remaining = getSlaRemainingMs(orderTime)
  if (remaining === 0) return 'SLA Breached'
  const minutes = Math.floor(remaining / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1000)
  return `SLA: ${minutes}m ${seconds}s remaining`
}

export function formatSlaElapsed(orderTime: string): string {
  const elapsed = getSlaElapsedMs(orderTime)
  const minutes = Math.floor(elapsed / 60_000)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ${minutes % 60}m ago`
}

import { formatSlaLabel, isSlaBreached } from '@shared/lib/sla'
import { cn } from '@shared/lib/utils'
import { AlertTriangle, Clock } from 'lucide-react'

interface SlaBreachBadgeProps {
  orderTime: string
  status: string
  compact?: boolean
}

export function SlaBreachBadge({ orderTime, status, compact = false }: SlaBreachBadgeProps) {
  const breached = isSlaBreached(orderTime, status)
  const label = formatSlaLabel(orderTime, status)

  if (!label) return null

  if (compact) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium',
          breached
            ? 'animate-pulse bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
        )}
        title={label}
        aria-label={label}
      >
        {breached ? <AlertTriangle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
        {breached ? 'SLA' : label.split(':')[1]?.trim().split(' ').slice(0, 2).join(' ')}
      </span>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium',
        breached
          ? 'animate-pulse bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400'
          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
      )}
      aria-label={label}
    >
      {breached ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
      {label}
    </div>
  )
}

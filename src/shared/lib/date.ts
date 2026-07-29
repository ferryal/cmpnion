import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatRelative(isoString: string): string {
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  } catch {
    return 'Unknown time'
  }
}

export function formatAbsolute(isoString: string): string {
  try {
    return format(parseISO(isoString), 'MMM d, yyyy • h:mm a')
  } catch {
    return isoString
  }
}

export function formatDateTime(isoString: string): string {
  try {
    return format(parseISO(isoString), 'yyyy-MM-dd HH:mm:ss')
  } catch {
    return isoString
  }
}

export function isToday(isoString: string): boolean {
  try {
    const date = parseISO(isoString)
    const now = new Date()
    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    )
  } catch {
    return false
  }
}

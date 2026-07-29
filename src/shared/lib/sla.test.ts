import { describe, expect, it } from 'bun:test'
import { formatSlaLabel, isSlaBreached } from '@shared/lib/sla'

describe('SLA Logic Tests', () => {
  it('identifies breached orders properly', () => {
    // 20 minutes ago in New status -> breached
    const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString()
    expect(isSlaBreached(twentyMinsAgo, 'New')).toBe(true)

    // 5 minutes ago in New status -> not breached
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    expect(isSlaBreached(fiveMinsAgo, 'New')).toBe(false)

    // 20 minutes ago in Acknowledged status -> not breached (only New breaches)
    expect(isSlaBreached(twentyMinsAgo, 'Acknowledged')).toBe(false)
  })

  it('formats remaining SLA label', () => {
    const twentyMinsAgo = new Date(Date.now() - 20 * 60 * 1000).toISOString()
    expect(formatSlaLabel(twentyMinsAgo, 'New')).toBe('SLA Breached')

    const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    expect(formatSlaLabel(tenMinsAgo, 'New')).toContain('SLA:')
  })
})

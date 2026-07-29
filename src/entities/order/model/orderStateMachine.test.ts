import { describe, expect, it } from 'bun:test'
import {
  getAvailableTransitions,
  getTimelineStepIndex,
  isTerminalStatus,
} from './orderStateMachine'

describe('Order State Machine', () => {
  it('defines correct transitions for New status', () => {
    const transitions = getAvailableTransitions('New')
    expect(transitions.map((t) => t.toStatus)).toEqual(['Acknowledged', 'Cancelled'])
    expect(transitions.find((t) => t.toStatus === 'Cancelled')?.requiresConfirm).toBe(true)
  })

  it('defines empty transitions for terminal statuses', () => {
    expect(getAvailableTransitions('Completed')).toEqual([])
    expect(getAvailableTransitions('Cancelled')).toEqual([])
  })

  it('correctly identifies terminal statuses', () => {
    expect(isTerminalStatus('Completed')).toBe(true)
    expect(isTerminalStatus('Cancelled')).toBe(true)
    expect(isTerminalStatus('New')).toBe(false)
    expect(isTerminalStatus('In Progress')).toBe(false)
  })

  it('returns correct timeline index', () => {
    expect(getTimelineStepIndex('New')).toBe(0)
    expect(getTimelineStepIndex('In Progress')).toBe(2)
    expect(getTimelineStepIndex('Completed')).toBe(3)
    expect(getTimelineStepIndex('Cancelled')).toBe(-1)
  })
})

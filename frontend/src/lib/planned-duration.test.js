import { describe, expect, it } from 'vitest'
import { plannedDurationMin } from './planned-duration.js'

describe('planned workout duration', () => {
  it('stores an optional whole-minute target', () => {
    expect(plannedDurationMin('')).toBeNull()
    expect(plannedDurationMin('45')).toBe(45)
    expect(plannedDurationMin('0')).toBeNull()
    expect(plannedDurationMin('12.5')).toBeNull()
    expect(plannedDurationMin('301')).toBeNull()
    expect(plannedDurationMin('300')).toBe(300)
  })
})

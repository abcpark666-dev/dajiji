import { describe, expect, it } from 'vitest'
import { periodPlan, periodRange } from './period-plan.js'

const routine = (id, name) => ({ id, name, ex: [{ id: '0025', sets: 3, reps: 5, weight: 80 }] })

describe('calendar period plans', () => {
  it('uses the profile week start across a year boundary', () => {
    expect(periodRange('week', '2027-01-01', 1)).toEqual({ from: '2026-12-28', to: '2027-01-03' })
    expect(periodRange('week', '2027-01-01', 0)).toEqual({ from: '2026-12-27', to: '2027-01-02' })
  })

  it('uses the actual first and last day of a calendar month', () => {
    expect(periodRange('month', '2028-02-14', 1)).toEqual({ from: '2028-02-01', to: '2028-02-29' })
  })

  it('includes two recurring routines on one day and a single-date override', () => {
    const S = {
      weekStart: 1,
      week: { 1: ['push', 'core'], 3: ['pull'] },
      dayPlan: { '2026-11-11': 'push' },
      routines: [routine('push', 'Push'), routine('core', 'Core'), routine('pull', 'Pull')],
      workouts: [],
    }
    const plan = periodPlan(S, 'week', '2026-11-11', '2026-11-11')
    expect(plan.days.find(d => d.iso === '2026-11-09').routineIds).toEqual(['push', 'core'])
    expect(plan.days.find(d => d.iso === '2026-11-11').routineIds).toEqual(['push'])
    expect(plan.days.find(d => d.iso === '2026-11-12').routineIds).toEqual([])
  })

  it('marks a date-specific rest without changing the weekly pattern', () => {
    const S = {
      week: { 1: ['push'] }, dayPlan: { '2026-11-16': 'rest' },
      routines: [routine('push', 'Push')], workouts: [],
    }
    expect(periodPlan(S, 'week', '2026-11-16', '2026-11-11').days[0].routineIds).toEqual([])
    expect(periodPlan(S, 'week', '2026-11-23', '2026-11-11').days[0].routineIds).toEqual(['push'])
  })

  it('refuses to reconstruct a previous week or month from the current mutable template', () => {
    const S = { week: { 1: ['push'] }, dayPlan: {}, routines: [routine('push', 'Push')], workouts: [] }
    expect(() => periodPlan(S, 'week', '2026-11-01', '2026-11-11')).toThrow(RangeError)
    expect(() => periodPlan(S, 'month', '2026-10-31', '2026-11-11')).toThrow(RangeError)
    expect(periodPlan(S, 'week', '2026-11-11', '2026-11-11').current).toBe(true)
    expect(periodPlan(S, 'month', '2026-12-01', '2026-11-11').current).toBe(false)
  })
})

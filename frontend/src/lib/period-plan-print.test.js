import { describe, expect, it, vi } from 'vitest'
import { periodPlanPrintHTML, printPeriodPlan } from './plan-share.js'
import { printDocument } from './print-doc.js'

vi.mock('./print-doc.js', async original => ({ ...await original(), printDocument: vi.fn(() => Promise.resolve()) }))

const S = {
  unit: 'kg', weekStart: 1,
  week: { 1: ['push'], 3: ['pull'] },
  dayPlan: { '2026-11-11': 'rest' },
  routines: [
    { id: 'push', name: 'Push', targetDurationMin: 45, ex: [{ id: '0025', sets: 3, mode: 'reps', reps: 5, weight: 80, restSec: 90 }] },
    { id: 'pull', name: 'Pull', ex: [{ id: '0027', sets: 3, mode: 'reps', reps: 8, weight: 60 }] },
  ],
  workouts: [],
}

describe('dated training plan PDF', () => {
  it('prints exact dates, a one-day rest override, and exercise prescription', () => {
    const html = periodPlanPrintHTML(S, 'Ana', { period: 'week', anchor: '2026-11-11', today: '2026-11-11' })
    expect(html).toContain('2026-11-09')
    expect(html).toContain('2026-11-15')
    expect(html).toContain('Push')
    expect(html).toContain('80 kg')
    expect(html).toContain('Rest 1:30')
    expect(html).toContain('45 min')
    expect(html).not.toContain('Pull</h2>')
    expect(html).toContain('Past dates may differ from the schedule at that time.')
  })

  it('prints the full calendar month rather than the repeatable weekday template', () => {
    const html = periodPlanPrintHTML(S, '', { period: 'month', anchor: '2026-11-11', today: '2026-11-11' })
    expect(html).toContain('2026-11-01')
    expect(html).toContain('2026-11-30')
    expect(html).toContain('Monthly Training Plan')
  })

  it('hands the dated HTML to the native or browser print flow', async () => {
    await printPeriodPlan(S, '', { period: 'week', anchor: '2026-11-11', today: '2026-11-11' })
    expect(printDocument).toHaveBeenCalledWith(expect.stringContaining('2026-11-09'), 'Weekly Training Plan 2026-11-09')
  })

  it('prints each programme week target without freezing a future kg prescription', () => {
    const block = {
      ...S, dayPlan: {},
      programmes: { p: { id: 'p', name: 'Strength block', weeks: [
        { t: { '0025': { pct: 75, rpe: 8 } } },
        { t: { '0025': { pct: 80, rpe: 8.5 } } },
      ], days: { 1: ['push'] } } },
      programme: { id: 'p', startedOn: '2026-11-09', saved: { week: {} } },
    }
    const first = periodPlanPrintHTML(block, '', { period: 'week', anchor: '2026-11-11', today: '2026-11-11' })
    const second = periodPlanPrintHTML(block, '', { period: 'week', anchor: '2026-11-18', today: '2026-11-11' })
    expect(first).toContain('75% 1RM')
    expect(first).toContain('RPE 8')
    expect(second).toContain('80% 1RM')
    expect(first).not.toContain('80 kg')
    expect(first).toContain('Actual weight is calculated when you start the workout.')
  })

  it('refuses a historical PDF and leaves the current-plan caveat off a future one', () => {
    expect(() => periodPlanPrintHTML(S, '', { period: 'month', anchor: '2026-10-10', today: '2026-11-11' })).toThrow(RangeError)
    const future = periodPlanPrintHTML(S, '', { period: 'month', anchor: '2026-12-10', today: '2026-11-11' })
    expect(future).not.toContain('Past dates may differ from the schedule at that time.')
  })
})

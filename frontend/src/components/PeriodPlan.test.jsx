// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PeriodPlan from './PeriodPlan.jsx'
import { dayOverrideSheet } from '../sheets.jsx'
import { printPeriodPlan } from '../lib/plan-share.js'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../sheets.jsx', () => ({ dayOverrideSheet: vi.fn() }))
vi.mock('../lib/plan-share.js', () => ({ printPeriodPlan: vi.fn(() => Promise.resolve()) }))

const S = {
  unit: 'kg', weekStart: 1, scheduleMode: 'week',
  week: { 1: ['push', 'core'], 3: ['pull'] },
  dayPlan: { '2026-11-11': 'rest' },
  routines: [
    { id: 'push', name: 'Push', targetDurationMin: 45, ex: [{ id: '0025' }] },
    { id: 'core', name: 'Core', ex: [{ id: '0001' }] },
    { id: 'pull', name: 'Pull', ex: [{ id: '0027' }] },
  ],
  workouts: [],
}

let host, root
beforeEach(() => {
  vi.clearAllMocks()
  host = document.createElement('div')
  document.body.append(host)
  root = createRoot(host)
})
afterEach(() => {
  act(() => root.unmount())
  host.remove()
})

const report = vi.fn()
const mount = (initialDate = '2026-11-11') => act(() => root.render(<PeriodPlan S={S} owner="Ana" initialDate={initialDate} today="2026-11-11" onReport={report} />))
const month = () => [...host.querySelectorAll('.plan-period .seg button')].find(b => b.textContent === 'Month')

describe('dated plan editor', () => {
  it('shows the natural week, combined Monday routines and Wednesday rest override', () => {
    mount()
    expect(host.querySelector('[data-plan-day="2026-11-09"]')).not.toBeNull()
    expect(host.querySelector('[data-plan-day="2026-11-15"]')).not.toBeNull()
    expect(host.querySelector('[data-plan-day="2026-11-09"]').textContent).toContain('Push + Core')
    expect(host.querySelector('[data-plan-day="2026-11-09"]').textContent).toContain('45 min')
    expect(host.querySelector('[data-plan-day="2026-11-11"]').textContent).toContain('Rest day')
  })

  it('switches to the full calendar month and opens a date for editing', () => {
    mount()
    act(() => month().click())
    expect(host.querySelector('[data-plan-day="2026-11-01"]')).not.toBeNull()
    expect(host.querySelector('[data-plan-day="2026-11-30"]')).not.toBeNull()
    act(() => host.querySelector('[data-plan-day="2026-11-17"]').click())
    expect(dayOverrideSheet).toHaveBeenCalledWith('2026-11-17')
  })

  it('exports the displayed period and anchor as a dated PDF', () => {
    mount()
    act(() => month().click())
    act(() => host.querySelector('[data-plan-export]').click())
    expect(printPeriodPlan).toHaveBeenCalledWith(S, 'Ana', { period: 'month', anchor: '2026-11-11', today: '2026-11-11' })
  })

  it('stops at the current period and directs historical training to Stats', () => {
    mount()
    const previous = () => host.querySelector('button[aria-label="Previous period"]')
    expect(previous().disabled).toBe(true)
    expect(host.textContent).toContain('Past dates may differ from the schedule at that time.')
    act(() => host.querySelector('button[aria-label="Next period"]').click())
    expect(previous().disabled).toBe(false)
    act(() => previous().click())
    expect(previous().disabled).toBe(true)
    act(() => host.querySelector('[data-plan-report]').click())
    expect(report).toHaveBeenCalledOnce()
  })

  it('clamps a saved past date to the current calendar period', () => {
    mount('2026-10-01')
    expect(host.querySelector('[data-plan-day="2026-11-09"]')).not.toBeNull()
    act(() => month().click())
    expect(host.querySelector('button[aria-label="Previous period"]').disabled).toBe(true)
  })
})

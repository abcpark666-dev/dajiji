// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/api.js', () => ({ api: vi.fn(() => Promise.resolve({ ok: true })) }))
vi.mock('../lib/sound.js', () => ({ beep: vi.fn(), chime: vi.fn(), vibrate: vi.fn(), alertBuzz: vi.fn() }))

import { useUI, restoreRest, REST_KEY } from './useUI.js'
import { useStore } from './useStore.js'
import { buildCompletedWorkout } from '../lib/finish-workout.js'

const active = () => ({
  id: 'session-1', d: '2026-11-11', start: Date.now(), name: 'Push', routineIds: [],
  entries: [{ id: '0025', sets: [{ done: true, at: Date.now(), w: 80, r: 8 }] }],
})

describe('recorded rest intervals', () => {
  let original
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-11T18:00:00'))
    original = useStore.getState().S
    useStore.setState({ S: { ...original, active: active() } })
    useUI.setState({ timer: null, work: null })
    localStorage.removeItem(REST_KEY)
  })
  afterEach(() => {
    useUI.getState().stopRest()
    useStore.setState({ S: original })
    localStorage.removeItem(REST_KEY)
    vi.useRealTimers()
  })

  it('saves elapsed rest on the completed set when the timer is skipped', () => {
    useUI.getState().startRest(90, 0, { forSet: 0 })
    vi.advanceTimersByTime(35_000)
    useUI.getState().skipRest()
    const saved = buildCompletedWorkout(useStore.getState().S.active)
    expect(saved.entries[0].sets[0].restActualSec).toBe(35)
  })

  it('excludes paused time and saves the interval when countdown finishes', () => {
    useUI.getState().startRest(60, 0, { forSet: 0 })
    vi.advanceTimersByTime(20_000)
    useUI.getState().pauseRest()
    vi.advanceTimersByTime(120_000)
    useUI.getState().resumeRest()
    vi.advanceTimersByTime(40_000)
    expect(useUI.getState().timer.ready).toBe(true)
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(60)
    useUI.getState().stopRest()
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(60)
  })

  it('records a countdown that elapsed while the app process was away', () => {
    useUI.getState().startRest(60, 0, { forSet: 0 })
    const saved = localStorage.getItem(REST_KEY)
    expect(saved).toBeTruthy()
    useUI.setState({ timer: null })
    localStorage.setItem(REST_KEY, saved)
    vi.setSystemTime(new Date('2026-11-11T18:02:00'))
    expect(restoreRest()).toBe(false)
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(60)
  })

  it('keeps the set owner and excludes pause time after Android notification actions', () => {
    useUI.getState().startRest(90, 0, { forSet: 0 })
    vi.advanceTimersByTime(20_000)
    useUI.getState().followNativeRest({ left: 70, total: 90, endsAt: Date.now() + 70_000, paused: true })
    vi.advanceTimersByTime(120_000)
    useUI.getState().followNativeRest({ left: 70, total: 90, endsAt: Date.now() + 70_000, paused: false })
    vi.advanceTimersByTime(30_000)
    useUI.getState().skipRest()
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(50)
  })

  it('keeps rest ownership after adding time from the Android notification', () => {
    useUI.getState().startRest(60, 0, { forSet: 0 })
    vi.advanceTimersByTime(15_000)
    useUI.getState().followNativeRest({ left: 60, total: 75, endsAt: Date.now() + 60_000, paused: false })
    vi.advanceTimersByTime(20_000)
    useUI.getState().skipRest()
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(35)
  })

  it('adds only the extension when Android resumes a rest already marked Ready', () => {
    useUI.getState().startRest(10, 0, { forSet: 0 })
    vi.advanceTimersByTime(10_000)
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(10)
    useUI.getState().followNativeRest({ left: 15, total: 25, endsAt: Date.now() + 15_000, paused: false })
    vi.advanceTimersByTime(5_000)
    useUI.getState().skipRest()
    expect(useStore.getState().S.active.entries[0].sets[0].restActualSec).toBe(15)
  })
})

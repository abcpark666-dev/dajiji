// Concrete calendar dates for sharing a week or month of the fixed training plan.
// A rotation floats until it is trained, so it cannot truthfully be assigned future dates.
import { isoOf, todayISO, weekKey, weekStartOf } from './format.js'
import { effectiveRoutineIds } from './history.js'

const on = iso => new Date(iso + 'T12:00:00')
const addDays = (iso, days) => {
  const d = on(iso)
  d.setDate(d.getDate() + days)
  return isoOf(d)
}

/** Inclusive dates of the natural week or calendar month containing `anchor`. */
export function periodRange(period, anchor, weekStart = 1) {
  if (period === 'week') {
    const from = weekKey(anchor, weekStart)
    return { from, to: addDays(from, 6) }
  }
  if (period === 'month') {
    const from = anchor.slice(0, 7) + '-01'
    const next = on(from)
    next.setMonth(next.getMonth() + 1)
    return { from, to: addDays(isoOf(next), -1) }
  }
  throw new RangeError('Unknown plan period')
}

/** The routines on each exact date, including one-day overrides and rest days. */
export function periodPlan(S, period, anchor, today = todayISO()) {
  const weekStart = weekStartOf(S)
  const range = periodRange(period, anchor, weekStart)
  const current = periodRange(period, today, weekStart)
  if (range.from < current.from) throw new RangeError('Past plan periods are unavailable')
  // A rotation is an ordered queue, not a dated schedule. Its fixed weekday additions and
  // explicit date overrides still have dates, but the floating queue does not.
  const fixed = S?.scheduleMode === 'rotation' ? { ...S, queue: null } : S
  const state = { ...fixed, routines: fixed?.routines || [], week: fixed?.week || {}, dayPlan: fixed?.dayPlan || {} }
  const byId = new Map(state.routines.map(r => [r.id, r]))
  const days = []
  for (let iso = range.from; iso <= range.to; iso = addDays(iso, 1)) {
    const routineIds = effectiveRoutineIds(state, iso).filter(id => byId.has(id))
    days.push({ iso, routineIds, routines: routineIds.map(id => byId.get(id)) })
  }
  return { ...range, period, days, current: range.from === current.from, rotation: S?.scheduleMode === 'rotation' }
}

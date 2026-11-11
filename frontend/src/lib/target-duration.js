import { plannedDurationMin } from './planned-duration.js'

/** Only an unambiguous single-routine session gets the routine's time goal. */
export const targetDurationForRoutines = routines =>
  Array.isArray(routines) && routines.length === 1 ? plannedDurationMin(routines[0]?.targetDurationMin) : null

/** Read the goal saved with a session, never the routine's current editable value. */
export function savedTargetDurationMin(record) {
  const ids = Array.isArray(record?.routineIds) ? record.routineIds : record?.routineId ? [record.routineId] : []
  return ids.length === 1 ? plannedDurationMin(record?.targetDurationMin) : null
}

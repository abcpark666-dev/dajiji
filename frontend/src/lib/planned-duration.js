/** A routine's optional workout time goal, stored as whole minutes. */
export function plannedDurationMin(value) {
  if (value === '' || value == null) return null
  const minutes = Number(value)
  return Number.isInteger(minutes) && minutes >= 1 && minutes <= 300 ? minutes : null
}

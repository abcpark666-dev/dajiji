// @vitest-environment happy-dom
import React, { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import RoutineEdit from './RoutineEdit.jsx'
import { DEF, useStore } from '../store/useStore.js'

vi.mock('../lib/api.js', () => ({ api: vi.fn(() => Promise.resolve({})) }))
vi.mock('../sheets.jsx', () => ({ glyphPicker: vi.fn(), exercisePicker: vi.fn(), exConfigSheet: vi.fn(), confirmSheet: vi.fn() }))
vi.mock('../components/Media.jsx', () => ({ Thumb: () => null }))
vi.mock('../components/BodyMap.jsx', () => ({ default: () => null }))
globalThis.IS_REACT_ACT_ENVIRONMENT = true

let root, host
afterEach(() => { if (root) act(() => root.unmount()); host?.remove(); root = null; host = null })
const type = (input, value) => act(() => {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value)
  input.dispatchEvent(new Event('input', { bubbles: true }))
})

it('saves and clears a duration goal on the routine', () => {
  const S = structuredClone(DEF)
  S.routines = [{ id: 'r1', name: 'Push', emoji: 'dumbbell', ex: [] }]
  useStore.setState({ S, user: null })
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root.render(<MemoryRouter initialEntries={['/routine/r1']}><Routes><Route path="/routine/:id" element={<RoutineEdit />} /></Routes></MemoryRouter>))
  const input = host.querySelector('input[aria-label="Planned duration"]')
  expect(input).toBeTruthy()
  type(input, '45')
  expect(useStore.getState().S.routines[0].targetDurationMin).toBe(45)
  type(input, '')
  expect(useStore.getState().S.routines[0].targetDurationMin).toBeUndefined()
})

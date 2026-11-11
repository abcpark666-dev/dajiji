// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest'
import { DEF } from './useStore.js'
import { DEFAULT_ACCENT, accentKey } from '../lib/accent.js'
import { drawBrand } from '../lib/card-draw.js'

describe('大肌肌 default accent', () => {
  it('starts new users in orange while preserving an existing choice', () => {
    expect(DEF.accent).toBe('orange')
    expect(DEFAULT_ACCENT).toBe('orange')
    expect(accentKey(DEF)).toBe('orange')
    expect(accentKey({ ...DEF, accent: 'lime' })).toBe('lime')
  })

  it('draws the original 大 monogram and app name on shared cards', () => {
    const text = []
    const rects = []
    const ctx = {
      save() {}, restore() {}, translate() {}, scale() {},
      fillRect(...args) { rects.push(args) },
      fillText(value) { text.push(value) },
    }
    drawBrand(ctx, { x: 0, y: 100, width: 500, colors: { acc: '#ff9f0a', label: '#fff', label2: '#aaa' }, family: 'sans' })
    expect(rects).toHaveLength(8)
    expect(text).toEqual(['大肌肌', '大肌肌'])
  })
})

// @vitest-environment happy-dom
import React, { act } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createRoot } from 'react-dom/client'
import { setLang } from '../lib/i18n.js'
import MobileOnboarding from './MobileOnboarding.jsx'

let root, host
beforeEach(() => {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
})
afterEach(() => { act(() => root.unmount()); host.remove() })

describe('mobile first launch', () => {
  it('shows the 大肌肌 monogram used by the installed app icon', () => {
    act(() => root.render(<MobileOnboarding />))
    const mark = host.querySelector('img[alt="大肌肌"]')
    expect(mark).not.toBeNull()
    expect(mark.getAttribute('src')).toBe('/icon-180.png')
  })

  it('renders the first-launch choices in Chinese when Chinese is selected', async () => {
    await setLang('zh')
    act(() => root.render(<MobileOnboarding />))
    expect(host.textContent).toContain('在此设备上使用')
    expect(host.textContent).toContain('连接到我的服务器')
  })
})

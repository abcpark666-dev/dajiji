import { describe, expect, it } from 'vitest'
import { MODULES, GROUPS, PRESETS } from './modules.js'
import { moduleCopy, groupCopy, presetCopy } from './modules-copy.js'
import { t } from './i18n-core.js'

describe('modules-copy', () => {
  it('says in t() exactly the English modules.js keeps (the search matches on it)', () => {
    const m = moduleCopy(), g = groupCopy(), p = presetCopy()
    for (const x of MODULES) expect(m[x.id]).toEqual([t(x.title), t(x.desc)])
    for (const x of GROUPS) expect(g[x.id]).toBe(t(x.title))
    for (const x of PRESETS) expect(p[x.id]).toEqual([t(x.title), t(x.desc)])
    expect(Object.keys(m)).toHaveLength(MODULES.length)
  })
})

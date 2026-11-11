import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

it('mobile build does not stage Gym visual exercise media', () => {
  expect(pkg.scripts['build:mobile']).not.toMatch(/stage-media|APP_MEDIA_DIR/)
  expect(pkg.scripts['build:mobile']).toMatch(/check-fork-media/)
})

it('release media check rejects a bundled exercise animation', () => {
  const dir = mkdtempSync(join(tmpdir(), 'dajiji-media-check-'))
  try {
    const clips = join(dir, 'exercise-media', 'clip')
    mkdirSync(clips, { recursive: true })
    writeFileSync(join(clips, '0001.mp4'), 'fixture')
    const run = spawnSync(process.execPath, [fileURLToPath(new URL('./check-fork-media.mjs', import.meta.url)), dir], { encoding: 'utf8' })
    expect(run.status).toBe(1)
    expect(run.stderr).toMatch(/restricted exercise media/i)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

it('mobile catalogue uses an original placeholder instead of licensed media paths', () => {
  const code = "import { EXIDX, imgSrc, gifSrc } from './frontend/src/lib/exercises.js'; console.log(JSON.stringify([imgSrc(EXIDX['0001']), gifSrc(EXIDX['0001'])]))"
  const run = spawnSync(process.execPath, ['--input-type=module', '-e', code], {
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    env: { ...process.env, VITE_NO_GYM_MEDIA: '1' },
    encoding: 'utf8',
  })
  expect(run.status, run.stderr).toBe(0)
  expect(JSON.parse(run.stdout.trim())).toEqual(['exercise-placeholder.svg', 'exercise-placeholder.svg'])
})

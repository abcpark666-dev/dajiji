#!/usr/bin/env node
// Cross-platform Capacitor build. The fork has no Gym visual media license.
import { spawnSync } from 'node:child_process'
import { restrictedMediaFiles } from './check-fork-media.mjs'

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run = (args, env = process.env) => {
  const done = spawnSync(npm, args, {
    env,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  })
  if (done.error) throw done.error
  if (done.status !== 0) process.exit(done.status || 1)
}

run(['run', 'build'], { ...process.env, VITE_MOBILE: '1', VITE_NO_GYM_MEDIA: '1' })
if (restrictedMediaFiles('dist').length) {
  console.error('Restricted exercise media found in dist; refusing to sync the native app.')
  process.exit(1)
}
run(['exec', '--', 'cap', 'sync', 'android'])

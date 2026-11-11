#!/usr/bin/env node
// Release gate: the upstream exercise animations and stills belong to Gym visual,
// not to the AGPL code license. 大肌肌 does not package them.
import { existsSync, readdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export function restrictedMediaFiles(bundleRoot) {
  const root = join(resolve(bundleRoot), 'exercise-media')
  if (!existsSync(root)) return []
  const files = []
  const visit = dir => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) visit(path)
      else files.push(path)
    }
  }
  visit(root)
  return files
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const bundle = resolve(process.argv[2] || 'dist')
  const files = restrictedMediaFiles(bundle)
  if (files.length) {
    console.error(`Restricted exercise media found in ${bundle}:\n${files.slice(0, 10).join('\n')}`)
    process.exit(1)
  }
  console.log(`No restricted exercise media in ${bundle}`)
}

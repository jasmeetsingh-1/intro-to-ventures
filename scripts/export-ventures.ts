// Writes dist/ventures.json: a small public summary the portfolio can fetch,
// so its Ventures rows never drift from this app. Runs after `vite build`.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { byLastUpdated, ventures } from '../src/content/ventures/index'

const out = resolve(dirname(fileURLToPath(import.meta.url)), '../dist/ventures.json')

const data = [...ventures].sort(byLastUpdated).map((v) => ({
  slug: v.slug,
  name: v.name,
  oneLiner: v.oneLiner,
  stage: v.stage,
  lastUpdated: v.lastUpdated,
  ...(v.liveUrl ? { liveUrl: v.liveUrl } : {}),
}))

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(data, null, 2) + '\n')
console.log(`Wrote ${data.length} ventures to dist/ventures.json`)

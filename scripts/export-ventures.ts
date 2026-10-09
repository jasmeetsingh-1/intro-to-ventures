// Runs after `vite build`. Checks every project JSON file (a broken file fails the build,
// so it never reaches production) and writes dist/ventures.json: a small public summary
// the portfolio can fetch, so its Ventures rows never drift from this app.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { byLastUpdated, resolveVentures, type ProjectFile } from '../src/content/resolve'
import { validateContent } from '../src/content/validate'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const projectsDir = resolve(root, 'src/content/projects')
const out = resolve(root, 'dist/ventures.json')

const files: ProjectFile[] = readdirSync(projectsDir)
  .filter((f) => f.endsWith('.json'))
  .map((file) => {
    try {
      return { file, data: JSON.parse(readFileSync(resolve(projectsDir, file), 'utf8')) as unknown }
    } catch (e) {
      console.error(`[projects/${file}] is not valid JSON: ${(e as Error).message}`)
      process.exit(1)
    }
  })

const { errors } = validateContent(files)
if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) in src/content/projects. Fix them and build again.`)
  process.exit(1)
}

const data = resolveVentures(files)
  .sort(byLastUpdated)
  .map((v) => ({
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

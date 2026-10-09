import { stageOrder, type ProjectFile } from './resolve'

const DAY = /^\d{4}-\d{2}-\d{2}$/
const MONTH = /^\d{4}-\d{2}$/
const KINDS = ['shipped', 'decision', 'learning', 'milestone', 'setback']
const STATES = ['done', 'doing', 'next']

function isValidDay(s: string): boolean {
  if (!DAY.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

function isValidMonth(s: string): boolean {
  return MONTH.test(s) && isValidDay(`${s}-01`)
}

function todayIso(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

type Obj = Record<string, unknown>
const isObj = (x: unknown): x is Obj => typeof x === 'object' && x !== null && !Array.isArray(x)
const isStr = (x: unknown): x is string => typeof x === 'string' && x.trim() !== ''
const arr = (x: unknown): unknown[] => (Array.isArray(x) ? x : [])

export interface ValidationResult {
  /** The file can't be rendered correctly: missing fields, wrong types, unknown stage. */
  errors: string[]
  /** Content smells: dates out of order, missing dates, duplicate slugs. */
  warnings: string[]
}

/** Checks the project JSON files. Logs to the console unless `log` is false. */
export function validateContent(files: ProjectFile[], log = true): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const today = todayIso()
  const seen = new Set<string>()

  for (const { file, data } of files) {
    const err = (msg: string) => errors.push(`[projects/${file}] ${msg}`)
    const warn = (msg: string) => warnings.push(`[projects/${file}] ${msg}`)

    if (!isObj(data)) {
      err('must be a JSON object')
      continue
    }
    const v = data

    for (const key of ['slug', 'name', 'oneLiner', 'stage', 'category', 'startedOn', 'problem']) {
      if (!isStr(v[key])) err(`"${key}" is required and must be a non-empty string`)
    }
    for (const key of ['workflow', 'stack', 'milestones', 'journey']) {
      if (!Array.isArray(v[key])) err(`"${key}" is required and must be an array`)
    }
    if (isStr(v.stage) && !(stageOrder as readonly string[]).includes(v.stage)) {
      err(`"stage" must be one of ${stageOrder.join(', ')} (got "${v.stage}")`)
    }

    if (isStr(v.slug)) {
      if (seen.has(v.slug)) warn(`duplicate slug "${v.slug}"`)
      seen.add(v.slug)
      if (file !== `${v.slug}.json`)
        warn(`file name should match the slug: rename to ${v.slug}.json`)
    }

    if (isStr(v.startedOn) && !isValidMonth(v.startedOn)) {
      warn(`invalid startedOn "${v.startedOn}" (want yyyy-mm)`)
    }
    if (v.lastUpdated !== undefined && !(isStr(v.lastUpdated) && isValidDay(v.lastUpdated))) {
      warn(`invalid lastUpdated "${String(v.lastUpdated)}" (want yyyy-mm-dd)`)
    }

    for (const step of arr(v.workflow)) {
      if (!isObj(step) || !isStr(step.title) || !isStr(step.detail)) {
        err('every workflow step needs a "title" and a "detail"')
      }
    }

    for (const m of arr(v.milestones)) {
      if (!isObj(m) || !isStr(m.label) || !STATES.includes(String(m.state))) {
        err(`every milestone needs a "label" and a "state" (${STATES.join(', ')})`)
        continue
      }
      if (m.state === 'done' && !m.date) warn(`done milestone "${m.label}" has no date`)
      if (m.date !== undefined && !(isStr(m.date) && isValidDay(m.date))) {
        warn(`milestone "${m.label}" has invalid date "${String(m.date)}"`)
      }
    }

    let newest = ''
    for (const e of arr(v.journey)) {
      if (!isObj(e) || !isStr(e.title) || typeof e.body !== 'string' || !isStr(e.date)) {
        err('every journey entry needs a "date", "title" and "body"')
        continue
      }
      if (!KINDS.includes(String(e.kind))) {
        err(`journey entry "${e.title}" has kind "${String(e.kind)}" (want ${KINDS.join(', ')})`)
      }
      if (!isValidDay(e.date)) {
        warn(`journey entry "${e.title}" has invalid date "${e.date}"`)
        continue
      }
      if (e.date > today) warn(`journey entry "${e.title}" is dated in the future (${e.date})`)
      if (e.date > newest) newest = e.date
    }

    if (isStr(v.lastUpdated) && newest && v.lastUpdated < newest) {
      warn(`lastUpdated (${v.lastUpdated}) is older than the newest journey entry (${newest})`)
    }
  }

  if (log) {
    for (const e of errors) console.error(e)
    for (const w of warnings) console.warn(w)
  }
  return { errors, warnings }
}

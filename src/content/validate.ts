import type { Venture } from './types'

const DAY = /^\d{4}-\d{2}-\d{2}$/
const MONTH = /^\d{4}-\d{2}$/

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

/** Dev-only sanity checks on the content files. Returns the warnings it logged. */
export function validateContent(list: Venture[]): string[] {
  const warnings: string[] = []
  const warn = (slug: string, msg: string) => warnings.push(`[content] ${slug}: ${msg}`)
  const today = todayIso()
  const seen = new Set<string>()

  for (const v of list) {
    if (seen.has(v.slug)) warn(v.slug, 'duplicate slug')
    seen.add(v.slug)

    if (!isValidMonth(v.startedOn))
      warn(v.slug, `invalid startedOn "${v.startedOn}" (want yyyy-mm)`)
    if (v.lastUpdated !== undefined && !isValidDay(v.lastUpdated)) {
      warn(v.slug, `invalid lastUpdated "${v.lastUpdated}" (want yyyy-mm-dd)`)
    }

    for (const m of v.milestones) {
      if (m.state === 'done' && !m.date) warn(v.slug, `done milestone "${m.label}" has no date`)
      if (m.date && !isValidDay(m.date))
        warn(v.slug, `milestone "${m.label}" has invalid date "${m.date}"`)
    }

    let newest = ''
    for (const e of v.journey) {
      if (!isValidDay(e.date)) {
        warn(v.slug, `journey entry "${e.title}" has invalid date "${e.date}"`)
        continue
      }
      if (e.date > today)
        warn(v.slug, `journey entry "${e.title}" is dated in the future (${e.date})`)
      if (e.date > newest) newest = e.date
    }

    if (v.lastUpdated && newest && v.lastUpdated < newest) {
      warn(
        v.slug,
        `lastUpdated (${v.lastUpdated}) is older than the newest journey entry (${newest})`,
      )
    }
  }

  for (const w of warnings) console.warn(w)
  return warnings
}

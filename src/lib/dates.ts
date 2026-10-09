// Intl-based date helpers. ISO strings are parsed as calendar dates (no time zone drift).

function parseIso(iso: string): Date {
  const [y = 1970, m = 1, d = 1] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const monthFmt = new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' })
const longMonthFmt = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })
const dayFmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

/** "2026-02" or "2026-02-14" → "Feb 2026" */
export function formatMonth(iso: string): string {
  return monthFmt.format(parseIso(iso))
}

/** "2026-10" → "October 2026" */
export function formatLongMonth(iso: string): string {
  return longMonthFmt.format(parseIso(iso))
}

/** "2026-10-09" → "9 Oct 2026" */
export function formatDay(iso: string): string {
  return dayFmt.format(parseIso(iso))
}

/** "2026-10-06" → "3 days ago", "2 weeks ago", "today" */
export function relativeTime(iso: string, now: Date = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const days = Math.round((parseIso(iso).getTime() - today.getTime()) / 86_400_000)
  const abs = Math.abs(days)
  if (abs < 7) return rtf.format(days, 'day')
  if (abs < 30) return rtf.format(Math.trunc(days / 7), 'week')
  if (abs < 365) return rtf.format(Math.trunc(days / 30), 'month')
  return rtf.format(Math.trunc(days / 365), 'year')
}

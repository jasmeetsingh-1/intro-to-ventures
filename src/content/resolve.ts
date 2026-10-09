// Pure helpers shared by the app (ventures.ts) and the build script (scripts/export-ventures.ts).
import type { Venture } from './types'

/** One JSON file from src/content/projects/, before it is checked. */
export interface ProjectFile {
  file: string // e.g. "project-atlas.json"
  data: unknown
}

export type ResolvedVenture = Venture & { lastUpdated: string }

export const stageOrder = ['live', 'beta', 'building', 'idea', 'paused'] as const

/** Drops the editor-only "$schema" key and fills in `lastUpdated` from the journey when omitted. */
export function resolveVentures(files: ProjectFile[]): ResolvedVenture[] {
  return files.map(({ data }) => {
    const v = { ...(data as Venture & { $schema?: string }) }
    delete v.$schema
    const newest = (v.journey ?? []).reduce((max, e) => (e.date > max ? e.date : max), '')
    return { ...v, lastUpdated: v.lastUpdated ?? (newest || `${v.startedOn}-01`) }
  })
}

/** Default order across the app: last updated, newest first. */
export function byLastUpdated(a: ResolvedVenture, b: ResolvedVenture): number {
  return b.lastUpdated.localeCompare(a.lastUpdated) || a.name.localeCompare(b.name)
}

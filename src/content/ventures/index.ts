// Slugs are public URLs (/v/<slug>) and the portfolio links to them.
// Once a venture is published, never change its slug.
import type { Venture } from '../types'
import { projectAtlas } from './project-atlas'
import { projectBeacon } from './project-beacon'
import { projectComet } from './project-comet'
import { projectDrift } from './project-drift'

export const registered: Venture[] = [projectAtlas, projectBeacon, projectComet, projectDrift]

/** The newest journey date, used when a venture leaves `lastUpdated` out. */
function deriveLastUpdated(v: Venture): string {
  const newest = v.journey.reduce((max, e) => (e.date > max ? e.date : max), '')
  return v.lastUpdated ?? (newest || `${v.startedOn}-01`)
}

export type ResolvedVenture = Venture & { lastUpdated: string }

export const ventures: ResolvedVenture[] = registered.map((v) => ({
  ...v,
  lastUpdated: deriveLastUpdated(v),
}))

export function getVenture(slug: string): ResolvedVenture | undefined {
  return ventures.find((v) => v.slug === slug)
}

export const stageOrder = ['live', 'beta', 'building', 'idea', 'paused'] as const

/** Default order across the app: last updated, newest first. */
export function byLastUpdated(a: ResolvedVenture, b: ResolvedVenture): number {
  return b.lastUpdated.localeCompare(a.lastUpdated) || a.name.localeCompare(b.name)
}

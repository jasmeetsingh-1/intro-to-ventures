// Every project is one JSON file in ./projects/. Drop a new file in that folder and it
// shows up on the landing page and gets its own journey page at /v/<slug>; nothing to register.
//
// Slugs are public URLs and the portfolio links to them.
// Once a project is published, never change its slug (or its file name).
import { byLastUpdated, resolveVentures, type ProjectFile, type ResolvedVenture } from './resolve'

export { byLastUpdated, stageOrder, type ResolvedVenture } from './resolve'

const modules = import.meta.glob<unknown>('./projects/*.json', { eager: true, import: 'default' })

export const projectFiles: ProjectFile[] = Object.entries(modules).map(([path, data]) => ({
  file: path.split('/').pop() ?? path,
  data,
}))

export const ventures: ResolvedVenture[] = resolveVentures(projectFiles).sort(byLastUpdated)

export function getVenture(slug: string): ResolvedVenture | undefined {
  return ventures.find((v) => v.slug === slug)
}

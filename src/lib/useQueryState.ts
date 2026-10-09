import { useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { stageOrder } from '../content/ventures'
import type { Stage } from '../content/types'

export const sortOptions = [
  { value: 'updated', label: 'Last updated' },
  { value: 'stage', label: 'Stage' },
  { value: 'started', label: 'Started' },
  { value: 'name', label: 'Name' },
] as const

export type SortKey = (typeof sortOptions)[number]['value']

const isStage = (s: string | null): s is Stage =>
  s !== null && (stageOrder as readonly string[]).includes(s)
const isSort = (s: string | null): s is SortKey =>
  s !== null && sortOptions.some((o) => o.value === s)

/** Stage filter and sort order, kept in the URL query (?stage=building&sort=started). */
export function useQueryState() {
  const [params, setParams] = useSearchParams()
  const rawStage = params.get('stage')
  const rawSort = params.get('sort')
  const stage: Stage | 'all' = isStage(rawStage) ? rawStage : 'all'
  const sort: SortKey = isSort(rawSort) ? rawSort : 'updated'

  const update = useCallback(
    (key: 'stage' | 'sort', value: string, fallback: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (value === fallback) next.delete(key)
          else next.set(key, value)
          return next
        },
        { replace: true, preventScrollReset: true },
      )
    },
    [setParams],
  )

  const setStage = useCallback((s: Stage | 'all') => update('stage', s, 'all'), [update])
  const setSort = useCallback((s: SortKey) => update('sort', s, 'updated'), [update])

  return { stage, sort, setStage, setSort }
}

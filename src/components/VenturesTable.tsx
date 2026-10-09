import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { byLastUpdated, stageOrder, type ResolvedVenture } from '../content/ventures'
import type { Stage } from '../content/types'
import { formatDay, formatMonth, relativeTime } from '../lib/dates'
import { sortOptions, useQueryState, type SortKey } from '../lib/useQueryState'
import { stageLabel } from '../lib/stages'
import { StagePill } from './StagePill'
import './VenturesTable.css'

const sorters: Record<SortKey, (a: ResolvedVenture, b: ResolvedVenture) => number> = {
  updated: byLastUpdated,
  stage: (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage) || byLastUpdated(a, b),
  started: (a, b) => b.startedOn.localeCompare(a.startedOn) || byLastUpdated(a, b),
  name: (a, b) => a.name.localeCompare(b.name),
}

const pad = (n: number) => String(n).padStart(2, '0')

export interface JourneyLinkState {
  backTo: string
}

export function VenturesTable({ ventures }: { ventures: ResolvedVenture[] }) {
  const { stage, sort, setStage, setSort } = useQueryState()
  const location = useLocation()
  const linkState: JourneyLinkState = { backTo: `/${location.search}` }

  const counts = useMemo(() => {
    const c = new Map<Stage, number>()
    for (const v of ventures) c.set(v.stage, (c.get(v.stage) ?? 0) + 1)
    return c
  }, [ventures])

  const rows = useMemo(
    () => ventures.filter((v) => stage === 'all' || v.stage === stage).sort(sorters[sort]),
    [ventures, stage, sort],
  )

  const chips: { value: Stage | 'all'; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: ventures.length },
    ...stageOrder
      .filter((s) => counts.has(s))
      .map((s) => ({ value: s, label: stageLabel[s], count: counts.get(s) ?? 0 })),
  ]
  // A stage from the URL with no ventures still gets a chip, so the active filter stays visible.
  if (stage !== 'all' && !counts.has(stage)) {
    chips.push({ value: stage, label: stageLabel[stage], count: 0 })
  }

  return (
    <div className="ventures">
      <div className="ventures__toolbar">
        <div className="chips" role="group" aria-label="Filter by stage">
          {chips.map((c) => (
            <button
              key={c.value}
              type="button"
              className="chip"
              aria-pressed={stage === c.value}
              onClick={() => setStage(c.value)}
            >
              {c.label} <span className="chip__count num">{c.count}</span>
            </button>
          ))}
        </div>
        <label className="sort">
          <span className="mono-label">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {rows.length === 0 ? (
        <div className="ventures__empty">
          <p>No ventures at this stage yet.</p>
          <button type="button" className="btn-quiet" onClick={() => setStage('all')}>
            Show all
          </button>
        </div>
      ) : (
        <>
          <table className="vtable">
            <caption className="visually-hidden">Current ventures</caption>
            <thead>
              <tr>
                <th scope="col" className="vtable__idx">
                  #
                </th>
                <th scope="col">Venture</th>
                <th scope="col">Stage</th>
                <th scope="col" className="vtable__opt">
                  Category
                </th>
                <th scope="col" className="vtable__opt">
                  Started
                </th>
                <th scope="col">Last update</th>
                <th scope="col">Next milestone</th>
                <th scope="col" className="vtable__go">
                  <span className="visually-hidden">Open</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((v, i) => (
                <tr key={v.slug} className="vrow">
                  <td className="vtable__idx num">{pad(i + 1)}</td>
                  <td className="vrow__venture">
                    <Link to={`/v/${v.slug}`} state={linkState} className="vrow__link">
                      <span className="vrow__name">{v.name}</span>
                    </Link>
                    <span className="vrow__oneliner">{v.oneLiner}</span>
                  </td>
                  <td>
                    <StagePill stage={v.stage} />
                  </td>
                  <td className="vtable__opt muted">{v.category}</td>
                  <td className="vtable__opt num">
                    <time dateTime={v.startedOn}>{formatMonth(v.startedOn)}</time>
                  </td>
                  <td className="num">
                    <time dateTime={v.lastUpdated} title={formatDay(v.lastUpdated)}>
                      {relativeTime(v.lastUpdated)}
                    </time>
                  </td>
                  <td className="muted">{v.nextMilestone ?? '—'}</td>
                  <td className="vtable__go" aria-hidden="true">
                    <span className="arrow">→</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ol className="vcards" role="list" aria-label="Current ventures">
            {rows.map((v) => (
              <li key={v.slug}>
                <Link to={`/v/${v.slug}`} state={linkState} className="vcard">
                  <span className="vcard__top">
                    <span className="vcard__name">{v.name}</span>
                    <StagePill stage={v.stage} />
                  </span>
                  <span className="vcard__oneliner">{v.oneLiner}</span>
                  <span className="vcard__meta mono-label">
                    Updated{' '}
                    <time dateTime={v.lastUpdated} title={formatDay(v.lastUpdated)}>
                      {relativeTime(v.lastUpdated)}
                    </time>
                    {v.nextMilestone && <> · Next: {v.nextMilestone}</>}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

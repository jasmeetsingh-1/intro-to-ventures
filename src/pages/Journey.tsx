import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { byLastUpdated, getVenture, ventures, type ResolvedVenture } from '../content/ventures'
import { JourneyTimeline } from '../components/JourneyTimeline'
import { MilestoneTrack } from '../components/MilestoneTrack'
import { OnThisPage, type Section } from '../components/OnThisPage'
import { StagePill } from '../components/StagePill'
import type { JourneyLinkState } from '../components/VenturesTable'
import { WorkflowSteps } from '../components/WorkflowSteps'
import { formatDay, formatMonth } from '../lib/dates'
import { paragraphs } from '../lib/emphasis'
import { SITE_TITLE, useDocumentMeta } from '../lib/useDocumentMeta'
import { NotFoundState } from './NotFound'
import './Journey.css'

const defaultOrder = [...ventures].sort(byLastUpdated)

function backTarget(state: unknown): string {
  const backTo = (state as Partial<JourneyLinkState> | null)?.backTo
  return typeof backTo === 'string' && backTo.startsWith('/') ? backTo : '/'
}

export function Journey() {
  const { slug = '' } = useParams()
  const venture = getVenture(slug)

  useDocumentMeta(
    venture ? `${venture.name} · ${SITE_TITLE}` : `Not found · ${SITE_TITLE}`,
    venture ? venture.oneLiner : "That venture doesn't exist (yet).",
  )

  if (!venture) {
    return <NotFoundState title="That venture doesn't exist (yet)." linkLabel="All ventures" />
  }
  return <JourneyView key={venture.slug} venture={venture} />
}

function Facts({ v, className }: { v: ResolvedVenture; className: string }) {
  return (
    <dl className={className}>
      {v.role && (
        <div>
          <dt>Role</dt>
          <dd>{v.role}</dd>
        </div>
      )}
      <div>
        <dt>Started</dt>
        <dd>
          <time dateTime={v.startedOn}>{formatMonth(v.startedOn)}</time>
        </dd>
      </div>
      <div>
        <dt>Last update</dt>
        <dd>
          <time dateTime={v.lastUpdated}>{formatDay(v.lastUpdated)}</time>
        </dd>
      </div>
      <div>
        <dt>Category</dt>
        <dd>{v.category}</dd>
      </div>
    </dl>
  )
}

function JourneyView({ venture: v }: { venture: ResolvedVenture }) {
  const location = useLocation()
  const back = backTarget(location.state)

  const sections = useMemo(() => {
    const list: (Section | false)[] = [
      { id: 'story', label: 'Why this exists' },
      v.workflow.length > 0 && { id: 'how-it-works', label: 'How it works' },
      (v.stack.length > 0 || !!v.architectureNote) && {
        id: 'under-the-hood',
        label: 'Under the hood',
      },
      v.milestones.length > 0 && { id: 'where-it-stands', label: 'Where it stands' },
      v.journey.length > 0 && { id: 'journey', label: 'The journey' },
      !!v.roadmap?.length && { id: 'whats-next', label: "What's next" },
    ]
    return list.filter((s): s is Section => Boolean(s))
  }, [v])
  const has = (id: string) => sections.some((s) => s.id === id)

  const idx = defaultOrder.findIndex((x) => x.slug === v.slug)
  const prev = idx > 0 ? defaultOrder[idx - 1] : undefined
  const next = idx < defaultOrder.length - 1 ? defaultOrder[idx + 1] : undefined

  const liveButton = v.liveUrl && (
    <a className="btn-primary" href={v.liveUrl} target="_blank" rel="noopener noreferrer">
      Visit live site{' '}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  )

  return (
    <div className="container journey">
      <nav className="journey__crumb" aria-label="Breadcrumb">
        <Link to={back} className="text-link">
          <span aria-hidden="true">←</span> All ventures
        </Link>
      </nav>

      <div className="journey__layout">
        <article className="journey__main">
          <header className="jhero">
            <StagePill stage={v.stage} />
            <h1 className="display jhero__name">{v.name}</h1>
            <p className="jhero__oneliner">{v.oneLiner}</p>
            <Facts v={v} className="jhero__facts mono-label" />
            {(v.liveUrl || v.links?.length) && (
              <div className="jhero__actions">
                {liveButton}
                {v.links?.map((l) => (
                  <a
                    key={l.url + l.label}
                    className="text-link"
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            )}
          </header>

          {v.metrics && v.metrics.length > 0 && (
            <dl className="metrics" aria-label="Metrics">
              {v.metrics.slice(0, 4).map((m) => (
                <div key={m.label} className="metrics__item">
                  <dt className="mono-label">{m.label}</dt>
                  <dd className="display num">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <section id="story" className="jsection" aria-labelledby="story-h">
            <h2 id="story-h" className="jsection__title">
              Why this exists
            </h2>
            <div className="prose">
              {paragraphs(v.problem).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {v.audience && (
              <div className="audience">
                <p className="mono-label">Who it's for</p>
                <p>{v.audience}</p>
              </div>
            )}
          </section>

          {has('how-it-works') && (
            <section id="how-it-works" className="jsection" aria-labelledby="how-h">
              <h2 id="how-h" className="jsection__title">
                How it works
              </h2>
              <WorkflowSteps steps={v.workflow} />
            </section>
          )}

          {has('under-the-hood') && (
            <section id="under-the-hood" className="jsection" aria-labelledby="hood-h">
              <h2 id="hood-h" className="jsection__title">
                Under the hood
              </h2>
              {v.stack.length > 0 && (
                <ul className="stack" role="list" aria-label="Stack">
                  {v.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              )}
              {v.architectureNote && <p className="prose hood__note">{v.architectureNote}</p>}
            </section>
          )}

          {has('where-it-stands') && (
            <section id="where-it-stands" className="jsection" aria-labelledby="stands-h">
              <h2 id="stands-h" className="jsection__title">
                Where it stands
              </h2>
              <MilestoneTrack milestones={v.milestones} />
            </section>
          )}

          {has('journey') && (
            <section id="journey" className="jsection" aria-labelledby="journey-h">
              <h2 id="journey-h" className="jsection__title">
                The journey
              </h2>
              <JourneyTimeline entries={v.journey} />
            </section>
          )}

          {has('whats-next') && v.roadmap && (
            <section id="whats-next" className="jsection" aria-labelledby="next-h">
              <h2 id="next-h" className="jsection__title">
                What's next
              </h2>
              <ul className="roadmap" role="list">
                {v.roadmap.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          {(prev || next) && (
            <nav className="pager" aria-label="More ventures">
              {prev ? (
                <Link to={`/v/${prev.slug}`} state={{ backTo: back }} className="pager__link">
                  <span className="mono-label">← Previous</span>
                  <span className="pager__name">{prev.name}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link
                  to={`/v/${next.slug}`}
                  state={{ backTo: back }}
                  className="pager__link pager__link--next"
                >
                  <span className="mono-label">Next →</span>
                  <span className="pager__name">{next.name}</span>
                </Link>
              )}
            </nav>
          )}
        </article>

        <aside className="rail" aria-label="Venture details">
          <div className="rail__inner">
            <OnThisPage sections={sections} />
            <Facts v={v} className="rail__facts" />
            {liveButton}
          </div>
        </aside>
      </div>
    </div>
  )
}

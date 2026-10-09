import { useId, useState } from 'react'
import type { JourneyEntry, JourneyKind } from '../content/types'
import { formatDay, formatLongMonth } from '../lib/dates'
import { paragraphs } from '../lib/emphasis'
import './JourneyTimeline.css'

const VISIBLE = 6

const kindLabel: Record<JourneyKind, string> = {
  shipped: 'Shipped',
  decision: 'Decision',
  learning: 'Learning',
  milestone: 'Milestone',
  setback: 'Setback',
}

export function JourneyTimeline({ entries }: { entries: JourneyEntry[] }) {
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  const shown = expanded ? sorted : sorted.slice(0, VISIBLE)
  const hidden = sorted.length - shown.length

  const groups: { month: string; items: JourneyEntry[] }[] = []
  for (const e of shown) {
    const month = e.date.slice(0, 7)
    const last = groups[groups.length - 1]
    if (last?.month === month) last.items.push(e)
    else groups.push({ month, items: [e] })
  }

  return (
    <div className="timeline" id={listId}>
      {groups.map((g) => (
        <section key={g.month} className="timeline__month" aria-label={formatLongMonth(g.month)}>
          <h3 className="timeline__month-label mono-label">{formatLongMonth(g.month)}</h3>
          <ol className="timeline__list" role="list">
            {g.items.map((e) => (
              <li key={`${e.date}-${e.title}`} className="entry">
                <div className="entry__head">
                  <time className="mono-label" dateTime={e.date}>
                    {formatDay(e.date)}
                  </time>
                  <span className={`kind kind--${e.kind}`}>{kindLabel[e.kind]}</span>
                </div>
                <h4 className="entry__title">{e.title}</h4>
                {paragraphs(e.body).map((p, i) => (
                  <p key={i} className="entry__p">
                    {p}
                  </p>
                ))}
                {e.links && e.links.length > 0 && (
                  <ul className="entry__links" role="list">
                    {e.links.map((l) => (
                      <li key={l.url + l.label}>
                        <a
                          className="text-link"
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {l.label} <span aria-hidden="true">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>
      ))}
      {hidden > 0 && (
        <button
          type="button"
          className="btn-quiet timeline__more"
          aria-controls={listId}
          aria-expanded={expanded}
          onClick={() => setExpanded(true)}
        >
          Show full journey ({hidden} more)
        </button>
      )}
    </div>
  )
}

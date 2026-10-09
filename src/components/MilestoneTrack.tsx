import type { Milestone } from '../content/types'
import { formatDay } from '../lib/dates'
import './MilestoneTrack.css'

export function MilestoneTrack({ milestones }: { milestones: Milestone[] }) {
  const done = milestones.filter((m) => m.state === 'done').length
  return (
    <div className="track">
      <ol className="track__list" role="list">
        {milestones.map((m) => (
          <li key={m.label} className={`track__item track__item--${m.state}`}>
            <span className="track__dot" aria-hidden="true" />
            <span className="track__label">{m.label}</span>
            <span className="track__meta mono-label">
              {m.state === 'done' && m.date ? (
                <time dateTime={m.date}>{formatDay(m.date)}</time>
              ) : m.state === 'done' ? (
                'Done'
              ) : m.state === 'doing' ? (
                'In progress'
              ) : (
                'Next'
              )}
            </span>
          </li>
        ))}
      </ol>
      <p className="track__summary mono-label num">
        {done} of {milestones.length} milestones done
      </p>
    </div>
  )
}

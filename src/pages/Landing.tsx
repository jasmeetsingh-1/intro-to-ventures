import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../content/profile'
import { ventures } from '../content/ventures'
import { VenturesTable } from '../components/VenturesTable'
import { formatDay, formatMonth } from '../lib/dates'
import { emphasis } from '../lib/emphasis'
import { SITE_TITLE, useDocumentMeta } from '../lib/useDocumentMeta'
import './Landing.css'

const latestUpdate = ventures.reduce((max, v) => (v.lastUpdated > max ? v.lastUpdated : max), '')
const earliestStart = ventures.reduce(
  (min, v) => (min === '' || v.startedOn < min ? v.startedOn : min),
  '',
)
const countStage = (s: string) => ventures.filter((v) => v.stage === s).length

const facts = [
  `${ventures.length} ${ventures.length === 1 ? 'venture' : 'ventures'}`,
  `${countStage('live')} live`,
  `${countStage('beta')} in beta`,
  earliestStart && `Building since ${formatMonth(earliestStart)}`,
].filter(Boolean)

export function Landing() {
  useDocumentMeta(
    SITE_TITLE,
    `${profile.name}'s ventures: every idea and product, and the journey behind each one.`,
  )
  const reduce = useReducedMotion()

  // Fade-up once on load. `initial={false}` under reduced motion keeps everything visible at rest.
  const fadeUp = (i: number) => ({
    initial: reduce ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.2, 0.7, 0.2, 1] as const },
  })

  return (
    <>
      <section className="hero container" aria-labelledby="hero-title">
        <p className="mono-label hero__eyebrow">
          Ventures
          {latestUpdate && (
            <>
              {' · '}Updated <time dateTime={latestUpdate}>{formatDay(latestUpdate)}</time>
            </>
          )}
        </p>
        <motion.h1 id="hero-title" className="display hero__title" {...fadeUp(0)}>
          {emphasis(profile.headline)}
        </motion.h1>
        <p className="hero__intro">{profile.intro}</p>

        <div className="hero__actions">
          <a className="btn-primary" href={profile.portfolioUrl}>
            See my portfolio{' '}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
          <a className="text-link" href="#contact">
            Get in touch
          </a>
        </div>

        {profile.principles && profile.principles.length > 0 && (
          <ul className="hero__principles" role="list" aria-label="How I build">
            {profile.principles.slice(0, 3).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}

        <ul className="hero__facts mono-label" role="list" aria-label="At a glance">
          {facts.map((f, i) => (
            <motion.li key={f} className="num" {...fadeUp(i + 1)}>
              {f}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="container landing__ventures" aria-labelledby="ventures-title">
        <h2 id="ventures-title" className="mono-label landing__section-label">
          All ventures
        </h2>
        <VenturesTable ventures={ventures} />
      </section>

      <section className="container how" aria-labelledby="how-title">
        <h2 id="how-title" className="display how__title">
          How I work on these
        </h2>
        <p className="how__body">
          [Placeholder] Every venture here is built in the open, alongside my day job. I keep a log
          for each one so the decisions, the mistakes and the wins are all on the record.
        </p>
        <p className="how__links">
          <a className="text-link" href={profile.portfolioUrl}>
            See my portfolio <span aria-hidden="true">↗</span>
          </a>
          <a className="text-link" href="#contact">
            Get in touch
          </a>
        </p>
      </section>
    </>
  )
}

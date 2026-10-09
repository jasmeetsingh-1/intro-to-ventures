import { useEffect, useState } from 'react'
import './OnThisPage.css'

export interface Section {
  id: string
  label: string
}

/** Section index that highlights the section currently in view. */
export function OnThisPage({ sections }: { sections: Section[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const visible = new Map<string, boolean>()
    const observer = new IntersectionObserver(
      (records) => {
        for (const r of records) visible.set(r.target.id, r.isIntersecting)
        const first = sections.find((s) => visible.get(s.id))
        if (first) setActive(first.id)
      },
      { rootMargin: '-80px 0px -55% 0px' },
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav className="otp" aria-label="On this page">
      <p className="mono-label otp__title">On this page</p>
      <ul role="list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={`otp__link${active === s.id ? ' is-active' : ''}`}
              aria-current={active === s.id ? 'location' : undefined}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

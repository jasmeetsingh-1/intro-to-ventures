import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profile } from '../content/profile'
import './Header.css'

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="container site-header__inner">
        <Link to="/" className="wordmark" aria-label={`${profile.handle}, Founder Mode — home`}>
          <span className="wordmark__js">{profile.handle}</span>
          <span className="mono-label wordmark__label">Founder Mode</span>
        </Link>
        <a className="site-header__link" href={profile.portfolioUrl}>
          Portfolio <span aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
  )
}

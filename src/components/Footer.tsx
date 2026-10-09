import { profile } from '../content/profile'
import { CopyEmail } from './CopyEmail'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container site-footer__inner">
        <div className="site-footer__contact">
          <p className="mono-label">Get in touch</p>
          <CopyEmail email={profile.contact.email} />
        </div>
        <ul className="site-footer__links" role="list">
          <li>
            <a
              className="text-link"
              href={profile.contact.linkedin}
              rel="noopener noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </li>
          {profile.contact.github && (
            <li>
              <a
                className="text-link"
                href={profile.contact.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            </li>
          )}
          <li>
            <a className="text-link" href={`${profile.portfolioUrl}/#ventures`}>
              Back to portfolio <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
        <p className="site-footer__copy mono-label">© 2026 {profile.name}</p>
      </div>
    </footer>
  )
}

import { Link } from 'react-router-dom'
import { SITE_TITLE, useDocumentMeta } from '../lib/useDocumentMeta'
import './NotFound.css'

export function NotFoundState({ title, linkLabel }: { title: string; linkLabel: string }) {
  return (
    <section className="container not-found">
      <p className="mono-label">404</p>
      <h1 className="display not-found__title">{title}</h1>
      <Link className="btn-primary" to="/">
        <span className="arrow" aria-hidden="true">
          ←
        </span>{' '}
        {linkLabel}
      </Link>
    </section>
  )
}

export function NotFound() {
  useDocumentMeta(`Not found · ${SITE_TITLE}`, 'This page does not exist.')
  return <NotFoundState title="This page doesn't exist." linkLabel="Back home" />
}

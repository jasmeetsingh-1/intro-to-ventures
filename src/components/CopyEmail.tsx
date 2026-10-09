import { useEffect, useRef, useState } from 'react'
import './CopyEmail.css'

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'selected'>('idle')
  const textRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (state === 'idle') return
    const t = window.setTimeout(() => setState('idle'), 2000)
    return () => window.clearTimeout(t)
  }, [state])

  const selectText = () => {
    const el = textRef.current
    const sel = window.getSelection()
    if (!el || !sel) return
    const range = document.createRange()
    range.selectNodeContents(el)
    sel.removeAllRanges()
    sel.addRange(range)
    setState('selected')
  }

  const copy = () => {
    if (!navigator.clipboard?.writeText) {
      selectText()
      return
    }
    navigator.clipboard.writeText(email).then(() => setState('copied'), selectText)
  }

  return (
    <span className="copy-email">
      <span ref={textRef} className="copy-email__text">
        {email}
      </span>
      <button type="button" className="copy-email__btn mono-label" onClick={copy}>
        {state === 'copied' ? 'Copied' : 'Copy'}
      </button>
      <span className="visually-hidden" role="status">
        {state === 'copied'
          ? 'Email copied to clipboard'
          : state === 'selected'
            ? 'Email selected, press Ctrl+C or Cmd+C to copy'
            : ''}
      </span>
    </span>
  )
}

import type { ReactNode } from 'react'

/** Renders "JS, *Founder Mode*" with the starred part as <em>. */
export function emphasis(text: string): ReactNode[] {
  return text
    .split(/(\*[^*]+\*)/g)
    .map((part, i) =>
      part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        part
      ),
    )
}

/** Splits plain text on blank lines into paragraphs. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

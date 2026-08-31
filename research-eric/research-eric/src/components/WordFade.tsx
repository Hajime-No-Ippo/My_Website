import type { CSSProperties, ElementType } from 'react'

interface WordFadeProps {
  as?: ElementType
  text: string
  className?: string
  /** Extra delay before the first word, in ms. */
  delay?: number
  /** Delay added per word, in ms. */
  interval?: number
}

/**
 * Renders `text` one word per span, each fading in on a staggered delay.
 * The fade is gated behind <html class="js"> so prerendered / no-JS pages
 * stay fully visible instead of showing blank text.
 */
export default function WordFade({
  as: Tag = 'span',
  text,
  className = '',
  delay = 0,
  interval = 40,
}: WordFadeProps) {
  const words = text.split(' ').filter((word) => word.length > 0)

  return (
    <Tag className={`wordfade ${className}`.trim()}>
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          className="wordfade__word"
          style={{ animationDelay: `${delay + i * interval}ms` } as CSSProperties}
        >
          {word}
        </span>
      ))}
    </Tag>
  )
}
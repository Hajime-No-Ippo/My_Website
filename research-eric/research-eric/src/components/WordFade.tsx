import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

interface WordFadeProps {
  children: ReactNode
  className?: string
  /** Extra delay before the first word, in ms. */
  delay?: number
  /** Target time for the last word, in ms. Interval is derived from this
      and the total word count so short pages stay snappy and long posts
      don't take forever. */
  totalMs?: number
  minInterval?: number
  maxInterval?: number
}

/** Elements whose text must not be torn apart (code, scripting, forms). */
const SKIP_TAGS = new Set([
  'PRE',
  'CODE',
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'TEMPLATE',
])

/**
 * Word-fades every piece of visible text beneath it: each text node is split
 * into per-word spans with a staggered delay that cascades down the page.
 * Runs as a one-off DOM pass after mount/route-change, so dangerouslySetInnerHTML
 * content (the post body) fades too. Code blocks are left untouched.
 */
export default function WordFade({
  children,
  className = '',
  delay = 0,
  totalMs = 6000,
  minInterval = 8,
  maxInterval = 30,
}: WordFadeProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root || root.dataset.wf) return
    root.dataset.wf = '1'

    const nodes: Text[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        let el = node.parentElement
        if (!el) return NodeFilter.FILTER_REJECT
        for (let p: HTMLElement | null = el; p && p !== root; p = p.parentElement) {
          if (SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT
        }
        if (!(node.textContent ?? '').trim()) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })
    while (walker.nextNode()) nodes.push(walker.currentNode as Text)

    const wordCount = nodes.reduce(
      (n, node) => n + ((node.textContent ?? '').trim().split(/\s+/).length || 0),
      0,
    )
    const interval = Math.max(
      minInterval,
      Math.min(maxInterval, Math.round(totalMs / Math.max(wordCount, 1))),
    )

    let index = 0
    for (const node of nodes) {
      const words = (node.textContent ?? '').trim().split(/\s+/)
      const fragment = document.createDocumentFragment()
      words.forEach((word, i) => {
        const span = document.createElement('span')
        span.className = 'wordfade__word'
        span.style.animationDelay = `${delay + index * interval}ms`
        span.textContent = word
        fragment.appendChild(span)
        if (i < words.length - 1) fragment.appendChild(document.createTextNode(' '))
        index++
      })
      node.parentNode?.replaceChild(fragment, node)
    }

    // New route, start from the top so the cascade is seen in full.
    window.scrollTo(0, 0)
  }, [delay, totalMs, minInterval, maxInterval])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/** How long the page fade out takes before navigation proceeds, in ms.
    Keep this short — it is a quick blink, not the main effect.
    Fade-in duration lives in the CSS animation below. */
export const PAGE_FADE_MS = 200

export const PAGE_FADE_LEAVE_EVENT = 'page-fade:leave'

/** Ask the currently mounted page wrapper to fade out before navigating away
    (dispatched by the click interceptor in App.tsx). */
export function fadeOutCurrentPage() {
  window.dispatchEvent(new CustomEvent(PAGE_FADE_LEAVE_EVENT))
}

/**
 * Fades the whole page in on mount and out when a navigation is about to
 * happen. No per-word splitting — the entire page fades as one unit.
 */
export default function PageFade({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // New route, start from the top.
    window.scrollTo(0, 0)

    const el = ref.current
    if (!el) return
    const onLeave = () => {
      el.style.transition = `opacity ${PAGE_FADE_MS}ms ease`
      el.style.opacity = '0'
    }
    window.addEventListener(PAGE_FADE_LEAVE_EVENT, onLeave)
    return () => window.removeEventListener(PAGE_FADE_LEAVE_EVENT, onLeave)
  }, [])

  return (
    <div ref={ref} className={className ? `page-fade ${className}` : 'page-fade'}>
      {children}
    </div>
  )
}
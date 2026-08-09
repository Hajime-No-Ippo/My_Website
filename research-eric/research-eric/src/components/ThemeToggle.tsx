import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

function readTheme(): Theme {
  const explicit = document.documentElement.dataset.theme
  if (explicit === 'light' || explicit === 'dark') return explicit
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
  // Stays null through the server render and the first client render so the
  // two match; the real value lands after hydration.
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    setTheme(readTheme())
  }, [])

  function toggle() {
    const next: Theme = (theme ?? readTheme()) === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Private mode or storage disabled — the toggle still works for this page.
    }
    setTheme(next)
  }

  const label =
    theme === 'dark' ? 'Switch to light theme' : theme === 'light' ? 'Switch to dark theme' : 'Toggle theme'

  return (
    <button type="button" className="theme-toggle" onClick={toggle} aria-label={label} title={label}>
      {/* Half-filled circle reads correctly in either theme, so there is no
          wrong-icon flash before hydration tells us which theme is active. */}
      <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13Z" fill="currentColor" />
      </svg>
    </button>
  )
}

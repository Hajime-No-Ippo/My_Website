import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.tsx'
import { site } from '../site.ts'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <header className="site-header">
        <div className="wrap">
          <nav className="site-nav">
            <NavLink to="/blog">My Blog</NavLink>
            <a href="https://portfolio.ericdesign.uk" target="_blank" rel="noreferrer">
              Portfolio
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main>
        <div className="wrap">{children}</div>
      </main>

      <footer className="site-footer">
        <div className="wrap">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>Built with Vite</span>
        </div>
      </footer>
    </div>
  )
}

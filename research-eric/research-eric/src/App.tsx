import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './routes/Home.tsx'
import Blog from './routes/Blog.tsx'
import Post from './routes/Post.tsx'
import NotFound from './routes/NotFound.tsx'
import {
  PAGE_FADE_MS,
  fadeOutCurrentPage,
} from './components/PageFade.tsx'

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()

  // Internal link clicks fade the current page out before navigating, so the
  // next page's fade-in has a fade-out to follow. Runs in the capture phase
  // so react-router's own Link handler never double-navigates.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return
      const anchor = (e.target as Element | null)?.closest?.('a')
      if (!anchor || !anchor.href) return
      if (anchor.target && anchor.target !== '_self') return
      const url = new URL(anchor.href, window.location.origin)
      if (url.origin !== window.location.origin) return
      // Same-page hash links keep their default behaviour (no route change).
      if (
        url.pathname === location.pathname &&
        url.search === location.search
      )
        return

      e.preventDefault()
      e.stopPropagation()
      fadeOutCurrentPage()
      window.setTimeout(() => {
        navigate(url.pathname + url.search + url.hash)
      }, PAGE_FADE_MS)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate, location.pathname, location.search])

  return (
    <Layout>
      {/* Keyed by path so every navigation remounts the route subtree and
          replays the page fade (also covers post → post). */}
      <Routes key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

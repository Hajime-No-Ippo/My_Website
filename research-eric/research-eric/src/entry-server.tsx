import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App.tsx'
import { posts } from './posts.ts'
import { site } from './site.ts'

/** Every URL the prerenderer should turn into a static HTML file. */
export function routes(): string[] {
  return ['/', '/blog', ...posts.map((post) => `/blog/${post.slug}`)]
}

/** Per-page <title> and description, baked into the prerendered HTML. */
export function head(url: string): { title: string; description: string } {
  if (url === '/') {
    return { title: site.name, description: site.description }
  }

  if (url === '/blog') {
    return { title: `Writing — ${site.shortName}`, description: 'Everything I have published.' }
  }

  const slug = url.replace(/^\/blog\//, '')
  const post = posts.find((item) => item.slug === slug)
  if (post) {
    return {
      title: `${post.title} — ${site.shortName}`,
      description: post.summary || site.description,
    }
  }

  return { title: `Not found — ${site.shortName}`, description: site.description }
}

export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}

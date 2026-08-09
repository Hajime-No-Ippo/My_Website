// Renders every route to a static HTML file so crawlers, link previews and
// no-JS visitors get real content instead of an empty <div id="root">.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const dist = join(root, 'dist')
const ssgDir = join(root, '.ssg')

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const template = await readFile(join(dist, 'index.html'), 'utf8')
const { render, routes, head } = await import(pathToFileURL(join(ssgDir, 'entry-server.js')).href)

function buildPage(url) {
  const { title, description } = head(url)
  const headHtml = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="website" />`,
  ].join('\n    ')

  return template.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', render(url))
}

const urls = routes()

for (const url of urls) {
  const outFile = url === '/' ? join(dist, 'index.html') : join(dist, url, 'index.html')
  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, buildPage(url), 'utf8')
}

// Fallback for unknown URLs on static hosts.
await writeFile(join(dist, '404.html'), buildPage('/this-route-does-not-exist'), 'utf8')

await rm(ssgDir, { recursive: true, force: true })

console.log(`prerendered ${urls.length} routes + 404.html`)

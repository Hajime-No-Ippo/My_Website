import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import type { Plugin } from 'vite'

const marked = new Marked(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

/**
 * Turns `*.md` imports into `{ slug, title, date, summary, html }`.
 *
 * The conversion happens at build time, so neither `marked` nor
 * `highlight.js` is ever shipped to the browser.
 */
export function markdown(): Plugin {
  return {
    name: 'blog-markdown',
    enforce: 'pre',
    async load(id) {
      const file = id.split('?')[0]
      if (!file.endsWith('.md')) return null

      const raw = await readFile(file, 'utf8')
      const { data, content } = matter(raw)
      const html = await marked.parse(content)

      const post = {
        slug: basename(file, '.md'),
        title: typeof data.title === 'string' ? data.title : basename(file, '.md'),
        date: typeof data.date === 'string' ? data.date : '',
        summary: typeof data.summary === 'string' ? data.summary : '',
        html,
      }

      return `export default ${JSON.stringify(post)}`
    },
  }
}

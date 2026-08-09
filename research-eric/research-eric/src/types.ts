export type Post = {
  slug: string
  title: string
  /** ISO date string, e.g. "2026-08-09". */
  date: string
  summary: string
  /** Rendered HTML, produced at build time by the markdown plugin. */
  html: string
}

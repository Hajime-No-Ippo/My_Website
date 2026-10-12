export type Post = {
  slug: string
  title: string
  /** Optional one-line subtitle rendered under the title. */
  subtitle?: string
  /** ISO date string, e.g. "2026-08-09". */
  date: string
  summary: string
  /** Rendered HTML, produced at build time by the markdown plugin. */
  html: string
}

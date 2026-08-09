import type { Post } from './types.ts'

const modules = import.meta.glob<{ default: Post }>('./posts/*.md', { eager: true })

/** Every post, newest first. */
export const posts: Post[] = Object.values(modules)
  .map((module) => module.default)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function formatDate(date: string): string {
  if (!date) return ''
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

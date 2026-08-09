import { Link } from 'react-router-dom'
import type { Post } from '../types.ts'
import { formatDate } from '../posts.ts'

export default function PostList({ items }: { items: Post[] }) {
  if (items.length === 0) {
    return <p className="post-summary">No posts yet.</p>
  }

  return (
    <ul className="post-list">
      {items.map((post) => (
        <li key={post.slug}>
          <Link to={`/blog/${post.slug}`} className="post-link">
            <span className="post-title">{post.title}</span>
            <time className="post-date" dateTime={post.date}>
              {formatDate(post.date)}
            </time>
            {post.summary && <span className="post-summary">{post.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  )
}

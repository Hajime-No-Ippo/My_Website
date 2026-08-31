import { Link, useParams } from 'react-router-dom'
import NotFound from './NotFound.tsx'
import WordFade from '../components/WordFade.tsx'
import { formatDate, getPost } from '../posts.ts'

export default function Post() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPost(slug) : undefined

  if (!post) return <NotFound />

  return (
    <WordFade>
      <article>
        <Link to="/blog" className="back-link">
          ← Writing
        </Link>

        <header className="post-header">
          <h1>{post.title}</h1>
          <time className="post-date" dateTime={post.date}>
            {formatDate(post.date)}
          </time>
        </header>

        {/* Markdown is converted to HTML at build time by plugins/markdown.ts,
            so this never renders untrusted input. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </WordFade>
  )
}

import { Link } from 'react-router-dom'
import PostList from '../components/PostList.tsx'
import WordFade from '../components/WordFade.tsx'
import { posts } from '../posts.ts'

export default function Home() {
  const recent = posts.slice(0, 5)

  return (
    <>
      {/* Replace this intro with your own — it is placeholder copy. */}
      <section className="intro">
        <WordFade as="h1" text="Eric Tao" />
        <WordFade
          as="p"
          text="I build full-stack applications and design the interfaces that go with them. This is where I write up what I am working on and what I learn along the way."
          delay={120}
        />
      </section>

      <p className="section-label">Writing</p>
      <PostList items={recent} />

      {posts.length > recent.length && (
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/blog">All {posts.length} posts →</Link>
        </p>
      )}
    </>
  )
}

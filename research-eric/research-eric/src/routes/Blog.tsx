import PostList from '../components/PostList.tsx'
import { posts } from '../posts.ts'

export default function Blog() {
  return (
    <>
      <section className="intro">
        <h1>Eric Tao</h1>
        <p>I’m an researcher and writer. I work on AI&ML and anti-hallucination at Maynooth University, helping improve model behavior. Previously, I worked on VLM & fine-tune on stable diffustion. I’ve been coding for 3 years.

          My life’s work is to make technology easy to access and more trust-worthy. I’m a young man at his 23 and a massive music fan.
          <br /><br />Sorry I may use translating tools in my post, I hope I can write more feeling in English.
        </p>
      </section>

      <PostList items={posts} />
    </>
  )
}

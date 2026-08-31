import { Link } from 'react-router-dom'
import WordFade from '../components/WordFade.tsx'

export default function NotFound() {
  return (
    <section className="notfound">
      <WordFade as="h1" text="Not found" />
      <p>
        That page does not exist. Try the <Link to="/blog">writing index</Link>.
      </p>
    </section>
  )
}

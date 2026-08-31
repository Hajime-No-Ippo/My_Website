import { Link } from 'react-router-dom'
import WordFade from '../components/WordFade.tsx'

export default function NotFound() {
  return (
    <WordFade>
      <section className="notfound">
        <h1>Not found</h1>
      <p>
        That page does not exist. Try the <Link to="/blog">writing index</Link>.
      </p>
      </section>
    </WordFade>
  )
}

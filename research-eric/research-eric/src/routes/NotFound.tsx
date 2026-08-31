import { Link } from 'react-router-dom'
import PageFade from '../components/PageFade.tsx'

export default function NotFound() {
  return (
    <PageFade>
      <section className="notfound">
        <h1>Not found</h1>
      <p>
        That page does not exist. Try the <Link to="/blog">writing index</Link>.
      </p>
      </section>
    </PageFade>
  )
}

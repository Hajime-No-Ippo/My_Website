import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="notfound">
      <h1>Not found</h1>
      <p>
        That page does not exist. Try the <Link to="/blog">writing index</Link>.
      </p>
    </section>
  )
}

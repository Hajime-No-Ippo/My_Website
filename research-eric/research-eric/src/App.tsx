import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.tsx'
import Home from './routes/Home.tsx'
import Blog from './routes/Blog.tsx'
import Post from './routes/Post.tsx'
import NotFound from './routes/NotFound.tsx'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Post />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

declare module '*.md' {
  import type { Post } from './types.ts'
  const post: Post
  export default post
}

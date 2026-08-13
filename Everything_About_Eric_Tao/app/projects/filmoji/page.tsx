import ProjectDetailPage from "../[slug]/page"

// Placeholder while the hand-built Filmoji page is designed: delegate to the
// generic project renderer so /projects/filmoji keeps working. This static
// segment overrides the [slug] route the moment it exists, so an empty file
// here breaks the route (and the build). Replace with the real page.
export default function FilmojiPage() {
  return ProjectDetailPage({ params: Promise.resolve({ slug: "filmoji" }) })
}

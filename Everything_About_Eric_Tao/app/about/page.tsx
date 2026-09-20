import { readFile } from "node:fs/promises"
import path from "node:path"
import About from "@/components/about"

// Same convention as app/projects/[slug]/page.tsx: a fixed content directory
// (so Next's file tracing doesn't have to bundle the whole project) and a
// plain-text source instead of editing the component's own code.
// content/about/sections.txt — one heading line per section, followed by its
// body (wrapping onto further lines is fine), each section separated by a
// blank line.
const CONTENT_DIR = path.join(process.cwd(), "content", "about")

async function loadAboutSections() {
  const source = await readFile(path.join(CONTENT_DIR, "sections.txt"), "utf8")
  return source
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const [heading, ...bodyLines] = block.trim().split("\n")
      return { heading: heading.trim(), body: bodyLines.join(" ").trim() }
    })
    .filter((section) => section.heading && section.body)
}

export default async function AboutPage() {
  // Falls back to an empty list rather than a 500 if the file's ever missing
  // or malformed — the rest of the page (hero, research blurb) still renders.
  const sections = await loadAboutSections().catch(() => [])

  return (
    <main>
      <About sections={sections} />
    </main>
  )
}

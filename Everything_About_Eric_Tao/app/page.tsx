import dynamic from "next/dynamic"
import Hero from "@/components/hero"

const ProjectGallery = dynamic(() => import("@/components/project-gallery"))
const Contact = dynamic(() => import("@/components/contact"))
const Slogan = dynamic(() => import("@/components/slogan"))
// const Illustration = dynamic(() => import("@/components/illustrates/illustrate"))

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <div className="h-px w-full bg-white/15" aria-hidden="true" />
      <Slogan />
      <div className="h-px w-full bg-white/15" aria-hidden="true" />
      <ProjectGallery />
      <Contact />
      {/* The left column and the form actually are equal height (verified:
          both 408px, stretched by the grid's default align-items) — this
          just makes that visible instead of leaving black-on-black ambiguous
          about where the section truly ends. */}
      <div className="h-px w-full bg-white/15" aria-hidden="true" />
    </main>
  )
}

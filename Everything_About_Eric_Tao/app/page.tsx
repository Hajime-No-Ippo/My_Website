import dynamic from "next/dynamic"
import Hero from "@/components/hero"

const ProjectGallery = dynamic(() => import("@/components/project-gallery"))
const Gallery = dynamic(() => import("@/components/gallery"))
const Contact = dynamic(() => import("@/components/contact"))

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <ProjectGallery />
      <Gallery />
      <section id="contact">
        <Contact />
      </section>
    </main>
  )
}

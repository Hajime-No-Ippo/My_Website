import Hero from "@/components/hero"
import ProjectGallery from "@/components/project-gallery"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"

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

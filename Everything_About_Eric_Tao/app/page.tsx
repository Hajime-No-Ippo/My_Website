import dynamic from "next/dynamic"
import Hero from "@/components/hero"

const ProjectGallery = dynamic(() => import("@/components/project-gallery"))
const Contact = dynamic(() => import("@/components/contact"))

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <ProjectGallery />
      <section id="contact">
        <Contact />
      </section>
    </main>
  )
}

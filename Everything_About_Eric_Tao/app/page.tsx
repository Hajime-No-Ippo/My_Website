import Hero from "@/components/hero"
import Gallery from "@/components/gallery"
import Contact from "@/components/contact"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Gallery />
      <section id="contact">
        <Contact />
      </section>
    </main>
  )
}


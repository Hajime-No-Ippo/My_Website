import About from "@/components/about"
import BackButton from "@/components/back-button"


export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8">
        <BackButton/>
      <section>
        <About />
      </section>
    </main>
  )
}

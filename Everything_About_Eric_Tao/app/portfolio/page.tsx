import type { Metadata } from "next"
import PortfolioContent from "@/components/portfolio-content"
import BackButton from "@/components/back-button"

export const metadata: Metadata = {
  title: "Portfolio | Chenming Tao",
  description: "View my work and projects",
}

export default function PortfolioPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <BackButton />
      <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>
      <PortfolioContent />
    </main>
  )
}


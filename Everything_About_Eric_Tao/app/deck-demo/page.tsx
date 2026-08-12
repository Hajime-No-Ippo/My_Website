import type { Metadata } from "next"
import Link from "next/link"
import PdfFlipbook, { type DeckManifest } from "@/components/pdf-flipbook"
import manifest from "@/data/decks/portfolio.json"

const deck = manifest as DeckManifest
const BASE_URL = `/decks/${deck.slug}`
const COVER = `${BASE_URL}/${deck.pages[0].files["1600"]}`

export const metadata: Metadata = {
  title: "Portfolio Deck — Eric Tao",
  description: "A 17-page design portfolio, readable as a flipbook.",
  openGraph: {
    title: "Portfolio Deck — Eric Tao",
    description: "A 17-page design portfolio, readable as a flipbook.",
    images: [COVER],
  },
}

export default function DeckDemoPage() {
  return (
    <div className="pb-16">
      <div className="container pt-8 sm:pt-12">
        <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to projects
        </Link>

        <div className="mt-6 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Document</p>
          <h1 className="mt-3 font-saffron text-3xl font-bold sm:text-4xl">Portfolio Deck</h1>
          <p className="mt-3 text-muted-foreground">
            Selected design work, laid out as a print deck. Drag a corner, use the arrow keys, or grab the PDF.
          </p>
        </div>
      </div>

      <div className="container mt-8">
        <PdfFlipbook
          manifest={deck}
          baseUrl={BASE_URL}
          pdfUrl={`${BASE_URL}/portfolio.pdf`}
          title="Portfolio Deck"
          className="rounded-2xl border border-border/70 bg-muted/20 p-4 sm:p-6"
        />
      </div>

      <div className="container mt-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-3">
            <h2 className="font-saffron text-lg font-semibold">About this deck</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              A print-format portfolio covering layout, branding, and interface work. Each page is a full composition,
              so it reads one page at a time rather than being broken up into a scroll.
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-muted/30 p-4 sm:p-5">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Pages</p>
                <p className="mt-1 text-foreground">{deck.pageCount}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Format</p>
                <p className="mt-1 text-foreground">4:3 landscape</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-[#E77421]/80">Tools</p>
                <p className="mt-1 text-foreground">Adobe InDesign, Illustrator, Photoshop</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import Contact from "@/components/contact"

import Image from "next/image"

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Same photo as the old Experience page's opening section (now
          removed) — image only, no heading/badges/overlay carried over, just
          a full-bleed banner square-cornered to match this site's convention. */}
      <div className="relative h-[45vh] w-full overflow-hidden sm:h-[55vh]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05c67409242633d69fb4a3c20b0ad20.jpg-JBbs7LmOKOsn9yYNlE9eRZEK8MN5uH.jpeg"
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Same resting-state overlay as that old photo (bg-black/40) — it
            also darkened further on hover, but there's no hover-revealed
            content here to justify that. */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <Contact />

      {/* Dublin, roughly — OpenStreetMap's embed needs no API key/token.
          grayscale+invert is the standard trick for making a bright map tile
          read dark, to match the rest of the site instead of sitting as a
          bright rectangle in it; marker/water colours shift as a side effect,
          which is fine for "roughly render Dublin" rather than a precise pin.
          pointer-events-none: it's decorative, not a real interactive map —
          without it, scrolling the page while the cursor happens to be over
          it gets captured as map zoom instead. */}
      <div className="relative h-[45vh] w-full overflow-hidden sm:h-[55vh]">
        <iframe
          title="Map showing Dublin, Ireland"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-6.40%2C53.28%2C-6.05%2C53.42&layer=mapnik&marker=53.3498%2C-6.2603"
          className="h-full w-full border-0 pointer-events-none grayscale invert contrast-[.85]"
          loading="lazy"
        />
      </div>
    </main>
  )
}

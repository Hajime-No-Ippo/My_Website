"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// LABASAD's contact form: a plain grid, no per-field borders — the grid
// lines themselves do that job (container owns top/left, each cell owns
// right/bottom, same rule as the project gallery's grid). Labels live as the
// input's own placeholder. Colours inverted from the reference (white on
// black there) to match this site's own black ground: black fill, white
// border and text.
//
// Border is a mid-grey, not white/25: the browser's own autofill highlight
// (or the focus tint) paints the field a near-white background, and a
// white/25 line reads as invisible against near-white — grey holds up on
// both the black default and the light filled/autofilled state.
const cellClass =
  "w-full border-b border-r border-neutral-500 bg-transparent px-6 py-5 text-lg text-white outline-none placeholder:uppercase placeholder:tracking-wide placeholder:text-white/40 focus:bg-white/5"

export default function Contact() {
  const [forename, setForename] = useState("")
  const [lastname, setLastname] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = `${forename.trim()} ${lastname.trim()}`.trim()
    if (!name || !email.trim() || !message.trim()) {
      setStatus("error")
      return
    }

    setStatus("sending")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
      setForename("")
      setLastname("")
      setEmail("")
      setPhone("")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <>
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

      {/* Full-bleed split, same convention as the project gallery: no
          `container` here, so the right column's own grid runs edge to edge. */}
      <section id="contact" className="bg-black py-16 md:py-24">
      {/* Top and bottom borders live on this outer wrapper, spanning BOTH
          columns full-width — they were on the form alone before, so the
          line only ran under the right half and the box read as unenclosed
          (no top edge on desktop, no seam closing the left column at all). */}
      <div className="grid grid-cols-1 border-b border-t border-white/25 lg:grid-cols-2">
        <motion.div
          className="flex items-start px-6 py-12 sm:px-10 lg:py-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-left text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
            Feel free to reach out to me!
          </h2>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-black lg:border-l lg:border-white/25"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <input
              placeholder="Forename*"
              className={cellClass}
              value={forename}
              onChange={(event) => setForename(event.target.value)}
              required
            />
            <input
              placeholder="Lastname*"
              className={cellClass}
              value={lastname}
              onChange={(event) => setLastname(event.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2">
            <input
              type="email"
              placeholder="E-mail*"
              className={cellClass}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              className={cellClass}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          <textarea
            placeholder="Message*"
            rows={6}
            className={cn(cellClass, "block resize-none")}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />

          <button
            type="submit"
            disabled={status === "sending"}
            className="relative block w-full overflow-hidden border-b border-r border-white/25 bg-white/10 px-6 py-4 text-left text-lg text-white transition-colors hover:bg-white/20 disabled:cursor-wait"
          >
            {/* The loading cue is just this bar — label always reads
                "Submit", never swaps to borrowed SENTINEL wording like
                "Extracting…" out of context. Approaches but never quite
                reaches 100% while actually sending, since we don't know the
                real duration; snaps to 0 the moment status resolves. Brand
                orange, same as the Hero CTA and the active nav state. */}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-y-0 left-0 bg-[#E77421] ease-linear",
                status === "sending" ? "w-[92%] transition-[width] duration-[3000ms]" : "w-0 transition-none",
              )}
            />
            <span className="relative">Submit</span>
          </button>

          {status === "success" && (
            <p className="border-b border-r border-white/25 bg-black px-6 py-3 text-sm text-emerald-400">
              Thanks — your message was sent.
            </p>
          )}
          {status === "error" && (
            <p className="border-b border-r border-white/25 bg-black px-6 py-3 text-sm text-red-400">
              Sorry, something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
      </section>

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
    </>
  )
}

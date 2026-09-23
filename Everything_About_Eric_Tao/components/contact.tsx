"use client"

import { useState } from "react"
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
      {/* Full-bleed split, same convention as the project gallery: no
          `container` here, so the right column's own grid runs edge to edge.
          No py-* here any more — it left visible empty black space between
          this section's bordered box and the photo/map blocks flanking it
          on the contact page, reading as a gap between the three. */}
      <section id="contact" className="bg-black">
        {/* Top and bottom borders live on this outer wrapper, spanning BOTH
          columns full-width — they were on the form alone before, so the
          line only ran under the right half and the box read as unenclosed
          (no top edge on desktop, no seam closing the left column at all). */}
        <div className="grid grid-cols-1 border-b border-t border-white/25 lg:grid-cols-2">
          {/* Success/error feedback both live here now, not as a line under
              the form that pushed the button down when it appeared — the
              whole left panel floods a colour and the title itself swaps to
              the message, the same "flood the block" language the project
              gallery/cards use on hover elsewhere on the site. */}
          <motion.div
            className={cn(
              "flex items-start px-6 py-12 transition-colors duration-500 sm:px-10 lg:py-16",
              status === "success" && "bg-[#E77421]",
              status === "error" && "bg-red-600",
              status !== "success" && status !== "error" && "bg-black",
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className={cn(
                "text-left text-3xl font-normal transition-colors duration-500 sm:text-4xl lg:text-5xl",
                status === "success" ? "text-black" : "text-white",
              )}
            >
              {status === "success" && "Thanks — your message was sent!"}
              {status === "error" && "Sorry, something went wrong. Please try again."}
              {status !== "success" && status !== "error" && "Feel free to reach out to me!"}
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

          </motion.form>
        </div>
      </section>

    </>
  )
}

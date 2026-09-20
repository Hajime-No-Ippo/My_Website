"use client"

import type { CSSProperties, MouseEvent } from "react"
import { motion } from "framer-motion"
import { Logo } from "@/components/logo"

/** Moves the cursor-follow point for the logo's liquid-fill hover (below). */
function trackLogoCursor(event: MouseEvent<HTMLDivElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty("--mx", `${((event.clientX - rect.left) / rect.width) * 100}%`)
  event.currentTarget.style.setProperty("--my", `${((event.clientY - rect.top) / rect.height) * 100}%`)
}

const SECTIONS = [
  {
    heading: "Not only developer but also designer",
    body: "I have a dual background in Art & Design and Computer Science. This allows me to bridge the gap between user experience and engineering. I build full-stack applications and also design the interfaces people interact with. My work combines system thinking, UX reasoning, and modern web development.",
  },
  {
    heading: "My Further Study",
    body: "I'm further studying CNN / RNN artificial intelligence and fine-tuning local large language models.",
  },
]

export default function About() {
  return (
    // Same Swiss/full-bleed convention as the contact section: black ground,
    // a big title on its own, content stacked below as bordered rows instead
    // of one card — the container owns the top/left edge, each row owns its
    // own bottom, so the whole page is really the same divide-line language
    // used everywhere else on the site.
    <div className="bg-black text-white">
      <div className="border-l border-t border-white/25">
        <motion.div
          className="grid grid-cols-1 gap-6 border-b border-r border-white/25 px-6 py-16 sm:px-10 sm:py-20 md:grid-cols-3 md:gap-10 md:min-h-[calc(100vh/3)] lg:px-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col justify-center md:col-span-2">
            <p className="text-sm uppercase tracking-[0.2em] text-[#E77421]">About</p>
            <h1 className="mt-4 text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">Hi, I am Eric Tao</h1>
            <p className="mt-4 max-w-none text-xl text-white/70 sm:text-2xl">
              I am a Software Development student at Maynooth University. I combine my background in Art &amp; Design
              with software engineering to create applications with both a strong technical foundation and an excellent
              user experience.
            </p>
          </div>
          {/* 3rd column: a square tile, sized off its own column width —
              that makes it the tallest column, so it drives the row's height
              directly. `-my-20` then cancels the row's own vertical padding
              on this cell only, so its border-l reaches the row's true
              top/bottom edges (shared with the border-t above and this
              row's own border-b) instead of stopping at the padding line. */}
          <div
            className="relative aspect-square md:-my-20 md:border-l md:border-white/25"
            onMouseMove={trackLogoCursor}
            onMouseEnter={(event) => event.currentTarget.style.setProperty("--logo-fill", "42%")}
            onMouseLeave={(event) => event.currentTarget.style.setProperty("--logo-fill", "0%")}
            style={{ "--mx": "50%", "--my": "50%", "--logo-fill": "0%" } as CSSProperties}
          >
            <div className="flex h-full w-full items-center justify-center p-10 sm:p-12 lg:p-16">
              <div className="relative h-full w-full">
                <Logo strokeWidth={0.5} className="absolute inset-0 h-full w-full text-white" />
                {/* Orange layer, revealed through a radial mask centred on the
                    cursor. `--logo-fill` is registered in globals.css as an
                    animatable <percentage>, so its stop can transition on
                    hover in/out — a liquid fill following the pointer rather
                    than a flat colour swap. */}
                <Logo
                  strokeWidth={0.5}
                  className="absolute inset-0 h-full w-full text-[#E77421]"
                  style={
                    {
                      transition:
                        "--logo-fill 600ms cubic-bezier(0.22, 1, 0.36, 1), --mx 200ms ease-out, --my 200ms ease-out",
                      WebkitMaskImage:
                        "radial-gradient(circle at var(--mx) var(--my), black 0%, black var(--logo-fill), transparent calc(var(--logo-fill) + 18%))",
                      maskImage:
                        "radial-gradient(circle at var(--mx) var(--my), black 0%, black var(--logo-fill), transparent calc(var(--logo-fill) + 18%))",
                    } as CSSProperties
                  }
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title left, content right from here down — was heading-then-
            paragraph stacked in one column, which read cramped and small.
            md:grid-cols-[1fr_2fr]: title gets a third, content gets the
            rest, so the (now much bigger) body text has real room. */}
        {SECTIONS.map((section, index) => (
          <motion.section
            key={section.heading}
            className="grid grid-cols-1 gap-3 border-b border-r border-white/25 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[1fr_2fr] md:gap-10 lg:px-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <h2 className="text-2xl font-normal sm:text-3xl">{section.heading}</h2>
            <p className="text-xl text-white/70 sm:text-2xl">{section.body}</p>
          </motion.section>
        ))}

        <motion.section
          className="grid grid-cols-1 gap-3 border-b border-r border-white/25 px-6 py-10 sm:px-10 sm:py-12 md:grid-cols-[1fr_2fr] md:gap-10 lg:px-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * (SECTIONS.length + 1) }}
        >
          <h2 className="text-2xl font-normal sm:text-3xl">If you&apos;re curious about my research</h2>
          <a
            href="https://blog.ericdesign.uk/"
            className="inline-block w-fit text-xl text-[#E77421] underline-offset-4 hover:underline sm:text-2xl"
          >
            https://blog.ericdesign.uk/
          </a>
        </motion.section>
      </div>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"

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
      <motion.div
        className="px-6 pt-16 sm:px-10 sm:pt-20 lg:px-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm uppercase tracking-[0.2em] text-[#E77421]">About</p>
        <h1 className="mt-4 text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">Hi, I am Eric Tao</h1>
        <p className="mt-4 max-w-2xl text-lg text-white/70 sm:text-xl">
          I am a Software Development student at Maynooth University. I combine my background in Art &amp; Design
          with software engineering to create applications with both a strong technical foundation and an excellent
          user experience.
        </p>
      </motion.div>

      <div className="mt-12 border-l border-t border-white/25 sm:mt-16">
        {SECTIONS.map((section, index) => (
          <motion.section
            key={section.heading}
            className="border-b border-r border-white/25 px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
          >
            <h2 className="text-2xl font-normal sm:text-3xl">{section.heading}</h2>
            <p className="mt-3 max-w-2xl text-base text-white/70 sm:text-lg">{section.body}</p>
          </motion.section>
        ))}

        <motion.section
          className="border-b border-r border-white/25 px-6 py-10 sm:px-10 sm:py-12 lg:px-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 * (SECTIONS.length + 1) }}
        >
          <h2 className="text-2xl font-normal sm:text-3xl">If you&apos;re curious about my research</h2>
          <a
            href="https://blog.ericdesign.uk/"
            className="mt-3 inline-block text-base text-[#E77421] underline-offset-4 hover:underline sm:text-lg"
          >
            https://blog.ericdesign.uk/
          </a>
        </motion.section>
      </div>
    </div>
  )
}

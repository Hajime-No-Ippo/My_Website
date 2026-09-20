"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

// One line, six languages — the rotation below cycles through this array,
// wrapping back to the start. Edit or reorder translations here only.
const SLOGANS: { text: string }[] = [
  {
    text: "複雑な課題を、人が思わず使いたくなるインターフェースに変える。数千ページの法規制を読み解くAI法律テックから、ただ楽しいからという理由で作ったツールまで。以下のプロジェクトはすべて、意味があって世に出したものです。",
  },
  {
    text: "我把複雜的問題變成人們真正願意使用的介面——從能梳理成千上萬頁法規的 AI 法律科技，到純粹因為有趣而做的小工具。下面的每一個項目都真實上線，而且都有存在的理由。",
  },
  {
    text: "Convierto problemas complejos en interfaces que a la gente realmente le gusta usar: desde tecnología legal con IA que analiza miles de páginas de normativa, hasta herramientas divertidas creadas solo porque sí. Cada proyecto de abajo se lanzó, y se lanzó por una razón.",
  },
  {
    text: "Je transforme des problèmes complexes en interfaces que les gens aiment vraiment utiliser — d'une legal-tech IA qui analyse des milliers de pages de réglementation, à des outils ludiques créés juste pour le plaisir. Chaque projet ci-dessous a été lancé, et lancé pour une raison.",
  },
  {
    text: "Jag förvandlar komplexa problem till gränssnitt som folk faktiskt gillar att använda — från AI-juridikteknik som kartlägger tusentals sidor lagtext, till lekfulla verktyg byggda bara för skojs skull. Varje projekt här nedan lanserades, och lanserades av en anledning.",
  },
  {
    text: "I turn complex problems into interfaces people actually enjoy using — from AI legal-tech that maps a thousand pages of regulation, to playful tools built just because. Every project below shipped, and shipped for a reason.",
  },
]

/** How long each language stays on screen before the next fades in. */
const ROTATE_MS = 4800

/** Fisher-Yates — an unbiased shuffle of the play order, not just Math.random() sort. */
function shuffledIndices(length: number) {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export default function Slogan() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [index, setIndex] = useState(0)
  // A ref, not state: read live inside the interval's closure below without
  // needing to tear down and rebuild the interval on every hover in/out.
  const isPausedRef = useRef(false)

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    // Same fade-on-scroll convention as the project gallery below it: play
    // once, the moment the section is actually about to enter view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0, rootMargin: "0px 0px -100px 0px" },
    )

    const section = sectionRef.current
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  // Only rotates once the section has actually entered view — no point
  // burning through languages while it's still off-screen at opacity 0.
  // Shuffled, not sequential: a fresh random order each lap through all
  // seven, reshuffling once it runs out — plain Math.random() per tick
  // would let the same language repeat back-to-back far too often.
  useEffect(() => {
    if (!isVisible) return

    let order = shuffledIndices(SLOGANS.length)
    let pos = 0

    const id = setInterval(() => {
      // Hovered: leave the current language on screen and skip this tick
      // rather than clearing the interval — it just picks back up on its
      // regular clock once the pointer leaves.
      if (isPausedRef.current) return

      if (pos >= order.length) {
        const next = shuffledIndices(SLOGANS.length)
        // Never let the reshuffle's first pick repeat the lap's last one.
        if (next[0] === order[order.length - 1]) {
          next.push(next.shift() as number)
        }
        order = next
        pos = 0
      }
      setIndex(order[pos])
      pos += 1
    }, ROTATE_MS)

    return () => clearInterval(id)
  }, [isVisible])

  return (
    <section ref={sectionRef} className="bg-black py-40 sm:py-38">
      {/* Fixed height, sized for the longest-wrapping language at each
          breakpoint, with the text vertically centered inside it — a
          language swap changes line count (CJK wraps far tighter than the
          Latin-script ones), so without this the section's own height
          reflowed on every rotation, shunting the gallery below up and
          down. */}
      <div className="container flex min-h-[40rem] items-center justify-center sm:min-h-[24rem] lg:min-h-[29rem]">
        {/* Pause trigger lives on the rendered text itself, not the whole
            padded section — hovering the empty black margin around it
            shouldn't freeze the rotation. */}
        <p
          onMouseEnter={() => {
            isPausedRef.current = true
          }}
          onMouseLeave={() => {
            isPausedRef.current = false
          }}
          className={cn(
            "mx-auto max-w-4xl text-center text-2xl font-normal leading-loose text-white transition-all duration-700 ease-out sm:text-4xl lg:text-5xl",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
          )}
        >
          {/* Keyed on index: a language swap is a new DOM node, so the
              fade-in-up entrance replays on every rotation for free instead
              of needing separate swap-transition state. */}
          <span key={index} className="inline-block animate-fade-in-up motion-reduce:animate-none">
            {SLOGANS[index].text}
          </span>
        </p>
      </div>
    </section>
  )
}

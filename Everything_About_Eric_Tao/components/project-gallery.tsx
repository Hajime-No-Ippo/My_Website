"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { projects, type Project, type ProjectCategory } from "@/data/projects"
import { CurtainLink, curtainFor } from "@/components/curtain"
import { cn } from "@/lib/utils"

type Filter = "All" | ProjectCategory

// Derived from the data so a new category can never go missing from the nav.
const CATEGORIES: Filter[] = ["All", ...Array.from(new Set(projects.map((item) => item.category)))]

// Entry stagger. Capped so the grid's total animation stays constant no matter
// how many projects it grows to.
const STAGGER_MS = 60
const MAX_STAGGERED_CARDS = 6

/** Technologies is a prose list; the card shows only the head of it. */
const TECH_SHOWN = 3

/**
 * Column count, mirroring the grid's own breakpoints below.
 *
 * Needed because a partly-filled last row leaves the frame hanging open on the
 * right, and closing it means knowing how many cells are missing — something
 * CSS cannot count. Starts null so server and first client render agree; the
 * fillers are decorative, so arriving a tick later costs nothing.
 */
function useColumns() {
  const [columns, setColumns] = useState<number | null>(null)

  useEffect(() => {
    // Absent in jsdom, and the fillers are decorative — leaving columns null
    // simply renders none, which is the correct degradation.
    if (typeof window.matchMedia !== "function") return

    const wide = window.matchMedia("(min-width: 1024px)") // lg:grid-cols-3
    const medium = window.matchMedia("(min-width: 640px)") // sm:grid-cols-2
    const read = () => setColumns(wide.matches ? 3 : medium.matches ? 2 : 1)

    read()
    wide.addEventListener("change", read)
    medium.addEventListener("change", read)
    return () => {
      wide.removeEventListener("change", read)
      medium.removeEventListener("change", read)
    }
  }, [])

  return columns
}

function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>("All")
  const [isVisible, setIsVisible] = useState(false)
  const columns = useColumns()
  const filteredItems = filter === "All" ? projects : projects.filter((item) => item.category === filter)

  // Empty cells completing the last row, so the outer frame closes instead of
  // trailing off. Zero when the row already divides evenly.
  const fillerCount = columns ? (columns - (filteredItems.length % columns)) % columns : 0

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )

    // Captured now: by cleanup time the ref may already point elsewhere.
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

  return (
    // Black ground with white rules — the grid is drawn in light on dark, so
    // the dividers read as the structure rather than as boxes around content.
    // Colours are hard-coded rather than themed: this section stays black in
    // either theme.
    <section
      id="project-gallery"
      ref={sectionRef}
      className={cn(
        "relative bg-black text-white transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="container py-16">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/25 pb-6 md:flex-row md:items-end">
          <h2 className="font-saffron text-3xl font-bold text-white">Project Gallery</h2>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 font-mono text-xs uppercase tracking-[0.2em]">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                aria-pressed={filter === category}
                className={cn(
                  "transition-colors hover:text-[#E77421]",
                  filter === category ? "text-[#E77421]" : "text-white/55",
                )}
                onClick={() => setFilter(category)}
              >
                {category === "All" ? "All Works" : category}
              </button>
            ))}
          </nav>
        </div>

        {/* The grid rules are drawn by the cells themselves: the container owns
            the top and left edge, each cell owns its right and bottom. That
            yields single-width dividers at every seam and a closed outer frame,
            at any column count — no doubled borders to compensate for. */}
        <div
          key={filter}
          className="grid grid-cols-1 border-l border-t border-white/25 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredItems.map((item, index) => (
            <ProjectCard
              key={item.id}
              item={item}
              index={index}
              delayMs={Math.min(index, MAX_STAGGERED_CARDS) * STAGGER_MS}
            />
          ))}

          {Array.from({ length: fillerCount }, (_, index) => (
            <div key={`filler-${index}`} aria-hidden="true" className="border-b border-r border-white/25" />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <p className="border-b border-l border-r border-white/25 px-5 py-10 text-center font-mono text-xs uppercase tracking-[0.2em] text-white/45">
            No projects in this category
          </p>
        )}
      </div>
    </section>
  )
}

/**
 * Projects carrying their own accent get the branded route curtain; the rest
 * navigate normally. Same markup either way — only the link component differs.
 */
function ProjectCard({ item, index, delayMs }: { item: Project; index: number; delayMs: number }) {
  const href = `/projects/${item.slug}`
  const shared = {
    "aria-label": `${item.title} — ${item.description}`,
    className:
      "group flex flex-col border-b border-r border-white/25 animate-fade-in-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421] focus-visible:ring-inset",
    // Clamped: an unbounded index * delay makes the tail of the grid lag
    // further behind with every project added.
    style: { animationDelay: `${delayMs}ms` },
  }

  const tech = item.technologies
    .split(",")
    .slice(0, TECH_SHOWN)
    .map((entry) => entry.trim())
    .join(" · ")

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Metadata sits in the layout rather than behind a hover overlay. Touch
          devices have no hover state, so an overlay-only title left every card
          on a phone as an unlabelled image. */}
      <div className="flex flex-1 flex-col border-t border-white/25 p-5">
        <div className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{item.category}</span>
        </div>

        <h3 className="mt-3 font-saffron text-xl font-bold leading-tight text-white transition-colors group-hover:text-[#E77421]">
          {item.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{item.description}</p>

        {/* mt-auto: descriptions differ in length, so without this the tech
            line floats at a different height in every cell of a row. Pinning
            it to the bottom gives the row a shared baseline. */}
        <p className="mt-auto pt-6 font-mono text-[11px] leading-relaxed text-white/45">{tech}</p>

        {/* Site accent, not the project's own — a project's colour belongs to
            its page, not to how it is listed elsewhere. */}
        <span
          aria-hidden="true"
          className="mt-4 h-0.5 w-full origin-left scale-x-0 bg-[#E77421] transition-transform duration-300 group-hover:scale-x-100"
        />
      </div>
    </>
  )

  // A route with no registered curtain simply navigates.
  const visual = curtainFor(href)

  if (visual && item.accent) {
    return (
      <CurtainLink href={href} accent={item.accent} word={item.title} visual={visual} {...shared}>
        {body}
      </CurtainLink>
    )
  }

  return (
    <Link href={href} {...shared}>
      {body}
    </Link>
  )
}

export default ProjectGallery

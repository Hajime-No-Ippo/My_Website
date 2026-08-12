"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { projects, type Project, type ProjectCategory } from "@/data/projects"
import { CurtainLink } from "@/components/route-curtain"
import { cn } from "@/lib/utils"

type Filter = "All" | ProjectCategory

// Derived from the data so a new category can never go missing from the nav.
const CATEGORIES: Filter[] = ["All", ...Array.from(new Set(projects.map((item) => item.category)))]

// Entry stagger. Capped so the row's total animation stays constant no matter
// how many projects the gallery grows to.
const STAGGER_MS = 60
const MAX_STAGGERED_CARDS = 6

function ProjectGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>("All")
  const [isVisible, setIsVisible] = useState(false)
  const filteredItems = filter === "All" ? projects : projects.filter((item) => item.category === filter)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
  }, [filter])

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

  // Wheel interception removed so page scroll behaves normally.

  return (
    <section
      id="project-gallery"
      ref={sectionRef}
      className={cn(
        "relative bg-background transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 font-saffron">Project Gallery</h2>
          <nav className="flex gap-8 text-sm">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={cn(
                  "hover:text-[#E77421] transition-colors",
                  filter === category ? "text-[#E77421]" : "",
                )}
                onClick={() => setFilter(category)}
              >
                {category === "All" ? "ALL WORKS" : category}
              </button>
            ))}
          </nav>
        </div>

        <div
          ref={scrollRef}
          className="w-full h-[300px] rounded-lg overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {/* Keyed on the filter so React remounts the list and the entry
              animation replays every time — in both directions, and without
              tracking which ids were on screen a moment ago. */}
          <div key={filter} className="relative flex h-full gap-10 px-2 w-max items-start pt-2">
            {filteredItems.map((item, index) => (
              <ProjectCard
                key={item.id}
                item={item}
                delayMs={Math.min(index, MAX_STAGGERED_CARDS) * STAGGER_MS}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Projects carrying their own accent get the branded route curtain; the rest
 * navigate normally. Same markup either way — only the link component differs.
 */
function ProjectCard({ item, delayMs }: { item: Project; delayMs: number }) {
  const href = `/projects/${item.slug}`
  const shared = {
    "aria-label": `${item.title} — ${item.description}`,
    className:
      "relative shrink-0 block w-[320px] h-[210px] md:w-[380px] md:h-[250px] animate-fade-in-up motion-reduce:animate-none focus-visible:outline-none focus-visible:ring-2",
    // Clamped: an unbounded index * delay makes the tail of the row lag
    // further behind with every project added.
    style: { animationDelay: `${delayMs}ms` },
  }

  const body = (
    <div className="relative w-full h-full overflow-hidden group">
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 320px, 380px"
        className="object-cover transition-all duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="text-white text-center p-4">
          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-sm">{item.description}</p>
        </div>
      </div>
      {/* Site accent, not the project's own — a project's colour belongs to
          its page, not to how it is listed elsewhere. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#E77421] transition-transform duration-300 group-hover:scale-x-100"
      />
    </div>
  )

  if (item.accent) {
    return (
      <CurtainLink href={href} accent={item.accent} word={item.title} {...shared}>
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

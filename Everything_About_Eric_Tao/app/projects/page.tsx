import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { accentOf, projects, textOn, type Project } from "@/data/projects"
import { CurtainLink, curtainFor } from "@/components/curtain"

export default function ProjectsPage() {
  return (
    <div className="bg-black text-white">
      {/* Sidebar + content, not a 3-column grid with a row-spanning header:
          `grid-row: 1 / -1` on an item only reaches the grid's EXPLICIT rows.
          This grid never declares `grid-template-rows` — its rows are all
          auto-generated as project cards overflow — so `-1` resolved to
          whatever row existed when the browser first laid the header out, not
          the true last row. The header's box came out far shorter than the
          project list, leaving column 1 open on later rows, so a project
          card got auto-placed into "the title's" column — the exact bug
          being fixed here. A flex sidebar has no such implicit-row pitfall:
          the header is just sticky within its own flex item's height. */}
      <div className="flex flex-col border-l border-t border-white/25 lg:flex-row">
        {/* Static now — no cover photo, no hover reveal. lg:top-28 clears
            the navbar's own height (NAVBAR_HEIGHT in navbar.tsx — keep these
            in sync); still sticky, just no longer interactive itself. The
            hover-flood language moved onto each project card below instead. */}
        <div
          className="flex w-full flex-col justify-center border-b border-white/25 p-8 text-black sm:p-12 lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)] lg:w-1/3 lg:self-start lg:border-b-0 lg:border-r lg:p-14"
          style={{ backgroundColor: "#E77421" }}
        >
          <p className="text-sm uppercase tracking-[0.2em] text-black/70">Selected work</p>
          <h1 className="mt-4 text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl">
            Projects &amp; Experiments
          </h1>
          {/* text-lg/2xl/3xl = 18/24/30px, exactly half the h1's 36/48/60px
              at each breakpoint. */}
          <p className="mt-4 max-w-sm text-lg text-black/80 sm:text-2xl lg:text-3xl">
            Recent frontend, product, and full-stack builds — filter by craft on any one of them to see more like
            it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:w-2/3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const href = `/projects/${project.slug}`
  const visual = curtainFor(href)
  const accent = accentOf(project)
  const onAccent = textOn(accent)

  // Image only by default — the same hover-flood language that used to live
  // on the header (colour floods in, title/description/category reveal on
  // top of it) now lives on each card instead, one per project.
  const body = (
    <div className="relative aspect-[4/3] overflow-hidden border-b border-r border-white/25 bg-white/5">
      <Image
        src={project.image || "/placeholder.svg"}
        alt={project.title}
        fill
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 flex flex-col p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: accent, color: onAccent }}
      >
        {/* Top-aligned, not bottom: title and description now share one
            size, so title/description/category no longer read as a single
            descending hierarchy — top-anchoring the text block and pinning
            category to the opposite corner keeps them visually distinct. */}
        <h2 className="text-2xl font-normal sm:text-3xl">{project.title}</h2>
        <p className="mt-2 text-2xl font-normal sm:text-3xl" style={{ color: `${onAccent}cc` }}>
          {project.description}
        </p>
        {/* Arrow only, no "View project" label — the link's own aria-label
            already carries the accessible name. Oversized and bottom-left,
            balancing the category pinned bottom-right on the same row. */}
        <div className="mt-auto flex items-end justify-between">
          {/* 4x the original 48/56px = 192/224px. The glyph itself isn't
              centred in its own viewBox (empty space top/left of the
              diagonal stroke) — the negative margin pulls the drawn arrow
              flush to the edge, not just its bounding box. */}
          {/* strokeLinejoin="round" keeps the arrowhead's own bend curved;
              strokeLinecap="square" is the part that changes — the open
              ends of the shaft and each chevron stroke now cut off flat
              instead of Lucide's default rounded caps. */}
          <ArrowRight
            aria-hidden="true"
            strokeWidth={0.5}
            strokeLinecap="square"
            strokeLinejoin="round"
            className="-ml-8 h-48 w-48 shrink-0 transition-transform group-hover:translate-x-2 sm:-ml-9 sm:h-56 sm:w-56"
          />
          <p className="text-base uppercase tracking-[0.2em]" style={{ color: `${onAccent}99` }}>
            {project.category}
          </p>
        </div>
      </div>
    </div>
  )

  const shared = {
    "aria-label": `${project.title} — ${project.description}`,
    className: "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421] focus-visible:ring-inset",
  }

  if (visual && project.accent) {
    return (
      <CurtainLink href={href} accent={project.accent} word={project.title} visual={visual} {...shared}>
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

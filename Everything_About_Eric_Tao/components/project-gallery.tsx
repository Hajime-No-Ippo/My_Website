"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { accentOf, projects, textOn, type Project, type ProjectCategory } from "@/data/projects"
import { CurtainLink, curtainFor } from "@/components/curtain"
import { cn } from "@/lib/utils"

type Filter = "All" | ProjectCategory

// Derived from the data so a new category can never go missing from the nav.
const CATEGORIES: Filter[] = ["All", ...Array.from(new Set(projects.map((item) => item.category)))]

// Entry stagger. Capped so the grid's total animation stays constant no matter
// how many projects it grows to.
const STAGGER_MS = 60
const MAX_STAGGERED_CARDS = 6

/**
 * Project pairs (colour panel + image) per row, mirroring the grid's own
 * lg breakpoint below. Needed for the same reason the old column-count hook
 * was: a lone trailing pair on desktop otherwise leaves the row's right edge
 * open instead of closed by a filler.
 */
function usePairsPerRow() {
  const [pairs, setPairs] = useState<number | null>(null)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return

    const wide = window.matchMedia("(min-width: 1024px)") // lg:grid-cols-4 → 2 pairs/row
    const read = () => setPairs(wide.matches ? 2 : 1)

    read()
    wide.addEventListener("change", read)
    return () => wide.removeEventListener("change", read)
  }, [])

  return pairs
}

function ProjectGallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<Filter>("All")
  const [isVisible, setIsVisible] = useState(false)
  const pairsPerRow = usePairsPerRow()
  const filteredItems = filter === "All" ? projects : projects.filter((item) => item.category === filter)

  // A lone trailing pair on a 2-pairs-per-row layout leaves the frame open on
  // the right; one filler pair (2 cells) closes it. Never needed at 1 pair/row.
  const needsFillerPair = pairsPerRow === 2 && filteredItems.length % 2 !== 0

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
      // threshold must stay 0. It is a fraction of THIS element, and the grid
      // is far taller than a phone viewport — 7 stacked cards run ~3500px, so
      // the ratio tops out around 0.19 and a 0.15 threshold sits right on the
      // edge, never firing at all on a shorter screen. The section then stayed
      // at opacity 0 forever and the whole gallery read as missing.
      // rootMargin gives the "scrolled into view" feel instead, and it is
      // measured in pixels, so it cannot drift as projects are added.
      { threshold: 0, rootMargin: "0px 0px -120px 0px" },
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
      {/* Full-bleed like every other section header on the site now (contact,
          the /projects listing) — was `container`-constrained while the grid
          right below it already ran edge to edge, so the title read
          noticeably narrower than everything around it.
          No horizontal padding on this wrapper any more (only the vertical
          pt-8/sm:pt-10, still matching the footer's own top padding) — the
          navbar's own grid is unpadded too (see its comment in navbar.tsx),
          so its column boundaries land at true fractions of the viewport.
          Padding this wrapper insets THIS grid's own boundaries instead,
          which is exactly what drifted this header's divider away from the
          navbar's — the edge inset now lives on h2 (left) and nav (right)
          below instead, so it never touches the column math. */}
      <div className="pt-8 sm:pt-10">
        {/* Below md, flex-wrap packed two-ish-per-line at uneven widths —
            one category's width didn't line up with the next, reading as
            broken rather than intentional. Stacked, one per row with its
            own divider (same idea as a plain list) instead. From md up,
            same 6-column grid the navbar uses: title takes the left 2
            columns, and the 4 categories fall into the remaining 4 on the
            right, one per column, via plain grid auto-flow — `nav` itself
            goes `display: contents` so its buttons become direct grid
            items instead of a nested flex row. */}
        {/* md:items-stretch, explicit rather than relying on the default:
            align-items' initial value ("normal") is SPECCED to behave as
            stretch for a grid container, but that didn't hold up here in
            practice (measured nav/each button stuck at their own ~48px
            content height instead of the row's 72px) — spelling it out
            gets the actual stretch this layout depends on: nav (and h2)
            filling the row's full height, and in turn each category button
            filling nav's own nested-grid height (see nav's own comment). */}
        <div className="flex flex-col justify-between gap-6 pb-6 md:grid md:grid-cols-6 md:items-stretch md:gap-0">
          {/* Same size as the contact section's title — one "brand title"
              scale shared across the site's section headings.
              px-6 sm:px-10 replaces the wrapper's old padding for this cell
              — both sides while h2 is alone on its own row (below md),
              md:pr-0 drops the right side once nav sits beside it instead
              (that edge is now an internal divider, not a true edge). */}
          <h2 className="px-6 text-3xl font-normal text-white sm:px-10 sm:text-4xl md:col-span-2 md:flex md:items-center md:pr-0 lg:pl-14 lg:text-5xl">
            Project Gallery
          </h2>
          {/* No more -mx-6/-mx-10: those cancelled the wrapper's own former
              px-6/px-10 so each mobile row's divider ran edge-to-edge past
              it — with the wrapper unpadded now there's nothing left to
              cancel. md:pr-10/lg:pr-14 is this cell's own edge inset
              instead (mirroring h2's pl- above), scoped to md: and up since
              below that nav is still the stacked list, not the row this
              padding is meant for.
              From md up this is its own real nested grid (col-span-4 of the
              outer 6, split into 4 of its own), not display: contents —
              contents was tried first so the buttons would auto-flow as
              direct items of the outer grid, but a button-through-contents
              grandchild's height:100% doesn't reliably resolve against the
              outer row (measured: stayed at its own ~48px content height
              instead of the row's 72px). A real nested grid stretches
              normally at both levels — the outer grid stretches nav to the
              row's height, nav's own grid then stretches each button to
              nav's height — so the hover background-fill actually covers
              the full cell instead of just wrapping the text. */}
          <nav className="flex flex-col text-lg uppercase tracking-[0.2em] sm:text-xl md:col-span-4 md:grid md:grid-cols-4 md:items-stretch md:pr-10 lg:pr-14">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                aria-pressed={filter === category}
                className={cn(
                  "group relative flex items-center justify-between border-t border-b border-white/25 border-l px-6 py-3 text-left no-underline transition-colors hover:text-black hover:no-underline sm:px-10",
                  // md:border-*-0 drops all four mobile-row borders — from
                  // md: up, the two decorative spans below draw the left/right
                  // lines instead (and reach further than a real border could,
                  // through the header's padding to the section's true edges).
                  // Having both was the bug: a real border-l/r here plus the
                  // span on top of it drew two 1px lines a hair out of
                  // alignment, reading as a doubled/gapped divider. No
                  // explicit height needed here any more — nav's own real
                  // grid (see its comment) stretches this button to fill it.
                  "md:justify-center md:border-0 md:p-0 md:text-lg",
                  filter === category ? "text-[#E77421]" : "text-white/55",
                )}
                onClick={() => setFilter(category)}
              >
                {/* Hover fill — a separate span, not hover:bg-* directly on
                    the button, and extended by the SAME -top-10/-bottom-6 as
                    the divide-line spans below. The button's own box is only
                    ~48px (its own text height); the divide lines reach a full
                    112px through the header's padding, so a fill bounded by
                    the button itself left a ~40px gap above and ~24px below
                    where the lines were drawn but nothing was filled — this
                    is that bug. group-hover (not hover) because this span
                    itself has no size to be hovered; the button does. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-transparent transition-colors group-hover:bg-[#E77421] md:-top-10 md:-bottom-6"
                />
                {/* Extends the button's own border-l/r through the header's
                    surrounding padding (pt-8/sm:pt-10 above, pb-6 below) to
                    the section's true top/bottom edges. Note: the project
                    grid right below runs its own independent
                    grid-cols-2/lg:grid-cols-4, whose column lines land
                    nowhere near these (measured: only the midpoint
                    coincides, the rest differ by hundreds of px at desktop
                    widths) — so this line reaching the seam won't continue
                    into a matching line below it, by design of the two
                    grids rather than a bug here.
                    position: absolute is the point — unlike a negative
                    margin, it bleeds outside the button's own box without
                    pulling on this row's height or the next section's
                    position (that's what caused the overlap last time). */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-px bg-white/25 md:-top-10 md:-bottom-6 md:block"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 hidden w-px bg-white/25 md:-top-10 md:-bottom-6 md:block"
                />
                <span className="relative">{category === "All" ? "All Works" : category}</span>
                {/* iOS-settings-style row chevron — mobile stacked list only,
                    hidden once the nav reverts to the grid. */}
                <ChevronRight aria-hidden="true" className="relative h-5 w-5 md:hidden" />
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Full-bleed: each project contributes exactly two cells (colour panel,
          image) in document order, so plain grid auto-flow — no manual pairing
          — yields 1 pair/row on narrow screens and 2 pairs/row at lg, just by
          changing the column count. The container owns the top/left edge, each
          cell owns its own right/bottom, so every seam is single-width and the
          outer frame closes at any width. */}
      <div key={filter} className="grid grid-cols-2 border-l border-t border-white/25 lg:grid-cols-4">
        {filteredItems.map((item, index) =>
          // First two of whatever's currently filtered get the /projects
          // listing page's own showcase treatment (full-bleed cover photo,
          // colour-overlay reveal on hover) instead of the panel+image pair
          // every other card uses — col-span-2 so each still occupies a full
          // pair's worth of grid width (2 cols at the base 2-col breakpoint,
          // half the row at lg's 4), keeping the rest of the grid's auto-flow
          // and pairing math (needsFillerPair below) working unchanged.
          index < 2 ? (
            <ShowcaseProjectCard
              key={item.id}
              item={item}
              delayMs={Math.min(index, MAX_STAGGERED_CARDS) * STAGGER_MS}
            />
          ) : (
            <ProjectCard
              key={item.id}
              item={item}
              index={index}
              delayMs={Math.min(index, MAX_STAGGERED_CARDS) * STAGGER_MS}
            />
          ),
        )}

        {needsFillerPair && (
          <>
            <div aria-hidden="true" className="border-b border-white/25" />
            <div aria-hidden="true" className="border-b border-r border-white/25" />
          </>
        )}
      </div>

      {filteredItems.length === 0 && (
        <p className="border-b border-t border-white/25 px-5 py-10 text-center text-xs uppercase tracking-[0.2em] text-white/45">
          No projects in this category
        </p>
      )}
    </section>
  )
}

/**
 * Each project renders as two sibling grid cells — a colour panel and its
 * image — wrapped in one `display: contents` link, so they act as a single
 * clickable region while still participating in the parent grid individually
 * (a real wrapping element would break the grid's column auto-flow).
 */
function ProjectCard({ item, index, delayMs }: { item: Project; index: number; delayMs: number }) {
  const href = `/projects/${item.slug}`
  const accent = accentOf(item)
  const onAccent = textOn(accent)

  // No border between a panel and its own image — on hover the panel's
  // colour floods across that seam, so a static line there would fight the
  // "one block" effect. border-r stays on the image: that's the seam between
  // this project and the next pair, which should stay a real divider.
  const focusRing = "group-focus-visible:ring-2 group-focus-visible:ring-inset group-focus-visible:ring-white"
  const panelCell = cn("border-b border-white/25", focusRing)
  const imageCell = cn("border-b border-r border-white/25", focusRing)
  const animation = {
    className: "animate-fade-in-up motion-reduce:animate-none",
    style: { animationDelay: `${delayMs}ms` },
  }

  const body = (
    <>
      {/* Colour panel: label + title + arrow always visible; the description
          is revealed on hover, inside the same panel, rather than in an
          always-on caption — the panel itself is the card's identity. */}
      <div
        className={cn(
          // No overflow-hidden here: the description below is deliberately
          // wider than this panel, bleeding across the seam into the paired
          // image once that image is flooded with the same colour on hover —
          // otherwise it'd be clipped at the panel's own right edge.
          //
          // justify-start, not -between: the title sits right under the
          // label, with any leftover height as empty space at the bottom of
          // the panel, rather than the two being pushed to opposite ends.
          //
          // z-10 on the PANEL itself, not just the description inside it:
          // the fade-in-up entrance animation (`... both` fill mode) leaves a
          // permanent translateY(0) on both cells once it finishes, and any
          // element with a non-"none" transform becomes its own stacking
          // context. That means this panel and the image cell each paint as
          // one unit, competing at the *grid's* level — a z-index only on the
          // description inside would just win fights within the panel's own
          // context, while the image cell (later in the DOM) still painted
          // over the panel as a whole. Elevating the panel itself fixes it.
          // CSS overflow-x and overflow-y can't be set independently
          // visible/hidden (setting either to non-visible forces the other
          // to compute as `auto`, which still clips), so this panel has to
          // stay overflow:visible on both axes for the description's
          // horizontal bleed to work. The only way to stop that visible
          // overflow spilling downward into a gap between this panel and its
          // shorter aspect-ratio'd image sibling is to give the panel enough
          // height that even its worst case — a 3-line title plus the
          // 2-line hover description — never needs to exceed the box in the
          // first place. Two ratios, not one: mobile is 2 columns (narrower
          // cards, so more text-wrap at the same font size) and needed its
          // own taller minimum — verified empirically per breakpoint across
          // all 7 projects, not just estimated from font metrics.
          "relative z-10 flex aspect-[3/5] flex-col justify-start gap-6 p-5 sm:aspect-[10/11] sm:gap-8 sm:p-8",
          panelCell,
          animation.className,
        )}
        style={{ backgroundColor: accent, color: onAccent, ...animation.style }}
      >
        <div
          // w-[200%], same reasoning as the description below: this row lives
          // inside the panel, but "the right corner" the category belongs in
          // is the far edge of the whole flooded block (panel + image), not
          // just the panel's own edge — which is where justify-between alone
          // would strand it, at the seam rather than the true right corner.
          className="flex w-[200%] items-start justify-between gap-4 text-xs uppercase tracking-[0.2em] sm:text-sm"
          style={{ color: `${onAccent}99` }}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>

          {/* Held back until the hover colour-flood finishes (delay-500
              matches the flood's own duration-500), then fades in — reusing
              the same fade language as the entrance animation, in the corner
              it now actually sits in, instead of appearing statically at the
              seam from the start. */}
          <span className="opacity-0 transition-opacity delay-500 duration-300 group-hover:opacity-100">
            {item.category}
          </span>
        </div>

        <div>
          <h3 className="text-2xl font-normal leading-tight sm:text-3xl">{item.title}</h3>

          {/* Normal flow, not absolute: the space is reserved either way (this
              is invisible, not display:none), so revealing it can never
              overlap the title above. w-[200%] deliberately overflows this
              panel — the panel and its paired image are equal-width grid
              columns, so double-width is exactly "the whole block" the
              colour fills on hover. (The panel carries the z-index that
              keeps this on top of the image; see its own comment above.) */}
          <p
            className="invisible mt-3 line-clamp-2 w-[200%] text-2xl leading-tight opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100 sm:text-3xl"
            style={{ color: `${onAccent}cc` }}
          >
            {item.description}
          </p>
        </div>

        {/* mt-auto: a sibling of the title group, not a child of it, so it
            pins to the panel's own bottom edge regardless of how tall the
            title/description happen to be — it never just trails the text. */}
        <ArrowRight
          aria-hidden="true"
          className="mt-auto h-6 w-6 transition-transform duration-300 group-hover:translate-x-1.5"
        />
      </div>

      {/* Same two ratios as the panel (see its comment) — matching, fixed
          aspect-ratio boxes on both sides is what actually keeps them in
          sync; relying on grid stretch to match a variable-height sibling
          turned out not to work here (tried it: dropping this cell's own
          sizing and leaning on stretch alone made the image collapse to
          nothing, because next/image's `fill` needs its parent to already
          have a resolved, non-auto height — stretch didn't reliably supply
          one before the image tried to size itself against it). */}
      <div
        className={cn("relative aspect-[3/5] overflow-hidden bg-white/5 sm:aspect-[10/11]", imageCell, animation.className)}
        style={animation.style}
      >
        <Image
          src={item.image || "/placeholder.svg"}
          alt={item.title}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />

        {/* The panel's own colour floods in from the seam it shares with the
            panel, over the image, on hover — same accent, so the pair reads as
            one block rather than two on interaction. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
          style={{ backgroundColor: accent, opacity: 1 }}
        />
      </div>
    </>
  )

  const shared = {
    "aria-label": `${item.title} — ${item.description}`,
    className: "group contents focus-visible:outline-none",
  }

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

/**
 * The /projects listing page's own card treatment, ported over for whichever
 * two projects currently lead the (possibly filtered) list: one full-bleed
 * cover photo instead of the panel+image pair, with title/description/arrow/
 * category revealed as a colour overlay on hover rather than always-visible
 * panel text. col-span-2 (not a two-cell display:contents pair like
 * ProjectCard) — same total grid width as a normal pair, but as one link.
 */
function ShowcaseProjectCard({ item, delayMs }: { item: Project; delayMs: number }) {
  const href = `/projects/${item.slug}`
  const accent = accentOf(item)
  const onAccent = textOn(accent)
  const visual = curtainFor(href)

  const body = (
    <div
      className="relative aspect-[4/3] overflow-hidden border-b border-r border-white/25 bg-white/5 animate-fade-in-up motion-reduce:animate-none"
      style={{ animationDelay: `${delayMs}ms` }}
    >
      <Image
        src={item.image || "/placeholder.svg"}
        alt={item.title}
        fill
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 flex flex-col p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:p-8"
        style={{ backgroundColor: accent, color: onAccent }}
      >
        <h3 className="text-2xl font-normal sm:text-3xl">{item.title}</h3>
        <p className="mt-2 text-2xl font-normal sm:text-3xl" style={{ color: `${onAccent}cc` }}>
          {item.description}
        </p>
        <div className="mt-auto flex items-end justify-between">
          {/* Same oversized/off-centred-glyph treatment as the /projects
              page's own card — see its comment for why the negative margin
              is needed (the glyph isn't centred in Lucide's own viewBox). */}
          <ArrowRight
            aria-hidden="true"
            strokeWidth={0.5}
            strokeLinecap="square"
            strokeLinejoin="round"
            className="-ml-8 h-48 w-48 shrink-0 transition-transform group-hover:translate-x-2 sm:-ml-9 sm:h-56 sm:w-56"
          />
          <p className="text-base uppercase tracking-[0.2em]" style={{ color: `${onAccent}99` }}>
            {item.category}
          </p>
        </div>
      </div>
    </div>
  )

  const shared = {
    "aria-label": `${item.title} — ${item.description}`,
    className:
      "group col-span-2 block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421] focus-visible:ring-inset",
  }

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

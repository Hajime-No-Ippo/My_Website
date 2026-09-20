"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/logo"
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "https://blog.ericdesign.uk", label: "Blogs" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const

/**
 * Radial falloff for the backdrop blur, centred on the sheet's edge (100% 50%).
 * Solid across the panel, then easing out so the blur has a radius rather than
 * a boundary. Widen the second stop to reach further across the page.
 */
const BLUR_FALLOFF =
  "radial-gradient(120% 90% at 100% 50%, #000 0%, #000 38%, rgba(0,0,0,0.55) 62%, transparent 88%)";

// Sheet row cascade. The panel itself slides for 500ms, so the rows start
// slightly into that slide and run head-to-tail while it is still arriving.
const ROW_LEAD_IN_MS = 120
// Tune this one to taste — it is the gap between consecutive rows landing.
const ROW_STAGGER_MS = 150

// 6rem plus a bit more = 7rem. Shared by the header row and the sheet's own
// matching close-button row below — app/projects/page.tsx's sticky sidebar
// also clears this same height, so update it there too if this changes.
const NAVBAR_HEIGHT = "h-28"

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close on navigation — the sheet would otherwise stay open over the new page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    // z-[60]: above the sheet overlay/content (both z-50) so the blurred
    // backdrop never renders over this bar — without it, the overlay's later
    // portal position in the DOM lets it win the stacking tie at equal z.
    <header className="sticky top-0 z-[60] w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/60">
      {/* 6 equal columns. Only column 2 carries a divider for now (its own
          border-l, stretched full-height by the grid's default
          align-items: stretch) — columns 3-5 are bare spacers reserved for
          future nav items. */}
      <div className={cn("grid grid-cols-6 items-stretch px-6 sm:px-10 lg:px-14", NAVBAR_HEIGHT)}>
        <Link href="/" className="hidden items-center gap-3 overflow-hidden md:flex">
          <Logo className="h-14 w-14 shrink-0 text-white sm:h-16 sm:w-16" />
          {/* shrink-0: flex would otherwise squeeze this to fit the logo,
              and with nowrap forcing each line to stay on one line, that
              squeeze just clips "Software Engineer" instead of shrinking the
              text — better to let it sit at its natural width. text-base
              (not -lg): at -lg, "Software Engineer" ran ~6px past this
              column's own width and got clipped by overflow-hidden. mr-3
              gives it a little breathing room before the next column's
              divider. Hidden below md: the column is nowhere near wide
              enough there — logo-only, same as before this was added. */}
          <p className="mr-3 shrink-0 whitespace-nowrap text-base font-extralight leading-tight text-white">
            Eric Tao
            <br />
            Software Engineer
            <br />
            &amp; UX Designer
          </p>
        </Link>
        <Link href="/" className="flex items-center md:hidden">
          <Logo className="h-14 w-14 text-white sm:h-16 sm:w-16" />
        </Link>

        {/* invisible (not hidden): this is a grid item in an always-6-column
            row, so display:none here would remove it from layout entirely,
            leaving column 6 unfilled and pulling the hamburger one column
            short of the true right edge. visibility:hidden keeps its track
            reserved (and drops its border along with it) without disturbing
            anything else's position — the column just reads as empty space. */}
        <div className="invisible flex items-center justify-center overflow-hidden border-t border-l border-r border-white/25 px-1 md:visible">
          {/* Column is only ~1/6 of the viewport — at text-3xl and forced
              onto one line, "Contact Me" was far wider than that and bled
              sideways into the logo's column. Below xl: let it wrap onto two
              lines instead of shrinking it to the point of being unreadable
              — checked against the actual column width at every step from
              375px to 1920px (1024px, right at the lg breakpoint, was still
              ~5px too tight for one line at text-3xl). From xl: (1280px)
              there's finally comfortable room for one line. */}
          <Link
            href="/contact"
            className="text-center text-sm font-light leading-tight text-white/80 transition-colors hover:text-[#E77421] xl:whitespace-nowrap xl:text-3xl"
          >
            Contact Me
          </Link>
        </div>

        <div />
        <div />
        <div />

        {/* One nav at every width — the sheet is the navigation, not just the
            small-screen fallback. */}
        <div className="flex items-center justify-end">
          <Sheet open={open} onOpenChange={setOpen}>
            {/* Radix hides/disables everything outside the dialog's own tree
              while it's open (pointer-events: none, aria-hidden) — so this
              button, though it'd still visually paint above the overlay at
              z-[60], stops being clickable the moment the sheet opens. It
              fades out rather than trying to double as the close control;
              the real close button lives inside SheetContent below, in the
              exact same spot, and takes over the instant this one hides. */}
            <SheetTrigger
              aria-label="Open menu"
              className={cn(
                "-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-opacity hover:text-[#E77421] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421]",
                open && "opacity-0",
              )}
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            {/* The panel carries no surface of its own — no background, border or
              shadow — and its slide is zeroed out. Otherwise the container and
              the rows would both translate and the movement would compound. */}
            <SheetContent
              side="right"
              showClose={false}
              // Backdrop blur strongest over the sheet and falling off by radius.
              // The mask applies to the whole overlay, so the dim fades with the
              // blur — a hard-edged blur circle would read as a bug.
              overlayClassName="bg-black/40 backdrop-blur-md"
              overlayStyle={{
                maskImage: BLUR_FALLOFF,
                WebkitMaskImage: BLUR_FALLOFF,
              }}
              className="w-[min(20rem,85vw)] border-0 bg-transparent p-0 text-white shadow-none focus:outline-none data-[state=open]:duration-0 data-[state=closed]:duration-0"
            >
              <SheetTitle className="sr-only">Site navigation</SheetTitle>

              {/* Same NAVBAR_HEIGHT/px-6/sm:px-10/lg:px-14 row as the header, so
                this lands pixel-for-pixel where the trigger above just faded
                out — the sheet is right-anchored (inset-y-0 right-0), so its
                own right edge already is the viewport's right edge. */}
              <div
                className={cn("absolute inset-x-0 top-0 flex items-center justify-end px-6 sm:px-10 lg:px-14", NAVBAR_HEIGHT)}
              >
                <SheetClose
                  aria-label="Close menu"
                  className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-[#E77421] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421]"
                >
                  <X className="h-6 w-6" />
                </SheetClose>
              </div>

              <nav className="flex flex-col gap-2 pr-3 pt-28">
                {NAV_LINKS.map((link, index) => {
                  const isActive = pathname === link.href
                  // Row and wipe share one delay so they stay locked together.
                  const delay = ROW_LEAD_IN_MS + index * ROW_STAGGER_MS
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        // Each option is its own slab: own surface, own edge, with
                        // the overlay showing through the gaps between them.
                        "relative overflow-hidden border-l-2 bg-black",
                        "flex min-h-[56px] items-center px-6 text-lg font-medium",
                        "transition-colors",
                        // Radix unmounts the sheet on close, so each open remounts
                        // these rows and the cascade replays without any state.
                        "animate-nav-row-in motion-reduce:animate-none",
                        "text-white",
                        isActive
                          ? "border-l-[#E77421]"
                          : "border-l-white/20 hover:border-l-[#E77421] hover:text-[#E77421]",
                      )}
                      style={{ animationDelay: `${delay}ms` }}
                    >
                      {/* Absolutely positioned, so it paints above bare text no
                        matter the DOM order — the label needs its own positioned
                        layer below to stay legible against the orange. */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-[#E77421] animate-nav-row-wipe motion-reduce:hidden"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "https://blog.ericdesign.uk", label: "Blogs" },
  { href: "/skills", label: "Experience" },
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

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close on navigation — the sheet would otherwise stay open over the new page.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center md:mr-6">
          <p className="relative inline-block text-base font-bold sm:text-lg">
            ERIC  <span className="text-[#E77421]">TAO</span>
          </p>
        </Link>

        {/* One nav at every width — the sheet is the navigation, not just the
            small-screen fallback. */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-[#E77421] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421]"
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          {/* The panel carries no surface of its own — no background, border or
              shadow — and its slide is zeroed out. Otherwise the container and
              the rows would both translate and the movement would compound. */}
          <SheetContent
            side="right"
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

            <nav className="flex flex-col gap-2 pr-3 pt-16">
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
    </header>
  )
}

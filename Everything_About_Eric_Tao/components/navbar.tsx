"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const

const underlineClass =
  "absolute left-0 bottom-0 h-px w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"

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
            use::std::Eric::<span className="text-[#E77421]">TAO</span>
          </p>
        </Link>

        {/* Desktop: inline links. */}
        <nav className="hidden flex-1 items-center justify-end md:flex">
          <div className="flex items-center justify-end gap-10 text-sm">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="group">
                <span className="relative inline-block py-2 text-sm font-medium">
                  {link.label}
                  <span className={cn(underlineClass, pathname === link.href && "scale-x-100")} />
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile: a sheet, so the header stays one row tall instead of
            wrapping the links onto a second line. */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-white transition-colors hover:text-[#E77421] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E77421] md:hidden"
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-[min(20rem,85vw)] border-l border-white/15 bg-black p-0 text-white"
          >
            <SheetTitle className="sr-only">Site navigation</SheetTitle>

            <nav className="flex flex-col pt-16">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      // Tall rows so every target clears the 44px touch minimum.
                      "flex min-h-[56px] items-center border-b border-white/10 px-6 text-lg font-medium transition-colors",
                      isActive ? "text-[#E77421]" : "text-white hover:text-[#E77421]",
                    )}
                  >
                    {link.label}
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

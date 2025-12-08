"use client"

import Link from "next/link"
import Image from "next/legacy/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
      })
    }
  }

  const pathname = usePathname()
  const isHome = pathname === "/"
  const isAbout = pathname === "/about"
  const isSkills = pathname === "/skills"
  const isPortfolio = pathname === "/portfolio"
  const isContact = pathname === "/contact"

  const underlineClass =
    "absolute left-0 bottom-0 h-px w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <p className="relative inline-block py-2 text-lg font-bold">
            Eric Tao
          </p>
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-10">
            <Link href="/about" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                About
                <span className={`${underlineClass} ${isAbout ? "scale-x-100" : ""}`} />
              </span>
            </Link>

            <Link href="/skills" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Experience
                <span className={`${underlineClass} ${isSkills ? "scale-x-100" : ""}`} />
              </span>
            </Link>

            <Link href="/portfolio" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Gallery
                <span className={`${underlineClass} ${isPortfolio  ? "scale-x-100" : ""}`} />
              </span>
            </Link>

            <Link href="/contact" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Contact
                <span className={`${underlineClass} ${isContact ? "scale-x-100" : ""}`} />
              </span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

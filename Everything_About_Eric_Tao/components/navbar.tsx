"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const isAbout = pathname === "/about"
  const isSkills = pathname === "/skills"
  const isContact = pathname === "/contact"
  const isProjects = pathname === "/projects"

  const underlineClass =
    "absolute left-0 bottom-0 h-px w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex flex-col items-center gap-2 py-3 md:h-14 md:flex-row md:items-center">
        <Link href="/" className="flex items-center md:mr-6">
          <p className="relative inline-block py-2 text-lg font-bold">
            use::std::Eric::<span className="text-[#E77421]">TAO</span>
          </p>
        </Link>
        <nav className="flex w-full flex-1 items-center justify-center md:justify-end">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm md:justify-end md:gap-10">
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

            <Link href="/projects" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Projects
                <span className={`${underlineClass} ${isProjects ? "scale-x-100" : ""}`} />
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

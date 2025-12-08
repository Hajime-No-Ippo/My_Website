import Link from "next/link"
import Image from "next/image"
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-black text-white backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lab_%E7%94%BB%E6%9D%BF%201-qp1NuwprNlFGNRPlLvgsPp8WOpSI2R.png"
            alt="Design Lab Logo"
            width={120}
            height={30}
            className="w-auto h-6 dark:invert"
            priority
          />
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-6">
            <Link href="/about" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                About
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </Link>

            <Link href="/skills" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Experience
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </Link>

            <a href="#gallery" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Gallery
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </a>

            <a href="#contact" className="group">
              <span className="relative inline-block py-2 text-sm font-medium">
                Contact
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}


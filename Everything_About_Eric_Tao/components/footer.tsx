import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Write by Claude, Pasted by{"  "}
            <Link href="/" className="group">
              <span className="relative inline-block py-2 text-sm font-medium text-[#E77421]">
                @Eric Tao
                <span className="absolute left-0 -bottom-0 h-px w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </Link>
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          &copy; {new Date().getFullYear()} Eric Tao. All rights reserved.
        </p>
      </div>
    </footer>
  )
}


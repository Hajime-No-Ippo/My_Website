import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-black text-white">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <Link href="/" className=" hover:underline hover:underline-offset-4 text-[#E77421] hover:text-[#E77421]/90">
              
            </Link>
            <a href="/" className="group">
              <span className="relative inline-block py-2 text-sm font-medium text-[#E77421]">
                Eric Tao
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </a>
          </p>
        </div>
        <p className="text-center text-sm md:text-left">
          &copy; {new Date().getFullYear()} Chenming Tao. All rights reserved.
        </p>
      </div>
    </footer>
  )
}


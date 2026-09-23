import Link from "next/link"

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "https://blog.ericdesign.uk", label: "Blogs" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
]

const SOCIAL_LINKS = [
  { href: "https://github.com/Hajime-No-Ippo", label: "GitHub" },
  { href: "https://www.linkedin.com/in/chenming-eric-tao/", label: "LinkedIn" },
  { href: "https://www.instagram.com/eric_chenmingtao/", label: "Instagram" },
  { href: "https://x.com/MingTaylor26665", label: "Twitter" },
  { href: "https://open.spotify.com/user/31hqhp6mrkqj7vjentb26qxfrs4q", label: "Spotify" },
  { href: "https://huggingface.co/Eric-Yyvuw", label: "Hugging Face" },
]

export function Footer() {
  return (
    <footer className="border-t border-white/25 bg-black text-white">
      {/* Full-bleed 3-column split, same convention as the gallery/contact
          sections — container-less, each cell owns its own dividing border.
          Plain sm:grid-cols-3 — the navbar's grid is unpadded (see its own
          comment), so this lines up with it with no offset needed. */}
      <div className="grid grid-cols-1 sm:grid-cols-3">
        <div className="border-b border-white/25 px-6 pb-12 pt-8 sm:border-b-0 sm:border-r sm:px-10 sm:pb-16 sm:pt-10">
          <p className="text-4xl font-normal leading-tight sm:text-5xl">
            Eric Tao
            <br />
            Software Engineer
            <br />
            &amp; UX Designer
          </p>
        </div>

        <div className="flex flex-col gap-10 border-b border-white/25 px-6 pb-12 pt-8 sm:border-b-0 sm:border-r sm:px-10 sm:pb-16 sm:pt-10">
          <nav className="flex flex-col gap-2 text-2xl sm:text-3xl">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 text-2xl text-white/80 sm:text-3xl">
            <a href="mailto:hello@ericdesign.uk" className="w-fit transition-colors hover:text-white">
              hello@ericdesign.uk
            </a>
            <p>Maynooth, Ireland</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-6 pb-12 pt-8 text-2xl sm:px-10 sm:pb-16 sm:pt-10 sm:text-3xl">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      {/* border-t lives on this full-width wrapper, and the row below uses
          the same px-6/sm:px-10/lg:px-14 padding as every other full-bleed
          section (navbar included) instead of `container` — `container`
          caps out and centers past 1400px, which put this row's edges out
          of alignment with the rest of the site on wide screens. */}
      <div className="border-t border-white/25">
        <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:px-10 md:flex-row lg:px-14">
          <p className="text-center text-sm leading-loose md:text-left">
            Write by Claude, Pasted by{"  "}
            <Link href="/" className="group">
              <span className="relative inline-block py-2 text-sm font-medium text-[#E77421]">
                @Eric Tao
                <span className="absolute left-0 -bottom-0 h-px w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </span>
            </Link>
          </p>
          <p className="text-center text-sm md:text-left">
            &copy; {new Date().getFullYear()} Eric Tao. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

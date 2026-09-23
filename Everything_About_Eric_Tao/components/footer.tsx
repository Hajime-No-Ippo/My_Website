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
          sm:grid-cols-[...] instead of a plain sm:grid-cols-3: this grid has
          no outer padding of its own (each cell pads itself internally), so
          a plain 3-way equal split put its own column boundaries at raw
          33.333%/66.667% of the full viewport — while the navbar's columns
          are inset by its own lg:px-14 (56px), landing its column 2/3
          boundary at 56px + (viewport-112px)/3, i.e. exactly 33.333% + 56/3
          (18.667px). Same fixed offset, same fix as app/projects/page.tsx's
          sidebar width: widen column 1 by that constant and split the
          remaining width evenly between columns 2 and 3, so this grid's
          first divider lands exactly under the navbar's own. */}
      <div className="grid grid-cols-1 sm:grid-cols-[calc(33.3333%+18.667px)_calc(33.3333%-9.333px)_calc(33.3333%-9.333px)]">
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

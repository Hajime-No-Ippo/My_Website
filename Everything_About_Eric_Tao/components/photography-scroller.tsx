"use client"

import { cn } from "@/lib/utils"
import { Thumb } from "@radix-ui/react-scroll-area"
import Image from "next/image"

// Add real photo URLs here (e.g. `imageSrc`) and wire them into the card below.
const photographySlides = [
  {
    id: 1,
    title: "On the road",
    tone: "from-[#1b1b1b] via-[#0f0f0f] to-[#2a1b12]",
    imageSrc: "/DSCF4513.jpeg",
    Thumbnail:"Airport in Asia, PVG airport in summer"
  },
  {
    id: 2,
    title: "Flowers in June",
    tone: "from-[#151515] via-[#0b0b0b] to-[#1f1f1f]",
    imageSrc: "/DSCF4571.jpeg",
    Thumbnail:"The symbol of life and happiness",
  },
  {
    id: 3,
    title: "Golden Hour",
    tone: "from-[#20160d] via-[#140f0a] to-[#3a2716]",
    imageSrc: "/DSCF4700.jpg",
    Thumbnail:"Sip the coffee and enjoy the sunset",
  },
  {
    id: 4,
    title: "Minimal Still",
    tone: "from-[#0f1014] via-[#0a0b0f] to-[#191b23]",
    imageSrc: "/DSCF4541.jpeg",
    Thumbnail:"Take from ZRH airport in an afternoon",
  },
  {
    id: 5,
    title: "Street Motion",
    tone: "from-[#18120f] via-[#0e0b09] to-[#2c1d17]",
    imageSrc: "/DSCF5317.JPG",
    Thumbnail:"A normal day in the Dublin city",
  },
]

export default function PhotographyScroller() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent" />
      <div className="overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 snap-x snap-mandatory px-2">
          {photographySlides.map((slide) => (
            <div
              key={slide.id}
              className="group relative h-[360px] w-[75vw] shrink-0 snap-center overflow-hidden rounded-3xl border border-border/60 shadow-2xl sm:h-[420px] sm:w-[420px] lg:w-[520px]"
            >
              <Image
                src={slide.imageSrc}
                alt={slide.title}
                fill
                className="object-cover opacity-90"
                priority={slide.id === 1}
              />
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-40",
                  slide.tone
                )}
              />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(231,116,33,0.25),_transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 flex h-full items-end p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Photography</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{slide.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{slide.Thumbnail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>


    
    
  )
}

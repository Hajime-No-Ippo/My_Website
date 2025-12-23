"use client"

import PhotographyScroller from "./photography-scroller"

function Gallery() {
  return (
    <section id="gallery" className="relative min-h-screen bg-background">
      <div className="container py-16">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl font-bold font-saffron">Gallery</h2>
          <p className="max-w-2xl text-muted-foreground">
            This is the collection of the photography work of the cities I have visited and the moments I have captured along the way.
          </p>
        </div>

        <PhotographyScroller />
      </div>
    </section>
  )
}

export default Gallery

"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type DeckPage = {
  page: number
  aspect: number
  files: Record<string, string>
}

export type DeckManifest = {
  slug: string
  pageCount: number
  aspect: number
  widths: number[]
  pages: DeckPage[]
}

type PdfFlipbookProps = {
  manifest: DeckManifest
  /** Where the page images live — `/decks/<slug>` locally, or a Blob prefix. */
  baseUrl: string
  /** Original PDF, offered as a download. */
  pdfUrl?: string
  title: string
  /**
   * `single` shows one page at a time, `spread` shows facing pages, `auto`
   * picks by page shape. Landscape pages are usually whole compositions
   * already — pairing them halves the size of everything for no benefit.
   */
  layout?: "auto" | "single" | "spread"
  className?: string
}

// Below this container width a spread book drops to one page. page-flip derives
// that from `minWidth * 2`, so this is the real breakpoint.
const PORTRAIT_BREAKPOINT = 768
// Pages this far ahead of the reader are fetched eagerly; the rest lazy-load.
const EAGER_PAGES = 4
// Page aspects at or above this read as landscape compositions, not book pages.
const LANDSCAPE_THRESHOLD = 1.2
// Tallest the book may get, so the controls stay on screen with it.
const VIEWPORT_HEIGHT_CAP = "72vh"
// page-flip only goes single-page when the block is narrower than minWidth * 2,
// so an unreachable minWidth pins it there. The inline min-width it writes as a
// side effect gets cleared straight after — otherwise phones overflow sideways.
const FORCE_SINGLE_MIN_WIDTH = 5000

export default function PdfFlipbook({
  manifest,
  baseUrl,
  pdfUrl,
  title,
  layout = "auto",
  className,
}: PdfFlipbookProps) {
  const isSingle = layout === "single" || (layout === "auto" && manifest.aspect >= LANDSCAPE_THRESHOLD)
  const bookRef = useRef<HTMLDivElement>(null)
  const shellRef = useRef<HTMLDivElement>(null)
  const flipRef = useRef<import("page-flip").PageFlip | null>(null)

  const [currentPage, setCurrentPage] = useState(0)
  const [isPortrait, setIsPortrait] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const element = bookRef.current
    if (!element) return

    let flip: import("page-flip").PageFlip | null = null
    let cancelled = false

    // Dynamic import keeps page-flip out of the server bundle and off the
    // critical path — it only loads once the viewer is actually mounted.
    import("page-flip").then(({ PageFlip }) => {
      if (cancelled || !bookRef.current) return

      const pageWidth = isSingle ? 1400 : 1000

      flip = new PageFlip(bookRef.current, {
        width: pageWidth,
        height: Math.round(pageWidth / manifest.aspect),
        size: "stretch",
        minWidth: isSingle ? FORCE_SINGLE_MIN_WIDTH : PORTRAIT_BREAKPOINT / 2,
        maxWidth: pageWidth,
        minHeight: 200,
        maxHeight: Math.round(pageWidth / manifest.aspect),
        // A lone landscape page has no facing page to sit against, so the hard
        // cover treatment would just park it beside an empty half.
        showCover: !isSingle,
        usePortrait: true,
        autoSize: true,
        maxShadowOpacity: 0.5,
        drawShadow: true,
        flippingTime: 700,
        // Let taps scroll the page rather than trapping the gesture.
        mobileScrollSupport: true,
        clickEventForward: false,
      })

      flip.on("flip", (event) => setCurrentPage(event.data))
      flip.on("changeOrientation", (event) => setIsPortrait(event.data === "portrait"))

      flip.loadFromHTML(bookRef.current.querySelectorAll<HTMLElement>(".deck-page"))

      if (isSingle) {
        // Undo the inline minimums the forced single-page setting wrote.
        bookRef.current.style.minWidth = "0px"
        bookRef.current.style.minHeight = "0px"
      }

      flipRef.current = flip
      setIsPortrait(flip.getOrientation() === "portrait")
      setIsReady(true)
    })

    return () => {
      cancelled = true
      flipRef.current = null
      setIsReady(false)
      // destroy() unwinds the DOM page-flip moved around, so React can safely
      // unmount the container afterwards.
      try {
        flip?.destroy()
      } catch {
        // Already torn down (StrictMode double-invoke) — nothing to clean up.
      }
    }
  }, [manifest.aspect, isSingle])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener("fullscreenchange", onFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange)
  }, [])

  const flipPrev = useCallback(() => flipRef.current?.flipPrev(), [])
  const flipNext = useCallback(() => flipRef.current?.flipNext(), [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void shellRef.current?.requestFullscreen?.()
    }
  }, [])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        flipPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        flipNext()
      }
    },
    [flipNext, flipPrev],
  )

  const srcSet = (page: DeckPage) =>
    manifest.widths
      .slice()
      .sort((a, b) => a - b)
      .map((width) => `${baseUrl}/${page.files[String(width)]} ${width}w`)
      .join(", ")

  // Spread mode shows two pages, so the shell needs twice the page aspect.
  const showingOnePage = isSingle || isPortrait
  const shellAspect = showingOnePage ? manifest.aspect : manifest.aspect * 2
  const atStart = currentPage === 0
  const atEnd = currentPage >= manifest.pageCount - 1

  return (
    <div
      ref={shellRef}
      className={cn("flex flex-col gap-4 bg-background", isFullscreen && "justify-center p-6", className)}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`${title} — page viewer`}
    >
      {/* Height has to be capped via max-width: on an aspect-ratio box a
          max-height alone leaves the width unchanged, so the book overflows
          its shell and swallows the controls underneath it. */}
      <div
        className="relative mx-auto w-full"
        style={{ aspectRatio: shellAspect, maxWidth: `calc(${VIEWPORT_HEIGHT_CAP} * ${shellAspect})` }}
      >
        {!isReady && (
          <div className="absolute inset-0 animate-pulse rounded-lg bg-muted/60" aria-hidden="true" />
        )}
        <div
          ref={bookRef}
          className={cn("h-full w-full transition-opacity duration-300", isReady ? "opacity-100" : "opacity-0")}
        >
          {manifest.pages.map((page, index) => (
            <div
              key={page.page}
              className="deck-page overflow-hidden bg-card"
              // Hard pages get the rigid cover-stock flip. Only meaningful when
              // the outer two sit alone as covers, which single-page mode skips.
              data-density={!isSingle && (index === 0 || index === manifest.pageCount - 1) ? "hard" : "soft"}
            >
              {/* object-contain, not cover: the cover page has a different
                  aspect from the body and must letterbox rather than crop. */}
              <img
                src={`${baseUrl}/${page.files[String(Math.max(...manifest.widths))]}`}
                srcSet={srcSet(page)}
                sizes={`(max-width: ${PORTRAIT_BREAKPOINT}px) 100vw, 50vw`}
                alt={`${title} — page ${page.page} of ${manifest.pageCount}`}
                className="h-full w-full object-contain"
                loading={index < EAGER_PAGES ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={flipPrev}
          disabled={!isReady || atStart}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <p className="min-w-[6rem] text-center text-sm tabular-nums text-muted-foreground" aria-live="polite">
          {showingOnePage || currentPage === 0 || atEnd
            ? `${currentPage + 1} / ${manifest.pageCount}`
            : `${currentPage + 1}–${Math.min(currentPage + 2, manifest.pageCount)} / ${manifest.pageCount}`}
        </p>

        <Button variant="outline" size="icon" onClick={flipNext} disabled={!isReady || atEnd} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        {pdfUrl && (
          <Button asChild variant="outline" size="sm" className="ml-1 gap-2">
            <a href={pdfUrl} download>
              <Download className="h-4 w-4" />
              PDF
            </a>
          </Button>
        )}
      </div>
    </div>
  )
}

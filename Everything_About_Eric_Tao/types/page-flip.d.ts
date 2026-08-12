/**
 * `page-flip` ships JS only — no bundled declarations and no `types` field.
 * This covers the surface the flipbook component actually uses.
 */
declare module "page-flip" {
  export interface FlipSetting {
    startPage: number
    size: "fixed" | "stretch"
    width: number
    height: number
    minWidth: number
    maxWidth: number
    minHeight: number
    maxHeight: number
    drawShadow: boolean
    flippingTime: number
    usePortrait: boolean
    startZIndex: number
    autoSize: boolean
    maxShadowOpacity: number
    showCover: boolean
    mobileScrollSupport: boolean
    clickEventForward: boolean
    useMouseEvents: boolean
    swipeDistance: number
    showPageCorners: boolean
    disableFlipByClick: boolean
  }

  export interface PageFlipEvent<T = unknown> {
    data: T
    object: PageFlip
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Partial<FlipSetting>)
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void
    updateFromHtml(items: NodeListOf<HTMLElement> | HTMLElement[]): void
    destroy(): void
    update(): void
    clear(): void
    flipNext(): void
    flipPrev(): void
    turnToPage(page: number): void
    turnToNextPage(): void
    turnToPrevPage(): void
    getCurrentPageIndex(): number
    getPageCount(): number
    getOrientation(): "portrait" | "landscape"
    on(event: "flip", callback: (event: PageFlipEvent<number>) => void): void
    on(event: "changeOrientation", callback: (event: PageFlipEvent<"portrait" | "landscape">) => void): void
    on(event: "changeState" | "init" | "update", callback: (event: PageFlipEvent) => void): void
  }
}

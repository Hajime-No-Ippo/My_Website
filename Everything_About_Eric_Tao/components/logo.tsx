import type { CSSProperties } from "react"
import { cn } from "@/lib/utils"

const RING_MASK = "url(/assets/logo-ring.png)"
const SPHERE_MASK = "url(/assets/logo-sphere.png)"

/**
 * The logo is two shapes: a solid black sphere (the middle circle) and a thin
 * orbit ring around it, split into two alpha masks:
 *
 * - `logo-ring.png` is painted with `currentColor`, so callers still tint the
 *   ring via text-color classes (white in the navbar, `text-[#E77421]` for the
 *   About page's liquid-fill layer).
 * - `logo-sphere.png` is a plain filled disc (no cutouts for the ring) painted
 *   black in the plain logo, so the middle circle stays black while the ring
 *   carries the caller's text colour.
 *
 * The ring is painted AFTER (on top of) the sphere, so it's always fully
 * visible across the sphere without the sphere's mask needing a cutout that
 * matches the ring's path pixel-for-pixel. Two independently-rasterised masks
 * that are each anti-aliased on their own can't be relied on to line up along
 * a shared edge — any sub-pixel mismatch there used to show up as a hairline
 * gap straight through the ring where it crossed the sphere.
 *
 * A caller may pass its own `maskImage` (About's cursor-following radial
 * reveal). That reveal is applied to a SINGLE wrapper around the overlay —
 * nesting masks let the outer radial clip the inner silhouettes for free, with
 * no `mask-composite`/`maskSize` juggling. The overlay paints BOTH the sphere
 * and the ring, so the revealed area recolours the whole mark; outside the
 * radial the base layer's own colours (ring + black sphere) show through.
 */
export function Logo({
  className,
  style,
}: {
  className?: string
  strokeWidth?: number
  style?: CSSProperties
}) {
  const revealMask = style?.maskImage ?? undefined
  const transition = style?.transition

  const baseLayer = (src: string, color: string): CSSProperties => ({
    position: "absolute",
    inset: 0,
    backgroundColor: color,
    WebkitMaskImage: src,
    maskImage: src,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  })

  return (
    // `relative` is a default, not an inline style: inline position would beat
    // the caller's own positioning class (About passes `absolute inset-0`),
    // collapsing the two stacked logos into vertical flow instead of overlap.
    // cn/twMerge lets the caller's `absolute` win when supplied.
    <span aria-hidden="true" className={cn("relative block", className)}>
      {revealMask ? (
        // Reveal overlay: sphere AND ring, both clipped to the caller's single
        // radial mask. The plain <Logo> underneath supplies the resting colours
        // (white ring + black sphere); this layer recolours the revealed area,
        // so hovering can flip the whole mark — sphere and ring alike.
        <span
          style={{
            position: "absolute",
            inset: 0,
            WebkitMaskImage: revealMask,
            maskImage: revealMask,
            transition,
          }}
        >
          <span style={baseLayer(SPHERE_MASK, "currentColor")} />
          <span style={baseLayer(RING_MASK, "currentColor")} />
        </span>
      ) : (
        // Plain logo: solid black sphere under a currentColor ring.
        <>
          <span style={baseLayer(SPHERE_MASK, "#000")} />
          <span style={baseLayer(RING_MASK, "currentColor")} />
        </>
      )}
    </span>
  )
}

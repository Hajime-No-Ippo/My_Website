import BandCurtain from "./visuals/band"
import EmojiCurtain from "./visuals/emoji"
import type { CurtainVisual } from "./types"

/**
 * Route path → the curtain that opens it. This is the only place that knows
 * which project gets which opening; the host in provider.tsx imports
 * nothing but the type, so a new curtain is a new file plus a line here.
 *
 * A route absent from this map simply navigates without a curtain.
 */
export const CURTAIN_BY_ROUTE: Record<string, CurtainVisual> = {
  "/projects/sentinel": BandCurtain,
  "/projects/filmoji": EmojiCurtain,
}

export function curtainFor(href: string): CurtainVisual | undefined {
  return CURTAIN_BY_ROUTE[href]
}

/**
 * Route curtain — a full-screen transition that covers the page while the route
 * swaps underneath, so navigation happens out of sight.
 *
 *   provider.tsx      the host: veil, scroll lock, escape, the route push
 *   types.ts          the contract every visual implements
 *   registry.ts       route path → visual; the only file that pairs them
 *   on-arrival.tsx    plays the curtain for a direct or pasted URL
 *   visuals/          the plugins themselves
 *
 * Adding a project's opening is a new file in visuals/ plus a line in
 * registry.ts. The host imports nothing but the type, so it never changes.
 */
export { RouteCurtainProvider, CurtainLink, useRouteCurtain, useOptionalRouteCurtain } from "./provider"
export { default as CurtainOnArrival } from "./on-arrival"
export { curtainFor, CURTAIN_BY_ROUTE } from "./registry"
export type { CurtainVisual, CurtainVisualProps } from "./types"

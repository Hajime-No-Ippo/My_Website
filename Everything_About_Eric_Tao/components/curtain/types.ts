import type { ComponentType } from "react"

/**
 * The shape every curtain visual implements. The host in provider.tsx
 * supplies the veil and the scroll lock; everything painted inside — field,
 * wordmark, type — belongs to the visual, so a new one is a new file plus a
 * line in registry.ts.
 */
export type CurtainVisualProps = {
  accent: string
  /** The project's name. Each visual sets its own type, so the wordmark lives
   *  with the plugin rather than being imposed by the host. */
  word: string
}

export type CurtainVisual = ComponentType<CurtainVisualProps>

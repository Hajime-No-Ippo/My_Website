import type React from "react";

/**
 * Ported from SENTINEL (UN-DigitalTrade-AI-Mapper, rdtii-frontend) — the
 * workbench canvas type model, unchanged. The demo shell drives a subset.
 */

/** Canvas interaction tool — Select (move/marquee) vs Hand (pan). */
export type CanvasMode = "select" | "hand";

/** One workbench panel rendered as a node on the canvas. */
export type CanvasPanel = {
  id: string;
  title: string;
  element?: React.ReactNode;
  width?: number;
  /** Optional selector limiting where React Flow may start dragging the panel. */
  dragHandle?: string;
  /** Swiss/flat variant: render the node card square with no drop shadow. */
  flat?: boolean;
};

/** A spawnable panel type shown as a button in the toolbar palette. */
export type SpawnType = { id: string; label: string };

export type WorkbenchCanvasNodeKind = "panel" | "note" | "rag" | "material" | "session";

/** One message in a RAG chat session thread. */
export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  /** Deep-Thinking reasoning trace, shown collapsed above the answer. */
  reasoning?: string;
};

export type WorkbenchCanvasPosition = {
  x: number;
  y: number;
};

export type WorkbenchCanvasSize = {
  width?: number;
  height?: number;
};

// The typed node union lives in SentinelCanvas.tsx (`DemoNode`) — defining it
// here would make types.ts and the node component files import each other.

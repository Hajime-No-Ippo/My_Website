import type { Edge } from "@xyflow/react";
import type { CanvasPanel, ChatMessage, WorkbenchCanvasPosition } from "./types";
import { AuditDemo, DiscoveryDemo, SourceDemo } from "./demo-panels";

/**
 * The seeded demo graph: one real mapping (SG · Electronic Transactions Act
 * 2010) laid out as the pipeline actually runs — Discovery finds the law,
 * the file feeds Source extraction, Audit shows the gated score, and a
 * session thread interrogates the corpus. Everything is canned; the wiring,
 * dragging and resizing are the real canvas.
 */

export const DEMO_PANELS: CanvasPanel[] = [
  { id: "discovery", title: "Discovery", element: <DiscoveryDemo />, width: 440, flat: true },
  { id: "source", title: "Source", element: <SourceDemo />, width: 480, flat: true },
  { id: "audit", title: "Audit", element: <AuditDemo />, width: 460, flat: true },
];

export type DemoFile = {
  id: string;
  fileName: string;
  fileSize: number;
  previewUrl?: string;
  fileType?: string;
  ingestStatus?: "extracted" | "ingested";
};

/** A mock statute page so the file node's preview expander has something real to show. */
const STATUTE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="860" viewBox="0 0 640 860">
  <rect width="640" height="860" fill="#ffffff"/>
  <text x="320" y="70" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="#111827">ELECTRONIC TRANSACTIONS ACT 2010</text>
  <text x="320" y="100" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="#5a6573">(2020 Revised Edition)</text>
  <text x="60" y="160" font-family="Georgia, serif" font-size="15" font-weight="bold" fill="#111827">PART 2 — ELECTRONIC RECORDS AND SIGNATURES</text>
  <text x="60" y="200" font-family="Georgia, serif" font-size="14" font-weight="bold" fill="#111827">Signatures</text>
  <text x="60" y="230" font-family="Georgia, serif" font-size="13" fill="#26303d">8.—(1)  Where a rule of law requires a signature, or provides for certain</text>
  <text x="60" y="252" font-family="Georgia, serif" font-size="13" fill="#26303d">consequences if a document is not signed, that requirement is satisfied in</text>
  <text x="60" y="274" font-family="Georgia, serif" font-size="13" fill="#26303d">relation to an electronic record if the method used is as reliable as</text>
  <text x="60" y="296" font-family="Georgia, serif" font-size="13" fill="#26303d">appropriate for the purpose for which the electronic record was generated.</text>
  ${Array.from({ length: 14 }, (_, i) => `<rect x="60" y="${340 + i * 34}" width="${i % 3 === 2 ? 380 : 520}" height="10" fill="#e5e7eb"/>`).join("")}
</svg>`;

export const DEMO_FILES: DemoFile[] = [
  {
    id: "file-eta-2010",
    fileName: "electronic-transactions-act-2010.pdf",
    fileSize: 421_888,
    previewUrl: `data:image/svg+xml,${encodeURIComponent(STATUTE_SVG)}`,
    fileType: "image/svg+xml",
    ingestStatus: "extracted",
  },
];

export type DemoSession = {
  id: string;
  title: string;
  messages: ChatMessage[];
  files: { documentId: string; fileName: string }[];
};

export const DEMO_SESSIONS: DemoSession[] = [
  {
    id: "session-1",
    title: "Session · thread #1",
    files: [{ documentId: "doc-eta-2010", fileName: "electronic-transactions-act-2010.pdf" }],
    messages: [
      {
        role: "user",
        text: "Does the Act give electronic signatures the same standing as handwritten ones?",
      },
      {
        role: "assistant",
        reasoning:
          "Locate the operative provision on signature equivalence → §8. Check scope exclusions in the First Schedule → wills and negotiable instruments are excluded. A quote can only be cited if it matches the source character-for-character.",
        text:
          "Yes — **§8(1)**:\n\n> Where a rule of law requires a signature … that requirement is satisfied in relation to an electronic record if the method used is as reliable as appropriate for the purpose.\n\nQuote verified verbatim against the retrieved source. Note the **First Schedule** excludes wills and negotiable instruments, so the scope guard can only lower the indicator score — never raise it.",
      },
      {
        role: "user",
        text: "Which indicator does that map to?",
      },
      {
        role: "assistant",
        text:
          "**RDTII 2.1 · Electronic transactions · “Legal recognition of e-signatures.”** The deterministic scorer assigned **1** from the allowed range {0, 1}; a blind cross-model check agreed before the row shipped.",
      },
    ],
  },
];

export type DemoNote = { id: string; title: string; text: string };

export const DEMO_NOTES: DemoNote[] = [
  {
    id: "note-1",
    title: "Note",
    text:
      "This is SENTINEL's real workbench canvas, running in your browser.\n\nDrag cards by their strips, wire nodes together, resize, or drop a note. The data is one canned mapping (SG · ETA 2010) — in the product, these panels drive a live extraction backend.",
  },
];

export const DEMO_POSITIONS: Record<string, WorkbenchCanvasPosition> = {
  discovery: { x: 0, y: 0 },
  "file-eta-2010": { x: 80, y: 640 },
  source: { x: 560, y: 0 },
  audit: { x: 1160, y: 40 },
  "session-1": { x: 620, y: 560 },
  "note-1": { x: 1200, y: 620 },
};

export const DEMO_EDGES: Edge[] = [
  { id: "e-discovery-source", source: "discovery", target: "source", type: "step" },
  { id: "e-file-source", source: "file-eta-2010", target: "source", type: "step" },
  { id: "e-source-audit", source: "source", target: "audit", type: "step" },
  { id: "e-file-session", source: "file-eta-2010", target: "session-1", type: "step" },
];

/** Canned replies for the live session input — the demo has no backend. */
export const DEMO_CANNED_REPLIES: ChatMessage[] = [
  {
    role: "assistant",
    reasoning: "This canvas is a portfolio demo — no retrieval backend is attached, so answer with the standing demo response.",
    text:
      "In the full workbench this reply would be **retrieval-backed** — scoped to the documents attached to this session, with every quote verified against the corpus before it's shown. Here on the demo canvas, I'm canned. The dragging, wiring and layout you're using are the real thing though.",
  },
  {
    role: "assistant",
    text:
      "Still canned, I'm afraid — the knowledge base isn't wired into the portfolio. If you're curious how answers are gated in the product: a quote that can't be located **character-for-character** in the source is rejected rather than shown.",
  },
];

"use client";

import "@xyflow/react/dist/style.css";
import "./canvas-demo.css";

import { memo, useCallback, useMemo, useRef, useState, type RefObject } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type ReactFlowInstance,
  type XYPosition,
} from "@xyflow/react";

import { PanelNode, type PanelNodeData } from "./PanelNode";
import { NoteNode, type NoteNodeData } from "./NoteNode";
import { FileNode, type FileNodeData } from "./FileNode";
import { SessionNode, type SessionNodeData } from "./SessionNode";
import { CanvasToolbar } from "./CanvasToolbar";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CanvasMode, ChatMessage, WorkbenchCanvasPosition, WorkbenchCanvasSize } from "./types";
import {
  DEMO_CANNED_REPLIES,
  DEMO_EDGES,
  DEMO_FILES,
  DEMO_NOTES,
  DEMO_PANELS,
  DEMO_POSITIONS,
  DEMO_SESSIONS,
} from "./demo-data";

/**
 * SENTINEL's workbench canvas, migrated from the hackathon frontend
 * (UN-DigitalTrade-AI-Mapper, React 18 + Vite) and slimmed into an embeddable
 * demo: the node components are the originals; the backend paths (upload,
 * RAG ingest, layout sync) are replaced by canned data from demo-data.tsx.
 *
 * Render architecture — the original rebuilt every node object from derived
 * state on each change, so one drag frame re-rendered every card (visible as
 * flashing). This shell inverts that: the Node[] array IS the state, deltas
 * arrive via applyNodeChanges, and node components are memo()-ed. Only a node
 * whose position/data/selection actually changed gets a new identity, so
 * dragging one card no longer re-renders the markdown, motion springs and
 * previews in all the others.
 *
 * The invariant that makes it safe: callbacks embedded in node data are
 * created once (at seed time) and reach the live handlers through a ref —
 * they must only ever close over stable things (the ref, setState functions).
 *
 * Embed rules: the canvas never owns the page. Wheel scrolls the page (zoom
 * is pinch/controls only), and the shell fills whatever box the caller sizes.
 */

// memo() is half of the no-flash contract: it lets React skip a node's whole
// subtree when its props are unchanged. The other half is below — node data
// objects keep their identity unless their own content changed.
const nodeTypes = {
  panel: memo(PanelNode),
  note: memo(NoteNode),
  file: memo(FileNode),
  session: memo(SessionNode),
};

type DemoNode =
  | Node<PanelNodeData, "panel">
  | Node<NoteNodeData, "note">
  | Node<FileNodeData, "file">
  | Node<SessionNodeData, "session">;

/** The live handler set. Node data closures reach it through a ref so the
 *  closures themselves never go stale and never need rebuilding. */
type CanvasHandlers = {
  resizeNode: (id: string, size: WorkbenchCanvasSize) => void;
  resetNodeSize: (id: string) => void;
  deleteNode: (id: string) => void;
  patchNote: (id: string, patch: Partial<{ title: string; text: string }>) => void;
  sendToSession: (id: string, question: string) => void;
};

function lazyHandlers(ref: RefObject<CanvasHandlers | null>): CanvasHandlers {
  return {
    resizeNode: (id, size) => ref.current?.resizeNode(id, size),
    resetNodeSize: (id) => ref.current?.resetNodeSize(id),
    deleteNode: (id) => ref.current?.deleteNode(id),
    patchNote: (id, patch) => ref.current?.patchNote(id, patch),
    sendToSession: (id, question) => ref.current?.sendToSession(id, question),
  };
}

function makeNoteNode(
  h: CanvasHandlers,
  id: string,
  position: XYPosition,
  text: string,
  startEditing = false,
): DemoNode {
  return {
    id,
    type: "note",
    position,
    data: {
      title: "Note",
      text,
      startEditing,
      onChange: (patch) => h.patchNote(id, patch),
      onResize: (size) => h.resizeNode(id, size),
      onDelete: () => h.deleteNode(id),
    },
  };
}

/** Seed the demo graph. Every callback goes through `h`, so the data objects
 *  built here stay valid for the lifetime of the component. */
function buildDemoNodes(h: CanvasHandlers): DemoNode[] {
  return [
    ...DEMO_PANELS.map(
      (p): DemoNode => ({
        id: p.id,
        type: "panel",
        dragHandle: ".wb-drag-strip, .panel-header",
        position: DEMO_POSITIONS[p.id] ?? { x: 40, y: 40 },
        data: {
          title: p.title,
          element: p.element ?? null,
          width: p.width,
          flat: p.flat,
          onResize: (size) => h.resizeNode(p.id, size),
          onDelete: () => h.deleteNode(p.id),
        },
      }),
    ),
    ...DEMO_NOTES.map((n) => makeNoteNode(h, n.id, DEMO_POSITIONS[n.id] ?? { x: 120, y: 120 }, n.text)),
    ...DEMO_SESSIONS.map(
      (s): DemoNode => ({
        id: s.id,
        type: "session",
        dragHandle: ".panel-header",
        position: DEMO_POSITIONS[s.id] ?? { x: 260, y: 260 },
        data: {
          title: s.title,
          messages: s.messages,
          files: s.files,
          width: 400,
          onSend: (question) => h.sendToSession(s.id, question),
          onResize: (size) => h.resizeNode(s.id, size),
          onDelete: () => h.deleteNode(s.id),
        },
      }),
    ),
    ...DEMO_FILES.map(
      (f): DemoNode => ({
        id: f.id,
        type: "file",
        position: DEMO_POSITIONS[f.id] ?? { x: 240, y: 240 },
        data: {
          fileName: f.fileName,
          fileSize: f.fileSize,
          previewUrl: f.previewUrl,
          fileType: f.fileType,
          ingestStatus: f.ingestStatus,
          onResize: (size) => h.resizeNode(f.id, size),
          onResetSize: () => h.resetNodeSize(f.id),
          onDelete: () => h.deleteNode(f.id),
        },
      }),
    ),
  ];
}

const nodeW = (n: Node) => n.measured?.width ?? (typeof n.width === "number" ? n.width : 320);
const nodeH = (n: Node) => n.measured?.height ?? (typeof n.height === "number" ? n.height : 160);

export default function SentinelCanvas({ className }: { className?: string }) {
  const flowRef = useRef<ReactFlowInstance<DemoNode, Edge> | null>(null);
  const handlersRef = useRef<CanvasHandlers | null>(null);
  const noteCounter = useRef(0);
  const cannedIndex = useRef(0);

  const [nodes, setNodes] = useState<DemoNode[]>(() => buildDemoNodes(lazyHandlers(handlersRef)));
  const [edges, setEdges] = useState<Edge[]>(DEMO_EDGES);
  const [mode, setMode] = useState<CanvasMode>("select");

  /** Patch one node's data immutably — only that node gets a new identity. */
  const patchNodeData = useCallback((id: string, patch: Record<string, unknown>) => {
    setNodes((ns) => ns.map((n) => (n.id === id ? ({ ...n, data: { ...n.data, ...patch } } as DemoNode) : n)));
  }, []);

  // Reassigned every render so the closures always see fresh state; each
  // implementation may only use setState functions and refs (all stable).
  handlersRef.current = {
    resizeNode: (id, size) => patchNodeData(id, { width: size.width, height: size.height }),
    resetNodeSize: (id) => patchNodeData(id, { width: undefined, height: undefined }),
    // deleteElements runs React Flow's full deletion flow, so wires attached
    // to the deleted node fall away with it.
    deleteNode: (id) => void flowRef.current?.deleteElements({ nodes: [{ id }] }),
    patchNote: (id, patch) => patchNodeData(id, patch),
    sendToSession: (id, question) => {
      const push = (message: ChatMessage, pending: boolean) =>
        setNodes((ns) =>
          ns.map((n) =>
            n.id === id && n.type === "session"
              ? { ...n, data: { ...n.data, messages: [...n.data.messages, message], pending } }
              : n,
          ),
        );
      push({ role: "user", text: question }, true);
      // No retrieval backend in the demo — canned rota, with enough delay for
      // the pending dots to read as a real round-trip.
      const reply = DEMO_CANNED_REPLIES[cannedIndex.current % DEMO_CANNED_REPLIES.length];
      cannedIndex.current += 1;
      window.setTimeout(() => push(reply, false), 1100);
    },
  };

  const onNodesChange = useCallback((changes: NodeChange<DemoNode>[]) => {
    setNodes((ns) => applyNodeChanges(changes, ns));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((es) => addEdge(connection, es));
  }, []);

  const addNote = useCallback((position: XYPosition) => {
    noteCounter.current += 1;
    const id = `custom-note-${noteCounter.current}`;
    // Selected + already in edit mode: the user asked for a note, so it opens
    // ready to type rather than needing a double-click first.
    setNodes((ns) => [
      ...ns.map((n) => (n.selected ? { ...n, selected: false } : n)),
      { ...makeNoteNode(lazyHandlers(handlersRef), id, position, "", true), selected: true },
    ]);
  }, []);

  // Swiss wiring: sharp right-angle edges, black ink, dashed flow on every
  // wire. Keyed on node *ids* rather than the nodes array, so drag frames
  // (which change node identities but not membership) reuse the same edges.
  const nodeIdsKey = nodes
    .map((n) => n.id)
    .sort()
    .join("|");
  const renderedEdges = useMemo<Edge[]>(() => {
    const visible = new Set(nodeIdsKey.split("|"));
    return edges
      .filter((e) => visible.has(e.source) && visible.has(e.target))
      .map((e): Edge => ({ ...e, type: "step", animated: true, style: { stroke: "#111827", strokeWidth: 1.5, ...e.style } }));
  }, [edges, nodeIdsKey]);

  // ── Hard no-overlap invariant (ported) ──────────────────────────────────
  // On drag-stop the moved node stays put; every other card is pushed out of
  // the way along the axis of least displacement.
  const COLLISION_GAP = 32;
  const resolveCollisions = useCallback((fixedId?: string | null) => {
    const live = flowRef.current?.getNodes() ?? [];
    if (live.length < 2) return;
    const rects = live.map((n) => ({ id: n.id, x: n.position.x, y: n.position.y, w: nodeW(n), h: nodeH(n) }));
    let changed = false;
    for (let pass = 0; pass < 200; pass++) {
      let any = false;
      for (let i = 0; i < rects.length; i++) {
        for (let j = i + 1; j < rects.length; j++) {
          const a = rects[i];
          const b = rects[j];
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + COLLISION_GAP;
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + COLLISION_GAP;
          if (ox <= 0 || oy <= 0) continue;
          any = true;
          changed = true;
          if (ox < oy) {
            const s = a.x + a.w / 2 <= b.x + b.w / 2 ? 1 : -1;
            if (a.id === fixedId) b.x += s * ox;
            else if (b.id === fixedId) a.x -= s * ox;
            else {
              a.x -= (s * ox) / 2;
              b.x += (s * ox) / 2;
            }
          } else {
            const s = a.y + a.h / 2 <= b.y + b.h / 2 ? 1 : -1;
            if (a.id === fixedId) b.y += s * oy;
            else if (b.id === fixedId) a.y -= s * oy;
            else {
              a.y -= (s * oy) / 2;
              b.y += (s * oy) / 2;
            }
          }
        }
      }
      if (!any) break;
    }
    if (!changed) return;
    const moved = new Map(rects.map((r) => [r.id, { x: r.x, y: r.y }]));
    setNodes((ns) =>
      ns.map((n) => {
        const p = moved.get(n.id);
        return p && (p.x !== n.position.x || p.y !== n.position.y) ? { ...n, position: p } : n;
      }),
    );
  }, []);

  // Tidy: connected chains share a row in pipeline order; loose cards follow.
  const tidyLayout = useCallback(() => {
    const ROLE_RANK: [RegExp, number][] = [
      [/^discovery/, 0],
      [/^file-/, 1],
      [/^source/, 2],
      [/^session-/, 3],
      [/^audit/, 4],
    ];
    const roleOf = (id: string) => ROLE_RANK.find(([re]) => re.test(id))?.[1] ?? 6;
    const live = flowRef.current?.getNodes() ?? [];
    if (!live.length) return;
    const adjacency: Record<string, string[]> = {};
    for (const e of edges) {
      (adjacency[e.source] ??= []).push(e.target);
      (adjacency[e.target] ??= []).push(e.source);
    }
    const liveIds = new Set(live.map((n) => n.id));
    const seen = new Set<string>();
    const components: string[][] = [];
    for (const n of live) {
      if (seen.has(n.id)) continue;
      const comp: string[] = [];
      const queue = [n.id];
      seen.add(n.id);
      while (queue.length) {
        const cur = queue.pop() as string;
        comp.push(cur);
        for (const nb of adjacency[cur] ?? []) {
          if (liveIds.has(nb) && !seen.has(nb)) {
            seen.add(nb);
            queue.push(nb);
          }
        }
      }
      components.push(comp);
    }
    components.sort((a, b) => b.length - a.length);
    const byId = new Map(live.map((n) => [n.id, n]));
    const GAP = 60;
    const next = new Map<string, WorkbenchCanvasPosition>();
    let y = 40;
    for (const comp of components) {
      comp.sort((a, b) => roleOf(a) - roleOf(b) || a.localeCompare(b));
      let x = 40;
      let rowHeight = 0;
      for (const id of comp) {
        const node = byId.get(id);
        if (!node) continue;
        next.set(id, { x, y });
        x += nodeW(node) + GAP;
        rowHeight = Math.max(rowHeight, nodeH(node));
      }
      y += rowHeight + GAP;
    }
    setNodes((ns) =>
      ns.map((n) => {
        const p = next.get(n.id);
        return p && (p.x !== n.position.x || p.y !== n.position.y) ? { ...n, position: p } : n;
      }),
    );
    requestAnimationFrame(() => {
      void flowRef.current?.fitView({ padding: 0.12, maxZoom: 1 });
    });
  }, [edges]);

  const handleReset = useCallback(() => {
    noteCounter.current = 0;
    cannedIndex.current = 0;
    setNodes(buildDemoNodes(lazyHandlers(handlersRef)));
    setEdges(DEMO_EDGES);
    requestAnimationFrame(() => {
      void flowRef.current?.fitView({ padding: 0.12, maxZoom: 1 });
    });
  }, []);

  const handMode = mode === "hand";
  // The dock is a horizontal row of labelled controls — it overflows a phone
  // viewport and covers the canvas it is meant to act on. Desktop only.
  // Breakpoint is the hook's 768px; canvas-demo.css hides it below the same
  // width so it never paints in the gap before this effect-driven flag flips.
  const isMobile = useIsMobile();

  return (
    <div className={`sentinel-canvas ${handMode ? "wb-hand" : "wb-select"} ${className ?? ""}`} style={{ position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance) => {
          flowRef.current = instance;
        }}
        onNodeDragStop={(_event, node) => resolveCollisions(node.id)}
        deleteKeyCode={["Delete", "Backspace"]}
        minZoom={0.25}
        maxZoom={1.4}
        fitView
        fitViewOptions={{ padding: 0.12, maxZoom: 0.9 }}
        style={{ background: "#f3f1ea" }}
        nodesDraggable={!handMode}
        nodesConnectable={!handMode}
        elementsSelectable={!handMode}
        zoomOnScroll={false}
        panOnScroll={false}
        preventScrolling={false}
        // Double-click is the note's edit gesture. d3-zoom listens natively on
        // the pane — an ancestor of every node — so a node's React handler
        // cannot stop it from firing; the only reliable fix is to turn it off.
        // No loss here: scroll-zoom is already off for embed reasons.
        zoomOnDoubleClick={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={3} color="#c2c8d0" bgColor="#f3f1ea" />
        <MiniMap pannable zoomable maskColor="rgba(0,0,0,0.4)" />
        {!isMobile && (
          <CanvasToolbar
            mode={mode}
            onSetMode={setMode}
            onAddPanel={addNote}
            onTidy={tidyLayout}
            onReset={handleReset}
          />
        )}
      </ReactFlow>
    </div>
  );
}

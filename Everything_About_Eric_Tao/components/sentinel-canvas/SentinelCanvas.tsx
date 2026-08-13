"use client";

import "@xyflow/react/dist/style.css";
import "./canvas-demo.css";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  addEdge,
  applyEdgeChanges,
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
import type { CanvasMode, ChatMessage, WorkbenchCanvasPosition, WorkbenchCanvasSize } from "./types";
import {
  DEMO_CANNED_REPLIES,
  DEMO_EDGES,
  DEMO_FILES,
  DEMO_NOTES,
  DEMO_PANELS,
  DEMO_POSITIONS,
  DEMO_SESSIONS,
  type DemoNote,
  type DemoSession,
} from "./demo-data";

/**
 * SENTINEL's workbench canvas, migrated from the hackathon frontend
 * (UN-DigitalTrade-AI-Mapper, React 18 + Vite) and slimmed into an embeddable
 * demo: the node components are the originals; the backend paths (upload,
 * RAG ingest, layout sync) are replaced by canned data from demo-data.tsx.
 * Interaction — drag, wire, resize, notes, tidy, collision push-apart — is
 * the real thing.
 *
 * Embed rules: the canvas never owns the page. Wheel scrolls the page (zoom
 * is pinch/controls only), and the shell fills whatever box the caller sizes.
 */

const nodeTypes = { panel: PanelNode, note: NoteNode, file: FileNode, session: SessionNode };

const nodeW = (n: Node) => n.measured?.width ?? (typeof n.width === "number" ? n.width : 320);
const nodeH = (n: Node) => n.measured?.height ?? (typeof n.height === "number" ? n.height : 160);

export default function SentinelCanvas({ className }: { className?: string }) {
  const flowRef = useRef<ReactFlowInstance | null>(null);
  const [positions, setPositions] = useState<Record<string, WorkbenchCanvasPosition>>(DEMO_POSITIONS);
  const [sizes, setSizes] = useState<Record<string, WorkbenchCanvasSize>>({});
  const [removed, setRemoved] = useState<Record<string, boolean>>({});
  const [edges, setEdges] = useState<Edge[]>(DEMO_EDGES);
  const [notes, setNotes] = useState<DemoNote[]>(DEMO_NOTES);
  const [sessions, setSessions] = useState<DemoSession[]>(DEMO_SESSIONS);
  const [pendingSessions, setPendingSessions] = useState<Record<string, boolean>>({});
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<CanvasMode>("select");
  const noteCounter = useRef(0);
  const cannedIndex = useRef(0);

  const resizeNode = useCallback((id: string, size: WorkbenchCanvasSize) => {
    setSizes((prev) => ({ ...prev, [id]: size }));
  }, []);
  const resetNodeSize = useCallback((id: string) => {
    setSizes((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);
  const removeNode = useCallback((id: string) => {
    setRemoved((prev) => ({ ...prev, [id]: true }));
  }, []);
  const updateNote = useCallback((id: string, patch: Partial<{ title: string; text: string }>) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  const addNote = useCallback((position: XYPosition) => {
    noteCounter.current += 1;
    const id = `custom-note-${noteCounter.current}`;
    setNotes((prev) => [...prev, { id, title: "Note", text: "" }]);
    setPositions((prev) => ({ ...prev, [id]: position }));
  }, []);

  // The demo has no retrieval backend — replies come from a canned rota, with
  // enough delay for the pending dots to read as a real round-trip.
  const sendToSession = useCallback((sessionId: string, question: string) => {
    const userMessage: ChatMessage = { role: "user", text: question };
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, userMessage] } : s)));
    setPendingSessions((prev) => ({ ...prev, [sessionId]: true }));
    const reply = DEMO_CANNED_REPLIES[cannedIndex.current % DEMO_CANNED_REPLIES.length];
    cannedIndex.current += 1;
    window.setTimeout(() => {
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, messages: [...s.messages, reply] } : s)));
      setPendingSessions((prev) => ({ ...prev, [sessionId]: false }));
    }, 1100);
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      for (const change of changes) {
        if (change.type === "position" && change.position) {
          const position = change.position;
          setPositions((prev) => ({ ...prev, [change.id]: position }));
        } else if (change.type === "select") {
          setSelectedIds((prev) => ({ ...prev, [change.id]: change.selected }));
        } else if (change.type === "remove") {
          removeNode(change.id);
        }
      }
    },
    [removeNode],
  );

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((es) => applyEdgeChanges(changes, es));
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    setEdges((es) => addEdge(connection, es));
  }, []);

  const nodes = useMemo<Node[]>(
    () =>
      [
        ...DEMO_PANELS.filter((p) => !removed[p.id]).map((p) => ({
          id: p.id,
          type: "panel",
          dragHandle: ".wb-drag-strip, .panel-header",
          position: positions[p.id] ?? { x: 40, y: 40 },
          data: {
            title: p.title,
            element: p.element,
            width: sizes[p.id]?.width ?? p.width,
            height: sizes[p.id]?.height,
            flat: p.flat,
            onResize: (size: WorkbenchCanvasSize) => resizeNode(p.id, size),
            onDelete: () => removeNode(p.id),
          } satisfies PanelNodeData,
        })),
        ...notes
          .filter((n) => !removed[n.id])
          .map((n) => ({
            id: n.id,
            type: "note",
            position: positions[n.id] ?? { x: 120, y: 120 },
            data: {
              title: n.title,
              text: n.text,
              onChange: (patch: Partial<{ title: string; text: string }>) => updateNote(n.id, patch),
              width: sizes[n.id]?.width,
              height: sizes[n.id]?.height,
              onResize: (size: WorkbenchCanvasSize) => resizeNode(n.id, size),
              onDelete: () => removeNode(n.id),
            } satisfies NoteNodeData,
          })),
        ...sessions
          .filter((s) => !removed[s.id])
          .map((s) => ({
            id: s.id,
            type: "session",
            dragHandle: ".panel-header",
            position: positions[s.id] ?? { x: 260, y: 260 },
            data: {
              title: s.title,
              messages: s.messages,
              pending: !!pendingSessions[s.id],
              onSend: (question: string) => sendToSession(s.id, question),
              files: s.files,
              width: sizes[s.id]?.width ?? 400,
              height: sizes[s.id]?.height,
              onResize: (size: WorkbenchCanvasSize) => resizeNode(s.id, size),
              onDelete: () => removeNode(s.id),
            } satisfies SessionNodeData,
          })),
        ...DEMO_FILES.filter((f) => !removed[f.id]).map((f) => ({
          id: f.id,
          type: "file",
          position: positions[f.id] ?? { x: 240, y: 240 },
          data: {
            fileName: f.fileName,
            fileSize: f.fileSize,
            previewUrl: f.previewUrl,
            fileType: f.fileType,
            ingestStatus: f.ingestStatus,
            width: sizes[f.id]?.width,
            height: sizes[f.id]?.height,
            onResize: (size: WorkbenchCanvasSize) => resizeNode(f.id, size),
            onResetSize: () => resetNodeSize(f.id),
            onDelete: () => removeNode(f.id),
          } satisfies FileNodeData,
        })),
      ].map((n) => ({ ...n, selected: !!selectedIds[n.id] })),
    [notes, sessions, pendingSessions, positions, sizes, removed, selectedIds, resizeNode, resetNodeSize, removeNode, updateNote, sendToSession],
  );

  // Swiss wiring: sharp right-angle edges, black ink, dashed flow on every wire.
  const renderedEdges = useMemo<Edge[]>(() => {
    const visible = new Set(nodes.map((n) => n.id));
    return edges
      .filter((e) => visible.has(e.source) && visible.has(e.target))
      .map((e): Edge => ({ ...e, type: "step", animated: true, style: { stroke: "#111827", strokeWidth: 1.5, ...e.style } }));
  }, [edges, nodes]);

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
    setPositions((prev) => {
      const next = { ...prev };
      for (const r of rects) next[r.id] = { x: r.x, y: r.y };
      return next;
    });
  }, []);

  // Tidy: connected chains share a row in pipeline order; loose cards follow.
  const ROLE_RANK: [RegExp, number][] = [
    [/^discovery/, 0],
    [/^file-/, 1],
    [/^source/, 2],
    [/^session-/, 3],
    [/^audit/, 4],
  ];
  const roleOf = (id: string) => ROLE_RANK.find(([re]) => re.test(id))?.[1] ?? 6;
  const tidyLayout = useCallback(() => {
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
    const next: Record<string, WorkbenchCanvasPosition> = {};
    let y = 40;
    for (const comp of components) {
      comp.sort((a, b) => roleOf(a) - roleOf(b) || a.localeCompare(b));
      let x = 40;
      let rowHeight = 0;
      for (const id of comp) {
        const node = byId.get(id);
        if (!node) continue;
        next[id] = { x, y };
        x += nodeW(node) + GAP;
        rowHeight = Math.max(rowHeight, nodeH(node));
      }
      y += rowHeight + GAP;
    }
    setPositions((prev) => ({ ...prev, ...next }));
    requestAnimationFrame(() => {
      void flowRef.current?.fitView({ padding: 0.12, maxZoom: 1 });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ROLE_RANK/roleOf are render-stable constants
  }, [edges]);

  const handleReset = useCallback(() => {
    setPositions(DEMO_POSITIONS);
    setSizes({});
    setRemoved({});
    setEdges(DEMO_EDGES);
    setNotes(DEMO_NOTES);
    setSessions(DEMO_SESSIONS);
    setPendingSessions({});
    setSelectedIds({});
    noteCounter.current = 0;
    cannedIndex.current = 0;
    requestAnimationFrame(() => {
      void flowRef.current?.fitView({ padding: 0.12, maxZoom: 1 });
    });
  }, []);

  const handMode = mode === "hand";

  return (
    <div className={`sentinel-canvas ${handMode ? "wb-hand" : "wb-select"} ${className ?? ""}`} style={{ position: "relative" }}>
      <ReactFlow
        nodes={nodes}
        edges={renderedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={(instance: ReactFlowInstance) => {
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
      >
        <Background variant={BackgroundVariant.Dots} gap={28} size={3} color="#c2c8d0" bgColor="#f3f1ea" />
        <MiniMap pannable zoomable maskColor="rgba(0,0,0,0.4)" />
        <CanvasToolbar
          mode={mode}
          onSetMode={setMode}
          onAddPanel={addNote}
          onTidy={tidyLayout}
          onReset={handleReset}
        />
      </ReactFlow>
    </div>
  );
}

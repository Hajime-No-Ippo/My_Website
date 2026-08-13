import React, { useRef } from "react";
import { Panel, useReactFlow, type XYPosition } from "@xyflow/react";
import { X, StickyNote, Plus, MousePointer2, Lock, RotateCcw, LayoutGrid } from "lucide-react";
import type { CanvasMode, SpawnType } from "./types";

/**
 * Reusable FigJam-style floating dock, anchored to the bottom-center of a canvas.
 * Must be rendered as a child of <ReactFlow> so it can use `useReactFlow()`.
 *
 * Every action section is optional — pass only the props for the controls you
 * want, and they render conditionally. Unlike the original (which owned the
 * whole viewport), this port is embed-aware: "center of view" is the center
 * of the enclosing .react-flow element, not the window.
 */
export function CanvasToolbar({
  mode,
  onSetMode,
  spawnTypes = [],
  onSpawnPanel,
  onAddPanel,
  onReset,
  onTidy,
  onExit,
}: {
  mode?: CanvasMode;
  onSetMode?: (mode: CanvasMode) => void;
  spawnTypes?: SpawnType[];
  onSpawnPanel?: (panelId: string, position: XYPosition) => void;
  onAddPanel?: (position: XYPosition) => void;
  onReset?: () => void;
  onTidy?: () => void;
  onExit?: () => void;
}) {
  const { screenToFlowPosition } = useReactFlow();
  const dockRef = useRef<HTMLDivElement>(null);
  const centerOfView = () => {
    const rect = dockRef.current?.closest(".react-flow")?.getBoundingClientRect();
    return screenToFlowPosition(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    );
  };

  // Swiss dock: square, cream, black hairlines; mono uppercase labels.
  const iconBtn: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 36,
    height: 36,
    minHeight: 0,
    padding: 0,
    borderRadius: 0,
    border: "none",
    background: "transparent",
    color: "#111827",
    cursor: "pointer",
  };
  const modeBtn = (active: boolean): React.CSSProperties => ({
    ...iconBtn,
    background: active ? "#111827" : "transparent",
    color: active ? "#f3f1ea" : "#111827",
  });
  const textBtn = (color: string): React.CSSProperties => ({
    ...iconBtn,
    width: "auto",
    padding: "0 10px",
    gap: 5,
    color,
    fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
    fontSize: "0.66rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  });
  const divider = <div style={{ width: 1.5, height: 22, background: "#111827", margin: "0 4px" }} />;

  return (
    <Panel position="bottom-center">
      <div
        ref={dockRef}
        className="nodrag nowheel"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: 6,
          marginBottom: 12,
          borderRadius: 0,
          background: "#f3f1ea",
          border: "2px solid #111827",
          boxShadow: "none",
        }}
      >
        {mode && onSetMode && (
          <>
            <button
              style={modeBtn(mode === "select")}
              title="Interact — V"
              aria-pressed={mode === "select"}
              onClick={() => onSetMode("select")}
            >
              <MousePointer2 size={15} />
            </button>
            <button
              style={modeBtn(mode === "hand")}
              title="Lock canvas — pan only (H)"
              aria-pressed={mode === "hand"}
              onClick={() => onSetMode("hand")}
            >
              <Lock size={15} />
            </button>
            {divider}
          </>
        )}

        {spawnTypes.length > 0 && onSpawnPanel && (
          <>
            {spawnTypes.map((s) => (
              <button
                key={s.id}
                style={textBtn("#111827")}
                title={`Add ${s.label} panel`}
                onClick={() => onSpawnPanel(s.id, centerOfView())}
              >
                <Plus size={15} /> {s.label}
              </button>
            ))}
            {divider}
          </>
        )}

        {onAddPanel && (
          <>
            <button style={textBtn("#111827")} title="Add blank note" onClick={() => onAddPanel(centerOfView())}>
              <StickyNote size={16} /> Note
            </button>
            {divider}
          </>
        )}

        {onTidy && (
          <button style={textBtn("#111827")} title="Tidy: auto-arrange all cards on a clean grid" onClick={onTidy}>
            <LayoutGrid size={15} /> Tidy
          </button>
        )}
        {onReset && (
          <button style={textBtn("#111827")} title="Reset layout" onClick={onReset}>
            <RotateCcw size={15} /> Reset
          </button>
        )}

        {onExit && (
          <>
            {divider}
            <button style={textBtn("#9f2d20")} title="Exit canvas" onClick={onExit}>
              <X size={16} /> Exit
            </button>
          </>
        )}
      </div>
    </Panel>
  );
}

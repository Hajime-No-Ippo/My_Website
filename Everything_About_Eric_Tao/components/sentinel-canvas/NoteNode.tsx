import React, { useEffect, useRef, useState } from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";
import { Trash2 } from "lucide-react";
import { NOTE_MIN_SIZE, RESIZER_HANDLE_STYLE, RESIZER_LINE_STYLE } from "./resize";
import type { WorkbenchCanvasSize } from "./types";

export type NoteNodeData = {
  title: string;
  text: string;
  onChange: (patch: Partial<{ title: string; text: string }>) => void;
  width?: number;
  height?: number;
  onResize?: (size: WorkbenchCanvasSize) => void;
  onDelete: () => void;
  /** Open a freshly created note straight into edit mode — the user asked for
   *  a note, so making them double-click it before typing is a dead step. */
  startEditing?: boolean;
};

/**
 * A blank, user-created panel (sticky-note style).
 *
 * Two modes, because one surface has to serve both dragging and writing:
 *  - idle: the text is inert (pointer-events off), so a press anywhere on the
 *    note — body included — starts a React Flow drag.
 *  - editing: entered by double-click, the textarea takes over as `nodrag`
 *    and gets focus. Escape, blur, or deselecting the node leaves again.
 * The gate is local state; nothing about it needs to reach the canvas shell.
 */
export function NoteNode({ id, data, selected }: { id: string; data: NoteNodeData; selected?: boolean }) {
  const nodeWidth = data.width ?? 240;
  const nodeHeight = data.height;
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const [editing, setEditing] = useState(!!data.startEditing);

  // Focus on entry and put the caret after the existing text.
  //
  // The retry is for notes created by the toolbar: React Flow renders a
  // brand-new node with `visibility: hidden` until it has measured it, and
  // focus() on a hidden element is a silent no-op. Retrying across a few
  // frames until it lands beats guessing a delay that holds on every machine.
  useEffect(() => {
    if (!editing) return;
    let frame = 0;
    let attempts = 0;
    const focusWhenVisible = () => {
      const area = areaRef.current;
      if (!area) return;
      area.focus();
      if (document.activeElement !== area && attempts++ < 20) {
        frame = requestAnimationFrame(focusWhenVisible);
        return;
      }
      area.setSelectionRange(area.value.length, area.value.length);
    };
    focusWhenVisible();
    return () => cancelAnimationFrame(frame);
  }, [editing]);

  // Clicking another node (or the pane) deselects this one — leave edit mode
  // with it, so a note never keeps a caret it no longer owns. Guarded on the
  // true→false transition: a bare `if (!selected)` also fires on mount, which
  // would slam the gate shut on a note opened via `startEditing`.
  const wasSelected = useRef(selected);
  useEffect(() => {
    if (wasSelected.current && !selected) setEditing(false);
    wasSelected.current = selected;
  }, [selected]);

  return (
    <div
      title={editing ? undefined : "Double-click to edit"}
      onDoubleClick={() => setEditing(true)}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: nodeWidth,
        height: nodeHeight,
        borderRadius: 0, // Swiss note: square, specimen yellow, black frame
        overflow: selected ? "visible" : "hidden",
        background: "#f7d445",
        border: "1.5px solid #111827",
        // Editing is otherwise invisible on a note with no chrome — the inset
        // ring is the only cue that keystrokes will land here.
        boxShadow: editing ? "inset 0 0 0 2px #111827" : "none",
        cursor: editing ? "default" : "grab",
      }}
    >
      <NodeResizer
        nodeId={id}
        isVisible={selected}
        minWidth={NOTE_MIN_SIZE.width}
        minHeight={NOTE_MIN_SIZE.height}
        color="#111827"
        handleStyle={RESIZER_HANDLE_STYLE}
        lineStyle={RESIZER_LINE_STYLE}
        onResize={(_event, params) => data.onResize?.({ width: params.width, height: params.height })}
      />

      <Handle type="target" position={Position.Top} style={{ background: "#111827" }} />

      {/* No title — the note is just a writing surface. Delete floats in the
          corner while the note is selected. */}
      {selected && (
        <button
          className="nodrag"
          title="Delete file node"
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete();
          }}
          style={{
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            height: 24,
            minHeight: 0,
            padding: "0 10px",
            borderRadius: 0,
            border: "none",
            background: "#9f2d20",
            color: "white",
            fontSize: "0.7rem",
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
            boxShadow: "none",
          }}
        >
          <Trash2 size={12} /> Delete
        </button>
      )}


      <textarea
        ref={areaRef}
        // `nodrag` only while editing — that class is exactly what stops React
        // Flow starting a drag, which is the behaviour we want back when idle.
        className={editing ? "nodrag nowheel" : undefined}
        value={data.text}
        placeholder={editing ? "Write something…" : "Double-click to write…"}
        readOnly={!editing}
        onChange={(e) => data.onChange({ text: e.target.value })}
        // Keep drags and marquee selection from being hijacked by the caret.
        onMouseDown={(e) => e.stopPropagation()}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            areaRef.current?.blur(); // onBlur closes the gate
          }
        }}
        style={{
          display: "block",
          width: "100%",
          flex: nodeHeight ? 1 : undefined,
          minHeight: 120,
          border: "none",
          resize: "none",
          background: "transparent",
          outline: "none",
          padding: "10px 12px",
          fontSize: "0.85rem",
          color: "#111827",
          fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
          // Idle: inert, so the press lands on the wrapper and React Flow drags
          // the node instead of the browser dropping a caret into the text.
          pointerEvents: editing ? "auto" : "none",
          userSelect: editing ? "text" : "none",
          cursor: editing ? "text" : "grab",
        }}
      />

      <Handle type="source" position={Position.Bottom} style={{ background: "#111827" }} />
    </div>
  );
}

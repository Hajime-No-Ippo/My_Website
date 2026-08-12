"use client";

import { type CSSProperties, Fragment, useEffect, useRef, useState } from "react";
import BallCursor from "@/components/ball-cursor";
import "@fontsource/boldonse/400.css";

// Standalone brand-logo display — a type-specimen panel (the reference layout).
// The wordmark is set at a fixed 200px. For each glyph we measure the exact ink
// edges — horizontal from the Canvas TextMetrics ink box
// (actualBoundingBox{Ascent,Descent,Left,Right}) at 200px, vertical against the
// DOM box that `text-box: trim-both cap alphabetic` trims to the real cap-height
// and alphabetic baseline — then project each edge as a registration line across
// the whole panel (verticals at left/right, horizontals at top/bottom). Per-glyph
// advance widths (per-mille of em) print under each column, like the reference.

const BRAND_BG = { backgroundColor: "#17593a" } as const;
const LINE = "pointer-events-none absolute bg-[#86efac]/70";
const WORD = "Sentinel";
const FS = 200; // px

const WORD_STYLE = {
  fontFamily: '"Boldonse", sans-serif',
  fontSize: `${FS}px`,
  lineHeight: 1,
  textBox: "trim-both cap alphabetic",
} as CSSProperties;

type GlyphBox = { left: number; top: number; width: number; height: number };
type Mark = { center: number; unit: number };

/**
 * The horizontal registration lines assume the DOM box has been trimmed to the
 * cap-height and alphabetic baseline, which only holds where `text-box-trim` is
 * supported (not in Firefox). Untrimmed, the box keeps its line-box leading and
 * every horizontal line would land wrong, so we fall back to the font's own
 * ascent metric for the baseline instead of the box height.
 */
function supportsTextBoxTrim() {
  return typeof CSS !== "undefined" && CSS.supports?.("text-box-trim", "trim-both");
}

export function BrandSpecimen() {
  const boxRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [boxes, setBoxes] = useState<GlyphBox[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);

  // useEffect, not useLayoutEffect: this is a client component, but the App
  // Router still renders it on the server for the initial HTML, where React
  // warns that useLayoutEffect does nothing. Measurement waits on font load
  // regardless, so the paint timing is unchanged.
  useEffect(() => {
    let cancelled = false;

    const measure = () => {
      const box = boxRef.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const baseLeft = rect.left;

      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      ctx.font = `${FS}px "Boldonse"`;
      ctx.textBaseline = "alphabetic";

      // Trimmed box: the bottom edge sits on the baseline. Untrimmed, derive it
      // from the cap ascent so the horizontals still register on the glyphs.
      const capAscent = ctx.measureText("H").actualBoundingBoxAscent ?? FS;
      const baselineY = supportsTextBoxTrim() ? rect.height : capAscent;

      const nextBoxes: GlyphBox[] = [];
      const nextMarks: Mark[] = [];

      letterRefs.current.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const penX = r.left - baseLeft; // glyph pen origin within the word box
        const m = ctx.measureText(el.textContent ?? "");
        const inkLeft = penX - (m.actualBoundingBoxLeft ?? 0);
        const inkRight = penX + (m.actualBoundingBoxRight ?? r.width);
        const top = baselineY - (m.actualBoundingBoxAscent ?? 0);
        const bottom = baselineY + (m.actualBoundingBoxDescent ?? 0);

        nextBoxes.push({
          left: inkLeft,
          top,
          width: Math.max(1, inkRight - inkLeft),
          height: Math.max(1, bottom - top),
        });
        nextMarks.push({
          center: penX + r.width / 2,
          unit: Math.round((r.width / FS) * 1000),
        });
      });

      if (!cancelled && nextBoxes.length) {
        setBoxes(nextBoxes);
        setMarks(nextMarks);
      }
    };

    const ready = document.fonts?.ready ?? Promise.resolve();
    ready.then(() => {
      if (!cancelled) measure();
    });
    window.addEventListener("resize", measure);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden text-white" style={BRAND_BG}>
      {/* Takes over the pointer for this section only — it binds to its parent,
          so the bounds of the specimen are the bounds of the effect. */}
      <BallCursor />

      <div className="relative mx-auto flex min-h-[74vh] max-w-6xl items-center justify-center px-6 py-30">
        {/* corner labels — wide margin (labels only, no rule lines), raised
            (z-20) above the glyph restriction lines so the green text doesn't
            clash with them (the lines pass behind the text, unchanged) */}
        <div className="absolute -left-0.5 top-20 z-20 font-sans text-sm leading-tight tracking-wide text-emerald-300">
          Legal-Evidence
          <br />
          Mapper
        </div>
        <div className="absolute -right-0.5 top-20 z-20 text-right font-sans text-sm leading-tight tracking-wide text-emerald-300">
          Cross-Border
          <br />
          Data
          <br />
          Cybersecurity
        </div>
        <div className="absolute bottom-20 -left-0.5 z-20 font-sans text-sm leading-tight tracking-wide text-emerald-300">
          Team
          <br />
          Sentinel
        </div>
        <div className="absolute bottom-20 -right-0.5 z-20 text-right font-sans text-sm leading-tight tracking-wide text-emerald-300">
          RDTII 2.1
          <br />
          Framework
        </div>

        {/* wordmark + per-glyph boxes + shared cap/baseline lines */}
        <div className="relative inline-flex flex-col items-stretch">
          <div className="relative" ref={boxRef}>
            <h2 className="relative z-10 whitespace-nowrap tracking-tight" style={WORD_STYLE}>
              {WORD.split("").map((ch, i) => (
                <span
                  key={i}
                  ref={(el) => {
                    letterRefs.current[i] = el;
                  }}
                  className="inline-block align-baseline"
                  // app/globals.css sets `span { font-inter }` as a base rule,
                  // which beats the family inherited from the h2's inline style
                  // — the glyphs would paint in Inter while the canvas measured
                  // Boldonse, putting every registration line in the wrong place.
                  style={{ fontFamily: "inherit" }}
                >
                  {ch}
                </span>
              ))}
            </h2>

            {/* superscript tag at the cap-height line (no box) */}
            <span className="absolute left-full top-0 ml-3 shrink-0 font-sans text-xs tracking-widest">
              (2.1)
            </span>

            {/* per-glyph restriction lines: each correct ink edge projected
                across the whole panel — verticals at the left/right edges,
                horizontals at the top/bottom edges */}
            {boxes.map((b, i) => (
              <Fragment key={i}>
                <span
                  aria-hidden
                  className={`${LINE} bottom-[-100vh] top-[-100vh] w-px`}
                  style={{ left: `${b.left}px` }}
                />
                <span
                  aria-hidden
                  className={`${LINE} bottom-[-100vh] top-[-100vh] w-px`}
                  style={{ left: `${b.left + b.width}px` }}
                />
                <span
                  aria-hidden
                  className={`${LINE} left-[-100vw] right-[-100vw] h-px`}
                  style={{ top: `${b.top}px` }}
                />
                <span
                  aria-hidden
                  className={`${LINE} left-[-100vw] right-[-100vw] h-px`}
                  style={{ top: `${b.top + b.height}px` }}
                />
              </Fragment>
            ))}
          </div>

          {/* per-glyph advance widths (per-mille of em), centered under columns */}
          <div className="relative mt-6 h-4 font-mono text-xs text-white">
            {marks.map((m, i) => (
              <span
                key={i}
                // font-mono repeated on the span itself: the same base rule
                // would otherwise override the parent's mono with Inter.
                className="absolute -translate-x-1/2 font-mono"
                style={{ left: `${m.center}px` }}
              >
                {m.unit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandSpecimen;

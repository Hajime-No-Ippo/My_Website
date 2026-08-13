"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

/** Matches the grid background's `backgroundSize`, so lit cells land on it. */
const CELL_PX = 60;
/** How far the burst reaches from the clicked cell, in cells. */
const BURST_RADIUS = 2;
/** Per-cell delay by ring, so the burst radiates instead of appearing at once. */
const RIPPLE_MS = 45;
/** Must match the `grid-cell-flip` duration in tailwind.config.js. */
const FLIP_MS = 4800;
/** Pointer travel still counted as a tap rather than a scroll, in px. */
const TAP_SLOP_PX = 10;

type Cell = { col: number; row: number; delay: number };
type Burst = { id: number; cells: Cell[] };

function cellsAround(col: number, row: number): Cell[] {
  const cells: Cell[] = [];

  for (let dx = -BURST_RADIUS; dx <= BURST_RADIUS; dx += 1) {
    for (let dy = -BURST_RADIUS; dy <= BURST_RADIUS; dy += 1) {
      const distance = Math.hypot(dx, dy);
      if (distance > BURST_RADIUS + 0.3) continue;
      // Thin the outer ring so the burst reads as scattered, not as a stamped
      // circle repeated identically on every click.
      if (distance > BURST_RADIUS - 0.5 && Math.random() < 0.45) continue;

      cells.push({ col: col + dx, row: row + dy, delay: Math.round(distance * RIPPLE_MS) });
    }
  }

  return cells;
}

export default function Hero() {
  const gridRef = useRef<HTMLDivElement>(null);
  const nextBurstId = useRef(0);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const lightCells = useCallback((clientX: number, clientY: number) => {
    const bounds = gridRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const col = Math.floor((clientX - bounds.left) / CELL_PX);
    const row = Math.floor((clientY - bounds.top) / CELL_PX);
    const cells = cellsAround(col, row);
    if (cells.length === 0) return;

    const id = nextBurstId.current++;
    setBursts((current) => [...current, { id, cells }]);

    // Drop the burst once its slowest cell has finished, so repeated clicks
    // never accumulate dead nodes.
    const longest = Math.max(...cells.map((cell) => cell.delay));
    const timer = setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== id));
      timers.current.delete(timer);
    }, FLIP_MS + longest + 100);
    timers.current.add(timer);
  }, []);

  /**
   * Tap/click detection built on pointer events rather than `onClick`.
   *
   * iOS only synthesises a click on elements it decides are "clickable" — links,
   * buttons, or something carrying an onclick property or `cursor: pointer`.
   * React attaches its listeners at the root, so this div has none of those and
   * WebKit can simply never dispatch the click. Pointer events are delivered
   * natively on touch with no such heuristic, so they work on every engine.
   *
   * The movement threshold is what keeps this scroll-safe: a finger that drags
   * to scroll travels further than TAP_SLOP_PX and is ignored, and a gesture the
   * browser claims for scrolling fires pointercancel instead of pointerup.
   */
  const pointerStart = useRef<{ x: number; y: number } | null>(null);

  const onPointerDown = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    pointerStart.current = { x: event.clientX, y: event.clientY };
  }, []);

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start) return;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > TAP_SLOP_PX) return;

      lightCells(event.clientX, event.clientY);
    },
    [lightCells],
  );

  const onPointerCancel = useCallback(() => {
    pointerStart.current = null;
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Painted first so the copy above needs no z-index. A z-index here would
          open a stacking context and cut this grid off from the blending cell
          layer below. Clicks on the heading still land on the copy, which
          paints on top. */}
      <div
        ref={gridRef}
        className="absolute inset-0 bg-black"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.29) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.28) 1px, transparent 1px)",
            backgroundSize: `${CELL_PX}px ${CELL_PX}px`,
          }}
        />
      </div>

      {/* Layering is driven by z-index, not source order, because the two have
          to disagree here: the button must PAINT below the cell layer (so a
          burst blends over it, like the name) but must SIT after the body copy
          in the flow. Source order alone can only give one or the other, and
          flex `order` does not help — flex items paint in order-modified
          document order, so reordering moves the painting too.

          z-0  headline + button   <- blended by the burst
          z-10 cell layer
          z-20 body copy           <- painted above, so it stays white

          BELOW the cell layer. */}
      <div className="relative z-0 px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl font-saffron">
          Hello, my name is{" "}
          <span className="group relative inline-block py-2 font-bold italic text-[#E77421] ">
            {/* Plain orange. The difference blend that keeps this legible over
                a lit cell now lives on the cell layer below, not here — see
                the note there. */}
            <a href="/about">
              Eric Tao
            </a>
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </span>
        </h1>
      </div>

      {/* The MIDDLE layer: above the headline, below the copy that follows, and
          carrying the blend itself.

          It used to be the other way round — cells behind, mix-blend-difference
          on the name — which works in Blink but not in WebKit, so the name
          vanished into a lit cell on every iOS browser (all of them are WebKit;
          Chrome on iOS included). Device testing narrowed it to this: WebKit
          blends a plain element layer correctly but drops the blend on inline
          text. `isolation: isolate` did not help, and neither did removing the
          opacity layer or the sibling-subtree split.

          Inverting it is arithmetically identical, because difference is
          symmetric: over the orange name |E77421 - E77421| = black, and over the
          black ground |E77421 - 000000| = the cell's own orange.

          Position in the paint order is load-bearing. A blend only sees what is
          painted BELOW it, so everything after this element is immune — which is
          why the white body copy and the button sit below it in the source. Move
          them above this div and a lit cell would push #FFFFFF to blue.

          pointer-events-none keeps clicks falling through to the grid below. */}
      <div
        className="pointer-events-none absolute inset-0 z-10 overflow-hidden mix-blend-difference"
        aria-hidden="true"
      >
        {/* Flattened deliberately. A nested map emits one child array per
            burst, and React keys those arrays by position — so removing an
            expired burst shifts the others up a slot and remounts their
            cells, restarting animations that were still running. One flat
            list of uniquely-keyed cells reconciles by key instead. */}
        {bursts.flatMap((burst) =>
          burst.cells.map((cell) => (
            <span
              key={`${burst.id}-${cell.col}-${cell.row}`}
              className="absolute bg-[#E77421] animate-grid-cell-flip motion-reduce:animate-none"
              style={{
                // Offset by the 1px rule so the grid lines stay legible
                // around each lit square instead of being painted over.
                left: cell.col * CELL_PX + 1,
                top: cell.row * CELL_PX + 1,
                width: CELL_PX - 1,
                height: CELL_PX - 1,
                animationDelay: `${cell.delay}ms`,
              }}
            />
          )),
        )}
      </div>

      {/* z-20 — ABOVE the cell layer, so the blend cannot touch it. This white
          text is the reason the cell layer is not simply painted last. */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8">
        <p className="mb-6 max-w-2xl mx-auto text-xl sm:text-2xl font-inter">
          New Grad Software Engineer &amp; UX Designer
        </p>
        <p className="mb-6 max-w-2xl mx-auto text-xl text-muted-foreground sm:text-md font-inter">
          Experience Life, Seek the adventure.
        </p>
      </div>

      {/* Last in the flow so it sits under the copy, but z-0 puts it back under
          the cell layer, so a burst blends across it the same way it does the
          name. */}
      <div className="relative z-0 px-4 sm:px-6 lg:px-8">
        <Link href="/projects" passHref>
          <Button size="lg" className="group bg-[#E77421] mix-blend-difference bg-blend-saturation hover:bg-[#E77421]/90 text-white">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

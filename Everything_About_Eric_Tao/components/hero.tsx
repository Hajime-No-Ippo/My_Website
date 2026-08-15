"use client"
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

    const longest = Math.max(...cells.map((cell) => cell.delay));
    const timer = setTimeout(() => {
      setBursts((current) => current.filter((burst) => burst.id !== id));
      timers.current.delete(timer);
    }, FLIP_MS + longest + 100);
    timers.current.add(timer);
  }, []);

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
    <section className="relative isolate min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Background grid */}
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

      {/* Layer 1: Headline & Name (z-0 blends under cells, z-20 stays plain) */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl font-saffron">
          <span className="relative z-20">Hello, my name is </span>
          <span className="group relative z-0 inline-block py-2 font-bold italic text-[#E77421]">
            <Link href="/about">Eric Tao</Link>
            <span className="absolute left-0 -bottom-0.5 h-0.5 w-full scale-x-0 transform origin-left bg-current transition-transform duration-200 ease-out group-hover:scale-x-100" />
          </span>
        </h1>
      </div>

      {/* Layer 2: Cell layer (z-10 mix-blend-difference, no overflow-hidden) */}
      <div
        className="pointer-events-none absolute inset-0 z-10 mix-blend-difference"
        aria-hidden="true"
      >
        {bursts.flatMap((burst) =>
          burst.cells.map((cell) => (
            <span
              key={`${burst.id}-${cell.col}-${cell.row}`}
              className="absolute bg-[#E77421] animate-grid-cell-flip motion-reduce:animate-none"
              style={{
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

      {/* Layer 3: Body copy (z-20 stays above cells) */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8">
        <p className="mb-6 max-w-2xl mx-auto text-xl sm:text-2xl font-inter">
          New Grad Software Engineer &amp; UX Designer
        </p>
        <p className="mb-6 max-w-2xl mx-auto text-xl text-muted-foreground sm:text-md font-inter">
          Experience Life, Seek the adventure.
        </p>
      </div>

      {/* Layer 1: Button (z-0 blends under cells) */}
      <div className="relative z-0 px-4 sm:px-6 lg:px-8">
        <Link href="/projects">
          <Button size="lg" className="group bg-[#E77421] hover:bg-[#E77421]/90 text-white">
            View My Work
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

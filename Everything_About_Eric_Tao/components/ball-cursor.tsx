"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Replaces the pointer with a ball while it is inside the parent element.
 *
 * Drop it as a child of any positioned container — it takes over that element's
 * bounds and restores the native cursor on the way out:
 *
 *   <section className="relative"> <BallCursor /> … </section>
 */

type BallCursorProps = {
  /** Diameter in px. */
  size?: number;
  color?: string;
  /** 0–1. Lower trails further behind the pointer; 1 pins it exactly. */
  ease?: number;
  /** Surface class. `dispersion-glass` and `refractive-glass` live in globals.css. */
  variant?: "dispersion-glass" | "refractive-glass" | "solid";
  /**
   * Pixels of geometric displacement at the rim. backdrop-filter alone can
   * only blur and tint — bending what is behind needs an SVG displacement
   * map. 0 disables it.
   */
  refraction?: number;
};


/**
 * Displacement map for the lens. R ramps left→right and G top→bottom, so each
 * pixel's (R,G) reads as a vector pointing away from the centre — exactly the
 * field a magnifying lens needs. A negative feDisplacementMap scale then samples
 * inward, which magnifies. Mid-grey (128,128) lands at the centre on its own, so
 * there is no displacement there.
 */
function lensMap(size: number) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>
  <defs>
    <linearGradient id='x' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#f00'/>
    </linearGradient>
    <linearGradient id='y' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#000'/><stop offset='1' stop-color='#0f0'/>
    </linearGradient>
  </defs>
  <rect width='100%' height='100%' fill='url(#x)'/>
  <rect width='100%' height='100%' fill='url(#y)' style='mix-blend-mode:screen'/>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function BallCursor({
  size = 256,
  color = "#ffffff",
  ease = 0.18,
  variant = "dispersion-glass",
  refraction = 60,
}: BallCursorProps) {
  const glass = variant !== "solid";
  const lensId = useId().replace(/:/g, "");
  const refracting = glass && refraction > 0;
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ball = ballRef.current;
    const host = ball?.parentElement;
    if (!ball || !host) return;

    // Touch and pen have no hovering cursor to replace, and hiding it there
    // would just remove an affordance with nothing put back.
    if (!window.matchMedia?.("(pointer: fine)").matches) return;

    let raf = 0;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let placed = false;

    const draw = () => {
      // Chase the pointer rather than snapping, so the ball reads as a physical
      // object. On the first frame it jumps, otherwise it flies in from 0,0.
      x = placed ? x + (targetX - x) * ease : targetX;
      y = placed ? y + (targetY - y) * ease : targetY;
      placed = true;
      ball.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2}px, 0)`;
      raf = requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    };

    const onEnter = (event: PointerEvent) => {
      onMove(event);
      placed = false;
      ball.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(draw);
    };

    const onLeave = () => {
      ball.style.opacity = "0";
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const previousCursor = host.style.cursor;
    host.style.cursor = "none";
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    return () => {
      host.style.cursor = previousCursor;
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [ease, size]);

  return (
    <>
      {refracting && (
        <svg width="0" height="0" className="absolute" aria-hidden="true">
          <filter id={lensId} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feImage href={lensMap(size)} result="map" preserveAspectRatio="none" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="map"
              scale={-refraction}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}

    <div
      ref={ballRef}
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-30 opacity-0 transition-opacity duration-200 ${
        glass ? variant : ""
      }`}
      style={{
        width: size,
        height: size,
        // Glass supplies its own translucent fill; a solid colour would sit on
        // top of the backdrop-filter and defeat the frosting entirely.
        backgroundColor: glass ? undefined : color,
        // Explicit: the Swiss radius pin sets every Tailwind radius token to 0,
        // so `rounded-full` would render a square here.
        borderRadius: "9999px",
        // No difference blend under glass: inverting the backdrop and softening
        // it are mutually exclusive reads, and the inversion wins visually. The
        // rim highlight is what keeps the lens legible instead.
        mixBlendMode: glass ? undefined : "difference",
        willChange: "transform",
        // Inline so it beats the class's backdrop-filter. The url() runs first,
        // bending the backdrop, then blur and saturate soften what it produced.
        backdropFilter: refracting ? `url(#${lensId}) blur(8px) saturate(140%)` : undefined,
      }}
    />
    </>
  );
}

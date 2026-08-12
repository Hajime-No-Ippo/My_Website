"use client";

import type { CurtainVisualProps } from "../types";
import "@fontsource/boldonse/400.css";

/** Bands sweep in right to left, staggered head to tail, then the wordmark lands. */
const BAND_COUNT = 4;
const BAND_STAGGER_MS = 80;
/** Waits for the last band: (BAND_COUNT-1) × stagger + the 0.5s band sweep. */
const WORD_DELAY_MS = 800;

export default function BandCurtain({ accent, word }: CurtainVisualProps) {
  return (
    <>
      {/* Positioned rather than flexed, and each band is 1px taller than its
          share so neighbours overlap. Flush edges land on fractional pixels at
          most viewport heights (850/4 = 212.5), and two edges antialiased at
          ~50% coverage composite to ~75%, not 100% — painting a visible
          hairline of the page showing through at every seam. */}
      <div className="absolute inset-0">
        {Array.from({ length: BAND_COUNT }, (_, index) => (
          <span
            key={index}
            className="absolute inset-x-0 animate-curtain-band"
            style={{
              backgroundColor: accent,
              top: `${(index * 100) / BAND_COUNT}%`,
              height: `calc(${100 / BAND_COUNT}% + 1px)`,
              animationDelay: `${index * BAND_STAGGER_MS}ms`,
            }}
          />
        ))}
      </div>

      {/* Font set inline: globals.css forces font-saffron on h1-h6 and
          font-inter on span/div, either of which would win over a class here. */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div
          className="animate-curtain-word text-center text-black"
          style={{
            fontFamily: '"Boldonse", sans-serif',
            fontSize: "clamp(2.5rem, 12vw, 11rem)",
            lineHeight: 1,
            animationDelay: `${WORD_DELAY_MS}ms`,
          }}
        >
          {word}
        </div>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Brick grid where a tile morphs into a full-screen panel on click.
 *
 * The whole effect is Framer's shared-layout animation: the small button and
 * the expanded panel carry the same `layoutId`, so Framer interpolates position
 * and size between them. Nothing here talks to a backend — the recommendation
 * fetch in the original is a separate concern layered on top.
 */

/** Filmoji's mood palette. */
const MOOD = {
  yellow: "#F5C519",
  blue: "#3B5BDB",
  navy: "#1A3A8F",
  green: "#2D6A4F",
  orange: "#E05A2B",
} as const;

/**
 * Square by default to match the site's Swiss corners. Set to "1.5rem" for the
 * original rounded brick — the radius animates to 0 as the tile expands either
 * way, it is just invisible when both ends are already square.
 */
const BRICK_RADIUS = "0rem";

type Brick = { emoji: string; mood: string; label: string; color: string };

const COLUMNS: Brick[][] = [
  [
    { emoji: "😊", mood: "happy", label: "Happy", color: MOOD.yellow },
    { emoji: "😡", mood: "angry", label: "Angry", color: MOOD.navy },
    { emoji: "😎", mood: "cool", label: "Cool", color: MOOD.blue },
    { emoji: "🥳", mood: "festive", label: "Festive", color: MOOD.yellow },
  ],
  [
    { emoji: "😢", mood: "sad", label: "Sad", color: MOOD.blue },
    { emoji: "😍", mood: "romantic", label: "Romantic", color: MOOD.orange },
    { emoji: "🤩", mood: "excited", label: "Excited", color: MOOD.green },
    { emoji: "🥱", mood: "bored", label: "Bored", color: MOOD.green },
  ],
  [
    { emoji: "😱", mood: "scared", label: "Scared", color: MOOD.green },
    { emoji: "🥺", mood: "emotional", label: "Emotional", color: MOOD.orange },
    { emoji: "🤯", mood: "mindblown", label: "Mind-blown", color: MOOD.navy },
    { emoji: "😌", mood: "peaceful", label: "Peaceful", color: MOOD.blue },
  ],
  [
    { emoji: "😂", mood: "laughing", label: "Laughing", color: MOOD.yellow },
    { emoji: "🤔", mood: "thoughtful", label: "Thoughtful", color: MOOD.green },
    { emoji: "😤", mood: "tense", label: "Tense", color: MOOD.orange },
    { emoji: "🫠", mood: "overwhelmed", label: "Overwhelmed", color: MOOD.blue },
  ],
];

export default function EmojiBricks() {
  const [expanded, setExpanded] = useState<Brick | null>(null);
  const close = useCallback(() => setExpanded(null), []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [expanded, close]);

  return (
    <>
      <div className="flex gap-3 p-3">
        {COLUMNS.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-1 flex-col gap-3">
            {column.map((brick) => (
              <motion.button
                key={brick.mood}
                type="button"
                aria-label={`Expand ${brick.label}`}
                // Paired with the panel below — this is the entire effect.
                layoutId={`brick-${brick.mood}`}
                onClick={() => setExpanded(brick)}
                style={{ backgroundColor: brick.color, borderRadius: BRICK_RADIUS }}
                className="group flex h-28 w-full shrink-0 cursor-pointer items-center justify-center border-none transition-[filter,transform] duration-200 hover:brightness-110 sm:h-40 md:h-52"
              >
                <motion.span
                  layoutId={`emoji-${brick.mood}`}
                  className="select-none text-3xl leading-none transition-transform duration-200 group-hover:scale-110 sm:text-5xl md:text-7xl"
                >
                  {brick.emoji}
                </motion.span>
              </motion.button>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 z-[110]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />

            {/* Same layoutId as the tile, so Framer tweens the geometry between
                them. z-index sits above the route curtain's z-100. */}
            <motion.div
              layoutId={`brick-${expanded.mood}`}
              role="dialog"
              aria-modal="true"
              aria-label={expanded.label}
              initial={{ borderRadius: BRICK_RADIUS }}
              animate={{ borderRadius: 0 }}
              exit={{ borderRadius: BRICK_RADIUS, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              style={{ backgroundColor: expanded.color }}
              className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-6"
            >
              <motion.span
                layoutId={`emoji-${expanded.mood}`}
                className="select-none leading-none"
                style={{ fontSize: "clamp(4rem, 20vw, 13rem)" }}
              >
                {expanded.emoji}
              </motion.span>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
                className="text-center"
              >
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/60">You&rsquo;re feeling</p>
                <p className="text-4xl font-bold text-white">{expanded.label}</p>
              </motion.div>

              <button
                type="button"
                onClick={close}
                className="absolute right-6 top-6 border-none bg-white/10 px-4 py-2 text-xs uppercase tracking-widest text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

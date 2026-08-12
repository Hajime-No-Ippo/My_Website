"use client";

import { motion } from "framer-motion";
import type { CurtainVisualProps } from "../types";
import "@fontsource/michroma/400.css";

/**
 * Filmoji's opening: one brick grows from grid size to full screen — the same
 * morph the emoji grid plays on click — carrying the cinema emoji, with the
 * title landing under it once the brick is open.
 *
 * Framer drives it rather than a CSS keyframe because the spring overshoot is
 * what makes it read as the brick effect; an eased tween lands flat.
 *
 * Type and colour are Filmoji's own, taken from the project's index.css:
 * Michroma as the display face and `--color-ink` for text on the yellow.
 */

/** Roughly a grid tile, so the expand starts where a brick would sit. */
const START = { width: 320, height: 220 };
/** Filmoji's `--color-ink`, the body text colour that sits on its yellow. */
const INK = "#1C1600";

export default function EmojiCurtain({ accent, word }: CurtainVisualProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        initial={START}
        animate={{ width: "100vw", height: "100vh" }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{ backgroundColor: accent }}
        className="flex flex-col items-center justify-center gap-6 overflow-hidden"
      >
        {/* Waits for the brick to be open before the title commits. Font set
            inline: globals.css forces font-inter on span/div, which would
            otherwise win over a class here. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.4, ease: "easeOut" }}
          className="select-none text-center"
          style={{
            fontFamily: '"Michroma", system-ui, sans-serif',
            fontSize: "clamp(3rem, 12vw, 9rem)",
            letterSpacing: "0.08em",
            lineHeight: 1,
            color: INK,
          }}
        >
          {word.toUpperCase()}
        </motion.div>
      </motion.div>
    </div>
  );
}

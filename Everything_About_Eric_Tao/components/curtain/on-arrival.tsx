"use client";

import { useEffect } from "react";
import { curtainFor } from "./registry";
import { useOptionalRouteCurtain } from "./provider";

/**
 * Plays a project's curtain on a direct or pasted URL, where there was no
 * originating click to intercept.
 *
 * The visual is resolved from the registry here rather than passed in, because
 * a server component cannot hand a component reference across the RSC boundary
 * — only serialisable props survive that trip.
 */
export default function CurtainOnArrival({
  href,
  accent,
  word,
}: {
  href: string;
  accent: string;
  word: string;
}) {
  const curtain = useOptionalRouteCurtain();
  const visual = curtainFor(href);

  useEffect(() => {
    if (!visual) return;
    curtain?.playOnArrival(href, { accent, word, visual });
  }, [href, accent, word, visual, curtain]);

  return null;
}

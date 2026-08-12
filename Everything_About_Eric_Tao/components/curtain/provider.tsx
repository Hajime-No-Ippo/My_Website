"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CurtainVisual } from "./types";
/** Total budget. Must match the `curtain-veil` duration in tailwind.config.js. */
const CURTAIN_MS = 2400;
/**
 * When the route actually changes. The veil is fully opaque by now, so the swap
 * happens entirely out of sight — this is what makes it a transition rather
 * than a curtain dropped over a page that already arrived.
 */
const PUSH_AT_MS = 800;

/**
 * `emoji` switches the curtain from the sweeping bands to Filmoji's brick
 * expand — a single tile growing to fill the screen, the same morph the emoji
 * grid uses on click.
 */
/** `visual` swaps the field painted under the veil; the veil, scroll lock and
 *  wordmark are the host's and stay the same for every project. */
type CurtainLook = { accent: string; word: string; visual: CurtainVisual };
type CurtainState = CurtainLook & { key: number };

type CurtainApi = {
  /** Cover the current page, swap the route underneath, then reveal. */
  travelTo: (href: string, look: CurtainLook) => void;
  /** Play on a direct visit, where there was no originating click to intercept. */
  playOnArrival: (href: string, look: CurtainLook) => void;
};

const CurtainContext = createContext<CurtainApi | null>(null);

export function useRouteCurtain() {
  const api = useContext(CurtainContext);
  if (!api) throw new Error("useRouteCurtain must be used inside <RouteCurtainProvider>");
  return api;
}

/**
 * Non-throwing variant for the decorative pieces below. The curtain is an
 * embellishment, so without a provider a CurtainLink must still navigate rather
 * than take the page down with it — which is also what lets the gallery render
 * standalone in tests.
 */
function useOptionalCurtain() {
  return useContext(CurtainContext);
}

/** Public non-throwing accessor, for consumers outside this module. */
export function useOptionalRouteCurtain() {
  return useContext(CurtainContext);
}

export function RouteCurtainProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [curtain, setCurtain] = useState<CurtainState | null>(null);

  // Which href the curtain has already covered, so a click-driven run and the
  // destination page's own arrival hook don't stack two curtains.
  const claimedHref = useRef<string | null>(null);
  const timers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const pendingPush = useRef<string | null>(null);
  const runId = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    const t = setTimeout(() => {
      timers.current.delete(t);
      fn();
    }, ms);
    timers.current.add(t);
  }, []);

  /** Ends the run early, flushing any navigation that hasn't happened yet. */
  const dismiss = useCallback(() => {
    clearTimers();
    if (pendingPush.current) {
      const href = pendingPush.current;
      pendingPush.current = null;
      router.push(href);
    }
    setCurtain(null);
  }, [clearTimers, router]);

  const run = useCallback(
    (href: string, look: CurtainLook, push: boolean) => {
      if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
        if (push) router.push(href);
        return;
      }

      clearTimers();
      claimedHref.current = href;
      runId.current += 1;
      setCurtain({ ...look, key: runId.current });

      if (push) {
        pendingPush.current = href;
        after(PUSH_AT_MS, () => {
          if (pendingPush.current) {
            router.push(pendingPush.current);
            pendingPush.current = null;
          }
        });
      }

      after(CURTAIN_MS, () => setCurtain(null));
    },
    [after, clearTimers, router],
  );

  const travelTo = useCallback((href: string, look: CurtainLook) => run(href, look, true), [run]);

  const playOnArrival = useCallback(
    (href: string, look: CurtainLook) => {
      // A click-driven run already covered this href — don't play it twice.
      if (claimedHref.current === href) return;
      run(href, look, false);
    },
    [run],
  );

  // Holding the page for ~5s is only acceptable if it is escapable.
  useEffect(() => {
    if (!curtain) return;

    const { body, documentElement } = document;
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismiss);

    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismiss);
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [curtain, dismiss]);

  useEffect(() => clearTimers, [clearTimers]);

  const api = useMemo<CurtainApi>(() => ({ travelTo, playOnArrival }), [travelTo, playOnArrival]);

  return (
    <CurtainContext.Provider value={api}>
      {children}
      {curtain && <Curtain key={curtain.key} accent={curtain.accent} word={curtain.word} visual={curtain.visual} />}
    </CurtainContext.Provider>
  );
}

function Curtain({ accent, word, visual: Visual }: CurtainLook) {
  return (
    // pointer-events-auto so it genuinely blocks the page and the nav beneath;
    // the provider's document listeners supply the escape.
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[100] animate-curtain-veil overflow-hidden"
    >
      <Visual accent={accent} word={word} />

    </div>
  );
}

/**
 * A Link that draws the curtain before handing over to the router. Falls back to
 * ordinary navigation for modified clicks, so open-in-new-tab still works.
 */
export function CurtainLink({
  href,
  accent,
  word,
  visual,
  children,
  ...rest
}: { href: string; accent: string; word: string; visual: CurtainVisual; children: ReactNode } & Omit<
  React.ComponentPropsWithoutRef<typeof Link>,
  "href" | "onClick"
>) {
  const curtain = useOptionalCurtain();

  return (
    <Link
      href={href}
      onClick={(event) => {
        if (!curtain) return;
        // Modified clicks belong to the browser — open-in-new-tab must survive.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        curtain.travelTo(href, { accent, word, visual });
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

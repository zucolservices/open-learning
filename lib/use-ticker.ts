"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useInView, useReducedMotion } from "motion/react";

/**
 * A counter that advances every `ms` while the element is on screen.
 * Looping infographics derive their frame from it, so they cost nothing
 * off-screen and stay still for people who prefer reduced motion.
 */
export function useTicker<T extends Element>(
  ms: number,
): { ref: RefObject<T | null>; tick: number; live: boolean } {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { margin: "100px" });
  const reduced = useReducedMotion();
  const live = inView && !reduced;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!live) return;
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [live, ms]);

  return { ref, tick, live };
}

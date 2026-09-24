"use client";

import { useEffect, type ReactNode } from "react";
import { useProgress } from "@/lib/progress-adapter";

/** Loads saved progress after the first render, so static HTML hydrates cleanly. */
export function ProgressProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);
  return children;
}

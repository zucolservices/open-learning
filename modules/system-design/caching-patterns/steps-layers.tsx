"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CacheState } from "./state";

/* 1 ─ Caches everywhere --------------------------------------------------------------------------- */

const LAYERS: { name: string; where: string; latency: string; holds: string }[] = [
  {
    name: "Browser / app cache",
    where: "On the user's device",
    latency: "~0 ms",
    holds: "Images, scripts, API responses marked cacheable",
  },
  { name: "CDN", where: "In the user's city", latency: "~5 ms", holds: "Public files and pages" },
  {
    name: "In-process cache",
    where: "Inside each app server's memory",
    latency: "microseconds",
    holds: "Tiny, very hot data: config, feature flags, the menu",
  },
  {
    name: "Shared cache (Redis, Valkey, Memcached)",
    where: "A cluster next to the app servers",
    latency: "well under 1 ms",
    holds: "Sessions, computed pages, query results shared by all servers",
  },
  {
    name: "Database",
    where: "Its own servers, with its own memory cache",
    latency: "a few ms to seconds",
    holds: "The source of truth",
  },
];

export function CachesEverywhere() {
  const [s, set] = useSceneState<CacheState>();
  const l = LAYERS[s.layer];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Caches everywhere"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-muted text-xs">
            A request for Brewline&apos;s menu goes down until something has the answer. Click where
            it&apos;s found.
          </p>
          <div className="grid gap-1.5">
            {LAYERS.map((x, i) => {
              const passed = i < s.layer;
              const hit = i === s.layer;
              return (
                <button
                  key={x.name}
                  type="button"
                  onClick={() => set({ layer: i })}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition",
                    hit
                      ? "border-good bg-good/10"
                      : passed
                        ? "border-line bg-surface opacity-60"
                        : "border-line border-dashed opacity-40",
                  )}
                >
                  <span className="text-sm font-medium">{x.name}</span>
                  <span className="text-muted text-[11px]">
                    {passed ? "miss ↓" : hit ? "hit ✓" : ""}
                  </span>
                </button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.layer}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface grid gap-1 rounded-xl border px-4 py-3 text-sm"
            >
              <p>
                <span className="text-muted">Where: </span>
                {l.where}
              </p>
              <p>
                <span className="text-muted">Answer in: </span>
                <span className="font-mono">{l.latency}</span>
              </p>
              <p>
                <span className="text-muted">Good for: </span>
                {l.holds}
              </p>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">Orders of magnitude, not guarantees.</p>
        </div>
      }
    >
      <p>
        A kitchen keeps the day&apos;s most-ordered dishes ready on the pass, ingredients in the
        fridge, and stock in the store room. The closer something is, the faster it&apos;s served,
        and the less room there is.
      </p>
      <p>
        Software does the same. A <Term id="cache">cache</Term> is a small, fast copy of data that
        is slow to fetch or compute. Real systems have several layers of them.
      </p>
      <p className="text-muted text-sm">
        Every layer that answers saves every layer below it from doing work. Every layer is also
        another copy that can be out of date.
      </p>
    </StepLayout>
  );
}

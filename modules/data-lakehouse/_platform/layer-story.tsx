"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { cn } from "@/lib/cn";

/**
 * Shared by the cloud-platform modules: a scroll story that fills in a table of
 * "lakehouse layer you already know" → "this platform's service", one layer per section.
 */

export interface LayerRow {
  id: string;
  layer: string; // generic concept, e.g. "Table storage"
  services: string; // platform names, e.g. "S3 · S3 Tables"
  body: ReactNode; // narration for this layer's section
  title: string;
}

function Scene({ rows, stage, platform }: { rows: LayerRow[]; stage: number; platform: string }) {
  // stage 0 = intro section; stage i (1..n) reveals row i-1; stage n+1 = all.
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="text-muted grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2 px-3 text-[10px] tracking-wide uppercase">
        <span>You already know</span>
        <span>On {platform}</span>
      </div>
      {rows.map((r, i) => {
        const shown = stage > i;
        const current = stage === i + 1;
        return (
          <motion.div
            key={r.id}
            animate={{ opacity: shown || stage === 0 ? 1 : 0.35 }}
            className={cn(
              "grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-center gap-2 rounded-xl border px-3 py-2",
              current ? "border-accent bg-accent-soft" : "border-line bg-surface",
            )}
          >
            <span className="text-sm">{r.layer}</span>
            <AnimatePresence mode="wait">
              {shown ? (
                <motion.span
                  key="svc"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="font-mono text-xs font-semibold"
                >
                  {r.services}
                </motion.span>
              ) : (
                <motion.span
                  key="q"
                  exit={{ opacity: 0 }}
                  className="text-subtle font-mono text-xs"
                >
                  ?
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

export function LayerStory({
  platform,
  intro,
  opening,
  rows,
  closing,
}: {
  platform: string;
  intro: ReactNode;
  opening: { title: string; body: ReactNode };
  rows: LayerRow[];
  closing: { title: string; body: ReactNode };
}) {
  const sections: StorySection[] = [
    { id: "opening", kicker: "The big idea", title: opening.title, body: opening.body },
    ...rows.map((r, i) => ({ id: r.id, kicker: `Layer ${i + 1}`, title: r.title, body: r.body })),
    { id: "closing", kicker: "Put together", title: closing.title, body: closing.body },
  ];
  return (
    <ScrollStory
      sections={sections}
      renderScene={(i) => <Scene rows={rows} stage={i} platform={platform} />}
      intro={intro}
    />
  );
}

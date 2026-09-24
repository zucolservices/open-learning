"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CacheState } from "./state";

type Node = "app" | "cache" | "db";
export interface Frame {
  title: string;
  text: string;
  arrows: [Node, Node][];
  cache: string | null;
  db: string;
  tone?: "good" | "bad";
  lost?: boolean;
}

const PATTERNS: Record<CacheState["pattern"], { label: string; frames: Frame[] }> = {
  aside: {
    label: "Cache-aside",
    frames: [
      {
        title: "Read: ask the cache",
        text: "The app checks the cache first. Nothing there: a miss.",
        arrows: [["app", "cache"]],
        cache: null,
        db: "₹180",
      },
      {
        title: "Read the database",
        text: "The app reads the price from the database itself.",
        arrows: [["app", "db"]],
        cache: null,
        db: "₹180",
      },
      {
        title: "Fill the cache",
        text: "The app stores the answer in the cache, with a TTL, for next time.",
        arrows: [["app", "cache"]],
        cache: "₹180",
        db: "₹180",
      },
      {
        title: "Next read: a hit",
        text: "The next request is answered from memory. The database isn't touched.",
        arrows: [["app", "cache"]],
        cache: "₹180",
        db: "₹180",
        tone: "good",
      },
      {
        title: "Write: update the database",
        text: "The price changes to ₹200. The app writes the database. The cache still says ₹180.",
        arrows: [["app", "db"]],
        cache: "₹180",
        db: "₹200",
        tone: "bad",
      },
      {
        title: "Delete the cached copy",
        text: "The app deletes the cache entry (rather than updating it; you'll see why).",
        arrows: [["app", "cache"]],
        cache: null,
        db: "₹200",
      },
      {
        title: "Next read refills it",
        text: "A miss, a database read, and the fresh ₹200 is cached. Simple, and the most common pattern.",
        arrows: [
          ["app", "db"],
          ["app", "cache"],
        ],
        cache: "₹200",
        db: "₹200",
        tone: "good",
      },
    ],
  },
  "read-through": {
    label: "Read-through",
    frames: [
      {
        title: "Read: ask the cache",
        text: "The app only ever talks to the cache.",
        arrows: [["app", "cache"]],
        cache: null,
        db: "₹180",
      },
      {
        title: "The cache loads it",
        text: "On a miss, the cache itself fetches from the database, using a loader you configure.",
        arrows: [["cache", "db"]],
        cache: "₹180",
        db: "₹180",
      },
      {
        title: "Next read: a hit",
        text: "Same speed-up as cache-aside, but the app's code is simpler: one place to read from.",
        arrows: [["app", "cache"]],
        cache: "₹180",
        db: "₹180",
        tone: "good",
      },
      {
        title: "Writes",
        text: "Read-through covers reads only. Writes go to the database and invalidate the cache (or use write-through).",
        arrows: [["app", "db"]],
        cache: null,
        db: "₹200",
      },
    ],
  },
  "write-through": {
    label: "Write-through",
    frames: [
      {
        title: "Write: through the cache",
        text: "The price changes. The app writes to the cache, which writes to the database before saying 'done'.",
        arrows: [
          ["app", "cache"],
          ["cache", "db"],
        ],
        cache: "₹200",
        db: "₹200",
      },
      {
        title: "Reads are always fresh",
        text: "Cache and database never disagree about data written this way.",
        arrows: [["app", "cache"]],
        cache: "₹200",
        db: "₹200",
        tone: "good",
      },
      {
        title: "The cost",
        text: "Every write waits for two stores, and the cache fills with data that may never be read. Add a TTL so unread items expire.",
        arrows: [],
        cache: "₹200",
        db: "₹200",
      },
    ],
  },
  "write-back": {
    label: "Write-back",
    frames: [
      {
        title: "Write: to the cache only",
        text: "The app writes to the cache and gets 'done' at once. The database still says ₹180.",
        arrows: [["app", "cache"]],
        cache: "₹200",
        db: "₹180",
      },
      {
        title: "Flushed later",
        text: "Moments later, the cache writes changes to the database in batches. Writes are very fast, and bursts are smoothed out.",
        arrows: [["cache", "db"]],
        cache: "₹200",
        db: "₹200",
        tone: "good",
      },
      {
        title: "Unless it crashes first",
        text: "If the cache node dies before flushing, the change is gone for good, though the user was told it succeeded.",
        arrows: [],
        cache: null,
        db: "₹180",
        tone: "bad",
        lost: true,
      },
    ],
  },
};

const POS: Record<Node, { x: number; label: string }> = {
  app: { x: 15, label: "App" },
  cache: { x: 50, label: "Cache" },
  db: { x: 85, label: "Database" },
};

export function Diagram({ f }: { f: Frame }) {
  return (
    <div className="border-line bg-surface relative h-40 rounded-xl border">
      <svg
        viewBox="0 0 100 40"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        {f.arrows.map(([a, b], i) => (
          <motion.line
            key={`${a}${b}${i}`}
            x1={POS[a].x}
            y1={16 + i * 3}
            x2={POS[b].x}
            y2={16 + i * 3}
            stroke="var(--accent)"
            strokeWidth={0.8}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.4 }}
          />
        ))}
      </svg>
      {(Object.keys(POS) as Node[]).map((n) => {
        const value = n === "cache" ? f.cache : n === "db" ? f.db : null;
        return (
          <div
            key={n}
            className={cn(
              "absolute top-1/2 w-[5.5rem] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-1.5 py-2 text-center sm:w-24",
              n === "app"
                ? "border-viz-compute/60 bg-viz-compute/10"
                : n === "cache"
                  ? "border-viz-add/60 bg-viz-add/10"
                  : "border-viz-data/60 bg-viz-data/10",
              n === "cache" && f.lost && "border-bad bg-bad/10",
            )}
            style={{ left: `${POS[n].x}%` }}
          >
            <p className="text-xs font-semibold">{POS[n].label}</p>
            {n !== "app" && (
              <motion.p
                key={String(value)}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-mono text-[11px]"
              >
                {n === "cache" && f.lost ? "crashed" : (value ?? "empty")}
              </motion.p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* 2 ─ Four patterns ⭐ ---------------------------------------------------------------------------- */

export function Patterns() {
  const [s, set] = useSceneState<CacheState>();
  const p = PATTERNS[s.pattern];
  const step = Math.min(s.frame, p.frames.length - 1);
  const f = p.frames[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Four ways to keep a cache"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.pattern}
            options={(Object.keys(PATTERNS) as CacheState["pattern"][]).map(
              (k) => [k, PATTERNS[k].label] as [string, string],
            )}
            onChange={(v) => set({ pattern: v as CacheState["pattern"], frame: 0 })}
          />
          <Diagram f={f} />
          <Stepper step={step} count={p.frames.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={s.pattern + step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A cache is only useful if it&apos;s filled, and only safe if it&apos;s kept in step with the
        database. Four standard patterns answer who fills it and when writes reach the database.
      </p>
      <p>Step through each. Watch the price in the cache and in the database.</p>
      <p className="text-muted text-sm">
        <Term id="cache-aside">Cache-aside</Term> (also called lazy loading) is by far the most
        common: simple, and a cache failure only makes things slower, not broken.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint ---------------------------------------------------------------------------------- */

export function PatternSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which pattern is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pattern-sort"
            prompt="Match each description to its pattern."
            categories={[
              { id: "aside", label: "Cache-aside" },
              { id: "rt", label: "Read-through" },
              { id: "wt", label: "Write-through" },
              { id: "wb", label: "Write-back" },
            ]}
            items={[
              {
                id: "a",
                label:
                  "The app checks the cache, reads the database on a miss, then fills the cache itself",
                category: "aside",
                why: "The app manages the cache directly: lazy loading.",
              },
              {
                id: "b",
                label: "The cache fetches missing data from the database on its own",
                category: "rt",
                why: "A loader inside the cache does the reading.",
              },
              {
                id: "c",
                label: "A write returns only after both the cache and the database have it",
                category: "wt",
                why: "Synchronous to both: fresh reads, slower writes.",
              },
              {
                id: "d",
                label: "Writes are fastest, but a crash can lose recent ones",
                category: "wb",
                why: "The database catches up later.",
              },
            ]}
            explanation="Most systems use cache-aside for reads, deleting cache entries on writes. Write-back suits workloads that can tolerate losing a few recent writes, like view counters."
          />
        </div>
      }
    >
      <p>From the step-through.</p>
    </StepLayout>
  );
}

"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  BIG_MB,
  EXECUTORS,
  LEFT,
  MERGE_FRAMES,
  RIGHT,
  SIZES,
  STRATEGIES,
  choose,
  fmtMb,
  type Hint,
} from "./model";
import type { JoinState } from "./state";

/* 1 ─ Seating the guests -------------------------------------------------------------------------- */

export function Wedding() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Seating the guests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "A short list",
              "Photocopy the 20-name seating plan and give one to every usher. Guests stay where they are; each usher looks names up.",
              "bg-viz-add/10 border-viz-add",
            ],
            [
              "Two long lists",
              "Sort both the guest list and the 500-table plan alphabetically, give each usher one letter range, and let them run down both lists together.",
              "bg-viz-compute/10 border-viz-compute",
            ],
          ].map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn("rounded-xl border px-4 py-3", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Matching 2,000 wedding guests to their tables is a join. If the seating plan is short, the
        easy way is to photocopy it for every usher. If both lists are long, photocopying is
        hopeless; it&apos;s better to sort both and split the alphabet between ushers.
      </p>
      <p>
        Spark makes the same choice. A small table gets copied to every executor in a{" "}
        <Term id="broadcast-join">broadcast join</Term>. Two big tables get shuffled and matched,
        usually with a <Term id="sort-merge-join">sort-merge join</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pick a join strategy ⭐ --------------------------------------------------------------------- */

export function JoinPicker() {
  const [s, set] = useSceneState<JoinState>();
  const [mb, label] = SIZES[s.size];
  const r = choose(mb, s.equi, s.hint);
  const st = STRATEGIES[r.s];
  const broadcast = r.s === "bhj" || r.s === "bnlj";
  const hints: [Hint, string][] = [
    ["none", "no hint"],
    ["broadcast", "BROADCAST"],
    ["merge", "MERGE"],
    ["shuffle_hash", "SHUFFLE_HASH"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pick a join strategy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`orders (500 GB)  JOIN  other (${label})\nON ${s.equi ? "orders.id = other.id" : "orders.ts BETWEEN other.start AND other.end"}`}</Code>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted w-24">other table</span>
              {SIZES.map(([, l], i) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={s.size === i}
                  onClick={() => set({ size: i })}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono",
                    s.size === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted w-24">condition</span>
              {[
                [true, "equality (=)"],
                [false, "range (BETWEEN)"],
              ].map(([v, l]) => (
                <button
                  key={String(v)}
                  type="button"
                  aria-pressed={s.equi === v}
                  onClick={() => set({ equi: v as boolean })}
                  className={cn(
                    "rounded-md border px-2 py-1",
                    s.equi === v ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l as string}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted w-24">hint</span>
              {hints.map(([h, l]) => (
                <button
                  key={h}
                  type="button"
                  aria-pressed={s.hint === h}
                  onClick={() => set({ hint: h })}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[11px]",
                    s.hint === h ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <motion.div
            key={`${r.s}-${s.size}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <p className="text-accent text-sm font-semibold">{st.name}</p>
            <p className="text-muted text-xs">{st.how}</p>
            <div className="mt-3 flex flex-col gap-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <span className="text-muted w-28">orders moved</span>
                <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: broadcast ? "0%" : "100%" }}
                    className="bg-viz-data h-full"
                  />
                </div>
                <span className="w-16 text-right font-mono">{broadcast ? "0" : fmtMb(BIG_MB)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted w-28">
                  {broadcast ? `other × ${EXECUTORS} executors` : "other moved"}
                </span>
                <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                  <motion.div
                    animate={{
                      width: `${Math.min(100, ((broadcast ? mb * EXECUTORS : mb) / BIG_MB) * 100 + 1)}%`,
                    }}
                    className="bg-viz-meta h-full"
                  />
                </div>
                <span className="w-16 text-right font-mono">
                  {fmtMb(broadcast ? mb * EXECUTORS : mb)}
                </span>
              </div>
            </div>
            {r.warn && <p className="text-bad mt-2 text-xs">{r.warn}</p>}
          </motion.div>
          <p className="text-subtle text-[10px]">
            Simplified rules; sizes and executor count illustrative.
          </p>
        </div>
      }
    >
      <p>
        Change the size of the second table, the join condition and the hint, and watch which
        strategy Spark picks and how much data moves.
      </p>
      <p>
        With no hint, Spark broadcasts a table it estimates at 10 MB or less (
        <code>spark.sql.autoBroadcastJoinThreshold</code>). Otherwise, for an equality join, its
        built-in preference is sort-merge. A <Term id="shuffled-hash-join">shuffled hash join</Term>{" "}
        skips the sort but needs more memory. Joins without an equality key fall back to slow nested
        loops.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Sort-merge, step by step -------------------------------------------------------------------- */

export function MergeWalk() {
  const [s, set] = useSceneState<JoinState>();
  const f = MERGE_FRAMES[s.frame] ?? MERGE_FRAMES[0];
  const col = (xs: number[], at: number, side: string) => (
    <div className="flex flex-col gap-1">
      <p className="text-muted text-center text-[10px]">{side}</p>
      {xs.map((x, k) => (
        <motion.div
          key={k}
          animate={{ scale: k === at ? 1.08 : 1 }}
          className={cn(
            "flex size-9 items-center justify-center rounded-md border font-mono text-sm",
            k === at ? "border-accent bg-accent-soft" : "border-line bg-surface",
            k < at && "opacity-40",
          )}
        >
          {x}
        </motion.div>
      ))}
    </div>
  );
  return (
    <StepLayout
      eyebrow="Explore"
      title="Sort-merge, step by step"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Stepper
            step={s.frame}
            count={MERGE_FRAMES.length}
            onChange={(n) => set({ frame: n })}
            label="One partition"
          />
          <div className="flex items-start justify-center gap-6">
            {col(LEFT, f.i, "orders")}
            {col(RIGHT, f.j, "customers")}
            <div className="flex min-w-24 flex-col gap-1">
              <p className="text-muted text-center text-[10px]">output</p>
              {f.out.map((o, k) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-viz-add bg-viz-add/10 rounded-md border px-2 py-1 text-center font-mono text-xs"
                >
                  {o}
                </motion.div>
              ))}
            </div>
          </div>
          <FrameCaption frameKey={s.frame} title={`Step ${s.frame + 1}`}>
            {f.note}
          </FrameCaption>
        </div>
      }
    >
      <p>
        After the shuffle, each partition holds both tables&apos; rows for the same range of keys.
        Sorted, they can be matched with two fingers moving down two lists, never going back.
      </p>
      <p>
        That&apos;s why sort-merge copes with tables far bigger than memory: sorting can spill to
        disk, and the merge reads each side once, in order.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Hints and estimates ------------------------------------------------------------------------- */

export function Hints() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Hints and estimates"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`-- SQL
SELECT /*+ BROADCAST(c) */ *
FROM orders o JOIN countries c ON o.country = c.code

# DataFrame
from pyspark.sql.functions import broadcast
orders.join(broadcast(countries), "country")

# switch automatic broadcasting off
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", -1)`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Priority when both sides are hinted</p>
              <p className="text-muted font-mono text-[11px]">
                BROADCAST › MERGE › SHUFFLE_HASH › SHUFFLE_REPLICATE_NL
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Estimates can be wrong</p>
              <p className="text-muted">
                A 3 MB result of a filter may be estimated from its 4 GB source, so Spark won&apos;t
                broadcast it until it sees the real size (module 11).
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Spark decides from its <em>estimate</em> of each table&apos;s size, not the real thing. When
        you know better, a <Term id="join-hint">join hint</Term> says which strategy you want.
      </p>
      <p>
        Hints are suggestions, not orders: the docs say there&apos;s &ldquo;no guarantee&rdquo;,
        because not every strategy supports every join type. Only BROADCAST existed before Spark
        3.0.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The slow join ------------------------------------------------------------------------------- */

export function SlowJoin() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The slow join"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="slow-join"
            prompt="A job joins 2 TB of click events to a 3 MB table of countries, built by a complicated query. The plan shows a SortMergeJoin with an Exchange on both sides, and the shuffle takes 40 minutes. What's the best first fix?"
            options={[
              {
                id: "partitions",
                label: "Raise spark.sql.shuffle.partitions to 2,000",
                feedback: "Smaller pieces, but all 2 TB still crosses the network.",
              },
              {
                id: "hint",
                label: "Broadcast the countries table with a hint",
                correct: true,
                feedback:
                  "Spark's estimate of the countries side was too big to broadcast automatically. The hint copies 3 MB to each executor and the 2 TB never moves.",
              },
              {
                id: "cache",
                label: "Cache the click events first",
                feedback: "Caching keeps data in memory but doesn't avoid the shuffle.",
              },
              {
                id: "range",
                label: "Rewrite the join with BETWEEN",
                feedback: "Without an equality key Spark falls back to nested loops: worse.",
              },
            ]}
            explanation="When one side is genuinely small, broadcasting it removes the shuffle of the big side. Hints fix bad size estimates."
          />
        </div>
      }
    >
      <p>Diagnose the plan.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Small side? Broadcast", "Up to 10 MB by default; the big side stays put."],
  ["Two big sides? Sort-merge", "Shuffle both, sort, merge in one pass."],
  ["Shuffled hash", "Skips the sort, needs memory for the hash table."],
  ["Need an equality key", "Otherwise nested loops, or a Cartesian product."],
  ["Hints fix estimates", "But they're suggestions, not guarantees."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: how Spark revises these choices mid-query, once it sees real sizes.</p>
    </StepLayout>
  );
}

"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CACHES, CORE_OPTS, HEAPS, PARTS, fmt, memory, overhead, type Op } from "./model";
import type { MemState } from "./state";

/* 1 ─ A crowded desk ------------------------------------------------------------------------------ */

export function Desk() {
  const rows: [string, string, string][] = [
    [
      "The desk",
      "Where you spread out the work in hand: sorting, matching, adding up.",
      "border-viz-compute bg-viz-compute/10",
    ],
    [
      "The shelf",
      "Reference books you keep close because you'll need them again.",
      "border-viz-meta bg-viz-meta/10",
    ],
    [
      "The box on the floor",
      "When the desk is full, you file some papers in a box and fetch them later. Slower, but you finish.",
      "border-line bg-surface",
    ],
    [
      "The map that won't fit",
      "A single sheet bigger than the desk. No amount of filing helps.",
      "border-bad bg-bad/10",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A crowded desk"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn("rounded-xl border px-4 py-2.5", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A desk holds the work you&apos;re doing; a shelf holds books you&apos;ll need again. When
        work piles up, you can clear books off the shelf, or put papers in a box on the floor for
        later.
      </p>
      <p>
        An executor&apos;s memory works the same way.{" "}
        <Term id="execution-memory">Execution memory</Term> is the desk;{" "}
        <Term id="storage-memory">storage memory</Term> is the shelf for cached data. When a task
        runs short, it <Term id="spill">spills</Term> to disk and carries on. When something
        can&apos;t be split up, the task fails with an out-of-memory error.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Inside an executor ⭐ ----------------------------------------------------------------------- */

function Pick({
  label,
  opts,
  value,
  onPick,
  fmtOpt,
}: {
  label: string;
  opts: number[];
  value: number;
  onPick(i: number): void;
  fmtOpt(v: number): string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-muted w-32">{label}</span>
      {opts.map((v, i) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === i}
          onClick={() => onPick(i)}
          className={cn(
            "rounded-md border px-2 py-0.5 font-mono text-[11px]",
            value === i ? "border-accent bg-accent-soft" : "border-line",
          )}
        >
          {fmtOpt(v)}
        </button>
      ))}
    </div>
  );
}

export function MemorySim() {
  const [s, set] = useSceneState<MemState>();
  const m = memory(HEAPS[s.heap], CORE_OPTS[s.cores], CACHES[s.cache], PARTS[s.part], s.op);
  const pct = (mb: number) => `${(mb / m.heap) * 100}%`;
  const segs: [string, number, string][] = [
    ["reserved", 300, "bg-viz-idle/50"],
    ["user memory", m.user, "bg-surface-2"],
    ["storage (cached)", m.cached, "bg-viz-meta"],
    ["execution", m.execution, "bg-viz-compute"],
  ];
  const ops: [Op, string][] = [
    ["sort", "sort or aggregate"],
    ["collect", "collect_list of one huge key"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Inside an executor"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5 text-xs">
            <Pick
              label="executor memory"
              opts={HEAPS}
              value={s.heap}
              onPick={(i) => set({ heap: i })}
              fmtOpt={(v) => `${v / 1024}g`}
            />
            <Pick
              label="cores (tasks at once)"
              opts={CORE_OPTS}
              value={s.cores}
              onPick={(i) => set({ cores: i })}
              fmtOpt={String}
            />
            <Pick
              label="data cached here"
              opts={CACHES}
              value={s.cache}
              onPick={(i) => set({ cache: i })}
              fmtOpt={fmt}
            />
            <Pick
              label="each task's data"
              opts={PARTS}
              value={s.part}
              onPick={(i) => set({ part: i })}
              fmtOpt={fmt}
            />
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-32">operation</span>
              {ops.map(([o, l]) => (
                <button
                  key={o}
                  type="button"
                  aria-pressed={s.op === o}
                  onClick={() => set({ op: o })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px]",
                    s.op === o ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="border-line flex h-9 overflow-hidden rounded-lg border">
              {segs.map(([l, mb, c]) => (
                <motion.div
                  key={l}
                  animate={{ width: pct(mb) }}
                  className={cn("relative h-full", c)}
                  title={`${l}: ${fmt(mb)}`}
                />
              ))}
            </div>
            <div className="relative h-3">
              <motion.div
                animate={{ left: pct(300 + m.user), width: pct(m.floor) }}
                className="border-viz-meta absolute top-0.5 h-2 border-x border-b"
              />
            </div>
            <div className="text-muted flex flex-wrap gap-x-3 gap-y-0.5 text-[10px]">
              {segs.map(([l, mb, c]) => (
                <span key={l} className="flex items-center gap-1">
                  <span className={cn("size-2 rounded-sm", c)} />
                  {l} {fmt(mb)}
                </span>
              ))}
              <span>⌴ storage floor execution can&apos;t take: {fmt(m.floor)}</span>
            </div>
          </div>
          <motion.div
            key={`${m.outcome}-${Math.round(m.perTask)}-${s.part}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-xs",
              m.outcome === "fits"
                ? "border-good bg-good/10"
                : m.outcome === "spill"
                  ? "border-viz-compute bg-viz-compute/10"
                  : "border-bad bg-bad/10",
            )}
          >
            <p className="text-sm font-semibold">
              {m.outcome === "fits"
                ? "Fits in memory"
                : m.outcome === "spill"
                  ? `Spills about ${fmt(m.spillMb)} to disk`
                  : "OutOfMemoryError: the task fails"}
            </p>
            <p className="text-muted mt-0.5">
              Each of {CORE_OPTS[s.cores]} tasks can use up to {fmt(m.perTask)} of execution memory
              and needs {fmt(PARTS[s.part])}.
              {m.evicted > 0 && ` Execution evicted ${fmt(m.evicted)} of cached data to make room.`}
              {m.outcome === "spill" &&
                " Sorts and aggregations write sorted runs to disk and merge them later: slower, but the task finishes."}
              {m.outcome === "oom" &&
                " Gathering every value of one key into a single list can't be split into pieces, so there's nothing to spill."}
            </p>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Defaults: 300 MB reserved, spark.memory.fraction 0.6, storageFraction 0.5. Spill and OOM
            rule simplified.
          </p>
        </div>
      }
    >
      <p>
        After 300 MB reserved, 60% of an executor&apos;s heap is one shared pool for execution and
        storage; the other 40% is left for your own objects. Either side can borrow free space.
        Execution can evict cached blocks, but only down to a floor (half the pool by default).
        Storage can never evict execution.
      </p>
      <p>
        The tasks running at once share execution memory, so more cores means less per task. Try a
        big partition with 8 cores, then with 2.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Heap and container -------------------------------------------------------------------------- */

export function Container() {
  const [s, set] = useSceneState<MemState>();
  const heap = HEAPS[s.heap];
  const oh = overhead(heap);
  const py = s.python ? 1536 : 200;
  const used = heap + py;
  const limit = heap + oh;
  const killed = used > limit;
  const total = Math.max(used, limit) * 1.05;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Heap and container"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-muted">executor memory</span>
            {HEAPS.map((h, i) => (
              <button
                key={h}
                type="button"
                aria-pressed={s.heap === i}
                onClick={() => set({ heap: i })}
                className={cn(
                  "rounded-md border px-2 py-0.5 font-mono",
                  s.heap === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {h / 1024}g
              </button>
            ))}
            <button
              type="button"
              aria-pressed={s.python}
              onClick={() => set({ python: !s.python })}
              className={cn(
                "rounded-full border px-3 py-0.5",
                s.python ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {s.python ? "✓ " : ""}Python workers use 1.5 GB
            </button>
          </div>
          <div className="relative">
            <div className="border-line bg-surface flex h-10 overflow-hidden rounded-lg border">
              <motion.div
                animate={{ width: `${(heap / total) * 100}%` }}
                className="bg-viz-compute/70 flex items-center justify-center text-[10px]"
              >
                JVM heap {fmt(heap)}
              </motion.div>
              <motion.div
                animate={{ width: `${(py / total) * 100}%` }}
                className={cn(
                  "flex items-center justify-center text-[10px]",
                  killed ? "bg-bad/60" : "bg-viz-meta/60",
                )}
              >
                outside the heap {fmt(py)}
              </motion.div>
            </div>
            <motion.div
              animate={{ left: `${(limit / total) * 100}%` }}
              className="bg-bad absolute -top-1 -bottom-1 w-0.5"
            />
          </div>
          <p className="text-muted text-[11px]">
            Red line: container limit = heap + overhead ({fmt(oh)}, the larger of 10% and 384 MB) ={" "}
            {fmt(limit)}
          </p>
          <motion.p
            key={String(killed) + heap}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn("text-sm", killed ? "text-bad" : "text-good")}
          >
            {killed
              ? "Over the limit: YARN or Kubernetes kills the whole executor. The heap never ran out, so this isn't a Java OutOfMemoryError."
              : "Within the limit."}
          </motion.p>
        </div>
      }
    >
      <p>
        On YARN and Kubernetes, an executor runs in a container whose size is the heap plus{" "}
        <Term id="memory-overhead">memory overhead</Term>: by default 10% of the heap, at least 384
        MB (40% for non-JVM jobs on Kubernetes). Off-heap memory and PySpark memory are added if
        set.
      </p>
      <p>
        Overhead covers everything outside the Java heap, including Python worker processes unless
        you size them separately. Go over it and the executor is killed from outside, a different
        failure from running out of heap.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Finding spill ------------------------------------------------------------------------------- */

const SUMMARY: [string, string[]][] = [
  ["Duration", ["4 s", "6 s", "7 s", "9 s", "48 s"]],
  ["Shuffle Read Size", ["90 MB", "110 MB", "120 MB", "130 MB", "1.9 GB"]],
  ["Spill (memory)", ["0", "0", "0", "0", "5.6 GB"]],
  ["Spill (disk)", ["0", "0", "0", "0", "1.4 GB"]],
];

export function SpillUi() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Finding spill"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line overflow-x-auto rounded-xl border text-[11px]">
            <div className="bg-surface-2 grid min-w-[440px] grid-cols-[8rem_repeat(5,1fr)] px-2 py-1 font-semibold">
              {["Metric", "Min", "25th", "Median", "75th", "Max"].map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
            {SUMMARY.map(([k, vs]) => (
              <div
                key={k}
                className="bg-surface grid min-w-[440px] grid-cols-[8rem_repeat(5,1fr)] px-2 py-1 font-mono"
              >
                <span className="font-sans">{k}</span>
                {vs.map((v, i) => (
                  <span
                    key={i}
                    className={cn(i === 4 && k.startsWith("Spill") && "text-bad font-semibold")}
                  >
                    {v}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Fix the cause first",
                "More, smaller partitions; fix skew; avoid collect() of big results and broadcasting large tables.",
              ],
              [
                "Then resize",
                "More executor memory, or fewer cores per executor so each task gets a bigger share.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Numbers illustrative.</p>
        </div>
      }
    >
      <p>
        Spill shows up on the stage page as <strong>Spill (memory)</strong> and{" "}
        <strong>Spill (disk)</strong>, which only appear when something spilled. The memory figure
        is the data&apos;s unpacked size in memory; the disk figure is the same data serialised and
        compressed, so it&apos;s smaller.
      </p>
      <p>
        Here only the largest task spilled, and it&apos;s also the one reading the most shuffle
        data: skew causing spill. The tuning guide&apos;s simplest fix for a task that&apos;s too
        big is more parallelism, so each task&apos;s input is smaller.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Spill, OOM or killed? ----------------------------------------------------------------------- */

export function WhatHappens() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Spill, OOM or killed?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="spill-oom-killed"
            prompt="What is the most likely outcome of each?"
            categories={[
              { id: "spill", label: "Spill" },
              { id: "oom", label: "OutOfMemoryError" },
              { id: "killed", label: "Container killed" },
            ]}
            items={[
              {
                id: "sort",
                label: "Sorting a 3 GB partition with 500 MB of execution memory",
                category: "spill",
                why: "Sorts write runs to disk and merge them.",
              },
              {
                id: "collect",
                label: "df.collect() on a 40 GB result, sent to a 4 GB driver",
                category: "oom",
                why: "Everything lands in the driver's heap at once.",
              },
              {
                id: "python",
                label: "Python UDF workers using 2 GB beyond a 400 MB overhead",
                category: "killed",
                why: "Memory outside the heap counts against the container limit.",
              },
              {
                id: "agg",
                label: "A hash aggregation whose table outgrows its memory",
                category: "spill",
                why: "Aggregations can spill too.",
              },
              {
                id: "list",
                label: "collect_list gathering 80 million rows for one key",
                category: "oom",
                why: "One giant list can't be split into pieces.",
              },
            ]}
            explanation="Spill is slow but survives. A heap that can't fit something raises OutOfMemoryError. Exceeding the container (heap + overhead) gets the executor killed."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One shared pool", "60% of (heap − 300 MB) for execution and storage."],
  ["Execution wins", "It can evict cache down to the floor; never the reverse."],
  ["Shared by tasks", "More cores per executor, less memory per task."],
  ["Spill vs OOM vs killed", "Slow; failed task; executor killed from outside."],
  ["Smaller tasks first", "More partitions and no skew before more memory."],
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
      <p>Next: using storage memory on purpose, with caching and persistence.</p>
    </StepLayout>
  );
}

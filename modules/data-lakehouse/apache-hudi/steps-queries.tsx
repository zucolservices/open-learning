"use client";

import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FILE_GROUPS, TRIPS, type FgId } from "./data";
import { Rail } from "./ui";
import type { HudiState } from "./state";

/* 6 ─ Three ways to read a Merge-on-Read table --------------------------------- */

interface QFile {
  id: string;
  kind: "base" | "log";
  time: string;
  values: Record<string, number>;
}

/** MoR table after two delta commits (10:05, 10:10), before any compaction. */
const BEFORE: Record<FgId, QFile[]> = {
  A: [
    {
      id: "A-base",
      kind: "base",
      time: "10:00",
      values: { "t-101": 240, "t-102": 180, "t-103": 310 },
    },
    { id: "A-log1", kind: "log", time: "10:05", values: { "t-102": 210 } },
    { id: "A-log2", kind: "log", time: "10:10", values: { "t-102": 230 } },
  ],
  B: [
    {
      id: "B-base",
      kind: "base",
      time: "10:00",
      values: { "t-104": 150, "t-105": 420, "t-106": 95 },
    },
    { id: "B-log1", kind: "log", time: "10:10", values: { "t-105": 0 } },
  ],
  C: [
    {
      id: "C-base",
      kind: "base",
      time: "10:00",
      values: { "t-107": 340, "t-108": 205, "t-109": 275 },
    },
    { id: "C-log1", kind: "log", time: "10:05", values: { "t-107": 300 } },
  ],
};

function merged(files: QFile[]) {
  return files.reduce<Record<string, number>>((acc, f) => ({ ...acc, ...f.values }), {});
}

const AFTER: Record<FgId, QFile[]> = {
  A: [{ id: "A-base2", kind: "base", time: "10:15", values: merged(BEFORE.A) }],
  B: [{ id: "B-base2", kind: "base", time: "10:15", values: merged(BEFORE.B) }],
  C: [{ id: "C-base2", kind: "base", time: "10:15", values: merged(BEFORE.C) }],
};

type QueryType = HudiState["queryType"];

const QUERY_INFO: Record<QueryType, { label: string; code: string; text: string }> = {
  snapshot: {
    label: "Snapshot",
    code: 'spark.read.format("hudi").load("s3://lake/trips")',
    text: "The default. Reads each file group's base file and merges in its log files, so you get the latest committed data. Freshest, but merging costs time on every read.",
  },
  ro: {
    label: "Read-optimized",
    code: 'spark.read.format("hudi")\n  .option("hoodie.datasource.query.type", "read_optimized")\n  .load("s3://lake/trips")',
    text: "Reads base files only, as plain Parquet. As fast as Copy-on-Write, but it can't see changes still sitting in log files. It's only as fresh as the last compaction.",
  },
  incremental: {
    label: "Incremental",
    code: 'spark.read.format("hudi")\n  .option("hoodie.datasource.query.type", "incremental")\n  .option("hoodie.datasource.read.begin.instanttime", "20260924100500000")\n  .load("s3://lake/trips")',
    text: "Returns only the records that changed after an instant, here 10:05. The timeline says which file groups changed; the _hoodie_commit_time column on every row filters out the rest. Just what's new, ready for the next job.",
  },
};

export function QueryTypes() {
  const [s, set] = useSceneState<HudiState>();
  const q = s.queryType;
  const layout = s.queryCompacted ? AFTER : BEFORE;
  const latest = Object.assign({}, ...FILE_GROUPS.map((fg) => merged(BEFORE[fg])));

  const reads = (fg: FgId, f: QFile) => {
    if (q === "snapshot") return true;
    if (q === "ro") return f.kind === "base";
    // Incremental: the timeline says which file groups changed after 10:05 (A and B);
    // rows are then filtered by their _hoodie_commit_time.
    return fg === "A" || fg === "B";
  };

  const result: { id: string; fare: number }[] = (() => {
    if (q === "incremental") {
      return TRIPS.filter((t) => ["t-102", "t-105"].includes(t.id)).map((t) => ({
        id: t.id,
        fare: latest[t.id],
      }));
    }
    const values = Object.assign(
      {},
      ...FILE_GROUPS.map((fg) =>
        merged(layout[fg].filter((f) => q === "snapshot" || f.kind === "base")),
      ),
    );
    return TRIPS.map((t) => ({ id: t.id, fare: values[t.id] }));
  })();

  return (
    <StepLayout
      eyebrow="Reading"
      title="Three ways to read a Merge-on-Read table"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Segmented
              size="sm"
              value={q}
              options={(Object.keys(QUERY_INFO) as QueryType[]).map(
                (k) => [k, QUERY_INFO[k].label] as [string, string],
              )}
              onChange={(v) => set({ queryType: v as QueryType })}
            />
            <label className="text-muted flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.queryCompacted}
                onChange={(e) => set({ queryCompacted: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Compacted at 10:15
            </label>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {FILE_GROUPS.map((fg) => (
              <div key={fg} className="border-line bg-bg/40 rounded-xl border p-2">
                <p className="text-muted mb-1.5 font-mono text-[10px]">file group {fg}</p>
                <div className="flex flex-wrap gap-1">
                  {layout[fg].map((f) => {
                    const on = reads(fg, f);
                    return (
                      <motion.span
                        key={f.id}
                        animate={{ opacity: on ? 1 : 0.35 }}
                        className={cn(
                          "rounded border px-1.5 py-1 font-mono text-[9px] sm:text-[10px]",
                          f.kind === "base"
                            ? "border-viz-data/60 bg-viz-data/20"
                            : "border-viz-add/60 bg-viz-add/15",
                          on && "ring-viz-compute ring-2",
                        )}
                      >
                        {f.kind} {f.time}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <AnimatePresence mode="wait">
              <motion.div
                key={q}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-muted text-sm">{QUERY_INFO[q].text}</p>
                <Code className="text-[10px]">{QUERY_INFO[q].code}</Code>
              </motion.div>
            </AnimatePresence>
            <div className="border-line bg-surface overflow-hidden rounded-xl border">
              <p className="text-muted bg-surface-2/60 px-3 py-1.5 text-[11px]">
                Result · {result.length} rows
              </p>
              <ul className="grid font-mono text-[10px]">
                {result.map((row) => {
                  const stale = row.fare !== latest[row.id];
                  return (
                    <li
                      key={row.id}
                      className={cn(
                        "border-line flex justify-between border-t px-3 py-0.5",
                        stale && "bg-viz-compute/15 text-viz-compute",
                      )}
                    >
                      <span>{row.id}</span>
                      <span className="tabular-nums">
                        ₹{row.fare}
                        {stale && <span className="ml-1 text-[9px]">(old)</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A Merge-on-Read table holds the same data in two places: base files, and log files with the
        latest changes. So Hudi lets you choose how to read it.
      </p>
      <p>
        This table has had two delta commits since its base files were written. Compare the three
        query types, and watch the highlighted files and the fares. Then tick{" "}
        <strong>Compacted</strong> and compare again.
      </p>
      <p className="text-subtle text-xs">
        Copy-on-Write tables have no log files, so snapshot and read-optimized are the same thing
        there. Time travel (<code>as.of.instant</code>) reads the table as it was at an older
        instant.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint --------------------------------------------------------------- */

export function ReadOptimizedCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does a read-optimized query see?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="read-optimized"
            prompt="A Merge-on-Read table was compacted at 09:00. Since then, three delta commits changed trip t-555's fare: ₹300 → ₹320 → ₹350 → ₹380. What fare does a read-optimized query return?"
            options={[
              {
                id: "380",
                label: "₹380, the latest value",
                feedback: "That's what a snapshot query returns, by merging the log files.",
              },
              {
                id: "300",
                label: "₹300, the value in the base file from the 09:00 compaction",
                correct: true,
                feedback:
                  "Right. Read-optimized reads base files only, and the changes are still in logs.",
              },
              {
                id: "all",
                label: "All four values, one row each",
                feedback:
                  "No query returns every intermediate version as separate rows. For a record of each change, use a CDC query.",
              },
              {
                id: "error",
                label: "An error, because the logs haven't been compacted",
                feedback:
                  "Uncompacted logs are normal in Merge-on-Read. Each query type just treats them differently.",
              },
            ]}
            explanation="Read-optimized trades freshness for speed. Once compaction runs again, it catches up to ₹380."
          />
        </div>
      }
    >
      <p>Think about which files each query type reads.</p>
    </StepLayout>
  );
}

/* 8 ─ Incremental pipelines ---------------------------------------------------- */

const COMMITS = [
  { time: "10:00", changed: TRIPS.map((t) => t.id), note: "bulk insert" },
  { time: "10:05", changed: ["t-102", "t-107"], note: "2 changed" },
  { time: "10:10", changed: ["t-102", "t-105"], note: "2 changed" },
  { time: "10:15", changed: ["t-101", "t-108"], note: "2 changed" },
  { time: "10:20", changed: ["t-104", "t-109"], note: "2 changed" },
];

/** When each downstream run happens, and which commits exist by then. */
const RUNS = [
  { at: "10:02", visible: 1 },
  { at: "10:12", visible: 3 },
  { at: "10:22", visible: 5 },
];

export function IncrementalPipelines() {
  const [s, set] = useSceneState<HudiState>();
  const runs = Math.min(s.incRuns, RUNS.length);
  const visible = runs === 0 ? 1 : RUNS[runs - 1].visible;
  const checkpoint = runs === 0 ? -1 : RUNS[runs - 1].visible - 1;
  const prevCheckpoint = runs <= 1 ? -1 : RUNS[runs - 2].visible - 1;
  const pulled = [
    ...new Set(COMMITS.slice(prevCheckpoint + 1, checkpoint + 1).flatMap((c) => c.changed)),
  ];

  return (
    <StepLayout
      eyebrow="Incremental processing"
      title="Pull only what changed"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={runs >= RUNS.length}
              onClick={() => set({ incRuns: runs + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition enabled:hover:brightness-110 disabled:opacity-35"
            >
              <Play className="size-3.5" />
              Run the downstream job {runs < RUNS.length ? `at ${RUNS[runs].at}` : ""}
            </button>
            <button
              type="button"
              aria-label="Reset"
              disabled={runs === 0}
              onClick={() => set({ incRuns: 0 })}
              className="bg-surface-2 grid size-9 place-items-center rounded-full disabled:opacity-35"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <Rail
            instants={COMMITS.slice(0, runs === 0 ? 1 : visible).map((c, i) => ({
              time: c.time,
              action: i === 0 ? "commit" : "deltacommit",
              state: "completed",
              note: i === checkpoint ? "✓ job checkpoint" : c.note,
            }))}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={runs}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              {runs === 0 ? (
                <p className="text-muted text-sm">
                  A downstream job builds a <code>rider_spend</code> table from <code>trips</code>.
                  Run it and watch how much it reads each time.
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold">
                    Run {runs} at {RUNS[runs - 1].at}:{" "}
                    {runs === 1
                      ? "first run, reads everything"
                      : `changes after ${COMMITS[prevCheckpoint].time}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {TRIPS.map((t) => (
                      <motion.span
                        key={t.id}
                        animate={{ opacity: pulled.includes(t.id) ? 1 : 0.25 }}
                        className={cn(
                          "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                          pulled.includes(t.id)
                            ? "border-viz-compute bg-viz-compute/20"
                            : "border-line border-dashed",
                        )}
                      >
                        {t.id}
                      </motion.span>
                    ))}
                  </div>
                  <p className="text-muted mt-2 text-xs">
                    Pulled {pulled.length} of {TRIPS.length} records. Saved checkpoint:{" "}
                    <strong className="text-fg">{COMMITS[checkpoint].time}</strong>.
                    {runs === 2 &&
                      " t-102 changed twice, but it comes back once, with its latest value."}
                    {runs === 3 &&
                      " On a real table: thousands of changed rows instead of rescanning millions."}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        This is the second half of Hudi&apos;s name: <strong>incrementals</strong>. A downstream job
        remembers the last instant it processed, and next time asks only for records that changed
        after it.
      </p>
      <p>
        It&apos;s how Hudi pipelines chain from raw to clean to aggregated tables in minutes,
        without rescanning whole tables on every run.
      </p>
      <p className="text-subtle text-xs">
        An incremental query returns each changed record&apos;s latest state. To see every change,
        with before and after images, enable Hudi&apos;s <Term id="cdc">CDC</Term> queries.
      </p>
    </StepLayout>
  );
}

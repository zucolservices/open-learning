"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { JOBS, QUERY, STAGES, type Tab } from "./model";
import type { UiState } from "./state";

/* 1 ─ Building a house ---------------------------------------------------------------------------- */

const HOUSE: [string, string, number][] = [
  ["Foundations", "8 workers, each a section of the slab", 8],
  ["Walls", "6 workers, each a wall", 6],
  ["Roof", "4 workers, each a quarter", 4],
];

export function BuildHouse() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Building a house"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-accent text-center text-xs font-semibold">The job: build the house</p>
          {HOUSE.map(([t, d, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">
                  Stage {i + 1}: {t}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: n }, (_, k) => (
                    <span key={k} className="bg-viz-compute size-2.5 rounded-sm" />
                  ))}
                </div>
              </div>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
          <p className="text-muted text-center text-[11px]">
            Each stage must finish before the next can start. Each square is a task.
          </p>
        </div>
      }
    >
      <p>
        Building a house is one job, done in stages: foundations, then walls, then roof. Within each
        stage, many workers do their own piece at the same time. Nobody starts the walls until the
        foundations are finished.
      </p>
      <p>
        Spark uses the same three words. Each action starts a <Term id="job">job</Term>. The job is
        cut into <Term id="stage">stages</Term> wherever data has to be reshuffled between machines,
        and each stage runs one <Term id="task">task</Term> per partition.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A tour of the Spark UI ⭐ ------------------------------------------------------------------- */

export function SparkUi() {
  const [s, set] = useSceneState<UiState>();
  const tabs: [Tab, string][] = [
    ["jobs", "Jobs"],
    ["stages", "Stages"],
    ["sql", "SQL / DataFrame"],
    ["executors", "Executors"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A tour of the Spark UI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{QUERY}</Code>
          <div className="border-line overflow-hidden rounded-xl border">
            <div className="bg-surface-2 flex flex-wrap gap-0.5 px-2 pt-2">
              <span className="text-muted mr-2 self-center font-mono text-[10px]">
                localhost:4040
              </span>
              {tabs.map(([k, l]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.tab === k}
                  onClick={() => set({ tab: k })}
                  className={cn(
                    "rounded-t-md px-2.5 py-1 text-[11px]",
                    s.tab === k ? "bg-surface font-semibold" : "text-muted hover:text-fg",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="bg-surface min-h-44 px-3 py-3 text-[11px]">
              {s.tab === "jobs" && (
                <div className="flex flex-col gap-1.5">
                  {JOBS.map((j) => (
                    <div
                      key={j.id}
                      className="border-line grid grid-cols-[3rem_1fr] gap-x-2 rounded-md border px-2 py-1.5 sm:grid-cols-[3rem_1fr_4rem_5rem]"
                    >
                      <span className="font-mono">Job {j.id}</span>
                      <span>{j.desc}</span>
                      <span className="text-muted">{j.duration}</span>
                      <span className="text-muted">stages {j.stages.join(", ")}</span>
                    </div>
                  ))}
                  <p className="text-muted mt-1">
                    One write, two jobs: Spark first collected the small customers table to
                    broadcast it.
                  </p>
                </div>
              )}
              {s.tab === "stages" && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {STAGES.map((st, i) => (
                      <span key={st.id} className="flex items-center gap-1.5">
                        {i > 0 && <span className="text-muted">→</span>}
                        <button
                          type="button"
                          onClick={() => set({ stage: st.id })}
                          className={cn(
                            "rounded-md border px-2 py-1 font-mono text-[10px]",
                            s.stage === st.id
                              ? "border-accent bg-accent-soft"
                              : "border-line hover:bg-surface-2",
                          )}
                        >
                          Stage {st.id} · {st.tasks} tasks
                        </button>
                      </span>
                    ))}
                  </div>
                  {(() => {
                    const st = STAGES.find((x) => x.id === s.stage)!;
                    return (
                      <motion.div
                        key={st.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-line rounded-md border px-2 py-2"
                      >
                        <p className="font-semibold">{st.name}</p>
                        <div className="text-muted mt-1 grid grid-cols-2 gap-x-3 sm:grid-cols-4">
                          <span>input: {st.input || "–"}</span>
                          <span>shuffle read: {st.shuffleRead || "–"}</span>
                          <span>shuffle write: {st.shuffleWrite || "–"}</span>
                          <span>duration: {st.duration}</span>
                        </div>
                      </motion.div>
                    );
                  })()}
                  <p className="text-muted">
                    Stage 1 ends with a shuffle write; stage 2 starts with the matching shuffle
                    read.
                  </p>
                </div>
              )}
              {s.tab === "sql" && (
                <div className="flex flex-col gap-1 font-mono">
                  <p className="font-sans font-semibold">
                    Query 0: write at revenue.py:6 · jobs 0, 1
                  </p>
                  {[
                    "WriteFiles",
                    "HashAggregate (final)",
                    "AQEShuffleRead (coalesced to 12)",
                    "Exchange hashpartitioning(city, 200)",
                    "HashAggregate (partial)",
                    "BroadcastHashJoin",
                    "Filter (status = 'paid')",
                    "Scan parquet orders",
                  ].map((l, i) => (
                    <p
                      key={l}
                      style={{ paddingLeft: `${i * 8}px` }}
                      className={cn(l.startsWith("Exchange") && "text-bad")}
                    >
                      {i > 0 ? "└ " : ""}
                      {l}
                    </p>
                  ))}
                </div>
              )}
              {s.tab === "executors" && (
                <div className="flex flex-col gap-1">
                  {[
                    ["driver", "–", "–"],
                    ["1", "4 cores", "13 tasks"],
                    ["2", "4 cores", "14 tasks"],
                    ["3", "4 cores", "13 tasks"],
                    ["4", "4 cores", "14 tasks"],
                  ].map(([id, cores, done]) => (
                    <div
                      key={id}
                      className="border-line grid grid-cols-[4rem_1fr_1fr] gap-2 rounded-md border px-2 py-1"
                    >
                      <span className="font-mono">{id}</span>
                      <span className="text-muted">{cores}</span>
                      <span className="text-muted">{done}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            A simplified UI; real pages show many more columns. Numbers illustrative.
          </p>
        </div>
      }
    >
      <p>
        Every driver serves the <Term id="spark-ui">Spark UI</Term>, by default on port 4040. Click
        through the tabs for one query: the jobs it started, their stages, the SQL tab&apos;s plan,
        and the executors that did the work.
      </p>
      <p>
        Notice the write produced two jobs, not one: one action can trigger several, for example to
        collect a table for broadcasting. And each Exchange in the plan is exactly where one stage
        ends and the next begins.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reading a stage ----------------------------------------------------------------------------- */

export function StagePage() {
  const q = STAGES[1].quantiles;
  const labels = ["Min", "25th", "Median", "75th", "Max"];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading a stage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-sm font-semibold">Stage 1 · task duration (seconds) across 40 tasks</p>
          <div className="flex h-28 items-end gap-3">
            {q.map((v, i) => (
              <div key={labels[i]} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[10px]">{v}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(v / 31) * 90}px` }}
                  transition={{ delay: 0.06 * i }}
                  className={cn("w-full rounded-t", i === 4 ? "bg-viz-compute" : "bg-viz-data/60")}
                />
                <span className="text-muted text-[10px]">{labels[i]}</span>
              </div>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Duration spread",
                "Max close to the 75th percentile: tasks are balanced. A max far above it means skew (module 13).",
              ],
              [
                "Shuffle read and write",
                "How much data crossed the network between stages (module 9).",
              ],
              [
                "Spill (memory) and Spill (disk)",
                "Appear only when tasks ran out of memory and spilled (module 14).",
              ],
              [
                "GC time",
                "Time lost to Java garbage collection; high values suggest memory pressure.",
              ],
            ].map(([t, d]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Each stage page has a summary table: the minimum, 25th percentile, median, 75th percentile
        and maximum of every task metric. It&apos;s the quickest way to see whether work was spread
        evenly.
      </p>
      <p>
        Most tuning in this track starts here: find the slowest stage, then ask whether its tasks
        are uneven, its shuffles large, or its memory short.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When the job is over ------------------------------------------------------------------------ */

export function AfterApp() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When the job is over"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`spark.eventLog.enabled   true
spark.eventLog.dir       s3://logs/spark-events/
# then run the History Server, which reads those logs
./sbin/start-history-server.sh`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Port 4040, 4041…</p>
              <p className="text-muted">
                Each running application gets a UI; a second one on the same machine takes the next
                port.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Managed platforms</p>
              <p className="text-muted">
                Databricks, EMR, Dataproc and Fabric keep the UI and history for you, behind their
                own consoles.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The live UI disappears when the application ends: by default its information &ldquo;is only
        available for the duration of the application&rdquo;. That&apos;s awkward for a nightly job
        that failed at 3 am.
      </p>
      <p>
        The fix is event logging plus the <Term id="history-server">History Server</Term>, which
        replays finished applications&apos; UIs from their logs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Job, stage or task? ------------------------------------------------------------------------- */

export function JobStageTask() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Job, stage or task?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="job-stage-task"
            prompt="Which word fits each description?"
            categories={[
              { id: "job", label: "Job" },
              { id: "stage", label: "Stage" },
              { id: "task", label: "Task" },
            ]}
            items={[
              {
                id: "write",
                label: "The work started by one df.write.parquet(...)",
                category: "job",
                why: "Actions start jobs.",
              },
              {
                id: "between",
                label: "All the work between two shuffles",
                category: "stage",
                why: "Stages end where data is exchanged.",
              },
              {
                id: "part7",
                label: "Processing partition 7 of stage 3",
                category: "task",
                why: "One task per partition.",
              },
              {
                id: "core",
                label: "Runs on a single executor core",
                category: "task",
                why: "A task uses one task slot.",
              },
              {
                id: "parents",
                label: "Waits for its parent to finish writing shuffle files",
                category: "stage",
                why: "A stage depends on earlier stages.",
              },
            ]}
            explanation="Actions start jobs; jobs split into stages at shuffles; stages run one task per partition on executor cores."
          />
        </div>
      }
    >
      <p>Sort the descriptions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Action → job", "Sometimes several jobs per action."],
  ["Shuffle → new stage", "Each Exchange in the plan is a stage boundary."],
  ["Partition → task", "One task per partition per stage."],
  ["Start in the UI", "Slowest stage first, then its task summary."],
  ["Keep the history", "Event logs and the History Server."],
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
      <p>Next: the boundary between stages itself, the shuffle, and why it costs so much.</p>
    </StepLayout>
  );
}

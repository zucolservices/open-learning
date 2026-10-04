"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DATA_MB, run } from "./model";
import type { PartState } from "./state";

/* 1 ─ Marking exam papers ------------------------------------------------------------------------- */

const CASES: [string, string, string][] = [
  ["4 bundles of 2,500", "8 markers", "Four markers work all day; four sit idle."],
  ["10,000 single papers", "8 markers", "Markers spend more time fetching papers than marking."],
  ["24 bundles of about 400", "8 markers", "Everyone busy, three rounds each, all done together."],
];

export function Markers() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Marking exam papers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {CASES.map(([b, m, d], i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                i === 2 ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/5",
              )}
            >
              <p className="text-sm font-semibold">
                {b} <span className="text-muted text-xs font-normal">· {m}</span>
              </p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Ten thousand exam papers, eight markers. Hand out four huge bundles and half the markers
        have nothing to do. Hand out papers one at a time and markers spend their day walking to the
        pile. A few bundles per marker keeps everyone busy.
      </p>
      <p>
        Spark splits data into <Term id="partition">partitions</Term>, and runs one task per
        partition. How many partitions you have, compared with the cluster&apos;s task slots,
        decides your <Term id="parallelism">parallelism</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tasks in waves ⭐ --------------------------------------------------------------------------- */

export function Waves() {
  const [s, set] = useSceneState<PartState>();
  const r = run(s.partitions, s.slots);
  const shownWaves = Math.min(r.waves, 12);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Tasks in waves"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24">partitions</span>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={Math.round(Math.log2(s.partitions) * 1)}
              onChange={(e) => set({ partitions: 2 ** Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-12 text-right font-mono">{s.partitions}</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24">task slots</span>
            <input
              type="range"
              min={8}
              max={64}
              step={8}
              value={s.slots}
              onChange={(e) => set({ slots: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-12 text-right font-mono">{s.slots}</span>
          </label>
          <div className="flex flex-col gap-0.5">
            {Array.from({ length: shownWaves }, (_, w) => {
              const inWave = Math.min(s.slots, s.partitions - w * s.slots);
              return (
                <div key={w} className="flex items-center gap-1.5">
                  <span className="text-subtle w-12 font-mono text-[9px]">wave {w + 1}</span>
                  <div className="bg-surface-2 flex h-2.5 flex-1 overflow-hidden rounded-sm">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(inWave / s.slots) * 100}%` }}
                      className="bg-viz-compute h-full"
                    />
                  </div>
                </div>
              );
            })}
            {r.waves > shownWaves && (
              <p className="text-subtle text-[10px]">… and {r.waves - shownWaves} more waves</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              [
                "partition size",
                `${r.mb >= 1024 ? (r.mb / 1024).toFixed(1) + " GB" : Math.round(r.mb) + " MB"}`,
              ],
              ["waves", String(r.waves)],
              ["cores busy", `${r.util}%`],
              ["stage time", `${r.total} s`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2.5 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <motion.p
            key={s.partitions + "-" + s.slots}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              r.tone === "good"
                ? "border-good/50 bg-good/10"
                : r.tone === "bad"
                  ? "border-bad/50 bg-bad/10"
                  : "border-line bg-surface",
            )}
          >
            {r.verdict}
          </motion.p>
          <p className="text-subtle text-[10px]">
            {DATA_MB / 1024} GB of data; each task processes 64 MB/s and costs 0.6 s to schedule and
            start. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        Sixteen gigabytes to process. Change the number of partitions and task slots, and watch the
        tasks run in waves. Bars show how full each wave is.
      </p>
      <p>
        Too few partitions and cores sit idle; too many and per-task overhead dominates.
        Spark&apos;s tuning guide: &ldquo;In general, we recommend 2-3 tasks per CPU core in your
        cluster.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 3 ─ Where partition counts come from ------------------------------------------------------------ */

const SOURCES: [string, string, string][] = [
  [
    "Reading files",
    "spark.sql.files.maxPartitionBytes = 128 MB",
    "Spark packs up to about 128 MB of file data into each read partition, so a 10 GB table reads as roughly 80 partitions.",
  ],
  [
    "After a shuffle",
    "spark.sql.shuffle.partitions = 200",
    "Joins and aggregations produce 200 partitions by default, then Adaptive Query Execution (on by default) merges small ones at runtime (module 11).",
  ],
  [
    "RDD operations",
    "spark.default.parallelism",
    "For older RDD code: usually the total number of executor cores.",
  ],
  ["You, explicitly", "repartition(n), coalesce(n)", "When you know better than the defaults."],
];

export function WhereCounts() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where partition counts come from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {SOURCES.map(([t, cfg, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-accent font-mono text-[11px]">{cfg}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You rarely choose the partition count directly. Spark picks one when it reads files, and
        again after every shuffle. Knowing the defaults explains a lot of odd-looking task counts in
        the Spark UI.
      </p>
      <p>
        A classic surprise: a small job with a groupBy shows 200 tasks. That&apos;s the shuffle
        default, and with AQE most of them get merged before they run.
      </p>
    </StepLayout>
  );
}

/* 4 ─ repartition or coalesce? -------------------------------------------------------------------- */

export function Reshape() {
  const [s, set] = useSceneState<PartState>();
  const rep = s.op === "repartition";
  return (
    <StepLayout
      eyebrow="Explore"
      title="repartition or coalesce?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<PartState["op"]>
            size="sm"
            value={s.op}
            onChange={(op) => set({ op })}
            options={[
              ["coalesce", "coalesce(3)"],
              ["repartition", "repartition(3)"],
            ]}
          />
          <svg viewBox="0 0 240 110" className="mx-auto w-full max-w-sm" aria-hidden>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect
                key={i}
                x={12 + i * 37}
                y={8}
                width={30}
                height={16}
                rx={2}
                className="fill-viz-data/20 stroke-viz-data"
              />
            ))}
            {[0, 1, 2].map((j) => (
              <rect
                key={j}
                x={40 + j * 70}
                y={84}
                width={50}
                height={18}
                rx={2}
                className="fill-viz-compute/20 stroke-viz-compute"
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((i) =>
              rep ? (
                [0, 1, 2].map((j) => (
                  <line
                    key={`${i}${j}`}
                    x1={27 + i * 37}
                    y1={24}
                    x2={65 + j * 70}
                    y2={84}
                    className="stroke-bad"
                    strokeWidth={0.7}
                  />
                ))
              ) : (
                <line
                  key={i}
                  x1={27 + i * 37}
                  y1={24}
                  x2={65 + Math.floor(i / 2) * 70}
                  y2={84}
                  className="stroke-good"
                  strokeWidth={1.2}
                />
              ),
            )}
          </svg>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              rep ? "border-line bg-surface" : "border-good/50 bg-good/10",
            )}
          >
            {rep
              ? "repartition shuffles every row across the network into evenly balanced partitions. It can increase or decrease the count."
              : "coalesce merges neighbouring partitions without a shuffle: cheap, but it can only reduce the count, and sizes may be uneven."}
          </p>
          <Code>{`df.coalesce(10).write.parquet("out/")     # fewer output files, no shuffle
df.repartition(200, "customer_id")         # more, balanced partitions by key`}</Code>
        </div>
      }
    >
      <p>
        Two ways to change the partition count. <Term id="coalesce">coalesce</Term> merges
        partitions in place; PySpark&apos;s docs describe going from 1,000 to 100 partitions with
        &ldquo;no shuffle&rdquo;, each new partition claiming 10 old ones.{" "}
        <Term id="repartition">repartition</Term> &ldquo;always shuffles all data over the
        network.&rdquo;
      </p>
      <p>
        A drastic coalesce, down to one partition, puts all the work on one core. If you need
        balance or more partitions, pay for the repartition.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The idle cluster ---------------------------------------------------------------------------- */

export function FixIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The idle cluster"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="idle-cluster"
            prompt="A job reads one 60 GB file that is compressed with gzip, which Spark can't split. The read stage shows 1 task running for 40 minutes while 79 of the cluster's 80 cores sit idle. What's the best fix?"
            options={[
              {
                id: "more",
                label: "Add more executors",
                feedback: "There's still only one task; more cores would also sit idle.",
              },
              {
                id: "repart",
                label:
                  "Repartition to a couple of hundred partitions right after reading, and ask for splittable files in future",
                correct: true,
                feedback:
                  "The read stays single-threaded this time, but everything after it runs in parallel. Splittable formats like Parquet fix the read too.",
              },
              {
                id: "coalesce",
                label: "coalesce(200) after reading",
                feedback: "coalesce can't increase the number of partitions.",
              },
              {
                id: "memory",
                label: "Give the executor more memory",
                feedback: "The problem is parallelism, not memory.",
              },
            ]}
            explanation="One partition means one task. Increase partitions with repartition (a shuffle), and prefer splittable formats so reads parallelise."
          />
        </div>
      }
    >
      <p>Spot the bottleneck.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One task per partition", "Partitions decide how much work can run at once."],
  ["Aim for 2–3 per core", "Enough to keep cores busy, not so many that overhead wins."],
  ["Know the defaults", "128 MB file splits; 200 shuffle partitions, merged by AQE."],
  ["coalesce reduces cheaply", "No shuffle, can't increase."],
  ["repartition balances", "Full shuffle; can go up or down."],
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
      <p>Next: talking to Spark in SQL, and why it&apos;s the same engine as DataFrames.</p>
    </StepLayout>
  );
}

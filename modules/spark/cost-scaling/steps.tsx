"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SHAPES, SIZES, SPOTS, STAGES, run } from "./model";
import type { CostState } from "./state";

/* 1 ─ Staffing the dinner rush -------------------------------------------------------------------- */

const HOURS = [2, 2, 3, 8, 10, 4, 2];

export function Restaurant() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Staffing the dinner rush"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex h-32 items-end justify-center gap-2">
            {HOURS.map((h, i) => (
              <div key={i} className="relative flex w-8 flex-col items-center">
                <div
                  className="border-bad absolute w-full border-t-2 border-dashed"
                  style={{ bottom: `${10 * 11}px` }}
                />
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: h * 11 }}
                  transition={{ delay: 0.06 * i }}
                  className="bg-viz-compute w-full rounded-t"
                />
              </div>
            ))}
          </div>
          <p className="text-muted text-center text-xs">
            Bars: staff needed each hour. Dashed line: staff paid all day if you hire for the peak.
          </p>
        </div>
      }
    >
      <p>
        A restaurant needs ten staff at the dinner rush and two in the afternoon. Paying ten people
        all day wastes most of the wages. Bringing extra staff in for the rush, some from an agency
        at a lower rate, costs far less.
      </p>
      <p>
        A Spark cluster costs executors × time. Most jobs have busy wide stages and quiet narrow
        ones. <Term id="dynamic-allocation">Dynamic allocation</Term> adds executors when tasks
        queue and hands idle ones back; <Term id="spot-instance">spot capacity</Term> is the cheaper
        agency staff who might be called away.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Size a nightly job ⭐ ----------------------------------------------------------------------- */

export function CostSim() {
  const [s, set] = useSceneState<CostState>();
  const n = SIZES[s.size];
  const r = run(n, s.dynamic, s.shuffle, SPOTS[s.spot], s.decom);
  const base = run(SIZES[3], false, "service", 0, false);
  const maxExec = Math.max(...SIZES);
  const totalMins = r.stages.reduce((a, b) => a + b.mins, 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Size a nightly job"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-28">{s.dynamic ? "max executors" : "executors"}</span>
              {SIZES.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={s.size === i}
                  onClick={() => set({ size: i })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                    s.size === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-28">scaling</span>
              <button
                type="button"
                aria-pressed={s.dynamic}
                onClick={() => set({ dynamic: !s.dynamic })}
                className={cn(
                  "rounded-md border px-2 py-0.5 text-[11px]",
                  s.dynamic ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {s.dynamic ? "✓ " : ""}dynamic allocation
              </button>
              {s.dynamic &&
                (
                  [
                    ["service", "external shuffle service"],
                    ["tracking", "shuffle tracking"],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={s.shuffle === k}
                    onClick={() => set({ shuffle: k })}
                    className={cn(
                      "rounded-md border px-2 py-0.5 text-[11px]",
                      s.shuffle === k ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {l}
                  </button>
                ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-28">spot executors</span>
              {SPOTS.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={s.spot === i}
                  onClick={() => set({ spot: i })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                    s.spot === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {v * 100}%
                </button>
              ))}
              {s.spot > 0 && (
                <button
                  type="button"
                  aria-pressed={s.decom}
                  onClick={() => set({ decom: !s.decom })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[11px]",
                    s.decom ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {s.decom ? "✓ " : ""}graceful decommissioning
                </button>
              )}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="flex h-28 items-end gap-0.5">
              {r.stages.map((st, i) => (
                <div
                  key={STAGES[i].name}
                  className="flex h-full flex-col justify-end"
                  style={{ width: `${(st.mins / totalMins) * 100}%` }}
                >
                  <motion.div
                    animate={{ height: `${(n / maxExec) * 100}%` }}
                    className="border-line relative w-full rounded-t border border-dashed"
                  >
                    <motion.div
                      animate={{ height: `${(st.execs / n) * 100}%` }}
                      className="bg-viz-idle/40 absolute bottom-0 w-full rounded-t"
                    />
                    <motion.div
                      animate={{ height: `${(st.busy / n) * 100}%` }}
                      className={cn(
                        "absolute bottom-0 w-full rounded-t",
                        s.spot > 0 ? "bg-viz-meta" : "bg-viz-compute",
                      )}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="mt-1 flex gap-0.5">
              {r.stages.map((st, i) => (
                <p
                  key={STAGES[i].name}
                  className="text-muted truncate text-[9px]"
                  style={{ width: `${(st.mins / totalMins) * 100}%` }}
                >
                  {STAGES[i].name} · {Math.round(st.mins)} min · {st.execs} paid, {st.busy} busy
                </p>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted text-[10px]">runtime</p>
                <p className="font-mono text-base font-semibold">{Math.round(r.mins)} min</p>
              </div>
              <div>
                <p className="text-muted text-[10px]">cost per run</p>
                <p className="font-mono text-base font-semibold">${r.cost.toFixed(2)}</p>
                {r.cost < base.cost - 0.5 && (
                  <p className="text-good font-mono text-[11px]">
                    {Math.round((1 - r.cost / base.cost) * 100)}% less than 100 fixed
                  </p>
                )}
              </div>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            4-core executors at $0.40/hour, spot 70% cheaper; interruption costs and all figures
            illustrative.
          </p>
        </div>
      }
    >
      <p>
        The job has a wide read, a narrow stage that can only use 20 tasks at once, and a wide join.
        The dashed outline is the cluster&apos;s size, the pale bar the executors you pay for, and
        the solid bar the ones doing work. Shrinking the cluster saves money but slows the wide
        stages.
      </p>
      <p>
        Turn on dynamic allocation: idle executors leave after 60 s. With shuffle tracking (the
        default way, and the only way on Kubernetes), executors holding shuffle data the next stage
        needs are kept, so savings shrink. Then add spot executors.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Shaping executors --------------------------------------------------------------------------- */

export function Shapes() {
  const [s, set] = useSceneState<CostState>();
  const x = SHAPES[s.shape] ?? SHAPES[1];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Shaping executors"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            One worker node: 16 cores, 64 GB. Leave a core and a little memory for the OS.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SHAPES.map((sh, i) => (
              <button
                key={sh.name}
                type="button"
                aria-pressed={s.shape === i}
                onClick={() => set({ shape: i })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.shape === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {sh.name}
              </button>
            ))}
          </div>
          <div className="border-line flex h-14 gap-1 rounded-xl border p-1.5">
            {Array.from({ length: s.shape === 0 ? 1 : s.shape === 1 ? 3 : 15 }, (_, k) => (
              <motion.div
                key={`${s.shape}-${k}`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: 0.02 * k }}
                className="bg-viz-compute/25 border-viz-compute flex-1 rounded border"
              />
            ))}
            <div className="bg-surface-2 w-[6%] rounded" title="OS and overhead" />
          </div>
          <motion.div
            key={x.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2 text-xs sm:grid-cols-3"
          >
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">each executor</p>
              <p className="font-mono font-semibold">{x.spec}</p>
            </div>
            <div className="border-good bg-good/10 rounded-lg border px-3 py-2">{x.pros}</div>
            <div className="border-bad bg-bad/10 rounded-lg border px-3 py-2">{x.cons}</div>
          </motion.div>
        </div>
      }
    >
      <p>
        The same node can be split into a few fat executors or many thin ones. Spark&apos;s docs
        give defaults but no official recipe. The much-repeated &ldquo;about five cores per
        executor&rdquo; comes from a 2015 Cloudera post about Spark 1.3 and HDFS, now marked as
        historical.
      </p>
      <p>
        A sensible start is the middle: several cores per executor, heaps well under 64 GB. Then let
        the Spark UI (GC time, spill, idle cores) tell you which way to move.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Cheaper, interruptible capacity ------------------------------------------------------------- */

export function Spot() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Cheaper, interruptible capacity"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Keep on demand",
                "The driver, EMR primary and core nodes (they hold HDFS data), anything whose loss kills the job.",
              ],
              [
                "Put on spot",
                "Extra executors: EMR task nodes, Google's secondary workers (which store no data). Mix several instance types.",
              ],
            ].map(([t, d], i) => (
              <div
                key={t}
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  i === 0 ? "border-viz-data bg-viz-data/10" : "border-viz-meta bg-viz-meta/10",
                )}
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </div>
            ))}
          </div>
          <Code>{`# Leave gracefully when a spot VM is reclaimed (best effort)
spark.decommission.enabled                          true
spark.storage.decommission.enabled                  true
spark.storage.decommission.shuffleBlocks.enabled    true
spark.storage.decommission.rddBlocks.enabled        true
spark.storage.decommission.fallbackStorage.path     s3a://bucket/spark-fallback/`}</Code>
        </div>
      }
    >
      <p>
        Clouds sell spare capacity cheaply, but can take it back: AWS gives a two-minute warning
        before reclaiming a Spot Instance. Google&apos;s spot VMs work the same way.
      </p>
      <p>
        With decommissioning on (since Spark 3.1), an executor that&apos;s about to go tries to copy
        its shuffle and cached blocks elsewhere first, so less work is redone. It&apos;s best
        effort, not a guarantee.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The idle cluster ---------------------------------------------------------------------------- */

export function IdleCluster() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The idle cluster"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="idle-cluster-cost"
            prompt="A nightly job runs on a fixed cluster of 100 executors. The Executors tab shows all 100 busy for 20 minutes, then only 5 busy for the next 90 minutes while the rest sit idle. What cuts the cost most without slowing the job?"
            options={[
              {
                id: "small",
                label: "Shrink the cluster to 5 executors",
                feedback: "The first stage would take about 20 times longer.",
              },
              {
                id: "spot",
                label: "Move the driver and all executors to spot",
                feedback:
                  "Cheaper per hour, but losing the driver kills the job, and you'd still pay for 95 idle executors.",
              },
              {
                id: "dynamic",
                label: "Turn on dynamic allocation with up to 100 executors",
                correct: true,
                feedback:
                  "Idle executors are released after about a minute, so the quiet 90 minutes cost 5 executors, not 100.",
              },
              {
                id: "memory",
                label: "Give each executor more memory",
                feedback: "That raises the cost of the idle executors too.",
              },
            ]}
            explanation="Fixed clusters pay for their peak all the time. Dynamic allocation follows the work; spot lowers the price of what's left."
          />
        </div>
      }
    >
      <p>Choose the change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Cost = executors × time", "Watch idle executors in the UI."],
  ["Dynamic allocation", "Off by default; shuffle tracking makes it work anywhere."],
  ["Shape executors sensibly", "Several cores each, heaps well under 64 GB."],
  ["Spot for spare executors", "Never the driver; add decommissioning."],
  ["Measure, then tune", "Rules of thumb are starting points."],
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
      <p>Next: the capstone, a nightly job that misses its deadline.</p>
    </StepLayout>
  );
}

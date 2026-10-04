"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CORES, HOT_KEYS, PARTS, SALTS, SHARES, fmtS, run, type Fix } from "./model";
import type { SkewState } from "./state";

/* 1 ─ The canteen queue --------------------------------------------------------------------------- */

const QUEUES = [3, 2, 3, 14, 2, 3];

export function Checkouts() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The canteen queue"
      stage={
        <div className="flex flex-1 items-end justify-center gap-3 pb-6">
          {QUEUES.map((n, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="flex flex-col-reverse gap-0.5">
                {Array.from({ length: n }, (_, k) => (
                  <motion.span
                    key={k}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.03 * k }}
                    className={cn("size-3 rounded-full", i === 3 ? "bg-bad" : "bg-viz-data/60")}
                  />
                ))}
              </div>
              <span className="border-line bg-surface rounded border px-1.5 py-0.5 text-[10px]">
                {i === 3 ? "S" : "ABCDEF"[i]}
              </span>
            </div>
          ))}
        </div>
      }
    >
      <p>
        Imagine a school canteen where pupils queue by the first letter of their surname. Most
        queues are short, but the &ldquo;S&rdquo; queue is huge. Lunch isn&apos;t over until the
        last pupil in that queue is served, however quickly the others finish.
      </p>
      <p>
        That&apos;s <Term id="data-skew">data skew</Term>. Spark sends every row with the same key
        to the same task, so if one key owns most of the rows, one task does most of the work. The
        whole stage waits for that <Term id="straggler">straggler</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One key, one slow task ⭐ ------------------------------------------------------------------- */

export function SkewSim() {
  const [s, set] = useSceneState<SkewState>();
  const share = SHARES[s.share];
  const r = run(share, s.fix, s.salt);
  const base = run(share, "none", s.salt);
  const maxT = Math.max(...base.times);
  const fixes: [Fix, string][] = [
    ["none", "no fix"],
    ["aqe", "AQE skew join"],
    ["salt", "salting"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One key, one slow task"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted w-28">hottest key&apos;s share</span>
              {SHARES.map((v, i) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={s.share === i}
                  onClick={() => set({ share: i })}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono",
                    s.share === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {v * 100}%
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted w-28">fix</span>
              {fixes.map(([f, l]) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={s.fix === f}
                  onClick={() => set({ fix: f })}
                  className={cn(
                    "rounded-md border px-2 py-1",
                    s.fix === f ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {l}
                </button>
              ))}
              {s.fix === "salt" &&
                SALTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={s.salt === n}
                    onClick={() => set({ salt: n })}
                    className={cn(
                      "rounded-md border px-2 py-1 font-mono text-[11px]",
                      s.salt === n ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    ×{n}
                  </button>
                ))}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="flex h-28 items-end gap-0.5">
              {r.times.map((t, i) => (
                <motion.div
                  key={`${r.times.length}-${i}`}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(3, (t / maxT) * 100)}%` }}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    t > 3 * r.q[2] ? "bg-bad" : "bg-viz-data/70",
                  )}
                />
              ))}
            </div>
            <p className="text-muted mt-1 text-[10px]">
              {r.times.length} tasks on {CORES} cores; bar height is task duration.
            </p>
            <div className="mt-2 grid grid-cols-5 gap-1 text-center text-[11px]">
              {["Min", "25th", "Median", "75th", "Max"].map((l, i) => (
                <div key={l}>
                  <p className="text-muted text-[10px]">{l}</p>
                  <p
                    className={cn(
                      "font-mono font-semibold",
                      i === 4 && r.q[4] > 1.5 * r.q[3] && "text-bad",
                    )}
                  >
                    {fmtS(r.q[i])}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs">
              Stage time: <span className="font-mono font-semibold">{fmtS(r.stage)}</span>
              {s.fix !== "none" && r.stage < base.stage - 1 && (
                <span className="text-good"> (was {fmtS(base.stage)})</span>
              )}
            </p>
          </div>
          <motion.p
            key={r.note}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-xs"
          >
            {r.note}
          </motion.p>
          <p className="text-subtle text-[10px]">
            A join stage with {PARTS} shuffle partitions; sizes and timings illustrative.
          </p>
        </div>
      }
    >
      <p>
        Raise the hottest key&apos;s share and watch one bar grow. Adding cores doesn&apos;t help: a
        single key can&apos;t be split across tasks by hashing alone.
      </p>
      <p>
        Then try the two fixes. AQE splits a skewed partition in a shuffle join automatically (on by
        default). <Term id="salting">Salting</Term> does it by hand: add a random number to the hot
        key so its rows spread over several partitions.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Spotting skew ------------------------------------------------------------------------------- */

export function SpotIt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Spotting skew"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">Stage 7: 199/200 tasks</span>
              <span className="text-muted">running 41 min</span>
            </div>
            <div className="bg-surface-2 mt-1.5 h-2.5 overflow-hidden rounded">
              <div className="bg-viz-compute h-full w-[99.5%]" />
            </div>
          </div>
          <Code>{`df.groupBy("customer_id").count() \\
  .orderBy(F.desc("count")).show(5)`}</Code>
          <div className="border-line overflow-hidden rounded-xl border font-mono text-[11px]">
            {HOT_KEYS.map(([k, n], i) => (
              <div
                key={k}
                className={cn(
                  "flex justify-between px-3 py-1",
                  i % 2 ? "bg-surface" : "bg-surface-2",
                  i < 2 && "text-bad",
                )}
              >
                <span>{k}</span>
                <span>{n}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Counts illustrative.</p>
        </div>
      }
    >
      <p>
        The classic symptom is a stage stuck at &ldquo;199 of 200 tasks&rdquo;. On its stage page,
        the summary table shows the Max duration and shuffle read size far above the median and 75th
        percentile. Databricks&apos; rule of thumb: a Max 50% above the 75th percentile suggests
        skew.
      </p>
      <p>
        To find the culprit, count rows per key. NULL is a common one: every row with a missing key
        hashes to the same place.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fixes, in order ----------------------------------------------------------------------------- */

const STEPS: [string, string][] = [
  [
    "1. Deal with junk keys",
    "Filter out NULLs (or join them separately) if they can't match anything anyway.",
  ],
  [
    "2. Broadcast the small side",
    "If the other table is small, a broadcast join has no shuffle, so no skewed partition.",
  ],
  [
    "3. Let AQE split it",
    "For shuffle joins, AQE's skew join is on by default. Check the final plan.",
  ],
  ["4. Salt, as a last resort", "It needs code changes. Salt only the hot keys if you can."],
];

export function Fixes() {
  const [s, set] = useSceneState<SkewState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fixes, in order"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1.5 sm:grid-cols-2">
            {STEPS.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{d}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex gap-1.5">
            {[
              [false, "salt a join"],
              [true, "salt an aggregation"],
            ].map(([v, l]) => (
              <button
                key={String(v)}
                type="button"
                aria-pressed={s.agg === v}
                onClick={() => set({ agg: v as boolean })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.agg === v ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l as string}
              </button>
            ))}
          </div>
          <Code>
            {s.agg
              ? `N = 8
step1 = (orders
  .withColumn("salt", (F.rand() * N).cast("int"))
  .groupBy("merchant_id", "salt").agg(F.sum("amount").alias("part")))
result = step1.groupBy("merchant_id").agg(F.sum("part"))   # second, small aggregation`
              : `N = 8
big = orders.withColumn("salt", (F.rand() * N).cast("int"))
small = customers.crossJoin(spark.range(N).withColumnRenamed("id", "salt"))
big.join(small, ["customer_id", "salt"])   # each hot key now spans N partitions`}
          </Code>
        </div>
      }
    >
      <p>
        Try the simple fixes first. Databricks&apos; own guide says salting &ldquo;should be the
        last choice, not the first, as it requires code changes&rdquo;.
      </p>
      <p>
        AQE&apos;s automatic fix covers shuffle joins, not skewed <code>groupBy</code> aggregations.
        For those, salt and aggregate twice: once per key and salt, then once per key.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The marketplace merchant -------------------------------------------------------------------- */

export function MerchantSkew() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The marketplace merchant"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="merchant-skew"
            prompt='A nightly job runs orders.groupBy("merchant_id").agg(sum("amount")). One marketplace merchant has 45% of all orders, and one task runs for an hour. AQE is on. What helps most?'
            options={[
              {
                id: "aqe",
                label: "Nothing: AQE's skew join will split it",
                feedback: "AQE's skew handling is for shuffle joins, not aggregations.",
              },
              {
                id: "parts",
                label: "Raise spark.sql.shuffle.partitions to 2,000",
                feedback: "One key still lands in one partition, however many there are.",
              },
              {
                id: "salt",
                label: "Salt merchant_id and aggregate twice",
                correct: true,
                feedback:
                  "The first aggregation spreads the hot merchant over N tasks; the second combines N partial sums per merchant, which is tiny.",
              },
              {
                id: "broadcast",
                label: "Broadcast the orders table",
                feedback: "There's no join here, and orders is the big table anyway.",
              },
            ]}
            explanation="Hash partitioning keeps each key in one task. For skewed aggregations, salting plus a two-step aggregation spreads the hot key."
          />
        </div>
      }
    >
      <p>Choose the fix.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["One key, one task", "Hashing sends all of a key's rows to the same partition."],
  ["Watch Max vs 75th", "In the stage summary; and 199/200 tasks stuck."],
  ["Count per key", "NULLs and giant customers are the usual suspects."],
  ["AQE for joins", "Over 5× the median and over 256 MB gets split."],
  ["Salt last", "Random suffix on the hot key; aggregate twice."],
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
      <p>Next: what happens when a task&apos;s data doesn&apos;t fit in memory.</p>
    </StepLayout>
  );
}

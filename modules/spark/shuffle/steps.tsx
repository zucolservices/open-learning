"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, KEYS, OPS, SCENARIOS, dest, mapInputs, type Scenario } from "./model";
import type { ShuffleState } from "./state";

/* 1 ─ The sorting office -------------------------------------------------------------------------- */

export function MailRoom() {
  const towns = ["North", "East", "West"];
  return (
    <StepLayout
      eyebrow="Story"
      title="The sorting office"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <svg
            viewBox="0 0 300 180"
            className="w-full max-w-md"
            role="img"
            aria-label="Three sorters each send letters to three delivery rounds"
          >
            {[0, 1, 2].map((i) =>
              [0, 1, 2].map((j) => (
                <line
                  key={`${i}${j}`}
                  x1={70}
                  y1={35 + i * 55}
                  x2={230}
                  y2={35 + j * 55}
                  className="stroke-line-strong"
                  strokeWidth={1}
                />
              )),
            )}
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect
                  x={10}
                  y={20 + i * 55}
                  width={60}
                  height={30}
                  rx={6}
                  className="fill-viz-compute/15 stroke-viz-compute"
                />
                <text x={40} y={39 + i * 55} textAnchor="middle" className="fill-fg text-[10px]">
                  sorter {i + 1}
                </text>
                <rect
                  x={230}
                  y={20 + i * 55}
                  width={60}
                  height={30}
                  rx={6}
                  className="fill-viz-data/15 stroke-viz-data"
                />
                <text x={260} y={39 + i * 55} textAnchor="middle" className="fill-fg text-[10px]">
                  {towns[i]}
                </text>
              </g>
            ))}
            {[0, 1, 2].map((k) => (
              <rect key={k} width={8} height={6} rx={1} className="fill-accent">
                <animateMotion
                  dur="2.4s"
                  repeatCount="indefinite"
                  begin={`-${k * 0.8}s`}
                  path={`M70 ${35 + k * 55} L230 ${35 + ((k + 1) % 3) * 55}`}
                />
              </rect>
            ))}
          </svg>
        </div>
      }
    >
      <p>
        A sorting office gets sacks of letters in any order. Each sorter splits their sack into one
        pile per delivery round. Then every round&apos;s driver walks past every sorter to pick up
        their pile. Nobody can start delivering until the sorting is done.
      </p>
      <p>
        Spark&apos;s <Term id="shuffle">shuffle</Term> works the same way. When rows with the same
        key are spread over many partitions, Spark has to regroup them: every task sends a share of
        its data to every task in the next stage. The docs call it &ldquo;a complex and costly
        operation&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch a shuffle ⭐ -------------------------------------------------------------------------- */

function Chip({ k, r, dim }: { k: string; r: number; dim?: boolean }) {
  const d = dest(k, r);
  return (
    <motion.span
      layout
      className={cn(
        "inline-flex size-5 items-center justify-center rounded font-mono text-[10px] font-semibold",
        ["bg-viz-data/25", "bg-viz-compute/25", "bg-viz-meta/25", "bg-viz-add/25"][d],
        dim && "opacity-40",
      )}
    >
      {k}
    </motion.span>
  );
}

export function ShuffleSim() {
  const [s, set] = useSceneState<ShuffleState>();
  const inputs = mapInputs(s.m);
  const f = FRAMES[s.frame];
  const reducers = Array.from({ length: s.r }, (_, j) => KEYS.filter((k) => dest(k, s.r) === j));
  const counts = (j: number) => inputs.flat().filter((k) => dest(k, s.r) === j);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch a shuffle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {(["m", "r"] as const).map((key) => (
              <div key={key} className="flex items-center gap-1.5">
                <span className="text-muted">{key === "m" ? "map tasks" : "reduce tasks"}</span>
                {[2, 3, 4].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={s[key] === n}
                    onClick={() => set({ [key]: n })}
                    className={cn(
                      "size-7 rounded-md border font-mono",
                      s[key] === n ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <Stepper
            step={s.frame}
            count={FRAMES.length}
            onChange={(n) => set({ frame: n })}
            label={f.phase}
          />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="flex flex-col gap-2">
              {inputs.map((recs, i) => (
                <div key={i} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                  <p className="text-muted mb-1 text-[10px]">map task {i + 1}</p>
                  {s.frame === 0 ? (
                    <div className="flex flex-wrap gap-0.5">
                      {recs.map((k, n) => (
                        <Chip key={n} k={k} r={s.r} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {Array.from({ length: s.r }, (_, j) => (
                        <div
                          key={j}
                          className="border-line flex gap-0.5 rounded border border-dashed p-0.5"
                        >
                          {recs
                            .filter((k) => dest(k, s.r) === j)
                            .sort()
                            .map((k, n) => (
                              <Chip key={n} k={k} r={s.r} dim={s.frame === 3} />
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                  {s.frame >= 1 && (
                    <p className="text-subtle mt-0.5 text-[9px]">shuffle file on local disk</p>
                  )}
                </div>
              ))}
            </div>
            <svg viewBox="0 0 40 100" className="h-32 w-10" aria-hidden>
              {s.frame >= 2 &&
                inputs.map((_, i) =>
                  reducers.map((_, j) => (
                    <motion.line
                      key={`${i}-${j}`}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.04 * (i * s.r + j) }}
                      x1={0}
                      y1={((i + 0.5) / s.m) * 100}
                      x2={40}
                      y2={((j + 0.5) / s.r) * 100}
                      className="stroke-accent"
                      strokeWidth={0.8}
                    />
                  )),
                )}
            </svg>
            <div className="flex flex-col gap-2">
              {reducers.map((keys, j) => (
                <div key={j} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                  <p className="text-muted mb-1 text-[10px]">
                    reduce task {j + 1} · keys {keys.join(", ")}
                  </p>
                  <div className="flex min-h-5 flex-wrap gap-0.5">
                    {s.frame >= 2 &&
                      counts(j)
                        .sort()
                        .map((k, n) => <Chip key={n} k={k} r={s.r} />)}
                  </div>
                  {s.frame === 3 && (
                    <p className="text-good mt-0.5 font-mono text-[10px]">
                      {keys
                        .map((k) => `${k}:${counts(j).filter((x) => x === k).length}`)
                        .join("  ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <FrameCaption frameKey={s.frame} title={f.phase}>
            {f.text}
          </FrameCaption>
          <p className="text-muted text-center text-xs">
            Blocks fetched: {s.m} × {s.r} ={" "}
            <span className="text-fg font-semibold">{s.m * s.r}</span>. With 1,000 map tasks and 200
            reduce tasks that&apos;s 200,000.
          </p>
        </div>
      }
    >
      <p>
        Step through a shuffle that counts records per key. On the map side, each task sorts its
        records by destination and writes a <Term id="shuffle-file">shuffle file</Term> to local
        disk. On the reduce side, each task fetches its block from every map task.
      </p>
      <p>
        Change the number of tasks and watch the lines: fetches grow as map tasks × reduce tasks.
        The docs list the three costs: &ldquo;disk I/O, data serialization, and network I/O&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What causes a shuffle ----------------------------------------------------------------------- */

export function WhichOps() {
  const [s, set] = useSceneState<ShuffleState>();
  const op = OPS.find((o) => o.id === s.op)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="What causes a shuffle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {OPS.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={s.op === o.id}
                onClick={() => set({ op: o.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                  s.op === o.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <motion.div
            key={op.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className={cn("text-sm font-semibold", op.shuffles ? "text-bad" : "text-good")}>
              {op.shuffles ? "Shuffles: the plan has an Exchange" : "No shuffle of the big data"}
            </p>
            <Code>{op.plan}</Code>
            <p className="text-muted text-xs">{op.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        In a DataFrame plan, a shuffle shows up as an <Term id="exchange">Exchange</Term>. Anything
        that needs rows with the same key, or the same range of values, side by side causes one:
        grouping, sorting, most joins, distinct, windows and repartition.
      </p>
      <p>
        How many partitions come out the other side is set by{" "}
        <code>spark.sql.shuffle.partitions</code>, 200 by default (module 11 shows how Spark adjusts
        it at run time).
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where shuffle files live -------------------------------------------------------------------- */

export function ShuffleFiles() {
  const [s, set] = useSceneState<ShuffleState>();
  const sc = SCENARIOS[s.scenario];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where shuffle files live"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(SCENARIOS) as Scenario[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.scenario === k}
                onClick={() => set({ scenario: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.scenario === k
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {SCENARIOS[k].title}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-muted text-xs">
              After the map stage, executor 2 is removed. Its node still has the shuffle files on
              disk.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  s.scenario === "k8s"
                    ? "border-viz-compute"
                    : "border-line text-subtle line-through",
                )}
              >
                executor 2
              </div>
              <div
                className={cn(
                  "rounded-lg border px-3 py-2 text-xs",
                  s.scenario === "service" ? "border-viz-compute" : "border-line text-subtle",
                )}
              >
                shuffle service
              </div>
              <div className="border-viz-data rounded-lg border px-3 py-2 font-mono text-[11px]">
                /tmp/spark-…/shuffle_0_7.data
              </div>
            </div>
            <motion.p
              key={s.scenario}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn("mt-3 text-sm", sc.good ? "text-good" : "text-bad")}
            >
              {sc.outcome}
            </motion.p>
          </div>
        </div>
      }
    >
      <p>
        Shuffle files sit on each node&apos;s local disk (<code>spark.local.dir</code>,{" "}
        <code>/tmp</code> by default), not in HDFS or object storage. Spark keeps them while they
        might be needed, so a failed reduce task can retry without redoing the map side.
      </p>
      <p>
        Normally the executor that wrote them also serves them. An{" "}
        <Term id="external-shuffle-service">external shuffle service</Term> takes that job over, so
        executors can come and go. It&apos;s off by default and not available on Kubernetes.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Does it shuffle? ---------------------------------------------------------------------------- */

export function DoesItShuffle() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it shuffle?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="does-it-shuffle"
            prompt="Which of these DataFrame operations cause a shuffle?"
            categories={[
              { id: "yes", label: "Shuffle" },
              { id: "no", label: "No shuffle" },
            ]}
            items={[
              {
                id: "filter",
                label: "df.filter(df.amount > 100)",
                category: "no",
                why: "Narrow: each row stays put.",
              },
              {
                id: "group",
                label: 'df.groupBy("city").count()',
                category: "yes",
                why: "Rows with the same city must meet.",
              },
              {
                id: "sort",
                label: 'df.orderBy("amount")',
                category: "yes",
                why: "A global sort exchanges ranges.",
              },
              {
                id: "col",
                label: 'df.withColumn("tax", df.amount * 0.2)',
                category: "no",
                why: "Computed row by row.",
              },
              {
                id: "coalesce",
                label: "df.coalesce(10) on 200 partitions",
                category: "no",
                why: "Merges partitions without a full shuffle.",
              },
              {
                id: "distinct",
                label: "df.distinct()",
                category: "yes",
                why: "Duplicates must meet to be dropped.",
              },
            ]}
            explanation="Anything that needs matching keys together (group, sort, distinct, most joins, windows, repartition) shuffles; row-by-row work doesn't."
          />
        </div>
      }
    >
      <p>Sort the operations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["All-to-all", "Every map task sends a block to every reduce task."],
  ["Three costs", "Disk I/O, serialisation and network I/O."],
  ["A stage boundary", "Each Exchange ends one stage and starts the next."],
  ["Local disk", "Shuffle files live on executors' nodes, kept for retries."],
  ["Shuffle less", "Filter early, aggregate partially, broadcast small tables."],
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
      <p>Next: joins, the most common reason to shuffle, and the strategies Spark picks between.</p>
    </StepLayout>
  );
}

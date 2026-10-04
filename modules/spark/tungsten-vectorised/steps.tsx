"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ENGINES, EXPLAIN, NATIVE, PLAN_NODES, ROWS, type Engine } from "./model";
import type { TungstenState } from "./state";

/* 1 ─ Washing up ---------------------------------------------------------------------------------- */

export function Dishes() {
  const rows: [string, string][] = [
    [
      "Three people, one plate at a time",
      "“Next?” “Here.” “Next?” “Here.” Most of the time goes on handing over.",
    ],
    [
      "One person, one smooth motion",
      "Scrub, rinse, rack, without stopping to ask anyone for anything.",
    ],
    ["Three people, a tray at a time", "Still three stations, but each hand-over moves 40 plates."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Washing up"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        After a big dinner, three people can wash up passing one plate at a time, but they spend
        most of the time handing over. One person doing every step in a smooth rhythm is often
        faster. So is passing whole trays.
      </p>
      <p>
        Spark faced the same problem inside the CPU. <Term id="tungsten">Project Tungsten</Term>{" "}
        (2015) set out to make each row cheaper. Spark now uses both other tricks:{" "}
        <Term id="whole-stage-codegen">whole-stage code generation</Term> and{" "}
        <Term id="vectorised-execution">vectorised execution</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three ways to run a loop ⭐ ----------------------------------------------------------------- */

export function EngineRace() {
  const [s, set] = useSceneState<TungstenState>();
  const e = ENGINES[s.engine];
  const order: Engine[] = ["volcano", "codegen", "vector"];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Three ways to run a loop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`SELECT sum(price) FROM sales WHERE qty > 10   -- ${ROWS.toLocaleString("en-GB")} rows`}</Code>
          <div className="flex flex-col gap-2">
            {order.map((k) => {
              const x = ENGINES[k];
              return (
                <button
                  key={k}
                  type="button"
                  aria-pressed={s.engine === k}
                  onClick={() => set({ engine: k })}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left",
                    s.engine === k
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold">{x.name}</span>
                    <span className="text-muted font-mono">
                      {x.calls.toLocaleString("en-GB")} operator calls
                    </span>
                  </div>
                  <div className="bg-surface-2 mt-1.5 h-2 overflow-hidden rounded">
                    <motion.div
                      key={`${k}-${s.runs}`}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: x.rel * 0.5, ease: "linear" }}
                      className={cn("h-full", k === "volcano" ? "bg-viz-idle" : "bg-viz-compute")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => set({ runs: s.runs + 1 })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
          >
            Run again
          </button>
          <motion.div
            key={s.engine}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-2"
          >
            <p className="text-muted text-xs">{e.how}</p>
            <Code>{e.code}</Code>
          </motion.div>
          <p className="text-subtle text-[10px]">
            Relative speeds illustrative; real gains depend on the query.
          </p>
        </div>
      }
    >
      <p>
        Before Spark 2.0, each operator pulled rows from the one below with <code>next()</code>, one
        row at a time: the <Term id="volcano-model">Volcano model</Term>. Flexible, but the CPU
        spends its time on calls rather than arithmetic.
      </p>
      <p>
        Databricks found a hand-written loop was &ldquo;an order of magnitude faster&rdquo;. So
        since Spark 2.0, Spark generates that loop itself. Where it can&apos;t, such as decoding
        Parquet files, it works on batches instead. Pick each engine and watch the race.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Stars in the plan --------------------------------------------------------------------------- */

export function Stars() {
  const [s, set] = useSceneState<TungstenState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Stars in the plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {([1, 2] as const).map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={s.stage === n}
                onClick={() => set({ stage: n })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.stage === n ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                codegen stage *({n})
              </button>
            ))}
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border px-3 py-3 font-mono text-[11px]">
            {EXPLAIN.map((l) => (
              <motion.p
                key={l.line}
                animate={{ opacity: l.stage === s.stage ? 1 : 0.35 }}
                className={cn("whitespace-pre", l.stage === s.stage && "text-accent font-semibold")}
              >
                {l.line}
              </motion.p>
            ))}
          </div>
          <p className="text-muted text-xs">
            {s.stage === 1
              ? "Filter, Project and the partial aggregate are fused into one generated function."
              : "After the Exchange, the final aggregate gets a function of its own."}
          </p>
        </div>
      }
    >
      <p>
        In <code>explain()</code> output, a star and a number, like{" "}
        <code className="whitespace-nowrap">*(1)</code>, mark operators fused into the same
        generated function. In the Spark UI they appear inside a <code>WholeStageCodegen</code> box.
      </p>
      <p>
        An Exchange never has a star: it sends data across the network, so it breaks the chain, and
        the operators after it get a new function.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Native engines ------------------------------------------------------------------------------ */

export function NativeEngines() {
  const [s, set] = useSceneState<TungstenState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Native engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {NATIVE.map((n) => (
              <div
                key={n.name}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">{n.name}</p>
                <p className="text-accent text-[10px]">
                  {n.who} · {n.lang}
                </p>
                <p className="text-muted mt-1">{n.note}</p>
              </div>
            ))}
          </div>
          <div className="border-line rounded-xl border px-3 py-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold">One query on a native plugin</p>
              <button
                type="button"
                aria-pressed={s.fallback}
                onClick={() => set({ fallback: !s.fallback })}
                className={cn(
                  "rounded-full border px-3 py-1 text-[11px]",
                  s.fallback ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {s.fallback ? "✓ " : ""}add a Python UDF
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {PLAN_NODES.filter((n) => s.fallback || n !== "Python UDF").map((n, i) => {
                const jvm = n === "Python UDF";
                return (
                  <span key={n} className="flex items-center gap-1">
                    {i > 0 && (
                      <span className="text-muted text-[10px]">
                        {jvm || (s.fallback && n === "Aggregate") ? "⇄" : "→"}
                      </span>
                    )}
                    <motion.span
                      layout
                      className={cn(
                        "rounded-md border px-2 py-1 text-[11px]",
                        jvm ? "border-bad bg-bad/10" : "border-good bg-good/10",
                      )}
                    >
                      {n}
                    </motion.span>
                  </span>
                );
              })}
            </div>
            <p className="text-muted mt-2 text-[11px]">
              {s.fallback
                ? "The UDF isn't supported natively, so that operator falls back to normal Spark. Each ⇄ converts data between native columns and JVM rows, which costs time."
                : "Every operator runs natively, in columnar batches."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        The newest step goes further: run Spark&apos;s plans on a{" "}
        <Term id="native-engine">native engine</Term> written in C++ or Rust, with vectorised
        execution throughout, while keeping Spark&apos;s APIs and planner.
      </p>
      <p>
        The open-source plugins fall back to normal Spark for anything they can&apos;t run, so
        queries still work. Speed-ups are vendor-reported and depend heavily on the workload.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which technique? ---------------------------------------------------------------------------- */

export function WhichEngine() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which technique?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-engine"
            prompt="Match each description to the technique."
            categories={[
              { id: "volcano", label: "Volcano" },
              { id: "codegen", label: "Codegen" },
              { id: "vector", label: "Vectorised" },
              { id: "native", label: "Native" },
            ]}
            items={[
              {
                id: "next",
                label: "Each operator asks the one below for the next row",
                category: "volcano",
                why: "The classic iterator model.",
              },
              {
                id: "fused",
                label: "Filter, project and partial aggregate compiled into one Java function",
                category: "codegen",
                why: "Whole-stage code generation.",
              },
              {
                id: "parquet",
                label: "Parquet values decoded 4,096 at a time, column by column",
                category: "vector",
                why: "The vectorised Parquet reader.",
              },
              {
                id: "velox",
                label: "A Spark plan translated to Substrait and run in C++ by Velox",
                category: "native",
                why: "Apache Gluten with the Velox backend.",
              },
              {
                id: "star",
                label: "Marked *(1) in explain()",
                category: "codegen",
                why: "Stars mark fused codegen stages.",
              },
            ]}
            explanation="Volcano pulls one row at a time; codegen fuses operators into one loop; vectorised works on column batches; native engines run the plan outside the JVM."
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
  ["Tungsten (2015)", "Own the memory, use the cache well, generate code."],
  ["Whole-stage codegen", "One fused function per stage; the *(n) in explain()."],
  ["Vectorised batches", "Where codegen can't go, e.g. Parquet decoding."],
  ["Native engines", "Photon, Gluten (Velox, ClickHouse), Comet; with fallback."],
  ["Gains vary", "Measure on your own workload."],
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
      <p>Next: when one key holds most of the data, and one task does most of the work.</p>
    </StepLayout>
  );
}

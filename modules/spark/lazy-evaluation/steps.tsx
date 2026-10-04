"use client";

import { motion } from "motion/react";
import { Play, RotateCcw, ShoppingCart } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OPS, byId, stages } from "./model";
import type { LazyState } from "./state";

/* 1 ─ The personal shopper ------------------------------------------------------------------------ */

export function Shopper() {
  const notes = [
    "milk",
    "bread",
    "actually, no bread",
    "rice, the big bag",
    "only if it's on offer: mangoes",
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The personal shopper"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-full max-w-sm rounded-xl border px-4 py-3">
            <p className="text-muted text-[10px]">the list grows; nobody has left the house</p>
            {notes.map((n, i) => (
              <motion.p
                key={n}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                className={cn("font-mono text-xs", i === 1 && "line-through opacity-60")}
              >
                • {n}
              </motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="border-accent bg-accent-soft flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"
          >
            <ShoppingCart className="text-accent size-4" /> &ldquo;Go!&rdquo; One trip, best route,
            no bread.
          </motion.div>
        </div>
      }
    >
      <p>
        You tell a personal shopper what you need over the morning: milk, bread, then actually no
        bread, rice, mangoes if they&apos;re on offer. A good shopper writes it all down and only
        sets off when you say &ldquo;go&rdquo;. Then they plan one trip, skip the bread entirely,
        and pick the best route.
      </p>
      <p>
        Spark is that shopper. Most operations are <Term id="transformation">transformations</Term>:
        they&apos;re written onto a plan, not carried out. Only an <Term id="action">action</Term>,
        a request for an actual result, sets Spark off. This is{" "}
        <Term id="lazy-evaluation">lazy evaluation</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a plan, then run it ⭐ ---------------------------------------------------------------- */

export function BuildPlan() {
  const [s, set] = useSceneState<LazyState>();
  const chain = s.chain ?? ["read"];
  const hasAction = chain.some((id) => byId[id].kind === "action");
  const st = stages(chain);
  const add = (id: string) => {
    if (hasAction) return;
    set({ chain: [...chain, id], ran: byId[id].kind === "action" });
  };
  return (
    <StepLayout
      eyebrow="Step-through"
      title="Build a plan, then run it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {OPS.filter((o) => o.id !== "read").map((o) => (
              <button
                key={o.id}
                type="button"
                disabled={hasAction || chain.includes(o.id)}
                onClick={() => add(o.id)}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[11px] disabled:opacity-35",
                  o.kind === "action"
                    ? "border-accent text-accent hover:bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {o.kind === "action" && <Play className="mr-1 inline size-3" />}
                {o.code.replace(/\(.*\)/, "()")}
              </button>
            ))}
          </div>
          <Code>
            {chain.map((id, i) => (i === 0 ? "orders = " : "  ") + byId[id].code).join("\n")}
          </Code>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                s.ran ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">tasks run so far</p>
              <p className="font-mono text-lg font-semibold">{s.ran ? st.length * 8 : 0}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">steps in the plan</p>
              <p className="font-mono text-lg font-semibold">
                {chain.filter((id) => byId[id].kind === "transformation").length}
              </p>
            </div>
          </div>
          {s.ran ? (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1.5"
            >
              <p className="text-xs font-semibold">
                The action triggered one job, split into {st.length} stage{st.length > 1 ? "s" : ""}
                :
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {st.map((stage, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <span className="text-bad text-[10px]">shuffle →</span>}
                    <span className="border-viz-compute bg-viz-compute/10 rounded-md border px-2 py-1 font-mono text-[10px]">
                      stage {i + 1}: {stage.join(" → ")}
                    </span>
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <p className="text-muted text-xs">
              Nothing has run. Spark is only recording the plan. Add an action (red) to run it.
            </p>
          )}
          {chain.length > 1 && (
            <button
              type="button"
              onClick={() => set({ chain: ["read"], ran: false })}
              className="text-muted flex items-center gap-1 self-end text-xs"
            >
              <RotateCcw className="size-3" /> Start again
            </button>
          )}
          <p className="text-subtle text-[10px]">Assumes 8 partitions per stage. Illustrative.</p>
        </div>
      }
    >
      <p>
        Chain operations onto a DataFrame. Watch the plan grow while no task runs at all. Then pick
        an action and see what Spark actually executes: one job, made of stages.
      </p>
      <p>
        Spark&apos;s guide: &ldquo;All transformations in Spark are lazy, in that they do not
        compute their results right away.&rdquo; Waiting lets Spark see the whole{" "}
        <Term id="dag">DAG</Term> of steps first, and, for DataFrames, rewrite it before running
        (module 7).
      </p>
    </StepLayout>
  );
}

/* 3 ─ Transformations and actions ----------------------------------------------------------------- */

export function TwoKinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Transformations and actions"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Transformations: build the plan</p>
            <p className="text-muted font-mono text-xs">
              select, filter, withColumn, join, groupBy, orderBy, union, distinct, repartition
            </p>
            <p className="text-muted text-xs">
              Each returns a new DataFrame; the original never changes.
            </p>
          </div>
          <div className="border-accent bg-accent-soft flex flex-col gap-1.5 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Actions: run it</p>
            <p className="text-muted font-mono text-xs">
              count, show, collect, take, first, write, foreach
            </p>
            <p className="text-muted text-xs">
              Each one starts a job. Run two actions and the work runs twice, unless cached (module
              15).
            </p>
          </div>
          <p className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-2 text-xs sm:col-span-2">
            Careful with collect(): it brings every row back to the driver. The guide suggests
            take() when you only need a few rows.
          </p>
        </div>
      }
    >
      <p>
        The guide&apos;s definitions: transformations &ldquo;create a new dataset from an existing
        one&rdquo;; actions &ldquo;return a value to the driver program after running a computation
        on the dataset.&rdquo;
      </p>
      <p>
        A practical consequence: an error in your logic may not appear where you wrote it, but only
        when an action finally runs the plan.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Narrow and wide ----------------------------------------------------------------------------- */

export function NarrowWide() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Narrow and wide"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            {
              t: "Narrow: filter, select, withColumn",
              wide: false,
              d: "Each output piece needs one input piece. Spark chains these together in one pass, on one machine.",
            },
            {
              t: "Wide: groupBy, join, orderBy",
              wide: true,
              d: "Each output piece needs data from many input pieces. Data must be shuffled across the network, starting a new stage.",
            },
          ].map((c) => (
            <div
              key={c.t}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3"
            >
              <p className="text-sm font-semibold">{c.t}</p>
              <svg viewBox="0 0 120 70" className="w-full max-w-48" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <rect
                      x={10 + i * 38}
                      y={6}
                      width={24}
                      height={14}
                      rx={2}
                      className="fill-viz-data/20 stroke-viz-data"
                    />
                    <rect
                      x={10 + i * 38}
                      y={50}
                      width={24}
                      height={14}
                      rx={2}
                      className="fill-viz-compute/20 stroke-viz-compute"
                    />
                    {c.wide ? (
                      [0, 1, 2].map((j) => (
                        <line
                          key={j}
                          x1={22 + i * 38}
                          y1={20}
                          x2={22 + j * 38}
                          y2={50}
                          className="stroke-bad"
                          strokeWidth={0.8}
                        />
                      ))
                    ) : (
                      <line
                        x1={22 + i * 38}
                        y1={20}
                        x2={22 + i * 38}
                        y2={50}
                        className="stroke-good"
                        strokeWidth={1.2}
                      />
                    )}
                  </g>
                ))}
              </svg>
              <p className="text-muted text-xs">{c.d}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        The 2012 Spark paper split transformations into{" "}
        <Term id="narrow-transformation">narrow</Term> and{" "}
        <Term id="wide-transformation">wide</Term> dependencies. Narrow ones can be pipelined; wide
        ones need data from all parent partitions, &ldquo;shuffled across the nodes&rdquo;.
      </p>
      <p>
        That&apos;s where stages come from: &ldquo;The boundaries of the stages are the shuffle
        operations required for wide dependencies.&rdquo; (One exception: a join whose inputs are
        already split the same way can be narrow.)
      </p>
    </StepLayout>
  );
}

/* 5 ─ Transformation or action? ------------------------------------------------------------------- */

export function TorA() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Transformation or action?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="t-or-a"
            prompt="Does each operation add to the plan, or run it?"
            categories={[
              { id: "t", label: "Transformation" },
              { id: "a", label: "Action" },
            ]}
            items={[
              {
                id: "filter",
                label: "df.filter(df.age > 30)",
                category: "t",
                why: "Returns a new DataFrame; nothing runs.",
              },
              {
                id: "join",
                label: 'orders.join(customers, "id")',
                category: "t",
                why: "Adds a join to the plan.",
              },
              {
                id: "group",
                label: 'df.groupBy("city").count()',
                category: "t",
                why: "On a DataFrame this returns another DataFrame, so it's still a transformation.",
              },
              {
                id: "show",
                label: "df.show()",
                category: "a",
                why: "Needs rows to print: runs the plan.",
              },
              {
                id: "write",
                label: 'df.write.parquet("out/")',
                category: "a",
                why: "Writing results is an action.",
              },
              {
                id: "count",
                label: "df.count()",
                category: "a",
                why: "Returns a number to the driver.",
              },
            ]}
            explanation="If it returns a DataFrame, it's a transformation. If it returns a value, prints, or writes, it's an action."
          />
        </div>
      }
    >
      <p>
        One trap: on a DataFrame, groupBy(...).count() returns a new DataFrame, so it&apos;s a
        transformation, while df.count() returns a number and is an action.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Lazy by design", "Transformations build a plan; nothing runs."],
  ["Actions run jobs", "count, show, write, collect."],
  ["Whole-plan view", "Spark optimises before it starts."],
  ["Narrow vs wide", "Wide steps shuffle data and start new stages."],
  ["Actions repeat work", "Two actions, two runs, unless cached."],
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
      <p>Next: the pieces each stage works on, partitions, and how many you want.</p>
    </StepLayout>
  );
}

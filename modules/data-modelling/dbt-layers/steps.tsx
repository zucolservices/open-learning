"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  COMPILED,
  FCT_SQL,
  LAYERS,
  NODES,
  PLACEABLE,
  TESTS_YML,
  upstream,
  type Layer,
} from "./model";
import type { DbtState } from "./state";

/* 1 ─ From raw ingredients to dishes -------------------------------------------------------------- */

export function Kitchen() {
  const rows: [string, string][] = [
    ["Deliveries", "Sacks of vegetables, crates of fish, as they arrive."],
    ["Prep", "Wash, peel, portion: each ingredient made ready the same way every day."],
    ["Mise en place", "Sauces and bases made once and used by several dishes."],
    ["The pass", "Finished dishes, exactly as customers order them."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="From raw ingredients to dishes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-2.5"
              style={{ marginLeft: `${i * 12}px` }}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A restaurant kitchen works in stations: deliveries, prep, shared sauces, and finally the
        dishes. Nobody cooks straight from the delivery crate, and every chef knows where to find
        the stock.
      </p>
      <p>
        <Term id="dbt">dbt</Term> projects are usually laid out the same way, in layers: sources,
        then <Term id="staging-model">staging</Term>, an optional intermediate layer, and{" "}
        <Term id="mart-model">marts</Term>. Each model is a SQL select statement kept in version
        control.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lay out a dbt project ⭐ -------------------------------------------------------------------- */

export function BuildProject() {
  const [s, set] = useSceneState<DbtState>();
  const placed = s.placed ?? {};
  const correct = PLACEABLE.filter(
    (id) => placed[id] === NODES.find((n) => n.id === id)!.layer,
  ).length;
  const allDone = correct === PLACEABLE.length;
  const up = s.trace ? upstream(s.trace) : new Set<string>();
  const where = (id: string): Layer | undefined =>
    NODES.find((n) => n.id === id)!.layer === "source" ? "source" : placed[id];
  const traced = s.trace ? NODES.find((n) => n.id === s.trace) : undefined;
  return (
    <StepLayout
      eyebrow="Build and connect"
      title="Lay out a dbt project"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LAYERS.map((layer) => (
              <div
                key={layer}
                className="border-line bg-surface-2/50 min-h-36 rounded-xl border border-dashed p-2"
              >
                <p className="text-muted mb-1 text-[10px] font-semibold uppercase">{layer}</p>
                <div className="flex flex-col gap-1">
                  {NODES.filter((n) => where(n.id) === layer).map((n) => {
                    const ok = n.layer === layer;
                    return (
                      <motion.button
                        layout
                        key={n.id}
                        type="button"
                        onClick={() => set({ trace: allDone ? n.id : s.trace })}
                        className={cn(
                          "rounded-md border px-1.5 py-1 text-left font-mono text-[9px] break-all",
                          s.trace === n.id
                            ? "border-accent bg-accent-soft"
                            : up.has(n.id)
                              ? "border-accent/60 bg-accent/10"
                              : ok
                                ? "border-line bg-surface"
                                : "border-bad bg-bad/10",
                        )}
                      >
                        {n.id}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {!allDone ? (
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1 text-[10px]">
                PLACE EACH MODEL ({correct}/{PLACEABLE.length} right)
              </p>
              <div className="flex flex-col gap-1">
                {PLACEABLE.filter((id) => placed[id] !== NODES.find((n) => n.id === id)!.layer).map(
                  (id) => (
                    <div key={id} className="flex flex-wrap items-center gap-1 text-[11px]">
                      <span className="w-52 font-mono text-[10px] break-all">{id}</span>
                      {LAYERS.slice(1).map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => set({ placed: { ...placed, [id]: l } })}
                          className={cn(
                            "rounded border px-1.5 py-0.5 text-[10px]",
                            placed[id] === l
                              ? "border-bad bg-bad/10"
                              : "border-line hover:bg-surface-2",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="border-good bg-good/10 rounded-xl border px-3 py-2 text-xs"
            >
              {traced ? (
                <>
                  <p className="font-mono font-semibold">{traced.id}</p>
                  <p className="text-muted">{traced.does}</p>
                  <p className="mt-1">
                    Depends on: {up.size ? [...up].join(", ") : "nothing: it's a source"}
                  </p>
                </>
              ) : (
                <p>All placed. Click any model to trace its lineage back to the sources.</p>
              )}
            </motion.div>
          )}
        </div>
      }
    >
      <p>
        Three sources and six models from a shop project. Put each model in its layer by name and
        purpose, then click a mart to trace where its numbers come from.
      </p>
      <p>
        dbt&apos;s own guide: staging models have &ldquo;a 1-to-1 relationship to our source
        tables&rdquo; (named <code>stg_source__entity</code>); intermediate models stack
        purpose-built logic, grouped by business area, and larger projects &ldquo;often add&rdquo;
        them; marts represent an entity &ldquo;at its unique grain&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ ref() builds the graph ---------------------------------------------------------------------- */

export function RefDag() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="ref() builds the graph"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{FCT_SQL}</Code>
          <p className="text-muted text-xs">compiles to, in production:</p>
          <Code>{COMPILED}</Code>
        </div>
      }
    >
      <p>
        Models never hard-code each other&apos;s table names. They call <code>ref()</code>. dbt
        replaces it with the right schema for the environment, and uses every <code>ref()</code> to
        build the dependency graph, so models run in the right order and the{" "}
        <Term id="lineage-graph">lineage</Term> is always up to date.
      </p>
      <p>
        Change a staging model, and you can see exactly which marts it affects before you deploy.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tests on every model ------------------------------------------------------------------------ */

export function DataTests() {
  const [s, set] = useSceneState<DbtState>();
  const results: [string, boolean][] = [
    ["unique_fct_orders_order_id", true],
    ["not_null_fct_orders_order_id", true],
    ["accepted_values_fct_orders_status", !s.bad],
    ["relationships_fct_orders_customer_id", !s.bad],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tests on every model"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{TESTS_YML}</Code>
          <button
            type="button"
            aria-pressed={s.bad}
            onClick={() => set({ bad: !s.bad })}
            className={cn(
              "self-start rounded-full border px-3 py-1 text-xs",
              s.bad ? "border-bad bg-bad/10" : "border-line",
            )}
          >
            {s.bad ? "✓ " : ""}a row arrives with status &lsquo;lost&rsquo; and an unknown customer
          </button>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px]">
            <p className="text-muted">$ dbt test --select fct_orders</p>
            {results.map(([n, ok]) => (
              <p key={n} className={ok ? "text-good" : "text-bad"}>
                {ok ? "PASS" : "FAIL"} {n}
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        dbt ships four generic <Term id="data-test">data tests</Term>: unique, not_null,
        accepted_values and relationships. They turn the model&apos;s assumptions (one row per
        order, every order has a known customer) into checks that run on every build.
      </p>
      <p>
        A note on the landscape: dbt Labs merged with Fivetran (completed 1 June 2026), and dbt Core
        v2.0, rebuilt in Rust and licensed Apache 2.0, shipped as an alpha the same day.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which layer? -------------------------------------------------------------------------------- */

export function WhichLayer() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which layer?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="dbt-layer"
            prompt="Which layer does each model belong in?"
            categories={[
              { id: "stg", label: "Staging" },
              { id: "int", label: "Intermediate" },
              { id: "mart", label: "Marts" },
            ]}
            items={[
              {
                id: "rename",
                label: "Renames and casts columns from one source table",
                category: "stg",
                why: "One-to-one with the source.",
              },
              {
                id: "stripe",
                label: "stg_stripe__payments",
                category: "stg",
                why: "Named for its source.",
              },
              {
                id: "reuse",
                label: "Joins orders to payments, for two different marts to use",
                category: "int",
                why: "Shared logic between staging and marts.",
              },
              {
                id: "fct",
                label: "fct_orders, one row per order for analysts",
                category: "mart",
                why: "An entity at its grain.",
              },
              {
                id: "dim",
                label: "dim_customers with lifetime value",
                category: "mart",
                why: "A business entity, ready to use.",
              },
            ]}
            explanation="Staging cleans one source table each; intermediate holds reusable logic by business area; marts are the entities people query."
          />
        </div>
      }
    >
      <p>Sort the models.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Staging", "One per source table; rename and cast."],
  ["Intermediate", "Optional, reusable logic by business area."],
  ["Marts", "Entities at a clear grain: facts, dimensions, wide tables."],
  ["ref()", "Builds the graph, run order and lineage."],
  ["Data tests", "unique, not_null, accepted_values, relationships."],
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
      <p>Next: modelling for NoSQL databases, where you design from the questions first.</p>
    </StepLayout>
  );
}

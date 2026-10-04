"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DASHBOARDS, LOOKML, METRICFLOW, activeCustomers, type Def } from "./model";
import type { SemState } from "./state";

/* 1 ─ One dictionary ------------------------------------------------------------------------------ */

export function Dictionary() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One dictionary"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Finance", "“Revenue” means after refunds."],
            ["Sales", "“Revenue” means what was booked."],
            ["Marketing", "“Revenue” includes vouchers."],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex justify-between rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-bad text-center text-xs"
          >
            Monday&apos;s meeting: three revenue numbers, an hour of arguing.
          </motion.p>
        </div>
      }
    >
      <p>
        Imagine every department kept its own dictionary, with its own meaning for
        &ldquo;revenue&rdquo;. Every meeting would start by arguing about whose number is right.
      </p>
      <p>
        Dashboards drift the same way when each tool writes its own SQL. A{" "}
        <Term id="semantic-layer">semantic layer</Term> is the shared dictionary: each{" "}
        <Term id="metric-definition">metric</Term> defined once, with its dimensions and joins, and
        every tool asks it for the numbers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Three dashboards, three answers ⭐ ---------------------------------------------------------- */

export function OneDefinition() {
  const [s, set] = useSceneState<SemState>();
  const shared = activeCustomers(s.def);
  const setDef = (d: Partial<Def>) => set({ def: { ...s.def, ...d } });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Three dashboards, three answers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            aria-pressed={s.layer}
            onClick={() => set({ layer: !s.layer })}
            className={cn(
              "self-start rounded-md border px-3 py-1 text-xs font-semibold",
              s.layer ? "border-good bg-good/15 text-good" : "border-line",
            )}
          >
            semantic layer {s.layer ? "on" : "off"}
          </button>
          {s.layer && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-accent bg-accent-soft flex flex-col gap-1.5 rounded-xl border px-3 py-2 text-xs"
            >
              <p className="font-semibold">active_customers, defined once</p>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-20">window</span>
                {(
                  [
                    ["month", "calendar month"],
                    ["30d", "last 30 days"],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={s.def.window === k}
                    onClick={() => setDef({ window: k })}
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px]",
                      s.def.window === k ? "border-accent bg-surface" : "border-line",
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-20">refunds</span>
                {[
                  [false, "exclude"],
                  [true, "include"],
                ].map(([v, l]) => (
                  <button
                    key={String(v)}
                    type="button"
                    aria-pressed={s.def.refunds === v}
                    onClick={() => setDef({ refunds: v as boolean })}
                    className={cn(
                      "rounded border px-2 py-0.5 text-[11px]",
                      s.def.refunds === v ? "border-accent bg-surface" : "border-line",
                    )}
                  >
                    {l as string}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <span className="text-muted w-20">min orders</span>
                {([1, 2] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={s.def.min === n}
                    onClick={() => setDef({ min: n })}
                    className={cn(
                      "rounded border px-2 py-0.5 font-mono text-[11px]",
                      s.def.min === n ? "border-accent bg-surface" : "border-line",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
          <div className="grid gap-2 sm:grid-cols-3">
            {DASHBOARDS.map((d) => {
              const list = s.layer ? shared : activeCustomers(d.def);
              return (
                <motion.div
                  key={d.tool}
                  layout
                  className={cn(
                    "rounded-xl border px-3 py-3",
                    s.layer ? "border-good bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <p className="text-muted text-[10px]">
                    {d.team} · {d.tool}
                  </p>
                  <p className="text-xs">Active customers, September</p>
                  <motion.p
                    key={list.length + String(s.layer)}
                    initial={{ scale: 1.3 }}
                    animate={{ scale: 1 }}
                    className="font-mono text-2xl font-semibold"
                  >
                    {list.length}
                  </motion.p>
                  <p className="text-muted text-[10px]">
                    {s.layer ? "from the shared definition" : d.how}
                  </p>
                </motion.div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">Twelve made-up orders from eight customers.</p>
        </div>
      }
    >
      <p>
        Three teams each wrote their own query for &ldquo;active customers in September&rdquo;, so
        three tools show three numbers. None is a bug; each team made a reasonable choice.
      </p>
      <p>
        Turn the semantic layer on. Now the definition lives in one place, and changing it (try the
        refund rule) changes every dashboard at once. As dbt&apos;s docs put it, if a metric
        definition changes, &ldquo;it&apos;s refreshed everywhere it&apos;s invoked&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What a definition looks like ---------------------------------------------------------------- */

export function WhatItLooksLike() {
  const [s, set] = useSceneState<SemState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="What a definition looks like"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1.5">
            {[
              ["mf", "dbt / MetricFlow (YAML)"],
              ["lookml", "Looker (LookML)"],
            ].map(([k, l]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.lang === k}
                onClick={() => set({ lang: k as SemState["lang"] })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.lang === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <Code>{s.lang === "mf" ? METRICFLOW : LOOKML}</Code>
          <p className="text-subtle text-[10px]">
            Simplified; check each tool&apos;s current syntax.
          </p>
        </div>
      }
    >
      <p>
        Different tools, same ingredients: which table, how it joins, which columns are dimensions,
        and how each measure is aggregated and filtered. A tool then asks for
        &ldquo;active_customers by month&rdquo; and the layer writes the SQL.
      </p>
      <p>
        dbt&apos;s guide adds a modelling tip: if you use its semantic layer, keep your marts closer
        to normalised, and let the engine do the joins.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools and a standard ------------------------------------------------------------------------ */

export function Ecosystem() {
  const items: [string, string][] = [
    [
      "Looker (LookML)",
      "Looker's modelling language describes dimensions, measures and joins, and generates SQL from them.",
    ],
    [
      "dbt Semantic Layer",
      "Powered by MetricFlow, which dbt Labs got by acquiring Transform in February 2023; MetricFlow became Apache 2.0 open source in October 2025.",
    ],
    ["Cube", "An open-source semantic layer, with a commercial platform built on it."],
    [
      "Warehouse-native",
      "Warehouses now offer their own, such as Snowflake semantic views and Databricks metric views.",
    ],
    [
      "Apache Ossie",
      "Started in September 2025 as the Open Semantic Interchange by Snowflake, Salesforce, dbt Labs and others; v1 spec in January 2026; now incubating at Apache.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools and a standard"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Semantic layers used to live inside one BI tool. The trend now is to move them out, into the
        modelling layer or the warehouse, so every tool, notebook and AI assistant shares them.
      </p>
      <p>
        A shared specification (Ossie) aims to let definitions move between tools rather than being
        locked into one.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Layer or dashboard? ------------------------------------------------------------------------- */

export function LayerOrDashboard() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Layer or dashboard?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="layer-or-dashboard"
            prompt="Where should each live?"
            categories={[
              { id: "layer", label: "Semantic layer" },
              { id: "dash", label: "The dashboard" },
            ]}
            items={[
              {
                id: "rev",
                label: "Revenue means sales minus refunds",
                category: "layer",
                why: "A definition everyone should share.",
              },
              {
                id: "join",
                label: "How orders join to customers",
                category: "layer",
                why: "Join paths belong with the model.",
              },
              {
                id: "colour",
                label: "The bar chart's colours",
                category: "dash",
                why: "Presentation, not meaning.",
              },
              {
                id: "month",
                label: "Which month the viewer picked",
                category: "dash",
                why: "A filter chosen at query time.",
              },
              {
                id: "active",
                label: "An active customer has at least one paid order in the period",
                category: "layer",
                why: "The metric itself.",
              },
            ]}
            explanation="Meaning (metrics, dimensions, joins) goes in the shared layer; presentation and viewer choices stay in each tool."
          />
        </div>
      }
    >
      <p>Sort the pieces.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Define once", "Metrics, dimensions and joins in one place."],
  ["Every tool agrees", "Change a definition; everything updates."],
  ["Many options", "LookML, dbt/MetricFlow, Cube, warehouse-native."],
  ["A standard is forming", "Open Semantic Interchange, now Apache Ossie."],
  ["Model underneath", "The layer sits on a good model, not instead of one."],
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
      <p>Next chapter: modern practice, starting with layered modelling in dbt.</p>
    </StepLayout>
  );
}

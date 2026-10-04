"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, DOWNSTREAM, SIGNALS, type Signal } from "./model";
import type { ObsState } from "./state";

/* 1 ─ The car dashboard --------------------------------------------------------------------------- */

export function Dashboard() {
  const gauges = [
    ["Engine running", "✓", false],
    ["Fuel", "5%", true],
    ["Oil pressure", "low", true],
    ["Tyre pressure", "ok", false],
  ] as const;
  return (
    <StepLayout
      eyebrow="Story"
      title="The car dashboard"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-4">
          {gauges.map(([t, v, warn], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-xl border px-3 py-3 text-center",
                warn ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className={cn("font-mono text-xl font-semibold", warn ? "text-bad" : "text-good")}>
                {v}
              </p>
              <p className="text-muted mt-1 text-xs">{t}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;The engine is running&rdquo; is the least interesting thing a car can tell you. You
        also want fuel, oil and tyres, because a running engine can still leave you stranded.
      </p>
      <p>
        Data pipelines often only report &ldquo;the job succeeded&rdquo;.{" "}
        <Term id="data-observability">Data observability</Term> watches the data itself: is it
        fresh, is the usual amount there, has its shape changed, do the values look normal, and
        where does it flow?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Watch a table for a week ⭐ ----------------------------------------------------------------- */

export function Watch() {
  const [s, set] = useSceneState<ObsState>();
  const on = s.on ?? [];
  const toggle = (id: Signal) =>
    set({ on: on.includes(id) ? on.filter((x) => x !== id) : [...on, id] });
  const shown = DAYS.slice(0, s.day + 1);
  const incidents = shown.filter((d) => d.bad);
  const caught = incidents.filter((d) => d.bad && on.includes(d.bad));
  const today = DAYS[s.day];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Watch a table for a week"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted mr-1 text-[10px]">MONITORS</span>
            {SIGNALS.map((g) => (
              <button
                key={g.id}
                type="button"
                aria-pressed={on.includes(g.id)}
                onClick={() => toggle(g.id)}
                className={cn(
                  "rounded-md border px-2 py-1 text-[11px]",
                  on.includes(g.id) ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {on.includes(g.id) ? "✓ " : "+ "}
                {g.label}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={s.lineage}
              onClick={() => set({ lineage: !s.lineage })}
              className={cn(
                "rounded-md border px-2 py-1 text-[11px]",
                s.lineage ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {s.lineage ? "✓ " : "+ "}Lineage
            </button>
          </div>
          <div className="border-line bg-surface overflow-x-auto rounded-xl border p-2">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="text-muted text-[10px]">
                  <th className="px-1 text-left font-normal">orders</th>
                  {DAYS.map((d, i) => (
                    <th
                      key={d.day}
                      className={cn("px-1 font-normal", i === s.day && "text-accent")}
                    >
                      <button
                        type="button"
                        onClick={() => set({ day: i })}
                        aria-label={`Show ${d.day}`}
                      >
                        {d.day}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SIGNALS.map((g) => (
                  <tr key={g.id} className={cn(!on.includes(g.id) && "opacity-40")}>
                    <td className="py-1 pr-2 whitespace-nowrap">{g.label}</td>
                    {DAYS.map((d, i) => {
                      const flagged = d.bad === g.id && on.includes(g.id) && i <= s.day;
                      return (
                        <td key={d.day} className="px-0.5 py-0.5 text-center">
                          <span
                            className={cn(
                              "block rounded px-1 py-0.5 font-mono whitespace-nowrap",
                              i > s.day
                                ? "text-subtle"
                                : flagged
                                  ? "bg-bad/20 text-bad font-semibold"
                                  : g.id === "job"
                                    ? "text-good"
                                    : "",
                            )}
                          >
                            {i > s.day ? "·" : on.includes(g.id) ? d.values[g.id] : "?"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-muted">day</span>
            <input
              type="range"
              min={0}
              max={DAYS.length - 1}
              value={s.day}
              onChange={(e) => set({ day: Number(e.target.value) })}
              className="accent-accent flex-1"
              aria-label="Day"
            />
            <span className="w-8 font-mono font-semibold">{today.day}</span>
          </div>
          <motion.div
            key={`${s.day}-${on.join()}-${s.lineage}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              !today.bad
                ? "border-line bg-surface"
                : on.includes(today.bad)
                  ? "border-good bg-good/10"
                  : "border-bad bg-bad/10",
            )}
          >
            <p>
              <span className="font-semibold">{today.day}: </span>
              {today.bad
                ? on.includes(today.bad)
                  ? `Alert! ${today.story}`
                  : "Job succeeded. Nobody noticed anything."
                : today.story}
            </p>
            {today.bad && on.includes(today.bad) && today.bad !== "job" && (
              <p className="text-muted mt-1 text-[11px]">
                {s.lineage
                  ? `Affected downstream: ${DOWNSTREAM[today.bad].join(", ")}.`
                  : "Turn on lineage to see what it affects downstream."}
              </p>
            )}
            <p className="text-muted mt-1 text-[11px]">
              So far: {caught.length} of {incidents.length} problems caught; the job was green every
              day.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        The orders load succeeds every day this week. Turn monitors on and step through the days:
        four silent failures are hiding, each visible to only one kind of signal.
      </p>
      <p>
        These five signals (freshness, volume, schema, distribution and lineage) are the &ldquo;five
        pillars&rdquo; Barr Moses of Monte Carlo described in 2020. Lineage doesn&apos;t detect
        problems itself; it tells you what each one touches.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tests and observability --------------------------------------------------------------------- */

export function Unknowns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tests and observability"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Tests: known unknowns</p>
              <p className="text-muted">
                &ldquo;order_id must be unique.&rdquo; You predicted the failure and wrote a rule.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Observability: unknown unknowns</p>
              <p className="text-muted">
                &ldquo;Country is suddenly 31% null.&rdquo; Nobody thought to write that test.
              </p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">DATA DOWNTIME (MONTE CARLO&apos;S ESTIMATE)</p>
            <p className="mt-1 font-mono text-sm">incidents × (time to detect + time to resolve)</p>
            <p className="text-muted mt-2">
              e.g. 6 incidents × (20 h to notice + 6 h to fix) = 156 hours of untrustworthy data a
              month. Detecting faster shrinks the biggest term. (Illustrative numbers.)
            </p>
          </div>
        </div>
      }
    >
      <p>
        Charity Majors, who popularised observability for software, puts it simply:
        &ldquo;Observability is about unknown-unknowns.&rdquo; Monitoring answers questions you
        planned; observability helps with the ones you didn&apos;t.
      </p>
      <p>
        For data, you need both: tests for what you can predict, monitors for surprises. Monte Carlo
        calls the time data is wrong, partial or missing{" "}
        <Term id="data-downtime">data downtime</Term>.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where it comes from ------------------------------------------------------------------------- */

export function Tools() {
  const items: [string, string][] = [
    [
      "Elementary",
      "Open-source dbt package and CLI: anomaly tests for volume, freshness, distribution and schema changes, plus a report.",
    ],
    [
      "Soda Core",
      "Checks and data contracts in YAML; version 4 is source-available under the Elastic License.",
    ],
    [
      "OpenLineage",
      "An open standard for lineage events, under the Linux Foundation; Marquez is its reference store.",
    ],
    [
      "Platform features",
      "Snowflake data metric functions, Databricks data quality monitoring, Google and AWS data quality tools.",
    ],
    [
      "Commercial platforms",
      "Monte Carlo, Bigeye, Anomalo, Sifflet, Datadog (which bought Metaplane in 2025) and others.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where it comes from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}: </span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Data observability grew up as a vendor category: the five pillars and &ldquo;data
        downtime&rdquo; are Monte Carlo&apos;s framing, now widely used. Gartner published its first
        Market Guide for data observability tools in June 2024, noting that vendors define the term
        differently.
      </p>
      <p>
        Observability spots problems; it doesn&apos;t fix data. Module 20 maps the tools in more
        detail.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which signal catches it? -------------------------------------------------------------------- */

export function WhichSignal() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which signal catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-signal"
            prompt="Which signal would spot each problem first?"
            categories={[
              { id: "freshness", label: "Freshness" },
              { id: "volume", label: "Volume" },
              { id: "schema", label: "Schema" },
              { id: "distribution", label: "Distribution" },
            ]}
            items={[
              {
                id: "stale",
                label: "The inventory table hasn't changed since Friday",
                category: "freshness",
                why: "Age of the data.",
              },
              {
                id: "dupes",
                label: "A retry loaded every event twice",
                category: "volume",
                why: "Twice the usual rows.",
              },
              {
                id: "type",
                label: "price arrives as text instead of a number",
                category: "schema",
                why: "The structure changed.",
              },
              {
                id: "zero",
                label: "Half the prices are suddenly 0.00",
                category: "distribution",
                why: "Values look abnormal.",
              },
              {
                id: "missing",
                label: "No events from Android since the release",
                category: "volume",
                why: "Fewer rows than usual.",
              },
            ]}
            explanation="Freshness watches age, volume watches amount, schema watches structure, distribution watches values. Lineage then tells you who's affected."
          />
        </div>
      }
    >
      <p>Sort the problems.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Green job, bad data", "Job status alone misses most problems."],
  ["Five signals", "Freshness, volume, schema, distribution, lineage."],
  ["Unknown unknowns", "Monitors catch what nobody wrote a test for."],
  ["Tests and monitors", "Use both; neither replaces the other."],
  ["Data downtime", "Detect faster to cut it."],
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
      <p>Next: how a monitor decides what &ldquo;normal&rdquo; is, without crying wolf.</p>
    </StepLayout>
  );
}

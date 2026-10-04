"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MAX, REAL, SERIES, isWeekend, score, type Method } from "./model";
import type { AnomState } from "./state";

/* 1 ─ What's normal for a Sunday? ----------------------------------------------------------------- */

export function Thermostat() {
  return (
    <StepLayout
      eyebrow="Story"
      title="What's normal for a Sunday?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A fixed rule</p>
            <p className="text-muted mt-1">
              &ldquo;Worry if the shop has fewer than 80 customers.&rdquo; Every Sunday the alarm
              goes off; after the shop grows, a terrible Tuesday sails through.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">An experienced manager</p>
            <p className="text-muted mt-1">
              &ldquo;Sundays are always quiet, and we&apos;ve been growing. Forty on a Sunday is
              fine; forty on a Tuesday is strange.&rdquo;
            </p>
          </div>
        </div>
      }
    >
      <p>
        A shop manager doesn&apos;t use one fixed number for &ldquo;quiet&rdquo;. They know Sundays
        are slow and that business has grown, so they judge each day against what&apos;s normal for
        that day.
      </p>
      <p>
        <Term id="anomaly-detection">Anomaly detection</Term> tries to do the same for data: learn
        what normal looks like from history, including weekly{" "}
        <Term id="seasonality">seasonality</Term>, and flag what falls outside it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Tune a row-count monitor ⭐ ----------------------------------------------------------------- */

const METHODS: { id: Method; label: string }[] = [
  { id: "fixed", label: "Fixed limits" },
  { id: "rolling", label: "Last 14 days" },
  { id: "seasonal", label: "Same weekday, last 4 weeks" },
];

export function Tune() {
  const [s, set] = useSceneState<AnomState>();
  const r = score(s.method, { min: s.min, max: s.max, k: s.k });
  const W = 560;
  const H = 180;
  const x = (d: number) => 10 + (d / (SERIES.length - 1)) * (W - 20);
  const y = (v: number) => H - 10 - (Math.max(0, v) / MAX) * (H - 20);
  const segs = r.b.map((b, d) => (b ? `${x(d)},${y(b.hi)}` : null)).filter(Boolean) as string[];
  const lows = r.b
    .map((b, d) => (b ? `${x(d)},${y(b.lo)}` : null))
    .filter(Boolean)
    .reverse() as string[];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Tune a row-count monitor"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={s.method === m.id}
                onClick={() => set({ method: m.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.method === m.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Daily row counts with the expected band"
            >
              {segs.length > 1 && (
                <polygon points={[...segs, ...lows].join(" ")} className="fill-viz-meta/15" />
              )}
              {SERIES.map((v, d) => (
                <rect
                  key={d}
                  x={x(d) - 3}
                  y={y(v)}
                  width={6}
                  height={Math.max(1, H - 10 - y(v))}
                  rx={1}
                  className={cn(
                    r.alerts[d]
                      ? d in REAL
                        ? "fill-good"
                        : "fill-bad"
                      : d in REAL
                        ? "fill-viz-compute"
                        : isWeekend(d)
                          ? "fill-viz-data/40"
                          : "fill-viz-data/70",
                  )}
                />
              ))}
              {Object.keys(REAL).map((d) => (
                <text
                  key={d}
                  x={x(Number(d))}
                  y={y(SERIES[Number(d)]) - 4}
                  textAnchor="middle"
                  className="fill-viz-compute text-[9px]"
                >
                  ▼
                </text>
              ))}
            </svg>
            <div className="text-muted flex flex-wrap gap-3 px-1 text-[10px]">
              <span className="flex items-center gap-1">
                <span className="bg-viz-meta/40 size-2 rounded-sm" /> expected band
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-good size-2 rounded-sm" /> real problem caught
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-viz-compute size-2 rounded-sm" /> real problem missed
              </span>
              <span className="flex items-center gap-1">
                <span className="bg-bad size-2 rounded-sm" /> false alarm
              </span>
            </div>
          </div>
          {s.method === "fixed" ? (
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <label className="flex items-center gap-2">
                <span className="text-muted w-10">min</span>
                <input
                  type="range"
                  min={0}
                  max={150}
                  step={5}
                  value={s.min}
                  onChange={(e) => set({ min: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Minimum rows"
                />
                <span className="w-12 font-mono">{s.min}k</span>
              </label>
              <label className="flex items-center gap-2">
                <span className="text-muted w-10">max</span>
                <input
                  type="range"
                  min={100}
                  max={250}
                  step={5}
                  value={s.max}
                  onChange={(e) => set({ max: Number(e.target.value) })}
                  className="accent-accent flex-1"
                  aria-label="Maximum rows"
                />
                <span className="w-12 font-mono">{s.max}k</span>
              </label>
            </div>
          ) : (
            <label className="flex items-center gap-2 text-xs">
              <span className="text-muted">sensitivity: flag beyond</span>
              <input
                type="range"
                min={1}
                max={4}
                step={0.5}
                value={s.k}
                onChange={(e) => set({ k: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Standard deviations"
              />
              <span className="w-24 font-mono">{s.k} std devs</span>
            </label>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.caught === r.total ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">
                {r.caught} / {r.total}
              </p>
              <p className="text-muted">real problems caught</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.falseAlarms === 0 ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{r.falseAlarms}</p>
              <p className="text-muted">false alarms in 8 weeks</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Eight weeks of daily orders rows: quiet weekends, steady growth, and two real problems
        (marked ▼): a partial load on a Wednesday and a Saturday loaded twice. Try to catch both
        without false alarms.
      </p>
      <p>
        Fixed limits can&apos;t: the doubled Saturday looks like a normal weekday. A baseline of the
        last 14 days mixes weekdays and weekends, so its band is huge. Comparing each day with the
        same weekday in past weeks catches both; then nudge the sensitivity until the false alarms
        stop. The bars at the start have no band: monitors need history before they can judge.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Better baselines ---------------------------------------------------------------------------- */

export function Robust() {
  const items: [string, string][] = [
    [
      "Z-score",
      "How many standard deviations from the average. “Beyond 3” is a common default; Elementary's dbt tests use 3.",
    ],
    [
      "Median and IQR",
      "Less pulled by outliers: flag values beyond 1.5 × the interquartile range outside the middle half.",
    ],
    [
      "Seasonal decomposition (STL)",
      "Split a series into trend, seasonal pattern and remainder; look for outliers in the remainder. Cleveland et al., 1990.",
    ],
    [
      "Forecasting (Prophet)",
      "Released by Facebook in 2017: models trend, weekly and yearly seasonality and holidays; a value outside the forecast band is suspicious.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Better baselines"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The <Term id="z-score">z-score</Term> you just tuned is the simplest baseline. It struggles
        with short histories and gets dragged by the very outliers it should catch, which is why the
        monitor left confirmed problems out of its history.
      </p>
      <p>
        Commercial tools (AWS Glue Data Quality, Databricks data quality monitoring, Monte Carlo,
        Soda) learn baselines with machine learning, but mostly don&apos;t say which algorithm. The
        ideas underneath are these.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Crying wolf --------------------------------------------------------------------------------- */

export function Fatigue() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Crying wolf"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">More sensitive</p>
              <p className="text-muted">Catches more real problems, raises more false alarms.</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-semibold">Less sensitive</p>
              <p className="text-muted">Quieter, but misses more.</p>
            </div>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-4 py-3 text-xs">
            <p className="text-muted text-[10px]">HABITS THAT KEEP ALERTS USEFUL</p>
            <p>Warm up before alerting (AWS Glue needs at least 3 data points).</p>
            <p>Leave confirmed anomalies out, so they don&apos;t become the new normal.</p>
            <p>Use seasonality where the business has a rhythm.</p>
            <p>Route alerts to the dataset&apos;s owner, and delete ones nobody acts on.</p>
            <p>Treat an anomaly as a lead, not proof; keep explicit tests for hard rules.</p>
          </div>
        </div>
      }
    >
      <p>
        <Term id="alert-fatigue">Alert fatigue</Term>, a term from hospital wards, is what happens
        when alarms go off so often that people stop listening, including to the real ones.
        Google&apos;s SRE book has the rule: every page should be actionable.
      </p>
      <p>
        The sensitivity dial trades missed problems against false alarms. There&apos;s no setting
        that eliminates both; choose based on what a miss costs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which monitor? ------------------------------------------------------------------------------ */

export function WhichMonitor() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which monitor?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-monitor"
            prompt="What fits each case best?"
            categories={[
              { id: "fixed", label: "Fixed rule or test" },
              { id: "learned", label: "Learned baseline" },
              { id: "seasonal", label: "Seasonal baseline" },
            ]}
            items={[
              {
                id: "empty",
                label: "The payments table must never be empty",
                category: "fixed",
                why: "A hard rule; no history needed.",
              },
              {
                id: "growth",
                label: "Row count of a fast-growing events table, no weekly pattern",
                category: "learned",
                why: "Normal keeps moving; learn it.",
              },
              {
                id: "weekend",
                label: "Store orders, which drop every Sunday",
                category: "seasonal",
                why: "Compare Sundays with Sundays.",
              },
              {
                id: "null",
                label: "order_id must have no nulls",
                category: "fixed",
                why: "That's a test, not an anomaly.",
              },
              {
                id: "monday",
                label: "Support tickets, which spike every Monday",
                category: "seasonal",
                why: "A weekly rhythm.",
              },
            ]}
            explanation="Hard rules belong in tests. Baselines catch changes from normal; add seasonality when the business has a weekly rhythm."
          />
        </div>
      }
    >
      <p>Sort the cases.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Fixed limits go stale", "Growth and weekends break them."],
  ["Learn normal", "Compare with history, e.g. mean ± 3 std devs."],
  ["Seasonality", "Compare Mondays with Mondays."],
  ["Warm up, exclude", "Need history; keep bad days out of it."],
  ["Every alert actionable", "Too many and people stop listening."],
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
      <p>Next: following a problem upstream to its cause, and downstream to everyone it hurt.</p>
    </StepLayout>
  );
}

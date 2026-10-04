"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAILURES, SYNTAX, type Action } from "./model";
import type { SevState } from "./state";

const ACTION_LABEL: Record<Action, string> = {
  warn: "Warn",
  block: "Block",
  quarantine: "Quarantine",
};

/* 1 ─ Not every alarm means evacuate -------------------------------------------------------------- */

export function Fuses() {
  const rows: [string, string, string][] = [
    ["A light bulb blows", "Note it, replace it later.", "warn"],
    [
      "One socket shorts",
      "That circuit's fuse trips; the rest of the house stays on.",
      "quarantine",
    ],
    ["The mains are overloaded", "Trip everything before the wiring catches fire.", "block"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Not every alarm means evacuate"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d, a], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border px-4 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent font-mono text-[11px]">{a}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A house&apos;s electrics respond in proportion: a blown bulb is just replaced, a faulty
        socket trips its own fuse, and only a dangerous overload cuts the whole house.
      </p>
      <p>
        Failed data checks need the same judgement. Each check gets a{" "}
        <Term id="test-severity">severity</Term>: warn and carry on, block the run, or{" "}
        <Term id="quarantine">quarantine</Term> the bad rows so the good ones keep flowing. Blocking
        everything for every failure causes needless outages; warning about everything publishes
        wrong numbers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Warn, block or quarantine ⭐ ---------------------------------------------------------------- */

export function BadNight() {
  const [s, set] = useSceneState<SevState>();
  const actions = s.actions ?? {};
  const allSet = FAILURES.every((f) => actions[f.id]);
  const good = FAILURES.filter((f) => actions[f.id] === f.best).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Warn, block or quarantine"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Tuesday night&apos;s orders load: 10,000 orders expected. Three checks fail.
          </p>
          {FAILURES.map((f) => {
            const a = actions[f.id];
            const r = a ? f.results[a] : undefined;
            return (
              <div
                key={f.id}
                className="border-line bg-surface rounded-xl border px-3 py-2 text-xs"
              >
                <p className="font-mono text-[11px] font-semibold">{f.check}</p>
                <p className="text-muted">{f.detail}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {f.allowed.map((x) => (
                    <button
                      key={x}
                      type="button"
                      aria-pressed={a === x}
                      onClick={() => set({ actions: { ...actions, [f.id]: x }, ran: false })}
                      className={cn(
                        "rounded-md border px-2.5 py-0.5 text-[11px]",
                        a === x ? "border-accent bg-accent-soft" : "border-line",
                      )}
                    >
                      {ACTION_LABEL[x]}
                    </button>
                  ))}
                  {!f.allowed.includes("quarantine") && (
                    <span className="text-subtle self-center text-[10px]">
                      (missing rows can&apos;t be quarantined)
                    </span>
                  )}
                </div>
                {s.ran && r && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn("mt-1", r.ok ? "text-good" : "text-bad")}
                  >
                    {r.text}
                  </motion.p>
                )}
              </div>
            );
          })}
          <button
            type="button"
            disabled={!allSet}
            onClick={() => set({ ran: true })}
            className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium disabled:opacity-40"
          >
            Run the night
          </button>
          {s.ran && (
            <p className={cn("text-xs font-semibold", good === 3 ? "text-good" : "text-fg")}>
              {good === 3
                ? "Right data, on time, with nothing silently wrong."
                : `${good} of 3 responses fit their failure. Try changing the others.`}
            </p>
          )}
        </div>
      }
    >
      <p>
        Three checks failed overnight. Choose a response for each, then run the night and see what
        the business wakes up to.
      </p>
      <p>
        A rule of thumb: warn when the data is still fit for its main use; quarantine when a few
        rows are bad and the rest are fine; block when the whole batch can&apos;t be trusted,
        because a gap is better than a wrong number.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How tools express it ------------------------------------------------------------------------ */

export function HowTools() {
  const [s, set] = useSceneState<SevState>();
  const t = SYNTAX[s.tab] ?? SYNTAX.dbt;
  return (
    <StepLayout
      eyebrow="Explore"
      title="How tools express it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(SYNTAX).map(([k, v]) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.tab === k}
                onClick={() => set({ tab: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.tab === k ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
          <Code>{t.code}</Code>
          <p className="text-subtle text-[10px]">
            Simplified; check each tool&apos;s docs for your version.
          </p>
        </div>
      }
    >
      <p>
        In dbt, severity defaults to error, and thresholds let one test warn for a few bad rows and
        fail for many. <code>store_failures</code> copies failing rows to an audit table for
        inspection; it doesn&apos;t remove them.
      </p>
      <p>
        Databricks pipelines (formerly Delta Live Tables) have all three responses built in:{" "}
        <code>expect</code> keeps and counts, <code>expect_or_drop</code> drops,{" "}
        <code>expect_or_fail</code> stops and rolls back. Elsewhere, quarantine is a pattern you
        build, and Kafka Connect sink connectors offer a dead letter topic.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Circuit breakers ---------------------------------------------------------------------------- */

export function CircuitBreaker() {
  const [s, set] = useSceneState<SevState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Circuit breakers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <button
            type="button"
            aria-pressed={s.breaker}
            onClick={() => set({ breaker: !s.breaker })}
            className={cn(
              "self-start rounded-md border px-3 py-1 text-xs font-semibold",
              s.breaker ? "border-bad bg-bad/10 text-bad" : "border-good bg-good/10 text-good",
            )}
          >
            {s.breaker ? "check failed: circuit open" : "checks passing: circuit closed"}
          </button>
          <svg
            viewBox="0 0 320 90"
            className="w-full max-w-md"
            role="img"
            aria-label={s.breaker ? "Data flow stopped at the breaker" : "Data flowing to reports"}
          >
            <rect
              x={6}
              y={30}
              width={70}
              height={30}
              rx={6}
              className="fill-viz-data/15 stroke-viz-data"
            />
            <text x={41} y={49} textAnchor="middle" className="fill-fg text-[9px]">
              new data
            </text>
            <rect
              x={244}
              y={30}
              width={70}
              height={30}
              rx={6}
              className="fill-viz-meta/15 stroke-viz-meta"
            />
            <text x={279} y={49} textAnchor="middle" className="fill-fg text-[9px]">
              reports
            </text>
            <line x1={76} y1={45} x2={140} y2={45} className="stroke-line-strong" strokeWidth={2} />
            <line
              x1={180}
              y1={45}
              x2={244}
              y2={45}
              className="stroke-line-strong"
              strokeWidth={2}
            />
            <line
              x1={140}
              y1={45}
              x2={s.breaker ? 172 : 180}
              y2={s.breaker ? 25 : 45}
              className={s.breaker ? "stroke-bad" : "stroke-good"}
              strokeWidth={3}
              strokeLinecap="round"
            />
            <circle cx={140} cy={45} r={4} className="fill-fg" />
            <circle cx={180} cy={45} r={4} className="fill-fg" />
            {!s.breaker &&
              [0, 1, 2].map((k) => (
                <circle key={k} r={3} className="fill-viz-data">
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`-${k * 0.66}s`}
                    path="M76 45 H244"
                  />
                </circle>
              ))}
            <text
              x={160}
              y={80}
              textAnchor="middle"
              className={cn("text-[9px]", s.breaker ? "fill-bad" : "fill-good")}
            >
              {s.breaker ? "reports keep yesterday's data, marked delayed" : "data flows"}
            </text>
          </svg>
        </div>
      }
    >
      <p>
        A <Term id="circuit-breaker">circuit breaker</Term> is borrowed from software (popularised
        by Michael Nygard&apos;s book Release It!). Intuit applied it to data pipelines in 2018:
        when key checks fail, the circuit opens and data stops flowing downstream, so reports show a
        gap rather than wrong numbers.
      </p>
      <p>
        Airbnb&apos;s checking framework draws the same line between blocking and non-blocking
        checks. Once the problem is fixed, the circuit closes and the backlog flows through.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Choose the response ------------------------------------------------------------------------- */

export function ChooseAction() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Choose the response"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="choose-action"
            prompt="What should each failed check do?"
            categories={[
              { id: "warn", label: "Warn" },
              { id: "quarantine", label: "Quarantine" },
              { id: "block", label: "Block" },
            ]}
            items={[
              {
                id: "middle",
                label: "3% of customers have no middle name",
                category: "warn",
                why: "Data is still fit for its uses.",
              },
              {
                id: "badrows",
                label: "25 payments out of 2 million have an unknown currency code",
                category: "quarantine",
                why: "Set the few aside; let the rest flow.",
              },
              {
                id: "empty",
                label: "Today's sales file arrived empty",
                category: "block",
                why: "The whole batch is untrustworthy: show a gap, not zero sales.",
              },
              {
                id: "dupes",
                label: "Every row of the payroll file is duplicated",
                category: "block",
                why: "Publishing would double everyone's pay.",
              },
              {
                id: "phone",
                label: "A handful of malformed phone numbers in a marketing list",
                category: "warn",
                why: "Minor, and not worth stopping anything.",
              },
            ]}
            explanation="Warn when data is still fit for use; quarantine when a few rows are bad; block when the whole batch can't be trusted."
          />
        </div>
      }
    >
      <p>Sort the failures.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Respond in proportion", "Warn, quarantine or block."],
  ["Thresholds", "Warn for a few failures, error for many."],
  ["Quarantine", "Good rows flow; bad rows wait to be fixed and replayed."],
  ["Block when untrustworthy", "A gap beats a wrong number."],
  ["Circuit breakers", "Stop the flow automatically, resume when fixed."],
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
      <p>Next chapter: contracts between the people who produce data and the people who use it.</p>
    </StepLayout>
  );
}

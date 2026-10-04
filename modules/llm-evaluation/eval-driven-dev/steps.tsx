"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { NOTES, run } from "./model";
import type { EddState } from "./state";

/* 1 ─ Tests first --------------------------------------------------------------------------------- */

export function SpellCheck() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Tests first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2 text-sm">
          {[
            ["1", "Write down the dishes the new menu must get right", "the tests"],
            ["2", "Change a recipe", "the change"],
            ["3", "Cook the whole list again and compare", "the eval run"],
          ].map(([n, t, k], i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-2"
            >
              <span className="text-accent font-mono">{n}</span>
              <span className="flex-1">{t}</span>
              <span className="text-subtle text-[10px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A good kitchen doesn&apos;t change a recipe and hope. It keeps a list of dishes that must
        come out right and checks them all after any change.
      </p>
      <p>
        <Term id="eval-driven-development">Eval-driven development</Term> is the same habit for AI:
        decide what good looks like, write it as evals, then change prompts or models and re-run.
        Both OpenAI and Anthropic recommend it, and Anthropic suggests 20 to 50 cases drawn from
        real failures is a great start.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Evals as tests in CI ⭐ --------------------------------------------------------------------- */

export function Pipeline() {
  const [s, set] = useSceneState<EddState>();
  const rows = run(s.ci, s.gate);
  const incidents = rows.filter((r) => r.shippedBroken);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Evals as tests in CI"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.ci}
                onChange={(e) => set({ ci: e.target.checked })}
                className="accent-accent"
              />
              Run the eval suite on every pull request
            </label>
            <label className={cn("flex flex-1 items-center gap-2", !s.ci && "opacity-40")}>
              <span className="text-muted">block below</span>
              <input
                type="range"
                min={90}
                max={100}
                value={s.gate}
                disabled={!s.ci}
                onChange={(e) => set({ gate: Number(e.target.value) })}
                className="accent-accent flex-1"
                aria-label="Regression gate"
              />
              <span className="w-10 font-mono">{s.gate}%</span>
            </label>
          </div>
          <div className="border-line bg-surface flex flex-col rounded-lg border">
            {rows.map((r, i) => (
              <motion.div
                key={r.id}
                layout
                className={cn(
                  "border-line grid grid-cols-[3rem_1fr_auto] items-center gap-2 px-3 py-1.5 text-xs",
                  i > 0 && "border-t",
                )}
              >
                <span className="text-subtle font-mono">#{r.id}</span>
                <span>
                  {r.title}
                  {s.ci && (
                    <span className="text-muted block font-mono text-[10px]">
                      regression {r.regression}% · capability {r.capability}%
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px]",
                    r.blocked
                      ? "bg-bad/20 text-bad"
                      : r.shippedBroken
                        ? "bg-viz-compute/25"
                        : "bg-good/20 text-good",
                  )}
                >
                  {r.blocked ? "blocked" : "merged"}
                </span>
              </motion.div>
            ))}
          </div>
          <div
            className={cn(
              "rounded-lg border px-3 py-2 text-xs",
              incidents.length ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {incidents.length ? (
              <>
                <p className="font-semibold">
                  {incidents.length} broken change{incidents.length > 1 ? "s" : ""} reached users:
                </p>
                {incidents.map((r) => (
                  <p key={r.id} className="text-muted mt-0.5">
                    #{r.id}: {r.incident}
                  </p>
                ))}
              </>
            ) : (
              "No regressions reached users. Blocked changes go back for fixing, with the failing cases attached."
            )}
          </div>
          <p className="text-subtle text-[10px]">Illustrative pull requests and scores.</p>
        </div>
      }
    >
      <p>
        Five changes to a support assistant are waiting to merge. Without evals in{" "}
        <Term id="continuous-integration">CI</Term>, they all ship. Switch on the eval run and set a
        gate on the regression suite: the cases that must keep working.
      </p>
      <p>
        Set the gate too low and harm slips through; set it at 100% and one flaky case blocks
        everything. Most teams gate on the regression suite and track the capability suite without
        blocking.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Error analysis: where cases come from ------------------------------------------------------- */

export function ErrorAnalysis() {
  const [s, set] = useSceneState<EddState>();
  const buckets = Object.entries(
    NOTES.reduce<Record<string, number>>((acc, n) => {
      acc[n.bucket] = (acc[n.bucket] ?? 0) + 1;
      return acc;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  return (
    <StepLayout
      eyebrow="Explore"
      title="Error analysis: where cases come from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <button
            type="button"
            onClick={() => set({ grouped: !s.grouped })}
            className="border-accent self-start rounded-full border px-3 py-1 text-xs"
          >
            {s.grouped ? "Show the raw notes" : "Group the notes into failure types"}
          </button>
          {!s.grouped ? (
            <div className="flex flex-wrap gap-1.5">
              {NOTES.map((n, i) => (
                <motion.span
                  key={n.note}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.04 * i }}
                  className="bg-viz-compute/15 rounded-md px-2 py-1 text-[11px]"
                >
                  {n.note}
                </motion.span>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {buckets.map(([b, n], i) => (
                <div
                  key={b}
                  className="grid grid-cols-[8rem_1fr_1.5rem] items-center gap-2 text-xs"
                >
                  <span>{b}</span>
                  <div className="bg-surface-2 h-3 overflow-hidden rounded">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(n / 3) * 100}%` }}
                      transition={{ delay: 0.08 * i }}
                      className="bg-viz-data h-full"
                    />
                  </div>
                  <span className="font-mono">{n}</span>
                </div>
              ))}
              <p className="text-muted mt-1 text-[11px]">
                Write evals for the biggest buckets first: here, wrong policy answers.
              </p>
            </div>
          )}
        </div>
      }
    >
      <p>
        Where do good eval cases come from? <Term id="error-analysis">Error analysis</Term>: read
        real traces, jot a free-form note on each problem, then group the notes into failure types
        and count them.
      </p>
      <p>
        Practitioners like Hamel Husain and Shreya Shankar call this the most valuable step, and a
        simple viewer or even a spreadsheet beats a generic dashboard. Keep reading until new traces
        stop showing new kinds of failure.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Two kinds of suite -------------------------------------------------------------------------- */

export function TwoSuites() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two kinds of suite"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Regression suite</p>
              <p className="text-muted mt-0.5">
                What must keep working. Pass rate near 100%; a drop blocks the release.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Capability suite</p>
              <p className="text-muted mt-0.5">
                What it can&apos;t do yet. Low pass rate; tracked over time to show progress.
              </p>
            </div>
          </div>
          <Code>{`# .github/workflows/evals.yml  (sketch)
on:
  pull_request:
    paths: ["prompts/**", "agent/**"]
jobs:
  evals:
    runs-on: ubuntu-latest
    steps:
      - run: eval-runner suites/regression --fail-under 98
      - run: eval-runner suites/capability  # report only`}</Code>
          <p className="text-muted text-[11px]">
            Open-source runners include promptfoo (open source; acquired by OpenAI in March 2026)
            and Inspect (UK AI Security Institute with Meridian Labs).
          </p>
        </div>
      }
    >
      <p>
        Anthropic distinguishes <Term id="capability-eval">capability evals</Term>, which measure
        what the system can&apos;t do yet, from regression evals, which protect what already works.
        When a capability case starts passing reliably, it moves into the regression suite.
      </p>
      <p>
        And keep a held-out test set you never tune against; if its score falls far below your
        development set, you&apos;ve overfitted your prompts.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Capability or regression? ------------------------------------------------------------------- */

export function WhichSuite() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Capability or regression?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-suite"
            prompt="Which suite should each case go in?"
            categories={[
              { id: "reg", label: "Regression" },
              { id: "cap", label: "Capability" },
            ]}
            items={[
              {
                id: "refund",
                label: "Quotes the right refund window (passes today)",
                category: "reg",
                why: "Must keep working.",
              },
              {
                id: "multi",
                label: "Handles a refund split across three cards (fails today)",
                category: "cap",
                why: "A stretch goal.",
              },
              {
                id: "bug",
                label: "Last month's bug: a sale item quoted 30 days",
                category: "reg",
                why: "Fixed bugs become regression cases.",
              },
              {
                id: "hindi",
                label: "Fluent Hindi replies, a feature you're starting to build",
                category: "cap",
                why: "Not there yet.",
              },
            ]}
            explanation="Regression cases protect what works and gate releases. Capability cases track progress on what doesn't work yet."
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
  ["Evals first", "Define good, then change things."],
  ["Start small", "20–50 cases from real failures."],
  ["Gate in CI", "Regression suite blocks; capability suite reports."],
  ["Error analysis feeds the suite", "Read, note, group, count."],
  ["Hold out a test set", "Catch overfitted prompts."],
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
      <p>Next: keeping watch once real users arrive.</p>
    </StepLayout>
  );
}

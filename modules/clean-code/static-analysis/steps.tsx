"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, FINDINGS, type Action } from "./model";
import type { StaticState } from "./state";

const TOOL_CLS = {
  "Type checker": "bg-viz-data/20",
  Linter: "bg-viz-idle/30",
  "Security scanner": "bg-bad/15",
} as const;

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Proofreader() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A proofreader who never gets tired"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Spelling and grammar checks</p>
            <p className="text-muted">
              Catch typos instantly, every time, on every page. Sometimes they flag a word
              that&apos;s fine.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">The editor</p>
            <p className="text-muted">
              Reads for meaning: does the argument hold together? Free to focus because the checker
              caught the typos.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Writers use spell-checkers so their editors can focus on meaning. The checker is fast and
        tireless, but it doesn&apos;t understand the story, and it raises some false alarms.
      </p>
      <p>
        <Term id="static-analysis">Static analysis</Term> tools read code without running it:
        linters, type checkers and security scanners. They catch whole classes of problems before a
        reviewer looks. The skill is deciding which findings matter.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Triage ⭐ ------------------------------------------------------------------------------------ */

export function Triage() {
  const [s, set] = useSceneState<StaticState>();
  const pick = (id: string, a: Action) => set({ triage: { ...s.triage, [id]: a } });
  const done = FINDINGS.filter((f) => s.triage[f.id]).length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Triage the findings on a pull request"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FINDINGS.map((f) => {
            const a = s.triage[f.id];
            return (
              <div
                key={f.id}
                className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
              >
                <p className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-medium",
                      TOOL_CLS[f.tool],
                    )}
                  >
                    {f.tool}
                  </span>
                  <span className="text-muted font-mono text-[10px]">{f.where}</span>
                </p>
                <p className="mt-0.5">{f.msg}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ACTIONS.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      aria-pressed={a === x.id}
                      onClick={() => pick(f.id, x.id)}
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px]",
                        a === x.id
                          ? x.id === f.answer
                            ? "border-good bg-good/20"
                            : "border-bad bg-bad/15"
                          : "border-line text-muted",
                      )}
                    >
                      {x.label}
                    </button>
                  ))}
                </div>
                {a && (
                  <p
                    className={cn(
                      "mt-0.5 text-[10px]",
                      a === f.answer ? "text-good" : "text-muted",
                    )}
                  >
                    {a === f.answer
                      ? f.why
                      : "Think about the risk, and whether this PR is the place to deal with it."}
                  </p>
                )}
              </div>
            );
          })}
          <p className="text-muted text-[11px]">
            Triaged {done} of {FINDINGS.length}.
          </p>
        </div>
      }
    >
      <p>
        A pull request to a café app comes back with seven findings from three tools. For each,
        decide: fix it now, suppress it with a written reason, or leave it for another day.
      </p>
      <p>
        Real bugs and security risks get fixed. Genuine false alarms get suppressed, with the reason
        next to the code so the next person understands. Old problems outside the change go on the
        debt list, not into this PR.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Kinds of tool -------------------------------------------------------------------------------- */

export function Kinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three kinds of tool"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Linters",
              "Flag suspicious patterns and style problems. The first, lint, was written by Stephen C. Johnson at Bell Labs in 1978. Today: ESLint (2013), Ruff (2022), Clippy, golangci-lint.",
            ],
            [
              "Type checkers",
              "Prove whole classes of mistakes impossible: TypeScript, mypy, pyright, and compilers in typed languages. TypeScript's compiler was rewritten in Go for its 2026 version 7, building around ten times faster.",
            ],
            [
              "Security scanners",
              "Trace data through code to find risks such as injection: CodeQL (GitHub, from its 2019 purchase of Semmle), Semgrep and its open-source fork Opengrep, and SonarQube.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        They overlap but complement each other: linters are fast and broad, type checkers are
        precise about data shapes, and security scanners follow data across files to find dangerous
        paths.
      </p>
      <p>The Application Security track goes deeper on security scanning.</p>
    </StepLayout>
  );
}

/* 4 ─ Signal and noise ----------------------------------------------------------------------------- */

export function Noise() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping the signal high"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Run in CI and in the editor", "Feedback while typing, and a gate before merging."],
            [
              "New problems only",
              "Start from a baseline so old findings don't block every change; fail only on new ones.",
            ],
            [
              "Suppress with a reason",
              "An inline comment saying why, so the decision is visible and reviewable.",
            ],
            [
              "Tune or turn off noisy rules",
              "A rule everyone ignores trains people to ignore all warnings.",
            ],
            ["Use auto-fix", "Let tools apply safe fixes for trivial findings."],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The danger with static analysis isn&apos;t missing bugs, it&apos;s noise. A report with 400
        warnings teaches the team to stop reading reports. Fewer, trusted findings beat many ignored
        ones.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function StaticCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-static"
            prompt="Which kind of tool is most likely to catch each problem?"
            categories={[
              { id: "lint", label: "Linter" },
              { id: "type", label: "Type checker" },
              { id: "sec", label: "Security scanner" },
            ]}
            items={[
              {
                id: "unused",
                label: "An import that's never used",
                category: "lint",
                why: "A pattern check.",
              },
              {
                id: "shape",
                label: "Passing a price where an order was expected",
                category: "type",
                why: "A data-shape mismatch.",
              },
              {
                id: "inject",
                label: "User text flowing into a database query",
                category: "sec",
                why: "Data-flow tracing.",
              },
              {
                id: "eq",
                label: "== where === was meant",
                category: "lint",
                why: "A risky-pattern rule.",
              },
              {
                id: "null",
                label: "Using a value that may be undefined",
                category: "type",
                why: "Strict null checks.",
              },
            ]}
            explanation="Linters spot patterns, type checkers spot shape mismatches, and security scanners follow data to dangerous places."
          />
        </div>
      }
    >
      <p>Sort each problem.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Tools read code without running it", "Linters, type checkers, security scanners."],
        ["Fix real risks now", "Bugs and security findings first."],
        ["Suppress false alarms with a reason", "Visible, reviewable decisions."],
        ["Don't widen the PR", "Old findings go on the debt list."],
        ["Protect the signal", "Noisy rules get tuned or turned off."],
      ]}
    >
      <p>Next: code written by AI assistants, and how to review it.</p>
    </WrapStep>
  );
}

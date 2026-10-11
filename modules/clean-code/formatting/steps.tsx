"use client";

import { motion } from "motion/react";
import { Check, MessageSquare, Sparkles, TriangleAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { FORMATTED, LINT, LINTED, MESSY, REVIEW } from "./model";
import type { FormatState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Menu() {
  return (
    <StepLayout
      eyebrow="Story"
      title="One menu, one layout"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, rotate: -1 }}
            animate={{ opacity: 1, rotate: -1 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-serif text-sm">Masala chai ...... 60</p>
            <p className="font-mono">FILTER COFFEE ₹70</p>
            <p className="italic">vada pav (two) - Rs 40/-</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            {[
              ["Masala chai", "₹60"],
              ["Filter coffee", "₹70"],
              ["Vada pav (2)", "₹40"],
            ].map(([a, b]) => (
              <p key={a} className="flex justify-between">
                <span>{a}</span>
                <span className="font-mono">{b}</span>
              </p>
            ))}
          </motion.div>
        </div>
      }
    >
      <p>
        A menu where each item was written by a different person, in a different style, still lists
        the same food. But your eye has to work for every line. One consistent layout lets you scan
        it in seconds.
      </p>
      <p>
        Code formatting is the same. Consistent layout doesn&apos;t change what code does, but it
        makes it faster to read and makes real changes stand out in reviews. Modern teams hand the
        job to a <Term id="formatter">formatter</Term> and a <Term id="linter">linter</Term>, and
        stop debating it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Format and lint ⭐ ---------------------------------------------------------------------------- */

export function FormatLint() {
  const [s, set] = useSceneState<FormatState>();
  const lines = s.stage === "none" ? MESSY : s.stage === "format" ? FORMATTED : LINTED;
  const done = (r: (typeof REVIEW)[number]) =>
    (r.fixedBy === "format" && s.stage !== "none") || (r.fixedBy === "lint" && s.stage === "lint");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Let the tools take the review comments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={s.stage !== "none"}
              onClick={() => set({ stage: "format" })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              <Sparkles className="size-3" /> Run the formatter
            </button>
            <button
              type="button"
              disabled={s.stage !== "format"}
              onClick={() => set({ stage: "lint" })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40"
            >
              <TriangleAlert className="size-3" /> Run the linter and fix
            </button>
            {s.stage !== "none" && (
              <button
                type="button"
                onClick={() => set({ stage: "none" })}
                className="border-line-strong rounded-full border px-3 py-1 text-xs"
              >
                Start again
              </button>
            )}
          </div>
          <Code key={s.stage} lines={lines} title="coupon.js" />
          {s.stage === "format" && (
            <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              {LINT.map((l) => (
                <p key={l.rule}>
                  <span className="text-bad">warning</span> {l.msg}{" "}
                  <span className="text-muted">{l.rule}</span>
                </p>
              ))}
            </div>
          )}
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="text-muted mb-1 text-[10px] font-medium">
              A colleague&apos;s review comments
            </p>
            {REVIEW.map((r) => (
              <p
                key={r.text}
                className={cn("flex items-start gap-1.5", done(r) && "text-muted line-through")}
              >
                {done(r) ? (
                  <Check className="text-good mt-0.5 size-3 shrink-0" />
                ) : (
                  <MessageSquare className="text-muted mt-0.5 size-3 shrink-0" />
                )}
                {r.text}
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A colleague reviewed this code and left eight comments. Run a formatter, then a linter, and
        watch which comments the tools take off their plate.
      </p>
      <p>
        What&apos;s left are the two comments that need a human: a missing business rule and a
        design question. That&apos;s what reviewers should spend their time on.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The tools ------------------------------------------------------------------------------------ */

const TOOLS: Record<FormatState["lang"], { label: string; fmt: string; lint: string }> = {
  js: {
    label: "JavaScript / TypeScript",
    fmt: "Prettier (2017) or Biome",
    lint: "ESLint, which handed its formatting rules to a separate Stylistic plugin in 2023",
  },
  py: {
    label: "Python",
    fmt: "Black (2018, “the uncompromising code formatter”) or Ruff's Black-compatible formatter",
    lint: "Ruff, flake8, pylint",
  },
  go: { label: "Go", fmt: "gofmt, built in since 2009", lint: "go vet, staticcheck" },
  rust: { label: "Rust", fmt: "rustfmt, built in", lint: "Clippy" },
  java: {
    label: "Java",
    fmt: "google-java-format, IDE formatters",
    lint: "Checkstyle, PMD, Error Prone",
  },
};

export function Tools() {
  const [s, set] = useSceneState<FormatState>();
  const t = TOOLS[s.lang];
  return (
    <StepLayout
      eyebrow="Explore"
      title="A formatter and a linter in every language"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.lang}
            onChange={(v) => set({ lang: v })}
            options={(Object.keys(TOOLS) as FormatState["lang"][]).map((k) => [
              k,
              k === "js"
                ? "JS/TS"
                : k === "py"
                  ? "Python"
                  : k === "go"
                    ? "Go"
                    : k === "rust"
                      ? "Rust"
                      : "Java",
            ])}
          />
          <motion.div
            key={s.lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px]">Formatter (layout)</p>
              <p>{t.fmt}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted text-[10px]">Linter (risky patterns)</p>
              <p>{t.lint}</p>
            </div>
          </motion.div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            “Gofmt&apos;s style is no one&apos;s favorite, yet gofmt is everyone&apos;s favorite.”
            <span className="text-muted block text-[10px]">Rob Pike, Go Proverbs (2015)</span>
          </div>
        </div>
      }
    >
      <p>
        A formatter rewrites layout (spacing, line breaks, quotes) and never changes behaviour. A
        linter flags patterns that are likely bugs or confusing, like <code>==</code> in JavaScript
        or an unused variable.
      </p>
      <p>
        Run them automatically: on save in the editor, and as a check in CI so unformatted code
        can&apos;t be merged. Pick one style and stop thinking about it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Style guides --------------------------------------------------------------------------------- */

export function Guides() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What tools can't settle"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Tools decide",
              "Indentation, spacing, quotes, line length, import order, trailing commas.",
            ],
            ["Linters flag", "Unused code, risky comparisons, shadowed names, missing awaits."],
            [
              "People decide",
              "Naming conventions, how to split files, error-handling style, when to comment.",
            ],
            [
              "Written down in",
              "A style guide: PEP 8 for Python (2001), Google's style guides, Effective Go, or your team's own.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Python&apos;s PEP 8 opens with the reason all this matters: code is read much more often
        than it is written. Formatters handle the mechanical half of a style guide; the rest is
        about judgement and team agreement.
      </p>
      <p>
        One tip: when adopting a formatter on an old codebase, reformat everything in a single
        commit, so later changes don&apos;t mix layout with logic. Git can be told to skip that
        commit when showing who changed each line.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FormatCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Tool or human?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-formatting"
            prompt="Who should handle each review point?"
            categories={[
              { id: "formatter", label: "Formatter" },
              { id: "linter", label: "Linter" },
              { id: "human", label: "A person" },
            ]}
            items={[
              {
                id: "indent",
                label: "Inconsistent indentation",
                category: "formatter",
                why: "Pure layout.",
              },
              {
                id: "quotes",
                label: "Mixed single and double quotes",
                category: "formatter",
                why: "Pure layout.",
              },
              {
                id: "unused",
                label: "A variable that's never used",
                category: "linter",
                why: "A pattern a tool can detect.",
              },
              {
                id: "eq",
                label: "== where === was meant",
                category: "linter",
                why: "A known risky pattern.",
              },
              {
                id: "rule",
                label: "Should the discount be capped?",
                category: "human",
                why: "A business question no tool can answer.",
              },
            ]}
            explanation="Formatters own layout, linters flag risky patterns, and people spend review time on meaning and design."
          />
        </div>
      }
    >
      <p>Sort each review point.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Consistency beats preference", "Any agreed style is better than many."],
        ["Automate layout", "Formatters: Prettier, Black, gofmt, rustfmt."],
        ["Lint for risky patterns", "ESLint, Ruff, Clippy, Checkstyle."],
        ["Run them everywhere", "On save, and as a CI check."],
        ["Save reviews for meaning", "Rules and design, not spaces."],
      ]}
    >
      <p>Next: keeping code as simple as it can be.</p>
    </WrapStep>
  );
}

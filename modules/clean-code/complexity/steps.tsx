"use client";

import { motion } from "motion/react";
import { RotateCcw, Wand2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { VERSIONS } from "./model";
import type { ComplexState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Directions() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Directions you have to hold in your head"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            “If the gate is open, and if it&apos;s not raining, unless the dog is out, then if the
            light is on, go left, otherwise…”
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p>Gate closed? Use the side door.</p>
            <p>Raining? Wait in the porch.</p>
            <p>Otherwise: go left at the light.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Directions built from conditions inside conditions make you juggle every &ldquo;if&rdquo; at
        once. The same directions as a list of &ldquo;deal with this first&rdquo; checks are easy to
        follow.
      </p>
      <p>
        Code works the same way. Every branch and every level of nesting adds something the reader
        must hold in mind. <Term id="cyclomatic-complexity">Complexity measures</Term> make that
        visible, and simple techniques bring it down without changing behaviour.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Flatten ⭐ ------------------------------------------------------------------------------------ */

function Meter({
  label,
  value,
  max,
  warn,
}: {
  label: string;
  value: number;
  max: number;
  warn: number;
}) {
  return (
    <div className="text-xs">
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-mono">{value}</span>
      </div>
      <motion.div
        animate={{ width: `${(value / max) * 100}%` }}
        className={cn("mt-0.5 h-2 rounded", value >= warn ? "bg-bad/70" : "bg-accent/60")}
      />
    </div>
  );
}

export function Flatten() {
  const [s, set] = useSceneState<ComplexState>();
  const v = VERSIONS[s.version];
  const next = VERSIONS[s.version + 1];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Flatten a nested function"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            {next ? (
              <button
                type="button"
                onClick={() => set({ version: s.version + 1 })}
                className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
              >
                <Wand2 className="size-3" /> {next.move}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => set({ version: 0 })}
                className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
            <span className="text-muted self-center text-xs">Version: {v.label}</span>
          </div>
          <Code key={s.version} lines={v.code} title="refunds.js" />
          <div className="grid gap-2 sm:grid-cols-3">
            <Meter label="Cyclomatic complexity" value={v.cyclomatic} max={10} warn={10} />
            <Meter label="Cognitive complexity" value={v.cognitive} max={16} warn={15} />
            <Meter label="Deepest nesting" value={v.depth} max={5} warn={4} />
          </div>
          <motion.p
            key={`w${s.version}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted text-xs"
          >
            {v.why}
          </motion.p>
        </div>
      }
    >
      <p>
        <code>canRefund</code> decides whether an order can be refunded. Apply three
        behaviour-preserving changes and watch the scores. The function returns exactly the same
        answers at every step.
      </p>
      <p>
        Notice which score moves most. Cyclomatic complexity counts paths and barely changes;
        cognitive complexity also charges for nesting, so flattening slashes it. That matches how
        much easier the flat version is to read.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two measures --------------------------------------------------------------------------------- */

export function Measures() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two ways to measure complexity"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Cyclomatic complexity</p>
            <p className="text-muted text-[10px]">Thomas McCabe, 1976</p>
            <p className="mt-1">
              The number of independent paths: decisions plus one. A good guide to how many tests a
              function needs. McCabe suggested splitting functions above about 10, as a rule of
              thumb.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Cognitive complexity</p>
            <p className="text-muted text-[10px]">G. Ann Campbell, SonarSource, 2017</p>
            <p className="mt-1">
              Designed to track how hard code is to understand: +1 for each break in the flow, extra
              for each level of nesting, and nothing for shorthand that keeps code readable. A whole
              switch counts once.
            </p>
          </div>
          <div className="border-accent bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            Tools report both: ESLint&apos;s complexity rule (default limit 20), SonarQube, radon
            for Python, gocyclo for Go. Use them to find hot spots, not as targets.
          </div>
        </div>
      }
    >
      <p>
        Numbers like these are useful in the same way coverage is: they point at the functions most
        worth a second look. A score of 25 almost always means something; a score of 9 versus 11
        means nothing.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Techniques ----------------------------------------------------------------------------------- */

export function Techniques() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ways to bring it down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Guard clauses",
              "Handle the special cases first and return early, so the main path isn't indented.",
            ],
            [
              "Name conditions",
              "Turn a long boolean expression into a well-named function or variable.",
            ],
            [
              "Extract the inside of a loop",
              "A loop body with its own ifs often wants to be a function.",
            ],
            ["Replace conditionals with data", "A table of rates instead of a ladder of else-ifs."],
            [
              "Split by case",
              "When a function handles three kinds of thing, three functions may be clearer.",
            ],
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
        Some older style guides insisted on a single return per function. With small functions,
        early returns (<Term id="guard-clause">guard clauses</Term>) are widely accepted as clearer;
        Martin Fowler&apos;s refactoring catalogue lists &ldquo;Replace Nested Conditional with
        Guard Clauses&rdquo;.
      </p>
      <p>
        Each technique keeps behaviour the same, which is exactly what makes them safe to apply in
        small steps with tests running.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ComplexCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What helps most?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="clean-complexity"
            prompt="A function has its real work indented five levels deep, inside checks for missing data, permissions and feature flags. What's the best first change?"
            options={[
              {
                id: "guard",
                label: "Turn the checks into guard clauses that return early",
                correct: true,
                feedback: "The checks move out of the way and the main work sits at the top level.",
              },
              {
                id: "comments",
                label: "Add a comment at each level explaining it",
                feedback: "The nesting, and the load on the reader, stays the same.",
              },
              {
                id: "limit",
                label: "Raise the linter's complexity limit",
                feedback: "That hides the warning, not the problem.",
              },
              {
                id: "rewrite",
                label: "Rewrite it from scratch",
                feedback: "Riskier than small, behaviour-preserving steps.",
              },
            ]}
            explanation="Guard clauses are the quickest, safest way to flatten nesting: same behaviour, much less to hold in mind."
          />
        </div>
      }
    >
      <p>Choose one.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Nesting costs most", "Each level adds to what the reader holds."],
        ["Guard clauses", "Deal with special cases first, return early."],
        ["Name the conditions", "The rule reads like the rule."],
        ["Two measures", "Cyclomatic counts paths; cognitive tracks readability."],
        ["Scores find hot spots", "Not targets to game."],
      ]}
    >
      <p>That&apos;s the chapter on shape and simplicity. Next: how pieces fit together.</p>
    </WrapStep>
  );
}

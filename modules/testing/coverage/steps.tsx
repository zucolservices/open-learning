"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TestReport } from "../_shared/report";
import {
  CASES,
  CODE,
  STATEMENT_LINES,
  branchesHit,
  buggy,
  fixed,
  linesHit,
  runCases,
} from "./model";
import type { CoverageState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Guard() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The guard who walked every corridor"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-3 gap-1.5">
            {Array.from({ length: 9 }, (_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.05 * i }}
                className={cn(
                  "flex size-16 items-center justify-center rounded border text-[10px]",
                  i === 4 ? "border-bad/60 bg-bad/10" : "border-good/50 bg-good/10",
                )}
              >
                {i === 4 ? "door open" : "walked ✓"}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        A night guard&apos;s log shows they walked every corridor of the building. Reassuring, until
        you learn they never tried a single door handle. Walking past a door isn&apos;t checking it.
      </p>
      <p>
        <Term id="code-coverage">Code coverage</Term> is that log. It records which lines of code
        ran while your tests ran. It&apos;s great for finding corridors nobody walked, but a line
        that ran is not a line that was checked.
      </p>
    </StepLayout>
  );
}

/* 2 ─ 100% and still a bug ⭐ ----------------------------------------------------------------------- */

export function FullCoverage() {
  const [s, set] = useSceneState<CoverageState>();
  const chosen = CASES.filter((c) => s.cases.includes(c.id));
  const hit = linesHit(chosen);
  const br = branchesHit(chosen);
  const linePct = Math.round(
    (STATEMENT_LINES.filter((n) => hit.has(n)).length / STATEMENT_LINES.length) * 100,
  );
  const branchPct = Math.round((br.size / 4) * 100);
  const outcomes = runCases(chosen, s.fixed ? fixed : buggy);
  const failing = outcomes.some((o) => !o.ok);
  const toggle = (id: string) =>
    set({ cases: s.cases.includes(id) ? s.cases.filter((x) => x !== id) : [...s.cases, id] });
  const branchMark = (n: number) => {
    if (n !== 3 && n !== 6) return null;
    const t = br.has(`${n}T`);
    const f = br.has(`${n}F`);
    return (
      <span className="ml-2 inline-flex gap-0.5 font-sans text-[9px]">
        <span className={cn("rounded px-1", t ? "bg-good/30" : "bg-bad/30")}>true</span>
        <span className={cn("rounded px-1", f ? "bg-good/30" : "bg-bad/30")}>false</span>
      </span>
    );
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Reach 100% and still ship a bug"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-[1.2fr_1fr]">
            <div className="border-line bg-surface overflow-x-auto rounded-lg border py-2 font-mono text-[10.5px]">
              {CODE.map((l) => (
                <div
                  key={l.n}
                  className={cn(
                    "flex items-center gap-2 px-2",
                    l.stmt && (hit.has(l.n) ? "bg-good/10" : "bg-bad/15"),
                  )}
                >
                  <span className="text-subtle w-4 text-right">{l.n}</span>
                  <pre className="whitespace-pre">
                    {s.fixed && l.n === 2 ? "  let d = 0;" : l.text}
                  </pre>
                  {branchMark(l.n)}
                </div>
              ))}
            </div>
            <div className="grid content-start gap-1">
              {CASES.map((c) => (
                <label
                  key={c.id}
                  className={cn(
                    "flex items-start gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                    s.cases.includes(c.id)
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={s.cases.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="accent-accent mt-0.5"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Line coverage</p>
              <p className={cn("font-mono text-base", linePct === 100 && "text-good")}>
                {linePct}%
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Branch coverage</p>
              <p className={cn("font-mono text-base", branchPct < 100 && "text-bad")}>
                {branchPct}%
              </p>
            </div>
          </div>
          <TestReport outcomes={outcomes} empty="Tick at least one test." />
          {failing && !s.fixed && (
            <button
              type="button"
              onClick={() => set({ fixed: true })}
              className="border-line-strong w-fit rounded-full border px-3 py-1 text-xs"
            >
              Fix line 2: start d at 0
            </button>
          )}
        </div>
      }
    >
      <p>
        The rule: members get 10%, orders over ₹1,000 get ₹50 more, capped at ₹200. One test is
        ticked, it passes, and line coverage already says 100%.
      </p>
      <p>
        Now look at branch coverage: each <code>if</code> was only ever true. Add tests that take
        the false paths and see what happens to a non-member. Then try the test with no assertion on
        its own: it earns the same coverage as a real test while checking nothing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Kinds of coverage ----------------------------------------------------------------------------- */

export function Kinds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Lines, branches, conditions"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Line or statement", "Did each line run at least once?", "Easiest to reach; weakest."],
            [
              "Branch or decision",
              "Did each if go both ways, each loop run zero and many times?",
              "Catches the missing else, as you just saw.",
            ],
            ["Condition", "In a && b, was each part both true and false?", "Finer than branches."],
            [
              "MC/DC",
              "Was each condition shown to change the outcome on its own?",
              "Required for the most critical aircraft software (DO-178C Level A).",
            ],
          ].map(([t, q, n], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p>{q}</p>
              <p className="text-muted text-[10px]">{n}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Coverage tools measure different things. Most report line coverage by default and branch
        coverage if you ask: JaCoCo for Java, coverage.py for Python, Istanbul and V8 coverage for
        JavaScript (Vitest and Jest use these), and <code>go test -cover</code> for Go.
      </p>
      <p>
        Aviation&apos;s DO-178C ties the measure to how much is at stake: statement coverage for
        lower levels, decision coverage above that, and MC/DC for software whose failure could be
        catastrophic.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Using it well -------------------------------------------------------------------------------- */

export function UsingIt() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Use coverage as a flashlight, not a target"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {[
              ["60%", "acceptable"],
              ["75%", "commendable"],
              ["90%", "exemplary"],
            ].map(([n, l]) => (
              <div key={n} className="border-line bg-surface rounded-lg border px-2 py-2">
                <p className="text-accent font-mono text-lg">{n}</p>
                <p className="text-muted text-[10px]">{l}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Google&apos;s rough guidance (2020), offered alongside a warning against top-down
            mandates.
          </p>
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Good uses</p>
            <p className="text-muted">
              Spot untested files and branches; look at uncovered lines in code review; watch the
              trend.
            </p>
          </div>
          <div className="border-bad/40 bg-bad/10 rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">Bad uses</p>
            <p className="text-muted">
              A hard gate everyone games with assertion-free tests; ranking teams; treating 100% as
              done.
            </p>
          </div>
        </div>
      }
    >
      <p>
        There&apos;s a well-known saying, Marilyn Strathern&apos;s paraphrase of the economist
        Charles Goodhart: when a measure becomes a target, it ceases to be a good measure. Coverage
        targets invite exactly the assertion-free test you tried earlier.
      </p>
      <p>
        Low coverage is a reliable warning: that code is definitely untested. High coverage is not a
        reliable comfort. The next module measures what coverage can&apos;t: whether tests would
        actually notice a bug.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CoverageCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does 100% tell you?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-coverage"
            prompt="A pull request shows 100% line coverage for the new code. What can you safely conclude?"
            options={[
              {
                id: "nobugs",
                label: "The new code has no bugs",
                feedback: "Lines can run without anything being checked.",
              },
              {
                id: "ran",
                label: "Every new line ran at least once during the tests",
                correct: true,
                feedback: "That's all line coverage measures.",
              },
              {
                id: "branches",
                label: "Every if was tested both ways",
                feedback: "That's branch coverage, a different measure.",
              },
              {
                id: "asserted",
                label: "Every line's result was asserted",
                feedback: "Coverage can't see assertions at all.",
              },
            ]}
            explanation="Coverage tells you what ran, not what was checked. Use it to find gaps, then judge the tests themselves."
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
        ["Coverage records what ran", "Not what was checked."],
        ["Branches beat lines", "Each if both ways finds missing paths."],
        ["Low coverage is a warning", "High coverage is not a guarantee."],
        ["A flashlight, not a target", "Targets get gamed."],
        ["Look at the gaps", "Uncovered lines in review are useful."],
      ]}
    >
      <p>Next: testing your tests by planting bugs on purpose.</p>
    </WrapStep>
  );
}

"use client";

import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, Circle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TestReport } from "../_shared/report";
import { STAGES, TESTS, run } from "./model";
import type { TddState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function ExamFirst() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Write the exam before the lesson"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid gap-2 text-xs">
            {[
              "Write one exam question",
              "Teach just enough to answer it",
              "Tidy up the notes",
              "Next question",
            ].map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 * i }}
                className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2"
              >
                <span
                  className={cn(
                    "size-3 rounded-full",
                    ["bg-bad", "bg-good", "bg-accent", "bg-viz-idle"][i],
                  )}
                />
                {t}
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Imagine a teacher who writes one exam question, teaches exactly enough to answer it, tidies
        up their notes, and only then writes the next question. Nothing gets taught that isn&apos;t
        tested, and every question has been answered.
      </p>
      <p>
        <Term id="tdd">Test-driven development</Term> works like that. Write a failing test (red),
        write just enough code to pass it (green), then improve the code with the test as a safety
        net (refactor). Repeat in small steps.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Step through ⭐ ------------------------------------------------------------------------------- */

const PHASE = {
  list: { label: "Test list", cls: "bg-viz-idle/40 text-fg" },
  red: { label: "Red", cls: "bg-bad text-accent-fg" },
  green: { label: "Green", cls: "bg-good text-accent-fg" },
  refactor: { label: "Refactor", cls: "border border-accent text-accent" },
};

export function Loop() {
  const [s, set] = useSceneState<TddState>();
  const st = STAGES[s.stage];
  const outcomes = run(st);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Build a password checker test-first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span
              className={cn("rounded-full px-3 py-0.5 text-xs font-semibold", PHASE[st.phase].cls)}
            >
              {PHASE[st.phase].label}
            </span>
            <span className="text-muted text-xs">
              Step {s.stage + 1} of {STAGES.length}
            </span>
            <span className="ml-auto flex gap-1">
              <button
                type="button"
                aria-label="Previous step"
                disabled={s.stage === 0}
                onClick={() => set({ stage: s.stage - 1 })}
                className="border-line-strong rounded-full border p-1 disabled:opacity-30"
              >
                <ArrowLeft className="size-3.5" />
              </button>
              <button
                type="button"
                disabled={s.stage === STAGES.length - 1}
                onClick={() => set({ stage: s.stage + 1 })}
                className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium disabled:opacity-30"
              >
                Next step <ArrowRight className="size-3" />
              </button>
            </span>
          </div>
          <motion.p
            key={s.stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
          >
            {st.note}
          </motion.p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="text-muted mb-1 text-[10px] font-medium">Test list</p>
              {TESTS.map((t, i) => {
                const written = i < st.tests;
                const passing = written && outcomes[i]?.ok;
                return (
                  <p
                    key={t.name}
                    className={cn("flex items-start gap-1.5", !written && "text-muted")}
                  >
                    {passing ? (
                      <Check className="text-good mt-0.5 size-3 shrink-0" />
                    ) : (
                      <Circle
                        className={cn(
                          "mt-0.5 size-3 shrink-0",
                          written ? "text-bad" : "text-subtle",
                        )}
                      />
                    )}
                    {t.name}
                  </p>
                );
              })}
            </div>
            <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              <p className="text-muted mb-1 font-sans text-[10px] font-medium">password.js</p>
              {st.code.map((c, i) => (
                <pre key={i} className="whitespace-pre">
                  {c || " "}
                </pre>
              ))}
            </div>
          </div>
          <TestReport outcomes={outcomes} empty="No tests written yet." />
        </div>
      }
    >
      <p>
        The made-up rule: under 12 characters is weak; 12 or more is strong with a digit and only ok
        without. Step through nine moves and watch the colour of each phase.
      </p>
      <p>
        Notice how small each step is, and that the code is never more complicated than the tests
        demand. Refactoring only happens while everything is green.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Canon TDD ------------------------------------------------------------------------------------ */

export function Canon() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Kent Beck's own description"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            "Write a list of the test scenarios you want to cover.",
            "Turn exactly one item into a concrete, runnable test.",
            "Change the code to make it (and all previous tests) pass. Add anything you discover to the list.",
            "Optionally, refactor to improve the design.",
            "Until the list is empty, go back to step 2.",
          ].map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent font-mono font-bold">{i + 1}</span>
              {t}
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kent Beck popularised TDD in his 2002 book. In 2023 he wrote &ldquo;Canon TDD&rdquo; to
        answer critics who were attacking a different process, such as writing all the tests up
        front.
      </p>
      <p>
        Two details people miss: it starts with a <strong>list</strong>, not a test, and the
        refactor step is optional. Mistakes he lists include writing every test up front, tests
        without assertions, and deleting assertions to get to green.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When it helps -------------------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Does it work?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">2008: four industrial teams</p>
            <p className="text-muted">
              Three at Microsoft, one at IBM. Pre-release defect density was 40–90% lower than in
              similar projects without TDD; managers estimated 15–35% more up-front development
              time.
            </p>
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">2017: a controlled study</p>
            <p className="text-muted">
              Whether tests came first or last made little difference. Working in small, steady
              steps was what went with better quality and productivity.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Fits well</p>
              <p className="text-muted">
                Clear rules and logic. Fixing a bug: first a test that reproduces it.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Fits less well</p>
              <p className="text-muted">
                Throwaway experiments, visual layout, problems you don&apos;t understand yet.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The research is encouraging but mixed. Case studies in industry tend to be positive;
        controlled experiments are less clear. The 2008 study was small and not randomised.
      </p>
      <p>
        A fair summary: the habit that matters most is the small loop and fast feedback. Writing the
        test first is a good way to force that habit, and the bug-fix version (reproduce it in a
        test, then fix it) is worth adopting even if you never do full TDD.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function TddCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put the loop in order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="testing-tdd"
            prompt="Drag the steps of one TDD cycle into order."
            items={[
              { id: "list", label: "Pick the next item from the test list" },
              { id: "write", label: "Write a test for it" },
              { id: "fail", label: "Run it and watch it fail" },
              { id: "code", label: "Write just enough code to pass" },
              { id: "pass", label: "Run all tests: green" },
              { id: "refactor", label: "Tidy the code while staying green" },
            ]}
            explanation="Red, green, refactor. Watching the test fail first proves it can fail, so a later pass means something."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Red, green, refactor", "Fail, pass, tidy, in small loops."],
        ["Start with a list", "Then one test at a time."],
        ["See it fail first", "Proves the test can catch something."],
        ["Simplest code that passes", "Let the next test force more."],
        ["Bugs: test first", "Reproduce, then fix."],
      ]}
    >
      <p>That&apos;s unit testing. Next chapter: testing how the pieces fit together.</p>
    </WrapStep>
  );
}

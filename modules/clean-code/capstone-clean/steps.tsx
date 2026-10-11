"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code, type Mark } from "../_shared/code";
import { CHECKLIST, ORIGINAL, PROBLEMS, PROBLEM_LINES, STAGES, run } from "./model";
import type { CapState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Avoided() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The module everyone avoids"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "orders.js",
              "Last changed 14 months ago. Three people have opened it and backed away.",
            ],
            ["The request", "Students now get 10% off, and gift cards must be handled correctly."],
            [
              "Your plan",
              "Read it, protect it with tests, clean it in small steps, then make the change.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        Every team has one: a module that works, mostly, but that nobody dares touch. You&apos;ve
        been asked to change the made-up café&apos;s order total, and it lives there.
      </p>
      <p>
        This capstone uses the whole track. First read it like a detective, then make it safe to
        change, then improve it one <Term id="refactoring">refactoring</Term> at a time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Read it ⭐ ----------------------------------------------------------------------------------- */

export function ReadIt() {
  const [s, set] = useSceneState<CapState>();
  const total = Object.keys(PROBLEMS).length;
  const click = (i: number) => {
    const at = PROBLEM_LINES[i];
    if (at !== undefined && !s.spotted.includes(at)) set({ spotted: [...s.spotted, at] });
  };
  const marks: Record<number, Mark> = {};
  s.spotted.forEach((l) => (marks[l] = "bad"));
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Read it like a detective"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code
            lines={ORIGINAL}
            marks={marks}
            onLine={click}
            title={`orders.js · click the lines that would slow a reader down (${s.spotted.length} of ${total})`}
          />
          <div className="grid gap-1">
            {s.spotted
              .slice()
              .sort((a, b) => a - b)
              .map((l) => (
                <motion.p
                  key={l}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-line bg-surface rounded-lg border px-3 py-1.5 text-xs"
                >
                  <span className="text-muted">line {l + 1}:</span> {PROBLEMS[l]}
                </motion.p>
              ))}
          </div>
          {s.spotted.length === total && (
            <p className="text-good text-xs">
              All five found. Notice you now understand what the function does: reading for problems
              is also reading for meaning.
            </p>
          )}
        </div>
      }
    >
      <p>
        Before changing anything, understand it. Click each line that would trip up the next reader.
        Each problem is one you met earlier in the track.
      </p>
      <p>
        Don&apos;t fix anything yet. Changing code you don&apos;t understand, without tests, is how
        the last outage happened.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Clean it ------------------------------------------------------------------------------------ */

export function CleanIt() {
  const [s, set] = useSceneState<CapState>();
  const st = STAGES[s.stage];
  const results = run(st.fn);
  return (
    <StepLayout
      eyebrow="Step through"
      title="Protect it with tests, then clean it in small steps"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {s.stage < STAGES.length - 1 ? (
              <button
                type="button"
                onClick={() => set({ stage: s.stage + 1 })}
                className="bg-accent text-accent-fg flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
              >
                Next: {STAGES[s.stage + 1].move} <ArrowRight className="size-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => set({ stage: 0 })}
                className="border-line-strong flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
            <span className="text-muted text-xs">
              Step {s.stage} of {STAGES.length - 1}
            </span>
          </div>
          <p className="text-sm font-semibold">{st.move}</p>
          {st.behaviour && (
            <p className="border-line-strong bg-surface-2 rounded-lg border px-3 py-1.5 text-xs">
              This step changes behaviour: errors now surface instead of returning a wrong total.
              Make it a separate, clearly described commit, and add a test for it.
            </p>
          )}
          <Code
            key={s.stage}
            lines={st.code}
            title="orders.js"
            className="max-h-72 overflow-y-auto"
          />
          <div className="border-good/40 bg-good/10 rounded-lg border px-3 py-2 font-mono text-[10.5px]">
            {results.map((r) => (
              <p key={r.name} className={cn("flex items-start gap-1.5", !r.ok && "text-bad")}>
                {r.ok ? (
                  <Check className="text-good mt-0.5 size-3 shrink-0" />
                ) : (
                  <X className="mt-0.5 size-3 shrink-0" />
                )}
                {r.name}
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Four characterisation tests now pin down what the function does today. Step through the
        refactorings; the tests really run against each version and stay green.
      </p>
      <p>
        The final version is a few short lines with names that explain the rules, so adding the next
        requirement is the easy change.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Make the change ------------------------------------------------------------------------------ */

export function MakeChange() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Now the change is easy"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code
            numbers={false}
            title="The new request: loyalty members get 5% off, on top of any student discount"
            lines={[
              "function orderTotal(order, { student = false, loyalty = false } = {}) {",
              "  let total = subtotal(order);",
              "  if (student) total *= 1 - STUDENT_DISCOUNT;",
              "  if (loyalty) total *= 1 - LOYALTY_DISCOUNT;",
              "  return roundToPaise(total);",
              "}",
            ]}
            marks={{ 0: "good", 3: "good" }}
          />
          <Code
            numbers={false}
            title="And its test, written first"
            lines={[
              'test("loyalty members get 5% off after the student discount", () => {',
              "  expect(orderTotal(oneChai, { student: true, loyalty: true })).toBe(107.73);",
              "});",
            ]}
          />
        </div>
      }
    >
      <p>
        Kent Beck&apos;s advice in action: make the change easy, then make the easy change. In the
        original, a new discount meant another flag and another level of nesting. Now it&apos;s two
        lines and a test.
      </p>
      <p>
        Leave notes for the next person: a short ADR if you made a design decision, and anything you
        deliberately left for later recorded as debt.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checklist ------------------------------------------------------------------------------------ */

export function Checklist() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The whole track as a checklist"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {CHECKLIST.map(([ch, items], i) => (
            <motion.div
              key={ch}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="text-accent font-semibold">{ch}</p>
              <ul className="mt-1 grid gap-0.5">
                {items.map((it) => (
                  <li key={it} className="flex items-start gap-1.5">
                    <Check className="text-good mt-0.5 size-3 shrink-0" />
                    {it}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Here&apos;s the track on one page. Each line maps back to a chapter you can revisit.</p>
      <p>
        The common thread: write for the next reader, change code in small safe steps, and choose
        principles with judgement rather than rules.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CapCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In what order?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="clean-capstone"
            prompt="Drag the steps for changing a tangled module into order."
            items={[
              { id: "read", label: "Read it until you understand what it does" },
              { id: "pin", label: "Pin its current behaviour with tests" },
              { id: "refactor", label: "Refactor in small steps, tests green after each" },
              { id: "behaviour", label: "Make behaviour changes separately, with new tests" },
              { id: "feature", label: "Add the new feature, now an easy change" },
              { id: "record", label: "Record decisions and leftover debt" },
            ]}
            explanation="Understand, protect, improve, then change, and leave notes for the next person."
          />
        </div>
      }
    >
      <p>Drag the steps into order.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Read before you change", "Understanding is the first job."],
        ["Tests before refactoring", "Pin today's behaviour."],
        ["Small steps, always green", "Structure first, behaviour separately."],
        ["Make the change easy", "Then make the easy change."],
        ["Leave it better", "Clean code is a habit, not a rewrite."],
      ]}
    >
      <p>
        That&apos;s the Clean Code track. Next in Software development: Code Review, giving and
        receiving useful reviews.
      </p>
    </WrapStep>
  );
}

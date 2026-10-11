"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code } from "../_shared/code";
import { FIXES, SCENARIOS, SWALLOWED, outcome, type Fix } from "./model";
import type { ErrorState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Smoke() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The alarm with the battery taken out"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Silenced</p>
            <p className="text-muted">
              The smoke alarm kept beeping at toast, so someone removed the battery. Quiet kitchen,
              until the real fire.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Handled</p>
            <p className="text-muted">
              The alarm stays on; the toaster moves. Real problems still make noise, in the right
              place.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Errors are a program&apos;s alarms. The worst thing you can do with one is silence it: catch
        it and do nothing. The program carries on as if all is well, and the damage shows up later,
        somewhere unrelated.
      </p>
      <p>
        Clean <Term id="error-handling">error handling</Term> keeps errors visible, handles each
        where something useful can be done, and gives messages that help the person who sees them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Fix the swallow ⭐ ---------------------------------------------------------------------------- */

export function FixSwallow() {
  const [s, set] = useSceneState<ErrorState>();
  const toggle = (f: Fix) =>
    set({ fixes: s.fixes.includes(f) ? s.fixes.filter((x) => x !== f) : [...s.fixes, f] });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find the swallowed error, then fix it three ways"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code
            lines={SWALLOWED}
            title="checkout.js, as found"
            marks={{ 3: "bad", 4: "bad", 6: "hot" }}
          />
          <div className="grid gap-1">
            {FIXES.map((f) => (
              <div
                key={f.id}
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-xs",
                  s.fixes.includes(f.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <label className="flex items-start gap-1.5">
                  <input
                    type="checkbox"
                    checked={s.fixes.includes(f.id)}
                    onChange={() => toggle(f.id)}
                    className="accent-accent mt-0.5"
                  />
                  {f.label}
                </label>
                {s.fixes.includes(f.id) && <Code lines={f.code} numbers={false} className="mt-1" />}
              </div>
            ))}
          </div>
          <div className="grid gap-1">
            {SCENARIOS.map((sc) => {
              const o = outcome(sc.id, s.fixes);
              return (
                <motion.div
                  key={`${sc.id}-${s.fixes.join()}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs",
                    o.ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <p className="flex items-center gap-1.5 font-medium">
                    {o.ok ? (
                      <Check className="text-good size-3.5" />
                    ) : (
                      <X className="text-bad size-3.5" />
                    )}
                    {sc.label}
                  </p>
                  <p className="text-muted pl-5 text-[10px]">{o.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      }
    >
      <p>
        This checkout catches any payment error and does nothing (an empty <code>catch</code> with a
        TODO). Every failure is treated as success. Watch the three scenarios, then switch on fixes.
      </p>
      <p>
        Handling the error, by exception or by result, fixes the declined and timeout cases. Failing
        fast catches the bug that sent a negative total, right where it happened. Good code usually
        uses all three.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Across languages ------------------------------------------------------------------------------ */

const LANGS: Record<ErrorState["lang"], { label: string; note: string; code: string[] }> = {
  js: {
    label: "JS / Python",
    note: "Exceptions. Anything can throw; nothing forces callers to handle it, so be deliberate about where you catch.",
    code: [
      "try {",
      "  await charge(order);",
      "} catch (e) {",
      '  throw new PaymentFailed("charge failed", { cause: e });',
      "}",
    ],
  },
  go: {
    label: "Go",
    note: "Errors are ordinary return values, checked explicitly. In 2025 the Go team decided not to add new error-handling syntax.",
    code: [
      "res, err := charge(order)",
      "if err != nil {",
      '    return fmt.Errorf("charge order %s: %w", order.ID, err)',
      "}",
    ],
  },
  rust: {
    label: "Rust",
    note: "Result<T, E> in the type; the compiler won't let you ignore it, and ? passes errors up concisely.",
    code: [
      "fn checkout(order: &Order) -> Result<(), PaymentError> {",
      "    charge(order)?;",
      "    mark_paid(order);",
      "    Ok(())",
      "}",
    ],
  },
  java: {
    label: "Java",
    note: "Checked exceptions must be declared or caught; unchecked ones need not. Teams argue about which to use.",
    code: [
      "void checkout(Order o) throws PaymentFailedException {",
      "    gateway.charge(o);",
      "    markPaid(o);",
      "}",
    ],
  },
};

export function Languages() {
  const [s, set] = useSceneState<ErrorState>();
  const l = LANGS[s.lang];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Exceptions or error values?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            value={s.lang}
            onChange={(v) => set({ lang: v })}
            options={(Object.keys(LANGS) as ErrorState["lang"][]).map((k) => [k, LANGS[k].label])}
          />
          <motion.div
            key={s.lang}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-2"
          >
            <Code lines={l.code} numbers={false} />
            <p className="text-muted text-xs">{l.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Languages disagree about how errors should travel. Exceptions jump up the call stack until
        someone catches them; error values are returned like any other result and checked on the
        spot.
      </p>
      <p>
        Either can be clean. What matters is the same everywhere: never ignore an error, add context
        as it travels (which order, which step), and handle it where you can do something useful.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Fail fast ------------------------------------------------------------------------------------ */

export function FailFast() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Fail fast, and say something useful"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Fail fast",
              "Check inputs at the edge and stop as soon as something is wrong, close to the cause. Jim Shore popularised the idea for everyday code in 2004.",
            ],
            [
              "Don't be too forgiving",
              "“Be liberal in what you accept” (Postel's law, from early internet standards) is now questioned: RFC 9413 (2023) argues tolerating bad input hides bugs.",
            ],
            [
              "Messages for people",
              "For customers: what happened and what to do. For logs: which order, which step, the original cause. Never show stack traces to customers.",
            ],
            [
              "Don't use errors for normal flow",
              "A missing search result isn't an exception; return an empty list.",
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
        A program that <Term id="fail-fast">fails fast</Term>, stopping loudly at the first sign of
        trouble, is easier to fix than one that limps on and corrupts data. The further an error
        travels before anyone notices, the harder the hunt.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ErrorCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good handling or a hidden alarm?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="clean-errors"
            prompt="Sort each piece of error handling."
            categories={[
              { id: "good", label: "Good" },
              { id: "bad", label: "Hides problems" },
            ]}
            items={[
              { id: "empty", label: "catch (e) { }", category: "bad", why: "Silences the alarm." },
              {
                id: "context",
                label: "Wrap the error with the order ID and rethrow",
                category: "good",
                why: "Keeps it visible, adds context.",
              },
              {
                id: "default",
                label: "On any error, return a price of 0",
                category: "bad",
                why: "A wrong answer that looks right.",
              },
              {
                id: "validate",
                label: "Reject a negative quantity at the API boundary",
                category: "good",
                why: "Fails fast, near the cause.",
              },
              {
                id: "log",
                label: "Log and continue as if payment succeeded",
                category: "bad",
                why: "Logged, but the program still lies.",
              },
            ]}
            explanation="Keep errors visible: handle them where you can act, add context, and fail fast on bad input. Never turn a failure into a fake success."
          />
        </div>
      }
    >
      <p>Sort each piece.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Never swallow errors", "An empty catch is a silenced alarm."],
        ["Handle where you can act", "Often at the edge, near the person."],
        ["Add context as it travels", "Which order, which step, the cause."],
        ["Fail fast on bad input", "Close to the bug."],
        ["Exceptions or values", "Both work; ignoring them doesn't."],
      ]}
    >
      <p>Next: the value that might not be there.</p>
    </WrapStep>
  );
}

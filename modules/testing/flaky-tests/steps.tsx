"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CAUSES, TESTS, run100, type Cause } from "./model";
import type { FlakyState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function CryWolf() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The car alarm nobody hears"
      stage={
        <div className="flex flex-1 items-center justify-center">
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: 21 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.03 * i }}
                className={cn("size-6 rounded", [3, 9, 14, 18].includes(i) ? "bg-bad" : "bg-good")}
              />
            ))}
          </div>
        </div>
      }
    >
      <p>
        A car alarm that goes off whenever a lorry passes soon becomes noise. When a thief finally
        tries the door, nobody looks up.
      </p>
      <p>
        A <Term id="flaky-test">flaky test</Term> does the same to a team. It fails now and then
        with no code change, people learn to press &ldquo;re-run&rdquo;, and one day a real failure
        gets re-run too. In 2016 Google reported that almost 16% of its tests had shown some
        flakiness.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Diagnose ⭐ ----------------------------------------------------------------------------------- */

export function Diagnose() {
  const [s, set] = useSceneState<FlakyState>();
  const fixed = TESTS.filter((t) => t.cause && s.guesses[t.id] === t.cause).map((t) => t.id);
  const stats = run100(fixed, s.retries);
  const flaky = TESTS.filter((t) => stats.passes[t.id] > 0 && stats.passes[t.id] < 100);
  const guess = (id: string, c: Cause) => set({ guesses: { ...s.guesses, [id]: c } });
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Run the suite 100 times and trace each flake"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => set({ ran: true })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1 text-xs font-medium"
            >
              <Play className="size-3" /> Run 100 times
            </button>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.retries}
                onChange={(e) => set({ retries: e.target.checked })}
                className="accent-accent"
              />
              Retry each failing test up to 3 times
            </label>
          </div>
          {s.ran && (
            <>
              <div className="border-line overflow-hidden rounded-lg border text-[11px]">
                {TESTS.map((t) => {
                  const n = stats.passes[t.id];
                  const isFlaky = n > 0 && n < 100;
                  const isFixed = fixed.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "border-line border-t px-3 py-1.5 first:border-t-0",
                        isFlaky && "bg-bad/10",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-1">{t.name}</span>
                        <span className={cn("font-mono", isFlaky ? "text-bad" : "text-good")}>
                          {n}/100
                        </span>
                      </div>
                      {t.cause && (isFlaky || isFixed) && (
                        <div className="mt-1 grid gap-1">
                          {!isFixed && <p className="text-muted font-mono text-[10px]">{t.clue}</p>}
                          <div className="flex flex-wrap gap-1">
                            {CAUSES.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                aria-pressed={s.guesses[t.id] === c.id}
                                onClick={() => guess(t.id, c.id)}
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px]",
                                  s.guesses[t.id] === c.id
                                    ? c.id === t.cause
                                      ? "border-good bg-good/20"
                                      : "border-bad bg-bad/15"
                                    : "border-line text-muted",
                                )}
                              >
                                {c.label}
                              </button>
                            ))}
                          </div>
                          {isFixed && (
                            <p className="text-good text-[10px]">
                              Fixed: {CAUSES.find((c) => c.id === t.cause)!.fix}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className={cn("text-xs", stats.redBuilds ? "text-bad" : "text-good")}>
                Builds that went red with no real bug: {stats.redBuilds} of 100
                {s.retries && flaky.length > 0
                  ? " · retries hide the flakes, but every cause is still there"
                  : ""}
              </p>
            </>
          )}
          <p className="text-subtle text-[10px]">Failure rates are illustrative.</p>
        </div>
      }
    >
      <p>
        Nothing in this café app is broken, yet the suite goes red again and again. Run it 100
        times, find the tests that flip, read each clue, and pick the cause. A correct diagnosis
        applies the fix.
      </p>
      <p>
        Then try turning on retries before fixing everything. The build goes green more often, but
        the causes, including a real race condition, are still there.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Causes ---------------------------------------------------------------------------------------- */

export function Causes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Where flakiness comes from"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Waiting on something async", 45],
            ["Concurrency", 20],
            ["Test order dependency", 12],
            ["Everything else", 23],
          ].map(([l, n], i) => (
            <div key={l as string} className="text-xs">
              <div className="flex justify-between">
                <span>{l as string}</span>
                <span className="font-mono">{n as number}%</span>
              </div>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${n}%` }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className="bg-accent/60 mt-0.5 h-2 rounded"
              />
            </div>
          ))}
          <p className="text-muted text-[10px]">
            Causes of fixed flaky tests in Apache projects (Luo et al., 2014; 161 classifiable
            fixes).
          </p>
        </div>
      }
    >
      <p>
        A well-known 2014 study of flaky-test fixes found that the biggest single cause was waiting
        badly for something asynchronous, followed by concurrency and test order. Time, shared
        state, randomness, network calls and resource leaks make up much of the rest.
      </p>
      <p>
        Google&apos;s 2016 figures show why it matters: about 1.5% of all test runs were flaky, and
        around 84% of tests that went from passing to failing were flaky ones, not real breaks.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Policy --------------------------------------------------------------------------------------- */

export function Policy() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What a team should do"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Detect",
              "Re-run a failed test on the same code: if it passes, it's flaky. Shuffle test order to expose dependencies (pytest-randomly, Jest's --randomize, JUnit's random method order).",
            ],
            [
              "Quarantine, with an owner",
              "Move a flaky test out of the blocking suite so it can't fail builds, give it an owner and a deadline. Some CI services can mute flaky tests automatically.",
            ],
            [
              "Fix the cause",
              "Fixed clocks, own data per test, reset state, proper waits, seeded randomness.",
            ],
            [
              "Be careful with retries",
              "Automatic retries keep builds green but hide real races, and quietly normalise flakiness.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
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
        A flaky test is a bug, either in the test or in the code. The worst policy is the common
        one: re-run until green and move on.
      </p>
      <p>
        Watch out for JUnit&apos;s <code>@Order</code>: fixing the order hides dependencies rather
        than finding them. Randomising is what exposes them.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function FlakyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the cause"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-flaky"
            prompt="What is the most likely cause of each flaky failure?"
            categories={[
              { id: "time", label: "Clock" },
              { id: "order", label: "Order or shared state" },
              { id: "async", label: "Async / race" },
            ]}
            items={[
              {
                id: "leap",
                label: "Fails only on 29 February",
                category: "time",
                why: "Dates from the real clock.",
              },
              {
                id: "alone",
                label: "Passes alone, fails in the full suite",
                category: "order",
                why: "Another test leaves something behind.",
              },
              {
                id: "spinner",
                label: "Element not found; screenshot shows a spinner",
                category: "async",
                why: "Checked before loading finished.",
              },
              {
                id: "parallel",
                label: "Fails only when tests run in parallel",
                category: "order",
                why: "Tests share data or resources.",
              },
              {
                id: "undef",
                label: "Received undefined; passes with a breakpoint",
                category: "async",
                why: "Slowing down hides a missing await.",
              },
            ]}
            explanation="Most flakiness traces back to time, shared state and order, or not waiting properly for asynchronous work."
          />
        </div>
      }
    >
      <p>Sort each symptom.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Flaky tests destroy trust", "People stop believing red builds."],
        ["Usual suspects", "Async waits, concurrency, order, time, shared state, randomness."],
        ["Detect by re-running and shuffling", "Same code, different result."],
        ["Quarantine with an owner", "Then fix the cause."],
        ["Retries hide, not heal", "Use them knowingly."],
      ]}
    >
      <p>Next: the data your tests rely on, and how to keep it simple.</p>
    </WrapStep>
  );
}

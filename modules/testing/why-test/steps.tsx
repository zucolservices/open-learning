"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUGS, NETS, STAGES, foundAt, type Net } from "./model";
import type { WhyTestState } from "./state";

/* 2 ─ Safety nets ⭐ -------------------------------------------------------------------------------- */

export function SafetyNets() {
  const [s, set] = useSceneState<WhyTestState>();
  const toggle = (n: Net) =>
    set({ nets: s.nets.includes(n) ? s.nets.filter((x) => x !== n) : [...s.nets, n] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where is the bug found?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {NETS.map((n) => (
              <button
                key={n.id}
                type="button"
                aria-pressed={s.nets.includes(n.id)}
                onClick={() => toggle(n.id)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.nets.includes(n.id)
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line-strong text-muted",
                )}
              >
                {n.label}
              </button>
            ))}
          </div>
          <div className="border-line overflow-hidden rounded-xl border">
            <div className="bg-surface-2 text-muted grid grid-cols-4 gap-1 px-2 py-1.5 text-[10px] font-medium">
              {STAGES.map((st) => (
                <span key={st.id}>
                  {st.label}
                  <span className="block font-normal">{st.when}</span>
                </span>
              ))}
            </div>
            {BUGS.map((b) => {
              const at = foundAt(b, s.nets);
              const col = STAGES.findIndex((st) => st.id === at);
              return (
                <div key={b.id} className="border-line border-t px-2 py-2">
                  <p className="text-xs">{b.label}</p>
                  <div className="relative mt-1.5 grid grid-cols-4 gap-1">
                    {STAGES.map((st, i) => (
                      <span
                        key={st.id}
                        className={cn(
                          "h-1.5 rounded-full",
                          i < col
                            ? "bg-viz-idle/40"
                            : i === col
                              ? at === "production"
                                ? "bg-bad"
                                : "bg-good"
                              : "bg-surface-2",
                        )}
                      />
                    ))}
                  </div>
                  <motion.p
                    key={at}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={cn(
                      "mt-1 text-[10px]",
                      at === "production" ? "text-bad" : "text-muted",
                    )}
                  >
                    Found by {STAGES[col].by}: {STAGES[col].fix}.
                  </motion.p>
                </div>
              );
            })}
          </div>
          <p className="text-subtle text-[10px]">Fix times are illustrative.</p>
        </div>
      }
    >
      <p>
        Three made-up bugs are hiding in the café&apos;s next release. Switch on different kinds of
        tests and watch where each bug is found.
      </p>
      <p>
        Each kind of test catches a different kind of mistake. Without the right one, a bug travels
        further, and the further it travels, the harder it is to trace back to its cause.
      </p>
      <p className="text-muted text-sm">You&apos;ll meet each kind in this track.</p>
    </StepLayout>
  );
}

/* 3 ─ What tests give you --------------------------------------------------------------------------- */

const GIVES: [string, string][] = [
  [
    "Catch regressions",
    "A bug that comes back after being fixed is a regression. A test keeps it fixed.",
  ],
  [
    "Make change safe",
    "Restructure code freely: if the tests still pass, behaviour hasn't changed.",
  ],
  [
    "Document behaviour",
    "A test shows exactly how code is meant to be used, and stays up to date because it runs.",
  ],
  [
    "Give design feedback",
    "Code that's painful to test is often too tangled. Tests show you early.",
  ],
];

export function WhatTestsGive() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What tests give you, and what they don't"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {GIVES.map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex items-start gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <Check className="text-good mt-0.5 size-3.5 shrink-0" />
              <span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted block">{b}</span>
              </span>
            </motion.div>
          ))}
          <div className="border-bad/40 bg-bad/10 flex items-start gap-2 rounded-lg border px-3 py-2 text-xs">
            <X className="text-bad mt-0.5 size-3.5 shrink-0" />
            <span>
              <span className="font-semibold">Prove there are no bugs</span>
              <span className="text-muted block">
                Tests check the cases someone thought of. Passing tests mean those cases work, not
                that everything does.
              </span>
            </span>
          </div>
        </div>
      }
    >
      <p>
        The computer scientist Edsger Dijkstra put it this way around 1970: testing can show the
        presence of bugs, but never their absence.
      </p>
      <p>
        So the aim isn&apos;t perfect tests. It&apos;s a <Term id="test-suite">test suite</Term>{" "}
        that catches the mistakes you&apos;re most likely to make, quickly enough that you run it
        all the time.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When bugs escape ------------------------------------------------------------------------------ */

const ESCAPES: { year: string; name: string; what: string; lesson: string }[] = [
  {
    year: "1996",
    name: "Ariane 5, flight 501",
    what: "About 37 seconds after launch the rocket veered off course and broke up. Guidance code reused from Ariane 4 converted a number too big for its 16-bit slot, and the error shut the system down.",
    lesson: "Code that was fine in one setting was never tested with the new rocket's flight data.",
  },
  {
    year: "2012",
    name: "Knight Capital",
    what: "A trading firm lost about $460 million in about 45 minutes. New code reached seven of its eight order servers; on the eighth, a reused setting woke up old, dead code.",
    lesson: "Deployment and old code paths need checks too, not just the new feature.",
  },
  {
    year: "2024",
    name: "CrowdStrike",
    what: "A faulty content update to a security product crashed about 8.5 million Windows computers (Microsoft's estimate). The code expected 21 input fields but received 20; the tests had only ever used a wildcard in the 21st, so the mismatch never showed.",
    lesson:
      "Tests must use realistic inputs, and big changes should roll out to a few machines first.",
  },
];

export function Escapes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="When bugs escape"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {ESCAPES.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">
                <span className="text-accent font-mono">{e.year}</span> · {e.name}
              </p>
              <p className="text-muted mt-0.5">{e.what}</p>
              <p className="mt-1">{e.lesson}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Most bugs cost an afternoon. A few become famous. Each of these was a small mistake that
        travelled all the way to the real world.
      </p>
      <p>
        None was a problem of not testing at all. Each was a gap: a situation, a code path or a
        check that nobody had tested.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function WhyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fact or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-why"
            prompt="Sort each statement."
            categories={[
              { id: "fact", label: "True" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "regress",
                label: "A test can stop a fixed bug from coming back",
                category: "fact",
                why: "It runs on every change, so the old mistake fails it at once.",
              },
              {
                id: "prove",
                label: "If all tests pass, the code has no bugs",
                category: "myth",
                why: "Tests only check the cases someone wrote down.",
              },
              {
                id: "late",
                label: "Bugs found later are usually harder to trace",
                category: "fact",
                why: "More changes have happened since; the cause is buried.",
              },
              {
                id: "slow",
                label: "Tests always slow a team down",
                category: "myth",
                why: "They cost time to write but save far more in debugging and fear of change.",
              },
              {
                id: "refactor",
                label: "Tests make it safer to restructure code",
                category: "fact",
                why: "If behaviour changes by accident, a test fails.",
              },
            ]}
            explanation="Tests are a safety net for change: they catch the mistakes someone anticipated, early. They don't prove the absence of bugs."
          />
        </div>
      }
    >
      <p>Sort each statement into true or myth.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        [
          "A test is code that checks code",
          "It calls your code and compares the result with what you expect.",
        ],
        ["Early is cheap", "A bug found seconds after the change is easy to trace."],
        [
          "Different tests, different bugs",
          "Unit, integration and end-to-end tests each catch their own kind.",
        ],
        ["A safety net for change", "Tests let you improve code without fear."],
        ["Not a proof", "Passing tests show the cases you checked work, nothing more."],
      ]}
    >
      <p>Next: what a single test looks like inside, and how to read one when it fails.</p>
    </WrapStep>
  );
}

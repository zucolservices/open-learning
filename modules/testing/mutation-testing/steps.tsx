"use client";

import { motion } from "motion/react";
import { Bug, Skull } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { runTests } from "../_shared/runner";
import { MUTANTS, ORIGINAL, TESTS, killedBy, original } from "./model";
import type { MutationState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function FireDrill() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Testing the smoke alarm"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">“It hasn&apos;t gone off in a year”</p>
            <p className="text-muted">
              Because there&apos;s been no fire, or because it&apos;s broken?
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">Press the test button</p>
            <p className="text-muted">Make a small, safe pretend fire and check it beeps.</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A silent smoke alarm could mean there&apos;s no fire, or that the alarm is broken. The only
        way to know is to give it something it <em>should</em> react to.
      </p>
      <p>
        <Term id="mutation-testing">Mutation testing</Term> does that to your tests. A tool plants
        small bugs in your code, such as turning <code>&lt;=</code> into <code>&lt;</code>, and
        reruns the tests. If no test fails, the tests wouldn&apos;t notice that bug in real life
        either.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Kill the mutants ⭐ --------------------------------------------------------------------------- */

export function KillMutants() {
  const [s, set] = useSceneState<MutationState>();
  const toggle = (id: string) =>
    set({ tests: s.tests.includes(id) ? s.tests.filter((x) => x !== id) : [...s.tests, id] });
  const mark = (id: string) =>
    set({ marked: s.marked.includes(id) ? s.marked.filter((x) => x !== id) : [...s.marked, id] });
  const results = MUTANTS.map((m) => ({ m, by: killedBy(m, s.tests) }));
  const killed = results.filter((r) => r.by.length > 0).length;
  const counted = MUTANTS.length - s.marked.length;
  const originalOk = runTests(
    TESTS.filter((t) => s.tests.includes(t.id)),
    original,
  ).every((o) => o.ok);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Plant bugs and see which survive"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-[1.3fr_1fr]">
            <div className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[10.5px]">
              {ORIGINAL.map((l, i) => (
                <pre key={i} className="whitespace-pre">
                  <span className="text-subtle mr-2">{i + 1}</span>
                  {l}
                </pre>
              ))}
            </div>
            <div className="grid content-start gap-1">
              {TESTS.map((t) => (
                <label
                  key={t.id}
                  className={cn(
                    "flex items-start gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                    s.tests.includes(t.id)
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={s.tests.includes(t.id)}
                    onChange={() => toggle(t.id)}
                    className="accent-accent mt-0.5"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-1">
            {results.map(({ m, by }) => {
              const dead = by.length > 0;
              const isMarked = s.marked.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={cn(
                    "flex flex-wrap items-center gap-2 rounded-lg border px-3 py-1 text-[11px]",
                    dead
                      ? "border-good/40 bg-good/10"
                      : isMarked
                        ? "border-line bg-surface-2 opacity-70"
                        : "border-bad/40 bg-bad/10",
                  )}
                >
                  {dead ? (
                    <Skull className="text-good size-3.5" />
                  ) : (
                    <Bug className="text-bad size-3.5" />
                  )}
                  <span className="text-muted w-24 shrink-0">
                    line {m.line} · {m.op}
                  </span>
                  <code className="font-mono">
                    {m.from} → {m.to}
                  </code>
                  <span className="text-muted ml-auto">
                    {dead ? "killed" : isMarked ? "marked equivalent" : "survived"}
                  </span>
                  {!dead && (
                    <button
                      type="button"
                      onClick={() => mark(m.id)}
                      className="border-line-strong rounded-full border px-2 text-[10px]"
                    >
                      {isMarked ? "Unmark" : "Equivalent?"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span>
              Mutation score:{" "}
              <span className="font-mono">
                {killed} / {counted}
              </span>
            </span>
            {!originalOk && (
              <span className="text-bad">One of your tests fails on the original code.</span>
            )}
            {s.marked.length > 0 &&
              s.marked.some((id) => !MUTANTS.find((m) => m.id === id)?.equivalent) && (
                <span className="text-bad">
                  One marked mutant isn&apos;t equivalent: a test can kill it.
                </span>
              )}
          </div>
        </div>
      }
    >
      <p>
        Six mutants of a made-up parcel-fee function have been planted. Tick tests and watch them
        die. Each surviving mutant is a bug your tests would miss.
      </p>
      <p>
        One mutant can never be killed, because it behaves exactly like the original for every
        input. That&apos;s an <strong>equivalent mutant</strong>. Find it and mark it, so it no
        longer counts against your score.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How tools do it at scale --------------------------------------------------------------------- */

export function AtScale() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Making it affordable"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "The cost",
              "Every mutant means another run of the tests. Hundreds of mutants, hundreds of runs.",
            ],
            [
              "Only changed code",
              "Mutate just the lines a pull request touches, and only tests that cover them.",
            ],
            [
              "Skip the noise",
              "Don't mutate logging, or lines tests never reach; equivalent mutants waste reviewers' time.",
            ],
            [
              "Show it in review",
              "Google surfaces a few surviving mutants as code-review comments; its 2021 paper covers more than 24,000 developers.",
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
        The idea is old: the first published paper on it, by DeMillo, Lipton and Sayward, dates from
        1978. It took cheaper computers and smarter selection to make it practical.
      </p>
      <p>
        The <strong>mutation score</strong> (mutants killed out of mutants that can be killed) is a
        far better measure of test strength than coverage, because a mutant only dies if a test
        actually checks the result.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Mutation testing tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Java", "PIT (PITest)"],
            ["JavaScript, TypeScript, C#, Scala", "Stryker"],
            ["Python", "mutmut, Cosmic Ray"],
            ["Rust", "cargo-mutants"],
            ["PHP", "Infection"],
          ].map(([l, t], i) => (
            <motion.div
              key={l}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface flex justify-between gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-muted">{l}</span>
              <span className="font-medium">{t}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        All of these are free and maintained. Most can run on just the files you changed, which is
        the easiest way to start: try it on one module you care about and read the survivors.
      </p>
      <p>
        A newer twist: in 2025 Meta described a system that uses a language model to write a few
        realistic mutants for a specific risk, then tests that kill them. Engineers accepted most of
        the tests it proposed.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function MutationCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A mutant survived"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="testing-mutation"
            prompt="A mutant that changes age >= 18 to age > 18 survives your tests. What's the best response?"
            options={[
              {
                id: "boundary",
                label: "Add a test for exactly 18",
                correct: true,
                feedback: "That's the input where the two versions differ, so it kills the mutant.",
              },
              {
                id: "coverage",
                label: "Raise the coverage target",
                feedback: "The line is already covered; coverage can't see this gap.",
              },
              {
                id: "ignore",
                label: "Ignore it: mutants aren't real bugs",
                feedback: "Off-by-one at a boundary is one of the most common real bugs.",
              },
              {
                id: "equiv",
                label: "Mark it equivalent",
                feedback: "It isn't: at 18 the two versions give different answers.",
              },
            ]}
            explanation="A surviving mutant points to a missing test. Write the test that makes the mutant and the original behave differently."
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
        ["Plant bugs on purpose", "If no test fails, your tests have a blind spot."],
        ["Killed or survived", "Each survivor is a missing test."],
        ["Equivalent mutants", "Some changes can't be caught; set them aside."],
        ["Stronger than coverage", "A mutant dies only if a result is checked."],
        ["Start small", "Changed code only, in one module."],
      ]}
    >
      <p>Next: tests that pass, then fail, then pass, with no change at all.</p>
    </WrapStep>
  );
}

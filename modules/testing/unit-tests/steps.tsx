"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { runTests } from "../_shared/runner";
import { TestReport } from "../_shared/report";
import { TESTS, VARIANTS, impl } from "./model";
import type { UnitState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Bench() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Test the bulb on the bench"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">In the house</p>
            <p className="text-muted">
              The light won&apos;t turn on. The bulb? The switch? The wiring? The fuse? You have to
              check them all.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-accent bg-accent-soft rounded-xl border p-3 text-xs"
          >
            <p className="font-semibold">On the bench</p>
            <p className="text-muted">
              Plug the bulb into a tester. It lights or it doesn&apos;t. One second, one answer, one
              suspect.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        An electrician who suspects a bulb doesn&apos;t rewire the house to find out. They test the
        bulb on its own, on a bench, where the answer is instant and can only mean one thing.
      </p>
      <p>
        A <Term id="unit-test">unit test</Term> is the bench test of code: one function or class,
        checked on its own, in milliseconds. When it fails, you know exactly where to look.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a suite ⭐ ------------------------------------------------------------------------------ */

export function BuildSuite() {
  const [s, set] = useSceneState<UnitState>();
  const chosen = TESTS.filter((t) => s.suite.includes(t.id));
  const outcomes = runTests(chosen, impl(s.variant));
  const matrix = VARIANTS.map((v) => ({
    v,
    fails: runTests(chosen, impl(v.id)).filter((o) => !o.ok).length,
  }));
  const toggle = (id: string) =>
    set({ suite: s.suite.includes(id) ? s.suite.filter((x) => x !== id) : [...s.suite, id] });
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Build a suite that catches every bug"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1 lg:grid-cols-2">
            {TESTS.map((t) => (
              <label
                key={t.id}
                className={cn(
                  "flex cursor-pointer items-start gap-2 rounded-lg border px-2.5 py-1 text-xs",
                  s.suite.includes(t.id)
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.suite.includes(t.id)}
                  onChange={() => toggle(t.id)}
                  className="accent-accent mt-0.5"
                />
                <span>
                  {t.name}
                  <code className="text-muted block font-mono text-[10px]">{t.code}</code>
                </span>
              </label>
            ))}
          </div>
          <div className="border-line overflow-hidden rounded-lg border text-[11px]">
            {matrix.map(({ v, fails }) => {
              const good = v.kind === "bug" ? fails > 0 : fails === 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={s.variant === v.id}
                  onClick={() => set({ variant: v.id })}
                  className={cn(
                    "border-line flex w-full items-center gap-2 border-t px-2.5 py-1 text-left first:border-t-0",
                    s.variant === v.id && "bg-surface-2",
                  )}
                >
                  {good ? (
                    <Check className="text-good size-3 shrink-0" />
                  ) : (
                    <X className="text-bad size-3 shrink-0" />
                  )}
                  <span className="flex-1">{v.label}</span>
                  <span className="text-muted">
                    {v.kind === "bug"
                      ? fails
                        ? "caught"
                        : "slips through"
                      : fails
                        ? `${fails} false alarm${fails > 1 ? "s" : ""}`
                        : "all pass"}
                  </span>
                </button>
              );
            })}
          </div>
          <TestReport outcomes={outcomes} empty="Tick some tests to build a suite." />
        </div>
      }
    >
      <p>
        Here is a café&apos;s <code>bill()</code> function and eight candidate tests. Tick tests to
        build a suite. The table runs it against the real function, four buggy versions and one
        harmless refactor.
      </p>
      <p>
        Aim for every bug caught, no false alarms on the refactor, and as few tests as you can.
        Click a row to see the full report.
      </p>
      <p className="text-muted text-sm">
        One test fails on the refactor even though nothing broke. That&apos;s a test of <em>how</em>{" "}
        the code works rather than <em>what</em> it does.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What counts as a unit? ------------------------------------------------------------------------ */

export function WhatUnit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What counts as a unit?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "Solitary",
                "Only the class under test is real. Everything it uses is replaced by stand-ins.",
              ],
              [
                "Sociable",
                "The class uses its real collaborators, as long as they're fast and in memory.",
              ],
            ].map(([t, b]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="font-semibold">
              Michael Feathers&apos; rules (2005): it&apos;s not a unit test if it…
            </p>
            <ul className="text-muted mt-1 grid gap-0.5">
              {[
                "talks to the database",
                "communicates across the network",
                "touches the file system",
                "can't run at the same time as other unit tests",
                "needs special setup of your environment to run",
              ].map((r) => (
                <li key={r} className="flex items-start gap-1.5">
                  <X className="text-bad mt-0.5 size-3 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      }
    >
      <p>
        There&apos;s no single definition. Jay Fields named two styles, which Martin Fowler made
        popular: <strong>solitary</strong> unit tests replace every collaborator, while{" "}
        <strong>sociable</strong> ones let the unit use its real, fast neighbours.
      </p>
      <p>
        Both agree on the practical line Feathers drew: once a test needs a database, a network or
        the disk, it&apos;s slower and less predictable, so treat it as a different kind of test.
      </p>
    </StepLayout>
  );
}

/* 4 ─ FIRST ---------------------------------------------------------------------------------------- */

const FIRST: [string, string, string][] = [
  ["F", "Fast", "Milliseconds, so you run them after every small change."],
  ["I", "Independent", "No test depends on another or on the order they run in."],
  [
    "R",
    "Repeatable",
    "Same result on any machine, any time: no real clock, network or randomness.",
  ],
  ["S", "Self-validating", "Pass or fail by itself. No reading logs to decide."],
  ["T", "Timely", "Written alongside the code, not months later."],
];

export function First() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Good unit tests are FIRST"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {FIRST.map(([l, t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-lg border px-3 py-2 text-xs"
            >
              <span className="text-accent w-4 font-mono text-lg leading-none font-bold">{l}</span>
              <span>
                <span className="font-semibold">{t}</span>
                <span className="text-muted block">{b}</span>
              </span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Tim Ottinger and Brett Schuchert summed up good unit tests as FIRST, a list printed in the
        book <em>Clean Code</em> (2008). Some versions say &ldquo;Isolated&rdquo; for the I.
      </p>
      <p>
        The one people break most is Repeatable: a test that reads today&apos;s date or calls a real
        service will one day fail for reasons that have nothing to do with your code.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function UnitCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Unit test or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-unit"
            prompt="By Feathers' rules, is each one a unit test?"
            categories={[
              { id: "unit", label: "Unit test" },
              { id: "other", label: "Something bigger" },
            ]}
            items={[
              {
                id: "pure",
                label: "Checks a GST calculation with fixed numbers",
                category: "unit",
                why: "Pure logic, in memory.",
              },
              {
                id: "db",
                label: "Saves a customer to a local PostgreSQL",
                category: "other",
                why: "Talks to a database: an integration test.",
              },
              {
                id: "file",
                label: "Reads prices from a CSV file on disk",
                category: "other",
                why: "Touches the file system.",
              },
              {
                id: "fake",
                label: "Uses an in-memory list in place of the database",
                category: "unit",
                why: "A fast stand-in keeps it a unit test.",
              },
              {
                id: "env",
                label: "Only passes if an environment variable is set",
                category: "other",
                why: "Needs special setup to run.",
              },
            ]}
            explanation="Unit tests stay in memory: no database, network, disk or special setup. That's what makes them fast and repeatable."
          />
        </div>
      }
    >
      <p>Sort each test.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["One piece, on its own", "Fast, in memory, one suspect when it fails."],
        ["Check behaviour", "Results, not internal steps."],
        ["Break it on purpose", "A test that never fails isn't checking much."],
        ["Solitary or sociable", "Both fine; stay out of databases and networks."],
        ["FIRST", "Fast, Independent, Repeatable, Self-validating, Timely."],
      ]}
    >
      <p>Next: when your code depends on something slow or unpredictable, swap in a stand-in.</p>
    </WrapStep>
  );
}

"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FAMILIES, MODES, NODES, work, type Mode } from "./model";
import type { ReactState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Notice() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Three ways to update a notice board"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Reprint and compare",
              "Print the whole board again, hold it against the old one, and swap only the sheets that differ.",
            ],
            [
              "Subscriptions",
              "Each notice has a list of who cares about it. When it changes, only they're told.",
            ],
            [
              "Pre-planned",
              "Before opening day, plan exactly which pin to move for each possible change.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
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
        When one notice on a big board changes, you could reprint everything and compare, keep a
        list of who depends on each notice, or plan the exact change in advance.
      </p>
      <p>
        Frameworks face the same problem every time state changes. Their answer, called{" "}
        <Term id="reactivity">reactivity</Term>, comes in three families: the{" "}
        <Term id="virtual-dom">virtual DOM</Term>, <Term id="signals">signals</Term>, and compilers.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Counter() {
  const [s, set] = useSceneState<ReactState>();
  const w = work(s.mode, s.compiler);
  const m = MODES.find((x) => x.id === s.mode)!;
  const key = `${s.mode}-${s.compiler}`;
  const click = () =>
    set({
      count: s.count + 1,
      clicks: s.clicks + 1,
      tried: s.tried.includes(key) ? s.tried : [...s.tried, key],
    });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Click +1: how much work happens?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Mode>
            size="sm"
            value={s.mode}
            onChange={(mode) => set({ mode })}
            options={MODES.map((x) => [x.id, x.label])}
          />
          {s.mode === "diff" && (
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.compiler}
                onChange={() => set({ compiler: !s.compiler })}
              />
              React Compiler on (automatic memoisation)
            </label>
          )}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={click}
              className="border-line-strong rounded-full border px-4 py-1 text-sm"
            >
              +1
            </button>
            <span className="font-mono text-lg">{s.count}</span>
          </div>
          <div className="grid grid-cols-7 gap-1 sm:grid-cols-10">
            {NODES.map((n) => {
              const ran = s.clicks > 0 && w.reran.includes(n.id);
              const upd = s.clicks > 0 && w.updated.includes(n.id);
              return (
                <motion.div
                  key={`${n.id}-${s.clicks}-${key}`}
                  initial={ran || upd ? { scale: 1.15 } : false}
                  animate={{ scale: 1 }}
                  title={n.label}
                  className={cn(
                    "flex h-7 items-center justify-center rounded border text-[8px]",
                    upd
                      ? "border-good bg-good/30"
                      : ran
                        ? "border-viz-compute bg-viz-compute/25"
                        : "border-line bg-surface text-subtle",
                  )}
                >
                  {n.label}
                </motion.div>
              );
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              ["Components run again", w.reran.length],
              ["Nodes compared", w.compared],
              ["DOM changes", w.writes],
            ].map(([t, v]) => (
              <div
                key={t as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{t}</p>
                <p className="font-mono font-semibold">{s.clicks ? v : "–"}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-xs">
            <span className="text-fg font-medium">{m.who}: </span>
            {m.how}
          </p>
        </div>
      }
    >
      <p>
        This page has 28 components; one shows a count. Click +1 in each mode and watch which
        components run again (orange) and what actually changes on screen (green).
      </p>
      <p>
        Every approach ends with the same single change to the page. They differ in how much work it
        takes to find it. The numbers illustrate each approach; they aren&apos;t benchmarks.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Families ------------------------------------------------------------------------------------- */

export function Families() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who uses which approach (October 2026)"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FAMILIES.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{f.name}</p>
              <p className="text-muted">{f.frameworks}</p>
              <p className="mt-0.5">{f.note}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        React&apos;s own docs don&apos;t use the phrase &ldquo;virtual DOM&rdquo;, but it&apos;s the
        common name for what React does: build a description of the UI, compare it with the last
        one, and apply the difference.
      </p>
      <p>
        The lines are blurring. Vue is rebuilding its reactivity on signals, and Svelte 5 uses
        signals under its compiler.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Does it matter? ------------------------------------------------------------------------------ */

export function Matters() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Does the approach matter?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Usually, not much",
              "For most apps all three are fast enough; slow pages are more often caused by too much JavaScript or data.",
            ],
            [
              "Sometimes, yes",
              "Huge lists and frequent updates favour fine-grained updates or memoisation.",
            ],
            [
              "Signals in JavaScript itself?",
              "A proposal to add signals to the language reached Stage 1 at TC39 in April 2024 and hasn't advanced since.",
            ],
            ["An old idea", "Knockout had observables in 2010; today's signals are a refinement."],
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
        Choose a framework for your team, ecosystem and hiring, not for a benchmark. Understanding
        how it updates the screen helps you avoid its specific slow paths.
      </p>
      <p>
        In React, that means keeping state close to where it&apos;s used, or letting the compiler
        help.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ReactCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Name the approach"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="frontend-reactivity"
            prompt="Which family does each description belong to?"
            categories={[
              { id: "diff", label: "Re-render and diff" },
              { id: "signals", label: "Signals" },
              { id: "compile", label: "Compile-time" },
            ]}
            items={[
              {
                id: "rerun",
                label: "Component functions run again and the output is compared with last time",
                category: "diff",
                why: "React's model.",
              },
              {
                id: "sub",
                label: "Reading a value subscribes the code that read it",
                category: "signals",
                why: "Dependency tracking.",
              },
              {
                id: "svelte",
                label: "The build turns components into code that updates the DOM directly",
                category: "compile",
                why: "Svelte's approach.",
              },
              {
                id: "once",
                label: "Components run once; later updates skip them",
                category: "signals",
                why: "Solid's model.",
              },
              {
                id: "vapor",
                label: "Vue's opt-in Vapor mode, which drops the virtual DOM runtime",
                category: "compile",
                why: "Compiled output, no diffing.",
              },
            ]}
            explanation="Diffing re-runs and compares; signals track who read what; compilers generate the update code ahead of time."
          />
        </div>
      }
    >
      <p>Sort each description.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Same result", "One change to the page."],
        ["Diffing", "Re-run, compare, patch."],
        ["Signals", "Update only what read the value."],
        ["Compilers", "Plan updates at build time."],
        ["Pick for the team", "Then learn its slow paths."],
      ]}
    >
      <p>Next: forms, where users do their real work.</p>
    </WrapStep>
  );
}

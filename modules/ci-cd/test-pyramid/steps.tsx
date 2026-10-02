"use client";

import { motion } from "motion/react";
import { Bell, Car, Cog, Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  BUGS,
  LAYERS,
  PRESETS,
  RUNNERS,
  evaluate,
  falseReds,
  type BugKind,
  type Layer,
} from "./model";
import type { TestState } from "./state";

/* 1 ─ Bench, rig, road ---------------------------------------------------------------------------- */

const KINDS = [
  {
    icon: Wrench,
    t: "On the bench",
    k: "unit test",
    id: "unit-test" as const,
    d: "Check one part alone: does the brake pad grip? In code, one function or class, in memory, in a few milliseconds.",
  },
  {
    icon: Cog,
    t: "On the rig",
    k: "integration test",
    id: "integration-test" as const,
    d: "Check parts together: does the pedal actually move the pad? In code, your service with a real database or another service.",
  },
  {
    icon: Car,
    t: "On the road",
    k: "end-to-end test",
    id: "e2e-test" as const,
    d: "Drive the whole car: can a customer sign in, fill a cart and pay? Slow and fiddly, but the only test of the full journey.",
  },
];

export function BenchRigRoad() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="On the bench, on the rig, on the road"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {KINDS.map(({ icon: Icon, t, k, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <Icon className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
          <div className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3 sm:col-span-3">
            <Bell className="text-bad mt-0.5 size-5 shrink-0" />
            <p className="text-muted text-sm">
              And one warning: a smoke alarm that goes off when there&apos;s no fire soon gets
              ignored, or unplugged. Tests that fail at random do the same to a team.
            </p>
          </div>
        </div>
      }
    >
      <p>
        A car maker doesn&apos;t only test-drive finished cars. Most checks happen on single parts,
        some on assembled systems, and only a few on the road, because road tests are slow and a
        failure there doesn&apos;t say which part broke.
      </p>
      <p>
        Software tests come in the same three sizes: <Term id="unit-test">unit</Term>,{" "}
        <Term id="integration-test">integration</Term> and <Term id="e2e-test">end-to-end</Term>. A
        pipeline runs them on every change, so a mistake is caught minutes after it&apos;s made.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Shape the suite ⭐ --------------------------------------------------------------------------- */

const KIND_LABEL: Record<BugKind, string> = {
  logic: "Logic",
  wiring: "Wiring",
  journey: "Journey",
};

export function ShapeSuite() {
  const [s, set] = useSceneState<TestState>();
  const r = evaluate(s.suite);
  const widest = Math.max(
    ...(Object.keys(LAYERS) as Layer[]).map((l) => s.suite[l] / LAYERS[l].max),
  );
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Shape the suite"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => set({ suite: p.suite })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="grid items-center gap-3 sm:grid-cols-[1fr_10rem]">
            <div className="flex flex-col gap-2">
              {(["e2e", "integration", "unit"] as Layer[]).map((l) => (
                <label
                  key={l}
                  className="grid grid-cols-[6.5rem_1fr_3rem] items-center gap-2 text-xs"
                >
                  <span>{LAYERS[l].name}</span>
                  <input
                    type="range"
                    min={0}
                    max={LAYERS[l].max}
                    step={LAYERS[l].step}
                    value={s.suite[l]}
                    onChange={(e) => set({ suite: { ...s.suite, [l]: Number(e.target.value) } })}
                    className="accent-accent"
                    aria-label={`${LAYERS[l].name} tests`}
                  />
                  <span className="text-right font-mono">{s.suite[l]}</span>
                </label>
              ))}
            </div>
            {/* The suite's shape: each bar's width is its share of that layer's maximum. */}
            <div className="flex flex-col items-center gap-1" aria-hidden>
              {(["e2e", "integration", "unit"] as Layer[]).map((l) => (
                <motion.div
                  key={l}
                  animate={{
                    width: `${widest ? Math.max(4, (s.suite[l] / LAYERS[l].max / widest) * 100) : 4}%`,
                  }}
                  className={cn(
                    "h-6 rounded",
                    l === "unit"
                      ? "bg-viz-add/50"
                      : l === "integration"
                        ? "bg-viz-data/50"
                        : "bg-viz-compute/50",
                  )}
                />
              ))}
              <span className="text-muted font-mono text-[9px]">shape (share of each maximum)</span>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Bugs caught, of 20</p>
              <p className="font-mono text-lg font-semibold">{r.totalCaught.toFixed(0)}</p>
              <div className="mt-1 flex flex-col gap-0.5">
                {(Object.keys(BUGS) as BugKind[]).map((k) => (
                  <div key={k} className="flex justify-between font-mono text-[10px]">
                    <span className="text-muted">{KIND_LABEL[k]}</span>
                    <span>
                      {r.caught[k].toFixed(0)} / {BUGS[k].count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Time per run ({RUNNERS} runners)</p>
              <p className={cn("font-mono text-lg font-semibold", r.minutes > 10 && "text-bad")}>
                {r.minutes < 1 ? `${Math.round(r.minutes * 60)} s` : `${r.minutes.toFixed(1)} min`}
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Runs that go red with no bug</p>
              <p className={cn("font-mono text-lg font-semibold", r.falseRed > 0.25 && "text-bad")}>
                {(r.falseRed * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative model: 20 bugs ({BUGS.logic.count} logic, {BUGS.wiring.count} wiring,{" "}
            {BUGS.journey.count} journey); a unit test takes 0.05 s, an integration test 1.5 s and
            an end-to-end test 30 s; end-to-end tests are the flakiest.
          </p>
        </div>
      }
    >
      <p>
        You have a checkout service and a month of changes ahead, carrying 20 bugs. Choose how many
        tests of each kind to keep, or start from a preset.
      </p>
      <p>
        Unit tests are fast and steady but can&apos;t see wiring or journey bugs. End-to-end tests
        see everything, slowly, and fail at random more often. Mike Cohn drew the balance as the{" "}
        <Term id="test-pyramid">test pyramid</Term> in 2009: many unit tests, fewer integration
        tests, a handful end to end. <em>Software Engineering at Google</em> suggests about 80%
        unit, 15% integration and 5% end-to-end.
      </p>
      <p>
        Try the ice-cream cone, the pyramid upside down. It catches the journey bugs, but every run
        takes a quarter of an hour and goes red for no reason more than a third of the time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ When tests lie ------------------------------------------------------------------------------ */

export function WhenTestsLie() {
  const [s, set] = useSceneState<TestState>();
  const plain = falseReds(s.flaky, 0.01, 50, false);
  const retried = falseReds(s.flaky, 0.01, 50, true);
  const r = s.retry ? retried : plain;
  return (
    <StepLayout
      eyebrow="Explore"
      title="When tests lie"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <label className="grid grid-cols-[9rem_1fr_2rem] items-center gap-2 text-xs">
            <span>Flaky tests in the suite</span>
            <input
              type="range"
              min={0}
              max={40}
              value={s.flaky}
              onChange={(e) => set({ flaky: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Flaky tests"
            />
            <span className="text-right font-mono">{s.flaky}</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.retry}
              onChange={(e) => set({ retry: e.target.checked })}
              className="accent-accent"
            />
            Retry a failed test once before calling the build red
          </label>
          <div className="grid grid-cols-10 gap-1" aria-hidden>
            {Array.from({ length: 50 }, (_, i) => {
              const red = i < Math.round(r.perDay);
              return (
                <motion.div
                  key={i}
                  layout
                  className={cn(
                    "h-5 rounded-sm border",
                    red ? "border-bad/60 bg-bad/25" : "border-good/40 bg-good/15",
                  )}
                />
              );
            })}
          </div>
          <p className="text-muted font-mono text-[10px]">
            50 pipeline runs a day · {r.perDay.toFixed(1)} go red with nothing wrong (
            {(r.pRed * 100).toFixed(1)}% of runs)
          </p>
          {s.retry && (
            <p className="border-viz-compute/50 bg-viz-compute/10 rounded-lg border px-3 py-2 text-xs">
              Retries hide the noise, but also hide real bugs that only show up sometimes, such as a
              race between two requests. Retry, then log every retried test and fix or quarantine
              it.
            </p>
          )}
        </div>
      }
    >
      <p>
        A <Term id="flaky-test">flaky test</Term> passes and fails on the same code. Each one may
        fail only 1% of the time, but a suite has many, and the pipeline runs all day.
      </p>
      <p>
        At Google in 2016, &ldquo;about 1.5% of all test runs&rdquo; reported a flaky result and
        &ldquo;almost 16%&rdquo; of tests had some flakiness. Martin Fowler calls such tests
        &ldquo;useless&rdquo; and &ldquo;a virulent infection&rdquo;: once people expect random
        reds, they stop reading them.
      </p>
      <p>
        Many teams <Term id="test-quarantine">quarantine</Term> a flaky test: it still runs, but
        can&apos;t fail the build, and it has an owner and a date to be fixed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which test catches it? ---------------------------------------------------------------------- */

export function WhichTest() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which test catches it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-test"
            prompt="Which is the cheapest kind of test that would catch each bug?"
            categories={[
              { id: "unit", label: "Unit" },
              { id: "integration", label: "Integration" },
              { id: "e2e", label: "End-to-end" },
            ]}
            items={[
              {
                id: "discount",
                label: "A 10% discount is applied twice when the cart has three items",
                category: "unit",
                why: "Pure logic in one function: a unit test with a three-item cart finds it in milliseconds.",
              },
              {
                id: "round",
                label: "Currency conversion rounds ₹99.995 the wrong way",
                category: "unit",
                why: "Again one function and a few inputs; no database or browser needed.",
              },
              {
                id: "column",
                label: "A query still uses a column that was renamed last week",
                category: "integration",
                why: "Only running against a real database schema shows it.",
              },
              {
                id: "contract",
                label: "The payments service now sends 'total' but checkout still reads 'amount'",
                category: "integration",
                why: "Two parts disagree: an integration or contract test between them catches it.",
              },
              {
                id: "banner",
                label: "On phones, the cookie banner covers the Pay button",
                category: "e2e",
                why: "Only a real browser rendering the real page can see it.",
              },
              {
                id: "redirect",
                label: "After signing in, users land back on an empty cart",
                category: "e2e",
                why: "It's a journey across pages and services, so only an end-to-end test sees it.",
              },
            ]}
            explanation="Push each check as low as it can go: the lower the test, the faster it runs and the more exactly it points at the cause. Keep end-to-end tests for what only a full journey can show."
          />
        </div>
      }
    >
      <p>Some bugs only a full journey reveals; most don&apos;t need one.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Mostly small tests", "Fast, steady and precise about what broke."],
  ["A few journeys", "End-to-end tests for what only the whole system shows."],
  ["Flakiness is a bug", "Fix it or quarantine it with an owner; never just get used to red."],
  ["Coverage is a hint", "It shows code that ran, not code that was checked."],
  ["Test on every change", "Minutes after the mistake, while it's still fresh."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        <Term id="code-coverage">Code coverage</Term> tells you which lines your tests ran. Google
        calls 60% acceptable, 75% commendable and 90% exemplary, but a test can run a line without
        checking its result. Turn the number into a target and people write tests to hit it.
      </p>
      <p>
        Next: when the suite grows, how to keep the pipeline fast enough that people still wait for
        it.
      </p>
    </StepLayout>
  );
}

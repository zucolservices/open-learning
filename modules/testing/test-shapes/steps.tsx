"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BUG_KINDS, MAX, PRESETS, fmtTime, simulate, type Mix } from "./model";
import type { ShapesState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Inspection() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Tasting, plating, and the mystery diner"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Taste each ingredient",
              "Seconds each. Is the sauce salty enough?",
              "Unit tests",
              "w-full",
            ],
            [
              "Check a finished dish",
              "A few minutes. Do the parts work together?",
              "Integration tests",
              "w-3/4",
            ],
            [
              "A mystery diner's evening",
              "Hours. Booking, service, food, bill.",
              "End-to-end tests",
              "w-1/2",
            ],
          ]
            .map(([t, b, k, w], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 * (2 - i) }}
                className={cn(
                  "border-line bg-surface mx-auto rounded-lg border px-3 py-2 text-xs",
                  w,
                )}
              >
                <p className="font-semibold">{t}</p>
                <p className="text-muted">{b}</p>
                <p className="text-accent mt-0.5 text-[10px] font-medium">{k}</p>
              </motion.div>
            ))
            .reverse()}
        </div>
      }
    >
      <p>
        A restaurant checks quality at several sizes. A chef tastes ingredients constantly, checks
        each plate before it leaves, and now and then a mystery diner tries the whole evening.
      </p>
      <p>
        Tests work the same way. <Term id="unit-test">Unit tests</Term> check small pieces in
        milliseconds; <Term id="integration-test">integration tests</Term> check pieces together;{" "}
        <Term id="end-to-end-test">end-to-end tests</Term> walk through the whole app like a user.
        The question is how many of each.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Mix a suite ⭐ -------------------------------------------------------------------------------- */

const LEVELS: { key: keyof Mix; label: string; cls: string }[] = [
  { key: "e2e", label: "End-to-end", cls: "bg-viz-meta/60" },
  { key: "integration", label: "Integration", cls: "bg-viz-compute/60" },
  { key: "unit", label: "Unit", cls: "bg-viz-data/60" },
];

export function MixSuite() {
  const [s, set] = useSceneState<ShapesState>();
  const r = simulate(s.mix);
  const widest = Math.max(1, s.mix.unit, s.mix.integration * 2, s.mix.e2e * 4);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Mix a test suite"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => set({ mix: p.mix })}
                className="border-line-strong hover:border-accent rounded-full border px-3 py-0.5 text-xs"
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
            <div className="flex flex-col justify-center gap-1">
              {LEVELS.map((l) => {
                const weight = l.key === "unit" ? 1 : l.key === "integration" ? 2 : 4;
                return (
                  <motion.div
                    key={l.key}
                    animate={{ width: `${Math.max(4, (s.mix[l.key] * weight * 100) / widest)}%` }}
                    className={cn("mx-auto h-7 rounded", l.cls)}
                  />
                );
              })}
              <p className="text-muted mt-1 text-center text-[10px]">
                Width shows effort: big tests weigh more.
              </p>
            </div>
            <div className="grid gap-2">
              {LEVELS.map((l) => (
                <label key={l.key} className="text-xs">
                  {l.label}: <span className="font-mono">{s.mix[l.key]}</span>
                  <input
                    type="range"
                    min={0}
                    max={MAX[l.key]}
                    value={s.mix[l.key]}
                    onChange={(e) => set({ mix: { ...s.mix, [l.key]: Number(e.target.value) } })}
                    className="accent-accent w-full"
                    aria-label={`${l.label} tests`}
                  />
                </label>
              ))}
            </div>
          </div>
          <p className="text-sm font-semibold">{r.shape}</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Time for one run</p>
              <p className="font-mono text-base">{fmtTime(r.seconds)}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Runs that fail for no real reason</p>
              <p className={cn("font-mono text-base", r.flakyRun > 0.2 && "text-bad")}>
                {Math.round(r.flakyRun * 100)}%
              </p>
            </div>
          </div>
          <div className="grid gap-1">
            {BUG_KINDS.map((b) => (
              <div key={b.id} className="flex items-center gap-2 text-xs">
                <span className="w-44 shrink-0">{b.label}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: b.count }, (_, k) => (
                    <span
                      key={k}
                      className={cn(
                        "size-2.5 rounded-sm",
                        k < r.caught[b.id] ? "bg-good" : "bg-bad/40",
                      )}
                    />
                  ))}
                </span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            All timings, flake and catch rates are illustrative.
          </p>
        </div>
      }
    >
      <p>
        Try the presets, then drag the sliders. Watch three things: how long the suite takes, how
        often it fails for no reason, and which kinds of bug it catches (green squares).
      </p>
      <p>
        The &ldquo;ice-cream cone&rdquo; is a common starting point: mostly slow browser tests.
        Moving effort to smaller tests makes the suite faster and steadier, but you still need a few
        big ones for the journeys.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Shapes compared ------------------------------------------------------------------------------- */

const SHAPES: { name: string; who: string; idea: string; bars: number[] }[] = [
  {
    name: "Pyramid",
    who: "Mike Cohn, sketched around 2004, published 2009",
    idea: "Lots of unit tests, fewer service tests, very few UI tests.",
    bars: [30, 60, 100],
  },
  {
    name: "Trophy",
    who: "Kent C. Dodds, 2018, for JavaScript UI apps",
    idea: "Static checks at the base, and mostly integration tests.",
    bars: [25, 100, 50, 40],
  },
  {
    name: "Honeycomb",
    who: "Spotify, 2018, for microservices",
    idea: "Mostly tests of a service through its real boundaries.",
    bars: [30, 100, 30],
  },
  {
    name: "Ice-cream cone",
    who: "Alister Scott, 2012, an anti-pattern",
    idea: "Mostly manual and UI tests: slow, flaky, expensive.",
    bars: [100, 60, 30, 15],
  },
];

export function Shapes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Pyramid, trophy, honeycomb"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {SHAPES.map((sh, i) => (
            <motion.div
              key={sh.name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <div className="mb-1.5 flex flex-col items-center gap-0.5">
                {sh.bars.map((w, k) => (
                  <span
                    key={k}
                    className={cn("h-2 rounded-sm", i === 3 ? "bg-bad/50" : "bg-accent/50")}
                    style={{ width: `${w * 0.7}%` }}
                  />
                ))}
              </div>
              <p className="font-semibold">{sh.name}</p>
              <p className="text-muted text-[10px]">{sh.who}</p>
              <p className="mt-0.5">{sh.idea}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        People argue about shapes, but they agree on the trade-off: small tests are fast and point
        straight at the cause; big tests are realistic but slow and fragile.
      </p>
      <p>
        The shapes come from different settings. Where integration tests are cheap (modern front
        ends, services with throwaway databases) a trophy or honeycomb makes sense. Google&apos;s
        2015 rule of thumb was about 70% unit, 20% integration, 10% end-to-end.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Size versus scope ----------------------------------------------------------------------------- */

export function SizeScope() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Size is not the same as scope"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-line overflow-hidden rounded-xl border text-xs">
            <div className="bg-surface-2 text-muted grid grid-cols-[6rem_1fr_1fr] gap-2 px-3 py-1.5 font-medium">
              <span />
              <span>Narrow scope</span>
              <span>Wide scope</span>
            </div>
            {[
              [
                "Small",
                "A price calculator test, all in memory",
                "Rare: a whole app faked in one process",
              ],
              [
                "Medium",
                "One query tested against a real local database",
                "Several services on one machine",
              ],
              ["Large", "Rare", "A journey through deployed services in a browser"],
            ].map(([k, a, b]) => (
              <div
                key={k}
                className="border-line grid grid-cols-[6rem_1fr_1fr] gap-2 border-t px-3 py-1.5"
              >
                <span className="text-muted">{k}</span>
                <span>{a}</span>
                <span>{b}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-[11px]">
            Small: one process, no network or disk. Medium: one machine. Large: anything.
          </p>
        </div>
      }
    >
      <p>
        &ldquo;Unit&rdquo; and &ldquo;integration&rdquo; mean different things to different people.
        Google separates two ideas: <strong>size</strong> (what resources a test may use) and{" "}
        <strong>scope</strong> (how much code it exercises).
      </p>
      <p>
        That clears up most arguments. A test that checks one query against a real database is
        narrow in scope but medium in size: slower than a pure function test, yet still precise.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function ShapesCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which level?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-shapes"
            prompt="Which kind of test fits each check best?"
            categories={[
              { id: "unit", label: "Unit" },
              { id: "integration", label: "Integration" },
              { id: "e2e", label: "End-to-end" },
            ]}
            items={[
              {
                id: "tax",
                label: "GST is calculated correctly for each rate",
                category: "unit",
                why: "Pure logic: fast, many cases.",
              },
              {
                id: "repo",
                label: "Saving an order really writes it to the database",
                category: "integration",
                why: "Your code plus a real database.",
              },
              {
                id: "checkout",
                label: "A customer can sign in, order and pay",
                category: "e2e",
                why: "A whole journey through the real app.",
              },
              {
                id: "parse",
                label: "A date string is parsed into day, month and year",
                category: "unit",
                why: "One function, no dependencies.",
              },
              {
                id: "queue",
                label: "An order event reaches the kitchen's queue",
                category: "integration",
                why: "Two pieces talking through real infrastructure.",
              },
            ]}
            explanation="Push each check to the smallest test that can catch it. Keep end-to-end tests for the journeys only they can check."
          />
        </div>
      }
    >
      <p>Sort each check.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Tests come in sizes", "Unit, integration, end-to-end."],
        ["Small: fast and precise", "Big: realistic but slow and flaky."],
        ["Smallest test that can catch it", "Push each check down."],
        ["Shape follows context", "Pyramid, trophy or honeycomb, by setting."],
        ["Avoid the cone", "A top-heavy suite gets slow and ignored."],
      ]}
    >
      <p>That&apos;s the foundations. Next chapter: unit testing in depth.</p>
    </WrapStep>
  );
}

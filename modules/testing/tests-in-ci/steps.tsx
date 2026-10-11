"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OPTS, schedule, type Opt } from "./model";
import type { CiState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Taster() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Feedback while you still remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["5 minutes", "“Oh, that line. Fixed.”", "good"],
            [
              "40 minutes",
              "You've started something else. Back to the old change, re-read it, fix.",
              "mid",
            ],
            ["Tomorrow", "Three more changes on top. Which one broke it?", "bad"],
          ].map(([t, b, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                k === "good"
                  ? "border-good/40 bg-good/10"
                  : k === "bad"
                    ? "border-bad/40 bg-bad/10"
                    : "border-line bg-surface",
              )}
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A chef who tastes the sauce right after seasoning it can fix it with a pinch. Find out at
        the table and the dish is already served.
      </p>
      <p>
        <Term id="continuous-integration">Continuous integration</Term> runs your tests
        automatically on every change. It&apos;s only useful if the answer arrives while you still
        remember what you changed, so keeping the pipeline fast matters as much as having it.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Speed up the pipeline ⭐ ---------------------------------------------------------------------- */

const COLOR: Record<string, string> = {
  lint: "bg-viz-idle/70",
  unit: "bg-viz-data/70",
  build: "bg-viz-compute/70",
  integration: "bg-viz-meta/70",
  e2e: "bg-accent/70",
};

export function SpeedUp() {
  const [s, set] = useSceneState<CiState>();
  const r = schedule(s.opts);
  const lanes = Math.max(...r.bars.map((b) => b.lane)) + 1;
  const scale = 41;
  const toggle = (o: Opt) =>
    set({ opts: s.opts.includes(o) ? s.opts.filter((x) => x !== o) : [...s.opts, o] });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Cut a 40-minute pipeline down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-1">
            {OPTS.map((o) => (
              <label
                key={o.id}
                className={cn(
                  "flex items-start gap-1.5 rounded-lg border px-2.5 py-1 text-xs",
                  s.opts.includes(o.id) ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <input
                  type="checkbox"
                  checked={s.opts.includes(o.id)}
                  onChange={() => toggle(o.id)}
                  className="accent-accent mt-0.5"
                />
                <span>
                  {o.label}
                  <span className="text-muted block text-[10px]">{o.detail}</span>
                  {o.risk && s.opts.includes(o.id) && (
                    <span className="text-bad block text-[10px]">{o.risk}</span>
                  )}
                </span>
              </label>
            ))}
          </div>
          <div
            className="border-line bg-surface relative rounded-lg border p-2"
            style={{ height: lanes * 16 + 22 }}
          >
            {r.bars.map((b, i) => (
              <motion.div
                key={`${b.stage}-${b.lane}-${i}`}
                layout
                className={cn("absolute h-3 rounded-sm", COLOR[b.stage])}
                style={{
                  top: 6 + b.lane * 16,
                  left: `${(b.start / scale) * 100}%`,
                  width: `${((b.end - b.start) / scale) * 100}%`,
                }}
                title={`${b.stage}: ${(b.end - b.start).toFixed(1)} min`}
              />
            ))}
            <div className="text-muted absolute right-2 bottom-1 left-2 flex justify-between font-mono text-[9px]">
              {[0, 10, 20, 30, 40].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px]">
            {Object.keys(COLOR).map((k) => (
              <span key={k} className="flex items-center gap-1">
                <span className={cn("size-2.5 rounded-sm", COLOR[k])} />{" "}
                {k === "e2e" ? "end-to-end" : k}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              ["Wait for the result", `${Math.round(r.wall)} min`],
              ["Told a unit test failed", `${Math.round(r.firstUnitFail)} min`],
              ["Machine minutes (cost)", `${Math.round(r.machineMin)}`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-base">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">Stage times are illustrative.</p>
        </div>
      }
    >
      <p>
        Every change to a made-up café&apos;s app waits about 40 minutes for its tests. Switch on
        the usual speed-ups one at a time and watch the chart, the wait, and the cost in machine
        time.
      </p>
      <p>
        Most speed-ups are free wins. Splitting across machines buys time with money. Running only
        affected tests trades a little confidence for a lot of speed, so teams still run everything
        after merging, or nightly.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Keep main green ------------------------------------------------------------------------------- */

export function MainGreen() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Keeping the main branch green"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            ["Test every pull request", "Nobody merges until the checks pass."],
            [
              "Use a merge queue",
              "Each change is tested on top of the others waiting to merge, so two green changes can't combine into red. GitHub's merge queue (2023) and GitLab's merge trains do this.",
            ],
            [
              "Fix or revert, fast",
              "A red main branch blocks everyone. The first job is to make it green again.",
            ],
            ["Quarantine flaky tests", "With an owner, so they don't teach people to ignore red."],
            [
              "Run the full suite regularly",
              "After merging, or nightly, to catch what selective runs skip.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Martin Fowler&apos;s description of continuous integration (first written in 2000 and
        rewritten in 2024) centres on one idea: everyone integrates often into a main branch that
        always works.
      </p>
      <p>The CI/CD track covers pipelines in depth; here the focus is the tests inside them.</p>
    </StepLayout>
  );
}

/* 4 ─ Evidence and tools ---------------------------------------------------------------------------- */

export function Evidence() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Why it pays, and the tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "DORA research",
              "Years of surveys link test automation with better delivery performance. It's correlation, and it matters who owns the tests: developers, not a separate team.",
            ],
            [
              "Selecting tests",
              "A 2019 Facebook paper showed predictive selection could halve testing cost while still catching over 99.9% of faulty changes.",
            ],
            [
              "Splitting suites",
              "Playwright and Jest have built-in --shard; pytest-xdist runs tests in parallel on one machine, and plugins such as pytest-split divide them across CI machines.",
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
        DORA, the research programme behind the book <em>Accelerate</em>, now tracks five delivery
        metrics, including how often changes have to be reworked. Fast, reliable tests support every
        one of them.
      </p>
      <p>The tools change; the goal doesn&apos;t: fast, trustworthy feedback on every change.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CiCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Free win or trade-off?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="testing-ci"
            prompt="Does each change speed up CI for free, or trade something away?"
            categories={[
              { id: "free", label: "Free win" },
              { id: "trade", label: "Trade-off" },
            ]}
            items={[
              {
                id: "order",
                label: "Run fast unit tests before slow ones",
                category: "free",
                why: "Same tests, earlier answers.",
              },
              {
                id: "cache",
                label: "Cache downloaded dependencies",
                category: "free",
                why: "Nothing lost.",
              },
              {
                id: "shard",
                label: "Spread end-to-end tests over 4 machines",
                category: "trade",
                why: "Faster, but costs more machine time.",
              },
              {
                id: "select",
                label: "Run only tests related to the change",
                category: "trade",
                why: "Small risk of missing a failure.",
              },
              {
                id: "skip",
                label: "Skip end-to-end tests on Fridays",
                category: "trade",
                why: "A real loss of confidence.",
              },
            ]}
            explanation="Reordering, caching and running independent work in parallel are close to free. Sharding costs money; selecting tests costs a little confidence, so back it with full runs."
          />
        </div>
      }
    >
      <p>Sort each change.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Every change, every time", "Tests run automatically on each pull request."],
        ["Fast feedback is the point", "Minutes, not hours."],
        ["Free wins first", "Order, cache, parallelise."],
        ["Shard and select knowingly", "Money and confidence trade-offs."],
        ["Main stays green", "Merge queues, quick reverts, full runs."],
      ]}
    >
      <p>Next: what a thoughtful person finds that no script will.</p>
    </WrapStep>
  );
}

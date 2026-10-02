"use client";

import { motion } from "motion/react";
import { Coffee, Laptop, Layers } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LEVERS, effective, plan, shardCurve, type Levers } from "./model";
import type { SpeedState } from "./state";

/* 1 ─ While you wait ------------------------------------------------------------------------------ */

const WAITS = [
  {
    icon: Laptop,
    t: "3 minutes",
    d: "You glance at a message and the result is back. You're still thinking about the change, so a failure is a two-minute fix.",
  },
  {
    icon: Coffee,
    t: "10 minutes",
    d: "A coffee. Still fine: the guideline Extreme Programming set decades ago, and the limit DORA's research recommends for test feedback.",
  },
  {
    icon: Layers,
    t: "45 minutes",
    d: "You start something else. When it fails you have to switch back and remember. Soon you push less often and bundle changes together: bigger batches again.",
  },
];

export function WhileYouWait() {
  return (
    <StepLayout
      eyebrow="Why it matters"
      title="While you wait"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-3">
          {WAITS.map(({ icon: Icon, t, d }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * i }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-4 py-4",
                i === 2 ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <Icon className={cn("size-5", i === 2 ? "text-bad" : "text-accent")} />
              <p className="font-mono text-lg font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A spell-checker that underlines mistakes as you type is useful. One that emails you
        corrections the next morning isn&apos;t, even if it&apos;s just as accurate.
      </p>
      <p>
        Martin Fowler: &ldquo;The whole point of Continuous Integration is to provide rapid
        feedback.&rdquo; DORA puts a number on it: developers &ldquo;should be able to get feedback
        from automated tests in less than ten minutes&rdquo;. Google&apos;s research on build
        latency found no magic threshold: every minute saved helps, and a predictable wait helps
        too.
      </p>
    </StepLayout>
  );
}

/* 2 ─ From 45 minutes to under 10 ⭐ -------------------------------------------------------------- */

const SCALE = 45;

export function UnderTen() {
  const [s, set] = useSceneState<SpeedState>();
  const eff = effective(s.levers);
  const p = plan(s.levers);
  const lanes = Math.max(...p.bars.map((b) => b.lane)) + 1;
  const toggle = (id: keyof Levers) => set({ levers: { ...s.levers, [id]: !s.levers[id] } });
  return (
    <StepLayout
      eyebrow="Simulation"
      title="From 45 minutes to under 10"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {LEVERS.map((lv) => {
              const disabled = lv.needs ? !eff[lv.needs] : false;
              return (
                <label
                  key={lv.id}
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    lv.needs && "pl-5",
                    disabled && "opacity-40",
                  )}
                >
                  <input
                    type="checkbox"
                    checked={s.levers[lv.id] && !disabled}
                    disabled={disabled}
                    onChange={() => toggle(lv.id)}
                    className="accent-accent"
                  />
                  {lv.name}
                </label>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <div className="relative" style={{ height: lanes * 16 + 4 }}>
              {[10, 20, 30, 40].map((m) => (
                <div
                  key={m}
                  className={cn(
                    "absolute inset-y-0 border-l",
                    m === 10 ? "border-good/60" : "border-line border-dashed",
                  )}
                  style={{ left: `${(m / SCALE) * 100}%` }}
                />
              ))}
              {p.bars.map((b) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={false}
                  animate={{
                    left: `${(b.start / SCALE) * 100}%`,
                    width: `${((b.setup + b.work) / SCALE) * 100}%`,
                    top: b.lane * 16 + 2,
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute flex h-3.5 overflow-hidden rounded-sm"
                  title={`${b.label}: ${(b.setup + b.work).toFixed(1)} min`}
                >
                  {b.setup > 0 && (
                    <div
                      className="bg-viz-idle/50 h-full"
                      style={{ width: `${(b.setup / (b.setup + b.work)) * 100}%` }}
                    />
                  )}
                  <div className="bg-accent/45 flex h-full flex-1 items-center overflow-hidden px-1">
                    <span className="text-fg truncate font-mono text-[8px] leading-none">
                      {b.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-muted relative mt-1 h-3 font-mono text-[9px]">
              {[0, 10, 20, 30, 40].map((m) => (
                <span
                  key={m}
                  className={cn(
                    "absolute -translate-x-1/2",
                    m === 0 && "translate-x-0",
                    m === 10 && "text-good",
                  )}
                  style={{ left: `${(m / SCALE) * 100}%` }}
                >
                  {m === 10 || m === 40 ? `${m} min` : m}
                </span>
              ))}
            </div>
            <p className="text-muted mt-1 font-mono text-[9px]">
              grey = machine start-up and installs · colour = the job&apos;s own work
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Wall-clock", `${p.minutes.toFixed(1)} min`, p.minutes > 10],
              ["Red after a lint slip", `${p.firstRed.toFixed(1)} min`, false],
              ["Runner minutes paid", `${p.runnerMinutes.toFixed(0)} min`, false],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className="border-line bg-surface rounded-lg border px-2 py-1.5"
              >
                <p className="text-muted text-[10px]">{l}</p>
                <p
                  className={cn(
                    "font-mono text-sm font-semibold",
                    bad ? "text-bad" : (l as string) === "Wall-clock" && "text-good",
                  )}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative minutes. Every separate machine pays 1 minute to start plus the install.
          </p>
        </div>
      }
    >
      <p>
        This pipeline runs everything one after another on one machine: 45 minutes. Switch on the
        levers one at a time and watch the chart.
      </p>
      <p>
        Parallel jobs help most, but each new machine pays its own start-up and install, so caching
        matters more once you&apos;ve split. <Term id="test-sharding">Sharding</Term> by file count
        leaves one shard far longer than the rest; splitting by past timings evens them out.
      </p>
      <p>
        Watch the last number too. Going faster usually means paying for more machine-minutes, not
        fewer, until <Term id="change-detection">change detection</Term> stops you running tests a
        change can&apos;t affect.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Diminishing returns ------------------------------------------------------------------------- */

export function Diminishing() {
  const [s, set] = useSceneState<SpeedState>();
  const curve = shardCurve(16, 2, 16);
  const pick = curve[s.shards - 1];
  const maxPaid = curve[curve.length - 1].paid;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Diminishing returns"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid grid-cols-[7rem_1fr_2rem] items-center gap-2 text-xs">
            <span>Machines</span>
            <input
              type="range"
              min={1}
              max={16}
              value={s.shards}
              onChange={(e) => set({ shards: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Machines"
            />
            <span className="text-right font-mono">{s.shards}</span>
          </label>
          <div className="flex h-40 items-end gap-1">
            {curve.map((c) => (
              <div key={c.n} className="flex h-full flex-1 flex-col items-center justify-end gap-0.5">
                <motion.div
                  animate={{ height: `${(c.wall / 18) * 100}%` }}
                  className={cn(
                    "w-full rounded-t-sm",
                    c.n === s.shards ? "bg-accent" : "bg-accent/30",
                  )}
                />
              </div>
            ))}
          </div>
          <div className="text-muted flex justify-between font-mono text-[9px]">
            <span>1 machine</span>
            <span>16 machines</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Wait for the suite</p>
              <p className="font-mono text-sm font-semibold">{pick.wall.toFixed(1)} min</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-1.5">
              <p className="text-muted text-[10px]">Machine-minutes paid</p>
              <p className="font-mono text-sm font-semibold">{pick.paid} min</p>
              <div className="bg-surface-2 mt-1 h-1.5 rounded-full">
                <div
                  className="bg-viz-compute h-full rounded-full"
                  style={{ width: `${(pick.paid / maxPaid) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: a 16-minute suite; each machine takes 2 minutes to start and install.
          </p>
        </div>
      }
    >
      <p>
        Splitting a 16-minute suite in two nearly halves the wait. Splitting it sixteen ways
        doesn&apos;t make it sixteen times faster: every machine still spends two minutes getting
        ready, and that floor never moves.
      </p>
      <p>
        Meanwhile the bill keeps climbing. Past four or so machines here, you&apos;re buying seconds
        at a high price. The next big win is usually running fewer tests, not more machines.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Where to start ------------------------------------------------------------------------------ */

export function WhereToStart() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Where to start"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="where-to-start"
            prompt="A pipeline takes 30 minutes. One job, the end-to-end suite, runs for 20 of them on a single machine; everything else runs alongside it. What helps most?"
            options={[
              {
                id: "cache",
                label: "Cache dependencies in every job",
                feedback:
                  "Worth doing, but it saves a couple of minutes per job; the 20-minute suite still sets the pace.",
              },
              {
                id: "lint",
                label: "Give the lint job a bigger machine",
                feedback: "Lint isn't on the critical path; making it faster changes nothing.",
              },
              {
                id: "shard",
                label: "Split the end-to-end suite over four machines by past timings",
                correct: true,
                feedback:
                  "The suite is the longest chain, so shortening it shortens the pipeline: roughly 20 minutes becomes 6 or 7.",
              },
              {
                id: "order",
                label: "Run the end-to-end suite first",
                feedback:
                  "Order changes when you learn about failures, not how long the whole run takes.",
              },
            ]}
            explanation="Speed up the critical path, the longest chain of jobs that wait for each other. Anything off that path can get faster without the pipeline finishing any sooner."
          />
        </div>
      }
    >
      <p>
        Find the job that sets the pace, the <Term id="critical-path">critical path</Term>, before
        you buy anything.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Aim for ten minutes", "For the first feedback a developer waits on."],
  ["Fast checks first", "Lint and unit tests fail early and cheaply."],
  ["Parallel, then shard", "Split by timings; mind the start-up cost of every machine."],
  ["Run less", "Skip what a change can't affect; cache what hasn't changed."],
  ["Fix the critical path", "Only the longest chain decides when you're done."],
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
        Real numbers are humbling. In 2021 Shopify cut its main app&apos;s slowest CI runs (the 95th
        percentile) from 45 minutes to 18, and said plainly that it missed its under-ten target. At
        the far end, Meta reported in 2019 that a model choosing which tests to run still caught
        over 95% of individual test failures at half the testing cost.
      </p>
      <p>Next: the rules that decide what may be merged once the checks come back.</p>
    </StepLayout>
  );
}

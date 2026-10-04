"use client";

import { motion } from "motion/react";
import { Check, Moon, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEADLINE_HOURS, PRECEDENTS, PROBLEMS, START_HOURS } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="The slow nightly job"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <Moon className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              An illustrative retailer&apos;s nightly sales job starts at midnight and must finish
              by 6 am, when store managers open their reports. It now takes ten hours.
            </p>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <div className="text-muted flex justify-between font-mono text-[10px]">
              <span>00:00</span>
              <span>06:00 deadline</span>
              <span>10:00</span>
            </div>
            <div className="bg-surface-2 relative mt-1 h-4 overflow-hidden rounded">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.2 }}
                className="bg-bad/70 h-full"
              />
              <div className="bg-fg absolute top-0 h-full w-0.5" style={{ left: "60%" }} />
            </div>
            <p className="text-bad mt-1 text-xs">Four hours late, every night.</p>
          </div>
        </div>
      }
    >
      <p>
        You&apos;ve been handed the job and the Spark UI from last night&apos;s run. Five things are
        wrong. Each one shows up somewhere in the UI, and each matches a module in this track.
      </p>
      <p>
        For each problem, read the evidence and pick a fix. Wrong picks explain themselves; you can
        change your mind as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Find and fix ⭐ ----------------------------------------------------------------------------- */

export function Investigate() {
  const [s, set] = useSceneState<CapState>();
  const picks = s.picks ?? {};
  const fixed = PROBLEMS.filter((p) => p.options.find((o) => o.id === picks[p.id])?.correct);
  const hours = START_HOURS - fixed.reduce((a, p) => a + p.saves, 0);
  const open = PROBLEMS.find((p) => p.id === s.open) ?? PROBLEMS[0];
  const pick = open.options.find((o) => o.id === picks[open.id]);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Find and fix"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-3 py-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-semibold">Runtime</span>
              <span
                className={cn(
                  "font-mono font-semibold",
                  hours <= DEADLINE_HOURS ? "text-good" : "text-bad",
                )}
              >
                {hours.toFixed(1)} h{" "}
                {hours <= DEADLINE_HOURS
                  ? "· on time"
                  : `· ${(hours - DEADLINE_HOURS).toFixed(1)} h late`}
              </span>
            </div>
            <div className="bg-surface-2 relative mt-1 h-3 overflow-hidden rounded">
              <motion.div
                animate={{ width: `${(hours / START_HOURS) * 100}%` }}
                className={cn("h-full", hours <= DEADLINE_HOURS ? "bg-good" : "bg-bad/70")}
              />
              <div
                className="bg-fg absolute top-0 h-full w-0.5"
                style={{ left: `${(DEADLINE_HOURS / START_HOURS) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {PROBLEMS.map((p, i) => {
              const ok = fixed.includes(p);
              return (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={s.open === p.id}
                  onClick={() => set({ open: p.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px]",
                    s.open === p.id ? "border-accent bg-accent-soft" : "border-line",
                    ok && "text-good",
                  )}
                >
                  {ok ? <Check className="size-3" /> : <span className="font-mono">{i + 1}</span>}
                  {p.title}
                </button>
              );
            })}
          </div>
          <motion.div
            key={open.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <p className="text-muted text-[11px]">
              {open.where} · module {open.module}
            </p>
            <div className="border-line bg-surface-2 overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px]">
              {open.evidence.map((l) => (
                <p key={l} className="whitespace-pre">
                  {l}
                </p>
              ))}
            </div>
            <div className="flex flex-col gap-1">
              {open.options.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => set({ picks: { ...picks, [open.id]: o.id } })}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    picks[open.id] === o.id
                      ? o.correct
                        ? "border-good bg-good/10"
                        : "border-bad bg-bad/10"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
            {pick && (
              <motion.p
                key={pick.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn("flex gap-1.5 text-xs", pick.correct ? "text-good" : "text-bad")}
              >
                {pick.correct ? (
                  <Check className="mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="mt-0.5 size-3.5 shrink-0" />
                )}
                <span>
                  {pick.feedback}
                  {pick.correct && ` Saves about ${open.saves} h.`}
                </span>
              </motion.p>
            )}
          </motion.div>
          <p className="text-subtle text-[10px]">Evidence, timings and savings illustrative.</p>
        </div>
      }
    >
      <p>
        Work through the five problems in any order. The evidence is what you&apos;d see in the
        Spark UI: the <strong>SQL / DataFrame</strong> tab&apos;s plans and queries, the Stages
        tab&apos;s task summaries, and the Environment tab&apos;s settings.
      </p>
      <p>
        Fix them all and the job lands inside its window. Notice that adding hardware never appears
        among the right answers: the cheapest work is the work you stop doing.
      </p>
    </StepLayout>
  );
}

/* 3 ─ It happens for real ------------------------------------------------------------------------- */

export function Precedents() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="It happens for real"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PRECEDENTS.map((p, i) => (
            <motion.div
              key={p.who}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[5.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-xs"
            >
              <div>
                <p className="font-semibold">{p.who}</p>
                <p className="text-muted font-mono text-[10px]">{p.when}</p>
              </div>
              <p className="text-muted">{p.what}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The retailer is made up; the problems aren&apos;t. Engineering teams at some of the largest
        Spark users have written publicly about exactly these issues.
      </p>
      <p>
        Their fixes match the track: fewer, larger files; less <Term id="shuffle">shuffle</Term>{" "}
        waiting; adaptive execution for partitions and skew; and not scanning or computing the same
        thing twice.
      </p>
    </StepLayout>
  );
}

/* 4 ─ A diagnosis routine ------------------------------------------------------------------------- */

export function Routine() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="A diagnosis routine"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="spark-routine"
            prompt="Put the steps of diagnosing a slow Spark job in a sensible order."
            items={[
              { id: "slowest", label: "Find the slowest jobs and stages in the Spark UI" },
              { id: "summary", label: "Read that stage's task summary: skew, spill, shuffle size" },
              { id: "plan", label: "Read the query plan: scans, filters, exchanges, join types" },
              { id: "one", label: "Change one thing" },
              { id: "rerun", label: "Re-run and compare with the last run" },
            ]}
            explanation="Measure before changing anything, change one thing at a time, and compare. Otherwise you can't tell which change helped."
          />
        </div>
      }
    >
      <p>Order the routine.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ----------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  [
    "Foundations",
    "Why Spark, the driver and executors, RDDs and DataFrames, laziness, partitions.",
  ],
  ["The engine", "Spark SQL, Catalyst, jobs and stages, the shuffle, joins, AQE, Tungsten."],
  ["Performance", "Skew, memory and spill, caching, files."],
  ["Beyond batch", "Structured Streaming, PySpark and UDFs."],
  ["In production", "Platforms, cost and right-sizing, and this capstone."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
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
        That&apos;s Apache Spark: twenty-one modules from &ldquo;why not just use MapReduce&rdquo;
        to a nightly job that makes its deadline.
      </p>
      <p>
        The habits carry over to any engine: read less, move less across the network, keep tasks
        even and right-sized, don&apos;t compute the same thing twice, and let the plan and the UI
        tell you where the time goes.
      </p>
    </StepLayout>
  );
}

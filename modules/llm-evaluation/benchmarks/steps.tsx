"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BENCHES, LIFESPANS, type Status } from "./model";
import type { BenchState } from "./state";

const CHIP: Record<Status, string> = {
  saturated: "bg-muted/30",
  retired: "bg-bad/25",
  hard: "bg-viz-meta/25",
  useful: "bg-good/25",
};

/* 1 ─ A school report ----------------------------------------------------------------------------- */

export function SchoolReport() {
  const rows: [string, string][] = [
    ["Year 3 spelling test", "100%"],
    ["National maths exam", "88%"],
    ["Olympiad round 1", "41%"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="A school report"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, v], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex justify-between rounded-lg border px-3 py-2 text-sm"
            >
              <span>{t}</span>
              <span className="font-mono">{v}</span>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Which number tells you whether they&apos;d make a good engineer? None of them, directly.
          </p>
        </div>
      }
    >
      <p>
        A school report lists scores from very different exams. 100% on an easy spelling test says
        little; 41% on an olympiad might be brilliant. And none of them is the job you&apos;re
        hiring for.
      </p>
      <p>
        Model announcements come with a table of scores on public{" "}
        <Term id="benchmark">benchmarks</Term>: shared exams every model sits. To read one you need
        to know what each exam tests, how hard it still is, and what it can&apos;t tell you.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Read a benchmark table ⭐ ------------------------------------------------------------------- */

export function ReadTable() {
  const [s, set] = useSceneState<BenchState>();
  const b = BENCHES.find((x) => x.id === s.pick) ?? BENCHES[0];
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="Read a benchmark table"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1fr_16rem]">
          <div className="border-line bg-surface rounded-lg border">
            <p className="text-muted border-line border-b px-3 py-1.5 text-[10px]">
              “MODEL X” LAUNCH POST · FICTIONAL SCORES
            </p>
            {BENCHES.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.pick === x.id}
                onClick={() => set({ pick: x.id })}
                className={cn(
                  "border-line flex w-full items-center justify-between gap-2 border-b px-3 py-1.5 text-left text-xs last:border-b-0",
                  s.pick === x.id && "bg-accent-soft",
                )}
              >
                <span>{x.name}</span>
                <span className="flex items-center gap-2">
                  <span className={cn("rounded-full px-1.5 py-0.5 text-[9px]", CHIP[x.status])}>
                    {x.status}
                  </span>
                  <span className="w-12 text-right font-mono">{x.score}</span>
                </span>
              </button>
            ))}
          </div>
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-accent bg-accent-soft self-start rounded-xl border px-3 py-3 text-xs"
          >
            <p className="text-sm font-semibold">{b.name}</p>
            <p className="mt-1">{b.tests}</p>
            <p className="text-muted mt-2">
              {b.size} items · {b.born}
            </p>
            <p className="mt-2">{b.note}</p>
            <p className="text-muted mt-2 text-[11px]">
              {b.status === "saturated"
                ? "A high score here is expected, not impressive."
                : b.status === "retired"
                  ? "Treat scores on it with suspicion."
                  : b.status === "hard"
                    ? "Low scores are normal; small gains can matter."
                    : "Still separates strong models."}
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Here is a fictional launch table. Click each benchmark to see what it tests, how big it is,
        and whether it still means much.
      </p>
      <p>
        Notice the pattern: the highest numbers sit on the oldest, easiest exams. A benchmark is{" "}
        <Term id="benchmark-saturation">saturated</Term> when top models all score near the ceiling,
        so it no longer separates them.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Benchmarks wear out ------------------------------------------------------------------------- */

export function WearOut() {
  const X = (y: number) => `${((y - 2020) / 7) * 100}%`;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Benchmarks wear out"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LIFESPANS.map((l, i) => (
            <div key={l.name} className="grid grid-cols-[5.5rem_1fr] items-center gap-2 text-xs">
              <span>{l.name}</span>
              <div className="bg-surface-2 relative h-4 rounded">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `calc(${X(l.saturated ?? 2026.8)} - ${X(l.born)})` }}
                  transition={{ delay: 0.1 * i }}
                  className={cn(
                    "absolute top-0 bottom-0 rounded",
                    l.saturated ? "bg-muted/50" : "bg-viz-meta/50",
                  )}
                  style={{ left: X(l.born) }}
                />
              </div>
            </div>
          ))}
          <div className="text-subtle grid grid-cols-[5.5rem_1fr] text-[9px]">
            <span />
            <span className="relative h-3 font-mono">
              {[2020, 2023, 2026].map((y) => (
                <span key={y} className="absolute -translate-x-1/2" style={{ left: X(y) }}>
                  {y}
                </span>
              ))}
            </span>
          </div>
          <p className="text-muted text-[11px]">
            Grey: saturated. Purple: still hard. Approximate dates.
          </p>
          <blockquote className="border-accent border-l-2 pl-3 text-xs italic">
            Tests &ldquo;intended to be challenging for years are saturated in months.&rdquo;
            <span className="text-muted not-italic"> Stanford AI Index, 2026</span>
          </blockquote>
        </div>
      }
    >
      <p>
        Benchmarks have life cycles. A new one is hard; within a few years top models pass it, and a
        harder one replaces it. MMLU gave way to MMLU-Pro; GPQA and Humanity&apos;s Last Exam were
        built to be hard for longer.
      </p>
      <p>
        Some wear out for worse reasons: broken questions (one review judged many GSM8K questions
        invalid) or questions leaking into training data, which the next module covers.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Who made it, who ran it? -------------------------------------------------------------------- */

export function WhoRanIt() {
  const qs: [string, string][] = [
    [
      "Who funds it?",
      "FrontierMath was funded by OpenAI, which owns most of its problems; that was disclosed only later.",
    ],
    [
      "Who ran the test?",
      "OpenAI's headline for o3 on FrontierMath was over 25%; Epoch AI's own later test found about 10%.",
    ],
    ["When?", "Date every number: leaderboards change monthly, and benchmark versions change too."],
    [
      "Does it match your job?",
      "No public benchmark measures how well a model does your particular task.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who made it, who ran it?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {qs.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-0.5">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A score is only as trustworthy as the test and the people who ran it. Vendors usually run
        their own numbers, with their own prompts and settings; independent re-runs often differ.
      </p>
      <p>
        Use public benchmarks to shortlist models, then decide with your own eval on your own cases.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What can a benchmark tell you? -------------------------------------------------------------- */

export function CanCant() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What can a benchmark tell you?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="can-cant"
            prompt="Can a public benchmark score tell you this?"
            categories={[
              { id: "can", label: "Roughly, yes" },
              { id: "cant", label: "No" },
            ]}
            items={[
              {
                id: "broad",
                label: "Which models are broadly stronger at graduate science",
                category: "can",
                why: "That's what GPQA tries to measure.",
              },
              {
                id: "yours",
                label: "How well a model handles your refund policy",
                category: "cant",
                why: "Only your own eval can.",
              },
              {
                id: "sat",
                label: "Which of two top models is better, from MMLU alone",
                category: "cant",
                why: "It's saturated.",
              },
              {
                id: "trend",
                label: "That models improved fast at coding between 2021 and 2024",
                category: "can",
                why: "A broad trend.",
              },
              {
                id: "tone",
                label: "Whether replies suit your customers' tone",
                category: "cant",
                why: "Not what benchmarks measure.",
              },
            ]}
            explanation="Benchmarks give broad, dated comparisons on their own tasks. Your product needs your own eval."
          />
        </div>
      }
    >
      <p>Sort the questions.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Shared exams", "Useful for broad comparison."],
  ["Know what each tests", "And how big and how old it is."],
  ["Saturated means uninformative", "High scores on easy exams prove little."],
  ["Ask who made and ran it", "And date every number."],
  ["Decide with your own eval", "No benchmark is your use case."],
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
      <p>Next: what happens when the exam questions leak.</p>
    </StepLayout>
  );
}

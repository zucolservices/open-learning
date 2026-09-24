"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  INPUTS,
  LADDER,
  estimate,
  fmtBytesGB,
  fmtNum,
  humanTime,
  realTime,
  type Key,
} from "./model";
import type { EstimationState } from "./state";

/* 1 ─ A Fermi estimate ⭐ ------------------------------------------------------------------------- */

const FERMI: { title: string; text: string; calc: string }[] = [
  {
    title: "The question",
    text: "How many requests a second must Brewline's app handle at the lunch peak? Nobody knows exactly. We don't need exactly.",
    calc: "?",
  },
  {
    title: "Start from what you know",
    text: "Marketing says about 2 million people use the app each month.",
    calc: "2,000,000 monthly users",
  },
  {
    title: "How many on a given day?",
    text: "Guess: about a quarter open it on a typical day.",
    calc: "2,000,000 × ¼ ≈ 500,000 daily users",
  },
  {
    title: "What do they do?",
    text: "Most order once. Say one order each.",
    calc: "≈ 500,000 orders a day",
  },
  {
    title: "Per second, on average",
    text: "A day has 86,400 seconds. Call it 100,000 for easy maths, then adjust.",
    calc: "500,000 ÷ 86,400 ≈ 6 orders/s",
  },
  {
    title: "The peak",
    text: "Lunch is much busier than 3 am. Assume the peak is 5× the average; check real graphs when you have them.",
    calc: "6 × 5 ≈ 30 orders/s at lunch",
  },
  {
    title: "Requests, not orders",
    text: "Each order means opening the menu, a cart, payment and status updates: say 20 requests.",
    calc: "30 × 20 ≈ 600 requests/s at peak",
  },
  {
    title: "What it tells you",
    text: "Hundreds of requests a second, not millions. A few app servers and one well-tuned database will do. The estimate just saved you from over-building.",
    calc: "≈ 600 req/s → a modest design",
  },
];

export function Fermi() {
  const [s, set] = useSceneState<EstimationState>();
  const f = FERMI[s.fermi];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Good-enough numbers, fast"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-1.5">
            {FERMI.slice(1, s.fermi + 1).map((x, i) => (
              <motion.div
                key={x.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 font-mono text-xs",
                  i === s.fermi - 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                )}
              >
                <span className="text-muted font-sans">{x.title}</span>
                <span>{x.calc}</span>
              </motion.div>
            ))}
            {s.fermi === 0 && (
              <div className="border-line text-muted rounded-lg border border-dashed px-3 py-6 text-center text-sm">
                Step through the estimate →
              </div>
            )}
          </div>
          <Stepper step={s.fermi} count={FERMI.length} onChange={(n) => set({ fermi: n })} />
          <FrameCaption
            frameKey={s.fermi}
            title={f.title}
            tone={s.fermi === FERMI.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        The physicist Enrico Fermi liked asking students how many piano tuners work in Chicago.
        Nobody knows, but a chain of sensible guesses gets you within a factor of a few.
      </p>
      <p>
        Engineers do the same before designing anything: a{" "}
        <Term id="back-of-envelope">back-of-the-envelope estimate</Term>. It&apos;s not about
        precision. It&apos;s about knowing whether you&apos;re building for hundreds of requests a
        second or hundreds of thousands.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The estimator ⭐ ---------------------------------------------------------------------------- */

const ROWS: { k: Key; label: string; fmt(v: number): string }[] = [
  { k: "dau", label: "Daily active users", fmt: (v) => fmtNum(v) },
  { k: "actions", label: "Requests per user per day", fmt: (v) => String(v) },
  { k: "writePct", label: "Share that write data", fmt: (v) => `${v}%` },
  { k: "peak", label: "Peak ÷ average (measure yours)", fmt: (v) => `${v}×` },
  {
    k: "sizeKB",
    label: "Size of each item",
    fmt: (v) => (v >= 1000 ? `${v / 1000} MB` : `${v} KB`),
  },
  { k: "years", label: "Keep data for", fmt: (v) => `${v} year${v > 1 ? "s" : ""}` },
  {
    k: "perServer",
    label: "One server handles (measure yours)",
    fmt: (v) => `${v.toLocaleString("en-US")} req/s`,
  },
];

export function Estimator() {
  const [s, set] = useSceneState<EstimationState>();
  const r = estimate(s as unknown as Record<string, number>);
  const out: [string, string, string][] = [
    ["Requests per day", fmtNum(r.requestsPerDay), `${fmtNum(r.v("dau"))} × ${r.v("actions")}`],
    ["Average requests/s", fmtNum(r.avgQps), "per day ÷ 86,400"],
    ["Peak requests/s", fmtNum(r.peakQps), `average × ${r.v("peak")}`],
    ["Writes/s (average)", fmtNum(r.writeQps), `${r.v("writePct")}% of requests`],
    ["New data per day", fmtBytesGB(r.storagePerDayGB), "writes × item size"],
    [
      `Stored after ${r.v("years")} years`,
      fmtBytesGB(r.storageTotalTB * 1000),
      "before replication and backups",
    ],
    [
      "Peak bandwidth out",
      r.peakBandwidthMBs >= 125
        ? `${(r.peakBandwidthMBs / 125).toFixed(1)} Gbps`
        : `${r.peakBandwidthMBs.toFixed(1)} MB/s`,
      "1 Gbps = 125 MB/s",
    ],
    ["App servers at peak", `≈ ${r.servers}`, "plus spares for failures"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The estimator"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {ROWS.map((row) => (
              <label key={row.k} className="grid gap-0.5">
                <span className="flex justify-between gap-2 text-[11px]">
                  <span className="text-muted">{row.label}</span>
                  <span className="font-mono">{row.fmt(INPUTS[row.k][s[row.k] as number])}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={INPUTS[row.k].length - 1}
                  value={s[row.k] as number}
                  aria-label={row.label}
                  onChange={(e) => set({ [row.k]: Number(e.target.value) })}
                  className="accent-[var(--accent)]"
                />
              </label>
            ))}
          </div>
          <div className="border-line overflow-hidden rounded-xl border">
            {out.map(([k, v, how], i) => (
              <div
                key={k}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-2 px-3 py-1.5",
                  i % 2 ? "bg-surface" : "bg-surface-2/50",
                )}
              >
                <span className="text-sm">
                  {k}
                  <span className="text-subtle block text-[10px]">{how}</span>
                </span>
                <motion.span
                  key={v}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 1 }}
                  className="font-mono text-sm font-semibold"
                >
                  {v}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Most estimates follow the same chain: users → requests per second → peak → data stored →
        bandwidth → machines. Move the inputs and watch each result change.
      </p>
      <p className="text-muted text-sm">
        Two numbers here are guesses you should replace with measurements: how much busier your peak
        is than your average (often a few times, but it varies), and how many requests one of your
        servers really handles.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The latency ladder ⭐ ---------------------------------------------------------------------- */

export function Ladder() {
  const [s, set] = useSceneState<EstimationState>();
  const rung = LADDER[s.rung];
  const maxLog = Math.log10(LADDER[LADDER.length - 1].real / LADDER[0].real);
  return (
    <StepLayout
      eyebrow="Numbers to know"
      title="The latency ladder"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.human ? "human" : "real"}
            options={[
              ["real", "Real time"],
              ["human", "If 1 ns were 1 second"],
            ]}
            onChange={(v) => set({ human: v === "human" })}
          />
          <div className="grid gap-1.5">
            {LADDER.map((l, i) => (
              <button
                key={l.label}
                type="button"
                onClick={() => set({ rung: i })}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-3 rounded-lg border px-3 py-1.5 text-left transition",
                  s.rung === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs">{l.label}</span>
                  <span className="bg-surface-2 mt-1 block h-1.5 overflow-hidden rounded-full">
                    <motion.span
                      initial={false}
                      animate={{
                        width: `${Math.max(2, (Math.log10(l.real / LADDER[0].real) / maxLog) * 100)}%`,
                      }}
                      className="bg-viz-compute block h-full rounded-full"
                    />
                  </span>
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={String(s.human)}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-right font-mono text-xs font-semibold"
                  >
                    {s.human ? humanTime(l.real) : realTime(l.real)}
                  </motion.span>
                </AnimatePresence>
              </button>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Bar lengths use a logarithmic scale: each step is ten times the last.
          </p>
          <FrameCaption frameKey={s.rung} title={rung.label}>
            {rung.note}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Computers work on timescales too small to feel. Stretch them so one nanosecond becomes one
        second, and the differences become obvious: memory is a couple of minutes away, an SSD a
        day, and a round trip across the Atlantic takes years.
      </p>
      <p className="text-muted text-sm">
        These are orders of magnitude, not specifications, and queueing can add far more than the
        device itself. Distance is a hard floor: light in fibre covers about 200 km per millisecond,
        which is why CDNs and multiple regions exist.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Predict: UPI ---------------------------------------------------------------------------------- */

export function PredictUpi() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="India's payments, per second"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="upi-per-second"
            prompt="In August 2026, UPI processed about 24.5 billion transactions: roughly 790 million a day. On average, how many transactions per second is that?"
            min={0}
            max={30000}
            step={500}
            answer={9000}
            tolerance={1500}
            explanation="790,000,000 ÷ 86,400 ≈ 9,100 per second, on average. Peaks (festivals, salary days, lunchtime) are much higher, and the system has to be built for those, not the average."
          />
        </div>
      }
    >
      <p>
        India&apos;s UPI is one of the largest real-time payment systems in the world. Estimate its
        average load: requests per day ÷ 86,400.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: storage ----------------------------------------------------------------------- */

export function StorageCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How much storage?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="photo-storage"
            prompt="Users upload 1 million photos a day, about 2 MB each, and you keep them for 5 years. Roughly how much storage is that, before copies and backups?"
            options={[
              {
                id: "pb",
                label: "About 3.7 PB",
                correct: true,
                feedback:
                  "Right. 1 million × 2 MB = 2 TB a day; × 365 × 5 ≈ 3,650 TB ≈ 3.7 PB. Then multiply by your number of copies.",
              },
              {
                id: "tb",
                label: "About 37 TB",
                feedback: "That's a factor of 100 short. 2 TB a day alone is 730 TB a year.",
              },
              {
                id: "365pb",
                label: "About 365 PB",
                feedback: "A factor of 100 too big: check the MB → TB step (1 TB = 1,000,000 MB).",
              },
              { id: "small", label: "About 3.7 TB", feedback: "That's under two days of uploads." },
            ]}
            explanation="Write the chain down: items per day × size × days kept. Keep units in every step (MB → GB → TB → PB, ×1,000 each) and most mistakes disappear."
          />
        </div>
      }
    >
      <p>One more, on storage.</p>
    </StepLayout>
  );
}

/* 6 ─ Rules of thumb ------------------------------------------------------------------------------- */

const THUMB: [string, string][] = [
  ["1 day = 86,400 s", "≈ 100,000 for quick maths; a month ≈ 2.6 million seconds."],
  ["1 million a day ≈ 12 a second", "100 million a day ≈ 1,200/s; 1 billion ≈ 12,000/s."],
  ["1 Gbps = 125 MB/s", "Networks count in bits and decimal units; divide by 8."],
  ["Peak is several × average", "A common guess is 2–10×. Measure your own traffic."],
  ["Don't run hot", "Waits explode near 100% busy: plan for 60–70% at peak."],
  ["Units in every step", "×1,000 per step: KB → MB → GB → TB → PB."],
];

export function RulesOfThumb() {
  return (
    <StepLayout
      eyebrow="Keep these"
      title="Rules of thumb"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {THUMB.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-mono text-sm font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>A handful of numbers make most estimates quick.</p>
      <p className="text-muted text-sm">
        The goal is the right order of magnitude. If an estimate says 50 requests a second, the
        design is different from one at 50,000, whatever the exact figure.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Estimate before designing", "Rough numbers rule designs in or out in minutes."],
  ["Users → requests → peak → data → machines", "The same chain works for almost any system."],
  ["Replace guesses with measurements", "Peak factors and per-server capacity vary; measure them."],
  [
    "Know the ladder",
    "Memory is fast, disks slower, networks slower still, and distance is a hard floor.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>That completes the foundations.</p>
      <p>Next chapter: spreading requests across many servers, starting with load balancing.</p>
    </StepLayout>
  );
}

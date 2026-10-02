"use client";

import { motion } from "motion/react";
import { Mail } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BY_ARRIVAL, TRUTH, WINDOW, WINDOWS, eventTime } from "./events";
import type { TimeState } from "./state";

/* 1 ─ Postmarks and delivery dates -------------------------------------------------------------- */

export function Postcards() {
  const cards: [string, string, string][] = [
    ["Goa", "posted 2 Jan", "arrived 4 Jan"],
    ["Shimla", "posted 1 Jan", "arrived 9 Jan"],
    ["Pune", "posted 3 Jan", "arrived 4 Jan"],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Postmarks and delivery dates"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {cards.map(([from, posted, arrived], i) => (
            <motion.div
              key={from}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-xl border px-4 py-3"
            >
              <Mail className="text-accent size-5 shrink-0" />
              <span className="w-16 font-semibold">{from}</span>
              <span className="text-sm">{posted}</span>
              <span className="text-muted ml-auto text-xs">{arrived}</span>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Ask “what happened on 1 January?” and the answer is in a card that arrived last.
          </p>
        </div>
      }
    >
      <p>
        Holiday postcards carry two dates: the postmark, when it was sent, and the day it arrived.
        Sort them by arrival and the Shimla card, sent first, looks like the latest news.
      </p>
      <p>
        Every event has the same two times: <Term id="event-time">event time</Term>, when it
        happened, and <Term id="processing-time">processing time</Term>, when the system saw it.
        Phones go offline, networks retry, partitions lag. Tyler Akidau&apos;s Streaming 101 is
        blunt: &ldquo;we make no assumptions about clock synchronization&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Replay an hour of payments ⭐ ---------------------------------------------------------------- */

const BOUNDS = [0, 1, 2, 5, 10, 20];

export function Replay() {
  const [s, set] = useSceneState<TimeState>();
  const r = eventTime(s.bound, s.now);
  const processing = s.by === "processing";
  const max = Math.max(...TRUTH, ...BY_ARRIVAL) + 4;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative data"
      title="Replay an hour of payments"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.by}
            options={[
              ["processing", "Count by arrival time"],
              ["event", "Count by event time + watermark"],
            ]}
            onChange={(v) => set({ by: v })}
          />
          {!processing && (
            <div className="grid gap-2 text-xs sm:grid-cols-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted">Allowed lateness</span>
                {BOUNDS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => set({ bound: b })}
                    className={cn(
                      "rounded-full border px-2 py-0.5 font-mono text-[10px]",
                      s.bound === b ? "border-accent bg-accent-soft" : "border-line",
                    )}
                  >
                    {b}m
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <span className="text-muted shrink-0">Clock</span>
                <input
                  type="range"
                  min={5}
                  max={90}
                  value={s.now}
                  onChange={(e) => set({ now: Number(e.target.value) })}
                  className="accent-accent flex-1"
                />
                <span className="w-12 font-mono">{s.now} min</span>
              </label>
            </div>
          )}
          <div className="flex h-40 items-end gap-1">
            {WINDOWS.map((w, i) => {
              const truth = TRUTH[i];
              const shown = processing ? BY_ARRIVAL[i] : r.counts[i];
              const emitted = processing || r.emittedAt[i] !== null;
              const off = shown !== truth;
              return (
                <div key={w} className="relative flex flex-1 flex-col items-center gap-0.5">
                  <span className={cn("font-mono text-[9px]", off ? "text-bad" : "text-good")}>
                    {emitted ? shown : "…"}
                  </span>
                  <div className="relative w-full" style={{ height: `${(max / max) * 120}px` }}>
                    <div
                      className="border-line absolute inset-x-0 bottom-0 rounded-t border border-dashed"
                      style={{ height: `${(truth / max) * 100}%` }}
                    />
                    <motion.div
                      className={cn(
                        "absolute inset-x-0.5 bottom-0 rounded-t",
                        !emitted ? "bg-viz-idle/40" : off ? "bg-bad/60" : "bg-good/60",
                      )}
                      animate={{ height: `${(shown / max) * 100}%` }}
                    />
                  </div>
                  <span className="text-muted font-mono text-[8px]">{w}</span>
                </div>
              );
            })}
          </div>
          <p className="text-muted text-[10px]">
            Bars: counted per {WINDOW}-minute window. Dashed outline: the true number of payments
            that happened in that window. Grey: window still open.
          </p>
          {processing ? (
            <p className="text-sm">
              {TRUTH.filter((t, i) => t !== BY_ARRIVAL[i]).length} of 12 windows are wrong: late
              payments land in whichever window they happen to arrive in.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="font-mono font-semibold">
                  {Number.isFinite(r.watermark)
                    ? `${Math.max(0, r.watermark).toFixed(1)} min`
                    : "–"}
                </p>
                <p className="text-muted text-[10px]">watermark</p>
              </div>
              <div
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  r.dropped ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="font-mono font-semibold">{r.dropped}</p>
                <p className="text-muted text-[10px]">late, dropped</p>
              </div>
              <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="font-mono font-semibold">
                  {r.wait === null ? "–" : `${r.wait.toFixed(1)} min`}
                </p>
                <p className="text-muted text-[10px]">results wait</p>
              </div>
            </div>
          )}
        </div>
      }
    >
      <p>
        An hour of payments, counted in 5-minute windows. Most arrive within seconds, some take
        minutes, and a few come from phones that were offline for half an hour. First count by
        arrival time, then switch to event time and play with the watermark and the clock.
      </p>
      <p>
        A <Term id="watermark">watermark</Term> is the system&apos;s running guess of how far event
        time has got: here, the latest event time seen minus an allowance for lateness. When it
        passes the end of a window, the window&apos;s result is emitted, and anything for it that
        arrives later is late. Small allowance: fast results, more dropped. Large: complete results,
        long waits.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Watermarks in each engine ---------------------------------------------------------------- */

const ENGINES: [string, string][] = [
  [
    "Apache Flink",
    "WatermarkStrategy.forBoundedOutOfOrderness(…) or forMonotonousTimestamps(). A watermark t means nothing at or before t will come, which is why Flink subtracts an extra millisecond. Each Kafka partition gets its own watermark; an operator uses the minimum of its inputs. withIdleness keeps a quiet partition from holding everything back.",
  ],
  [
    "Kafka Streams",
    "No explicit watermarks: stream time, the highest record timestamp seen per task, “can be considered a high-watermark”. Windows need an explicit grace period (ofSizeAndGrace); the old 24-hour default was removed in Kafka 4.0.",
  ],
  [
    "Spark Structured Streaming",
    'withWatermark("eventTime", "10 minutes"): max event time minus the delay, updated at the start of each micro-batch. Data later than the delay “may or may not get aggregated”. With several inputs it takes the minimum by default.',
  ],
  [
    "Beam / Dataflow",
    "The watermark is “the system's notion of when all data in a certain window can be expected to have arrived”. With Pub/Sub, Dataflow estimates it from the oldest unacknowledged message; allowed lateness defaults to zero.",
  ],
];

export function Engines() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Watermarks in each engine"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {ENGINES.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Akidau&apos;s Streaming 102 defines it: &ldquo;A watermark with a value of time X makes the
        statement: &lsquo;all input data with event times less than X have been
        observed&rsquo;.&rdquo; Each engine computes and names it a little differently.
      </p>
      <p>
        In Flink 2.x only event time and processing time remain; the old ingestion-time mode was
        removed.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When watermarks go wrong ---------------------------------------------------------------- */

const WRONG: { title: string; text: string; tone?: "bad" }[] = [
  {
    title: "Too slow",
    text: "A generous allowance, or a heuristic that waits for stragglers, makes every result late. Streaming 102 calls this the watermark being too slow.",
    tone: "bad",
  },
  {
    title: "Too fast",
    text: "A tight allowance emits results before late data arrives, so it's dropped or needs a correction later. Most real watermarks are heuristics, not guarantees.",
    tone: "bad",
  },
  {
    title: "An idle partition",
    text: "If one partition or source goes quiet, the minimum across inputs stops moving and nothing downstream is emitted. Flink's withIdleness exists for this; on Dataflow, an idle Pub/Sub source holds back the watermark.",
  },
  {
    title: "Bad clocks",
    text: "A device with its clock set to next week sends a far-future timestamp. A max-based watermark jumps ahead and everything after looks late. Validate timestamps on the way in.",
  },
  {
    title: "Replays",
    text: "Processing-time windows give different answers each time you rerun the same data; event-time windows give the same answer. Flink's docs: processing time “does not provide determinism”.",
  },
];

export function GoneWrong() {
  const [s, set] = useSceneState<TimeState>();
  const f = WRONG[s.frame] ?? WRONG[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="When watermarks go wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {WRONG.map((x, i) => (
              <div
                key={x.title}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i === s.frame ? "bg-accent" : i < s.frame ? "bg-accent/40" : "bg-line",
                )}
              />
            ))}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={WRONG.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Watermarks trade speed for completeness, and real systems hit a few classic problems. Step
        through them.
      </p>
      <p>
        Module 13 shows the other half of the answer: allowing lateness and updating results when
        stragglers arrive.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Event time or processing time? ----------------------------------------------------------- */

export function WhichTime() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Event time or processing time?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-time"
            prompt="Which time should each computation use?"
            categories={[
              { id: "event", label: "Event time" },
              { id: "processing", label: "Processing time" },
            ]}
            items={[
              {
                id: "billing",
                label: "Total payments per minute for the merchant's statement",
                category: "event",
                why: "The statement must match when payments happened, even if some arrived late.",
              },
              {
                id: "fraud",
                label: "Flag three payments to a new payee within two minutes",
                category: "event",
                why: "The two minutes are about when the payments were made.",
              },
              {
                id: "sessions",
                label: "Mobile app sessions, from phones that sync when back online",
                category: "event",
                why: "Offline events arrive hours late but belong to the original session.",
              },
              {
                id: "throughput",
                label: "How many events per second the pipeline is handling right now",
                category: "processing",
                why: "It's about the pipeline itself, now.",
              },
              {
                id: "timeout",
                label: "Alert if a service hasn't sent a heartbeat in the last 30 seconds",
                category: "processing",
                why: "The question is about the wall clock now, not when events claim to be from.",
              },
            ]}
            explanation="Use event time for questions about the world; processing time for questions about the system itself."
          />
        </div>
      }
    >
      <p>Five computations, two clocks.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Two clocks", "When it happened vs when you saw it."],
  ["Arrival order lies", "Counting by processing time misplaces late events."],
  ["Watermarks guess progress", "Max event time seen minus an allowance."],
  ["Speed vs completeness", "Tight watermarks drop more; loose ones wait longer."],
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
      <p>Next: the shapes windows come in, and how to let late data in.</p>
    </StepLayout>
  );
}

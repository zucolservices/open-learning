"use client";

import { motion } from "motion/react";
import { Droplets } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { MINUTES, PER_CONSUMER, simulate, summary } from "./sim";
import type { LagState } from "./state";

/* 1 ─ A tank between two pipes ------------------------------------------------------------------- */

export function WaterTank() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A tank between two pipes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["Inflow", "Water from the municipal line: steady, then a surge on supply day."],
            [
              "The tank",
              "Holds the surplus. If it's big enough, the surge just raises the level for a while.",
            ],
            [
              "Outflow",
              "Taps in the building. More taps drain faster, but only as many as there are pipes.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Droplets className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Without a tank, the only option is to tell the supplier to slow down.
          </p>
        </div>
      }
    >
      <p>
        Producers and consumers rarely run at the same speed. A Kafka topic is the tank: when events
        arrive faster than they&apos;re handled, the backlog grows. That backlog is{" "}
        <Term id="consumer-lag">lag</Term>.
      </p>
      <p>
        When there&apos;s no tank between two stages, the slow one has to make the fast one wait.
        That is <Term id="backpressure">backpressure</Term>. Both are normal; the question is
        whether the backlog drains in time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Survive the sale ⭐ ------------------------------------------------------------------------- */

export function SaleDay() {
  const [s, set] = useSceneState<LagState>();
  const pts = simulate(s.partitions, s.consumers, s.autoscale, s.prewarm);
  const sum = summary(pts);
  const maxRate = Math.max(...pts.map((p) => p.inRate), s.partitions * PER_CONSUMER);
  const maxLag = Math.max(1, ...pts.map((p) => p.lag));
  const ok = sum.peakLag === 0;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative rates"
      title="Survive the sale"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">Partitions</span>
              <Segmented
                size="sm"
                value={String(s.partitions) as "6" | "12" | "24"}
                options={[
                  ["6", "6"],
                  ["12", "12"],
                  ["24", "24"],
                ]}
                onChange={(v) =>
                  set({
                    partitions: Number(v) as 6 | 12 | 24,
                    consumers: Math.min(s.consumers, Number(v)),
                  })
                }
              />
            </div>
            <label className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">Consumers</span>
              <input
                type="range"
                min={1}
                max={s.partitions}
                value={Math.min(s.consumers, s.partitions)}
                onChange={(e) => set({ consumers: Number(e.target.value) })}
                className="accent-accent flex-1"
              />
              <span className="w-8 text-right font-mono">{s.consumers}</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.autoscale}
                onChange={(e) => set({ autoscale: e.target.checked })}
                className="accent-accent"
              />
              Autoscale on lag (3-minute reaction)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.prewarm}
                onChange={(e) => set({ prewarm: e.target.checked })}
                className="accent-accent"
              />
              Pre-warm 5 minutes before the sale
            </label>
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px]">
              Events per second: arriving (outline) vs handled (filled)
            </p>
            <div className="flex h-24 items-end gap-px">
              {pts.map((p) => (
                <div key={p.m} className="relative flex-1" style={{ height: "100%" }}>
                  <div
                    className="border-fg/50 absolute inset-x-0 bottom-0 z-10 border-t-2"
                    style={{ height: `${(p.inRate / maxRate) * 100}%` }}
                  />
                  <div
                    className={cn(
                      "absolute inset-x-0 bottom-0",
                      p.outRate < p.inRate ? "bg-bad/50" : "bg-accent/50",
                    )}
                    style={{ height: `${(p.outRate / maxRate) * 100}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px]">Lag (events waiting)</p>
            <div className="flex h-16 items-end gap-px">
              {pts.map((p) => (
                <div
                  key={p.m}
                  className="bg-viz-compute/60 flex-1 rounded-t-sm"
                  style={{ height: `${(p.lag / maxLag) * 100}%` }}
                />
              ))}
            </div>
            <div className="text-muted mt-0.5 flex justify-between font-mono text-[9px]">
              <span>0 min</span>
              <span>sale 30–50</span>
              <span>{MINUTES} min</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={cn(
                "rounded-lg border px-2 py-1.5",
                ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
              )}
            >
              <p className="font-mono font-semibold">{(sum.peakLag / 1e6).toFixed(1)}M</p>
              <p className="text-muted text-[10px]">peak lag</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="font-mono font-semibold">{sum.maxTimeLagMin.toFixed(1)} min</p>
              <p className="text-muted text-[10px]">worst delay</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-2 py-1.5">
              <p className="font-mono font-semibold">
                {sum.endLag > 0
                  ? "not by 90"
                  : sum.clearAt
                    ? `minute ${sum.clearAt}`
                    : "never behind"}
              </p>
              <p className="text-muted text-[10px]">caught up</p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A sale starts at minute 30 and traffic jumps 7× for twenty minutes, about what Flipkart
        reports for its Big Billion Days. Each consumer handles 4,000 events a second. Keep the
        delay down.
      </p>
      <p>
        Three lessons hide here. In an ordered consumer group, consumers beyond the partition count
        do nothing, so 6 partitions can&apos;t keep up however many consumers you add. Autoscaling
        reacts after lag appears, so it always trails a sudden spike. And for a sale you know is
        coming, scaling up beforehand beats reacting: Hotstar pre-warmed before big matches rather
        than relying on standard autoscaling.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Falling behind, or slowing down ----------------------------------------------------------- */

const FRAMES: { title: string; text: string; tone?: "bad" }[] = [
  {
    title: "Kafka: the consumer falls behind",
    text: "Consumers pull at their own pace. Kafka's design notes: “the consumer simply falls behind and catches up when it can”. Safe, as long as it catches up before retention deletes the data.",
  },
  {
    title: "Inside a Flink job: no tank",
    text: "Operators pass data through small network buffers. If a sink or operator is slow, its input buffers fill.",
  },
  {
    title: "Credit-based flow control",
    text: "Since Flink 1.5, a receiver grants senders “credits” for buffers it has free. No credit, no sending: the slowdown travels upstream, operator by operator, until the source reads Kafka more slowly.",
  },
  {
    title: "Where it shows up",
    text: "Lag grows on the job's Kafka source, even though the real problem is further downstream. Flink's web UI marks tasks as backpressured (over 10% LOW, over 50% HIGH) using busy, backpressured and idle time per second.",
    tone: "bad",
  },
  {
    title: "Find the bottleneck",
    text: "The culprit is the busiest task just downstream of the backpressured ones. Fix that (a slow database sink, a heavy join) rather than adding consumers.",
  },
];

export function PullOrPush() {
  const [s, set] = useSceneState<LagState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Falling behind, or slowing down"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex gap-1">
            {FRAMES.map((x, i) => (
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
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Overload looks different on either side of the log. Between Kafka and a consumer, the
        backlog simply grows. Inside a processing job, stages push back on each other.
      </p>
      <p>
        Step through both, and see why lag on a Flink source can point at a problem in its sink.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Scaling knobs and alarms ----------------------------------------------------------------- */

const KNOBS: [string, string][] = [
  [
    "KEDA (Kubernetes)",
    "Scales consumer pods on lag: about lag ÷ lagThreshold (default 10) replicas, never more than the partition count unless allowIdleConsumers is set.",
  ],
  [
    "Flink autoscaler",
    "The Kubernetes Operator scales each operator on busy time and source backlog, aiming for 70% utilisation and capping at the Kafka partition count. Buffer debloating can shrink in-flight data (off by default).",
  ],
  [
    "Kafka Streams and Spark",
    "Kafka Streams: more threads or instances, up to one task per partition. Spark Structured Streaming has no automatic backpressure; maxOffsetsPerTrigger limits each micro-batch.",
  ],
  [
    "AWS",
    "Lambda's Kafka/MSK pollers (5 MB/s each) scale on OffsetLag. Kinesis on-demand absorbs up to twice its 30-day peak instantly; On-demand Advantage can pre-warm for a forecast peak.",
  ],
  [
    "Azure and Google",
    "Event Hubs auto-inflate raises throughput units (never lowers them), and Standard partitions are fixed at creation. Pub/Sub client flow control absorbs short spikes; watch the oldest unacknowledged message age.",
  ],
  [
    "Alert on time, not offsets",
    "A million-message backlog can be fine or terrible depending on the rate. Alert on how many seconds behind you are; Burrow judges lag trends (OK, WARNING, STALLED) without fixed thresholds.",
  ],
];

export function ScalingKnobs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Scaling knobs and alarms"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {KNOBS.map(([t, d], i) => (
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
        Every platform has a way to add consumers when lag grows, and a ceiling set by partitions or
        shards. Kafka share groups (module 4) lift that ceiling by giving up ordering.
      </p>
      <p>
        The spikes are real: Flipkart moved to Pub/Sub at over 130 billion messages a day, peaking
        at 500 TB a day during its sale; JioHotstar served 6.12 crore concurrent viewers at the
        Champions Trophy 2025 final.
      </p>
    </StepLayout>
  );
}

/* 5 ─ What would you do? ----------------------------------------------------------------------- */

export function Fixes() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What would you do?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="lag-fixes"
            prompt="Pick the right fix for each situation."
            categories={[
              { id: "consumers", label: "Add consumers" },
              { id: "partitions", label: "Add partitions" },
              { id: "ahead", label: "Scale ahead" },
              { id: "bottleneck", label: "Fix the bottleneck" },
            ]}
            items={[
              {
                id: "c",
                label: "Lag growing; 4 consumers on a 12-partition topic, all busy",
                category: "consumers",
                why: "There's room for up to 12 consumers in the group.",
              },
              {
                id: "p",
                label: "Lag growing; 12 consumers on 12 partitions, all at full speed",
                category: "partitions",
                why: "More consumers would sit idle; more partitions (and consumers) add capacity. Mind key remapping.",
              },
              {
                id: "a",
                label: "A flash sale is announced for 8 pm tonight",
                category: "ahead",
                why: "Pre-scale before the spike; autoscaling reacts too late.",
              },
              {
                id: "b",
                label: "A Flink job's source lags, and its database sink shows 100% busy",
                category: "bottleneck",
                why: "Backpressure from the sink; adding source parallelism won't help.",
              },
              {
                id: "b2",
                label: "Only one partition lags; it carries a hot key",
                category: "bottleneck",
                why: "A hot key (module 3): change the key or salt it.",
              },
            ]}
            explanation="Lag is a symptom. Check where capacity runs out (consumers, partitions or a slow stage) and whether the spike was predictable."
          />
        </div>
      }
    >
      <p>Five lag alarms. What fixes each?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Lag is a backlog", "Normal in bursts; dangerous if it never drains."],
  ["Backpressure is a slowdown", "Inside a job, slow stages make upstream wait."],
  ["Partitions cap parallelism", "Plan them for peak, not average."],
  ["Scale ahead of known spikes", "Autoscaling always trails a surge; alert on time lag."],
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
      <p>
        Next: when one bad message blocks the stream, and how retries and dead-letter queues keep
        things moving.
      </p>
    </StepLayout>
  );
}

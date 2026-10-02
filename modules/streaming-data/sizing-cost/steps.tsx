"use client";

import { motion } from "motion/react";
import { UtensilsCrossed } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { partitions, price, selfRun, storageTB } from "./model";
import type { Region, SizingState } from "./state";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/* 1 ─ Counters or plates ----------------------------------------------------------------------- */

export function Catering() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Counters or plates"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Hire counters by the hour",
              "You decide how many serving counters to open. Each serves so many guests a minute. Too few and queues form; too many and you pay for idle staff.",
              "Kinesis shards, Event Hubs throughput units, Kafka brokers",
            ],
            [
              "Pay per plate",
              "The caterer scales up on the day and bills for what's eaten. No counting counters, but each plate costs more.",
              "Pub/Sub, Kinesis on-demand, MSK Serverless",
            ],
          ].map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <UtensilsCrossed className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
                <p className="mt-1 text-xs">
                  <span className="text-subtle">In streaming: </span>
                  {e}
                </p>
              </div>
            </motion.div>
          ))}
          <div className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3 text-sm">
            <p className="font-semibold">How big is &ldquo;10 MB/s&rdquo;?</p>
            <p className="text-muted">
              India made 24.07 billion UPI payments in September 2026: about 9,300 a second on
              average. As 1 KB events, that&apos;s roughly 9.3 MB/s.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Planning a wedding feast starts with two questions: how many guests an hour, and do you pay
        per counter or per plate? Streaming platforms price the same two ways.
      </p>
      <p>
        Sizing means working out how much capacity a stream needs (throughput, partitions, disk).
        Pricing means turning that into money, which depends on the pricing model as much as the
        size.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How many partitions? ⭐ -------------------------------------------------------------------- */

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="flex justify-between">
        <span className="text-muted">{label}</span>
        <span className="font-mono">
          {value} {unit}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="accent-accent"
      />
    </label>
  );
}

export function Partitions() {
  const [s, set] = useSceneState<SizingState>();
  const r = partitions(s.target, s.perProducer, s.perConsumer);
  const consumerBound = r.byC >= r.byP;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="How many partitions?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Slider
            label="Target throughput (t)"
            value={s.target}
            min={5}
            max={200}
            step={5}
            unit="MB/s"
            onChange={(v) => set({ target: v })}
          />
          <Slider
            label="One producer can write to one partition at (p)"
            value={s.perProducer}
            min={1}
            max={30}
            unit="MB/s"
            onChange={(v) => set({ perProducer: v })}
          />
          <Slider
            label="One consumer can process from one partition at (c)"
            value={s.perConsumer}
            min={0.5}
            max={30}
            step={0.5}
            unit="MB/s"
            onChange={(v) => set({ perConsumer: v })}
          />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["t / p", r.byP, !consumerBound],
              ["t / c", r.byC, consumerBound],
              ["at least", r.need, true],
            ].map(([l, v, hi], i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border px-2 py-2",
                  i === 2
                    ? "border-accent bg-accent-soft"
                    : hi
                      ? "border-fg/40 bg-surface"
                      : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l as string}</p>
                <p className="font-mono text-xl font-semibold">{v as number}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-0.5">
            {Array.from({ length: Math.min(r.need, 120) }, (_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: Math.min(i, 40) * 0.01 }}
                className="bg-viz-data size-2.5 rounded-sm"
              />
            ))}
            {r.need > 120 && <span className="text-muted ml-1 text-[10px]">+{r.need - 120}</span>}
          </div>
          <p className="text-sm">
            {consumerBound
              ? "The consumer is the bottleneck: slow processing (a database call per event, say) needs more partitions so more consumers can share the work."
              : "The producer side sets the count here; consumers keep up easily."}
          </p>
        </div>
      }
    >
      <p>
        A <Term id="stream-partition">partition</Term> is read by one consumer per group, so
        partitions cap parallelism. Jun Rao&apos;s 2015 Confluent post gives the rule: measure what
        one partition can take on each side, then &ldquo;you need to have at least max(t/p, t/c)
        partitions&rdquo;.
      </p>
      <p>
        Measure p and c by testing your own producer and consumer. Add headroom for growth, since
        adding partitions later moves keys to different partitions and breaks per-key ordering
        (module 3). But don&apos;t go wild: each partition costs memory and recovery time. AWS
        suggests about 1,000 partitions, replicas included, for an m7g.large MSK broker.
      </p>
    </StepLayout>
  );
}

/* 3 ─ How much disk? ----------------------------------------------------------------------------- */

export function Disk() {
  const [s, set] = useSceneState<SizingState>();
  const tb = storageTB(s.target, s.retention, s.rf);
  const one = storageTB(s.target, s.retention, 1);
  return (
    <StepLayout
      eyebrow="Calculator"
      title="How much disk?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <Slider
            label="Throughput"
            value={s.target}
            min={5}
            max={200}
            step={5}
            unit="MB/s"
            onChange={(v) => set({ target: v })}
          />
          <Slider
            label="Retention"
            value={s.retention}
            min={1}
            max={30}
            unit={s.retention === 1 ? "day" : "days"}
            onChange={(v) => set({ retention: v })}
          />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Replication factor</span>
            <Segmented
              size="sm"
              value={String(s.rf)}
              options={[
                ["1", "1"],
                ["2", "2"],
                ["3", "3"],
              ]}
              onChange={(v) => set({ rf: Number(v) })}
            />
          </div>
          <div className="flex items-end gap-2">
            {Array.from({ length: s.rf }, (_, i) => (
              <motion.div key={i} layout className="flex flex-1 flex-col items-center gap-1">
                <motion.div
                  layout
                  className="bg-viz-data/70 w-full rounded-t"
                  style={{ height: `${8 + 132 * Math.sqrt(one / 520)}px` }}
                />
                <span className="text-muted text-[10px]">
                  {i === 0 ? "leader" : `follower ${i}`}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">
            {s.target} MB/s × {s.retention} {s.retention === 1 ? "day" : "days"} ={" "}
            <span className="font-mono">{one.toFixed(1)} TB</span>; × {s.rf} copies ={" "}
            <span className="font-mono text-lg font-semibold">{tb.toFixed(1)} TB</span> of disk.
          </p>
        </div>
      }
    >
      <p>
        Disk is simple arithmetic: throughput × retention × the{" "}
        <Term id="replication-factor">replication factor</Term>. 10 MB/s kept for 7 days is about 6
        TB; with three copies, about 18 TB.
      </p>
      <p>
        Long retention is where <Term id="tiered-storage">tiered storage</Term> pays: older segments
        move to object storage at under a third of the block-disk price (S3 Standard $0.023 vs gp3
        $0.08 per GB-month in us-east-1), stored once instead of three times.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Price it ⭐ --------------------------------------------------------------------------------- */

export function PriceIt() {
  const [s, set] = useSceneState<SizingState>();
  const lines = price(s.mbps, s.groups, s.region, false);
  const max = Math.max(...lines.map((l) => l.monthly));
  const min = Math.min(...lines.map((l) => l.monthly));
  const tus = Math.max(Math.ceil(s.mbps), Math.ceil((s.mbps * s.groups) / 2));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Price it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-2">
            <Segmented
              size="sm"
              value={String(s.mbps)}
              options={[
                ["1", "1 MB/s"],
                ["10", "10 MB/s"],
                ["30", "30 MB/s"],
              ]}
              onChange={(v) => set({ mbps: Number(v) })}
            />
            <Segmented
              size="sm"
              value={String(s.groups)}
              options={[
                ["1", "1 reader"],
                ["2", "2 readers"],
                ["3", "3 readers"],
              ]}
              onChange={(v) => set({ groups: Number(v) })}
            />
            <Segmented
              size="sm"
              value={s.region}
              options={
                [
                  ["us", "US East"],
                  ["mumbai", "Mumbai"],
                ] as [Region, string][]
              }
              onChange={(v) => set({ region: v })}
            />
          </div>
          <div className="flex flex-col gap-2">
            {lines.map((l) => (
              <div key={l.id}>
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-semibold">{l.name}</span>
                  <span className="font-mono">{usd(l.monthly)}/mo</span>
                </div>
                <div className="bg-surface-2 mt-0.5 h-2.5 rounded">
                  <motion.div
                    animate={{ width: `${(l.monthly / max) * 100}%` }}
                    className={cn("h-2.5 rounded", l.monthly === min ? "bg-good" : "bg-accent/70")}
                  />
                </div>
                <p className="text-subtle mt-0.5 text-[10px]">
                  {l.model} · {l.units}
                </p>
              </div>
            ))}
          </div>
          {tus > 40 && (
            <p className="text-bad text-xs">
              Event Hubs Standard stops at 40 throughput units per namespace: this load needs
              Premium or Dedicated.
            </p>
          )}
          <p className="text-muted text-[10px]">
            Illustrative: list prices read 2 October 2026, 730-hour month, steady load, 1 KB events,
            24-hour retention, no free tiers or discounts. Self-run assumes 3 × m7g.large brokers
            across 3 zones; size real brokers by load testing.
          </p>
        </div>
      }
    >
      <p>
        One topic, priced on six platforms. Change the throughput, how many{" "}
        <Term id="consumer-group">consumer groups</Term> read it, and the region.
      </p>
      <p>
        Pay-per-<Term id="capacity-unit">capacity unit</Term> wins for steady load: a Kinesis shard
        is cheap if you keep it busy. Pay-per-GB costs more per byte but you never size anything,
        which suits spiky or small streams. Notice that each extra reader adds to per-GB bills, and
        that Mumbai is dearer for Kinesis but cheaper for EC2 machines.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The hidden bill ⭐ --------------------------------------------------------------------------- */

export function HiddenBill() {
  const [s, set] = useSceneState<SizingState>();
  const r = selfRun(s.mbps, s.groups, s.region, s.fetchFollower);
  const parts: [string, number, string][] = [
    ["Machines (3 brokers)", r.machines, "bg-viz-compute"],
    ["Disks (24 h × 3 copies)", r.disks, "bg-viz-data"],
    ["Producers → leader in another zone", r.produce, "bg-viz-meta"],
    ["Leader → 2 followers in other zones", r.replicate, "bg-viz-meta"],
    [
      `Leader → consumers in other zones (${s.groups} ${s.groups === 1 ? "reader" : "readers"})`,
      r.consume,
      "bg-viz-meta",
    ],
  ];
  const network = r.produce + r.replicate + r.consume;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The hidden bill"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={String(s.mbps)}
              options={[
                ["1", "1 MB/s"],
                ["10", "10 MB/s"],
                ["30", "30 MB/s"],
              ]}
              onChange={(v) => set({ mbps: Number(v) })}
            />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.fetchFollower}
                onChange={(e) => set({ fetchFollower: e.target.checked })}
                className="accent-accent"
              />
              Consumers fetch from a replica in their own zone
            </label>
          </div>
          <div className="flex h-6 overflow-hidden rounded">
            {parts.map(([n, v, c]) => (
              <motion.div
                key={n}
                animate={{ width: `${(v / r.total) * 100}%` }}
                className={cn(c, "border-surface h-6 border-r")}
                title={n}
              />
            ))}
          </div>
          <div className="flex flex-col gap-1 text-xs">
            {parts.map(([n, v, c]) => (
              <div key={n} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-sm", c)} /> {n}
                </span>
                <span className="font-mono">{usd(v)}</span>
              </div>
            ))}
            <div className="border-line mt-1 flex justify-between border-t pt-1 font-semibold">
              <span>Total per month</span>
              <span className="font-mono">{usd(r.total)}</span>
            </div>
          </div>
          <p className="text-sm">
            Traffic between zones is{" "}
            <span className="font-semibold">{Math.round((network / r.total) * 100)}%</span> of the
            bill.
            {s.fetchFollower
              ? " Follower fetching removed the consumer share; replication still crosses zones."
              : ""}
          </p>
          <p className="text-muted text-[10px]">
            Illustrative: us-east-1 or Mumbai list prices read 2 October 2026, 3 × m7g.large brokers
            (real broker counts come from load testing), RF 3, 24-hour retention, consumers spread
            evenly across zones.
          </p>
        </div>
      }
    >
      <p>
        Run Kafka yourself across three <Term id="availability-zone">availability zones</Term> and
        the machines are the small part. AWS charges $0.01 per GB in each direction for{" "}
        <Term id="cross-az-traffic">traffic between zones</Term>, and every byte crosses several
        times.
      </p>
      <p>
        <Term id="fetch-from-follower">Fetching from a follower</Term> in the consumer&apos;s own
        zone (Kafka 2.4+) cuts the consumer part. The rest varies by provider: managed MSK
        doesn&apos;t bill replication between brokers, and Azure stopped charging for traffic
        between zones in 2024. That bill is also why newer &ldquo;diskless&rdquo; designs write
        straight to object storage (KIP-1150 is accepted for Apache Kafka but not yet shipped).
      </p>
    </StepLayout>
  );
}

/* 6 ─ What grows the bill? ------------------------------------------------------------------- */

export function WhatGrows() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What grows the bill?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="what-grows"
            prompt="Which cost does each change mainly push up?"
            categories={[
              { id: "storage", label: "Storage" },
              { id: "capacity", label: "Capacity units" },
              { id: "network", label: "Network" },
            ]}
            items={[
              {
                id: "retention",
                label: "Compliance wants 90 days of replay instead of 7",
                category: "storage",
                why: "Disk = throughput × retention × copies. Tiered storage softens it.",
              },
              {
                id: "sale",
                label: "Traffic triples during a festival sale (Kinesis provisioned)",
                category: "capacity",
                why: "Each shard takes 1 MB/s, so you need three times the shards.",
              },
              {
                id: "small",
                label:
                  "Events shrink from 1 KB to 100 bytes at the same MB/s (Kinesis provisioned)",
                category: "capacity",
                why: "A shard also caps at 1,000 records a second: ten times the records needs ten times the shards.",
              },
              {
                id: "readers",
                label: "Two more teams read the topic on self-run Kafka spread over three zones",
                category: "network",
                why: "Each reader pulls every byte, often from a leader in another zone.",
              },
              {
                id: "rf",
                label: "Replication factor goes from 2 to 3 on self-run Kafka",
                category: "storage",
                why: "One more full copy of every byte on disk (and more cross-zone replication too).",
              },
            ]}
            explanation="Retention and copies drive disk; throughput and record count drive capacity units; readers and zones drive network."
          />
        </div>
      }
    >
      <p>Five changes to a running stream. Which part of the bill does each mostly grow?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Partitions ≥ max(t/p, t/c)", "Measured from your own producers and consumers, plus headroom."],
  [
    "Disk = throughput × retention × copies",
    "Tiered storage moves the old part to cheap object storage.",
  ],
  ["Two pricing models", "Per capacity unit for steady load; per GB for spiky or small."],
  ["Watch the network", "Cross-zone traffic can outweigh machines when you run Kafka yourself."],
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
      <p>Next: landing streams in a lakehouse.</p>
    </StepLayout>
  );
}

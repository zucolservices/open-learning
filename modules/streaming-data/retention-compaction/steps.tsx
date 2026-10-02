"use client";

import { motion } from "motion/react";
import { Cloud, HardDrive, Image as ImageIcon, MessageSquare, Phone, Trash2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, RECORDS, RETAIN_DAYS, SEGMENT_DAYS, SIZE_SEGMENTS, segmentOf, visible } from "./log";
import type { Policy, RetState } from "./state";

/* 1 ─ A phone that never fills up -------------------------------------------------------------- */

const HABITS: [typeof Trash2, string, string, string][] = [
  [MessageSquare, "Disappearing messages", "Chats vanish after 7 days.", "Time retention"],
  [
    HardDrive,
    "A storage limit",
    "When the phone is full, the oldest videos go first.",
    "Size retention",
  ],
  [
    Phone,
    "The contacts list",
    "Each person's latest number only; old numbers are overwritten.",
    "Compaction",
  ],
  [
    ImageIcon,
    "Photo backup",
    "Old photos move to cloud storage; the phone keeps recent ones.",
    "Tiered storage",
  ],
];

export function PhoneStorage() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A phone that never fills up"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {HABITS.map(([Icon, t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2.5"
            >
              <Icon className="text-accent size-5" />
              <p className="mt-1 text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
              <p className="text-accent mt-1 text-[11px] font-medium">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A phone stays usable because things are quietly cleared: old chats disappear, the oldest
        videos go when storage is full, the contacts list keeps only each person&apos;s latest
        number, and old photos move to the cloud.
      </p>
      <p>
        A Kafka topic has the same four habits. A log can&apos;t grow forever on fast disks, so each
        topic has a <Term id="retention-period">retention</Term> rule, or keeps only the latest
        value per key with <Term id="log-compaction">compaction</Term>, or moves old data to cheap
        object storage.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Delete, or keep the latest ⭐ -------------------------------------------------------------- */

const POLICIES: [Policy, string][] = [
  ["time", "Time"],
  ["size", "Size"],
  ["compact", "Compact"],
  ["both", "Compact + time"],
];

const NOTE: Record<Policy, string> = {
  time: `cleanup.policy=delete with retention.ms: a whole segment is deleted once its newest record is older than the limit (${RETAIN_DAYS} days here, 7 by default).`,
  size: `retention.bytes: once a partition holds more than the limit (${SIZE_SEGMENTS} closed segment here; unlimited by default), the oldest segments go first.`,
  compact:
    "cleanup.policy=compact: closed segments keep only the latest record for each key. The newest (active) segment is left alone. Offsets never change, so gaps appear. Milk's tombstone (a null value) is removed after delete.retention.ms.",
  both: "compact,delete: compaction for the latest values, plus a time limit so even the latest value of an old key eventually goes.",
};

export function Cleanup() {
  const [s, set] = useSceneState<RetState>();
  const keep = visible(s.policy, s.day);
  const written = RECORDS.filter((r) => r.day <= s.day);
  const segments = [...new Set(written.map(segmentOf))];
  const active = Math.floor(s.day / SEGMENT_DAYS);
  return (
    <StepLayout
      eyebrow="Simulation · scaled down"
      title="Delete, or keep the latest"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.policy}
            options={POLICIES}
            onChange={(v) => set({ policy: v })}
          />
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-16 shrink-0">Day {s.day + 1}</span>
            <input
              type="range"
              min={0}
              max={DAYS - 1}
              value={s.day}
              onChange={(e) => set({ day: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
          </label>
          <div className="flex flex-col gap-1.5">
            {segments.map((seg) => {
              const recs = written.filter((r) => segmentOf(r) === seg);
              const gone = recs.every((r) => !keep.has(r.offset));
              return (
                <div
                  key={seg}
                  className={cn(
                    "rounded-lg border px-2 py-1.5",
                    seg === active
                      ? "border-accent"
                      : gone
                        ? "border-line border-dashed opacity-50"
                        : "border-line bg-surface",
                  )}
                >
                  <p className="text-muted mb-1 text-[10px]">
                    segment {seg} · days {seg * SEGMENT_DAYS + 1}–
                    {seg * SEGMENT_DAYS + SEGMENT_DAYS}
                    {seg === active
                      ? " · active"
                      : gone
                        ? s.policy === "compact"
                          ? " · compacted away"
                          : " · deleted"
                        : ""}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {recs.map((r) => {
                      const on = keep.has(r.offset);
                      return (
                        <motion.span
                          key={r.offset}
                          layout
                          animate={{ opacity: on ? 1 : 0.18 }}
                          className={cn(
                            "rounded border px-1 font-mono text-[9px]",
                            r.value === null
                              ? "border-viz-remove bg-viz-remove/15"
                              : "border-line bg-surface-2",
                            !on && "line-through",
                          )}
                        >
                          {r.offset}:{r.key}={r.value ?? "null"}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-muted text-xs">{NOTE[s.policy]}</p>
        </div>
      }
    >
      <p>
        A topic of price updates, three a day, keyed by product. Kafka stores each partition as a
        series of <Term id="log-segment">segments</Term> and cleans up whole segments at a time.
        Move the day slider under each policy.
      </p>
      <p>
        Compaction keeps &ldquo;at least the last known value for each message key&rdquo;, which
        turns a topic into something like a table. Kafka uses it for its own consumer offsets and
        Kafka Streams uses it for state. To delete a key, write a{" "}
        <Term id="tombstone">tombstone</Term>: the key with a null value.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Old segments to object storage ⭐ ---------------------------------------------------------- */

const GP3 = 0.0912; // EBS gp3, Mumbai, per GB-month
const S3 = 0.025; // S3 Standard, Mumbai
const RETAIN = 30;

export function Tiered() {
  const [s, set] = useSceneState<RetState>();
  const gb = s.tb * 1000;
  const allLocal = gb * 3 * GP3;
  const localShare = s.localDays / RETAIN;
  const tiered = gb * localShare * 3 * GP3 + gb * S3;
  const max = allLocal;
  return (
    <StepLayout
      eyebrow="Calculator · AWS Mumbai list prices"
      title="Old segments to object storage"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-40 shrink-0">Data kept (30 days)</span>
            <input
              type="range"
              min={1}
              max={50}
              value={s.tb}
              onChange={(e) => set({ tb: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-14 text-right font-mono">{s.tb} TB</span>
          </label>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-40 shrink-0">Kept on broker disks</span>
            <input
              type="range"
              min={1}
              max={7}
              value={s.localDays}
              onChange={(e) => set({ localDays: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-14 text-right font-mono">
              {s.localDays} day{s.localDays > 1 ? "s" : ""}
            </span>
          </label>
          {[
            ["Everything on broker disks", allLocal, "3 replicas × gp3 disks", HardDrive],
            [
              "Tiered storage",
              tiered,
              `${s.localDays} day${s.localDays > 1 ? "s" : ""} on disks, the rest once in S3`,
              Cloud,
            ],
          ].map(([name, cost, sub, Icon]) => {
            const I = Icon as typeof Cloud;
            return (
              <div key={name as string}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <I className="size-3.5" /> {name as string}
                  </span>
                  <span className="font-mono">
                    ${Math.round(cost as number).toLocaleString("en-US")}/month
                  </span>
                </div>
                <div className="bg-surface-2 mt-1 h-4 overflow-hidden rounded">
                  <motion.div
                    className={cn(
                      "h-full rounded",
                      name === "Tiered storage" ? "bg-good/70" : "bg-accent/70",
                    )}
                    animate={{ width: `${((cost as number) / max) * 100}%` }}
                  />
                </div>
                <p className="text-muted mt-0.5 text-[10px]">{sub as string}</p>
              </div>
            );
          })}
          <p className="text-sm">
            About <span className="font-mono font-semibold">{(allLocal / tiered).toFixed(1)}×</span>{" "}
            cheaper with tiering.
          </p>
          <p className="text-muted text-[10px]">
            Storage only, per GB-month: gp3 $0.0912 (×3 replicas), S3 Standard $0.025 (stored once,
            uploaded by the leader). Amazon MSK charges $0.114 on brokers vs $0.0652 tiered in
            Mumbai.
          </p>
        </div>
      }
    >
      <p>
        Keeping a month of events on three replicas of fast disks is expensive.{" "}
        <Term id="tiered-storage">Tiered storage</Term> keeps only recent segments on the brokers
        and moves closed ones to object storage, where consumers can still read them, just a little
        slower.
      </p>
      <p>
        Apache Kafka&apos;s tiered storage has been production-ready since version 3.9 (2024), with
        a plugin for S3, GCS or Azure; it doesn&apos;t yet work with compacted topics (Confluent
        Platform supports them). Going further, &ldquo;diskless&rdquo; Kafka that writes straight to
        object storage has been accepted as a proposal (KIP-1150) but hasn&apos;t shipped;
        WarpStream (bought by Confluent in 2024) and AutoMQ sell it today.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How long others keep events ------------------------------------------------------------- */

const OTHERS: [string, string][] = [
  [
    "Kinesis",
    "24 hours by default, up to 365 days. Longer retention costs more: in us-east-1 on-demand, $0.10/GB-month up to 7 days, $0.023 after.",
  ],
  [
    "Pub/Sub",
    "Topics can keep messages from 10 minutes to 31 days; by default a topic forgets a message once every subscription has acknowledged it.",
  ],
  [
    "Event Hubs",
    "1 day (Basic), 7 (Standard), 90 (Premium and Dedicated). Capture copies events to Blob Storage or Data Lake as Avro files.",
  ],
  [
    "Kafka, forever",
    "retention.ms=-1 keeps everything. The New York Times keeps every article since 1851 in a single-partition topic set to retain all events forever (under 100 GB in 2017), and rebuilds search and other systems by replaying it.",
  ],
];

export function Elsewhere() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How long others keep events"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {OTHERS.map(([t, d], i) => (
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
        Managed services cap retention, and charge for longer. Kafka lets you keep events as long as
        you like, which is what makes replaying history (the Kappa idea from module 1) possible.
      </p>
      <p>
        For years of history, most teams land the stream in a lakehouse table instead (module 20).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which policy? ---------------------------------------------------------------------------- */

export function WhichPolicy() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which policy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-policy"
            prompt="Pick a cleanup policy for each topic."
            categories={[
              { id: "time", label: "Time retention" },
              { id: "compact", label: "Compaction" },
              { id: "forever", label: "Keep forever" },
            ]}
            items={[
              {
                id: "clicks",
                label: "Click events feeding this week's dashboards",
                category: "time",
                why: "Only recent events matter; delete after a few days.",
              },
              {
                id: "address",
                label: "Each customer's current delivery address",
                category: "compact",
                why: "Only the latest value per customer matters.",
              },
              {
                id: "articles",
                label: "Every article ever published, to rebuild search indexes",
                category: "forever",
                why: "Replaying the full history is the point (like the New York Times).",
              },
              {
                id: "offsets",
                label: "Consumer groups' committed offsets",
                category: "compact",
                why: "Kafka's own __consumer_offsets topic is compacted: only the latest position counts.",
              },
              {
                id: "logs",
                label: "Application logs, needed for two weeks",
                category: "time",
                why: "A 14-day retention.ms.",
              },
            ]}
            explanation="Time or size for streams of happenings; compaction for 'latest value per key'; forever when the history itself is the product."
          />
        </div>
      }
    >
      <p>Five topics, three policies.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Segments are the unit", "Retention deletes whole closed segments."],
  ["Time or size", "7 days by default; size is per partition."],
  ["Compaction keeps the latest", "Per key, with tombstones to delete; offsets never change."],
  ["Tier the old data", "Recent on disks, the rest in object storage, ~10× cheaper."],
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
      <p>Next: Kafka, Redpanda, Pulsar and the clouds&apos; streaming services side by side.</p>
    </StepLayout>
  );
}

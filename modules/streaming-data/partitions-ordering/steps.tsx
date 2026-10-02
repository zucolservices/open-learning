"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { murmur2, partitionFor } from "./murmur2";
import { LAG, ORDER_EVENTS, PARTS, arrivals, load, partitionOf, perOrder } from "./sim";
import type { HotKey, KeyChoice, PartState } from "./state";

/* 1 ─ Counters at the post office --------------------------------------------------------------- */

export function Counters() {
  const counters = [
    ["Counter 1", "PIN codes ending 0–3", 3],
    ["Counter 2", "ending 4–6", 2],
    ["Counter 3", "ending 7–9", 9],
  ] as const;
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Counters at the post office"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {counters.map(([name, rule, n], i) => (
            <div key={name} className="flex items-center gap-3">
              <div className="w-28 shrink-0">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-muted text-[10px]">{rule}</p>
              </div>
              <div className="flex flex-1 gap-1">
                {Array.from({ length: n }, (_, j) => (
                  <motion.span
                    key={j}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * j + 0.2 * i }}
                    className={cn(
                      "size-5 rounded-full",
                      i === 2 && j < 7 ? "bg-viz-remove/60" : "bg-accent/40",
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            A bulk mailer from one area brings 7 parcels to counter 3: its queue grows while the
            others sit idle.
          </p>
        </div>
      }
    >
      <p>
        A busy post office opens several counters and sends each customer to one by the last digit
        of their PIN code. The same area always goes to the same counter, so its parcels are handled
        in the order they arrived. Three counters serve three times as many people.
      </p>
      <p>
        Streaming platforms split a topic the same way, into{" "}
        <Term id="stream-partition">partitions</Term>, and send each event to one by its{" "}
        <Term id="partition-key">key</Term>. That gives parallel speed and order per key, and one
        risk: a single busy key can swamp its counter.
      </p>
    </StepLayout>
  );
}

/* 2 ─ From key to partition ⭐ ------------------------------------------------------------------- */

const SAMPLE = ["asha", "ravi", "meera", "kiran", "farah", "john", "megamart", "order-101"];

export function HashIt() {
  const [s, set] = useSceneState<PartState>();
  const bytes = new TextEncoder().encode(s.key || "");
  const h = murmur2(bytes);
  const pos = h & 0x7fffffff;
  const p = s.key ? pos % s.parts : null;
  return (
    <StepLayout
      eyebrow="Real algorithm · Kafka's Java producer"
      title="From key to partition"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <input
            value={s.key}
            maxLength={40}
            onChange={(e) => set({ key: e.target.value })}
            aria-label="Key"
            className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-sm"
            placeholder="type a key"
          />
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Partitions</span>
            <Segmented
              size="sm"
              value={String(s.parts) as "3" | "6" | "12"}
              options={[
                ["3", "3"],
                ["6", "6"],
                ["12", "12"],
              ]}
              onChange={(v) => set({ parts: Number(v) })}
            />
          </div>
          <Code className="text-[11px]">
            {`murmur2("${s.key}") = ${h}
toPositive(…)     = ${pos}
${pos} % ${s.parts}${" ".repeat(Math.max(1, 13 - String(pos).length - String(s.parts).length))}= partition ${p ?? "–"}`}
          </Code>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${s.parts}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: s.parts }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-md border px-1 py-1.5 text-center font-mono text-[10px]",
                  i === p ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-1 text-[10px]">
            {SAMPLE.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ key: k })}
                className="border-line hover:bg-surface-2 rounded-full border px-2 py-0.5 font-mono"
              >
                {k} → {partitionFor(k, s.parts)}
              </button>
            ))}
          </div>
        </div>
      }
    >
      <p>
        This is the real calculation Kafka&apos;s Java producer does: hash the key&apos;s bytes with
        murmur2, make it positive, and take the remainder after dividing by the number of
        partitions. Type any key. The same key always gives the same partition.
      </p>
      <p>
        Now change the partition count and watch the keys move. Kafka lets you add partitions but
        not remove them, and warns that keys &ldquo;may be routed to different partitions after the
        expansion&rdquo;; it doesn&apos;t move old data. So pick the count with room to grow. (One
        catch: Python, Go and .NET clients built on librdkafka hash with CRC32 by default.)
      </p>
    </StepLayout>
  );
}

/* 3 ─ Order only within a partition ⭐ ----------------------------------------------------------- */

const KEYS: [KeyChoice, string][] = [
  ["none", "No key"],
  ["status", "Status"],
  ["order", "Order ID"],
  ["customer", "Customer ID"],
];

const STATUS_CLS = {
  placed: "bg-viz-data/20 border-viz-data",
  paid: "bg-viz-compute/20 border-viz-compute",
  shipped: "bg-viz-add/20 border-viz-add",
};

export function OrderMatters() {
  const [s, set] = useSceneState<PartState>();
  const result = perOrder(s.orderKey);
  const arr = arrivals(s.orderKey);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Order only within a partition"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Key</span>
            <Segmented
              size="sm"
              value={s.orderKey}
              options={KEYS}
              onChange={(v) => set({ orderKey: v })}
            />
          </div>
          <div className="flex flex-col gap-1">
            {Array.from({ length: PARTS }, (_, p) => (
              <div key={p} className="flex items-center gap-2">
                <span className="text-muted w-28 shrink-0 text-[10px] whitespace-nowrap">
                  partition {p} {LAG[p] ? `· ${LAG[p]} behind` : "· keeping up"}
                </span>
                <div className="flex flex-1 gap-0.5 overflow-hidden">
                  {ORDER_EVENTS.filter((e) => partitionOf(e, s.orderKey) === p).map((e) => (
                    <motion.span
                      key={e.i}
                      layout
                      className={cn(
                        "rounded border px-1 font-mono text-[9px] whitespace-nowrap",
                        STATUS_CLS[e.status],
                      )}
                    >
                      {e.order} {e.status}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="border-line rounded-lg border px-3 py-2">
            <p className="text-muted mb-1 text-[10px]">
              What the warehouse sees, in arrival order ({arr.length} events)
            </p>
            {result.map((r) => (
              <p
                key={r.order}
                className={cn("flex items-center gap-1.5 text-xs", r.ok ? "" : "text-bad")}
              >
                {r.ok ? <Check className="text-good size-3.5" /> : <X className="size-3.5" />}
                <span className="w-24 font-mono">order {r.order}</span>
                <span className="font-mono text-[11px]">{r.seq.join(" → ")}</span>
              </p>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Four orders each go placed → paid → shipped. Three partitions are read in parallel, and some
        readers run behind others, as they do in real life. Pick a key and see what the warehouse
        receives.
      </p>
      <p>
        Kafka &ldquo;guarantees that any consumer of a given topic-partition will always read that
        partition&apos;s events in exactly the same order as they were written&rdquo;: within a
        partition, never across them. So put everything that must stay in order under the same key.
        Keying by order ID or customer ID both work here; keying by status splits each order apart.
      </p>
    </StepLayout>
  );
}

/* 4 ─ One partition runs hot ⭐ ------------------------------------------------------------------ */

const HOT: [HotKey, string][] = [
  ["merchant", "Merchant"],
  ["payer", "Payer"],
  ["salted", "Merchant + salt"],
];

const HOT_NOTE: Record<HotKey, string> = {
  merchant:
    "MegaMart's 40% all lands on one partition. Adding partitions doesn't help: one key can only ever use one partition.",
  payer:
    "Hundreds of payers spread evenly. Each payer's payments stay in order; a merchant's payments are spread across partitions.",
  salted:
    "MegaMart's key gets a suffix 0–3, spreading it over up to four partitions. Its payments are no longer in one order: the price of the fix.",
};

export function HotPartition() {
  const [s, set] = useSceneState<PartState>();
  const bars = load(s.hotKey, s.hotParts);
  const max = Math.max(...bars, 100 / s.hotParts);
  const fair = 100 / s.hotParts;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative traffic"
      title="One partition runs hot"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Key</span>
            <Segmented
              size="sm"
              value={s.hotKey}
              options={HOT}
              onChange={(v) => set({ hotKey: v })}
            />
            <span className="text-muted ml-2">Partitions</span>
            <Segmented
              size="sm"
              value={String(s.hotParts) as "6" | "12"}
              options={[
                ["6", "6"],
                ["12", "12"],
              ]}
              onChange={(v) => set({ hotParts: Number(v) })}
            />
          </div>
          <div className="relative flex h-40 items-end gap-1">
            <div
              className="border-good/60 absolute right-0 left-0 border-t border-dashed"
              style={{ bottom: `${(fair / max) * 100}%` }}
            />
            {bars.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[9px]">{Math.round(v)}%</span>
                <motion.div
                  className={cn("w-full rounded-t", v > fair * 1.6 ? "bg-bad/70" : "bg-accent/60")}
                  animate={{ height: `${(v / max) * 120}px` }}
                />
                <span className="text-muted font-mono text-[9px]">{i}</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Dashed line: an even share. Partitions are computed with the real hash.
          </p>
          <motion.p
            key={s.hotKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm"
          >
            {HOT_NOTE[s.hotKey]}
          </motion.p>
        </div>
      }
    >
      <p>
        A payments topic: one big merchant, MegaMart, takes 40% of all payments, and twelve smaller
        shops share the rest. Key by merchant, then by payer, then try salting the hot key. Try 12
        partitions too.
      </p>
      <p>
        This is a <Term id="hot-partition">hot partition</Term>: one key&apos;s traffic overwhelms
        the partition it hashes to, so that partition&apos;s consumer falls behind while others
        idle. AWS calls them &ldquo;hot shards&rdquo; in Kinesis, and Google &ldquo;hot keys&rdquo;
        in Pub/Sub. The fix always trades some ordering for spread.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Partitions everywhere ------------------------------------------------------------------- */

const PLATFORMS: [string, string][] = [
  [
    "Kafka",
    "Partitions per topic; murmur2 on the key. Records without a key are sent to one partition at a time, switching as batches fill (sticky, since Kafka 2.4). Add partitions, never remove.",
  ],
  [
    "Amazon MSK",
    "Recommends at most 1,000 partitions per broker on an m5.large, 4,000 on m5.4xlarge and up, replicas included.",
  ],
  [
    "Kinesis",
    "Shards; the key is MD5-hashed onto shard ranges. Each shard takes 1 MB/s or 1,000 records/s of writes. New: on-demand streams can ignore keys and spread records evenly (AUTO) when order doesn't matter.",
  ],
  [
    "Pub/Sub",
    "No partitions to manage; ordering keys keep order per key (switch ordering on in the subscription), up to 1 MBps per key.",
  ],
  [
    "Event Hubs",
    "Partitions fixed at creation on Basic and Standard (up to 32); Premium and Dedicated can add more, which remaps keys.",
  ],
  [
    "Pulsar",
    "Partitioned topics; the Key_Shared subscription sends each key to exactly one consumer.",
  ],
];

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Partitions everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {PLATFORMS.map(([t, d], i) => (
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
        Every platform splits a stream to scale it and keeps order per key, under different names:
        partitions, shards, ordering keys.
      </p>
      <p>
        One more ordering trap: if a producer retries a failed batch while a later one is already in
        flight, the later one can land first. Kafka&apos;s idempotent producer, on by default since
        version 3.0, prevents this for up to five requests in flight.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Pick the key -------------------------------------------------------------------------------- */

export function PickKey() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the key"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-the-key"
            prompt="Which key fits each stream?"
            categories={[
              { id: "account", label: "Account ID" },
              { id: "device", label: "Device ID" },
              { id: "nokey", label: "No key" },
            ]}
            items={[
              {
                id: "bank",
                label: "Deposits and withdrawals that must be applied to each account in order",
                category: "account",
                why: "Same account, same partition, same order.",
              },
              {
                id: "sensor",
                label: "Temperature readings from 10,000 factory machines, in order per machine",
                category: "device",
                why: "Per-machine order, spread across many keys.",
              },
              {
                id: "clicks",
                label: "Web page views counted per hour; order doesn't matter",
                category: "nokey",
                why: "No key spreads records evenly over partitions.",
              },
              {
                id: "upi",
                label:
                  "UPI payments, one merchant takes 40%, but each payer's payments must stay in order",
                category: "account",
                why: "Key by the payer's account, not the merchant, to avoid a hot partition.",
              },
              {
                id: "logs",
                label: "Application log lines shipped for searching later",
                category: "nokey",
                why: "Throughput matters more than order.",
              },
            ]}
            explanation="Key by the thing whose events must stay in order, and make sure no single key is a huge share of traffic."
          />
        </div>
      }
    >
      <p>Five streams. What should each be keyed by?</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Partitions give parallelism", "A topic is split so many machines share the work."],
  ["The key picks the partition", "hash(key) % partitions: same key, same place."],
  ["Order per partition only", "Keep related events under one key."],
  ["Watch for hot keys", "One key can't use more than one partition."],
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
      <p>Next: many consumers sharing a topic, and how they divide the partitions between them.</p>
    </StepLayout>
  );
}

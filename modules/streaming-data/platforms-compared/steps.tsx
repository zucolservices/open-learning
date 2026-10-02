"use client";

import { motion } from "motion/react";
import { Bus, Car, KeyRound } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PLATFORMS } from "./platforms";
import type { PlatState } from "./state";

/* 1 ─ Own, lease or ride -------------------------------------------------------------------------- */

const WAYS: [typeof Car, string, string, string][] = [
  [
    Car,
    "Own a car",
    "Choose everything, fix everything. Cheapest per kilometre if you drive a lot and have a mechanic.",
    "Self-run Kafka, Redpanda or Pulsar",
  ],
  [
    KeyRound,
    "Lease with servicing",
    "Still your car, but someone else changes the oil and replaces parts.",
    "Managed Kafka: MSK, Confluent Cloud, Google Managed Kafka",
  ],
  [
    Bus,
    "Take the metro",
    "No car at all: pay per trip, never think about engines, go where the lines go.",
    "Cloud services: Kinesis, Pub/Sub, Event Hubs",
  ],
];

export function Vehicles() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Own, lease or ride"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {WAYS.map(([Icon, t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
                <p className="text-accent mt-1 text-[11px] font-medium">{k}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Getting around a city, you can own a car, lease one with servicing, or ride the metro. Each
        trades control against effort.
      </p>
      <p>
        Streaming platforms come the same three ways. The core idea is the same everywhere (modules
        2–6); what differs is who runs the machines, which protocol your code speaks, the limits,
        and how you pay. Many speak the <Term id="kafka-protocol">Kafka protocol</Term>, so the same
        client code works against them.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The streaming map ⭐ ------------------------------------------------------------------------ */

export function StreamMap() {
  const [s, set] = useSceneState<PlatState>();
  const p = PLATFORMS.find((x) => x.id === s.pick) ?? PLATFORMS[0];
  return (
    <StepLayout
      eyebrow="Explore · dated list prices, 2 Oct 2026"
      title="The streaming map"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface relative h-56 rounded-xl border">
            {["Kafka protocol", "Partly Kafka", "Own protocol"].map((label, r) => (
              <div
                key={label}
                className={cn(
                  "absolute right-0 left-0",
                  r > 0 && "border-line border-t border-dashed",
                )}
                style={{ top: `${r * 33.3}%`, height: "33.3%" }}
              >
                <span className="text-muted absolute top-1 left-2 text-[9px]">{label}</span>
              </div>
            ))}
            {PLATFORMS.map((x) => {
              const { left, top } = x;
              const on = x.id === p.id;
              return (
                <motion.button
                  key={x.id}
                  type="button"
                  onClick={() => set({ pick: x.id })}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
                    on
                      ? "border-accent bg-accent text-accent-fg z-10"
                      : "border-line bg-surface-2 hover:border-accent",
                  )}
                  style={{ left: `${left}%`, top: `${top}%` }}
                  whileHover={{ scale: 1.05 }}
                >
                  {x.short}
                </motion.button>
              );
            })}
          </div>
          <div className="text-muted flex justify-between text-[10px]">
            <span>← you run it</span>
            <span>they run the servers</span>
            <span>fully serverless →</span>
          </div>
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-3 py-2"
          >
            <p className="text-sm font-semibold">{p.name}</p>
            <p className="text-muted text-xs">{p.what}</p>
            <div className="mt-1.5 grid gap-1 text-xs sm:grid-cols-2">
              {p.rows.map(([k, v]) => (
                <p key={k}>
                  <span className="text-accent font-medium">{k}:</span> {v}
                </p>
              ))}
            </div>
          </motion.div>
        </div>
      }
    >
      <p>
        Ten options on two axes: how much you run yourself, and whether it speaks Kafka. Click each
        for its profile, with one dated headline price.
      </p>
      <p>
        <Term id="managed-kafka">Managed Kafka</Term> removes the broker chores but you still pick
        instance sizes and partitions; serverless services hide even that and charge per use. Prices
        differ by region: an MSK m7g.large broker is about 28% cheaper in Mumbai than in Virginia.
        Module 19 prices a real workload.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Compatible isn't identical -------------------------------------------------------------- */

const CAVEATS: [string, string][] = [
  [
    "Event Hubs' Kafka endpoint",
    "Not on the Basic tier; Kafka transactions and Kafka Streams are still in preview (Premium and Dedicated); compression is gzip only.",
  ],
  [
    "Confluent Freight",
    "Cheapest Confluent clusters, but no idempotent producers or transactions, so no exactly-once (module 10).",
  ],
  [
    "Kinesis",
    "Its own API and shards; no built-in cross-region replication. On-demand streams in Mumbai scale to 200 MB/s by default (10 GB/s in a few US/EU regions).",
  ],
  [
    "Pub/Sub",
    "Not Kafka at all, and global by design; Pub/Sub Lite, its cheaper zonal cousin, shuts down on 31 January 2027.",
  ],
  [
    "Pulsar",
    "Deletes acknowledged messages by default; set retention if you want a replayable log.",
  ],
  [
    "The market moves",
    "IBM bought Confluent (2026), Confluent bought WarpStream (2024), CoreWeave bought Bufstream (2026). Check a product's status before betting on it.",
  ],
];

export function Caveats() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Compatible isn't identical"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CAVEATS.map(([t, d], i) => (
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
        &ldquo;Kafka-compatible&rdquo; usually means the producer and consumer APIs work. The
        features that matter most for correctness (transactions, compaction, exactly-once) are where
        the gaps hide.
      </p>
      <p>
        Before choosing, test the exact features your pipeline uses, in the region you&apos;ll run
        in.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Pick a platform ---------------------------------------------------------------------------- */

export function PickPlatform() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick a platform"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-platform"
            prompt="Which kind of platform fits each team best?"
            categories={[
              { id: "self", label: "Run it yourself" },
              { id: "managed", label: "Managed Kafka" },
              { id: "cloud", label: "Cloud service" },
            ]}
            items={[
              {
                id: "gcp",
                label: "A small team on Google Cloud that wants no servers and has no Kafka code",
                category: "cloud",
                why: "Pub/Sub: serverless, pay per use, nothing to size.",
              },
              {
                id: "streams",
                label:
                  "A team with Kafka Streams apps using transactions, moving to AWS, no wish to run brokers",
                category: "managed",
                why: "MSK or Confluent run real Kafka, so transactions and Streams work unchanged.",
              },
              {
                id: "bank",
                label: "A bank whose regulator requires its own data centre hardware",
                category: "self",
                why: "Self-run Kafka (or Redpanda) on its own servers.",
              },
              {
                id: "kinesis",
                label: "An AWS app with spiky traffic that only needs simple produce and consume",
                category: "cloud",
                why: "Kinesis on-demand: pay per GB, scales without planning.",
              },
              {
                id: "edge",
                label:
                  "A factory gateway with little memory that needs a single-binary broker on site",
                category: "self",
                why: "Redpanda's single C++ binary suits small, self-run deployments.",
              },
            ]}
            explanation="Start from the protocol you need and how much running you want to do; then check limits, features and price in your region."
          />
        </div>
      }
    >
      <p>Five teams. No single platform is best; each fits some situations.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Same idea everywhere", "A partitioned, replicated, retained log."],
  ["Own, lease or ride", "Self-run, managed Kafka, or serverless cloud services."],
  ["Kafka protocol is the lingua franca", "But check the features you depend on."],
  ["Prices and products move", "Use dated list prices for your region."],
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
        That completes the log. Next chapter: getting data in and out, starting with turning
        database changes into events.
      </p>
    </StepLayout>
  );
}

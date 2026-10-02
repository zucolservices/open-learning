"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CAPACITY, PARTITIONS, PAUSE, assign, tick } from "./sim";
import type { GroupState } from "./state";

/* 1 ─ Cooks and order rails --------------------------------------------------------------------- */

export function Kitchen() {
  const owners = ["A", "A", "A", "B", "B", "B"];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Cooks and order rails"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-6 gap-1.5">
            {owners.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className={cn(
                  "rounded-lg border px-1 py-2 text-center",
                  o === "A" ? "border-accent bg-accent-soft" : "border-viz-meta bg-viz-meta/10",
                )}
              >
                <p className="text-muted text-[10px]">rail {i + 1}</p>
                <p className="text-sm font-semibold">cook {o}</p>
                <p className="text-muted font-mono text-[10px]">
                  done to #{[14, 9, 22, 7, 18, 11][i]}
                </p>
              </motion.div>
            ))}
          </div>
          <p className="text-muted text-xs">
            Six order rails, two cooks, three rails each. Each rail has a ticket clip showing the
            last order finished. A third cook arrives: the head chef reshuffles the rails. A seventh
            cook in a six-rail kitchen has nothing to do.
          </p>
        </div>
      }
    >
      <p>
        A restaurant kitchen has six order rails. Each rail belongs to one cook at a time, so its
        orders are cooked in sequence. More cooks means more rails each can drop, and every rail
        keeps a clip showing how far it has got.
      </p>
      <p>
        A <Term id="consumer-group">consumer group</Term> works the same way: the partitions of a
        topic are shared among the group&apos;s consumers, one consumer per partition, and each
        partition&apos;s progress is saved as a <Term id="committed-offset">committed offset</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Share the work ⭐ --------------------------------------------------------------------------- */

const COLORS = [
  "bg-accent",
  "bg-viz-meta",
  "bg-viz-compute",
  "bg-viz-data",
  "bg-viz-add",
  "bg-viz-idle",
];

export function ShareTheWork() {
  const [s, set] = useSceneState<GroupState>();
  const [sim, setSim] = useState(() => ({
    lag: Array(PARTITIONS).fill(0) as number[],
    pause: Array(PARTITIONS).fill(0) as number[],
    history: [] as number[],
  }));
  const owner = assign(s.consumers);
  const ownerRef = useRef(owner);
  const first = useRef(true);

  // Rebalance whenever the group size changes.
  useEffect(() => {
    const before = ownerRef.current;
    const after = assign(s.consumers);
    ownerRef.current = after;
    if (first.current) {
      first.current = false;
      return;
    }
    setSim((x) => ({
      ...x,
      pause: x.pause.map((v, p) => (s.protocol === "eager" || before[p] !== after[p] ? PAUSE : v)),
    }));
  }, [s.consumers, s.protocol]);

  useEffect(() => {
    const id = setInterval(() => {
      setSim((x) => {
        const lag = tick(
          x.lag,
          ownerRef.current,
          s.rate,
          x.pause.map((v) => v > 0),
        );
        return {
          lag,
          pause: x.pause.map((v) => Math.max(0, v - 1)),
          history: [...x.history.slice(-59), lag.reduce((t, v) => t + v, 0)],
        };
      });
    }, 1000);
    return () => clearInterval(id);
  }, [s.rate]);

  const { lag, pause: pauseLeft, history } = sim;
  const total = lag.reduce((a, b) => a + b, 0);
  const idle = Math.max(0, s.consumers - PARTITIONS);
  const maxH = Math.max(60, ...history);
  const demand = s.rate * PARTITIONS;
  // Steady-state capacity: each consumer splits its capacity evenly over its partitions.
  const counts = owner.reduce<Record<number, number>>(
    (m, c) => (c >= 0 ? { ...m, [c]: (m[c] ?? 0) + 1 } : m),
    {},
  );
  const supply = owner.reduce(
    (t, c) => t + (c >= 0 ? Math.min(s.rate, CAPACITY / counts[c]) : 0),
    0,
  );
  const uneven = s.consumers < PARTITIONS && PARTITIONS % s.consumers !== 0;
  return (
    <StepLayout
      eyebrow="Live simulation"
      title="Share the work"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Remove a consumer"
                onClick={() => set({ consumers: Math.max(1, s.consumers - 1) })}
                className="border-line hover:bg-surface-2 rounded-full border p-1"
              >
                <Minus className="size-3" />
              </button>
              <span className="w-24 text-center font-semibold">
                {s.consumers} consumer{s.consumers > 1 ? "s" : ""}
              </span>
              <button
                type="button"
                aria-label="Add a consumer"
                onClick={() => set({ consumers: Math.min(8, s.consumers + 1) })}
                className="border-line hover:bg-surface-2 rounded-full border p-1"
              >
                <Plus className="size-3" />
              </button>
            </span>
            <label className="flex flex-1 items-center gap-2">
              <span className="text-muted shrink-0">Events per partition</span>
              <input
                type="range"
                min={5}
                max={40}
                step={5}
                value={s.rate}
                onChange={(e) => set({ rate: Number(e.target.value) })}
                className="accent-accent flex-1"
              />
              <span className="w-10 font-mono">{s.rate}/s</span>
            </label>
          </div>
          <Segmented
            size="sm"
            value={s.protocol}
            options={[
              ["eager", "Eager rebalance (stop everyone)"],
              ["cooperative", "Cooperative (move only what changes)"],
            ]}
            onChange={(v) => set({ protocol: v })}
          />
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6">
            {lag.map((l, p) => (
              <div
                key={p}
                className="border-line bg-surface flex flex-col items-center gap-1 rounded-lg border px-1 py-2"
              >
                <span className="text-muted text-[10px]">partition {p}</span>
                <span
                  className={cn(
                    "rounded px-1.5 text-[10px] font-semibold text-white",
                    owner[p] >= 0 ? COLORS[owner[p] % COLORS.length] : "bg-viz-idle",
                  )}
                >
                  {owner[p] >= 0 ? `C${owner[p] + 1}` : "–"}
                </span>
                <span
                  className={cn(
                    "font-mono text-[10px]",
                    pauseLeft[p] > 0 ? "text-bad" : l > 50 ? "text-bad" : "text-muted",
                  )}
                >
                  {pauseLeft[p] > 0 ? "paused" : `lag ${Math.round(l)}`}
                </span>
              </div>
            ))}
          </div>
          {uneven && (
            <p className="text-muted text-xs">
              Uneven split: some consumers have {Math.ceil(PARTITIONS / s.consumers)} partitions,
              others {Math.floor(PARTITIONS / s.consumers)}. The busiest ones fall behind while the
              others have time to spare.
            </p>
          )}
          {idle > 0 && (
            <p className="text-muted text-xs">
              {idle} consumer{idle > 1 ? "s" : ""} idle: there are only six partitions to share.
            </p>
          )}
          <div>
            <div className="flex h-14 items-end gap-px">
              {history.map((h, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-t-sm", h > 100 ? "bg-bad/60" : "bg-accent/50")}
                  style={{ height: `${(h / maxH) * 100}%` }}
                />
              ))}
            </div>
            <p className="text-muted mt-1 flex justify-between text-[10px]">
              <span>total lag over the last minute</span>
              <span className="font-mono">
                now {Math.round(total)} · arriving {demand}/s · can handle {Math.round(supply)}/s
              </span>
            </p>
          </div>
        </div>
      }
    >
      <p>
        Six partitions, events arriving on each, and consumers that can each handle 30 a second. Add
        and remove consumers and change the traffic. Each partition is read by exactly one member of
        the group; when the group changes, partitions are reassigned in a{" "}
        <Term id="rebalance">rebalance</Term>.
      </p>
      <p>
        <Term id="consumer-lag">Lag</Term> is how far behind a partition&apos;s reader is: the
        newest offset minus the committed one. Notice two things: a seventh consumer gets nothing,
        and an eager rebalance pauses everyone while a cooperative one pauses only the partitions
        that move.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Bookmarks: committed offsets ⭐ ------------------------------------------------------------ */

type Frame = {
  title: string;
  text: string;
  done: number;
  committed: number;
  again?: [number, number];
  lost?: [number, number];
  tone?: "good" | "bad";
};

const AFTER: Frame[] = [
  {
    title: "1. Read and process",
    text: "The consumer reads offsets 0, 1, 2… and processes each record.",
    done: 3,
    committed: 0,
  },
  {
    title: "2. Commit",
    text: "Every few seconds (auto-commit: every 5 s by default) it saves its position in Kafka's internal __consumer_offsets topic. The committed offset is the next record to read: 5.",
    done: 5,
    committed: 5,
  },
  {
    title: "3. Keep going",
    text: "It processes 5, 6 and 7 but hasn't committed them yet.",
    done: 8,
    committed: 5,
  },
  {
    title: "4. Crash",
    text: "The consumer crashes before its next commit.",
    done: 8,
    committed: 5,
    tone: "bad",
  },
  {
    title: "5. Another member takes over",
    text: "After a rebalance, another consumer gets the partition and starts from the committed offset, 5. Records 5, 6 and 7 are processed a second time: duplicates, but nothing lost.",
    done: 8,
    committed: 5,
    again: [5, 8],
  },
];

const FIRST: Frame[] = [
  {
    title: "1. Read and process",
    text: "The consumer reads offsets 0, 1, 2… and processes each record.",
    done: 3,
    committed: 0,
  },
  {
    title: "2. Commit as soon as records arrive",
    text: "It fetches 0–4, commits position 5 straight away, then finishes processing them.",
    done: 5,
    committed: 5,
  },
  {
    title: "3. Next batch",
    text: "It fetches 5–7 and commits position 8 before processing any of them.",
    done: 5,
    committed: 8,
  },
  {
    title: "4. Crash",
    text: "The consumer crashes while working on record 5.",
    done: 5,
    committed: 8,
    tone: "bad",
  },
  {
    title: "5. Another member takes over",
    text: "The new owner starts from the committed offset, 8. Records 5, 6 and 7 are never processed: data lost.",
    done: 5,
    committed: 8,
    lost: [5, 8],
    tone: "bad",
  },
];

const inRange = (i: number, r?: [number, number]) => !!r && i >= r[0] && i < r[1];

export function Commits() {
  const [s, set] = useSceneState<GroupState>();
  const frames = s.commitFirst ? FIRST : AFTER;
  const f = frames[s.frame] ?? frames[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Bookmarks: committed offsets"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.commitFirst ? "first" : "after"}
            options={[
              ["after", "Commit after processing"],
              ["first", "Commit before processing"],
            ]}
            onChange={(v) => set({ commitFirst: v === "first" })}
          />
          <div className="flex gap-1">
            {Array.from({ length: 10 }, (_, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-full rounded border py-2 text-center font-mono text-[11px]",
                    inRange(i, f.lost)
                      ? "border-bad bg-bad/20"
                      : inRange(i, f.again)
                        ? "border-viz-compute bg-viz-compute/20"
                        : i < f.done
                          ? "border-good/60 bg-good/10"
                          : "border-line bg-surface",
                  )}
                >
                  {i}
                </div>
                {i === f.committed && (
                  <span className="text-accent text-[9px] font-semibold">commit</span>
                )}
              </div>
            ))}
          </div>
          <FrameCaption frameKey={`${s.frame}-${s.commitFirst}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={frames.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        The committed offset is a bookmark, and when you move it decides what a crash costs. Step
        through a crash, then switch to committing first and step through again.
      </p>
      <p>
        Commit after processing and a crash means some records are processed twice (at least once).
        Commit before and a crash loses them (at most once). Module 10 shows how to get exactly
        once. A brand-new group with no bookmark starts from the newest records by default
        (auto.offset.reset=latest), or from the oldest, or, since Kafka 4.0, from a set time ago.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Rebalancing, gently --------------------------------------------------------------------- */

const CARDS: [string, string][] = [
  [
    "Eager rebalancing",
    "The classic way: every consumer gives up all its partitions, then they are handed out again. Simple, but everything stops. Kafka's default assignor list still starts with an eager one (range).",
  ],
  [
    "Cooperative rebalancing (Kafka 2.4)",
    "Only partitions that change owner are revoked; everyone else keeps working. Use the CooperativeStickyAssignor.",
  ],
  [
    "The new consumer protocol (Kafka 4.0)",
    "The broker coordinates assignments and each member changes on its own. Generally available, but opt-in: set group.protocol=consumer.",
  ],
  [
    "Static membership",
    "Give each consumer a fixed group.instance.id and a quick restart doesn't trigger a rebalance at all.",
  ],
  [
    "Share groups (Kafka 4.2)",
    "Queue-style: more consumers than partitions, each record acknowledged on its own and retried up to 5 times.",
  ],
  [
    "Other platforms",
    "Kinesis: one worker per shard, tracked in DynamoDB leases (KCL). Pub/Sub: the subscription is the group. Event Hubs: consumer groups with checkpoints in Blob Storage. Pulsar: Failover and Shared subscriptions.",
  ],
];

export function Protocols() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rebalancing, gently"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CARDS.map(([t, d], i) => (
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
        Rebalances happen whenever a consumer joins, leaves or looks dead: no heartbeat within the
        session timeout (45 seconds by default), or no call to poll for five minutes
        (max.poll.interval.ms). A consumer stuck on slow work keeps getting kicked out, causing a
        rebalance storm.
      </p>
      <p>Kafka has spent years making rebalances less disruptive. These are the options today.</p>
    </StepLayout>
  );
}

/* 5 ─ What happens? ---------------------------------------------------------------------------- */

export function WhatHappens() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What happens?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="what-happens"
            prompt="What does each situation cause?"
            categories={[
              { id: "idle", label: "Idle consumers" },
              { id: "rebalance", label: "A rebalance" },
              { id: "dupes", label: "Duplicates" },
              { id: "lag", label: "Growing lag" },
            ]}
            items={[
              {
                id: "eight",
                label: "Eight consumers in a group reading a six-partition topic",
                category: "idle",
                why: "Each partition has one reader in a group; two consumers get nothing.",
              },
              {
                id: "slow",
                label: "A consumer takes six minutes to handle one batch",
                category: "rebalance",
                why: "It misses max.poll.interval.ms (five minutes) and is removed from the group.",
              },
              {
                id: "crash",
                label: "A consumer crashes after processing records but before committing",
                category: "dupes",
                why: "The next owner restarts from the last commit and processes them again.",
              },
              {
                id: "double",
                label: "Traffic doubles while the group stays the same size",
                category: "lag",
                why: "More arriving than the consumers can handle.",
              },
              {
                id: "deploy",
                label: "A deployment restarts every consumer, without static membership",
                category: "rebalance",
                why: "Each leave and join reshuffles partitions; static membership avoids it.",
              },
            ]}
            explanation="Lag tells you the group is too small or too slow; rebalances and duplicates come from members joining, leaving and crashing."
          />
        </div>
      }
    >
      <p>Five situations from real operations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["One partition, one reader", "Per group; extra consumers sit idle."],
  ["Offsets are bookmarks", "Commit after processing: duplicates, not losses."],
  ["Lag is the health signal", "Newest offset minus committed offset."],
  ["Rebalances cost", "Prefer cooperative or the new protocol, and static membership."],
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
      <p>Next: what happens to the data itself when a broker dies.</p>
    </StepLayout>
  );
}

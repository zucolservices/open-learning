"use client";

import { motion } from "motion/react";
import { Crown, Server, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { run } from "./model";
import type { Acks, Health, ReplState } from "./state";

/* 1 ─ A register and two clerks ----------------------------------------------------------------- */

export function Clerks() {
  const people: [string, string, string][] = [
    ["Head clerk", "writes every entry first", "leader"],
    ["Clerk 2", "copies each entry, keeping up", "in sync"],
    ["Clerk 3", "out sick, three days behind", "out of sync"],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A register and two clerks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {people.map(([who, what, tag], i) => (
            <motion.div
              key={who}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3",
                i === 2 ? "border-line border-dashed opacity-70" : "border-line bg-surface",
              )}
            >
              {i === 0 ? (
                <Crown className="text-accent size-5" />
              ) : (
                <Server className="text-muted size-5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{who}</p>
                <p className="text-muted text-sm">{what}</p>
              </div>
              <span className="text-muted text-xs">{tag}</span>
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Tell a customer &ldquo;it&apos;s recorded&rdquo; once the head clerk writes it, and a
            fire in that office loses it. Wait until clerk 2 has copied it too, and it survives.
          </p>
        </div>
      }
    >
      <p>
        An important register is kept by a head clerk, with two assistants copying every entry into
        their own books in other rooms. The question is when to tell a customer their entry is safe.
      </p>
      <p>
        Kafka keeps copies of every partition on several brokers: one{" "}
        <Term id="partition-leader">leader</Term> takes the writes and followers copy them.
        Followers that are keeping up form the <Term id="in-sync-replicas">in-sync replicas</Term>{" "}
        (ISR). Kafka relies on these copies rather than forcing every write to disk, which its docs
        say could slow it by &ldquo;two to three orders of magnitude&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lose a broker ⭐ ---------------------------------------------------------------------------- */

const RESULT: Record<string, { label: string; cls: string }> = {
  safe: { label: "Safe", cls: "border-good/50 bg-good/10" },
  lost: { label: "Acknowledged write lost", cls: "border-bad/60 bg-bad/10" },
  "unconfirmed-lost": { label: "Lost (never confirmed)", cls: "border-bad/60 bg-bad/10" },
  offline: { label: "Partition offline", cls: "border-accent/50 bg-accent-soft" },
  rejected: { label: "Write refused", cls: "border-accent/50 bg-accent-soft" },
};

export function KillBroker() {
  const [s, set] = useSceneState<ReplState>();
  const o = run(s.acks, s.minIsr, s.unclean, s.health, s.crashed);
  const brokers = ["B1", "B2", "B3"];
  const r = RESULT[o.result];
  return (
    <StepLayout
      eyebrow="Simulation · Kafka's rules"
      title="Lose a broker"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 text-xs sm:grid-cols-2">
            <label className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">acks</span>
              <Segmented
                size="sm"
                value={s.acks}
                options={[
                  ["0", "0"],
                  ["1", "1"],
                  ["all", "all"],
                ]}
                onChange={(v: Acks) => set({ acks: v, crashed: false })}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">min.insync</span>
              <Segmented
                size="sm"
                value={String(s.minIsr) as "1" | "2"}
                options={[
                  ["1", "1"],
                  ["2", "2"],
                ]}
                onChange={(v) => set({ minIsr: Number(v) as 1 | 2, crashed: false })}
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="text-muted w-20 shrink-0">Followers</span>
              <Segmented
                size="sm"
                value={s.health}
                options={[
                  ["both", "Both in sync"],
                  ["one", "B3 behind"],
                  ["none", "Both behind"],
                ]}
                onChange={(v: Health) => set({ health: v, crashed: false })}
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.unclean}
                onChange={(e) => set({ unclean: e.target.checked, crashed: false })}
                className="accent-accent"
              />
              <span>Allow unclean leader election</span>
            </label>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {brokers.map((b) => {
              const inIsr = o.isr.includes(b);
              const dead = s.crashed && b === "B1";
              const leader = s.crashed ? o.newLeader === b : b === "B1";
              const has = o.holders.includes(b) && !dead;
              return (
                <motion.div
                  key={b}
                  layout
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border px-2 py-3",
                    dead
                      ? "border-bad/60 bg-bad/10"
                      : inIsr
                        ? "border-line bg-surface"
                        : "border-line border-dashed opacity-70",
                  )}
                >
                  <p className="flex items-center gap-1 text-sm font-semibold">
                    {dead ? (
                      <X className="text-bad size-4" />
                    ) : leader ? (
                      <Crown className="text-accent size-4" />
                    ) : (
                      <Server className="text-muted size-4" />
                    )}
                    {b}
                  </p>
                  <p className="text-muted text-[10px]">
                    {dead ? "crashed" : leader ? "leader" : inIsr ? "in sync" : "behind"}
                  </p>
                  <div className="flex flex-wrap justify-center gap-0.5">
                    {["m1", "m2", "m3", "m4"].map((m, i) => (
                      <span
                        key={m}
                        className={cn(
                          "rounded px-1 font-mono text-[9px]",
                          !inIsr && i >= 2
                            ? "text-subtle border-line border border-dashed"
                            : "bg-surface-2",
                        )}
                      >
                        {m}
                      </span>
                    ))}
                    {o.accepted && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn(
                          "rounded px-1 font-mono text-[9px]",
                          has
                            ? "bg-accent text-accent-fg"
                            : "text-subtle border-line border border-dashed",
                        )}
                      >
                        m5
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">
              Producer:{" "}
              <span className="text-fg font-medium">
                {o.ack === "acked"
                  ? "got an acknowledgement"
                  : o.ack === "sent"
                    ? "sent, no reply expected"
                    : "got an error"}
              </span>
            </span>
            <button
              type="button"
              disabled={!o.accepted}
              onClick={() => set({ crashed: !s.crashed })}
              className={cn(
                "ml-auto rounded-full px-3 py-1 text-xs font-medium disabled:opacity-40",
                s.crashed ? "border-line border" : "bg-bad text-white",
              )}
            >
              {s.crashed ? "Bring B1 back" : "Crash the leader now"}
            </button>
          </div>
          <motion.div
            key={`${o.result}-${s.crashed}-${s.acks}-${s.health}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("rounded-xl border px-4 py-3", r.cls)}
          >
            <p className="text-sm font-semibold">
              {s.crashed || o.result === "rejected" ? r.label : "Written"}
            </p>
            <p className="text-muted mt-0.5 text-xs">{o.text}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A producer writes m5 to partition leader B1, and B1 crashes a moment later. Change the{" "}
        <Term id="acks">acks</Term> setting, the followers&apos; health and the{" "}
        <Term id="min-insync-replicas">min.insync.replicas</Term> setting, then crash the leader
        each time.
      </p>
      <p>
        <code className="font-mono text-xs">acks=all</code> waits for every in-sync replica, not
        just the minimum. min.insync.replicas is a floor: below it, writes are refused rather than
        risked. Kafka recommends replication factor 3, min.insync.replicas 2 and acks=all. Its own
        defaults are 1 and 1, so set them deliberately.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Lessons learned the hard way ------------------------------------------------------------- */

const STORY: { year: string; title: string; text: string; tone?: "good" | "bad" }[] = [
  {
    year: "2013",
    title: "Jepsen tests Kafka 0.8",
    text: "Kyle Kingsbury cut the network and watched. Even with acks=-1 (all), the ISR shrank to just the leader, then a replica outside the ISR was promoted: 520 of 987 acknowledged writes were lost.",
    tone: "bad",
  },
  {
    year: "Later",
    title: "The fixes",
    text: "Kingsbury suggested refusing writes when too few replicas are in sync, and not promoting stale replicas. Kafka added min.insync.replicas and a switch for unclean leader election.",
  },
  {
    year: "2017",
    title: "Safety by default",
    text: "Kafka 0.11 turned unclean leader election off by default: an offline partition is better than silently lost data.",
    tone: "good",
  },
  {
    year: "2022",
    title: "Redpanda under Jepsen",
    text: "Jepsen found ten issues in Redpanda 21.10.1, including data loss when a process paused for a few seconds; Redpanda fixed them.",
  },
  {
    year: "2025",
    title: "Kafka 4.1: eligible leader replicas",
    text: "On by default for new clusters, the controller may elect a replica outside the ISR when it knows it holds every committed message, closing a gap where the last in-sync replica crashes and loses unflushed data.",
    tone: "good",
  },
  {
    year: "2025",
    title: "Disk or copies?",
    text: "Jepsen found NATS JetStream 2.12.1 losing committed writes, partly because it flushed to disk every two minutes instead of before acknowledging. Replication only protects you if the copies really exist.",
  },
];

export function Lessons() {
  const [s, set] = useSceneState<ReplState>();
  const f = STORY[s.story] ?? STORY[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Lessons learned the hard way"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {STORY.map((x, i) => (
              <button
                key={i}
                type="button"
                onClick={() => set({ story: i })}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                  i === s.story ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.year}
              </button>
            ))}
          </div>
          <FrameCaption frameKey={s.story} title={`${f.year} · ${f.title}`} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.story} count={STORY.length} onChange={(n) => set({ story: n })} />
        </div>
      }
    >
      <p>
        Every setting in the simulation exists because somebody lost data without it. Jepsen, Kyle
        Kingsbury&apos;s project, tests distributed systems by breaking networks and processes and
        checking what survives.
      </p>
      <p>
        <Term id="unclean-leader-election">Unclean leader election</Term> is the classic trade-off:
        availability now, or correctness. Watch out: Amazon MSK turns it on by default for clusters
        without tiered storage.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How others keep copies ------------------------------------------------------------------ */

const OTHERS: [string, string][] = [
  [
    "Kafka (KRaft)",
    "Leader and followers per partition; metadata kept by a quorum of 3 or 5 controllers since ZooKeeper was removed in 4.0. Spread replicas over racks or zones with broker.rack.",
  ],
  [
    "Amazon MSK",
    "Brokers in 2 or 3 zones; AWS recommends three zones, replication factor 3 and min.insync.replicas of at most RF−1.",
  ],
  [
    "Redpanda",
    "A Raft group per partition; with acks=all a write is acknowledged once a majority has it on disk (unless write caching is turned on).",
  ],
  [
    "Pulsar",
    "BookKeeper writes each entry to Qw storage nodes and waits for Qa acknowledgements; it survives losing Qa−1 nodes.",
  ],
  ["Kinesis", "Synchronously replicates data across three availability zones."],
  ["Pub/Sub", "Synchronous replication to at least two zones, best-effort to a third."],
  ["Event Hubs", "Zone-redundant across three zones automatically, in regions that have them."],
];

export function Platforms() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="How others keep copies"
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
        Everyone keeps several copies, ideally in different availability zones (Cloud module 2). The
        managed services make the choices for you; with self-run Kafka, you make them.
      </p>
      <p>
        Durability costs latency: with acks=all, a write waits for the slowest in-sync follower,
        which is why a follower that falls too far behind (30 seconds by default) is dropped from
        the ISR.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe, lost or offline? ------------------------------------------------------------------- */

export function SafeOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe, lost or offline?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-or-not"
            prompt="What happens to acknowledged writes in each case?"
            categories={[
              { id: "safe", label: "Safe" },
              { id: "loss", label: "Can be lost" },
              { id: "down", label: "Unavailable" },
            ]}
            items={[
              {
                id: "one",
                label: "RF 3, min.insync 2, acks=all; one broker dies",
                category: "safe",
                why: "Two in-sync copies remain, and a new leader has everything acknowledged.",
              },
              {
                id: "acks1",
                label: "acks=1; the leader crashes right after acknowledging",
                category: "loss",
                why: "No follower had copied it yet.",
              },
              {
                id: "two",
                label: "RF 3, min.insync 2, acks=all; two brokers die",
                category: "down",
                why: "Below the minimum, writes are refused: unavailable, but nothing acknowledged is lost.",
              },
              {
                id: "uncleanon",
                label: "Unclean election on; every in-sync replica dies",
                category: "loss",
                why: "A stale replica becomes leader and recent data is gone.",
              },
              {
                id: "uncleanoff",
                label: "Unclean election off; every in-sync replica dies",
                category: "down",
                why: "Kafka waits for an in-sync replica to return.",
              },
              {
                id: "acks0",
                label: "acks=0; a broker restarts",
                category: "loss",
                why: "The producer never waits, so writes can vanish unnoticed.",
              },
            ]}
            explanation="acks=all with min.insync.replicas 2 out of 3 turns failures into refusals instead of silent losses."
          />
        </div>
      }
    >
      <p>Six failures. What happens to data the producer was told was safe?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Copies, not fsync", "Durability comes from replicas on other brokers and zones."],
  ["acks decides the promise", "0: none, 1: the leader has it, all: every in-sync replica."],
  ["min.insync.replicas is a floor", "Below it, refuse writes rather than risk them."],
  ["Unclean election trades safety", "Faster recovery, possible data loss."],
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
      <p>Next: how long the log keeps events, and how to keep only what matters.</p>
    </StepLayout>
  );
}

"use client";

import { motion } from "motion/react";
import { Bell, Camera } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { duplicates, frames } from "./model";
import type { CkState, Saved } from "./state";

/* 1 ─ Photographs of the tally ------------------------------------------------------------------ */

export function Photographs() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Photographs of the tally"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              Bell,
              "A bell is passed along with the ballots",
              "Counters in different rooms keep counting. When the bell reaches a counter, they note which ballot it came after.",
            ],
            [
              Camera,
              "Each counter photographs their tally",
              "The photo shows the tally exactly up to the bell. Nobody stops counting for long.",
            ],
            [
              Camera,
              "The power fails",
              "Everyone restores the tallies from the last photos, and recounts every ballot that came after the bell. No ballot is counted twice or missed.",
            ],
          ].map(([Icon, t, d], i) => {
            const I = Icon as typeof Bell;
            return (
              <motion.div
                key={t as string}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
              >
                <I className="text-accent mt-0.5 size-5 shrink-0" />
                <div>
                  <p className="font-semibold">{t as string}</p>
                  <p className="text-muted text-sm">{d as string}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      }
    >
      <p>
        Vote counting across many rooms can&apos;t simply stop for a photograph. So a bell travels
        along with the ballots, and each counter takes their photo the moment the bell reaches them.
        Together, the photos describe one consistent moment.
      </p>
      <p>
        That is how Flink takes a <Term id="checkpoint">checkpoint</Term>: markers called{" "}
        <Term id="checkpoint-barrier">barriers</Term> flow through the job with the data, and each
        operator snapshots its state as a barrier passes. A crash rolls everything back to the last
        complete checkpoint.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Crash, restore, replay ⭐ ------------------------------------------------------------------ */

const SAVED: [Saved, string][] = [
  ["together", "Saved together"],
  ["separate", "Offsets saved separately"],
  ["memory", "Offset only"],
];

export function CrashRestore() {
  const [s, set] = useSceneState<CkState>();
  const fs = frames(s.saved, s.transactional);
  const f = fs[s.frame] ?? fs[0];
  const dups = duplicates(f.emitted);
  const last = s.frame === fs.length - 1;
  return (
    <StepLayout
      eyebrow="Simulation · simplified Flink model"
      title="Crash, restore, replay"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.saved}
            options={SAVED}
            onChange={(v) => set({ saved: v })}
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.transactional}
              onChange={(e) => set({ transactional: e.target.checked })}
              className="accent-accent"
            />
            Transactional sink: results become visible only when a checkpoint completes
          </label>
          <div>
            <p className="text-muted mb-1 text-[10px]">Source: 20 payments (offsets 0–19)</p>
            <div className="flex gap-0.5">
              {Array.from({ length: 20 }, (_, i) => (
                <div key={i} className="relative flex-1">
                  <div
                    className={cn(
                      "h-5 rounded-sm border",
                      i < f.offset ? "border-accent bg-accent/40" : "border-line bg-surface",
                    )}
                  />
                  {f.snapshots.includes(i) && (
                    <span className="bg-viz-meta absolute -top-1 left-0 h-7 w-0.5" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-muted mt-1 text-[10px]">
              Purple lines: completed checkpoints (barriers). Filled: read so far.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div
              className={cn(
                "rounded-lg border px-2 py-2",
                f.crashed ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Job&apos;s count</p>
              <p className="font-mono text-lg font-semibold">{f.crashed ? "✕" : f.count}</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-2",
                last && f.count !== 20
                  ? "border-bad/60 bg-bad/10"
                  : last
                    ? "border-good/60 bg-good/10"
                    : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Should be</p>
              <p className="font-mono text-lg font-semibold">
                {Math.min(20, Math.max(f.offset, 5))}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-2 py-2",
                dups ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Repeated downstream</p>
              <p className="font-mono text-lg font-semibold">{dups}</p>
            </div>
          </div>
          <FrameCaption
            frameKey={`${s.frame}-${s.saved}-${s.transactional}`}
            title={f.title}
            tone={f.crashed ? "bad" : last ? (f.count === 20 && !dups ? "good" : "bad") : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={fs.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        A job counts 20 payments, checkpointing every five. It crashes after the 13th. Step through,
        then change what gets saved and whether the output is transactional.
      </p>
      <p>
        The trick is saving the counter&apos;s state and the source&apos;s read position in the same
        checkpoint. Flink stores Kafka offsets inside the checkpoint and &ldquo;does NOT rely on
        committed offsets for fault tolerance&rdquo;. That makes the state exactly-once; the output
        is another matter, which the transactional sink handles.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Barriers and snapshots ------------------------------------------------------------------- */

const CARDS: [string, string][] = [
  [
    "Asynchronous barrier snapshotting",
    "From the 2015 paper “Lightweight Asynchronous Snapshots for Distributed Dataflows” (Carbone et al.), inspired by the Chandy–Lamport algorithm. Barriers “never overtake records, they flow strictly in line”.",
  ],
  [
    "Alignment",
    "An operator with two inputs waits for the barrier on both before snapshotting (exactly-once mode, the default). At-least-once mode skips the wait, so a restore can replay some records twice.",
  ],
  [
    "Unaligned checkpoints",
    "Since Flink 1.11: barriers overtake buffered data and the in-flight data is saved too. Faster checkpoints under backpressure, bigger snapshots.",
  ],
  [
    "Incremental and changelog",
    "With RocksDB, checkpoints can save only what changed. The changelog backend cut median checkpoint time from 5 s to 311 ms in Flink 1.16's benchmark. Both are opt-in.",
  ],
  [
    "Checkpoints vs savepoints",
    "Checkpoints are automatic, for recovery; savepoints are taken by you, for upgrades and migrations, like backups. Checkpointing is off until you enable it; store checkpoints on a durable filesystem in production.",
  ],
];

export function Barriers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Barriers and snapshots"
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
        The design lets a job snapshot terabytes of state without pausing. Under heavy backpressure,
        barriers travel slowly, and with the defaults (a 10-minute timeout, no failed checkpoints
        tolerated) a timed-out checkpoint fails the job, which then has even more to replay.
      </p>
      <p>Amazon&apos;s managed Flink, for example, checkpoints every 60 seconds by default.</p>
    </StepLayout>
  );
}

/* 4 ─ Exactly once to the outside ------------------------------------------------------------- */

const SINKS: [string, string][] = [
  [
    "Two-phase commit",
    "Write each checkpoint's output in a transaction, commit when the checkpoint completes. Flink 1.4 introduced TwoPhaseCommitSinkFunction (removed in 2.0; the new sink API's committer does the same).",
  ],
  [
    "Kafka sink, EXACTLY_ONCE",
    "Uses Kafka transactions; this “delays record visibility effectively until a checkpoint is written”. Readers must use read_committed.",
  ],
  [
    "The timeout trap",
    "Flink's Kafka sink asks for a 1-hour transaction timeout; brokers cap it at 15 minutes by default. Change one. Keep the timeout well above the longest checkpoint plus restart, or transactions expire and data is lost.",
  ],
  [
    "Open transactions block readers",
    "A transaction left open stops read_committed consumers until it is committed, aborted or times out.",
  ],
  [
    "Other engines",
    "Kafka Streams exactly_once_v2 commits every 100 ms (30 s otherwise). Spark logs offsets before and commits after each batch; its Kafka sink is at-least-once, so use idempotent sinks. Dataflow streaming is exactly-once by default, with an at-least-once mode since 2024.",
  ],
];

export function Sinks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Exactly once to the outside"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {SINKS.map(([t, d], i) => (
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
        Exactly-once state isn&apos;t exactly-once output. Results sent before a crash are sent
        again after the replay unless the sink takes part in the checkpoint: a{" "}
        <Term id="transactional-sink">transactional sink</Term> or an idempotent one.
      </p>
      <p>The price is latency: transactional output appears only when each checkpoint completes.</p>
    </StepLayout>
  );
}

/* 5 ─ Correct, duplicated or lost? ------------------------------------------------------------- */

export function WhatHappens() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Correct, duplicated or lost?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="after-restore"
            prompt="After a crash and restore, what does downstream end up with?"
            categories={[
              { id: "ok", label: "Correct" },
              { id: "dup", label: "Duplicates" },
              { id: "lost", label: "Lost data" },
            ]}
            items={[
              {
                id: "flinkkafka",
                label:
                  "Flink, exactly-once checkpoints, Kafka sink with EXACTLY_ONCE, readers on read_committed",
                category: "ok",
                why: "State and output both tied to the checkpoint.",
              },
              {
                id: "plaindb",
                label: "Flink, exactly-once checkpoints, writing plain inserts to a database",
                category: "dup",
                why: "Rows written after the last checkpoint are written again on replay.",
              },
              {
                id: "noState",
                label: "A job that keeps its count only in memory and commits Kafka offsets",
                category: "lost",
                why: "The count restarts from zero after the committed position.",
              },
              {
                id: "kstreams",
                label: "Kafka Streams with exactly_once_v2, Kafka in and out",
                category: "ok",
                why: "State, offsets and output commit together.",
              },
              {
                id: "timeout",
                label:
                  "Kafka sink whose transaction timeout is shorter than checkpoint plus restart time",
                category: "lost",
                why: "The transaction expires before it's committed, and its records are gone.",
              },
            ]}
            explanation="Restore state and input position together, and make the sink part of the checkpoint (or idempotent)."
          />
        </div>
      }
    >
      <p>Five setups after the same crash.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Snapshot state and position together", "Barriers mark one consistent moment."],
  ["Restore and replay", "Roll back to the last checkpoint, reread what followed."],
  ["Output needs its own care", "Transactional or idempotent sinks, or duplicates."],
  ["Mind the timeouts", "Checkpoint, transaction and broker limits must agree."],
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
      <p>Next: writing all of this as SQL, with queries that never finish.</p>
    </StepLayout>
  );
}

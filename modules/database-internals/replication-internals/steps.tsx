"use client";

import { motion } from "motion/react";
import { Check, Minus, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LATENCY, LEVELS, STAGES, WAITS_FOR, outcomes, type Level } from "./model";
import type { ReplState } from "./state";

/* 1 ─ Chess by post ------------------------------------------------------------------------------- */

const MOVES = ["1. e4", "1… e5", "2. Nf3", "2… Nc6", "3. Bb5"];

export function ChessByPost() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Chess by post"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            {["Your board (primary)", "Friend's board (replica)"].map((t, i) => (
              <div
                key={t}
                className={cn(
                  "rounded-xl border px-3 py-3",
                  i === 0 ? "border-accent bg-accent-soft" : "border-line bg-surface",
                  i === 1 && "col-start-3",
                )}
              >
                <p className="text-xs font-semibold">{t}</p>
                <div className="mt-2 flex flex-col gap-0.5 font-mono text-[11px]">
                  {MOVES.slice(0, i === 0 ? 5 : 4).map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                  {i === 1 && <span className="text-subtle">… in the post</span>}
                </div>
              </div>
            ))}
            <div className="col-start-2 row-start-1 flex flex-col items-center gap-1">
              {[0, 1, 2].map((k) => (
                <motion.span
                  key={k}
                  className="bg-viz-meta size-2 rounded-full"
                  animate={{ x: [-20, 20], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: k * 0.5 }}
                />
              ))}
            </div>
          </div>
          <p className="text-muted text-center text-xs">
            Send the moves, not photos of the board. Replay them in order and the boards match, just
            a little behind.
          </p>
        </div>
      }
    >
      <p>
        Two friends in different cities play chess by post. Each keeps a board. Rather than mail a
        photo after every move, you send just the move; your friend plays it on their board. As long
        as every move arrives, in order, the boards stay identical, a few days apart.
      </p>
      <p>
        A database already writes every change to its <Term id="wal">write-ahead log</Term>. Send
        that log to a second server and replay it, and you have a <Term id="replica">replica</Term>.
        PostgreSQL&apos;s <Term id="streaming-replication">streaming replication</Term>{" "}
        &ldquo;streams WAL records to the standby as they&apos;re generated&rdquo;; the delay is
        &ldquo;typically under one second&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ How long should a commit wait? ⭐ ----------------------------------------------------------- */

export function CommitLevels() {
  const [s, set] = useSceneState<ReplState>();
  const w = WAITS_FOR[s.level];
  const res = outcomes(s.level);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="How long should a commit wait?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {LEVELS.map((l: Level) => (
              <button
                key={l}
                type="button"
                aria-pressed={s.level === l}
                onClick={() => set({ level: l })}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[11px]",
                  s.level === l
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-1">
            {STAGES.map((st, i) => {
              const waited = i <= w && s.level !== "off";
              return (
                <div key={st} className="flex items-center gap-2 text-xs">
                  <motion.span
                    animate={{ scale: i === w && s.level !== "off" ? 1.2 : 1 }}
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      waited ? "bg-accent" : "bg-line-strong",
                    )}
                  />
                  <span className={cn(waited ? "text-fg" : "text-muted")}>{st}</span>
                  {i === w && s.level !== "off" && (
                    <span className="text-accent ml-auto font-mono text-[10px]">
                      ← OK sent here
                    </span>
                  )}
                </div>
              );
            })}
            {s.level === "off" && (
              <p className="text-accent font-mono text-[10px]">
                OK sent before anything reaches disk
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted w-24 shrink-0">commit wait</span>
            <div className="bg-surface-2 h-2.5 flex-1 rounded-full">
              <motion.div
                className="bg-viz-compute h-full rounded-full"
                animate={{ width: `${Math.max(2, (LATENCY[s.level] / 4.5) * 100)}%` }}
              />
            </div>
            <span className="w-14 text-right font-mono">{LATENCY[s.level]} ms</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {res.map((o) => (
              <motion.div
                key={o.name + s.level}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-2 rounded-lg border px-3 py-2",
                  o.ok === true
                    ? "border-good/40 bg-good/5"
                    : o.ok === "partly"
                      ? "border-line bg-surface"
                      : "border-bad/40 bg-bad/5",
                )}
              >
                {o.ok === true ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : o.ok === "partly" ? (
                  <Minus className="text-muted mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                <div>
                  <p className="text-xs font-semibold">{o.name}</p>
                  <p className="text-muted text-[11px]">{o.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            With one synchronous standby configured. Latencies illustrative; a far-away standby adds
            its network round trip.
          </p>
        </div>
      }
    >
      <p>
        When should the primary tell the app &ldquo;committed&rdquo;? PostgreSQL&apos;s{" "}
        <Term id="synchronous-commit">synchronous_commit</Term> picks the moment, from not waiting
        at all to waiting until the standby can show the change to queries. Try each level.
      </p>
      <p>
        The catch: the standby levels only mean something once synchronous_standby_names lists a
        standby. Without it, remote_write and remote_apply behave exactly like on. And if the only
        synchronous standby goes down, commits wait until it comes back.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Physical and logical ------------------------------------------------------------------------ */

export function PhysLogical() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Physical and logical"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Physical (streaming)</p>
            <ul className="text-muted list-disc space-y-1 pl-4 text-xs">
              <li>
                A byte-for-byte copy of every block, &ldquo;using exact block addresses&rdquo;.
              </li>
              <li>The whole server: every database, table and index.</li>
              <li>Same major version and hardware architecture.</li>
              <li>
                Replica is read-only: a <Term id="hot-standby">hot standby</Term>, ready to take
                over.
              </li>
            </ul>
          </div>
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <p className="text-sm font-semibold">Logical</p>
            <ul className="text-muted list-disc space-y-1 pl-4 text-xs">
              <li>Row changes (insert, update, delete), decoded from the WAL.</li>
              <li>Chosen tables, publish and subscribe.</li>
              <li>Works across major versions: a way to upgrade with little downtime.</li>
              <li>Schema changes (DDL) and sequences aren&apos;t copied.</li>
            </ul>
            <Code>{`-- on the publisher
CREATE PUBLICATION shop FOR TABLE orders, customers;
-- on the subscriber
CREATE SUBSCRIPTION shop_sub
  CONNECTION 'host=old-db dbname=shop' PUBLICATION shop;`}</Code>
          </div>
        </div>
      }
    >
      <p>
        Physical replication copies the exact bytes the WAL describes, so the replica is a clone.
        Logical replication translates the WAL into row changes and sends only the tables you ask
        for.
      </p>
      <p>
        PostgreSQL has had built-in <Term id="logical-replication">logical replication</Term> since
        version 10 (2017). Change data capture tools such as Debezium read the same decoded stream.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What goes wrong ----------------------------------------------------------------------------- */

const WRONG: { t: string; d: string; fix: string }[] = [
  {
    t: "A replica falls behind",
    d: "pg_stat_replication shows three lags per standby: write_lag, flush_lag and replay_lag, matching remote_write, on and remote_apply.",
    fix: "Alert on replay_lag; a lagging replica serves stale reads.",
  },
  {
    t: "The disk fills with WAL",
    d: "A replication slot keeps WAL until its consumer has it. If a standby or CDC tool stops, WAL piles up; by default the limit (max_slot_wal_keep_size) is unlimited.",
    fix: "Set max_slot_wal_keep_size and drop slots nobody uses.",
  },
  {
    t: "Queries on the replica get cancelled",
    d: "If replaying a change (say, VACUUM removing rows) would pull data from under a running query, the standby waits up to max_standby_streaming_delay (30 s by default), then cancels the query.",
    fix: "hot_standby_feedback prevents these cleanup conflicts, at the cost of bloat on the primary.",
  },
];

export function GoesWrong() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What goes wrong"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {WRONG.map((w, i) => (
            <motion.div
              key={w.t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{w.t}</p>
              <p className="text-muted text-xs">{w.d}</p>
              <p className="text-good mt-1 text-xs">{w.fix}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Replication is simple in principle and fussy in practice. These three show up in almost
        every production PostgreSQL setup.
      </p>
      <p>
        Watch <Term id="replication-lag">replication lag</Term> and slot size as closely as CPU and
        disk. A forgotten <Term id="replication-slot">replication slot</Term> is one of the most
        common ways to fill a primary&apos;s disk.
      </p>
    </StepLayout>
  );
}

/* 5 ─ MySQL and Aurora ---------------------------------------------------------------------------- */

export function MysqlAurora() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="MySQL and Aurora"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">MySQL</p>
            <ul className="text-muted mt-1 list-disc space-y-1 pl-4">
              <li>
                Replicas replay the <Term id="binlog">binary log</Term>, a separate log from
                InnoDB&apos;s redo log. Row-based logging has been the default since 5.7.7; in 8.4
                the format setting itself is deprecated.
              </li>
              <li>
                <Term id="gtid">GTIDs</Term> give every transaction a unique ID across all servers,
                so a replica can find its place without file names and offsets.
              </li>
              <li>
                <Term id="semisync">Semi-synchronous</Term> replication waits until one replica has
                written the change to its relay log, not applied it, and quietly falls back to
                asynchronous after a timeout.
              </li>
            </ul>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Amazon Aurora</p>
            <div className="my-2 grid grid-cols-3 gap-1.5">
              {["AZ a", "AZ b", "AZ c"].map((az) => (
                <div key={az} className="border-line rounded-md border px-2 py-1.5 text-center">
                  <p className="text-muted text-[10px]">{az}</p>
                  <div className="mt-1 flex justify-center gap-1">
                    <span className="bg-viz-data size-3 rounded-sm" />
                    <span className="bg-viz-data size-3 rounded-sm" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-muted">
              Only redo log records cross the network, to six storage copies in three availability
              zones. A write needs 4 of 6 to acknowledge, a read 3 of 6. The 2017 paper&apos;s
              summary: &ldquo;the log is the database&rdquo;.
            </p>
          </div>
        </div>
      }
    >
      <p>
        MySQL replicates its own binary log, a record of row changes, rather than the storage
        engine&apos;s redo log. Like PostgreSQL, it&apos;s asynchronous unless you ask otherwise.
      </p>
      <p>
        Aurora takes the log idea furthest: the database engine never writes pages to storage at
        all. The storage layer receives the log and builds pages itself, using a{" "}
        <Term id="quorum">quorum</Term> so it survives losing a whole zone.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Pick the level ------------------------------------------------------------------------------ */

export function PickLevel() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the level"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="pick-commit-level"
            prompt="Which synchronous_commit level fits each need? (A synchronous standby is configured.)"
            categories={[
              { id: "off", label: "off" },
              { id: "local", label: "local" },
              { id: "on", label: "on" },
              { id: "apply", label: "remote_apply" },
            ]}
            items={[
              {
                id: "clicks",
                label:
                  "Logging page views; losing the last fraction of a second in a crash is fine",
                category: "off",
                why: "Fastest; a crash can lose a few recent commits, but never corrupts data.",
              },
              {
                id: "bulk",
                label: "A nightly bulk load that can simply be rerun",
                category: "off",
                why: "Rerunnable work doesn't need every commit to be crash-proof.",
              },
              {
                id: "region",
                label: "Durable on the primary, without waiting for a standby far away",
                category: "local",
                why: "Waits for the local disk only.",
              },
              {
                id: "payments",
                label: "No confirmed payment lost even if the primary's machine is destroyed",
                category: "on",
                why: "Waits until the standby has flushed the commit to disk.",
              },
              {
                id: "ryw",
                label: "Users must see their own change when the next page reads from a replica",
                category: "apply",
                why: "Only remote_apply waits until the change is visible on the standby.",
              },
            ]}
            explanation="Each step up waits longer and protects more. synchronous_commit can be set per transaction, so payments can pay for safety while page views don't."
          />
        </div>
      }
    >
      <p>You can mix levels: set synchronous_commit per transaction for the data that needs it.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Ship the log", "Replicas replay the primary's WAL, usually under a second behind."],
  ["Choose when to say OK", "synchronous_commit trades latency for safety."],
  ["Physical or logical", "Clone the whole server, or stream chosen tables across versions."],
  ["Watch lag and slots", "Stale reads and full disks are the usual surprises."],
  ["The log is the database", "Aurora's storage builds pages from the log itself."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
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
        Replicas copy everything. Next: splitting data across many machines, each owning a slice,
        and still giving you SQL and transactions.
      </p>
    </StepLayout>
  );
}

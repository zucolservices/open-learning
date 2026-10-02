"use client";

import { motion } from "motion/react";
import { ArrowRight, BookOpen, Check, Database, MessageSquare, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CdcState, Failure, Mode } from "./state";

/* 1 ─ The ledger and the text message ---------------------------------------------------------- */

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The ledger and the text message"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-bad/40 bg-bad/10 rounded-xl border px-4 py-3"
          >
            <p className="flex items-center gap-2 font-semibold">
              <BookOpen className="size-4" /> + <MessageSquare className="size-4" /> Two places
            </p>
            <p className="text-muted mt-1 text-sm">
              The shopkeeper writes the sale in the ledger, then texts the warehouse. The phone has
              no signal: the sale is recorded, the warehouse never hears.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border-good/40 bg-good/10 rounded-xl border px-4 py-3"
          >
            <p className="flex items-center gap-2 font-semibold">
              <BookOpen className="size-4" /> One place
            </p>
            <p className="text-muted mt-1 text-sm">
              The note for the warehouse is written as a line in the same ledger entry. A clerk
              reads the ledger and passes on every note, retrying until the warehouse confirms.
            </p>
          </motion.div>
        </div>
      }
    >
      <p>
        Most events start as a change in a database: an order placed, a payment received. The
        service has to save the change and tell the world, and those are two different systems.
      </p>
      <p>
        Writing to both is the <Term id="dual-write">dual-write</Term> problem: one can succeed
        while the other fails. The fix is to write once, to the database, and let{" "}
        <Term id="cdc">change data capture</Term> read the database&apos;s own{" "}
        <Term id="transaction-log">transaction log</Term> and publish what changed.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Lose an event ⭐ ---------------------------------------------------------------------------- */

const MODES: [Mode, string][] = [
  ["dual", "Save, then publish"],
  ["reverse", "Publish, then save"],
  ["outbox", "Outbox + CDC"],
];

const FAILURES: Record<Mode, [Failure, string][]> = {
  dual: [
    ["none", "All fine"],
    ["broker", "Kafka down"],
    ["crash", "Service crashes in between"],
  ],
  reverse: [
    ["none", "All fine"],
    ["crash", "Database write fails"],
  ],
  outbox: [
    ["none", "All fine"],
    ["broker", "Kafka down"],
    ["crash", "Service crashes"],
    ["replay", "Connector restarts"],
  ],
};

interface Result {
  order: boolean;
  outboxRow?: boolean;
  events: number;
  ok: boolean;
  text: string;
}

function outcome(mode: Mode, f: Failure): Result {
  if (mode === "dual") {
    if (f === "none")
      return { order: true, events: 1, ok: true, text: "Both writes worked this time." };
    return {
      order: true,
      events: 0,
      ok: false,
      text:
        f === "broker"
          ? "The order is saved, but publishing failed. The warehouse never hears about it, and any retry held in memory is lost if the service restarts."
          : "The order committed, then the service died before publishing. Nobody will ever send this event.",
    };
  }
  if (mode === "reverse") {
    if (f === "none")
      return { order: true, events: 1, ok: true, text: "Both writes worked this time." };
    return {
      order: false,
      events: 1,
      ok: false,
      text: "The event went out, then the database write failed. The warehouse ships an order that doesn't exist.",
    };
  }
  if (f === "broker")
    return {
      order: true,
      outboxRow: true,
      events: 0,
      ok: true,
      text: "Order and outbox row committed together. CDC keeps retrying and publishes the event when Kafka is back: late, but not lost.",
    };
  if (f === "crash")
    return {
      order: false,
      outboxRow: false,
      events: 0,
      ok: true,
      text: "The crash rolled back the whole transaction: no order and no event. The client sees an error and retries. Nothing disagrees.",
    };
  if (f === "replay")
    return {
      order: true,
      outboxRow: true,
      events: 2,
      ok: true,
      text: "The connector published, then restarted before saving its position, so the event went out twice. CDC is at-least-once: consumers drop the duplicate using the event's id.",
    };
  return {
    order: true,
    outboxRow: true,
    events: 1,
    ok: true,
    text: "One transaction writes the order and an outbox row; CDC reads the log and publishes the row as an event.",
  };
}

export function DualWrite() {
  const [s, set] = useSceneState<CdcState>();
  const failures = FAILURES[s.mode];
  const f = failures.some(([k]) => k === s.failure) ? s.failure : "none";
  const r = outcome(s.mode, f);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Lose an event"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.mode}
            options={MODES}
            onChange={(v) => set({ mode: v, failure: "none" })}
          />
          <div className="flex flex-wrap gap-1.5">
            {failures.map(([k, n]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ failure: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  f === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold">
                <Database className="size-3.5" /> Database
              </p>
              <Row label="orders: #5021" on={r.order} />
              {s.mode === "outbox" && <Row label="outbox: OrderPlaced #5021" on={!!r.outboxRow} />}
            </div>
            <ArrowRight
              className={cn("size-5", s.mode === "outbox" ? "text-accent" : "text-muted")}
            />
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="mb-2 text-xs font-semibold">Kafka topic: orders</p>
              {r.events === 0 ? (
                <p className="text-muted text-xs">nothing</p>
              ) : (
                Array.from({ length: r.events }, (_, i) => (
                  <Row key={i} label={`OrderPlaced #5021${i ? " (again)" : ""}`} on />
                ))
              )}
            </div>
          </div>
          <motion.div
            key={`${s.mode}-${f}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex gap-2 rounded-xl border px-4 py-3 text-sm",
              r.ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
            )}
          >
            {r.ok ? (
              <Check className="text-good mt-0.5 size-4 shrink-0" />
            ) : (
              <X className="text-bad mt-0.5 size-4 shrink-0" />
            )}
            <span>{r.text}</span>
          </motion.div>
        </div>
      }
    >
      <p>
        An order service saves order #5021 and announces it on a Kafka topic. Try each way of doing
        it, and break something each time.
      </p>
      <p>
        The <Term id="outbox">transactional outbox</Term> writes the event into an outbox table in
        the same database transaction as the order, so they can&apos;t disagree. CDC (Debezium, for
        example) publishes it. Debezium&apos;s own example even deletes the outbox row in the same
        transaction: the table stays empty, but the log still has the insert, and that&apos;s what
        CDC reads.
      </p>
    </StepLayout>
  );
}

function Row({ label, on }: { label: string; on: boolean }) {
  return (
    <motion.p
      layout
      className={cn(
        "mb-1 rounded border px-2 py-1 font-mono text-[10px]",
        on ? "border-good/50 bg-good/10" : "border-line text-subtle border-dashed line-through",
      )}
    >
      {label}
    </motion.p>
  );
}

/* 3 ─ Inside a change event ⭐ ------------------------------------------------------------------- */

const EVENTS: Record<CdcState["op"], { before: string; after: string; note: string }> = {
  c: {
    before: "null",
    after: '{ "id": 5021, "status": "placed", "total": 2999 }',
    note: "Create: no before, only after.",
  },
  u: {
    before: '{ "id": 5021, "status": "placed", "total": 2999 }',
    after: '{ "id": 5021, "status": "paid", "total": 2999 }',
    note: "Update: before and after, so consumers see exactly what changed.",
  },
  d: {
    before: '{ "id": 5021, "status": "paid", "total": 2999 }',
    after: "null",
    note: "Delete: only before. On a compacted topic a tombstone usually follows.",
  },
};

export function ChangeEvent() {
  const [s, set] = useSceneState<CdcState>();
  const e = EVENTS[s.op];
  const json = `{
  "before": ${e.before},
  "after":  ${e.after},
  "source": { "connector": "postgresql", "db": "shop",
              "table": "orders", "lsn": 24023128,
              "ts_ms": 1759398131000 },
  "op": "${s.op}",
  "ts_ms": 1759398131412
}`;
  return (
    <StepLayout
      eyebrow="Explore · Debezium's event format"
      title="Inside a change event"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.op}
            options={[
              ["c", "Insert (c)"],
              ["u", "Update (u)"],
              ["d", "Delete (d)"],
            ]}
            onChange={(v) => set({ op: v })}
          />
          <Code className="text-[10px] whitespace-pre-wrap">{json}</Code>
          <p className="text-sm">{e.note}</p>
          <p className="text-muted text-[11px]">
            Other op values: r (read during the initial snapshot), t (truncate), m (message).
            source.ts_ms is when the change happened in the database; the top-level ts_ms is when
            Debezium processed it. The gap is your CDC lag: 412 ms here.
          </p>
        </div>
      }
    >
      <p>
        <Term id="debezium">Debezium</Term>, the open-source CDC project, turns each row change into
        an event with the row before and after, where it came from, and what kind of change it was.
        Switch between insert, update and delete.
      </p>
      <p>
        When a connector first starts it takes a snapshot of the existing rows (op r), then streams
        changes from the log. Incremental snapshots, an idea from Netflix&apos;s DBLog, let it
        re-read tables later without stopping the stream.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Reading each database's log --------------------------------------------------------------- */

const DBS: Record<CdcState["db"], { name: string; how: string; watch: string }> = {
  mysql: {
    name: "MySQL",
    how: "Reads the binary log (binlog). Needs binlog_format=ROW and binlog_row_image=FULL.",
    watch:
      "Binlogs expire on their own schedule; a connector down too long can miss changes and need a new snapshot.",
  },
  postgres: {
    name: "PostgreSQL",
    how: "Logical decoding of the write-ahead log (wal_level=logical) through a replication slot, with the built-in pgoutput plug-in.",
    watch:
      "A slot keeps WAL until its consumer reads it, even with nobody connected: a stopped connector can fill the disk. max_slot_wal_keep_size (PostgreSQL 13+) caps it; it's unlimited by default.",
  },
  sqlserver: {
    name: "SQL Server",
    how: "Reads SQL Server's own CDC change tables, which its capture job fills from the transaction log.",
    watch: "Indirect, so it adds the capture job's delay.",
  },
  oracle: {
    name: "Oracle",
    how: "LogMiner by default; XStream or OpenLogReplicator as alternatives.",
    watch: "Needs supplemental logging and careful tuning on busy systems.",
  },
  mongodb: {
    name: "MongoDB",
    how: "Uses MongoDB change streams.",
    watch: "Change streams need a replica set or sharded cluster.",
  },
};

const MANAGED: [string, string][] = [
  [
    "Debezium (3.7, Commonhaus Foundation)",
    "On Kafka Connect, as Debezium Server, or embedded; Confluent Cloud runs it as managed connectors.",
  ],
  [
    "AWS DMS",
    "Ongoing replication to Kinesis, Kafka or MSK; AWS notes its CDC does not provide real-time replication.",
  ],
  [
    "Google Datastream",
    "MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, Spanner and more, into BigQuery, Cloud Storage or Iceberg.",
  ],
  ["Azure", "Data Factory's change data capture, or Debezium against Event Hubs' Kafka endpoint."],
  [
    "Flink CDC (3.6)",
    "CDC sources built into Apache Flink jobs; donated to Apache by Ververica in 2024.",
  ],
];

export function Databases() {
  const [s, set] = useSceneState<CdcState>();
  const d = DBS[s.db];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Reading each database's log"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(DBS) as CdcState["db"][]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ db: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.db === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {DBS[k].name}
              </button>
            ))}
          </div>
          <motion.div
            key={s.db}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-3 py-2"
          >
            <p className="text-sm">{d.how}</p>
            <p className="text-muted mt-1 text-xs">
              <span className="text-bad font-medium">Watch out:</span> {d.watch}
            </p>
          </motion.div>
          <div className="flex flex-col gap-1">
            {MANAGED.map(([t, x]) => (
              <div key={t} className="border-line rounded-lg border px-3 py-1.5">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[11px]">{x}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every database already keeps a log of changes for its own recovery and replication. CDC
        reads that log, so it sees every committed change, in order, without touching the
        application.
      </p>
      <p>
        The classic operational trap is the PostgreSQL{" "}
        <Term id="replication-slot">replication slot</Term>. In India, Razorpay sends Aurora MySQL
        changes through Debezium into Amazon MSK, according to an AWS case study.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Consistent or not? ----------------------------------------------------------------------- */

export function Consistent() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Consistent or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="consistent-or-not"
            prompt="Can the database and the topic end up disagreeing?"
            categories={[
              { id: "safe", label: "Always agree (eventually)" },
              { id: "risk", label: "Can disagree" },
            ]}
            items={[
              {
                id: "dual",
                label: "Save the order, then publish to Kafka from the same code",
                category: "risk",
                why: "A crash or broker outage between the two loses the event.",
              },
              {
                id: "rev",
                label: "Publish to Kafka first, then save the order",
                category: "risk",
                why: "The save can fail after the event is out.",
              },
              {
                id: "outbox",
                label:
                  "Insert the order and an outbox row in one transaction; Debezium publishes the outbox",
                category: "safe",
                why: "Both commit or neither does; CDC delivers at least once.",
              },
              {
                id: "sep",
                label: "Insert the order, then insert the outbox row in a separate transaction",
                category: "risk",
                why: "Two transactions are just a dual write inside one database.",
              },
              {
                id: "cdc",
                label: "Debezium captures the orders table directly",
                category: "safe",
                why: "Every committed change is in the log. (It does expose your table's shape to consumers, which is why outboxes are popular.)",
              },
            ]}
            explanation="Write once, inside one transaction, and let something that reads the log do the publishing."
          />
        </div>
      }
    >
      <p>Five designs. Which ones can lose or invent an event?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Dual writes disagree", "Two systems, two commits, one will fail sometime."],
  ["Write once", "The outbox row commits with the business change."],
  ["Read the log", "CDC publishes every committed change, in order."],
  ["At least once", "Expect duplicates; dedupe by event id."],
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
        The Lakehouse track&apos;s CDC module shows where these events often end up: merged into
        tables. Next: agreeing on what an event looks like, and changing it safely.
      </p>
    </StepLayout>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ A row's life, told as events ⭐ -------------------------------------------------------------- */

type Ev = { op: "r" | "c" | "u" | "d" | "tomb"; text: string };
type Stage = { rows: [number, string, string][]; events: Ev[]; lake?: boolean };

const R1: [number, string, string] = [1, "Priya", "Pune"];
const R2: [number, string, string] = [2, "Arjun", "Delhi"];
const R3: [number, string, string] = [3, "Meera", "Chennai"];
const R1b: [number, string, string] = [1, "Priya", "Mumbai"];

const SNAP: Ev[] = [
  { op: "r", text: "after: {1, Priya, Pune}" },
  { op: "r", text: "after: {2, Arjun, Delhi}" },
];
const INS: Ev = { op: "c", text: "after: {3, Meera, Chennai}" };
const UPD: Ev = { op: "u", text: "before: {…Pune} → after: {…Mumbai}" };
const DEL: Ev = { op: "d", text: "before: {3, Meera, …}  after: null" };
const TOMB: Ev = { op: "tomb", text: "key 3 → null (tombstone)" };

const STAGES: Stage[] = [
  { rows: [R1, R2], events: [] },
  { rows: [R1, R2], events: SNAP },
  { rows: [R1, R2, R3], events: [...SNAP, INS] },
  { rows: [R1b, R2, R3], events: [...SNAP, INS, UPD] },
  { rows: [R1b, R2], events: [...SNAP, INS, UPD, DEL, TOMB] },
  { rows: [R1b, R2], events: [...SNAP, INS, UPD, DEL, TOMB], lake: true },
];

const OP_STYLE: Record<Ev["op"], string> = {
  r: "bg-viz-meta/15 text-viz-meta",
  c: "bg-viz-add/15 text-viz-add",
  u: "bg-accent-soft text-accent",
  d: "bg-viz-remove/15 text-viz-remove",
  tomb: "bg-surface-2 text-subtle",
};

function Table({ title, rows, tone }: { title: string; rows: Stage["rows"]; tone?: "lake" }) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        tone === "lake" ? "border-accent/50 bg-accent-soft" : "border-line bg-surface",
      )}
    >
      <p className="text-muted mb-2 font-mono text-[10px]">{title}</p>
      <div className="grid gap-1 font-mono text-[11px]">
        <AnimatePresence initial={false}>
          {rows.map(([k, n, c]) => (
            <motion.div
              key={k}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              className="bg-bg/50 grid grid-cols-[2rem_1fr_1fr] rounded px-2 py-1"
            >
              <span className="text-subtle">{k}</span>
              <span>{n}</span>
              <motion.span
                key={c}
                initial={{ color: "var(--accent)" }}
                animate={{ color: "var(--fg)" }}
                transition={{ duration: 1.2 }}
              >
                {c}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Scene({ stage }: { stage: number }) {
  const st = STAGES[stage];
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      <Table title="Postgres · brewline.customers" rows={st.rows} />
      <div className="border-line bg-bg/40 rounded-xl border p-3">
        <p className="text-muted mb-2 font-mono text-[10px]">
          Kafka topic · brewline.public.customers
        </p>
        <div className="grid min-h-8 gap-1">
          <AnimatePresence initial={false}>
            {st.events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 font-mono text-[10px]"
              >
                <span
                  className={cn(
                    "w-10 shrink-0 rounded px-1.5 py-0.5 text-center font-semibold",
                    OP_STYLE[e.op],
                  )}
                >
                  {e.op === "tomb" ? "∅" : `op:${e.op}`}
                </span>
                <span className="text-muted truncate">{e.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {st.events.length === 0 && <p className="text-subtle text-[11px]">No events yet</p>}
        </div>
      </div>
      <AnimatePresence>
        {st.lake && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <Table
              title="Lakehouse · silver.customers (events replayed)"
              rows={st.rows}
              tone="lake"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "statement",
    kicker: "The big idea",
    title: "A bank statement, not a balance",
    body: (
      <>
        <p>
          Your bank balance tells you what you have now. Your statement lists every deposit and
          withdrawal. Start from zero, replay the statement, and you arrive at the balance. You can
          also see <em>when</em> things changed.
        </p>
        <p>
          <Term id="cdc">Change data capture</Term> gives you a database&apos;s statement.
          Brewline&apos;s app keeps customers in Postgres; the lakehouse wants a copy that stays up
          to date.
        </p>
      </>
    ),
  },
  {
    id: "snapshot",
    kicker: "Step 1",
    title: "First, a snapshot",
    body: (
      <>
        <p>
          A CDC tool such as <Term id="debezium">Debezium</Term> starts by reading the rows that
          already exist. Each becomes an event with <code>op: r</code> (read).
        </p>
        <p>That&apos;s the opening balance.</p>
      </>
    ),
  },
  {
    id: "insert",
    kicker: "Step 2",
    title: "Then it follows the log",
    body: (
      <>
        <p>
          Every database already keeps a log of its changes, to recover after a crash: the WAL in
          Postgres, the binlog in MySQL. Debezium reads that log, not the tables, so the app
          doesn&apos;t slow down.
        </p>
        <p>
          Meera signs up. The insert becomes an event with <code>op: c</code> (create).
        </p>
      </>
    ),
  },
  {
    id: "update",
    kicker: "Step 3",
    title: "An update carries before and after",
    body: (
      <>
        <p>
          Priya moves to Mumbai. The event (<code>op: u</code>) can carry the row <em>before</em>{" "}
          and <em>after</em> the change, plus the change&apos;s position in the log. That position
          is what puts events back in order later.
        </p>
      </>
    ),
  },
  {
    id: "delete",
    kicker: "Step 4",
    title: "A delete, then a tombstone",
    body: (
      <>
        <p>
          Meera closes her account: <code>op: d</code>, with <code>after: null</code>. By default,
          Debezium follows it with a <Term id="tombstone">tombstone</Term>: a message with the key
          and no value, so Kafka can eventually forget everything about key 3.
        </p>
      </>
    ),
  },
  {
    id: "replay",
    kicker: "Step 5",
    title: "Replay the statement",
    body: (
      <>
        <p>
          Apply the events in order to an empty lakehouse table and you get the same rows as
          Postgres. That&apos;s the job of <Term id="merge">MERGE</Term>.
        </p>
        <p>
          The catch: events can arrive twice, late, or out of order. Getting the same answer anyway
          is what this module is about.
        </p>
      </>
    ),
  },
];

export function RowLife() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            A row&apos;s life, told as events
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Watch a database turn every change into a message, and a lakehouse table rebuild itself
            from them.
          </p>
        </div>
      }
    />
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CdcState } from "./state";

/* 2 ─ Anatomy of a change event ------------------------------------------------------------------ */

type Line = { text: string; field?: string; indent?: number };

const DEBEZIUM: Line[] = [
  { text: "{" },
  { text: '"before": { "id": 1, "name": "Priya", "city": "Pune" },', field: "before", indent: 1 },
  { text: '"after":  { "id": 1, "name": "Priya", "city": "Mumbai" },', field: "after", indent: 1 },
  { text: '"source": {', indent: 1 },
  { text: '"connector": "postgresql", "table": "customers",', indent: 2 },
  { text: '"txId": 5821, "lsn": 24023128,', field: "lsn", indent: 2 },
  { text: '"ts_ms": 1781083200000', field: "source.ts_ms", indent: 2 },
  { text: "},", indent: 1 },
  { text: '"op": "u",', field: "op", indent: 1 },
  { text: '"ts_ms": 1781083200412', field: "ts_ms", indent: 1 },
  { text: "}" },
];

const DMS: Line[] = [
  { text: "Op  | commit_ts                | id | name  | city", field: "dms-header" },
  { text: "U   | 2026-06-10 09:20:00.000  | 1  | Priya | Mumbai", field: "dms-op" },
];

const DATASTREAM: Line[] = [
  { text: "{" },
  { text: '"uuid": "6f1c…",', field: "uuid", indent: 1 },
  { text: '"source_timestamp": 1781083200000,', field: "ds-ts", indent: 1 },
  { text: '"sort_keys": [ … ],', field: "sort_keys", indent: 1 },
  { text: '"source_metadata": {', indent: 1 },
  {
    text: '"table": "customers", "change_type": "UPDATE", "is_deleted": false',
    field: "ds-meta",
    indent: 2,
  },
  { text: "},", indent: 1 },
  {
    text: '"payload": { "id": 1, "name": "Priya", "city": "Mumbai" }',
    field: "payload",
    indent: 1,
  },
  { text: "}" },
];

const FIELDS: Record<string, { title: string; text: string; warn?: string }> = {
  before: {
    title: "before",
    text: "The row as it was before the change. Empty for inserts.",
    warn: "Postgres only puts the primary key here unless the table uses REPLICA IDENTITY FULL. Unchanged large (TOASTed) columns can arrive as a placeholder, not their value: never copy them blindly.",
  },
  after: { title: "after", text: "The row after the change. null for deletes." },
  lsn: {
    title: "source.lsn",
    text: "The change's position in the Postgres write-ahead log. It only ever grows, so it's the right thing to order events by. MySQL uses the binlog file and position (or a GTID) instead.",
  },
  "source.ts_ms": {
    title: "source.ts_ms",
    text: "When the change happened in the database. Useful, but two changes can share a millisecond: break ties with the log position.",
  },
  op: {
    title: "op",
    text: "What happened: c (create), u (update), d (delete), r (read during the snapshot). There's also t (truncate) and m (message).",
  },
  ts_ms: {
    title: "ts_ms (top level)",
    text: "When Debezium processed the event, not when the change happened.",
    warn: "A classic mistake: sorting changes by this. After a connector restart, old changes get new, later ts_ms values.",
  },
  "dms-header": {
    title: "AWS DMS writing to S3",
    text: "DMS does a full load, then streams changes as CSV or Parquet files. The first column of each change record says I, U or D; it's usually named Op. There's no before image.",
    warn: "Full-load files have no Op column unless IncludeOpForFullLoad is on. By default the files don't preserve transaction order, so add a commit timestamp column (TimestampColumnName) to sort by.",
  },
  "dms-op": {
    title: "One change, one row",
    text: "I = insert, U = update, D = delete. The rest of the row is the new values (or, for a delete, the old ones).",
  },
  uuid: { title: "uuid", text: "A unique ID per event: handy for spotting duplicates." },
  "ds-ts": { title: "source_timestamp", text: "When the row changed in the source database." },
  sort_keys: {
    title: "sort_keys",
    text: "Values you can sort by to put events in the order they happened. Use these, not arrival order.",
  },
  "ds-meta": {
    title: "source_metadata",
    text: "Source-specific details, including the kind of change and whether the row was deleted.",
  },
  payload: { title: "payload", text: "The row's values after the change." },
};

const TOOLS: Record<CdcState["tool"], { lines: Line[]; first: string; note: string }> = {
  debezium: {
    lines: DEBEZIUM,
    first: "op",
    note: "Open source; runs on Kafka Connect (or standalone as Debezium Server). Supports Postgres, MySQL, SQL Server, Oracle, MongoDB and more.",
  },
  dms: {
    lines: DMS,
    first: "dms-header",
    note: "AWS Database Migration Service. Can also write to Kinesis, Kafka and databases.",
  },
  datastream: {
    lines: DATASTREAM,
    first: "sort_keys",
    note: "Google Cloud's serverless CDC. Writes to BigQuery or to Cloud Storage files.",
  },
};

export function EventAnatomy() {
  const [s, set] = useSceneState<CdcState>();
  const tool = TOOLS[s.tool];
  const info = FIELDS[s.field] ?? FIELDS[tool.first];
  return (
    <StepLayout
      eyebrow="Look closer"
      title="Anatomy of a change event"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.tool}
            options={[
              ["debezium", "Debezium"],
              ["dms", "AWS DMS"],
              ["datastream", "Datastream"],
            ]}
            onChange={(v) => {
              const t = v as CdcState["tool"];
              set({ tool: t, field: TOOLS[t].first });
            }}
          />
          <p className="text-muted text-xs">
            Priya moves from Pune to Mumbai. Click a highlighted line to see what it means.
          </p>
          <div className="bg-surface-2 overflow-x-auto rounded-xl p-3 font-mono text-[11px] leading-relaxed">
            {tool.lines.map((l, i) =>
              l.field ? (
                <button
                  key={i}
                  type="button"
                  onClick={() => set({ field: l.field })}
                  style={{ paddingLeft: `${(l.indent ?? 0) * 1.25 + 0.25}rem` }}
                  className={cn(
                    "block w-full rounded text-left whitespace-pre transition",
                    s.field === l.field
                      ? "bg-accent-soft text-accent ring-accent/50 ring-1"
                      : "hover:bg-surface underline decoration-dotted underline-offset-4",
                  )}
                >
                  {l.text}
                </button>
              ) : (
                <div
                  key={i}
                  style={{ paddingLeft: `${(l.indent ?? 0) * 1.25 + 0.25}rem` }}
                  className="text-muted whitespace-pre"
                >
                  {l.text}
                </div>
              ),
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.tool + s.field}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-mono text-sm font-semibold">{info.title}</p>
              <p className="text-muted mt-1 text-sm">{info.text}</p>
              {info.warn && (
                <p className="border-viz-compute/40 bg-viz-compute/10 mt-2 rounded-lg border px-3 py-2 text-xs">
                  {info.warn}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">{tool.note}</p>
        </div>
      }
    >
      <p>
        Every CDC tool describes a change with the same ingredients: <em>which row</em>,{" "}
        <em>what happened</em>, <em>the new values</em>, and <em>where in the log</em> it happened.
      </p>
      <p>
        That last one matters most. Events can be delivered twice or out of order, and the log
        position is how you put them back.
      </p>
      <p>
        <Term id="debezium">Debezium</Term> is the open-source standard; AWS DMS and Google
        Datastream are managed services. Switch between them: same change, different wrapping.
      </p>
    </StepLayout>
  );
}

/* 3 ─ MERGE, clause by clause -------------------------------------------------------------------- */

type TRow = {
  id: number;
  name: string;
  city: string;
  state?: "matched" | "gone" | "new" | "changed" | "idle";
};

const SQL = [
  "MERGE INTO silver.customers AS t",
  "USING updates AS s",
  "ON t.id = s.id",
  "WHEN MATCHED AND s.op = 'd' THEN DELETE",
  "WHEN MATCHED THEN UPDATE SET name = s.name, city = s.city",
  "WHEN NOT MATCHED AND s.op != 'd' THEN INSERT (id, name, city)",
  "  VALUES (s.id, s.name, s.city)",
];

const SOURCE = [
  { id: 1, op: "u", text: "Priya → Mumbai" },
  { id: 3, op: "d", text: "Meera (delete)" },
  { id: 4, op: "c", text: "Kabir, Goa" },
];

const MERGE_FRAMES: {
  title: string;
  text: string;
  lines: number[];
  target: TRow[];
  src: number[];
  tone?: "good";
}[] = [
  {
    title: "Two tables",
    text: "The target is the lakehouse table. The source, 'updates', is this batch of change events: one row per customer.",
    lines: [0, 1],
    target: [
      { id: 1, name: "Priya", city: "Pune" },
      { id: 2, name: "Arjun", city: "Delhi" },
      { id: 3, name: "Meera", city: "Chennai" },
    ],
    src: [],
  },
  {
    title: "ON pairs them up",
    text: "Each source row looks for a target row with the same id. Customers 1 and 3 are matched; customer 4 has no match; customer 2 has no event, so it isn't touched.",
    lines: [2],
    target: [
      { id: 1, name: "Priya", city: "Pune", state: "matched" },
      { id: 2, name: "Arjun", city: "Delhi", state: "idle" },
      { id: 3, name: "Meera", city: "Chennai", state: "matched" },
    ],
    src: [1, 3, 4],
  },
  {
    title: "Matched + delete → DELETE",
    text: "Clauses are tried top to bottom and the first one that fits wins. Meera's event is a delete, so her row goes.",
    lines: [3],
    target: [
      { id: 1, name: "Priya", city: "Pune", state: "matched" },
      { id: 2, name: "Arjun", city: "Delhi", state: "idle" },
      { id: 3, name: "Meera", city: "Chennai", state: "gone" },
    ],
    src: [3],
  },
  {
    title: "Matched → UPDATE",
    text: "Priya's event isn't a delete, so the next clause applies: her row takes the new values.",
    lines: [4],
    target: [
      { id: 1, name: "Priya", city: "Mumbai", state: "changed" },
      { id: 2, name: "Arjun", city: "Delhi", state: "idle" },
    ],
    src: [1],
  },
  {
    title: "Not matched → INSERT",
    text: "Kabir is new, so he's inserted. The \"s.op != 'd'\" guard stops a delete for an unknown customer from being inserted as a row.",
    lines: [5, 6],
    target: [
      { id: 1, name: "Priya", city: "Mumbai" },
      { id: 2, name: "Arjun", city: "Delhi", state: "idle" },
      { id: 4, name: "Kabir", city: "Goa", state: "new" },
    ],
    src: [4],
  },
  {
    title: "One commit",
    text: "All of it lands as a single atomic commit: readers see the table before or after, never half-way. (There's also WHEN NOT MATCHED BY SOURCE, for target rows with no event, e.g. to delete rows missing from a full snapshot.)",
    lines: [],
    target: [
      { id: 1, name: "Priya", city: "Mumbai" },
      { id: 2, name: "Arjun", city: "Delhi" },
      { id: 4, name: "Kabir", city: "Goa" },
    ],
    src: [],
    tone: "good",
  },
];

const ROW_STYLE: Record<NonNullable<TRow["state"]>, string> = {
  matched: "border-accent/60 bg-accent-soft",
  gone: "border-viz-remove/60 bg-viz-remove/10 line-through opacity-60",
  new: "border-viz-add/60 bg-viz-add/10",
  changed: "border-viz-add/60 bg-viz-add/10",
  idle: "border-line opacity-50",
};

export function MergeWalk() {
  const [s, set] = useSceneState<CdcState>();
  const f = MERGE_FRAMES[s.mergeStep];
  return (
    <StepLayout
      eyebrow="Step through"
      title="MERGE, clause by clause"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <pre className="bg-surface-2 overflow-x-auto rounded-xl p-3 font-mono text-[11px] leading-relaxed">
            {SQL.map((l, i) => (
              <motion.div
                key={i}
                animate={{ opacity: f.lines.length === 0 || f.lines.includes(i) ? 1 : 0.35 }}
                className={cn("rounded px-1", f.lines.includes(i) && "bg-accent-soft text-accent")}
              >
                {l}
              </motion.div>
            ))}
          </pre>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1.5 text-xs">Source: updates</p>
              <div className="grid gap-1.5">
                {SOURCE.map((r) => (
                  <div
                    key={r.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-1.5 font-mono text-[11px] transition",
                      f.src.includes(r.id) ? "border-accent/60 bg-accent-soft" : "border-line",
                    )}
                  >
                    <span>
                      {r.id} · {r.text}
                    </span>
                    <span className="text-muted">op:{r.op}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-muted mb-1.5 text-xs">Target: silver.customers</p>
              <div className="grid gap-1.5">
                <AnimatePresence initial={false}>
                  {f.target.map((r) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      className={cn(
                        "rounded-lg border px-3 py-1.5 font-mono text-[11px]",
                        r.state ? ROW_STYLE[r.state] : "border-line",
                      )}
                    >
                      {r.id} · {r.name}, {r.city}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <Stepper
            step={s.mergeStep}
            count={MERGE_FRAMES.length}
            onChange={(n) => set({ mergeStep: n })}
          />
          <FrameCaption frameKey={s.mergeStep} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        <Term id="merge">MERGE</Term> compares a batch of changes (the source) with a table (the
        target) and decides, row by row, whether to update, delete or insert. It&apos;s how the
        lakehouse does an <Term id="upsert">upsert</Term>.
      </p>
      <p>
        It works in Delta, Iceberg and Hudi from Spark, and in most engines that write these
        formats. Step through one batch.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: two events for a new customer ------------------------------------------------- */

export function TwoInsertsCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Two events, one new customer"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="two-inserts"
            prompt="One batch holds two events for customer 9, who isn't in the table yet: a create (Goa), then an update (Pune). You run the MERGE from the last step on the raw batch. What happens?"
            options={[
              {
                id: "error",
                label: "It fails: two source rows match the same customer",
                feedback:
                  "That error only fires when several source rows match one existing target row. Customer 9 has no target row yet.",
              },
              {
                id: "two",
                label: "Two rows for customer 9 are inserted: Goa and Pune",
                correct: true,
                feedback:
                  "Right. Both source rows are NOT MATCHED, so each is inserted. The table now has a duplicate.",
              },
              {
                id: "latest",
                label: "Only Pune is kept, because it came later",
                feedback: "MERGE has no idea which came later. It only sees two unmatched rows.",
              },
              {
                id: "first",
                label: "Goa is inserted, then updated to Pune",
                feedback:
                  "Rows are matched against the table as it was before the MERGE, so the update can't see the row that's being inserted.",
              },
            ]}
            explanation="MERGE needs one source row per key. Before merging, keep only each key's latest event in the batch, ordered by log position."
          />
        </div>
      }
    >
      <p>
        The batch in the last step had one event per customer. Real batches don&apos;t: a busy
        customer can change three times in one minute.
      </p>
    </StepLayout>
  );
}

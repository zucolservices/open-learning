"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { applyTransform, SAMPLE_ROWS, TRANSFORMS, type TransformId } from "./data";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import type { IcebergState } from "./state";

/* 8 ─ Hidden partitioning ---------------------------------------------------- */

const DAYS = ["2026-09-22", "2026-09-23", "2026-09-24"];

export function HiddenPartitioning() {
  const [s, set] = useSceneState<IcebergState>();
  const t = TRANSFORMS[s.transform];
  const hive = s.hiddenMode === "hive";

  return (
    <StepLayout
      eyebrow="Partitioning"
      title="Hidden partitioning"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-col gap-3">
            <Segmented
              size="sm"
              value={s.transform}
              options={(Object.keys(TRANSFORMS) as TransformId[]).map(
                (k) => [k, TRANSFORMS[k].sql] as [string, string],
              )}
              onChange={(v) => set({ transform: v as TransformId })}
            />
            <Code>{`CREATE TABLE orders (…) USING iceberg\nPARTITIONED BY (${t.sql});`}</Code>
            <div className="border-line bg-surface overflow-x-auto rounded-xl border">
              <table className="w-full font-mono text-[11px]">
                <thead className="bg-surface-2/60 text-muted">
                  <tr>
                    <th className="px-3 py-1.5 text-left font-medium">order_id</th>
                    <th
                      className={cn(
                        "px-3 text-left font-medium",
                        t.source === "customer_id" && "text-accent",
                      )}
                    >
                      customer_id
                    </th>
                    <th
                      className={cn(
                        "px-3 text-left font-medium",
                        t.source === "order_ts" && "text-accent",
                      )}
                    >
                      order_ts (UTC)
                    </th>
                    <th className="text-viz-meta px-3 text-left font-medium">→ partition</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_ROWS.map((row) => (
                    <tr key={row.order_id} className="border-line border-t">
                      <td className="px-3 py-1">{row.order_id}</td>
                      <td className="px-3">{row.customer_id}</td>
                      <td className="px-3 whitespace-nowrap">{row.order_ts}</td>
                      <td className="px-3">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${s.transform}-${row.order_id}`}
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-viz-meta bg-viz-meta/10 inline-block rounded px-1.5 whitespace-nowrap"
                          >
                            {applyTransform(s.transform, row)}
                          </motion.span>
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-muted text-xs">{t.note}</p>
          </div>

          <div className="border-line bg-bg/40 flex flex-col gap-3 rounded-2xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">Same query, two designs</p>
              <Segmented
                size="sm"
                value={s.hiddenMode}
                options={[
                  ["hive", "Hive-style"],
                  ["iceberg", "Iceberg"],
                ]}
                onChange={(v) => set({ hiddenMode: v as IcebergState["hiddenMode"] })}
              />
            </div>
            <Code>{"SELECT * FROM orders\nWHERE order_ts >= '2026-09-24 09:00';"}</Code>
            <div className="flex gap-1.5">
              {DAYS.map((d) => {
                const read = hive || d === "2026-09-24";
                return (
                  <motion.div
                    key={d}
                    animate={{ opacity: read ? 1 : 0.3 }}
                    className={cn(
                      "flex-1 rounded-lg border px-2 py-1.5 text-center font-mono text-[10px]",
                      read
                        ? "border-viz-compute/60 bg-viz-compute/20"
                        : "border-line border-dashed",
                    )}
                  >
                    {hive ? `order_date=${d.slice(5)}` : d.slice(5)}
                    <span className="text-muted block">{read ? "scanned" : "skipped"}</span>
                  </motion.div>
                );
              })}
            </div>
            <p className="text-muted text-xs">
              {hive
                ? "The table is partitioned by a separate order_date column that writers must fill in. The query filters on order_ts, which Hive can't connect to order_date, so every partition is scanned. You have to remember to add AND order_date >= '2026-09-24', and if a writer ever fills order_date in local time, rows land in the wrong partition and filters silently miss them."
                : "The table knows its partition is days(order_ts), so a filter on order_ts is turned into a partition filter automatically. There's no extra column to fill in or remember, and the partition value can never disagree with order_ts."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        With Hive-style tables, partitioning was something users had to see and manage: an extra
        column, folder names like <code>order_date=2026-09-24/</code>, and queries that had to
        mention it.
      </p>
      <p>
        Iceberg <Term id="hidden-partitioning">hides it</Term>. You declare a{" "}
        <Term id="partition-transform">transform</Term> of a normal column, and Iceberg derives the
        partition value on write and applies it on read. Try the transforms, then compare the two
        designs.
      </p>
      <p className="text-subtle text-xs">
        Other transforms: <code>identity</code>, <code>years</code>, <code>truncate(W, col)</code>{" "}
        and <code>void</code>. The bucket values above are real: Iceberg hashes the value with
        Murmur3 so every engine agrees. Choosing a good scheme is its own module:{" "}
        <em>Partitioning done right</em>.
      </p>
    </StepLayout>
  );
}

/* 9 ─ Partition evolution ------------------------------------------------------ */

const MONTHS = ["2026-06", "2026-07", "2026-08"];
const SEP_DAYS = Array.from({ length: 24 }, (_, i) => `09-${String(i + 1).padStart(2, "0")}`);

const EVO_QUERIES: Record<IcebergState["evoQuery"], { label: string; sql: string }> = {
  old: { label: "Aug 15", sql: "WHERE order_ts >= '2026-08-15' AND order_ts < '2026-08-16'" },
  new: { label: "Sep 20", sql: "WHERE order_ts >= '2026-09-20' AND order_ts < '2026-09-21'" },
  both: {
    label: "Aug 25 – Sep 5",
    sql: "WHERE order_ts >= '2026-08-25' AND order_ts < '2026-09-06'",
  },
};

function monthRead(q: IcebergState["evoQuery"], m: string) {
  return m === "2026-08" && (q === "old" || q === "both");
}
function dayRead(q: IcebergState["evoQuery"], d: string) {
  const n = Number(d.slice(3));
  return (q === "new" && n === 20) || (q === "both" && n <= 5);
}

export function PartitionEvolution() {
  const [s, set] = useSceneState<IcebergState>();
  const q = s.evoQuery;
  const sepMonthRead = !s.evolved && (q === "new" || q === "both");

  return (
    <StepLayout
      eyebrow="Partitioning"
      title="Change partitioning without a rewrite"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => set({ evolved: !s.evolved })}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                s.evolved
                  ? "bg-surface-2 text-muted hover:text-fg"
                  : "bg-accent text-accent-fg hover:brightness-110",
              )}
            >
              {s.evolved ? "Undo (back to monthly)" : "Switch to daily from Sep 1"}
            </button>
            <span className="text-muted font-mono text-xs">
              data files rewritten: <strong className="text-good">0</strong>
            </span>
          </div>
          <Code className="whitespace-pre-wrap">
            {s.evolved
              ? "ALTER TABLE orders\n  REPLACE PARTITION FIELD order_ts_month WITH day(order_ts);"
              : "-- partitioned by months(order_ts) since 2026-06 (spec 0)"}
          </Code>

          <div className="border-line bg-bg/40 rounded-2xl border p-4">
            <div className="flex gap-1.5">
              {MONTHS.map((m) => (
                <Block key={m} read={monthRead(q, m)} className="w-16 shrink-0 sm:w-20">
                  {m.slice(5)}
                  <span className="text-subtle block text-[9px]">month</span>
                </Block>
              ))}
              <AnimatePresence mode="popLayout" initial={false}>
                {s.evolved ? (
                  <motion.div
                    key="days"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid flex-1 grid-cols-6 gap-0.5 sm:grid-cols-8"
                  >
                    {SEP_DAYS.map((d) => (
                      <Block key={d} read={dayRead(q, d)} small>
                        {d.slice(3)}
                      </Block>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="sep"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1"
                  >
                    <Block read={sepMonthRead} className="h-full">
                      09
                      <span className="text-subtle block text-[9px]">month</span>
                    </Block>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="text-subtle mt-2 flex justify-between text-[10px]">
              <span>spec 0: months(order_ts)</span>
              <span>{s.evolved ? "spec 1: days(order_ts), from Sep 1" : "still spec 0"}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Query:</span>
            <Segmented
              size="sm"
              value={q}
              options={(Object.keys(EVO_QUERIES) as IcebergState["evoQuery"][]).map(
                (k) => [k, EVO_QUERIES[k].label] as [string, string],
              )}
              onChange={(v) => set({ evoQuery: v as IcebergState["evoQuery"] })}
            />
          </div>
          <FrameCaption frameKey={`${s.evolved}-${q}`} title={EVO_QUERIES[q].sql}>
            {evoText(s.evolved, q)}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Brewline started with monthly partitions. Orders grew, and a month became too big to scan
        for a one-day report.
      </p>
      <p>
        With Hive-style tables, changing that meant rewriting the whole table into new folders. In
        Iceberg it&apos;s <Term id="partition-evolution">partition evolution</Term>: a metadata
        change. New data uses the new spec, old files keep theirs, and each manifest records which
        spec its files use.
      </p>
      <p>Switch to daily, then run each query and watch what&apos;s read.</p>
    </StepLayout>
  );
}

function evoText(evolved: boolean, q: IcebergState["evoQuery"]) {
  if (!evolved) {
    return q === "old"
      ? "Reads the whole August month partition to find one day."
      : q === "new"
        ? "Reads all of September so far to find one day. This is why Brewline wants daily partitions."
        : "Reads two whole months: August and September.";
  }
  return q === "old"
    ? "August was written before the change, so it's still one monthly partition. Old data is never rewritten, so old queries keep their old cost."
    : q === "new"
      ? "Only the Sep 20 daily partition is read. New data benefits right away."
      : "Iceberg plans each spec separately: the August month partition from spec 0, plus Sep 1–5 daily partitions from spec 1. One query, two layouts, correct results.";
}

function Block({
  read,
  small,
  className,
  children,
}: {
  read: boolean;
  small?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ opacity: read ? 1 : 0.55 }}
      className={cn(
        "grid place-items-center rounded-md border text-center font-mono transition-colors",
        small ? "py-1 text-[9px]" : "py-3 text-[11px]",
        read ? "border-viz-compute bg-viz-compute/30" : "border-viz-data/40 bg-viz-data/10",
        className,
      )}
    >
      <span>{children}</span>
    </motion.div>
  );
}

/* 10 ─ Field IDs ------------------------------------------------------------- */

interface Col {
  id: number;
  name: string;
}

const OLD_FILE: { id: number; name: string; value: string }[] = [
  { id: 1, name: "order_id", value: "1042" },
  { id: 2, name: "customer_id", value: "7" },
  { id: 3, name: "order_ts", value: "09-24 00:04" },
  { id: 4, name: "amount", value: "410" },
  { id: 5, name: "status", value: "refund" },
];

const SCHEMAS: { op: string; sql: string; cols: Col[] }[] = [
  {
    op: "Starting schema",
    sql: "-- orders(order_id, customer_id, order_ts, amount, status)",
    cols: [
      { id: 1, name: "order_id" },
      { id: 2, name: "customer_id" },
      { id: 3, name: "order_ts" },
      { id: 4, name: "amount" },
      { id: 5, name: "status" },
    ],
  },
  {
    op: "Rename a column",
    sql: "ALTER TABLE orders RENAME COLUMN amount TO total;",
    cols: [
      { id: 1, name: "order_id" },
      { id: 2, name: "customer_id" },
      { id: 3, name: "order_ts" },
      { id: 4, name: "total" },
      { id: 5, name: "status" },
    ],
  },
  {
    op: "Drop a column",
    sql: "ALTER TABLE orders DROP COLUMN status;",
    cols: [
      { id: 1, name: "order_id" },
      { id: 2, name: "customer_id" },
      { id: 3, name: "order_ts" },
      { id: 4, name: "total" },
    ],
  },
  {
    op: "Add a column with the old name",
    sql: "ALTER TABLE orders ADD COLUMN status string;\n-- a new meaning: delivery status",
    cols: [
      { id: 1, name: "order_id" },
      { id: 2, name: "customer_id" },
      { id: 3, name: "order_ts" },
      { id: 4, name: "total" },
      { id: 6, name: "status" },
    ],
  },
];

function resolve(col: Col, by: "name" | "id") {
  const hit = OLD_FILE.find((c) => (by === "id" ? c.id === col.id : c.name === col.name));
  const value = hit ? hit.value : "null";
  // The right answer is always by ID.
  const truth = OLD_FILE.find((c) => c.id === col.id)?.value ?? "null";
  return { value, ok: value === truth };
}

export function FieldIds() {
  const [s, set] = useSceneState<IcebergState>();
  const step = Math.min(s.schemaOps, SCHEMAS.length - 1);
  const schema = SCHEMAS[step];
  const results = schema.cols.map((c) => ({ col: c, ...resolve(c, s.matchBy) }));
  const wrong = results.filter((r) => !r.ok);

  return (
    <StepLayout
      eyebrow="Schema evolution"
      title="Why every column has an ID"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.matchBy}
            options={[
              ["name", "Match columns by name"],
              ["id", "Match by field ID (Iceberg)"],
            ]}
            onChange={(v) => set({ matchBy: v as IcebergState["matchBy"] })}
          />
          <Stepper
            step={step}
            count={SCHEMAS.length}
            onChange={(n) => set({ schemaOps: n })}
            label={<span className="text-fg font-medium">{schema.op}</span>}
          />
          <Code className="whitespace-pre-wrap">{schema.sql}</Code>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-2 text-xs">Old data file, written at the start</p>
              <ul className="grid gap-1 font-mono text-[11px]">
                {OLD_FILE.map((c) => (
                  <li key={c.id} className="flex items-center gap-2">
                    <span className="bg-viz-meta/15 text-viz-meta rounded px-1">id {c.id}</span>
                    <span className="text-muted">{c.name}</span>
                    <span className="ml-auto">{c.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-line bg-surface rounded-xl border p-3">
              <p className="text-muted mb-2 text-xs">Reading that file with today&apos;s schema</p>
              <ul className="grid gap-1 font-mono text-[11px]">
                {results.map(({ col, value, ok }) => (
                  <motion.li
                    layout
                    key={`${col.id}-${col.name}`}
                    className={cn(
                      "flex items-center gap-2 rounded px-1",
                      ok ? "" : "bg-bad/15 text-bad",
                    )}
                  >
                    <span className="bg-viz-meta/15 text-viz-meta rounded px-1">id {col.id}</span>
                    <span>{col.name}</span>
                    <span className="ml-auto">{value}</span>
                    {ok ? <Check className="text-good size-3.5" /> : <X className="size-3.5" />}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <FrameCaption
            frameKey={`${step}-${s.matchBy}`}
            title={wrong.length ? "Silently wrong" : "Correct"}
            tone={wrong.length ? "bad" : "good"}
          >
            {fieldIdText(step, s.matchBy)}
          </FrameCaption>
        </div>
      }
    >
      <p>
        When a table&apos;s schema changes, old data files aren&apos;t rewritten. So every read has
        to answer: which column in this old file is which column in today&apos;s schema?
      </p>
      <p>
        Matching by name looks natural, and it&apos;s what many Hive-era readers did. Iceberg
        instead gives every column a permanent <Term id="field-id">field ID</Term>, stored in the
        metadata and in each data file. Names are just labels.
      </p>
      <p>Step through the changes with each matching rule.</p>
      <p className="text-subtle text-xs">
        Safe type widening (int → long, float → double, larger decimals) is also metadata-only. More
        in the <em>Schema evolution</em> module.
      </p>
    </StepLayout>
  );
}

function fieldIdText(step: number, by: "name" | "id") {
  if (step === 0) return "Nothing has changed yet, so both rules agree.";
  if (by === "name") {
    if (step === 1)
      return "The old file has no column called total, so every old amount reads as null. Data looks lost.";
    if (step === 2) return "Still broken: total is null for every old row.";
    return "Worse: the new status column picks up the old, dropped status values. Old refunds now look like delivery statuses. No error is raised.";
  }
  if (step === 1)
    return "total is field 4, and so was amount. Old values are found by ID, whatever the column is called now.";
  if (step === 2)
    return "Field 5 is gone from the schema, so it's simply not read. The file isn't touched.";
  return "The new status gets a new ID, 6. Old files have no field 6, so it's null for old rows, exactly as it should be.";
}

/* 11 ─ Checkpoint: metadata-only or rewrite? ----------------------------------- */

export function EvolutionSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Metadata only, or a rewrite?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="metadata-or-rewrite"
            prompt="Which of these changes to an Iceberg table rewrite existing data files?"
            categories={[
              { id: "meta", label: "Metadata only" },
              { id: "rewrite", label: "Rewrites data files" },
            ]}
            items={[
              {
                id: "rename",
                label: "Rename amount to total",
                category: "meta",
                why: "Columns are matched by field ID, so the name is just a label in the schema.",
              },
              {
                id: "add",
                label: "Add a column",
                category: "meta",
                why: "The new column gets a new ID. Old files don't have it, so it reads as null.",
              },
              {
                id: "widen",
                label: "Widen amount from int to long",
                category: "meta",
                why: "An allowed promotion: readers convert old int values as they read them.",
              },
              {
                id: "spec",
                label: "Partition new data by day instead of month",
                category: "meta",
                why: "Partition evolution: a new spec for new data, old files keep theirs.",
              },
              {
                id: "compact",
                label: "Merge 10,000 small files into 40 big ones",
                category: "rewrite",
                why: "Compaction reads the small files and writes new, bigger ones, then commits the swap.",
              },
              {
                id: "repartition",
                label: "Make last year's data use daily partitions too",
                category: "rewrite",
                why: "Old files only change layout if you rewrite them, e.g. with the rewrite_data_files procedure.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Sort each change. Remember: data files are never edited, and the tree records what each file
        means.
      </p>
    </StepLayout>
  );
}

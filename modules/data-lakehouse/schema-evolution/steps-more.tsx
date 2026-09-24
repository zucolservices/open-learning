"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { SchemaState } from "./state";

/* 4 ─ The change menu -------------------------------------------------------------------- */

type Change = SchemaState["change"];
type Verdict = "safe" | "setting" | "danger";

const verdictCls: Record<Verdict, string> = {
  safe: "border-good/40 bg-good/10",
  setting: "border-viz-compute/40 bg-viz-compute/10",
  danger: "border-bad/40 bg-bad/10",
};
const verdictLabel: Record<Verdict, string> = {
  safe: "Safe, metadata only",
  setting: "Safe once switched on",
  danger: "Can silently return wrong data",
};

const CHANGES: Record<Change, { label: string; sql: string; cells: [string, Verdict, string][] }> =
  {
    add: {
      label: "Add a column",
      sql: "ALTER TABLE orders ADD COLUMN coupon STRING;",
      cells: [
        [
          "Hive-style",
          "safe",
          "Old files don't have it, so it reads as null. Add new columns at the end.",
        ],
        ["Delta Lake", "safe", "ALTER TABLE, or mergeSchema on a write. Old rows read null."],
        ["Iceberg", "safe", "Gets a new column ID; old files have no such ID, so null."],
        ["Hudi", "safe", "A new nullable column in an incoming batch is added automatically."],
      ],
    },
    drop: {
      label: "Drop a column",
      sql: "ALTER TABLE orders DROP COLUMN status;",
      cells: [
        [
          "Hive-style",
          "danger",
          "With ORC or CSV, Hive matches columns by position: every column after the dropped one reads its neighbour's values.",
        ],
        [
          "Delta Lake",
          "setting",
          "Needs column mapping. Metadata only; the bytes stay in files until rewritten.",
        ],
        ["Iceberg", "safe", "Metadata only. The column's ID is never reused."],
        [
          "Hudi",
          "setting",
          "Needs its (experimental) schema-on-read mode, or an explicit allow-drop setting.",
        ],
      ],
    },
    rename: {
      label: "Rename a column",
      sql: "ALTER TABLE orders RENAME COLUMN amount TO order_total;",
      cells: [
        [
          "Hive-style",
          "danger",
          "With Parquet, matched by name: old files have no column by the new name, so every old row reads null. (The Monday incident.)",
        ],
        [
          "Delta Lake",
          "setting",
          "Needs column mapping (delta.columnMapping.mode = 'name'), then metadata only.",
        ],
        ["Iceberg", "safe", "Metadata only: files are read by column ID, not name."],
        ["Hudi", "setting", "Needs its (experimental) schema-on-read mode."],
      ],
    },
    reorder: {
      label: "Reorder columns",
      sql: "ALTER TABLE orders ALTER COLUMN status FIRST;",
      cells: [
        [
          "Hive-style",
          "danger",
          "Fine with Parquet (by name), but ORC and CSV read by position, so values shift.",
        ],
        [
          "Delta Lake",
          "safe",
          "Metadata only: Delta reads Parquet columns by name (or by ID with column mapping).",
        ],
        ["Iceberg", "safe", "Metadata only."],
        ["Hudi", "setting", "Needs its (experimental) schema-on-read mode."],
      ],
    },
    widen: {
      label: "Widen a type",
      sql: "ALTER TABLE orders ALTER COLUMN amount TYPE BIGINT;  -- was INT",
      cells: [
        [
          "Hive-style",
          "danger",
          "Only the metastore changes. Whether old files read correctly depends on the reader.",
        ],
        [
          "Delta Lake",
          "setting",
          "Type widening (delta.enableTypeWidening, Delta 4.0+): int→long, float→double, bigger decimals, date→timestamp_ntz. No rewrite.",
        ],
        [
          "Iceberg",
          "safe",
          "Allowed promotions: int→long, float→double, bigger decimal precision (v3 adds date→timestamp).",
        ],
        [
          "Hudi",
          "safe",
          "Widening on write is allowed (e.g. int→long, float→double); narrowing never is.",
        ],
      ],
    },
  };

export function ChangeMenu() {
  const [s, set] = useSceneState<SchemaState>();
  const c = CHANGES[s.change];

  return (
    <StepLayout
      eyebrow="Evolution"
      title="The change menu"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(CHANGES) as Change[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ change: k })}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  k === s.change
                    ? "bg-accent text-accent-fg"
                    : "bg-surface-2 text-muted hover:text-fg",
                )}
              >
                {CHANGES[k].label}
              </button>
            ))}
          </div>
          <Code>{c.sql}</Code>
          <AnimatePresence mode="wait">
            <motion.div
              key={s.change}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-2.5 sm:grid-cols-2"
            >
              {c.cells.map(([who, v, text], i) => (
                <motion.div
                  key={who}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={cn("rounded-xl border p-3", verdictCls[v])}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold">{who}</p>
                    <span className="text-muted text-[10px]">{verdictLabel[v]}</span>
                  </div>
                  <p className="text-muted mt-1 text-xs leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
          <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            {(Object.keys(verdictLabel) as Verdict[]).map((v) => (
              <li key={v} className="flex items-center gap-1.5">
                <span className={cn("size-2.5 rounded-sm border", verdictCls[v])} />
                {verdictLabel[v]}
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <p>
        Every change comes down to one question: when an old file is read with the new schema, how
        is each column found? By <strong>position</strong>, by <strong>name</strong>, or by a
        permanent <Term id="field-id">ID</Term>?
      </p>
      <p>
        Position breaks on drops and reorders. Name breaks on renames. IDs survive both, which is
        why Iceberg uses them and Delta added <Term id="column-mapping">column mapping</Term>. Pick
        each change and compare.
      </p>
      <p className="text-subtle text-xs">
        None of these rewrite existing data files. That&apos;s the point: evolution is a metadata
        change, and the table format decides whether old files are still read correctly.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: safe type changes ------------------------------------------------------ */

export function TypeSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which type changes are safe?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="type-changes"
            prompt="In a table format like Iceberg (or Delta with type widening), which changes can be made in metadata only?"
            categories={[
              { id: "safe", label: "Safe widening" },
              { id: "rewrite", label: "Not allowed as-is" },
            ]}
            items={[
              {
                id: "int-long",
                label: "INT → BIGINT",
                category: "safe",
                why: "Every INT value fits in a BIGINT, so old files can be read as-is.",
              },
              {
                id: "float-double",
                label: "FLOAT → DOUBLE",
                category: "safe",
                why: "Every FLOAT is exactly representable as a DOUBLE.",
              },
              {
                id: "decimal",
                label: "DECIMAL(10,2) → DECIMAL(12,2)",
                category: "safe",
                why: "More precision, same scale: every old value still fits.",
              },
              {
                id: "long-int",
                label: "BIGINT → INT",
                category: "rewrite",
                why: "Narrowing: some old values might not fit. It would need checking and rewriting the data.",
              },
              {
                id: "string-int",
                label: "STRING → INT",
                category: "rewrite",
                why: "Not every string is a number. Create a new column and backfill it instead.",
              },
              {
                id: "double-float",
                label: "DOUBLE → FLOAT",
                category: "rewrite",
                why: "Loses precision. Old values can't be read back exactly.",
              },
            ]}
            explanation="The rule: a change is safe when every value that could exist in an old file is still valid under the new type. Widening yes, narrowing or reinterpreting no."
          />
        </div>
      }
    >
      <p>Think about whether every old value would still be valid under the new type.</p>
    </StepLayout>
  );
}

/* 6 ─ Nested and semi-structured ----------------------------------------------------------- */

const EVENTS = [
  { id: 1, props: '{"page": "home"}' },
  { id: 2, props: '{"page": "cart", "items": 3}' },
  { id: 3, props: '{"page": "cart", "items": 2, "coupon": "DIWALI"}' },
];

const SEMI: Record<
  SchemaState["semi"],
  { label: string; ddl: string; query: string; good: string[]; bad: string[] }
> = {
  string: {
    label: "JSON in a STRING",
    ddl: "props STRING",
    query: "SELECT get_json_object(props, '$.coupon') FROM events",
    good: ["Accepts anything; the schema never changes"],
    bad: [
      "Every query parses text, row by row: slow",
      "No types and no statistics, so no data skipping",
      "Typos in field names fail silently",
    ],
  },
  struct: {
    label: "STRUCT",
    ddl: "props STRUCT<page STRING, items INT, coupon STRING>",
    query: "SELECT props.coupon FROM events",
    good: ["Real typed columns, stored column by column", "Fast, with statistics for skipping"],
    bad: [
      "Each new field is a schema change (add a nested field)",
      "Wildly varying fields make wide, sparse structs",
    ],
  },
  variant: {
    label: "VARIANT",
    ddl: "props VARIANT",
    query: "SELECT props:coupon::string FROM events",
    good: [
      "Accepts any JSON-like shape without schema changes",
      "Stored in an efficient binary encoding, not text",
      "Frequently used fields can be “shredded” into real columns for speed",
    ],
    bad: ["Newer: Delta 4.0, Iceberg v3, Hudi 1.2; check that your engines support it"],
  },
};

export function SemiStructured() {
  const [s, set] = useSceneState<SchemaState>();
  const v = SEMI[s.semi];

  return (
    <StepLayout
      eyebrow="Semi-structured data"
      title="When every event looks different"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-line bg-bg/40 rounded-xl border p-3">
            <p className="text-muted mb-1.5 text-[11px]">
              Incoming app events: fields keep appearing
            </p>
            <ul className="grid gap-1 font-mono text-[11px]">
              {EVENTS.map((e) => (
                <li key={e.id}>
                  <span className="text-subtle">event {e.id} </span>
                  {e.props}
                </li>
              ))}
            </ul>
          </div>
          <Segmented
            size="sm"
            value={s.semi}
            options={(Object.keys(SEMI) as SchemaState["semi"][]).map(
              (k) => [k, SEMI[k].label] as [string, string],
            )}
            onChange={(val) => set({ semi: val as SchemaState["semi"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.semi}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <Code className="text-[10px] whitespace-pre-wrap">{`${v.ddl}\n\n${v.query}`}</Code>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-good/40 bg-good/10 rounded-xl border p-3">
                  <p className="text-sm font-semibold">Strengths</p>
                  <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-xs">
                    {v.good.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <div className="border-line bg-surface rounded-xl border p-3">
                  <p className="text-sm font-semibold">Costs</p>
                  <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-xs">
                    {v.bad.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Clickstreams, IoT readings and API payloads don&apos;t sit still: new fields appear every
        week. Declaring each one as a column would mean constant schema changes.
      </p>
      <p>
        There are three common answers. Compare them. The newest, the{" "}
        <Term id="variant">VARIANT</Term> type, is now in all three table formats.
      </p>
      <p className="text-subtle text-xs">
        Query syntax for VARIANT varies by engine; the example uses Databricks/Spark style. Nested
        STRUCT fields have their own IDs in Iceberg, so they evolve as safely as top-level columns.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap-up ------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Two sides of one contract",
    "Enforcement keeps bad data out; evolution changes the rules on purpose.",
  ],
  [
    "Enforcement rejects the whole write",
    "A batch that breaks the schema commits nothing. Fix it and retry.",
  ],
  [
    "How columns are matched decides safety",
    "By position breaks on drops and reorders, by name on renames. IDs survive both.",
  ],
  ["Widen, don't narrow", "Type changes are metadata-only when every old value still fits."],
  [
    "Semi-structured has options",
    "JSON strings, STRUCTs, or the new VARIANT type, with different trade-offs.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up · Chapter 3 complete"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes <strong>How tables behave</strong>: transactions, row changes and schema
        changes, the three things that make a folder of files behave like a real table.
      </p>
      <p>
        Next chapter, <strong>Performance &amp; layout</strong>, is about speed: partitioning,
        clustering and how engines skip data they don&apos;t need.
      </p>
    </StepLayout>
  );
}

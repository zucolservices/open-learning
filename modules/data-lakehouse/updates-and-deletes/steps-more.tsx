"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { UpdatesState } from "./state";

/* 7 ─ Is it really gone? ----------------------------------------------------------------- */

type Where = "table" | "history" | "storage";

const ERASE: { title: string; text: string; code: string; where: Record<Where, boolean> }[] = [
  {
    title: "Customer 7 asks to be forgotten",
    text: "Their orders sit in two data files, f2 and f5. The table uses deletion vectors (Merge-on-Read).",
    code: "-- customer 7's rows: 12 rows in f2 and f5",
    where: { table: true, history: true, storage: true },
  },
  {
    title: "1. DELETE: gone from the table…",
    text: "The DELETE marks the rows in deletion vectors. Queries no longer return them. But the rows are still physically inside f2 and f5, and older versions can still be read with time travel.",
    code: "DELETE FROM orders WHERE customer_id = 7;",
    where: { table: false, history: true, storage: true },
  },
  {
    title: "2. Rewrite the files",
    text: "Rewrite every file holding soft-deleted rows, so new files f2′ and f5′ exist without them. In Delta, REORG … APPLY (PURGE) guarantees this; OPTIMIZE doesn't promise to apply every deletion vector.",
    code: "REORG TABLE orders APPLY (PURGE);",
    where: { table: false, history: true, storage: true },
  },
  {
    title: "3. Wait out retention, then remove old files",
    text: "The old f2 and f5 still exist for time travel. Once the retention period has passed (counted from when the rewrite finished), VACUUM deletes them. Only now is the data physically gone.",
    code: "VACUUM orders;  -- after the retention period",
    where: { table: false, history: false, storage: false },
  },
];

const OTHERS: [string, string][] = [
  ["Iceberg", "DELETE → rewrite_data_files → expire_snapshots → remove_orphan_files"],
  [
    "Hudi",
    "Hard delete (not a soft delete) → compaction on Merge-on-Read → the cleaner removes old file slices",
  ],
];

export function ReallyGone() {
  const [s, set] = useSceneState<UpdatesState>();
  const step = Math.min(s.eraseStep, ERASE.length - 1);
  const f = ERASE[step];
  const places: [Where, string][] = [
    ["table", "Returned by queries"],
    ["history", "Readable with time travel"],
    ["storage", "Physically in storage"],
  ];

  return (
    <StepLayout
      eyebrow="Privacy"
      title="Deleted, or really gone?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {places.map(([k, label]) => (
              <motion.div
                key={k}
                animate={{ scale: f.where[k] ? 1 : 0.97 }}
                className={cn(
                  "rounded-xl border px-3 py-3 text-center transition-colors",
                  f.where[k] ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
                )}
              >
                <p className="text-muted text-[11px] leading-tight">{label}</p>
                <p className="mt-1 text-sm font-semibold">{f.where[k] ? "still yes" : "no"}</p>
              </motion.div>
            ))}
          </div>
          <Code>{f.code}</Code>
          <Stepper step={step} count={ERASE.length} onChange={(n) => set({ eraseStep: n })} />
          <FrameCaption frameKey={step} title={f.title} tone={step === 3 ? "good" : undefined}>
            {f.text}
          </FrameCaption>
          <div className="border-line bg-bg/40 rounded-xl border p-3">
            <p className="text-muted mb-1.5 text-xs">The same idea in the other formats</p>
            <dl className="grid gap-1 text-xs">
              {OTHERS.map(([k, v]) => (
                <div key={k} className="grid gap-x-3 sm:grid-cols-[5rem_minmax(0,1fr)]">
                  <dt className="font-medium">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      }
    >
      <p>
        Merge-on-Read has a consequence people often miss. A DELETE only <em>marks</em> rows: the
        bytes are still in the data files. And every format keeps old files around for time travel.
      </p>
      <p>
        That matters for privacy laws such as the GDPR&apos;s right to be forgotten. Step through
        what it takes, in Delta, for a customer&apos;s data to be truly erased.
      </p>
      <p className="text-subtle text-xs">
        Copy-on-Write skips step 2 (the DELETE already rewrote the files), but step 3 is still
        needed. Keep retention periods short enough to meet your erasure deadlines.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Checkpoint --------------------------------------------------------------------------- */

export function EraseOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Order the erasure"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="erase-order"
            prompt="A Delta table uses deletion vectors. Put the steps to physically erase one customer's data in order."
            items={[
              { id: "delete", label: "DELETE the customer's rows" },
              { id: "purge", label: "REORG TABLE … APPLY (PURGE) to rewrite the affected files" },
              { id: "wait", label: "Wait until the retention period has passed" },
              { id: "vacuum", label: "VACUUM to delete the old files from storage" },
            ]}
            explanation="Marking, rewriting, then removing old versions. Until the last step, the data is still in storage and reachable through time travel."
          />
        </div>
      }
    >
      <p>Think about where the rows still exist after each step.</p>
    </StepLayout>
  );
}

/* 9 ─ Switching it on ------------------------------------------------------------------------ */

const SETTINGS: { name: string; default_: string; code: string; compact: string; notes: string }[] =
  [
    {
      name: "Delta Lake",
      default_:
        "Copy-on-Write unless deletion vectors are on. Databricks turns them on for new tables (SQL warehouses, DBR 14.3 LTS+).",
      code: "ALTER TABLE orders SET TBLPROPERTIES\n  ('delta.enableDeletionVectors' = true);",
      compact: "OPTIMIZE orders;\nREORG TABLE orders APPLY (PURGE);  -- guarantee",
      notes:
        "Supported for DELETE since Delta 2.4, UPDATE since 3.0 and MERGE since 3.1. Turning them on upgrades the table protocol, so very old readers can't read it.",
    },
    {
      name: "Apache Iceberg",
      default_:
        "Copy-on-Write for DELETE, UPDATE and MERGE. Merge-on-Read needs format v2+; v3 uses deletion vectors.",
      code: "ALTER TABLE orders SET TBLPROPERTIES (\n  'write.delete.mode' = 'merge-on-read',\n  'write.update.mode' = 'merge-on-read',\n  'write.merge.mode'  = 'merge-on-read');",
      compact:
        "CALL system.rewrite_data_files(table => 'orders');\nCALL system.rewrite_position_delete_files('orders');",
      notes:
        "rewrite_data_files also rewrites files where deletes pass a ratio threshold (default 30%). The mode is per operation, so you can mix.",
    },
    {
      name: "Apache Hudi",
      default_: "Copy-on-Write. The table type is chosen at creation.",
      code: "CREATE TABLE orders (…) USING hudi\nTBLPROPERTIES (type = 'mor', primaryKey = 'order_id');",
      compact:
        "-- async by default; inline option:\nhoodie.compact.inline = true\nhoodie.compact.inline.max.delta.commits = 5",
      notes:
        "The type can be changed later with the Hudi CLI; going from Merge-on-Read to Copy-on-Write needs a full compaction first.",
    },
  ];

export function SwitchingItOn() {
  return (
    <StepLayout
      eyebrow="In practice"
      title="Choosing the strategy, per format"
      stage={
        <div className="grid flex-1 content-start gap-3">
          {SETTINGS.map((st, i) => (
            <motion.div
              key={st.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <p className="font-semibold">{st.name}</p>
              <p className="text-muted mt-1 text-xs">Default: {st.default_}</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div>
                  <p className="text-subtle mb-1 text-[10px] uppercase">Switch to Merge-on-Read</p>
                  <Code className="text-[10px] whitespace-pre-wrap">{st.code}</Code>
                </div>
                <div>
                  <p className="text-subtle mb-1 text-[10px] uppercase">Compact</p>
                  <Code className="text-[10px] whitespace-pre-wrap">{st.compact}</Code>
                </div>
              </div>
              <p className="text-muted mt-2 text-xs">{st.notes}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Each format lets you choose, but the defaults and the switches differ. Here&apos;s where the
        choice lives in each.
      </p>
      <p>
        Managed platforms increasingly do the compaction for you. On Databricks, for example, auto
        compaction merges small files after writes, and predictive optimization schedules OPTIMIZE
        and VACUUM automatically.
      </p>
      <p className="text-subtle text-xs">
        Table maintenance gets its own module later: <em>Keeping tables healthy</em>.
      </p>
    </StepLayout>
  );
}

/* 10 ─ Wrap-up ---------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Files never change",
    "An update is recorded either by rewriting files or by marking rows and adding new ones.",
  ],
  [
    "Write amplification vs read amplification",
    "Copy-on-Write pays once, at write time. Merge-on-Read pays a little on every read, until compaction.",
  ],
  [
    "The workload decides",
    "Frequent, scattered updates with few reads favour Merge-on-Read; read-heavy or clustered updates favour Copy-on-Write.",
  ],
  [
    "Compaction is the dial",
    "Too rare and reads slow down; too often and you rewrite the same files repeatedly.",
  ],
  [
    "Deleted isn't erased",
    "Physically erasing data takes a rewrite plus removal of old files after retention.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
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
        You can now say why an update costs what it does in each strategy, estimate{" "}
        <Term id="write-amplification">write amplification</Term>, and reason about when to compact.
      </p>
      <p>
        Next, <strong>Schema evolution &amp; enforcement</strong>: changing a table&apos;s shape
        safely, and stopping bad data at the door.
      </p>
    </StepLayout>
  );
}

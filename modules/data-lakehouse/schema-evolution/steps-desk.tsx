"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { SchemaState } from "./state";

/** Table schema: orders(order_id BIGINT NOT NULL, amount INT, status STRING). */
const SCHEMA = [
  { name: "order_id", type: "BIGINT NOT NULL" },
  { name: "amount", type: "INT" },
  { name: "status", type: "STRING" },
];

interface IncomingRow {
  cells: Record<string, string>;
  /** Why it breaks the schema, if it does. */
  problem?: "type" | "null" | "extra";
  note: string;
}

const BATCH: IncomingRow[] = [
  { cells: { order_id: "1041", amount: "250", status: "paid" }, note: "Matches the schema." },
  {
    cells: { order_id: "1042", amount: "“250 INR”", status: "paid" },
    problem: "type",
    note: "Text in an INT column.",
  },
  {
    cells: { order_id: "null", amount: "90", status: "open" },
    problem: "null",
    note: "order_id is required (NOT NULL).",
  },
  {
    cells: { order_id: "1043", amount: "120", status: "paid", coupon: "DIWALI" },
    problem: "extra",
    note: "A column the table doesn't have: coupon.",
  },
  {
    cells: { order_id: "1044", status: "open" },
    note: "No amount. It's optional, so it's stored as null.",
  },
];

const FOLDER_AFTERMATH = [
  "SUM(amount) fails on “250 INR”, or some engines silently read it as null.",
  "An order with no ID can't be joined, updated or de-duplicated.",
  "coupon exists in one file only. Readers that don't expect it ignore it; others trip over it.",
];

export function FrontDesk() {
  const [s, set] = useSceneState<SchemaState>();
  const table = s.deskMode === "table";
  const evolve = table && s.evolve;
  const blocking = BATCH.filter((r) => r.problem && !(evolve && r.problem === "extra"));
  const accepted = !table || blocking.length === 0;

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="The front desk"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.deskMode}
              options={[
                ["folder", "Folder of files"],
                ["table", "Table with a schema"],
              ]}
              onChange={(v) => set({ deskMode: v as SchemaState["deskMode"] })}
            />
            {table && (
              <label className="text-muted flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={s.evolve}
                  onChange={(e) => set({ evolve: e.target.checked })}
                  className="accent-[var(--accent)]"
                />
                Allow schema evolution (merge new columns)
              </label>
            )}
          </div>

          <div className="border-line bg-bg/40 rounded-xl border p-3">
            <p className="text-muted mb-1 text-[11px]">The table&apos;s schema</p>
            <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
              {SCHEMA.map((c) => (
                <span key={c.name} className="bg-viz-meta/15 text-viz-meta rounded px-2 py-0.5">
                  {c.name} {c.type}
                </span>
              ))}
              <AnimatePresence>
                {evolve && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-viz-add/20 text-viz-add rounded px-2 py-0.5"
                  >
                    + coupon STRING
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="border-line bg-surface overflow-x-auto rounded-xl border">
            <table className="w-full font-mono text-[11px]">
              <thead className="bg-surface-2/60 text-muted">
                <tr>
                  {["order_id", "amount", "status", "coupon", ""].map((h) => (
                    <th key={h} className="px-2 py-1.5 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BATCH.map((r, i) => {
                  const bad = table && r.problem && !(evolve && r.problem === "extra");
                  return (
                    <tr
                      key={i}
                      className={cn("border-line border-t", bad && "bg-bad/10")}
                      title={r.note}
                    >
                      {["order_id", "amount", "status", "coupon"].map((c) => (
                        <td
                          key={c}
                          className={cn(
                            "px-2 py-1",
                            r.cells[c] === undefined && "text-subtle",
                            bad &&
                              ((r.problem === "type" && c === "amount") ||
                                (r.problem === "null" && c === "order_id") ||
                                (r.problem === "extra" && c === "coupon")) &&
                              "text-bad font-semibold",
                          )}
                        >
                          {r.cells[c] ?? (c === "coupon" ? "" : "–")}
                        </td>
                      ))}
                      <td className="px-2 text-right">
                        {table &&
                          (bad ? (
                            <X className="text-bad inline size-3.5" />
                          ) : (
                            <Check className="text-good inline size-3.5" />
                          ))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${s.deskMode}-${evolve}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3",
                !table
                  ? "border-bad/40 bg-bad/10"
                  : accepted
                    ? "border-good/40 bg-good/10"
                    : "border-bad/40 bg-bad/10",
              )}
            >
              {!table ? (
                <>
                  <p className="font-semibold">All five rows landed. Nobody checked.</p>
                  <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
                    {FOLDER_AFTERMATH.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p className="font-semibold">
                    The whole write is rejected: {blocking.length} problem
                    {blocking.length === 1 ? "" : "s"}. Nothing was committed.
                  </p>
                  <ul className="text-muted mt-1 list-disc space-y-0.5 pl-4 text-sm">
                    {blocking.map((r) => (
                      <li key={r.note}>{r.note}</li>
                    ))}
                  </ul>
                  <p className="text-muted mt-2 text-xs">
                    {evolve
                      ? "Evolution solved the new column, but not the bad value or the missing ID. Those are data problems, and no setting should let them in."
                      : "Tick “Allow schema evolution” to see which problem that can solve."}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Think of a paper form at a front desk. The receptionist checks every form: the phone number
        must be digits, the name can&apos;t be blank. That&apos;s{" "}
        <Term id="schema-enforcement">schema enforcement</Term>.
      </p>
      <p>
        When the business needs a new field, it prints a new version of the form, and old forms stay
        valid. That&apos;s <Term id="schema-evolution">schema evolution</Term>.
      </p>
      <p>
        A plain folder of files has no receptionist: anything written is data. Send the same batch
        to a folder and to a table, and notice one thing in particular: the table doesn&apos;t keep
        the good rows and drop the bad ones. It refuses the whole write.
      </p>
      <p className="text-subtle text-xs">
        That&apos;s atomicity again (module 10). A half-accepted batch would be worse than none.
      </p>
      <Code className="text-[10px] break-all whitespace-pre-wrap">
        {
          '-- Delta / Spark: opt in to adding new columns on this write\ndf.write.format("delta").option("mergeSchema", "true").mode("append")…'
        }
      </Code>
    </StepLayout>
  );
}

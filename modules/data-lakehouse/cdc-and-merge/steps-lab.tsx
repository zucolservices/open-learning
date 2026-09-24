"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, SCHEDULES, TRUTH, diagnose, run, type Fixes, type Problem } from "./model";
import type { CdcState } from "./state";

/* 5 ─ The replay lab ⭐ ------------------------------------------------------------------------- */

const byId = new Map(EVENTS.map((e) => [e.id, e]));

const PROBLEM_TEXT: Record<Problem, string> = {
  duplicate: "Duplicate rows: one customer appears more than once.",
  stale: "Stale value: an older event overwrote a newer one.",
  resurrected: "Ghost row: a deleted customer is still visible.",
  failed:
    "The MERGE failed: several source rows matched one target row. The job stops and later batches never land.",
};

const FIX_INFO: { key: keyof Fixes; label: string; text: string }[] = [
  {
    key: "dedupe",
    label: "Keep the latest event per key",
    text: "Before merging, keep only each customer's newest event in the batch.",
  },
  {
    key: "guard",
    label: "Only apply newer events",
    text: "Store the log position on each row; ignore events that aren't newer.",
  },
  {
    key: "soft",
    label: "Soft deletes",
    text: "Keep a deleted row as a tombstone (is_deleted = true, with its position) instead of removing it.",
  },
];

function sql(fx: Fixes) {
  const g = fx.guard ? " AND s.seq > t.seq" : "";
  return [
    fx.dedupe
      ? "WITH updates AS (\n  SELECT * FROM (SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY id ORDER BY seq DESC) AS rn FROM batch)\n  WHERE rn = 1)"
      : "WITH updates AS (SELECT * FROM batch)",
    "MERGE INTO silver.customers t USING updates s ON t.id = s.id",
    fx.soft
      ? `WHEN MATCHED${g} AND s.op = 'd'\n  THEN UPDATE SET is_deleted = true, seq = s.seq`
      : `WHEN MATCHED${g} AND s.op = 'd' THEN DELETE`,
    `WHEN MATCHED${g} THEN UPDATE SET city = s.city, seq = s.seq${fx.soft ? ", is_deleted = false" : ""}`,
    fx.soft
      ? "WHEN NOT MATCHED THEN INSERT (…, is_deleted = s.op = 'd')"
      : "WHEN NOT MATCHED AND s.op != 'd' THEN INSERT (…)",
  ].join("\n");
}

export function ReplayLab() {
  const [s, set] = useSceneState<CdcState>();
  const fx: Fixes = { dedupe: s.dedupe, guard: s.guard, soft: s.soft };
  const results = run(s.arrival, fx);
  const { visible, problems, rowIssues } = diagnose(results);
  const allRows = results[results.length - 1].table;
  const sched = SCHEDULES[s.arrival];
  const sel = Math.min(s.batch, sched.length - 1);
  const selResult = results[sel];
  const ok = problems.length === 0;

  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The replay lab"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-muted text-xs">Events arrive</span>
            <Segmented
              size="sm"
              value={s.arrival}
              options={[
                ["ordered", "In order"],
                ["messy", "Late and repeated"],
              ]}
              onChange={(v) => set({ arrival: v as CdcState["arrival"], batch: 0 })}
            />
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {FIX_INFO.map((f) => (
              <button
                key={f.key}
                type="button"
                role="switch"
                aria-checked={s[f.key]}
                onClick={() => set({ [f.key]: !s[f.key] })}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left transition",
                  s[f.key] ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className="flex items-center gap-2 text-xs font-semibold">
                  <span
                    className={cn(
                      "relative h-4 w-7 shrink-0 rounded-full transition",
                      s[f.key] ? "bg-accent" : "bg-surface-2 ring-line ring-1",
                    )}
                  >
                    <motion.span
                      animate={{ x: s[f.key] ? 12 : 0 }}
                      className="bg-bg absolute top-0.5 left-0.5 size-3 rounded-full"
                    />
                  </span>
                  {f.label}
                </span>
                <span className="text-muted mt-1 block text-[11px] leading-snug">{f.text}</span>
              </button>
            ))}
          </div>

          <div>
            <p className="text-muted mb-1.5 text-xs">Batches, in arrival order (click one)</p>
            <div className="grid grid-cols-3 gap-2">
              {sched.map((ids, bi) => {
                const r = results[bi];
                const skipped = !r;
                return (
                  <button
                    key={bi}
                    type="button"
                    onClick={() => set({ batch: bi })}
                    className={cn(
                      "rounded-xl border p-2 text-left transition",
                      bi === sel ? "ring-accent ring-2" : "",
                      r?.error
                        ? "border-bad/50 bg-bad/10"
                        : skipped
                          ? "border-line border-dashed opacity-50"
                          : "border-line bg-surface",
                    )}
                  >
                    <span className="text-muted block text-[10px]">
                      Batch {bi + 1}
                      {r?.error ? " · failed" : skipped ? " · never ran" : ""}
                    </span>
                    <span className="mt-1 flex flex-wrap gap-1">
                      {ids.map((id, j) => {
                        const e = byId.get(id)!;
                        const dropped = r?.dropped.includes(j);
                        return (
                          <span
                            key={j}
                            title={`${id}: customer ${e.key}, op ${e.op}, seq ${e.seq}`}
                            className={cn(
                              "rounded px-1 py-0.5 font-mono text-[9px]",
                              e.op === "d"
                                ? "bg-viz-remove/15 text-viz-remove"
                                : e.op === "c"
                                  ? "bg-viz-add/15 text-viz-add"
                                  : "bg-accent-soft text-accent",
                              dropped && "line-through opacity-40",
                            )}
                          >
                            #{e.key}·{e.seq}
                          </span>
                        );
                      })}
                    </span>
                  </button>
                );
              })}
            </div>
            {selResult && (
              <motion.ul
                key={s.arrival + sel + JSON.stringify(fx)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-line bg-bg/40 mt-2 grid gap-0.5 rounded-xl border px-3 py-2 font-mono text-[10px]"
              >
                {selResult.dropped.length > 0 && (
                  <li className="text-muted">
                    de-duplicated away:{" "}
                    {selResult.dropped
                      .map((j) => {
                        const e = byId.get(sched[sel][j])!;
                        return `#${e.key}·${e.seq}`;
                      })
                      .join(", ")}
                  </li>
                )}
                {selResult.error ? (
                  <li className="text-bad">✗ MERGE failed: {selResult.error}</li>
                ) : (
                  selResult.actions.map((a, i) => {
                    const e = byId.get(a.event)!;
                    return (
                      <li key={i} className={a.tone === "good" ? "text-good" : undefined}>
                        #{e.key}·{e.seq} {e.op} → {a.action}
                      </li>
                    );
                  })
                )}
              </motion.ul>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1.5 text-xs">What readers see in silver.customers</p>
              <div className="grid gap-1">
                {visible.map((r, i) => {
                  const issue = rowIssues.get(r);
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex justify-between rounded-lg border px-3 py-1 font-mono text-[11px]",
                        issue ? "border-bad/50 bg-bad/10" : "border-line",
                      )}
                    >
                      <span>
                        {r.key} · {r.name}, {r.city}
                      </span>
                      <span className="text-muted">{issue ?? `seq ${r.seq}`}</span>
                    </div>
                  );
                })}
                {allRows.some((r) => r.deleted) && (
                  <p className="text-subtle font-mono text-[10px]">
                    + {allRows.filter((r) => r.deleted).length} tombstone(s) hidden from readers
                  </p>
                )}
              </div>
            </div>
            <div>
              <p className="text-muted mb-1.5 text-xs">What Postgres really holds</p>
              <div className="grid gap-1">
                {TRUTH.map((t) => (
                  <div
                    key={t.key}
                    className="border-good/40 bg-good/5 rounded-lg border px-3 py-1 font-mono text-[11px]"
                  >
                    {t.key} · {t.name}, {t.city}
                  </div>
                ))}
                <p className="text-subtle font-mono text-[10px]">Meera (3) was deleted</p>
              </div>
            </div>
          </div>

          <motion.div
            key={problems.join()}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              ok ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {ok ? (
              <p className="flex items-start gap-2">
                <CheckCircle2 className="text-good mt-0.5 size-4 shrink-0" />
                {s.arrival === "ordered"
                  ? "Correct. Now switch to late and repeated events: real pipelines get those."
                  : "Correct, however the events arrive. Replaying any batch again changes nothing: the MERGE is idempotent."}
              </p>
            ) : (
              <ul className="grid gap-1">
                {problems.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
                    {PROBLEM_TEXT[p]}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>

          <Code>{sql(fx)}</Code>

          <details className="text-muted text-xs">
            <summary className="cursor-pointer">How this model works</summary>
            <p className="mt-2">
              Eight Debezium-style events for three customers. <code>seq</code> stands for the log
              position (e.g. Postgres LSN). Each batch runs one MERGE with Delta/Iceberg semantics:
              rows are matched against the table as it was before the batch, every unmatched source
              row is inserted, and two source rows matching one target row fail the MERGE. In
              &quot;late and repeated&quot;, events 103 and 105 were held up in a slow file and a
              retry delivers 107 twice.
            </p>
          </details>
        </div>
      }
    >
      <p>
        Here are eight change events for three customers, applied in three batches. Your job: make
        the lakehouse table match Postgres.
      </p>
      <p>
        Start with events in order, where one thing is already wrong. Then make them arrive late and
        twice, and switch on fixes until the table is right.
      </p>
      <p className="text-muted text-sm">
        You don&apos;t always have to write this yourself. Databricks&apos; AUTO CDC (
        <code>SEQUENCE BY</code>) orders events and keeps tombstones for you, and Hudi does the same
        with an ordering field and <code>EVENT_TIME_ORDERING</code>. Tombstones do pile up, so
        they&apos;re cleaned up after a retention period.
      </p>
      <p className="text-muted text-sm">
        The <Term id="soft-delete">soft delete</Term> is the subtle one: once a row is truly gone, a
        late update for it looks like a brand-new customer.
      </p>
    </StepLayout>
  );
}

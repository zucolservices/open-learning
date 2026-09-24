"use client";

import { motion } from "motion/react";
import { AlertTriangle, CheckCircle2, Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  BAD_DAY,
  BUGGY_REV,
  BUGGY_ROWS,
  DAYS,
  TRUE_REV,
  TRUE_ROWS,
  backfill,
  type WriteMode,
} from "./model";
import type { MedallionState } from "./state";

/* 5 ─ Replay a bad day ⭐ ------------------------------------------------------------------------ */

const CODE: Record<WriteMode, string> = {
  append:
    '# Adds the fixed rows next to whatever is already there\nfixed.write.mode("append").saveAsTable("silver.orders")',
  overwrite:
    '# Delta: replace only that day\'s rows\n(fixed.write.mode("overwrite")\n   .option("replaceWhere", "order_date = \'2026-09-12\'")\n   .saveAsTable("silver.orders"))\n# Iceberg: fixed.writeTo("silver.orders").overwritePartitions()\n# (Iceberg\'s docs prefer MERGE for this)',
  merge:
    "MERGE INTO silver.orders t USING fixed s\n  ON t.order_id = s.order_id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *",
};

export function BadDay() {
  const [s, set] = useSceneState<MedallionState>();
  const r = s.backfilled ? backfill(s.mode, s.runs, s.rerunGold) : backfill(s.mode, 0, false);
  const max = Math.max(...r.goldRev, ...TRUE_REV) * 1.08;
  const ok = s.backfilled && r.correctSilver && r.correctGold;
  const change = (p: Partial<MedallionState>) => set({ ...p, backfilled: false });

  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Replay a bad day"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-xs">Dashboard · gold.daily_revenue (₹ thousand)</p>
            <div className="mt-3 flex h-36 items-end gap-2">
              {r.goldRev.map((v, i) => {
                const bad = i === BAD_DAY && v !== TRUE_REV[i];
                return (
                  <div
                    key={DAYS[i]}
                    className="relative flex h-full flex-1 flex-col items-center justify-end"
                  >
                    {i === BAD_DAY && (
                      <div
                        className="border-good absolute inset-x-0 border-t-2 border-dashed"
                        style={{ bottom: `${(TRUE_REV[i] / max) * 100}%` }}
                        title="True value"
                      />
                    )}
                    <span
                      className={cn("mb-1 font-mono text-[10px]", bad ? "text-bad" : "text-muted")}
                    >
                      {v}
                    </span>
                    <motion.div
                      initial={false}
                      animate={{ height: `${(v / max) * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      className={cn("w-full rounded-t-md", bad ? "bg-bad/70" : "bg-tier-gold/70")}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-1 flex gap-2">
              {DAYS.map((d) => (
                <span key={d} className="text-subtle flex-1 text-center text-[10px]">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-24 text-xs">Write mode</span>
              <Segmented
                size="sm"
                value={s.mode}
                options={[
                  ["append", "Append"],
                  ["overwrite", "Overwrite 12 Sep"],
                  ["merge", "MERGE on order_id"],
                ]}
                onChange={(v) => change({ mode: v as WriteMode })}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted w-24 text-xs">Job runs</span>
              <Segmented
                size="sm"
                value={String(s.runs)}
                options={[
                  ["1", "Once"],
                  ["2", "Twice (a retry)"],
                ]}
                onChange={(v) => change({ runs: Number(v) })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.rerunGold}
                onChange={(e) => change({ rerunGold: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Also rebuild gold for 12 Sep
            </label>
            <button
              type="button"
              onClick={() => set({ backfilled: true })}
              disabled={s.backfilled}
              className="bg-accent text-accent-fg flex w-fit items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-40"
            >
              <Play className="size-4" /> Run the backfill
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                r.correctSilver ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
              )}
            >
              <p className="text-muted text-[10px]">silver.orders rows for 12 Sep</p>
              <p className="font-mono text-lg">{r.silverRows.toLocaleString("en-IN")}</p>
              <p className="text-subtle text-[10px]">
                should be {TRUE_ROWS.toLocaleString("en-IN")}
              </p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                r.correctGold ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/5",
              )}
            >
              <p className="text-muted text-[10px]">Dashboard for 12 Sep</p>
              <p className="font-mono text-lg">₹{r.goldRev[BAD_DAY]}k</p>
              <p className="text-subtle text-[10px]">should be ₹{TRUE_REV[BAD_DAY]}k</p>
            </div>
          </div>

          <motion.p
            key={`${s.backfilled}${s.mode}${s.runs}${s.rerunGold}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-start gap-2 rounded-xl border px-4 py-3 text-sm",
              !s.backfilled
                ? "border-line bg-surface"
                : ok
                  ? "border-good/40 bg-good/10"
                  : "border-bad/40 bg-bad/10",
            )}
          >
            {s.backfilled &&
              (ok ? (
                <CheckCircle2 className="text-good mt-0.5 size-4 shrink-0" />
              ) : (
                <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
              ))}
            <span>
              {!s.backfilled
                ? `A parser bug on 12 Sep dropped every amount written like "1,250", so only ${BUGGY_ROWS.toLocaleString("en-IN")} of ${TRUE_ROWS.toLocaleString("en-IN")} orders reached silver. The code is fixed; now repair the data.`
                : !r.correctSilver
                  ? `Append added the fixed rows on top of the ${BUGGY_ROWS.toLocaleString("en-IN")} already there${s.runs > 1 ? ", twice" : ""}: orders are now counted more than once. Appends aren't idempotent.`
                  : !r.correctGold
                    ? "Silver is right, but the dashboard still shows the old number: gold was built from the bad silver and hasn't been rebuilt. Backfills must flow downstream."
                    : `Correct${s.runs > 1 ? ", even though the job ran twice" : ""}. ${s.mode === "overwrite" ? "Overwriting the day" : "MERGE on the key"} gives the same result however many times it runs: it's idempotent.`}
            </span>
          </motion.p>

          <Code>{CODE[s.mode]}</Code>
          <p className="text-subtle text-xs">
            Illustrative numbers. The buggy run lost {TRUE_ROWS - BUGGY_ROWS} orders worth ₹
            {TRUE_REV[BAD_DAY] - BUGGY_REV}k.
          </p>
        </div>
      }
    >
      <p>
        Every pipeline eventually needs a <Term id="backfill">backfill</Term>: re-running it for a
        past period after fixing a bug. And schedulers retry failed jobs on their own. So every job
        should be <Term id="idempotent">idempotent</Term>: running it twice must give the same
        result as running it once.
      </p>
      <p>Pick a write mode, decide whether gold gets rebuilt, and run the repair.</p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: the retry ------------------------------------------------------------------------ */

export function RetryCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The retry"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="retry"
            prompt="A nightly job writes yesterday's orders into silver and commits. Then the worker crashes before telling the scheduler it succeeded, so the scheduler runs the job again. How do you make that harmless?"
            options={[
              {
                id: "atomic",
                label: "Nothing to do: table formats are atomic, so the second run can't hurt",
                feedback:
                  "Atomic means a commit happens fully or not at all. The first commit did happen, so a second append adds everything again.",
              },
              {
                id: "replace",
                label: "Write by replacing yesterday's data (or MERGE on order_id), not appending",
                correct: true,
                feedback:
                  "Right. The second run replaces the same rows with the same rows: same result however many times it runs.",
              },
              {
                id: "distinct",
                label: "Add SELECT DISTINCT to every gold query",
                feedback:
                  "That hides duplicates in some places and misses them in others. Fix the write, not every reader.",
              },
              {
                id: "no-retry",
                label: "Turn off retries in the scheduler",
                feedback:
                  "Then every temporary glitch becomes a missing day. Retries are good; make them safe.",
              },
            ]}
            explanation="Design jobs so that a run for a period replaces that period's output. Then retries and backfills are routine instead of scary."
          />
        </div>
      }
    >
      <p>Atomic and idempotent sound alike, but they solve different problems.</p>
    </StepLayout>
  );
}

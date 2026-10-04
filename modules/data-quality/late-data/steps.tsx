"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EVENTS, NAMES, load, type Strategy } from "./model";
import type { LateState } from "./state";

/* 1 ─ Postcards from holiday ---------------------------------------------------------------------- */

export function Postcards() {
  const cards = [
    ["Mon", "Tue"],
    ["Tue", "Tue"],
    ["Wed", "Sat"],
    ["Thu", "Fri"],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="Postcards from holiday"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-4">
          {cards.map(([w, a], i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, rotate: -3 + i * 2, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "rounded-lg border px-3 py-3 text-center text-xs",
                a === "Sat" ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">Written {w}</p>
              <p className="text-muted">arrived {a}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A friend sends a postcard every day of their holiday. They arrive out of order, and
        Wednesday&apos;s turns up on Saturday. If you&apos;d filed the week on Thursday, Wednesday
        would look empty.
      </p>
      <p>
        Data does this constantly: phones go offline, partners send files late.{" "}
        <Term id="late-data">Late data</Term> is data that arrives after you&apos;ve already
        processed the period it belongs to. Handling it well means reprocessing recent periods, with
        loads that are safe to run more than once.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A week of late orders ⭐ -------------------------------------------------------------------- */

const STRATS: { id: Strategy; label: string }[] = [
  { id: "append", label: "Append whatever arrived" },
  { id: "yesterday", label: "Rebuild yesterday" },
  { id: "lookback", label: "Rebuild the last N days" },
];

export function Reload() {
  const [s, set] = useSceneState<LateState>();
  const rows = load(s.strategy, s.lookback, s.retry ? 4 : null);
  const wrong = rows.filter((r) => r.got !== r.truth);
  const late = EVENTS.filter((e) => e.arrives > e.day && e.arrives <= 7);
  const max = Math.max(...rows.map((r) => Math.max(r.truth, r.got))) * 1.1;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A week of late orders"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1">
            {STRATS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.strategy === x.id}
                onClick={() => set({ strategy: x.id })}
                className={cn(
                  "rounded-md border px-2 py-1 text-xs",
                  s.strategy === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {s.strategy === "lookback" && (
              <label className="flex items-center gap-2">
                <span className="text-muted">N =</span>
                <input
                  type="range"
                  min={1}
                  max={6}
                  value={s.lookback}
                  onChange={(e) => set({ lookback: Number(e.target.value) })}
                  className="accent-accent w-28"
                  aria-label="Lookback days"
                />
                <span className="font-mono">{s.lookback} days</span>
              </label>
            )}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={s.retry}
                onChange={(e) => set({ retry: e.target.checked })}
                className="accent-accent"
              />
              Thursday&apos;s run times out and is retried
            </label>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-[10px]">
              ORDER VALUE BY THE DAY IT HAPPENED, AS OF SUNDAY NIGHT&apos;S LOAD
            </p>
            <div className="flex h-36 items-end gap-2">
              {rows.map((r) => (
                <div
                  key={r.day}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="relative flex w-full flex-1 items-end justify-center">
                    <div
                      className="border-muted absolute w-full rounded-sm border border-dashed"
                      style={{ height: `${(r.truth / max) * 100}%` }}
                    />
                    <motion.div
                      animate={{ height: `${(r.got / max) * 100}%` }}
                      className={cn("w-3/5 rounded-sm", r.got === r.truth ? "bg-good" : "bg-bad")}
                    />
                  </div>
                  <span className="text-muted text-[10px]">{NAMES[r.day - 1]}</span>
                </div>
              ))}
            </div>
            <p className="text-subtle mt-1 text-[10px]">
              Dashed: the true total. {late.length} of {EVENTS.filter((e) => e.arrives <= 7).length}{" "}
              orders arrive late, one by four days. Illustrative data.
            </p>
          </div>
          <motion.div
            key={`${s.strategy}-${s.lookback}-${s.retry}`}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              wrong.length ? "border-bad bg-bad/10" : "border-good bg-good/10",
            )}
          >
            {wrong.length === 0
              ? "Every day is right, even with late arrivals" + (s.retry ? " and a retry." : ".")
              : `${wrong.length} ${wrong.length === 1 ? "day is" : "days are"} wrong: ${wrong.map((r) => `${NAMES[r.day - 1]} ${r.got > r.truth ? "over-counted" : "missing orders"}`).join(", ")}.`}
          </motion.div>
        </div>
      }
    >
      <p>
        Each morning the job loads orders. &ldquo;Rebuild yesterday&rdquo; never sees late orders
        for older days. &ldquo;Append whatever arrived&rdquo; catches late orders, but turn on the
        retry and it counts Wednesday&apos;s arrivals twice.
      </p>
      <p>
        Rebuilding a window of recent days replaces them completely each run, so it&apos;s{" "}
        <Term id="idempotent">idempotent</Term> and catches late data, as long as the window is long
        enough. Anything later than the window still needs an occasional full rebuild.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two clocks ---------------------------------------------------------------------------------- */

export function Clocks() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Two clocks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Event time</p>
              <p className="text-muted">
                When it happened: the order was placed at 23:58 on Wednesday. Never changes.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Processing time</p>
              <p className="text-muted">
                When your pipeline saw it: 09:14 on Saturday, after the phone came back online.
              </p>
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Watermark</p>
            <p className="text-muted mt-1">
              A streaming system&apos;s guess: &ldquo;I believe I&apos;ve now seen everything before
              23:00.&rdquo; Usually a heuristic, so some data still arrives behind it and must be
              handled or dropped on purpose.
            </p>
          </div>
          <Code>{`# Airflow: process the run's data interval, never "now"
select * from orders
where created_at >= '{{ data_interval_start }}'
  and created_at <  '{{ data_interval_end }}'`}</Code>
        </div>
      }
    >
      <p>
        Group by <Term id="event-time">event time</Term>, not by when data arrived, or late orders
        land on the wrong day. Google&apos;s Dataflow Model paper (2015) and Tyler Akidau&apos;s
        Streaming 101 and 102 articles made the distinction mainstream; the Streaming Data track
        covers it in depth.
      </p>
      <p>
        In batch tools, make each run cover a fixed interval. A query filtered on{" "}
        <span className="font-mono">now()</span> gives a different answer every time it&apos;s
        re-run, which breaks catch-up runs and backfills.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Loads you can run twice --------------------------------------------------------------------- */

export function Patterns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Loads you can run twice"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <Code>{`-- 1. Upsert on a key (deduplicate the source first)
merge into orders t using staged s on t.order_id = s.order_id
when matched then update set amount = s.amount
when not matched then insert (order_id, amount) values (s.order_id, s.amount);

-- 2. Delete-then-insert a time slice, in one transaction
delete from orders where order_date >= '2026-10-01';
insert into orders select * from staged where order_date >= '2026-10-01';`}</Code>
          <Code>{`# 3. dbt microbatch (1.9+): each batch is rebuilt independently
{{ config(materialized='incremental', incremental_strategy='microbatch',
          event_time='ordered_at', begin='2026-01-01',
          batch_size='day', lookback=3) }}`}</Code>
        </div>
      }
    >
      <p>
        Three common idempotent patterns: upsert on a key with MERGE, delete-then-insert a time
        slice, or overwrite only the partitions you touch. In Spark, that last one needs dynamic
        partition overwrite; the default, static, can wipe every partition.
      </p>
      <p>
        dbt&apos;s microbatch strategy builds this in: each day is a batch that can be rebuilt on
        its own, and <span className="font-mono">lookback</span> (counted in batches) reprocesses
        recent ones for late data.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Safe to re-run? ----------------------------------------------------------------------------- */

export function SafeToRerun() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Safe to re-run?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="safe-rerun"
            prompt="If each load ran twice by accident, would the result be the same?"
            categories={[
              { id: "safe", label: "Idempotent" },
              { id: "unsafe", label: "Not idempotent" },
            ]}
            items={[
              {
                id: "append",
                label: "INSERT INTO sales SELECT * FROM today's file",
                category: "unsafe",
                why: "The second run adds the rows again.",
              },
              {
                id: "merge",
                label: "MERGE on order_id from a deduplicated staging table",
                category: "safe",
                why: "Matched rows are updated, not duplicated.",
              },
              {
                id: "partition",
                label: "Overwrite the 2026-10-03 partition with that day's data",
                category: "safe",
                why: "The partition is replaced.",
              },
              {
                id: "now",
                label: "Load rows WHERE created_at > now() - interval '1 day'",
                category: "unsafe",
                why: "A re-run tomorrow covers a different window.",
              },
              {
                id: "counter",
                label: "UPDATE stock SET qty = qty - 1 for each sale in the file",
                category: "unsafe",
                why: "Running twice subtracts twice.",
              },
            ]}
            explanation="Replacing a fixed slice or upserting on a key gives the same result however often it runs. Appending, incrementing, or using 'now' does not."
          />
        </div>
      }
    >
      <p>Sort the loads.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Event time", "Group by when it happened, not when it arrived."],
  ["Reprocess a window", "Rebuild recent days to catch late data."],
  ["Idempotent loads", "Upsert, delete-insert or overwrite a slice."],
  ["Fixed intervals", "Never filter on now()."],
  ["Occasional full rebuild", "For data later than the window."],
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
        Next: data quality for machine learning, where bad data becomes confident wrong answers.
      </p>
    </StepLayout>
  );
}

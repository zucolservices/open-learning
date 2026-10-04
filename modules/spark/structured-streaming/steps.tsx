"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { BATCHES, TRIGGERS } from "./model";
import type { StreamState } from "./state";

/* 1 ─ A ledger that never closes ------------------------------------------------------------------ */

const LEDGER = [
  "09:01 tea ₹40",
  "09:03 cake ₹90",
  "09:04 tea ₹40",
  "09:06 juice ₹70",
  "09:07 tea ₹40",
];

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A ledger that never closes"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line bg-surface w-56 rounded-xl border px-3 py-2 font-mono text-[11px]">
            {LEDGER.map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 * i,
                  repeat: Infinity,
                  repeatDelay: 3,
                  repeatType: "loop",
                }}
                className={cn(i >= 3 && "text-accent")}
              >
                {l}
              </motion.p>
            ))}
            <p className="text-muted">…</p>
          </div>
          <p className="text-muted text-xs">Every few minutes: add up only the new lines.</p>
        </div>
      }
    >
      <p>
        A café&apos;s ledger never closes; new sales are written underneath all day. To keep a
        running total, the owner doesn&apos;t re-add the whole page each time. They add the new
        lines to yesterday&apos;s total.
      </p>
      <p>
        <Term id="structured-streaming">Structured Streaming</Term> treats a stream the same way: as
        &ldquo;a table that is being continuously appended&rdquo;. You write an ordinary DataFrame
        query, and Spark runs it incrementally, processing only the new rows each time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Micro-batches and watermarks ⭐ ------------------------------------------------------------- */

export function MicroBatches() {
  const [s, set] = useSceneState<StreamState>();
  const b = BATCHES[s.batch];
  const prevWm = s.batch === 0 ? "—" : BATCHES[s.batch - 1].watermark;
  const emittedSoFar = BATCHES.slice(0, s.batch + 1).flatMap((x) => x.emitted);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Micro-batches and watermarks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`(events.withWatermark("time", "10 minutes")
   .groupBy(F.window("time", "10 minutes")).count()
   .writeStream.outputMode("append")...)`}</Code>
          <Stepper
            step={s.batch}
            count={BATCHES.length}
            onChange={(n) => set({ batch: n })}
            label={`Micro-batch ${s.batch}`}
          />
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1 text-[10px]">INPUT TABLE (appended)</p>
              <div className="flex flex-col gap-0.5 font-mono text-[11px]">
                {BATCHES.slice(0, s.batch + 1).flatMap((x, bi) =>
                  x.events.map((e, k) => (
                    <motion.p
                      key={`${bi}-${k}`}
                      initial={bi === s.batch ? { opacity: 0, x: -6 } : false}
                      animate={{ opacity: bi === s.batch ? 1 : 0.4, x: 0 }}
                      className={cn(
                        e.fate === "dropped" && "text-bad line-through",
                        e.fate === "late-ok" && "text-viz-compute",
                      )}
                    >
                      {e.t}
                      {bi === s.batch && (
                        <span className="text-muted ml-1 font-sans text-[9px]">
                          {e.fate === "dropped"
                            ? "too late"
                            : e.fate === "late-ok"
                              ? "late, kept"
                              : "new"}
                        </span>
                      )}
                    </motion.p>
                  )),
                )}
              </div>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1 text-[10px]">STATE STORE (open windows)</p>
              {b.windows.map(([w, n]) => (
                <motion.div key={w} layout className="flex justify-between font-mono text-[11px]">
                  <span>{w}–</span>
                  <motion.span key={n} initial={{ scale: 1.4 }} animate={{ scale: 1 }}>
                    {n}
                  </motion.span>
                </motion.div>
              ))}
              <p className="text-muted mt-2 text-[10px]">watermark used: {prevWm}</p>
              <p className="text-accent text-[10px]">next watermark: {b.watermark}</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted mb-1 text-[10px]">OUTPUT (final counts)</p>
              {emittedSoFar.length === 0 ? (
                <p className="text-subtle text-[11px]">nothing final yet</p>
              ) : (
                emittedSoFar.map(([w, n]) => (
                  <motion.p
                    key={w}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-good font-mono text-[11px]"
                  >
                    {w}–{w.replace(":00", ":10")} → {n}
                  </motion.p>
                ))
              )}
            </div>
          </div>
          <FrameCaption frameKey={s.batch} title={`Micro-batch ${s.batch}`}>
            {b.note}
          </FrameCaption>
        </div>
      }
    >
      <p>
        By default Spark runs a stream as a series of small batch jobs,{" "}
        <Term id="micro-batch">micro-batches</Term>. Step through four of them counting events per
        10-minute window.
      </p>
      <p>
        Events can arrive late. A <Term id="watermark">watermark</Term> says how late is still
        acceptable: here, 10 minutes behind the latest event time seen. Once the watermark passes
        the end of a window, its count is final, its state is freed, and anything later for it is
        dropped.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Triggers and modes -------------------------------------------------------------------------- */

export function Triggers() {
  const [s, set] = useSceneState<StreamState>();
  const t = TRIGGERS.find((x) => x.id === s.trig)!;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Triggers and modes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {TRIGGERS.map((x) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.trig === x.id}
                onClick={() => set({ trig: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px]",
                  s.trig === x.id ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3 text-xs"
          >
            <Code>{t.code}</Code>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-muted text-[10px]">latency</p>
                <p className="font-semibold">{t.latency}</p>
              </div>
              <div>
                <p className="text-muted text-[10px]">guarantee</p>
                <p className="font-semibold">{t.guarantee}</p>
              </div>
            </div>
            <p className="text-muted">{t.note}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        A <Term id="trigger">trigger</Term> decides when the next batch runs. The default runs them
        back to back; a fixed interval spaces them out; <code>availableNow</code> catches up and
        stops, so a scheduled job can use streaming code and only pay for the cluster while it runs.
      </p>
      <p>
        For lower latency there are two non-batch options: the older, still-experimental continuous
        processing, and real-time mode, added to open-source Spark in 4.1.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoints and state ----------------------------------------------------------------------- */

export function Checkpoints() {
  const [s, set] = useSceneState<StreamState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Checkpoints and state"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`query = (counts.writeStream
    .option("checkpointLocation", "s3://lake/_chk/counts")
    .toTable("window_counts"))

# for millions of keys, keep state in RocksDB instead of the JVM heap
spark.conf.set("spark.sql.streaming.stateStore.providerClass",
  "org.apache.spark.sql.execution.streaming.state.RocksDBStateStoreProvider")`}</Code>
          <div className="border-line bg-surface rounded-xl border px-3 py-3">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={cn(
                    "rounded-md border px-2 py-1 font-mono text-[10px]",
                    s.crashed && n === 2 ? "border-bad bg-bad/10" : "border-line",
                  )}
                >
                  batch {n}
                  {s.crashed && n === 2 && " ✗"}
                </div>
              ))}
            </div>
            <button
              type="button"
              aria-pressed={s.crashed}
              onClick={() => set({ crashed: !s.crashed })}
              className={cn(
                "mt-2 rounded-full border px-3 py-1 text-xs",
                s.crashed ? "border-accent bg-accent-soft" : "border-line",
              )}
            >
              {s.crashed ? "✓ " : ""}crash during batch 2, then restart
            </button>
            {s.crashed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-good mt-2 text-xs"
              >
                On restart Spark reads the checkpoint: batches 0 and 1 are done, with their offsets
                and state. It re-runs batch 2 from the same offsets. With a replayable source and an
                idempotent sink, nothing is lost or counted twice.
              </motion.p>
            )}
          </div>
        </div>
      }
    >
      <p>
        Every streaming query needs a <Term id="streaming-checkpoint">checkpoint location</Term>.
        Spark records there which offsets each batch covered and the running state, using a
        write-ahead log. That&apos;s what makes end-to-end exactly-once possible.
      </p>
      <p>
        State lives in executor memory by default. RocksDB (since 3.2) keeps it in native memory and
        on local disk, which suits large state. Spark 4.0 added <code>transformWithState</code>, an
        API for custom state with timers and automatic expiry.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which trigger? ------------------------------------------------------------------------------ */

export function WhichTrigger() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which trigger?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-trigger"
            prompt="Which trigger or mode fits each need?"
            categories={[
              { id: "default", label: "Default" },
              { id: "interval", label: "Interval" },
              { id: "now", label: "availableNow" },
              { id: "rtm", label: "Real-time" },
            ]}
            items={[
              {
                id: "nightly",
                label:
                  "Run at 2 am, process whatever arrived since yesterday, then shut the cluster down",
                category: "now",
                why: "Catch up, then stop.",
              },
              {
                id: "dash",
                label: "Refresh a dashboard table once a minute",
                category: "interval",
                why: "A fixed processingTime interval.",
              },
              {
                id: "fraud",
                label: "Stateless scoring of card payments within tens of milliseconds",
                category: "rtm",
                why: "Real-time mode targets very low latency for stateless queries.",
              },
              {
                id: "asap",
                label: "As fresh as possible; a second or so is fine",
                category: "default",
                why: "Back-to-back micro-batches.",
              },
              {
                id: "hourly",
                label: "A job scheduled every hour that should stop when it's caught up",
                category: "now",
                why: "availableNow, run by a scheduler.",
              },
            ]}
            explanation="Default runs batches back to back; an interval spaces them; availableNow catches up and stops; real-time mode is for millisecond latency."
          />
        </div>
      }
    >
      <p>Sort the needs.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["A table that keeps growing", "Write a batch query; Spark runs it incrementally."],
  ["Micro-batches by default", "Down to ~100 ms, exactly-once."],
  ["Watermarks", "Bound lateness, finalise windows, free state."],
  ["Checkpoints", "Offsets and state; restart where you left off."],
  ["Triggers", "Default, interval, availableNow; real-time mode for ms."],
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
      <p>Next: Python on Spark, and why some Python code is fast and some is slow.</p>
    </StepLayout>
  );
}

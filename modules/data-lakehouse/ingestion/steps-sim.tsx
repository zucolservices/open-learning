"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  ASSUMPTIONS,
  fmtDur,
  fmtMB,
  fmtN,
  INTERVALS,
  RATES,
  streamStats,
  TARGET_MB,
} from "./stream";
import type { IngestionState } from "./state";

/* 2 ─ Three ways to deliver -------------------------------------------------------------------------- */

const MODES: Record<
  IngestionState["mode"],
  { label: string; analogy: string; how: string; latency: string; examples: string; use: string }
> = {
  batch: {
    label: "Batch",
    analogy: "The nightly delivery van: everything from today, in one trip.",
    how: "A scheduled job copies a whole day (or hour) of data at once.",
    latency: "Hours",
    examples: "Scheduled Spark jobs, database exports, availableNow triggers",
    use: "Daily reports, finance close, anything that only changes on a schedule.",
  },
  micro: {
    label: "Micro-batch",
    analogy: "A courier who leaves every few minutes with whatever has arrived.",
    how: "A streaming job wakes up on an interval and processes everything new since last time.",
    latency: "Seconds to minutes",
    examples: "Spark Structured Streaming, Auto Loader, Kafka Connect sinks",
    use: "Near-real-time dashboards, operational reporting.",
  },
  continuous: {
    label: "Continuous",
    analogy: "A conveyor belt: each parcel moves the moment it arrives.",
    how: "Each record is processed as it arrives, e.g. by Flink. But for a lakehouse table, readers still see new data only at each commit.",
    latency: "Processing in milliseconds; visible at each commit",
    examples: "Apache Flink, Kafka Streams",
    use: "Alerting and fraud checks inside the stream; the table catches up at each commit.",
  },
};

export function ThreeDeliveries() {
  const [s, set] = useSceneState<IngestionState>();
  const m = MODES[s.mode];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Three ways to deliver data"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.mode}
            options={(Object.keys(MODES) as IngestionState["mode"][]).map(
              (k) => [k, MODES[k].label] as [string, string],
            )}
            onChange={(v) => set({ mode: v as IngestionState["mode"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="border-accent/40 bg-accent-soft rounded-xl border px-4 py-3 text-sm">
                {m.analogy}
              </p>
              <dl className="grid gap-2 sm:grid-cols-2">
                {(
                  [
                    ["How", m.how],
                    ["Freshness", m.latency],
                    ["Tools", m.examples],
                    ["Good for", m.use],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} className="border-line bg-surface rounded-xl border px-3 py-2">
                    <dt className="text-muted text-[11px]">{k}</dt>
                    <dd className="mt-0.5 text-sm">{v}</dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Data can arrive in one of three rhythms. Most lakehouses use all three, for different
        tables.
      </p>
      <p>
        One lakehouse-specific catch applies to all of them: a new row is visible only once
        it&apos;s committed to a table. So the <em>commit interval</em>, not the engine&apos;s
        speed, decides how fresh a table is.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Tune a streaming writer ⭐ ---------------------------------------------------------------------- */

export function TuneWriter() {
  const [s, set] = useSceneState<IngestionState>();
  const interval = INTERVALS[s.intervalIdx];
  const rate = RATES[s.rateIdx];
  const st = streamStats(interval, rate);
  const perHour = Math.round(st.filesPerDay / 24);
  const shown = Math.min(perHour, 240);
  const healthy = st.fileMB >= TARGET_MB / 2;

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Tune a streaming writer"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <label className="block">
            <span className="text-muted flex justify-between text-xs">
              Trigger interval (how often the job commits)
              <span className="text-fg font-mono">{fmtDur(interval)}</span>
            </span>
            <input
              type="range"
              aria-label="Trigger interval"
              min={0}
              max={INTERVALS.length - 1}
              step={1}
              value={s.intervalIdx}
              onChange={(e) => set({ intervalIdx: Number(e.target.value) })}
              className="mt-1.5 w-full accent-[var(--accent)]"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Events per second</span>
            <Segmented
              size="sm"
              value={String(s.rateIdx)}
              options={RATES.map((r, i) => [String(i), fmtN(r)] as [string, string])}
              onChange={(v) => set({ rateIdx: Number(v) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Freshness (average)" value={fmtDur(st.latencyS)} tone="text-viz-compute" />
            <Stat label="Commits per day" value={fmtN(st.commitsPerDay)} />
            <Stat
              label="Files per day"
              value={fmtN(st.filesPerDay)}
              bad={st.filesPerDay > 20_000}
            />
            <Stat label="Typical file size" value={fmtMB(st.fileMB)} bad={!healthy} />
          </div>

          <div className="border-line bg-bg/40 rounded-2xl border p-3">
            <p className="text-muted mb-2 text-[11px]">Files written in one hour</p>
            <div className="flex flex-wrap gap-0.5">
              {Array.from({ length: shown }, (_, i) => (
                <motion.span
                  key={`${s.intervalIdx}-${s.rateIdx}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: Math.min(i * 0.002, 0.4) }}
                  className={cn(
                    "block rounded-[2px]",
                    healthy ? "bg-viz-data size-3" : "bg-viz-remove/70 size-1.5",
                  )}
                />
              ))}
              {perHour > shown && (
                <span className="text-subtle ml-1 self-end text-[10px]">
                  +{fmtN(perHour - shown)} more
                </span>
              )}
            </div>
          </div>

          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              healthy ? "border-good/40 bg-good/10" : "border-viz-compute/40 bg-viz-compute/10",
            )}
          >
            {healthy
              ? `Files come out near a healthy size, at the cost of ${fmtDur(st.latencyS)} of delay.`
              : `Fresh data, but each file is only ${fmtMB(st.fileMB)}. About ${fmtN(st.filesPerTargetFile)} of them make one healthy ${TARGET_MB} MB file, so this table needs regular compaction.`}
          </p>

          <details className="text-subtle text-[11px]">
            <summary className="cursor-pointer">
              How this model works (illustrative, not a benchmark)
            </summary>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-4">
              {ASSUMPTIONS.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </details>
        </div>
      }
    >
      <p>
        You run the streaming job. Drag the trigger interval down and watch freshness improve, and
        files multiply and shrink.
      </p>
      <p>
        Then change the event rate. Busy streams can afford short intervals; quiet streams
        can&apos;t, because every commit writes files whatever the volume.
      </p>
      <p className="text-subtle text-xs">
        This is the <Term id="small-files">small-files</Term> problem from the maintenance module,
        seen from the writer&apos;s side. Auto compaction and scheduled compaction clean up after
        it.
      </p>
    </StepLayout>
  );
}

function Stat({
  label,
  value,
  tone,
  bad,
}: {
  label: string;
  value: string;
  tone?: string;
  bad?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px] leading-tight">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4, y: -3 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("font-mono text-lg font-semibold tabular-nums", tone, bad && "text-bad")}
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------------------------ */

export function TriggerCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick a trigger"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="pick-trigger"
            prompt="Operations dashboards must show orders within 5 minutes. About 1,000 events arrive per second. What's a sensible set-up?"
            options={[
              {
                id: "1s",
                label: "Trigger every second, to be as fresh as possible",
                feedback:
                  "Fresher than needed, at the price of hundreds of thousands of tiny files a day.",
              },
              {
                id: "1m",
                label: "Trigger every minute or two, plus scheduled compaction",
                correct: true,
                feedback:
                  "Right. Comfortably inside 5 minutes, with far fewer files, and compaction tidies up the rest.",
              },
              {
                id: "1h",
                label: "Trigger every hour to get large files",
                feedback: "Large files, but the dashboard would be up to an hour behind.",
              },
              {
                id: "continuous",
                label: "Switch to continuous processing so latency doesn't matter",
                feedback:
                  "Readers still only see data at each table commit, so the commit interval still decides freshness.",
              },
            ]}
            explanation="Set the interval from the freshness requirement, not “as fast as possible”, and plan compaction for whatever small files remain."
          />
        </div>
      }
    >
      <p>Use what the simulator showed you.</p>
    </StepLayout>
  );
}

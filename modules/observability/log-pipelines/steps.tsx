"use client";

import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { STAGES, kept, monthly } from "./model";
import type { PipeState } from "./state";

/* 1 ─ From stdout to search ----------------------------------------------------------------------- */

const LABELS = ["app", "node", "agent", "pipeline", "store", "archive"];

export function StdoutToSearch() {
  const [s, set] = useSceneState<PipeState>();
  const f = STAGES[s.frame];
  return (
    <StepLayout
      eyebrow="Step-through"
      title="From stdout to search"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1">
            {LABELS.map((l, i) => (
              <span key={l} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="text-muted size-3" />}
                <motion.span
                  animate={{ scale: i === s.frame ? 1.06 : 1 }}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 font-mono text-[11px]",
                    i === s.frame
                      ? "border-accent bg-accent-soft"
                      : i < s.frame
                        ? "border-good/50 bg-good/5"
                        : "border-line bg-surface",
                  )}
                >
                  {l}
                </motion.span>
              </span>
            ))}
          </div>
          <Stepper step={s.frame} count={STAGES.length} onChange={(frame) => set({ frame })} />
          <FrameCaption frameKey={s.frame} title={f.t}>
            {f.d}
          </FrameCaption>
        </div>
      }
    >
      <p>
        A busy service writes thousands of log lines a second, on dozens of machines that come and
        go. A <Term id="log-pipeline">log pipeline</Term> gathers them into one place you can
        search.
      </p>
      <p>
        Grafana&apos;s older collectors, Promtail and Grafana Agent, have reached end of life; their
        replacement, Alloy, is a distribution of the OpenTelemetry Collector. Fluent Bit (part of
        the CNCF&apos;s graduated Fluent project) and Vector are the other common choices.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A month of logs, priced ⭐ ------------------------------------------------------------------ */

function usd(n: number) {
  return n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n)}`;
}

export function Priced() {
  const [s, set] = useSceneState<PipeState>();
  const plan = {
    gbPerDay: s.gb,
    dropDebug: s.dropDebug,
    sampleHealth: s.sampleHealth,
    hotDays: s.hotDays,
  };
  const m = monthly(plan);
  const max = Math.max(m.cloudwatch, m.datadog, m.grafana, 1);
  const rows: [string, number][] = [
    ["Amazon CloudWatch Logs", m.cloudwatch],
    ["Datadog Logs", m.datadog],
    ["Grafana Cloud Logs", m.grafana],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A month of logs, priced"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <label className="grid grid-cols-[6.5rem_1fr_4rem] items-center gap-2 text-xs">
            <span>Raw logs per day</span>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={s.gb}
              onChange={(e) => set({ gb: Number(e.target.value) })}
              className="accent-accent"
              aria-label="Raw logs per day"
            />
            <span className="text-right font-mono">{s.gb} GB</span>
          </label>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.dropDebug}
                onChange={(e) => set({ dropDebug: e.target.checked })}
                className="accent-accent"
              />
              Drop DEBUG lines in production
            </label>
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.sampleHealth}
                onChange={(e) => set({ sampleHealth: e.target.checked })}
                className="accent-accent"
              />
              Keep 1 in 20 health-check lines
            </label>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted">Searchable for</span>
            <Segmented<"7" | "15" | "30">
              size="sm"
              value={`${s.hotDays}` as "7" | "15" | "30"}
              onChange={(v) => set({ hotDays: Number(v) as 7 | 15 | 30 })}
              options={[
                ["7", "7 days"],
                ["15", "15 days"],
                ["30", "30 days"],
              ]}
            />
          </div>
          <p className="text-muted font-mono text-[10px]">
            kept after the pipeline: {kept(plan).toFixed(0)} GB a day ·{" "}
            {Math.round(m.gb).toLocaleString("en-IN")} GB a month
          </p>
          <div className="flex flex-col gap-2">
            {rows.map(([n, v]) => (
              <div key={n} className="grid grid-cols-[10rem_1fr_4rem] items-center gap-2 text-xs">
                <span>{n}</span>
                <span className="bg-surface-2 h-4 overflow-hidden rounded">
                  <motion.span
                    animate={{ width: `${(v / max) * 100}%` }}
                    className="bg-accent/60 block h-full rounded"
                  />
                </span>
                <span className="text-right font-mono">{usd(v)}/mo</span>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            List prices read 3 October 2026 (US East, USD): CloudWatch $0.50/GB ingested +
            $0.03/GB-month stored; Datadog $0.10/GB + $1.70 per million events indexed for 15 days
            (assumes about a million events per GB, scaled by retention); Grafana Cloud $0.55/GB
            after 50 GB a month. Shares of DEBUG and health-check lines are illustrative. Contracts
            vary.
          </p>
        </div>
      }
    >
      <p>
        Logs grow with traffic, and many vendors charge per gigabyte and per indexed event. Raise
        the volume, then switch on the two cheapest savings any team can make.
      </p>
      <p>
        The pricing models differ: some charge mostly to ingest, others to index, others to keep.
        Some, like Datadog, let you ingest everything but index only what you search often, and
        rehydrate the rest from an archive when needed.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Index everything, or only labels? ----------------------------------------------------------- */

const STORES: [string, string, string][] = [
  [
    "Full-text index",
    "Elasticsearch, OpenSearch, Splunk",
    "Every word is indexed, so any search is fast; the index is big and costs storage and compute.",
  ],
  [
    "Label index",
    "Grafana Loki",
    'Loki "does not index the contents of the logs, but only indexes metadata about your logs as a set of labels for each log stream". Cheap to store; searches scan the matching streams.',
  ],
  [
    "Column store",
    "ClickHouse-based tools (ClickStack, SigNoz), Honeycomb",
    "Each field stored as a column: fast filtering and counting over wide, structured events.",
  ],
];

export function IndexOrLabels() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Index everything, or only labels?"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {STORES.map(([t, who, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="flex items-baseline justify-between gap-2 text-sm font-semibold">
                {t}
                <span className="text-muted text-[10px] font-normal">{who}</span>
              </p>
              <p className="text-muted mt-1 text-xs">{d}</p>
            </motion.div>
          ))}
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="font-semibold">Tiers</p>
            <p className="text-muted mt-1">
              Elasticsearch moves data through hot, warm, cold and frozen tiers; CloudWatch has an
              Infrequent Access class at half the ingest price ($0.25/GB) for logs you rarely query.
            </p>
          </div>
        </div>
      }
    >
      <p>
        How a store indexes logs decides what searching costs. Indexing every word makes any query
        fast but storage expensive; indexing only labels is cheap but slower for
        needle-in-a-haystack searches.
      </p>
      <p>
        <Term id="retention">Retention</Term> matters as much: most investigations look at the last
        few days, while audits may need months. Keep each kind of log only as hot as its use.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Keep or cut? -------------------------------------------------------------------------------- */

export function KeepOrCut() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Keep or cut?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="keep-or-cut"
            prompt="For each kind of log, keep every line, or drop, sample or summarise it?"
            categories={[
              { id: "keep", label: "Keep every line" },
              { id: "cut", label: "Drop, sample or summarise" },
            ]}
            items={[
              {
                id: "payerr",
                label: "Payment failures, with order and bank",
                category: "keep",
                why: "Rare and valuable: exactly what you search during incidents.",
              },
              {
                id: "audit",
                label: "Admin changes to customer accounts",
                category: "keep",
                why: "An audit trail must be complete, often for a set period.",
              },
              {
                id: "login",
                label: "Failed login attempts",
                category: "keep",
                why: "Security investigations need every one.",
              },
              {
                id: "health",
                label: '"Health check OK" every 5 seconds from every pod',
                category: "cut",
                why: "Pure noise; sample it or drop it and rely on a metric.",
              },
              {
                id: "debug",
                label: "DEBUG output from production",
                category: "cut",
                why: "Switch it on briefly when needed, not all the time.",
              },
              {
                id: "success",
                label: "One INFO line per successful request, at 5,000 a second",
                category: "cut",
                why: "Count them with a metric and sample the lines; traces carry the detail.",
              },
            ]}
            explanation="Keep rare, high-value events in full; cut high-volume, low-value lines, or turn them into metrics."
          />
        </div>
      }
    >
      <p>Most log spend goes on lines nobody ever reads.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Write to stdout", "Let a node agent collect and label."],
  ["Clean up early", "Drop, sample and redact in the pipeline, before you pay."],
  ["Choose the index", "Full text, labels or columns: each trades cost for speed."],
  ["Tier by age", "Hot for days, cheap for months, archives for audits."],
  ["Count, don't log", "High-volume successes belong in metrics."],
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
        The OpenTelemetry Collector has processors for all of this (filter, transform, attributes,
        redaction, probabilistic sampling, de-duplication), so the same pipeline can feed any store.
      </p>
      <p>Next: traces, and how one request is followed across services.</p>
    </StepLayout>
  );
}

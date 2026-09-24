"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  ASSUMPTIONS,
  fmtGB,
  fmtN,
  fmtS,
  layout,
  QUERIES,
  queryCost,
  SCHEMES,
  TARGET_MB,
  type QueryId,
  type Scheme,
} from "./model";
import type { PartitioningState } from "./state";

/* 2 ─ The partitioning simulator ⭐ ----------------------------------------------------- */

function health(s: Scheme) {
  const l = layout(s);
  if (l.partitions >= 100_000) return { label: "Far too many partitions", tone: "bad" as const };
  if (l.smallestFileMB < 64) return { label: "Small files", tone: "bad" as const };
  if (l.partitions <= 3) return { label: "Too coarse to prune much", tone: "warn" as const };
  if (s === "country") return { label: "Skewed partitions", tone: "warn" as const };
  return { label: "Healthy layout", tone: "good" as const };
}

export function Simulator() {
  const [s, set] = useSceneState<PartitioningState>();
  const l = layout(s.scheme);
  const c = queryCost(s.scheme, s.query);
  const h = health(s.scheme);
  const all = SCHEMES.map((x) => ({ ...x, cost: queryCost(x.id, s.query) }));
  const maxLog = Math.log10(Math.max(...all.map((x) => x.cost.seconds)) * 1000 + 1);
  const scheme = SCHEMES.find((x) => x.id === s.scheme)!;

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Choose a partition scheme"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div>
            <p className="text-muted mb-1.5 text-xs">Partition orders by</p>
            <div className="flex flex-wrap gap-1.5">
              {SCHEMES.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ scheme: x.id })}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                    x.id === s.scheme
                      ? "bg-accent text-accent-fg"
                      : "bg-surface-2 text-muted hover:text-fg",
                  )}
                >
                  {x.label}
                </button>
              ))}
            </div>
          </div>
          <Code className="text-[10px]">{scheme.path}</Code>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Partitions" value={fmtN(l.partitions)} />
            <Stat label="Data files" value={fmtN(l.files)} />
            <Stat
              label="Smallest files"
              value={l.smallestFileMB >= 1 ? `${Math.round(l.smallestFileMB)} MB` : "<1 MB"}
              bad={l.smallestFileMB < 64}
            />
            <Stat
              label="Files per hourly write"
              value={fmtN(l.filesPerBatch)}
              bad={l.filesPerBatch > 1000}
            />
          </div>
          <p
            className={cn(
              "self-start rounded-full px-3 py-1 text-xs font-medium",
              h.tone === "good"
                ? "bg-good/15 text-good"
                : h.tone === "bad"
                  ? "bg-bad/15 text-bad"
                  : "bg-viz-compute/15 text-viz-compute",
            )}
          >
            {h.label}
          </p>

          <div className="border-line bg-bg/40 flex flex-col gap-3 rounded-2xl border p-4">
            <Segmented
              size="sm"
              value={s.query}
              options={QUERIES.map((q) => [q.id, q.label] as [string, string])}
              onChange={(v) => set({ query: v as QueryId })}
            />
            <Code className="text-[10px] whitespace-pre-wrap">
              {QUERIES.find((q) => q.id === s.query)!.sql}
            </Code>
            <div className="grid grid-cols-3 gap-2">
              <Stat label="Data read" value={fmtGB(c.gbRead)} />
              <Stat label="Files opened" value={fmtN(c.filesRead)} />
              <Stat label="Estimated time" value={fmtS(c.seconds)} accent />
            </div>
            <div className="grid gap-1">
              {all.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ scheme: x.id })}
                  className="group grid grid-cols-[6.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-left text-[11px]"
                >
                  <span
                    className={cn(
                      x.id === s.scheme
                        ? "text-fg font-semibold"
                        : "text-muted group-hover:text-fg",
                    )}
                  >
                    {x.label}
                  </span>
                  <span className="bg-surface-2 h-2 overflow-hidden rounded-full">
                    <motion.span
                      className={cn(
                        "block h-full rounded-full",
                        x.id === s.scheme ? "bg-viz-compute" : "bg-line-strong",
                      )}
                      initial={false}
                      animate={{
                        width: `${(Math.log10(x.cost.seconds * 1000 + 1) / maxLog) * 100}%`,
                      }}
                    />
                  </span>
                  <span className="text-muted text-right font-mono tabular-nums">
                    {fmtS(x.cost.seconds)}
                  </span>
                </button>
              ))}
              <p className="text-subtle text-[10px]">
                Every scheme for this query (log scale). Click one to select it.
              </p>
            </div>
          </div>

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
        Three years of orders, about a terabyte. Pick a way to <Term id="partition">partition</Term>{" "}
        it, then run three different queries against it.
      </p>
      <p>
        Watch two things fight. Finer partitions let queries skip more, but split the data into
        more, smaller files, and too many <Term id="small-files">small files</Term> make every query
        and every write slower.
      </p>
      <p>
        Try Day, then Hour, then Customer ID. Notice that no scheme is best for every query: you
        partition for the filters people use most.
      </p>
      <p className="text-subtle text-xs">
        Files are compacted toward {TARGET_MB} MB, but a file can never hold rows from two
        partitions, so small partitions mean small files.
      </p>
    </StepLayout>
  );
}

function Stat({
  label,
  value,
  bad,
  accent,
}: {
  label: string;
  value: string;
  bad?: boolean;
  accent?: boolean;
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
        className={cn(
          "font-mono text-lg font-semibold tabular-nums",
          accent && "text-viz-compute",
          bad && "text-bad",
        )}
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 3 ─ Checkpoint --------------------------------------------------------------------------- */

export function CardinalityCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does a high-cardinality key cost?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="cardinality"
            prompt="A table is partitioned by customer_id (1 million customers). Every hour, a job appends orders from about 300,000 different customers. What happens on each hourly write?"
            options={[
              {
                id: "one",
                label: "It writes one large file, like any other append",
                feedback:
                  "A file can't hold rows from two partitions, so one file per customer touched is the minimum.",
              },
              {
                id: "many",
                label: "It writes around 300,000 tiny files, one per customer's partition",
                correct: true,
                feedback:
                  "Right. Each file holds a handful of rows. Listing, planning and compacting all that becomes the bottleneck.",
              },
              {
                id: "fast",
                label: "It's faster than usual, because each partition is small",
                feedback:
                  "Smaller partitions mean more of them, and every file has a fixed overhead to create and later to read.",
              },
              {
                id: "reject",
                label: "The table format rejects it for having too many partitions",
                feedback:
                  "Table formats won't stop you (some engines do have limits on partitions per write). The cost shows up in performance.",
              },
            ]}
            explanation="That's why the classic advice is to partition on low-to-moderate cardinality columns that queries filter on, such as a date."
          />
        </div>
      }
    >
      <p>Think about how many partitions one hour of data touches.</p>
    </StepLayout>
  );
}

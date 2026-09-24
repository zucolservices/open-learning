"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { SkippingState } from "./state";

/* 1 ─ Labels on every box ------------------------------------------------------------------ */

const ARRIVAL: [number, number][] = [
  [20, 480],
  [35, 455],
  [10, 470],
  [60, 390],
  [15, 500],
  [40, 380],
  [25, 460],
  [30, 420],
];
const CLUSTERED: [number, number][] = [
  [10, 70],
  [70, 130],
  [130, 190],
  [190, 250],
  [250, 310],
  [310, 370],
  [370, 435],
  [435, 500],
];

export function LabelsOnBoxes() {
  const [s, set] = useSceneState<SkippingState>();
  const ranges = s.statsLayout === "clustered" ? CLUSTERED : ARRIVAL;
  const read = ranges.map(([, max]) => max > 400);
  const n = read.filter(Boolean).length;

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A label on every box"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Code className="text-[10px]">{"SELECT * FROM orders WHERE amount > 400"}</Code>
          <Segmented
            size="sm"
            value={s.statsLayout}
            options={[
              ["arrival", "Rows in arrival order"],
              ["clustered", "Rows clustered by amount"],
            ]}
            onChange={(v) => set({ statsLayout: v as SkippingState["statsLayout"] })}
          />
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
            {ranges.map(([min, max], i) => (
              <motion.div
                key={`${s.statsLayout}-${i}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: read[i] ? 1 : 0.4, y: 0 }}
                transition={{ delay: 0.04 * i }}
                className={cn(
                  "rounded-lg border px-1.5 py-2 text-center font-mono text-[10px]",
                  read[i] ? "border-viz-compute bg-viz-compute/20" : "border-line border-dashed",
                )}
              >
                <p className="font-semibold">file {i + 1}</p>
                <p className="text-muted mt-1">min {min}</p>
                <p className="text-muted">max {max}</p>
                <p className="mt-1 text-[9px]">{read[i] ? "read" : "skipped"}</p>
              </motion.div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              n <= 2 ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {s.statsLayout === "clustered"
              ? `Read ${n} of 8 files. The same statistics, but now each file covers a narrow range, so most can be ruled out.`
              : `Read ${n} of 8 files. Every file holds a mix of small and large amounts, so almost every label says “might contain amounts over 400”.`}
          </p>
          <div className="grid gap-2 md:grid-cols-3">
            <Where
              who="Delta Lake"
              where="In the log: each add action's stats"
              code={
                '"stats": {"numRecords": 1200,\n  "minValues": {"amount": 20},\n  "maxValues": {"amount": 480},\n  "nullCount": {"amount": 0}}'
              }
            />
            <Where
              who="Iceberg"
              where="In manifests: per-file bounds"
              code={
                "lower_bounds: {amount: 20}\nupper_bounds: {amount: 480}\nvalue_counts, null_value_counts"
              }
            />
            <Where
              who="Hudi"
              where="In the metadata table"
              code={"column_stats partition:\n  file, column, min, max,\n  null count, value count"}
            />
          </div>
        </div>
      }
    >
      <p>
        Imagine a warehouse of sealed boxes, each with a label: “orders with amounts from 20 to
        480”. To find big orders, you only open boxes whose label allows it.
      </p>
      <p>
        Table formats keep exactly these labels: <Term id="statistics">statistics</Term> for every
        data file, such as each column&apos;s min and max. Engines read the labels first and skip
        files that can&apos;t match. That&apos;s <Term id="data-skipping">data skipping</Term>.
      </p>
      <p>
        But labels only help if each box holds a narrow range. Flip the switch: the statistics
        don&apos;t change, the arrangement of rows does.
      </p>
      <p className="text-subtle text-xs">
        Stats have limits. Delta collects them for the first 32 columns by default (
        <code>delta.dataSkippingStatsColumns</code> picks others); Iceberg by default for up to 100
        columns, with string bounds truncated to 16 characters.
      </p>
    </StepLayout>
  );
}

function Where({ who, where, code }: { who: string; where: string; code: string }) {
  return (
    <div className="border-line bg-surface rounded-xl border p-3">
      <p className="text-sm font-semibold">{who}</p>
      <p className="text-muted text-[11px]">{where}</p>
      <Code className="mt-2 text-[9px] whitespace-pre-wrap">{code}</Code>
    </div>
  );
}

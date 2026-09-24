"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ShowdownState } from "./state";

/* 1 ─ Same job, three designs ---------------------------------------------------- */

const MODELS: Record<
  ShowdownState["recap"],
  { name: string; analogy: string; find: string[]; born: string }
> = {
  delta: {
    name: "Delta Lake",
    analogy: "A diary",
    find: [
      "List _delta_log/ and find the newest checkpoint",
      "Replay the JSON commits after it",
      "The add actions left standing are the table",
    ],
    born: "Databricks, open-sourced 2019: reliable Spark pipelines",
  },
  iceberg: {
    name: "Apache Iceberg",
    analogy: "A library guide",
    find: [
      "Ask the catalog for the current metadata file",
      "Follow its snapshot to the manifest list",
      "Walk down the manifests to the data files",
    ],
    born: "Netflix, 2017: correct, fast tables at huge scale, for many engines",
  },
  hudi: {
    name: "Apache Hudi",
    analogy: "A kitchen order rail",
    find: [
      "Read the completed instants on the timeline",
      "Pick each file group's latest file slice",
      "Merge its log files in (Merge-on-Read)",
    ],
    born: "Uber, 2016: fast upserts and incremental pipelines",
  },
};

const SKELETON = [
  [
    "Data files",
    "Immutable Parquet files, never edited in place",
    "bg-viz-data/15 border-viz-data/50",
  ],
  [
    "Metadata",
    "Records which files make up each version of the table",
    "bg-viz-meta/15 border-viz-meta/50",
  ],
  [
    "Atomic commit",
    "One all-or-nothing step publishes a new version",
    "bg-accent-soft border-accent/50",
  ],
];

export function SameJob() {
  const [s, set] = useSceneState<ShowdownState>();
  const m = MODELS[s.recap];

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="Same job, three designs"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div>
            <p className="text-muted mb-2 text-xs">What all three have in common</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {SKELETON.map(([title, body, cls]) => (
                <div key={title} className={cn("rounded-xl border p-3", cls)}>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-muted mt-0.5 text-xs">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-line bg-bg/40 flex flex-col gap-3 rounded-2xl border p-4">
            <p className="text-muted text-xs">
              Where they differ: how a reader finds the current table
            </p>
            <Segmented
              size="sm"
              value={s.recap}
              options={[
                ["delta", "Delta Lake"],
                ["iceberg", "Iceberg"],
                ["hudi", "Hudi"],
              ]}
              onChange={(v) => set({ recap: v as ShowdownState["recap"] })}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={s.recap}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <p className="text-lg font-semibold">
                  {m.analogy} <span className="text-muted text-sm font-normal">· {m.name}</span>
                </p>
                <ol className="grid gap-1">
                  {m.find.map((line, i) => (
                    <li key={line}>
                      {i > 0 && <ArrowDown className="text-subtle mx-auto mb-1 size-3" />}
                      <div className="border-viz-meta/40 bg-viz-meta/10 rounded-lg border px-3 py-2 text-sm">
                        {line}
                      </div>
                    </li>
                  ))}
                </ol>
                <p className="text-subtle text-xs">Born at {m.born}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      }
    >
      <p>
        You&apos;ve now met all three open <Term id="table-format">table formats</Term>. Before
        comparing them, notice how much they share: each turns a pile of Parquet files into a
        reliable table in the same three-part way.
      </p>
      <p>
        What differs is the shape of the metadata, and that came from the problem each was first
        built to solve. Flip between them to recall each one&apos;s mental model.
      </p>
    </StepLayout>
  );
}

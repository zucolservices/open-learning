"use client";

import { motion } from "motion/react";
import { Box, Sheet } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CODE, LINEAGE, SEES, type Api } from "./model";
import type { RddState } from "./state";

/* 1 ─ A box of papers or a spreadsheet? ----------------------------------------------------------- */

export function BoxOrSheet() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A box of papers or a spreadsheet?"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Box className="text-viz-idle size-6" />
            <p className="text-sm font-semibold">A box of papers</p>
            <p className="text-muted text-xs">
              &ldquo;Find the average order in Pune.&rdquo; Your helper has to pull out every sheet
              and read all of it, because they don&apos;t know where anything is written.
            </p>
          </div>
          <div className="border-accent bg-accent-soft flex flex-col gap-2 rounded-xl border px-4 py-3">
            <Sheet className="text-accent size-6" />
            <p className="text-sm font-semibold">A labelled spreadsheet</p>
            <p className="text-muted text-xs">
              Same question. Your helper looks at just the city and amount columns, and skips
              straight past rows that aren&apos;t Pune.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Ask someone to work out an average from a box of mixed papers and they must read everything.
        Hand them a spreadsheet with labelled columns and they can be clever about it, because they
        can see what the data looks like and what you&apos;re asking.
      </p>
      <p>
        Spark has both. Its original <Term id="rdd">RDD</Term> API is the box: collections of any
        objects, processed by your functions. The <Term id="dataframe">DataFrame</Term> API is the
        spreadsheet: rows with named, typed columns, a <Term id="schema-spark">schema</Term>, so
        Spark can optimise your job.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Same question, two APIs ⭐ ------------------------------------------------------------------ */

export function SameQuestion() {
  const [s, set] = useSceneState<RddState>();
  const sees = SEES[s.api];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same question, two APIs"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented<Api>
            size="sm"
            value={s.api}
            onChange={(api) => set({ api })}
            options={[
              ["rdd", "RDD API"],
              ["df", "DataFrame API"],
            ]}
          />
          <Code>{CODE[s.api]}</Code>
          <div className="border-line bg-surface rounded-xl border px-4 py-3">
            <p className="text-xs font-semibold">What Spark can see</p>
            {sees.items.map((it, i) => (
              <motion.p
                key={s.api + i}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="text-muted mt-1 text-xs"
              >
                • {it}
              </motion.p>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["columns read", `${sees.columns} of 12`],
              ["filter at the file", sees.filterAtScan ? "yes" : "no"],
              ["data read", `${sees.gb} GB`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-3 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p
                  className={cn(
                    "font-mono text-sm font-semibold",
                    s.api === "df" ? "text-good" : "text-bad",
                  )}
                >
                  {v}
                </p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            An illustrative 120 GB orders dataset with 12 columns, stored as Parquet for the
            DataFrame.
          </p>
        </div>
      }
    >
      <p>
        One question: what&apos;s the average order value in Pune? Ask it both ways. With an RDD,
        Spark runs your Python functions faithfully but can&apos;t see inside them. With a
        DataFrame, it knows the columns and the operations.
      </p>
      <p>
        As Spark&apos;s guide puts it, &ldquo;Spark SQL uses this extra information to perform extra
        optimizations.&rdquo; Same cluster, same answer, a fraction of the data read.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Rebuilding from the recipe ------------------------------------------------------------------ */

export function Lineage() {
  const [s, set] = useSceneState<RddState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Rebuilding from the recipe"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1.5">
            {LINEAGE.map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="text-muted w-24 font-mono text-[11px]">{step}</span>
                <div className="flex flex-1 gap-1">
                  {[0, 1, 2, 3].map((p) => {
                    const lost = s.lost && p === 2 && i === LINEAGE.length - 1;
                    const rebuilding = s.lost && p === 2 && i < LINEAGE.length - 1;
                    return (
                      <motion.span
                        key={p}
                        animate={{ opacity: lost ? 0.2 : 1 }}
                        className={cn(
                          "grid h-6 flex-1 place-items-center rounded border font-mono text-[9px]",
                          lost
                            ? "border-bad border-dashed"
                            : rebuilding
                              ? "border-viz-meta bg-viz-meta/20"
                              : "border-viz-data bg-viz-data/15",
                        )}
                      >
                        p{p + 1}
                      </motion.span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set({ lost: !s.lost })}
            className="border-line hover:bg-surface-2 self-start rounded-md border px-3 py-1.5 text-xs"
          >
            {s.lost ? "Reset" : "Lose the machine holding partition 3"}
          </button>
          {s.lost && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-good/50 bg-good/10 rounded-xl border px-4 py-3 text-sm"
            >
              Spark replays only partition 3&apos;s steps (purple) from the source. The other three
              partitions are untouched, and no copy of the data was ever needed.
            </motion.p>
          )}
        </div>
      }
    >
      <p>
        &ldquo;Resilient&rdquo; is the R in RDD. Spark doesn&apos;t protect data by keeping copies;
        it remembers the recipe, the chain of steps that produced each piece. That recipe is its{" "}
        <Term id="lineage">lineage</Term>.
      </p>
      <p>
        The 2012 paper describes logging &ldquo;the transformations used to build a dataset (its
        lineage) rather than the actual data.&rdquo; Lose a partition, and Spark recomputes just
        that partition. DataFrames get the same protection: they&apos;re built on the same
        machinery.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three APIs, one engine ---------------------------------------------------------------------- */

const APIS: [string, string, string][] = [
  [
    "RDD",
    "Spark 0.x onwards",
    "Any objects, your functions. Low-level and flexible, little optimisation. Still available, but not supported through Spark Connect.",
  ],
  [
    "DataFrame",
    "Spark 1.3, 2015",
    "Rows with named columns, like a table. Python, Scala, Java and R. What most code uses today.",
  ],
  [
    "Dataset",
    "Spark 1.6, 2016",
    "Typed objects with the optimiser's benefits. Scala and Java only; a DataFrame is a Dataset of rows.",
  ],
];

export function WhichApi() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three APIs, one engine"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {APIS.map(([t, when, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className={cn(
                "rounded-lg border px-3 py-2",
                i === 1 ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-sm font-semibold">
                {t} <span className="text-muted font-mono text-[11px] font-normal">· {when}</span>
              </p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        DataFrames arrived in Spark 1.3 (renamed from an earlier &ldquo;SchemaRDD&rdquo;), and{" "}
        <Term id="dataset-spark">Datasets</Term> in 1.6. Spark 2.0 (2016) unified them: in Scala and
        Java, a DataFrame is simply a Dataset of rows.
      </p>
      <p>
        Python has no Dataset API (it isn&apos;t a typed language), so Python users work with
        DataFrames. Underneath, Spark&apos;s guide notes, &ldquo;the same execution engine is used,
        independent of which API/language you are using&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which API? ---------------------------------------------------------------------------------- */

export function PickApi() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which API?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-api"
            prompt="Which API fits each piece of code best?"
            categories={[
              { id: "df", label: "DataFrame" },
              { id: "ds", label: "Dataset" },
              { id: "rdd", label: "RDD" },
            ]}
            items={[
              {
                id: "py",
                label: "Python code that reads Parquet and groups sales by region",
                category: "df",
                why: "The standard choice in Python, and the optimiser can help.",
              },
              {
                id: "sql",
                label: "The result of a SQL query used from PySpark",
                category: "df",
                why: "SQL results are DataFrames.",
              },
              {
                id: "scala",
                label: "Scala code using compile-time typed case classes",
                category: "ds",
                why: "Typed objects plus the optimiser.",
              },
              {
                id: "legacy",
                label: "Old code that processes arbitrary binary records with custom partitioning",
                category: "rdd",
                why: "Low-level control where a schema doesn't fit.",
              },
            ]}
            explanation="Use DataFrames by default; Datasets when you want types in Scala or Java; RDDs only for low-level cases a schema can't describe."
          />
        </div>
      }
    >
      <p>Pick the API.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["RDDs", "Any objects, your functions; Spark can't see inside."],
  ["DataFrames", "Columns and a schema, so Spark can optimise."],
  ["Datasets", "Typed DataFrames for Scala and Java."],
  ["Lineage", "Lost pieces are rebuilt from the recipe."],
  ["Default to DataFrames", "Same engine, far more optimisation."],
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
        Next: why none of that DataFrame code actually ran when you wrote it. Spark is lazy, and
        that&apos;s the secret to its optimiser.
      </p>
    </StepLayout>
  );
}

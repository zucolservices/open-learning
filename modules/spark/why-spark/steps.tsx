"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { timeline, total, type Engine } from "./model";
import type { WhyState } from "./state";

const SEG_CLS = {
  read: "bg-viz-remove/70",
  write: "bg-viz-remove/40",
  compute: "bg-viz-compute",
  mem: "bg-viz-add",
};

/* 2 ─ Count the disk trips ⭐ --------------------------------------------------------------------- */

export function DiskTrips() {
  const [s, set] = useSceneState<WhyState>();
  const both = (["mr", "spark"] as Engine[]).map((e) => ({ e, segs: timeline(e, s.passes) }));
  const max = Math.max(...both.map((b) => total(b.segs)));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Count the disk trips"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented<Engine>
              size="sm"
              value={s.engine}
              onChange={(engine) => set({ engine })}
              options={[
                ["mr", "Highlight MapReduce"],
                ["spark", "Highlight Spark"],
              ]}
            />
            <label className="flex flex-1 items-center gap-2 text-xs">
              <span className="text-muted">passes over the data</span>
              <input
                type="range"
                min={1}
                max={10}
                value={s.passes}
                onChange={(e) => set({ passes: Number(e.target.value) })}
                className="accent-accent flex-1"
              />
              <span className="w-6 text-right font-mono">{s.passes}</span>
            </label>
          </div>
          {both.map(({ e, segs }) => (
            <div
              key={e}
              className={cn(
                "flex flex-col gap-1 transition-opacity",
                s.engine === e ? "opacity-100" : "opacity-50",
              )}
            >
              <div className="flex justify-between text-xs">
                <span className="font-semibold">
                  {e === "mr" ? "MapReduce style" : "Spark style"}
                </span>
                <span className="font-mono">{total(segs)} min</span>
              </div>
              <div className="bg-surface-2 flex h-6 overflow-hidden rounded-md">
                {segs.map((sg, i) => (
                  <motion.div
                    key={`${e}-${i}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(sg.t / max) * 100}%` }}
                    transition={{ delay: 0.02 * i }}
                    className={cn("h-full border-r border-[var(--bg)]", SEG_CLS[sg.kind])}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="text-muted flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-viz-remove/70 size-2.5 rounded-sm" /> read from disk
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-remove/40 size-2.5 rounded-sm" /> write to disk
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-compute size-2.5 rounded-sm" /> compute
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-add size-2.5 rounded-sm" /> read from memory
            </span>
          </div>
          <p className="text-subtle text-[10px]">
            Minutes are illustrative, for a job over a few hundred gigabytes.
          </p>
        </div>
      }
    >
      <p>
        An <Term id="iterative-job">iterative job</Term>, like training a model, passes over the
        same data many times. Slide the number of passes and compare an engine that reads and writes
        disk every pass with one that reads once and keeps the data in memory.
      </p>
      <p>
        With one pass, the two are close: both must read the data once. The gap grows with every
        pass. That&apos;s why Spark&apos;s papers measured the biggest wins on iterative work, not
        on everything.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The sorting record -------------------------------------------------------------------------- */

export function Record() {
  const rows: [string, string, number, number][] = [
    ["Hadoop MapReduce (2013 record)", "2,100 machines", 72, 2100],
    ["Spark (2014)", "206 machines", 23, 206],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="The sorting record"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          {rows.map(([t, m, min, machines]) => (
            <div key={t} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{t}</span>
                <span className="text-muted">{m}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-surface-2 h-5 flex-1 rounded">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(min / 72) * 100}%` }}
                    className={cn("h-full rounded", machines > 1000 ? "bg-viz-idle" : "bg-accent")}
                  />
                </div>
                <span className="w-16 text-right font-mono text-xs">{min} min</span>
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            Sorting about 100 TB in the Daytona GraySort benchmark. Spark&apos;s entry tied for
            first with a University of California, San Diego team.
          </p>
        </div>
      }
    >
      <p>
        In 2014 Spark entered the GraySort benchmark: sort 100 TB as fast as possible. On 206 Amazon
        machines it took 23 minutes; the previous record, set by Hadoop, used 2,100 machines and
        took 72. Three times faster with ten times fewer machines.
      </p>
      <p>
        The detail that matters: the sort ran entirely on disk, without Spark&apos;s in-memory
        cache. Spark is fast not only because of memory, but because of how it plans and moves data,
        which is most of this track.
      </p>
    </StepLayout>
  );
}

/* 4 ─ From a lab to everywhere -------------------------------------------------------------------- */

const EVENTS: [string, string][] = [
  ["2004", "Google publishes the MapReduce paper; Hadoop follows."],
  ["2009", "Spark starts as a research project at UC Berkeley's AMPLab, Matei Zaharia's PhD work."],
  ["2010", "Open-sourced; first paper reports 10× over Hadoop on iterative machine learning."],
  ["2012", "The RDD paper wins a best paper award at NSDI."],
  [
    "2013–14",
    "Joins the Apache Incubator in June 2013; top-level Apache project in February 2014.",
  ],
  ["2025", "Spark 4.0 released in May."],
  ["2026", "Spark 4.2, the current release, in July."],
];

export function Timeline() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="From a lab to everywhere"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {EVENTS.map(([y, d], i) => (
            <motion.div
              key={y}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface grid grid-cols-[4.5rem_1fr] gap-2 rounded-lg border px-3 py-2"
            >
              <span className="text-accent font-mono text-sm font-semibold">{y}</span>
              <span className="text-sm">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Spark is now the most common engine for large-scale data processing, run on its own, on
        Kubernetes, and inside managed services from Databricks (founded by Spark&apos;s creators),
        AWS, Google Cloud and Microsoft.
      </p>
      <p>
        You can write Spark in Python, SQL, Scala, Java or R. This track uses Python and SQL in its
        examples, but the engine underneath is the same.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Do you need Spark? -------------------------------------------------------------------------- */

export function NeedSpark() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Do you need Spark?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="need-spark"
            prompt="Is Spark a good fit for each job?"
            categories={[
              { id: "spark", label: "Good fit" },
              { id: "no", label: "One machine is enough" },
            ]}
            items={[
              {
                id: "logs",
                label: "Process 2 TB of website logs every night",
                category: "spark",
                why: "Too big and slow for one machine.",
              },
              {
                id: "ml",
                label: "Train a model with 20 passes over a billion rows",
                category: "spark",
                why: "Iterative work over large data: Spark's sweet spot.",
              },
              {
                id: "join",
                label: "Join two tables of several terabytes each",
                category: "spark",
                why: "Needs many machines' memory and disks.",
              },
              {
                id: "csv",
                label: "Summarise a 50 MB spreadsheet export",
                category: "no",
                why: "A laptop does this in seconds; a cluster adds overhead.",
              },
              {
                id: "lookup",
                label: "Look up one customer when they log in",
                category: "no",
                why: "That's a database's job, in milliseconds.",
              },
            ]}
            explanation="Spark shines when data or work outgrows one machine. For small data, a single machine is faster and simpler."
          />
        </div>
      }
    >
      <p>Spark has start-up and coordination costs. Sort these jobs.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Split the work", "Many machines each process a share."],
  ["MapReduce paid in disk", "Every step wrote and reread its data."],
  ["Spark keeps data in memory", "Biggest wins on jobs that loop."],
  ["Not only memory", "Planning and data movement matter too."],
  ["Right-size the tool", "Small data doesn't need a cluster."],
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
        Next: what actually runs where when you start a Spark job, the driver and its executors.
      </p>
    </StepLayout>
  );
}

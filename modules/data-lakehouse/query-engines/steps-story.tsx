"use client";

import { AnimatePresence, motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 1 ─ The life of a query ⭐ ---------------------------------------------------------------------- */

const SQL =
  "SELECT city, SUM(amount)\nFROM sales.orders\nWHERE order_date = DATE '2026-09-12'\nGROUP BY city";

const STAGE_NAMES = ["SQL", "Catalog", "Plan", "Prune", "Split", "Scan", "Compute", "Combine"];

function Files() {
  // 100 files: 4 survive pruning (the 12 Sep partition).
  return (
    <div className="grid grid-cols-10 gap-1">
      {Array.from({ length: 100 }, (_, i) => {
        const keep = i >= 44 && i < 48;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 1 }}
            animate={{ opacity: keep ? 1 : 0.15, scale: keep ? 1.08 : 1 }}
            transition={{ delay: keep ? 0.5 : (i % 10) * 0.02 }}
            className={cn("aspect-square rounded-sm", keep ? "bg-viz-data" : "bg-viz-idle")}
          />
        );
      })}
    </div>
  );
}

function PlanTree({ optimised }: { optimised: boolean }) {
  const nodes = optimised
    ? [
        "Aggregate: SUM(amount) BY city",
        "Scan sales.orders\n  columns: city, amount, order_date\n  filter: order_date = 2026-09-12",
      ]
    : [
        "Aggregate: SUM(amount) BY city",
        "Filter: order_date = 2026-09-12",
        "Scan sales.orders (all columns)",
      ];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <AnimatePresence mode="popLayout" initial={false}>
        {nodes.map((n, i) => (
          <motion.div
            key={n}
            layout
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-1.5"
          >
            {i > 0 && <span className="text-subtle text-xs">↑</span>}
            <pre
              className={cn(
                "rounded-lg border px-3 py-1.5 font-mono text-[10px] whitespace-pre",
                optimised && i === 1 ? "border-accent/60 bg-accent-soft" : "border-line bg-surface",
              )}
            >
              {n}
            </pre>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

const WORKERS = ["Worker 1", "Worker 2", "Worker 3", "Worker 4"];
const CITIES = [
  ["Bengaluru", "16.2"],
  ["Mumbai", "14.8"],
  ["Delhi", "12.1"],
  ["Pune", "6.4"],
];

function Scene({ stage }: { stage: number }) {
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex flex-wrap gap-1">
        {STAGE_NAMES.map((n, i) => (
          <span
            key={n}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] transition",
              i === stage
                ? "bg-accent text-accent-fg"
                : i < stage
                  ? "bg-accent-soft text-accent"
                  : "bg-surface-2 text-subtle",
            )}
          >
            {i + 1}. {n}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="border-line bg-surface/60 rounded-xl border p-4"
        >
          {stage === 0 && <pre className="font-mono text-xs leading-relaxed">{SQL}</pre>}
          {stage === 1 && (
            <div className="grid gap-2 font-mono text-[11px]">
              <p>
                <span className="text-muted">engine →</span> catalog: where is <b>sales.orders</b>?
              </p>
              <p>
                <span className="text-muted">catalog →</span>{" "}
                s3://lake/sales/orders/metadata/v42.metadata.json
              </p>
              <p className="text-muted">
                + schema: order_id, order_date, city, amount … (25 columns)
              </p>
              <p className="text-good">✓ you may read it</p>
            </div>
          )}
          {stage === 2 && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-muted mb-2 text-[11px]">As written</p>
                <PlanTree optimised={false} />
              </div>
              <div>
                <p className="text-muted mb-2 text-[11px]">After the optimiser</p>
                <PlanTree optimised />
              </div>
            </div>
          )}
          {stage === 3 && (
            <div className="grid gap-2">
              <Files />
              <p className="text-muted text-[11px]">
                Metadata lists 100 files with their partition values and min/max stats. Only 4 can
                contain 12 September.
              </p>
            </div>
          )}
          {stage === 4 && (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WORKERS.map((w, i) => (
                <motion.div
                  key={w}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className="border-viz-compute/50 bg-viz-compute/10 rounded-lg border p-2 text-center"
                >
                  <p className="text-[10px]">{w}</p>
                  <div className="bg-viz-data mx-auto mt-1.5 h-4 w-8 rounded-sm" />
                  <p className="text-muted mt-1 font-mono text-[9px]">file {45 + i}</p>
                </motion.div>
              ))}
            </div>
          )}
          {stage === 5 && (
            <div className="grid gap-2">
              <p className="text-muted text-[11px]">
                Inside one Parquet file: 25 columns × 4 row groups
              </p>
              <div className="grid grid-cols-[repeat(25,minmax(0,1fr))] gap-0.5">
                {Array.from({ length: 100 }, (_, i) => {
                  const col = i % 25;
                  const rg = Math.floor(i / 25);
                  const wanted = col === 1 || col === 2 || col === 3;
                  const lit = wanted && rg !== 3;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1 }}
                      animate={{ opacity: lit ? 1 : 0.12 }}
                      transition={{ delay: 0.01 * col }}
                      className={cn("h-5 rounded-[2px]", lit ? "bg-viz-data" : "bg-viz-idle")}
                    />
                  );
                })}
              </div>
              <p className="text-muted text-[11px]">
                Read 3 columns, skip 22. The last row group&apos;s min/max says it holds only 13
                September: skipped too.
              </p>
            </div>
          )}
          {stage === 6 && (
            <div className="grid gap-2">
              <p className="text-muted text-[11px]">
                Each worker adds up amounts a batch at a time
              </p>
              <div className="flex gap-1">
                {Array.from({ length: 8 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-viz-compute/70 h-16 flex-1 origin-bottom rounded-sm"
                  />
                ))}
              </div>
              <p className="font-mono text-[10px]">
                batch of 2,048 amounts → one tight loop → partial sums per city
              </p>
            </div>
          )}
          {stage === 7 && (
            <div className="grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="flex gap-1 sm:flex-col">
                {WORKERS.map((w) => (
                  <span
                    key={w}
                    className="border-viz-compute/50 rounded border px-1.5 py-0.5 text-[9px]"
                  >
                    {w}: partial sums
                  </span>
                ))}
              </div>
              <table className="font-mono text-[11px]">
                <thead className="text-muted text-left">
                  <tr>
                    <th className="pr-4 font-normal">city</th>
                    <th className="font-normal">SUM(amount), ₹ lakh</th>
                  </tr>
                </thead>
                <tbody>
                  {CITIES.map(([c, v], i) => (
                    <motion.tr
                      key={c}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <td className="pr-4">{c}</td>
                      <td>{v}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const SECTIONS: StorySection[] = [
  {
    id: "question",
    kicker: "The big idea",
    title: "A librarian with a question",
    body: (
      <>
        <p>
          Ask a librarian how many history books were borrowed last Tuesday. They don&apos;t read
          every book. They check the catalogue, go to the right shelf, split the work with
          assistants, and each assistant tallies only what matters.
        </p>
        <p>
          A <Term id="engine">query engine</Term> does the same with your SQL. Here&apos;s one
          query, start to finish.
        </p>
      </>
    ),
  },
  {
    id: "catalog",
    kicker: "Step 1",
    title: "Ask the catalog",
    body: (
      <p>
        The engine parses the SQL, then asks the <Term id="catalog">catalog</Term> what{" "}
        <code>sales.orders</code> is: its columns, where its current metadata lives, and whether
        you&apos;re allowed to read it.
      </p>
    ),
  },
  {
    id: "plan",
    kicker: "Step 2",
    title: "Make a plan, then a better one",
    body: (
      <>
        <p>
          The SQL becomes a <Term id="query-plan">query plan</Term>: a tree of steps. The optimiser
          rewrites it. The date filter moves down into the scan (
          <Term id="predicate-pushdown">predicate pushdown</Term>), and only the 3 columns the query
          uses are kept.
        </p>
      </>
    ),
  },
  {
    id: "prune",
    kicker: "Step 3",
    title: "Skip files without opening them",
    body: (
      <p>
        The engine reads the table&apos;s metadata (Iceberg manifests, the Delta log, the Hudi
        timeline). It lists every data file with its partition values and{" "}
        <Term id="statistics">statistics</Term>, so files that can&apos;t match are never opened.
      </p>
    ),
  },
  {
    id: "split",
    kicker: "Step 4",
    title: "Share out the work",
    body: (
      <p>
        The remaining files are cut into pieces (splits) and handed to workers, which read them in
        parallel straight from object storage.
      </p>
    ),
  },
  {
    id: "scan",
    kicker: "Step 5",
    title: "Read as little as possible",
    body: (
      <p>
        Parquet lets each worker read only the needed columns, and skip row groups whose min/max
        stats rule them out. Most of the file is never downloaded.
      </p>
    ),
  },
  {
    id: "compute",
    kicker: "Step 6",
    title: "Crunch columns in batches",
    body: (
      <p>
        Modern engines are <Term id="vectorised">vectorised</Term>: instead of handling one row at a
        time, they process a batch of thousands of values from one column in a tight loop, which
        modern CPUs are very good at.
      </p>
    ),
  },
  {
    id: "combine",
    kicker: "Step 7",
    title: "Combine and answer",
    body: (
      <>
        <p>
          Each worker has partial sums per city. They&apos;re shuffled so each city&apos;s parts
          meet on one worker, added up, and sent back.
        </p>
        <p>
          Every design choice in this track (columnar files, statistics, metadata, clustering)
          exists to make steps 3 to 5 skip more.
        </p>
      </>
    ),
  },
];

export function LifeOfQuery() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => <Scene stage={i} />}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The life of a query
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            From SQL text to an answer: what an engine does in the second or two in between.
          </p>
        </div>
      }
    />
  );
}

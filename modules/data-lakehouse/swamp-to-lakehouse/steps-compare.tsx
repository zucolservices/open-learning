"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { cn } from "@/lib/cn";
import type { Architecture, SwampState } from "./state";

/* 4 ─ Compare the architectures ------------------------------------------ */

const AXES = [
  "Cheap, scalable storage",
  "Open formats, no lock-in",
  "Reliable updates (ACID)",
  "Fast BI and SQL",
  "ML and unstructured data",
  "One copy, fresh data",
  "Governance you can trust",
];

const SCORES: Record<Architecture, { verdict: string; cells: [number, string][] }> = {
  warehouse: {
    verdict: "Trusted and fast for BI, but closed, costly to scale and limited to tidy data.",
    cells: [
      [1, "Storage and compute bundled, priced for performance"],
      [0, "Data sits in a proprietary format"],
      [3, "Full transactions"],
      [3, "What it was built for"],
      [1, "Structured data only; ML has to export it"],
      [3, "One system, if the data fits"],
      [3, "Mature access control and schemas"],
    ],
  },
  lake: {
    verdict: "Cheap and open, and anything fits, but unreliable and hard to trust.",
    cells: [
      [3, "Cheap object storage or HDFS"],
      [3, "Open files any engine can read"],
      [0, "No transactions: half-written files leak out"],
      [1, "Scans raw files: slow and inconsistent"],
      [3, "Stores anything; ML reads it directly"],
      [2, "One store, but ad-hoc copies multiply"],
      [0, "No enforced schema or catalog by default"],
    ],
  },
  "two-tier": {
    verdict: "Each tier covers the other's gaps, at the price of two copies and two systems.",
    cells: [
      [2, "Cheap lake, plus the warehouse bill"],
      [1, "BI data locked in the warehouse copy"],
      [2, "Only inside the warehouse"],
      [3, "On the warehouse copy"],
      [3, "On the lake side"],
      [0, "Two copies; BI lags behind ETL"],
      [1, "Two systems to secure and keep in sync"],
    ],
  },
  lakehouse: {
    verdict:
      "Warehouse guarantees on one copy of open data. Not magic: some BI and governance features are still maturing.",
    cells: [
      [3, "Object storage"],
      [3, "Parquet plus open table formats"],
      [3, "Table formats add ACID transactions"],
      [2, "Good and improving; the best warehouses can still be faster"],
      [3, "The same files serve ML and AI"],
      [3, "One copy, many engines"],
      [2, "Catalogs are strong but still maturing across engines"],
    ],
  },
};

const barTone = ["bg-bad", "bg-viz-compute", "bg-viz-data", "bg-good"];

export function Compare() {
  const [s, set] = useSceneState<SwampState>();
  const current = SCORES[s.architecture];
  return (
    <StepLayout
      eyebrow="Compare"
      title="Every architecture is a set of trade-offs"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <Segmented
            size="sm"
            value={s.architecture}
            options={[
              ["warehouse", "Warehouse"],
              ["lake", "Data lake"],
              ["two-tier", "Lake + warehouse"],
              ["lakehouse", "Lakehouse"],
            ]}
            onChange={(architecture) => set({ architecture })}
          />
          <motion.p
            key={s.architecture}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
          >
            {current.verdict}
          </motion.p>
          <ul className="grid gap-3">
            {AXES.map((axis, i) => {
              const [score, note] = current.cells[i];
              return (
                <li
                  key={axis}
                  className="grid gap-1 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-center sm:gap-4"
                >
                  <span className="text-sm font-medium">{axis}</span>
                  <div>
                    <div className="bg-surface-2 h-2.5 overflow-hidden rounded-full">
                      <motion.div
                        className={cn("h-full rounded-full", barTone[score])}
                        animate={{ width: `${Math.max(score, 0.15) * 33.33}%` }}
                        transition={{ type: "spring", stiffness: 140, damping: 20 }}
                      />
                    </div>
                    <motion.p
                      key={`${s.architecture}-${i}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-muted mt-1 text-xs"
                    >
                      {note}
                    </motion.p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-subtle text-[11px]">
            Simplified ratings to show the trade-offs, not a benchmark.
          </p>
        </div>
      }
    >
      <p>Switch between the four architectures from the story.</p>
      <p>
        Notice that the lakehouse doesn&apos;t win by being best at everything. It wins by removing
        the <strong>second copy</strong> while keeping most of each tier&apos;s strengths.
      </p>
      <p>
        Warehouses haven&apos;t disappeared either. Many now read open table formats directly, which
        blurs the line.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Build the stack ---------------------------------------------------- */

export function StackOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Build the lakehouse from the ground up"
      stage={
        <div className="flex flex-1 items-center">
          <OrderCheckpoint
            id="stack-order"
            prompt="Order the layers from the bottom (1) to the top (5)."
            items={[
              { id: "storage", label: "Object storage (S3, GCS, ADLS)" },
              { id: "files", label: "Open file format (Parquet)" },
              { id: "tables", label: "Open table format (Delta, Iceberg, Hudi)" },
              { id: "catalog", label: "Catalog and governance" },
              { id: "engines", label: "Engines (Spark, Trino, DuckDB, warehouses…)" },
            ]}
            explanation="Bytes live in object storage. Parquet organises them into columnar files. A table format decides which files form a table and makes changes atomic. The catalog tells everyone where tables are and who may read them. Engines sit on top, and because everything below is open, many engines can share the same copy."
          />
        </div>
      }
    >
      <p>Each layer only works because of the one beneath it.</p>
    </StepLayout>
  );
}

/* 6 ─ Storage ≠ compute --------------------------------------------------- */

export function Separation() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why split storage from compute?"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="separation"
            prompt="Brewline keeps its tables in object storage and runs compute separately. What does that make possible?"
            options={[
              {
                id: "scale",
                label:
                  "Run month-end on a big cluster for an hour while dashboards use a small one, on the same data, without copying it",
                correct: true,
                feedback:
                  "Exactly. Compute scales and bills independently, and several engines can share one copy of the data.",
              },
              {
                id: "fast",
                label: "Queries become fast automatically, however the data is laid out",
                feedback:
                  "No. Layout still matters a lot: file sizes, partitioning and clustering have a whole chapter later in the track.",
              },
              {
                id: "nostore",
                label: "The data no longer needs to be stored anywhere permanently",
                feedback:
                  "The data lives permanently in object storage. It's the compute that comes and goes.",
              },
              {
                id: "one",
                label: "Only one engine can read the data, which keeps it consistent",
                feedback: "The opposite. Open storage lets many engines read the same data.",
              },
            ]}
          />
        </div>
      }
    />
  );
}

/* 7 ─ Takeaways ----------------------------------------------------------- */

const STACK: { label: string; detail: string; href: string; cls: string }[] = [
  {
    label: "Engines",
    detail: "Querying & serving (chapter 7)",
    href: "/tracks/data-lakehouse#querying",
    cls: "border-viz-compute bg-viz-compute/15",
  },
  {
    label: "Catalog & governance",
    detail: "Catalogs & governance (chapter 5)",
    href: "/tracks/data-lakehouse#catalogs-governance",
    cls: "border-accent bg-accent/15",
  },
  {
    label: "Open table format",
    detail: "Delta Lake is live now; Iceberg and Hudi next",
    href: "/tracks/data-lakehouse/delta-lake",
    cls: "border-viz-meta bg-viz-meta/15",
  },
  {
    label: "Open file format",
    detail: "Rows vs columns · Inside a Parquet file",
    href: "/tracks/data-lakehouse#foundations",
    cls: "border-viz-data bg-viz-data/15",
  },
  {
    label: "Object storage",
    detail: "Next module: Object storage, the ground floor",
    href: "/tracks/data-lakehouse/object-storage",
    cls: "border-viz-idle bg-viz-idle/15",
  },
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-6">
          <ol className="grid gap-2">
            {STACK.map((layer, i) => (
              <motion.li
                key={layer.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (STACK.length - i) * 0.1 }}
              >
                <Link
                  href={layer.href}
                  className={cn(
                    "group flex items-center justify-between gap-3 rounded-xl border px-4 py-3 transition hover:brightness-110",
                    layer.cls,
                  )}
                >
                  <span className="font-semibold">{layer.label}</span>
                  <span className="text-muted flex items-center gap-1 text-right text-xs">
                    {layer.detail}
                    <ArrowUpRight className="size-3.5 opacity-50 transition group-hover:opacity-100" />
                  </span>
                </Link>
              </motion.li>
            ))}
          </ol>
          <ul className="text-muted grid gap-2 text-sm">
            <li>
              <strong className="text-fg">Two workloads.</strong> OLTP runs the business; OLAP
              analyses it. They need different systems.
            </li>
            <li>
              <strong className="text-fg">Each era fixed the last one&apos;s problem.</strong>{" "}
              Warehouses were closed and costly; lakes were open but unreliable; two tiers meant two
              copies.
            </li>
            <li>
              <strong className="text-fg">A lakehouse is an architecture, not a product.</strong>{" "}
              It&apos;s open layers on one copy of data, and many vendors implement it.
            </li>
          </ul>
        </div>
      }
    >
      <p>
        That&apos;s the map for the whole track. Each layer on the right is a chapter. Click one to
        jump ahead.
      </p>
      <p>
        Next up is the ground floor, <strong>object storage</strong>, and the quirk that made table
        formats necessary.
      </p>
    </StepLayout>
  );
}

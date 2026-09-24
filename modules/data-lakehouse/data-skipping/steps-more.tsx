"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { SkippingState } from "./state";

/* 4 ─ Bloom filters ------------------------------------------------------------------------ */

/** Random IDs make every file's min/max span nearly the whole range. */
const ID_FILES = [
  { min: "0a91…", max: "fe12…", bloom: "no" },
  { min: "01c3…", max: "fb77…", bloom: "no" },
  { min: "0039…", max: "ff04…", bloom: "yes" }, // really contains it
  { min: "02e8…", max: "fd90…", bloom: "no" },
  { min: "0b16…", max: "fc2a…", bloom: "no" },
  { min: "0457…", max: "ffe1…", bloom: "false" }, // false positive
  { min: "0170…", max: "fa3c…", bloom: "no" },
  { min: "0d42…", max: "fe98…", bloom: "no" },
];

export function BloomFilters() {
  const [s, set] = useSceneState<SkippingState>();
  const bloom = s.bloomMode === "bloom";
  const readCount = bloom ? ID_FILES.filter((f) => f.bloom !== "no").length : ID_FILES.length;

  return (
    <StepLayout
      eyebrow="Beyond min/max"
      title="Finding a needle: bloom filters"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Code className="text-[10px]">
            {"SELECT * FROM orders WHERE order_id = 'c41e9a07-…'"}
          </Code>
          <Segmented
            size="sm"
            value={s.bloomMode}
            options={[
              ["minmax", "Min/max statistics only"],
              ["bloom", "Plus a bloom filter"],
            ]}
            onChange={(v) => set({ bloomMode: v as SkippingState["bloomMode"] })}
          />
          <div className="grid grid-cols-4 gap-2">
            {ID_FILES.map((f, i) => {
              const read = !bloom || f.bloom !== "no";
              return (
                <motion.div
                  key={i}
                  animate={{ opacity: read ? 1 : 0.4 }}
                  className={cn(
                    "rounded-lg border px-1.5 py-2 text-center font-mono text-[10px]",
                    read ? "border-viz-compute bg-viz-compute/20" : "border-line border-dashed",
                  )}
                >
                  <p className="font-semibold">file {i + 1}</p>
                  <p className="text-muted mt-1">
                    {f.min} – {f.max}
                  </p>
                  <AnimatePresence>
                    {bloom && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(
                          "mt-1 text-[9px]",
                          f.bloom === "yes"
                            ? "text-good"
                            : f.bloom === "false"
                              ? "text-viz-compute"
                              : "text-muted",
                        )}
                      >
                        {f.bloom === "no"
                          ? "definitely not"
                          : f.bloom === "yes"
                            ? "maybe → found"
                            : "maybe → not there"}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              bloom ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
            )}
          >
            {bloom
              ? `Read ${readCount} of 8 files. The filter says “definitely not” for six. File 6 was a false positive: “maybe”, but the ID wasn't there. It costs a wasted read, never a wrong answer.`
              : "Read 8 of 8 files. Random IDs are spread over every file, so every min/max range contains the ID we want. Statistics can't help."}
          </p>
        </div>
      }
    >
      <p>
        Min/max works for ranges and for clustered values. It fails for random, high-cardinality
        values such as UUIDs: every file&apos;s range covers almost everything.
      </p>
      <p>
        A <Term id="bloom-filter">bloom filter</Term> is a compact bit array per file (or row group)
        that answers one question: “is this exact value possibly here?” It can say “definitely not”
        or “maybe”, never a wrong “no”.
      </p>
      <p className="text-subtle text-xs">
        Size matters: at about 10 bits per distinct value, false positives are around 1%; at 5 bits,
        around 18%. Parquet has bloom filters built in (e.g.{" "}
        <code>parquet.bloom.filter.enabled#order_id=true</code>; Iceberg:{" "}
        <code>write.parquet.bloom-filter-enabled.column.order_id</code>). Databricks has deprecated
        its separate bloom filter indexes in favour of predictive I/O and liquid clustering.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Keeping the layout ------------------------------------------------------------------ */

type Fmt = SkippingState["maintain"];

const MAINTAIN: Record<Fmt, { label: string; code: string; notes: string[] }> = {
  delta: {
    label: "Delta Lake",
    code: "-- classic: rewrite with Z-order\nOPTIMIZE orders ZORDER BY (customer_id, order_date);\n\n-- newer: liquid clustering, incremental\nALTER TABLE orders CLUSTER BY (customer_id, order_date);\nOPTIMIZE orders;",
    notes: [
      "ZORDER BY (Delta 2.0+) isn't incremental: it re-clusters the data of a partition, and columns without statistics are rejected.",
      "Liquid clustering only rewrites data that needs clustering; in open-source Delta it uses a Hilbert curve for multiple keys. OPTIMIZE FULL re-clusters everything.",
      "Effectiveness drops with each extra column: pick the 2–4 most-filtered.",
    ],
  },
  iceberg: {
    label: "Iceberg",
    code: "ALTER TABLE orders WRITE ORDERED BY customer_id, order_date;\n\nCALL system.rewrite_data_files(\n  table => 'orders', strategy => 'sort',\n  sort_order => 'zorder(customer_id, order_date)');",
    notes: [
      "A table sort order makes writers sort data as they write it.",
      "rewrite_data_files re-clusters existing files with a linear sort or Z-order.",
      "Hilbert ordering has been merged into Iceberg's main branch but, as of September 2026, isn't in a release yet.",
    ],
  },
  hudi: {
    label: "Hudi",
    code: "hoodie.clustering.inline = true\nhoodie.clustering.plan.strategy.sort.columns = customer_id,order_date\nhoodie.layout.optimize.strategy = HILBERT   # default LINEAR",
    notes: [
      "Clustering is a table service: it rewrites small files into sorted, clustered ones.",
      "Layout strategies: LINEAR (default), ZORDER or HILBERT.",
      "Data skipping reads min/max from the metadata table's column stats (on by default for Spark).",
    ],
  },
};

export function KeepingLayout() {
  const [s, set] = useSceneState<SkippingState>();
  const m = MAINTAIN[s.maintain];
  return (
    <StepLayout
      eyebrow="In practice"
      title="Layouts decay, so maintain them"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-line bg-bg/40 rounded-2xl border p-4">
            <p className="text-muted mb-2 text-xs">What happens after clustering</p>
            <div className="flex items-end gap-1">
              {Array.from({ length: 14 }, (_, i) => {
                const fresh = i >= 9;
                return (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: fresh ? 40 + (i % 3) * 8 : 18 }}
                    transition={{ delay: 0.04 * i }}
                    className={cn("flex-1 rounded-t", fresh ? "bg-bad/40" : "bg-good/50")}
                    title={
                      fresh
                        ? "new, unclustered file: wide min/max"
                        : "clustered file: narrow min/max"
                    }
                  />
                );
              })}
            </div>
            <p className="text-subtle mt-2 text-[10px]">
              Bar height = how wide each file&apos;s min/max range is. Clustered files (green) are
              narrow; new appends (red) arrive unsorted and span everything, until the next
              clustering run.
            </p>
          </div>
          <Segmented
            size="sm"
            value={s.maintain}
            options={(Object.keys(MAINTAIN) as Fmt[]).map(
              (k) => [k, MAINTAIN[k].label] as [string, string],
            )}
            onChange={(v) => set({ maintain: v as Fmt })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.maintain}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <Code className="text-[10px] whitespace-pre-wrap">{m.code}</Code>
              <ul className="text-muted list-disc space-y-1 pl-4 text-xs">
                {m.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A layout is a snapshot of good order. New data arrives in whatever order it comes, so every
        append adds files with wide min/max ranges, and skipping slowly gets worse.
      </p>
      <p>
        Every format therefore has a way to re-cluster: a rewrite that sorts rows and replaces the
        files in one commit. Heavily written tables often run it every hour or two.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: pick the technique -------------------------------------------------------------- */

export function TechniqueSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Match the technique to the query"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="technique"
            prompt="Which layout technique best serves each query pattern?"
            categories={[
              { id: "sort", label: "Sort / partition by date" },
              { id: "multi", label: "Multi-column clustering" },
              { id: "bloom", label: "Bloom filter" },
            ]}
            items={[
              {
                id: "dash",
                label: "Dashboards show the last 7 days",
                category: "sort",
                why: "One column, ranges of it: a simple sort (or date partitions) is ideal.",
              },
              {
                id: "uuid",
                label: "Support staff look up one order by its random order_id",
                category: "bloom",
                why: "Exact matches on random, high-cardinality values: min/max can't help, a bloom filter can.",
              },
              {
                id: "cust-prod",
                label: "Analysts filter by customer, by product, or by both",
                category: "multi",
                why: "Several columns, used separately and together: Z-order, Hilbert or liquid clustering.",
              },
              {
                id: "device",
                label: "Find readings for one device_id among 10 million devices",
                category: "bloom",
                why: "Needle-in-a-haystack equality lookups are what bloom filters are for.",
              },
              {
                id: "store-date",
                label: "Reports filter by store and date range together",
                category: "multi",
                why: "Two filter columns at once: cluster on both.",
              },
              {
                id: "recent",
                label: "An events table where queries read recent hours",
                category: "sort",
                why: "Time-ordered access: time-ordered data. Appends often arrive roughly in order already.",
              },
            ]}
            explanation="Ranges on one column: sort. Several columns: multi-column clustering. Exact lookups on random values: bloom filters."
          />
        </div>
      }
    >
      <p>Sort each query pattern by the technique that helps it most.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap-up ---------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Every file has a label",
    "Min/max and counts per column, in the Delta log, Iceberg manifests or Hudi's metadata table.",
  ],
  [
    "Labels need order",
    "Skipping works only when each file covers a narrow range, so how rows are arranged matters as much as the stats.",
  ],
  [
    "One sort serves one column",
    "Z-order and Hilbert (and liquid clustering) balance several columns; Hilbert keeps neighbours together better.",
  ],
  [
    "Needles need bloom filters",
    "Exact lookups on random values skip files through “definitely not” answers.",
  ],
  [
    "Layouts decay",
    "New data arrives unsorted; re-cluster regularly, incrementally where the format allows.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to take away"
      stage={
        <div className="grid flex-1 content-center gap-2.5">
          {TAKEAWAYS.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-2xl border p-4"
            >
              <span className="bg-viz-meta/15 text-viz-meta grid size-7 shrink-0 place-items-center rounded-full font-mono text-xs font-semibold">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-muted text-sm">{body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The fastest data to read is data you never read. You can now reason about which files a
        query will skip, and how to arrange a table so it skips more.
      </p>
      <p>
        Next, <strong>Keeping tables healthy</strong>: compaction, clean-up and the other
        maintenance that keeps all of this working over time.
      </p>
    </StepLayout>
  );
}

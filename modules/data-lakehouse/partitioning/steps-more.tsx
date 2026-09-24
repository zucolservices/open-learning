"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { PartitioningState } from "./state";

/* 4 ─ Fix the problem: the five-million-file table ------------------------------------------ */

const SYMPTOMS: [string, string][] = [
  ["Partitioned by", "event_date / city / hour"],
  ["Partitions", "≈ 3.5 million"],
  ["Data files", "≈ 5 million, median 3 MB"],
  ["Query planning", "2–4 minutes before any data is read"],
];

export function SmallFilesFix() {
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The five-million-file table"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="border-bad/40 bg-bad/10 flex items-start gap-3 rounded-xl border px-4 py-3">
            <AlertTriangle className="text-bad mt-0.5 size-4 shrink-0" />
            <p className="text-sm">
              A streaming job writes app events every minute into a table partitioned by{" "}
              <code>event_date / city / hour</code>. It&apos;s been running for two years. Every
              dashboard on it is now painfully slow.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {SYMPTOMS.map(([k, v]) => (
              <div key={k} className="border-line bg-surface rounded-xl border px-3 py-2">
                <dt className="text-muted text-[10px]">{k}</dt>
                <dd className="font-mono text-sm font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <ChoiceCheckpoint
            id="small-files-fix"
            prompt="What's the best lasting fix?"
            options={[
              {
                id: "cluster",
                label: "Give the cluster more machines",
                feedback:
                  "Much of the planning for millions of files happens on the driver, and every file still has to be opened. More machines help little and cost more every day.",
              },
              {
                id: "compact",
                label: "Run compaction nightly and change nothing else",
                feedback:
                  "It helps today, but files can't span partitions: each city-hour partition holds only a few MB, so files stay tiny, and the stream keeps adding more.",
              },
              {
                id: "coarsen",
                label:
                  "Partition by event_date only, cluster or sort by city, and compact the existing data",
                correct: true,
                feedback:
                  "Right. Around 700 partitions of about a GB each lets files reach full size. Clustering by city still lets city filters skip files, without a folder per city per hour.",
              },
              {
                id: "finer",
                label: "Add event_id to the partition key to spread the load",
                feedback: "That makes every partition a single row: the worst possible layout.",
              },
            ]}
            explanation="Changing a partition key needs a rewrite in Hive-style tables and Delta; Iceberg can evolve the spec for new data and you rewrite old data when convenient. Delta's liquid clustering avoids the problem by not using folders at all."
          />
        </div>
      }
    >
      <p>
        A real-world pattern: partitions chosen for “flexibility” early on, a stream writing small
        batches, and two years later the table is buried in{" "}
        <Term id="small-files">small files</Term>.
      </p>
      <p>Pick the fix you&apos;d ship. Each wrong answer is something teams really try first.</p>
    </StepLayout>
  );
}

/* 5 ─ Rules of thumb ------------------------------------------------------------------------ */

const RULES: [string, string][] = [
  [
    "Partition on what queries filter by",
    "Usually a date. A partition only helps queries that filter on it, directly or through hidden partitioning or generated columns.",
  ],
  [
    "Keep cardinality low to moderate",
    "Dates, regions: yes. Customer IDs, raw timestamps: no. Delta's docs call partitioning by a 1-million-value column a bad strategy.",
  ],
  [
    "Aim for at least 1 GB per partition",
    "Smaller partitions mean smaller files, since a file can't span two partitions.",
  ],
  [
    "Small tables shouldn't be partitioned",
    "Databricks: under 1 TB, don't partition; 1–100 TB, use liquid clustering instead; 100 TB+, partitioning might help, but try clustering first.",
  ],
  [
    "Folders aren't a speed-up by themselves",
    "S3 scales request rates per key prefix automatically and gradually (at least 3,500 writes / 5,500 reads per second per prefix). More folders doesn't mean more throughput.",
  ],
  [
    "Engines have limits too",
    "Hive-format writes cap dynamic partitions at 1,000 per write by default (100 per node).",
  ],
];

export function RulesOfThumb() {
  return (
    <StepLayout
      eyebrow="Guidance"
      title="Rules of thumb"
      stage={
        <div className="grid flex-1 content-start gap-3 md:grid-cols-2">
          {RULES.map(([title, body], i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-2xl border p-4"
            >
              <p className="font-semibold">{title}</p>
              <p className="text-muted mt-1 text-xs leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        The simulator showed the trade-off. These are the rules practitioners and the vendors&apos;
        own docs distil from it.
      </p>
      <p>
        Notice how conservative the modern advice is: many tables are better off with no partitions
        at all, relying on file statistics and clustering instead.
      </p>
      <p className="text-subtle text-xs">
        Guidance as of September 2026; sizes are rules of thumb, not hard limits.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Beyond folders ------------------------------------------------------------------------ */

type Alt = "liquid" | "iceberg" | "hudi";

const ALTS: Record<Alt, { label: string; code: string; how: string; plus: string; minus: string }> =
  {
    liquid: {
      label: "Delta liquid clustering",
      code: "CREATE TABLE events (…) CLUSTER BY (event_date, city);\n-- change keys later, no rewrite of existing data:\nALTER TABLE events CLUSTER BY (city);",
      how: "No partition folders. Rows are grouped into files by up to 4 clustering keys, and OPTIMIZE keeps them clustered. File statistics do the skipping.",
      plus: "Keys can change without rewriting old data; handles skew and high-cardinality keys. On Databricks, CLUSTER BY AUTO picks keys for you.",
      minus:
        "Can't be combined with partitioning or Z-order. Available in open-source Delta from 3.1 (preview) and 3.2 onwards.",
    },
    iceberg: {
      label: "Iceberg hidden partitioning",
      code: "CREATE TABLE events (…) USING iceberg\nPARTITIONED BY (days(event_ts));\nALTER TABLE events WRITE ORDERED BY city;",
      how: "Partitions are derived from columns by transforms, so filters on event_ts prune automatically. A sort order clusters data within partitions.",
      plus: "The partition spec can evolve for new data without rewriting old data.",
      minus:
        "Still folder-style partitions underneath, so the same small-file maths applies to fine-grained specs.",
    },
    hudi: {
      label: "Hudi coarse partitions + clustering",
      code: "hoodie.datasource.write.partitionpath.field = event_date\nhoodie.clustering.inline = true\nhoodie.clustering.plan.strategy.sort.columns = city",
      how: "Hudi's own advice: keep top-level partitions coarse, like a date, and use clustering to sort data inside them.",
      plus: "Clustering also merges small files, and runs as a table service alongside writers.",
      minus: "Partition layout is fixed at creation; changing it means rewriting.",
    },
  };

export function BeyondFolders() {
  const [s, set] = useSceneState<PartitioningState>();
  const key = ((s.fix as Alt) in ALTS ? s.fix : "liquid") as Alt;
  const a = ALTS[key];
  return (
    <StepLayout
      eyebrow="Alternatives"
      title="Beyond folders"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={key}
            options={(Object.keys(ALTS) as Alt[]).map(
              (k) => [k, ALTS[k].label] as [string, string],
            )}
            onChange={(v) => set({ fix: v })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <Code className="text-[10px] whitespace-pre-wrap">{a.code}</Code>
              <p className="text-muted text-sm">{a.how}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-good/40 bg-good/10 rounded-xl border p-3 text-xs">
                  <p className="text-fg text-sm font-semibold">Strengths</p>
                  <p className="text-muted mt-1">{a.plus}</p>
                </div>
                <div className="border-line bg-surface rounded-xl border p-3 text-xs">
                  <p className="text-fg text-sm font-semibold">Watch out</p>
                  <p className="text-muted mt-1">{a.minus}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Folder-per-value partitioning is rigid: the key is hard to change, and fine keys shatter the
        table. Each format now offers a way around it.
      </p>
      <p>
        They share one idea: keep partitions coarse (or drop them), and arrange rows <em>inside</em>{" "}
        files so statistics can skip what a query doesn&apos;t need. The next module, on clustering
        and <Term id="data-skipping">data skipping</Term>, shows how that works.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint: good or poor key? ------------------------------------------------------------ */

export function KeySort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good partition key, or poor?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="partition-keys"
            prompt="For each table, is the proposed partition key a good choice?"
            categories={[
              { id: "good", label: "Good key" },
              { id: "poor", label: "Poor key" },
            ]}
            items={[
              {
                id: "date-big",
                label: "order_date on a 200 TB table, with most queries for recent days",
                category: "good",
                why: "Big partitions (hundreds of GB a day), and the most common filter.",
              },
              {
                id: "customer",
                label: "customer_id, with 2 million customers",
                category: "poor",
                why: "High cardinality: millions of tiny partitions and files.",
              },
              {
                id: "timestamp",
                label: "event_timestamp, precise to the millisecond",
                category: "poor",
                why: "Almost every value is unique. Partition by a day transform of it instead.",
              },
              {
                id: "small",
                label: "order_date on a 50 GB table",
                category: "poor",
                why: "About 50 MB a day: small partitions, small files. A table this size shouldn't be partitioned.",
              },
              {
                id: "region",
                label:
                  "region (5 even regions) on a 500 TB table, filtered by region in most queries",
                category: "good",
                why: "Low cardinality, even sizes, a common filter, and huge partitions.",
              },
              {
                id: "skew",
                label: "country, where 70% of rows are one country",
                category: "poor",
                why: "One giant partition and many small ones. Skew like this is a reason to prefer clustering.",
              },
            ]}
            explanation="Good keys are commonly filtered, low-to-moderate cardinality, reasonably even, and give partitions of at least a gigabyte."
          />
        </div>
      }
    >
      <p>Apply the rules of thumb to each table.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap-up ------------------------------------------------------------------------------------ */

const TAKEAWAYS: [string, string][] = [
  ["Partitioning is pruning", "Queries that filter on the partition column skip whole folders."],
  [
    "Finer isn't better",
    "Every partition splits files; too many partitions means small files and slow everything.",
  ],
  [
    "Choose the key by queries and size",
    "A common filter, low-to-moderate cardinality, at least ~1 GB per partition.",
  ],
  [
    "Many tables need no partitions",
    "Under ~1 TB, and often well beyond, clustering and statistics do the job.",
  ],
  [
    "Prefer layouts you can change",
    "Liquid clustering, Iceberg partition evolution and Hudi clustering avoid being locked in.",
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
              className={cn("border-line bg-surface flex gap-3 rounded-2xl border p-4")}
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
        You can now predict what a partition scheme will do to a table, spot a small-files problem,
        and pick a key, or decide not to partition at all.
      </p>
      <p>
        Next, <strong>File layout, clustering &amp; data skipping</strong>: how arranging rows
        inside files lets engines skip most of a table.
      </p>
    </StepLayout>
  );
}

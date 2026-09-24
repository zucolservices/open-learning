"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LayerStory, type LayerRow } from "../_platform/layer-story";
import { PlatformBuilder, type ServiceOption, type Slot } from "../_platform/builder";
import { CostEstimator, type CostInput } from "../_platform/cost";
import { INPUTS, estimate } from "./pricing";
import type { GcpState } from "./state";

/* 1 ─ The layers, Google Cloud edition ⭐ ---------------------------------------------------------- */

const ROWS: LayerRow[] = [
  {
    id: "storage",
    layer: "Object storage",
    services: "Cloud Storage",
    title: "Storage: Cloud Storage",
    body: (
      <p>
        Cloud Storage buckets hold the files, in classes from Standard to Archive (cheaper to keep,
        more expensive and slower to read).
      </p>
    ),
  },
  {
    id: "tables",
    layer: "Table format",
    services: "Iceberg: managed or open",
    title: "Tables: two kinds of Iceberg",
    body: (
      <p>
        Google offers <strong>Apache Iceberg managed tables</strong>, written and maintained by
        BigQuery, and <strong>Iceberg tables in the Lakehouse runtime catalog</strong>, written by
        Spark, Flink or Trino. You&apos;ll compare them in a moment.
      </p>
    ),
  },
  {
    id: "catalog",
    layer: "Catalog",
    services: "Lakehouse runtime catalog",
    title: "Catalog: the Lakehouse runtime catalog",
    body: (
      <p>
        Formerly the BigLake metastore: a serverless <Term id="catalog">catalog</Term> with an
        Iceberg REST endpoint that Spark, Flink, Trino and BigQuery all use. It can vend short-lived
        credentials to engines.
      </p>
    ),
  },
  {
    id: "govern",
    layer: "Discovery & governance",
    services: "Knowledge Catalog · BigQuery security",
    title: "Governance",
    body: (
      <p>
        Knowledge Catalog (formerly Dataplex Universal Catalog) handles search, lineage and data
        quality. Fine-grained rules live in BigQuery: row-level access policies, column security
        with policy tags, and dynamic masking.
      </p>
    ),
  },
  {
    id: "ingest",
    layer: "Ingestion",
    services: "Datastream · Pub/Sub",
    title: "Getting data in",
    body: (
      <p>
        Datastream captures database changes (MySQL, PostgreSQL, Oracle, SQL Server and more).
        Pub/Sub carries events, and its BigQuery and Cloud Storage subscriptions write them out
        without extra code.
      </p>
    ),
  },
  {
    id: "process",
    layer: "Processing",
    services: "Managed Spark · Dataflow",
    title: "Processing",
    body: (
      <p>
        Managed Service for Apache Spark (formerly Dataproc and Serverless for Apache Spark) runs
        Spark as clusters or serverless. Dataflow runs Apache Beam pipelines, batch or streaming.
      </p>
    ),
  },
  {
    id: "sql",
    layer: "SQL & BI",
    services: "BigQuery · Looker",
    title: "Querying and dashboards",
    body: (
      <p>
        BigQuery is serverless SQL: pay per TiB scanned, or reserve compute (slots) with Editions.
        Looker adds a governed semantic model; Data Studio (formerly Looker Studio) makes quick
        reports.
      </p>
    ),
  },
];

export function GcpLayers() {
  return (
    <LayerStory
      platform="Google Cloud"
      rows={ROWS}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The layers you know, Google Cloud edition
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Google renamed much of this in April 2026, so you&apos;ll see both names.
          </p>
        </div>
      }
      opening={{
        title: "A city that renamed its streets",
        body: (
          <>
            <p>
              Imagine a city that renamed half its streets last spring. The streets didn&apos;t
              move, but old maps and locals still use the old names.
            </p>
            <p>
              Google Cloud did that in 2026: BigLake became Lakehouse, Dataproc became Managed
              Service for Apache Spark, and more. The APIs and command-line tools still use the old
              names, so you need both.
            </p>
          </>
        ),
      }}
      closing={{
        title: "Around the edges",
        body: (
          <>
            <p>
              Orchestration: Managed Service for Apache Airflow (formerly Cloud Composer, now on
              Airflow 3) or Dataform for SQL workflows. Machine learning: BigQuery ML, and Gemini
              Enterprise Agent Platform (formerly Vertex AI).
            </p>
          </>
        ),
      }}
    />
  );
}

/* 2 ─ Assemble Brewline on Google Cloud ⭐ --------------------------------------------------------- */

const SLOTS: Slot[] = [
  {
    id: "ingest-db",
    layer: "Database changes",
    need: "Stream every change from the Postgres app database",
  },
  {
    id: "ingest-events",
    layer: "App events",
    need: "Carry app events and land them in BigQuery with no code",
  },
  { id: "storage", layer: "Files", need: "Where the Iceberg data and metadata files live" },
  {
    id: "catalog",
    layer: "Catalog",
    need: "An open Iceberg catalog shared by Spark, Trino and BigQuery",
  },
  {
    id: "transform",
    layer: "Transformations",
    need: "The team's existing Spark jobs: bronze → silver → gold",
  },
  {
    id: "govern",
    layer: "Access rules",
    need: "Analysts see only their region's rows, emails masked",
  },
  { id: "sql", layer: "SQL", need: "Analysts' SQL over everything" },
  { id: "bi", layer: "Dashboards", need: "Dashboards on metrics defined once, centrally" },
];

const OPTIONS: ServiceOption[] = [
  {
    id: "datastream",
    name: "Datastream",
    blurb: "change data capture from databases.",
    fits: ["ingest-db"],
  },
  {
    id: "pubsub",
    name: "Pub/Sub",
    blurb: "messaging, with BigQuery subscriptions.",
    fits: ["ingest-events"],
    whyNot: {
      "ingest-db":
        "Pub/Sub carries messages you publish; it doesn't read a database's change log. That's Datastream.",
    },
  },
  { id: "gcs", name: "Cloud Storage", blurb: "object storage for the files.", fits: ["storage"] },
  {
    id: "bigtable",
    name: "Bigtable",
    blurb: "a wide-column database.",
    fits: [],
    whyNot: {
      storage: "Bigtable serves fast key lookups for apps; lakehouse files live in Cloud Storage.",
    },
  },
  {
    id: "runtime-catalog",
    name: "Lakehouse runtime catalog",
    blurb: "serverless Iceberg REST catalog (formerly BigLake metastore).",
    fits: ["catalog"],
  },
  {
    id: "knowledge",
    name: "Knowledge Catalog",
    blurb: "discovery, lineage and data quality.",
    fits: [],
    whyNot: {
      catalog:
        "Knowledge Catalog helps people find and understand data; engines look up Iceberg tables in the Lakehouse runtime catalog.",
      govern:
        "It documents and profiles data; the row and masking rules themselves are set in BigQuery.",
    },
  },
  {
    id: "spark",
    name: "Managed Spark",
    blurb: "Managed Service for Apache Spark (formerly Dataproc).",
    fits: ["transform"],
  },
  {
    id: "dataflow",
    name: "Dataflow",
    blurb: "Apache Beam pipelines.",
    fits: [],
    whyNot: {
      transform: "Dataflow runs Apache Beam pipelines, not the team's existing Spark code.",
    },
  },
  {
    id: "bq-security",
    name: "BigQuery row & column security",
    blurb: "row-level policies, policy tags and masking.",
    fits: ["govern"],
  },
  { id: "bigquery", name: "BigQuery", blurb: "serverless SQL.", fits: ["sql"] },
  {
    id: "looker",
    name: "Looker",
    blurb: "BI with a governed semantic model (LookML).",
    fits: ["bi"],
  },
  {
    id: "datastudio",
    name: "Data Studio",
    blurb: "quick reports (formerly Looker Studio).",
    fits: [],
    whyNot: {
      bi: "Great for quick reports; for metrics defined once and shared, Looker's semantic model is the fit.",
    },
  },
];

export function AssembleGcp() {
  const [s, set] = useSceneState<GcpState>();
  return (
    <StepLayout
      eyebrow="Build it"
      title="Assemble Brewline on Google Cloud"
      stage={
        <PlatformBuilder
          slots={SLOTS}
          options={OPTIONS}
          value={s.picks}
          active={s.active}
          onSelectSlot={(id) => set({ active: id })}
          onPick={(slot, option) => {
            const picks = { ...s.picks, [slot]: option };
            const right = OPTIONS.find((o) => o.id === option)?.fits.includes(slot);
            const nextEmpty = SLOTS.find((x) => !picks[x.id]);
            set({ picks, active: right && nextEmpty ? nextEmpty.id : slot });
          }}
          doneText="A complete Google Cloud lakehouse: Datastream and Pub/Sub bring data in, Iceberg files sit in Cloud Storage behind the Lakehouse runtime catalog, Spark refines them, and BigQuery and Looker serve them with row and column rules."
        />
      }
    >
      <p>Brewline, again, now on Google Cloud. Pick the service for each job.</p>
      <p className="text-muted text-sm">
        Some names are new since April 2026; the explanations mention the old ones.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Two kinds of Iceberg ⭐ --------------------------------------------------------------------- */

const ACTIONS: {
  id: string;
  label: string;
  managed: [boolean | "preview", string];
  open: [boolean | "preview", string];
}[] = [
  {
    id: "spark-write",
    label: "Spark writes to the table",
    managed: [
      false,
      "Only BigQuery writes these. Spark must go through BigQuery's Storage Write API connector; files written directly are garbage-collected or can corrupt the table.",
    ],
    open: [true, "Spark, Flink and Trino write through the Iceberg REST catalog."],
  },
  {
    id: "bq-merge",
    label: "BigQuery runs a MERGE",
    managed: [true, "Full DML and streaming, like any BigQuery table."],
    open: ["preview", "BigQuery DML on these tables is in preview (since June 2026)."],
  },
  {
    id: "compact",
    label: "Who compacts and cleans up?",
    managed: [
      true,
      "BigQuery does it automatically: file sizing, clustering, compaction, garbage collection.",
    ],
    open: [
      "preview",
      "Whoever writes it, by default. Google-run automatic management is an opt-in preview.",
    ],
  },
  {
    id: "rows",
    label: "Row-level security",
    managed: [false, "Not supported on these tables; column-level security and masking are."],
    open: [false, "Access is controlled per table (IAM)."],
  },
  {
    id: "trino-read",
    label: "Trino reads it",
    managed: [true, "Other engines read an exported Iceberg snapshot of the table."],
    open: [true, "Straight through the Iceberg REST catalog."],
  },
];

export function TwoIcebergs() {
  const [s, set] = useSceneState<GcpState>();
  const a = ACTIONS.find((x) => x.id === s.action);
  const res = a ? (s.tableKind === "managed" ? a.managed : a.open) : null;
  return (
    <StepLayout
      eyebrow="Compare"
      title="Two kinds of Iceberg table"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.tableKind}
            options={[
              ["managed", "Apache Iceberg managed table"],
              ["open", "Iceberg table in the Lakehouse runtime catalog"],
            ]}
            onChange={(v) => set({ tableKind: v as GcpState["tableKind"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-3 text-sm">
            {s.tableKind === "managed" ? (
              <p>
                <strong>BigQuery owns it.</strong> Data and metadata sit in your Cloud Storage
                bucket as Iceberg, but BigQuery is the only writer and does all the upkeep.
              </p>
            ) : (
              <p>
                <strong>Open engines own it.</strong> Registered in the Lakehouse runtime catalog;
                Spark, Flink and Trino write it, and BigQuery reads it.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {ACTIONS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ action: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  s.action === x.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {res && (
              <motion.div
                key={s.tableKind + s.action}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  res[0] === true
                    ? "border-good/40 bg-good/10"
                    : res[0] === "preview"
                      ? "border-viz-compute/40 bg-viz-compute/10"
                      : "border-bad/40 bg-bad/10",
                )}
              >
                <p className="font-semibold">
                  {res[0] === true ? "Yes" : res[0] === "preview" ? "Preview" : "No"}
                </p>
                <p className="text-muted mt-1">{res[1]}</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="grid gap-1 text-xs">
            {ACTIONS.map((x) => {
              const r = s.tableKind === "managed" ? x.managed : x.open;
              return (
                <div key={x.id} className="border-line flex justify-between gap-2 border-b py-1">
                  <span className="text-muted">{x.label}</span>
                  <span
                    className={
                      r[0] === true
                        ? "text-good"
                        : r[0] === "preview"
                          ? "text-viz-compute"
                          : "text-bad"
                    }
                  >
                    {r[0] === true ? "yes" : r[0] === "preview" ? "preview" : "no"}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-subtle text-xs">
            Billing differs too: the files are billed as Cloud Storage (no BigQuery storage fee),
            with upkeep billed as compute. Status as of September 2026.
          </p>
        </div>
      }
    >
      <p>
        Both are real Apache Iceberg tables in your own bucket. The difference is{" "}
        <em>who is in charge</em>: BigQuery, or the open engines.
      </p>
      <p>
        Pick a table type, then try each action. The names are confusingly similar: the Lakehouse
        docs sometimes call the open ones &ldquo;managed&rdquo; too.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: which table? -------------------------------------------------------------------- */

export function TableCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which kind of table?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="gcp-table"
            prompt="Brewline's data engineers write tables with Spark and Flink; analysts query them in BigQuery. Which Iceberg tables fit?"
            options={[
              {
                id: "open",
                label: "Iceberg tables in the Lakehouse runtime catalog",
                correct: true,
                feedback:
                  "Right. The open engines write through the Iceberg REST catalog, and BigQuery reads the same tables.",
              },
              {
                id: "managed",
                label: "Apache Iceberg managed tables",
                feedback:
                  "Only BigQuery writes those: Spark and Flink would have to go through BigQuery's write API.",
              },
              {
                id: "native",
                label: "Standard BigQuery tables, exported nightly as Parquet",
                feedback: "That's a copy per night, and not an open table format at all.",
              },
              {
                id: "both",
                label: "Either: they're the same thing under different names",
                feedback:
                  "The names are confusingly similar, but who can write and who maintains them differ.",
              },
            ]}
            explanation="If BigQuery is the main writer and you want everything automatic, use managed tables. If open engines write, register the tables in the Lakehouse runtime catalog and plan who maintains them."
          />
        </div>
      }
    >
      <p>Use what you just compared.</p>
    </StepLayout>
  );
}

/* 5 ─ What will it cost? ⭐ ------------------------------------------------------------------------- */

const COST_INPUTS: CostInput[] = [
  { id: "storedTB", label: "Data stored", values: INPUTS.storedTB, format: (v) => `${v} TB` },
  {
    id: "scannedTiB",
    label: "BigQuery data scanned per month",
    values: INPUTS.scannedTiB,
    format: (v) => `${v.toLocaleString("en-US")} TiB`,
  },
  {
    id: "slots",
    label: "Editions: reserved slots (10 h/day)",
    values: INPUTS.slots,
    format: (v) => `${v} slots`,
  },
  {
    id: "cdcGiB",
    label: "Datastream changes per month",
    values: INPUTS.cdcGiB,
    format: (v) => `${v.toLocaleString("en-US")} GiB`,
  },
  {
    id: "pubsubTiB",
    label: "Pub/Sub events per month",
    values: INPUTS.pubsubTiB,
    format: (v) => `${v} TiB`,
  },
  {
    id: "dcu",
    label: "Serverless Spark per day",
    values: INPUTS.dcu,
    format: (v) => `${v} DCU-hours`,
  },
];

export function GcpCost() {
  const [s, set] = useSceneState<GcpState>();
  const lines = estimate(s.cost, s.editions);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="What will it cost?"
      stage={
        <CostEstimator
          inputs={COST_INPUTS}
          idx={s.cost}
          onChange={(id, i) => set({ cost: { ...s.cost, [id]: i } })}
          lines={lines}
          toggles={
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted text-xs">BigQuery compute</span>
              <Segmented
                size="sm"
                value={s.editions ? "editions" : "ondemand"}
                options={[
                  ["ondemand", "On-demand (per TiB)"],
                  ["editions", "Editions (per slot-hour)"],
                ]}
                onChange={(v) => set({ editions: v === "editions" })}
              />
            </div>
          }
          assumptions={
            <>
              <p>
                List prices from Google Cloud&apos;s pricing pages, September 2026: Cloud Storage
                Standard $0.020/GiB-month (us-central1); BigQuery on-demand $6.25/TiB with the first
                TiB free, or Standard edition $0.04/slot-hour (assumed 10 hours a day); Datastream
                CDC $2.00/GiB (first 2,500 GiB); Pub/Sub BigQuery subscriptions $50/TiB; serverless
                Spark $0.06/DCU-hour.
              </p>
              <p>
                Ignores operations, the runtime catalog&apos;s per-request charges (with free
                tiers), table-management compute, networking, Looker licences and discounts. An
                illustration, not a quote.
              </p>
            </>
          }
        />
      }
    >
      <p>
        BigQuery offers two ways to pay for queries: <strong>on-demand</strong>, per TiB scanned, or{" "}
        <strong>Editions</strong>, reserving compute (slots) by the hour.
      </p>
      <p className="text-muted text-sm">
        Push the scan volume up and compare the two. Heavy, steady use favours slots; occasional use
        favours on-demand. Either way, skipping data (the query-engines lesson) lowers the bill.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: old names ------------------------------------------------------------------------ */

export function NamesCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Reading an old blog post"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="gcp-names"
            prompt="A 2025 tutorial says: “Run the job on Dataproc Serverless and register the tables in the BigLake metastore.” What are these called in today's console?"
            options={[
              {
                id: "new",
                label:
                  "Managed Service for Apache Spark (serverless) and the Lakehouse runtime catalog",
                correct: true,
                feedback:
                  "Right. Same services, new names; the gcloud commands and APIs still say dataproc and biglake.",
              },
              {
                id: "dataflow",
                label: "Dataflow and Knowledge Catalog",
                feedback:
                  "Dataflow runs Beam, and Knowledge Catalog (formerly Dataplex) is for discovery and governance.",
              },
              {
                id: "gone",
                label: "They were shut down; the tutorial no longer applies",
                feedback: "They were renamed, not removed.",
              },
              {
                id: "vertex",
                label: "Gemini Enterprise Agent Platform and BigQuery",
                feedback: "That's the new name for Vertex AI, Google's ML platform.",
              },
            ]}
            explanation="Cloud product names change often. Look for the service's docs page: it usually says 'formerly…' near the top."
          />
        </div>
      }
    >
      <p>A skill you&apos;ll use all the time.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Cloud Storage underneath",
    "Iceberg data and metadata live in your buckets, billed at Cloud Storage prices.",
  ],
  [
    "Two kinds of Iceberg",
    "Managed tables: BigQuery writes and maintains. Runtime-catalog tables: open engines write, and someone maintains.",
  ],
  [
    "One open catalog",
    "The Lakehouse runtime catalog (formerly BigLake metastore) speaks Iceberg REST to Spark, Flink, Trino and BigQuery.",
  ],
  ["Two ways to pay for BigQuery", "Per TiB scanned, or reserved slots by the hour."],
  [
    "Expect old names",
    "BigLake, Dataproc, Dataplex, Composer and Vertex AI all have new names; APIs keep the old ones.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Same architecture, Google&apos;s names and pricing.</p>
      <p>Next: Azure and Microsoft Fabric.</p>
    </StepLayout>
  );
}

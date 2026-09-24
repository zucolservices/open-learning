"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { LayerStory, type LayerRow } from "../_platform/layer-story";
import { PlatformBuilder, type ServiceOption, type Slot } from "@/toolkit/builders/slot-builder";
import { CostEstimator, type CostInput } from "../_platform/cost";
import { INPUTS, estimate } from "./pricing";
import type { AwsState } from "./state";

/* 1 ─ The layers, AWS edition ⭐ ------------------------------------------------------------------- */

const ROWS: LayerRow[] = [
  {
    id: "storage",
    layer: "Object storage + table format",
    services: "S3 · S3 Tables",
    title: "Storage: S3, and S3 Tables",
    body: (
      <>
        <p>
          Amazon S3 is the <Term id="object-storage">object storage</Term> everything sits on. You
          can keep Iceberg tables in ordinary (general purpose) buckets and maintain them yourself.
        </p>
        <p>
          Or use <strong>S3 Tables</strong>: table buckets that hold managed Iceberg tables, with
          compaction, snapshot expiry and orphan-file cleanup switched on for you.
        </p>
      </>
    ),
  },
  {
    id: "catalog",
    layer: "Catalog",
    services: "AWS Glue Data Catalog",
    title: "Catalog: one for everything",
    body: (
      <p>
        The Glue Data Catalog is AWS&apos;s <Term id="catalog">catalog</Term>. It speaks the older
        Hive style and the Iceberg REST protocol, and S3 Tables appear inside it, so Athena, EMR,
        Redshift and Glue all see the same tables.
      </p>
    ),
  },
  {
    id: "govern",
    layer: "Fine-grained access",
    services: "AWS Lake Formation",
    title: "Governance: Lake Formation",
    body: (
      <p>
        IAM grants access to buckets and whole tables. Lake Formation adds row, column and cell
        rules, tag-based grants (LF-Tags), and hands short-lived credentials to engines. For S3
        Tables, IAM is the default and Lake Formation is opt-in.
      </p>
    ),
  },
  {
    id: "ingest",
    layer: "Ingestion (CDC and streams)",
    services: "DMS · Data Firehose · MSK",
    title: "Getting data in",
    body: (
      <p>
        AWS DMS captures changes from databases. Amazon Data Firehose (formerly Kinesis Data
        Firehose) delivers streams straight into Iceberg tables, S3 Tables included. Amazon MSK is
        managed Kafka.
      </p>
    ),
  },
  {
    id: "process",
    layer: "Batch & streaming processing",
    services: "Glue ETL · EMR",
    title: "Processing: Glue and EMR",
    body: (
      <p>
        AWS Glue runs serverless Spark jobs, billed per DPU-hour. Amazon EMR runs open-source
        engines: EMR Serverless for Spark and Hive, EMR on EC2 or EKS when you also need Trino or
        Flink.
      </p>
    ),
  },
  {
    id: "sql",
    layer: "SQL, warehouse & BI",
    services: "Athena · Redshift · Quick Sight",
    title: "Querying and dashboards",
    body: (
      <p>
        Athena is serverless SQL, paid per TB scanned. Redshift is AWS&apos;s warehouse; it reads
        Iceberg and, since late 2025, writes it too. Dashboards live in Amazon Quick Sight (formerly
        QuickSight, now part of Amazon Quick).
      </p>
    ),
  },
];

export function AwsLayers() {
  return (
    <LayerStory
      platform="AWS"
      rows={ROWS}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The layers you know, AWS edition
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Every part of this track has an AWS service with its own name.
          </p>
        </div>
      }
      opening={{
        title: "New names for familiar parts",
        body: (
          <>
            <p>
              Moving to a new city, you already know what a bank, a pharmacy and a bus stop are. You
              only need to learn what they&apos;re called here and where they are.
            </p>
            <p>
              Clouds are the same. Storage, table formats, catalogs, engines: you know them all.
              Here&apos;s what AWS calls each one.
            </p>
          </>
        ),
      }}
      closing={{
        title: "Wrapped into one workspace",
        body: (
          <>
            <p>
              AWS bundles these into the next generation of Amazon SageMaker: the &ldquo;lakehouse
              architecture of Amazon SageMaker&rdquo; and SageMaker Unified Studio (built on Amazon
              DataZone), with SageMaker AI for machine learning.
            </p>
            <p>
              Orchestration comes from Amazon MWAA (managed Airflow, now on Airflow 3) or AWS Step
              Functions.
            </p>
          </>
        ),
      }}
    />
  );
}

/* 2 ─ Assemble Brewline on AWS ⭐ ------------------------------------------------------------------ */

const SLOTS: Slot[] = [
  {
    id: "ingest-db",
    layer: "Database changes",
    need: "Stream every change from the Postgres app database",
  },
  {
    id: "ingest-events",
    layer: "App events",
    need: "Deliver click events straight into Iceberg tables",
  },
  { id: "storage", layer: "Table storage", need: "Iceberg tables, maintained automatically" },
  { id: "catalog", layer: "Catalog", need: "One place every engine finds the tables" },
  {
    id: "govern",
    layer: "Access control",
    need: "Analysts see only their region's rows, no phone numbers",
  },
  { id: "transform", layer: "Transformations", need: "Nightly Spark jobs: bronze → silver → gold" },
  { id: "sql", layer: "Ad-hoc SQL", need: "Analysts' occasional queries, paid only when used" },
  { id: "bi", layer: "Dashboards", need: "Managers' daily dashboards" },
];

const OPTIONS: ServiceOption[] = [
  { id: "dms", name: "AWS DMS", blurb: "change data capture from databases.", fits: ["ingest-db"] },
  {
    id: "firehose",
    name: "Data Firehose",
    blurb: "delivers streams into Iceberg tables, exactly once.",
    fits: ["ingest-events"],
    whyNot: {
      "ingest-db":
        "Firehose delivers streams you send it; it doesn't read a database's change log. That's DMS.",
    },
  },
  {
    id: "msk",
    name: "Amazon MSK",
    blurb: "managed Kafka.",
    fits: [],
    whyNot: {
      "ingest-events":
        "MSK holds the stream, but something (Firehose, Flink, Kafka Connect) still has to write it into tables.",
      "ingest-db":
        "Kafka holds change events, but it doesn't capture them from Postgres by itself.",
    },
  },
  {
    id: "s3",
    name: "S3 (general purpose)",
    blurb: "plain object storage.",
    fits: [],
    whyNot: {
      storage:
        "It works for Iceberg, but you'd run compaction and clean-up yourself. The need asks for automatic maintenance.",
    },
  },
  {
    id: "s3tables",
    name: "S3 Tables",
    blurb: "managed Iceberg tables with automatic maintenance.",
    fits: ["storage"],
  },
  {
    id: "glue-catalog",
    name: "Glue Data Catalog",
    blurb: "AWS's catalog, with an Iceberg REST endpoint.",
    fits: ["catalog"],
  },
  {
    id: "lf",
    name: "Lake Formation",
    blurb: "row, column and cell-level permissions.",
    fits: ["govern"],
  },
  {
    id: "iam",
    name: "IAM only",
    blurb: "account-wide access policies.",
    fits: [],
    whyNot: {
      govern: "IAM controls buckets, prefixes and whole tables, not individual rows or columns.",
    },
  },
  { id: "glue-etl", name: "Glue ETL", blurb: "serverless Spark jobs.", fits: ["transform"] },
  { id: "emr", name: "EMR Serverless", blurb: "serverless Spark and Hive.", fits: ["transform"] },
  {
    id: "athena",
    name: "Athena",
    blurb: "serverless SQL, $5 per TB scanned.",
    fits: ["sql"],
  },
  {
    id: "redshift",
    name: "Redshift Serverless",
    blurb: "AWS's warehouse.",
    fits: [],
    whyNot: {
      sql: "It works, but it bills compute time (RPU-hours) whenever it runs. For occasional queries, Athena's pay-per-scan fits better.",
      bi: "Redshift can power dashboards, but it isn't a dashboard tool.",
    },
  },
  {
    id: "quick",
    name: "Quick Sight",
    blurb: "AWS's BI dashboards (part of Amazon Quick).",
    fits: ["bi"],
  },
  {
    id: "dynamodb",
    name: "DynamoDB",
    blurb: "a key-value database.",
    fits: [],
    whyNot: {
      storage: "DynamoDB serves fast single-item lookups for apps, not analytical tables.",
    },
  },
];

export function AssembleAws() {
  const [s, set] = useSceneState<AwsState>();
  return (
    <StepLayout
      eyebrow="Build it"
      title="Assemble Brewline on AWS"
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
          doneText="A complete AWS lakehouse: DMS and Firehose feed S3 Tables, Glue catalogs them, Lake Formation guards them, Glue or EMR transforms them, and Athena and Quick Sight put them to use."
        />
      }
    >
      <p>
        Brewline wants its lakehouse on AWS. Each row is a job to be done; pick the service that
        does it. Wrong picks explain themselves.
      </p>
      <p className="text-muted text-sm">
        Some jobs have more than one good answer. For the nightly Spark jobs, Glue and EMR
        Serverless both work: Glue is simpler, EMR gives more control.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: one catalog ----------------------------------------------------------------------- */

export function CatalogCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Many engines, one set of tables"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="aws-catalog"
            prompt="Spark on EMR writes Iceberg tables in S3 Tables. Athena and Redshift must read them, and analysts may only see rows for their own region. What ties this together?"
            options={[
              {
                id: "glue-lf",
                label: "The Glue Data Catalog for the tables, with Lake Formation row filters",
                correct: true,
                feedback:
                  "Right. Every engine finds the tables through Glue, and Lake Formation applies the row rules for each of them.",
              },
              {
                id: "copy",
                label: "Copy the tables into Redshift and give Athena its own copy",
                feedback:
                  "Then you'd have three copies to keep in sync, which open tables exist to avoid.",
              },
              {
                id: "iam",
                label: "An IAM policy per region on the S3 prefixes",
                feedback:
                  "IAM can't filter rows inside a table: every region's rows share the same files.",
              },
              {
                id: "hive",
                label: "A separate Hive metastore on EC2",
                feedback:
                  "Possible, but you'd run it yourself, and S3 Tables already appear in the Glue Data Catalog.",
              },
            ]}
            explanation="On AWS, the Glue Data Catalog is the shared catalog and Lake Formation the shared permissions layer. That's the catalog-and-governance lesson from chapter 5, with AWS names."
          />
        </div>
      }
    >
      <p>Remember the catalogs module? Same question, AWS names.</p>
    </StepLayout>
  );
}

/* 4 ─ What will it cost? ⭐ ------------------------------------------------------------------------- */

const fmtGB = (v: number) => (v >= 1000 ? `${v / 1000} TB` : `${v} GB`);

const COST_INPUTS: CostInput[] = [
  { id: "storedGB", label: "Data stored", values: INPUTS.storedGB, format: fmtGB },
  {
    id: "eventsGB",
    label: "New events per day",
    values: INPUTS.eventsGB,
    format: (v) => `${fmtGB(v)}/day`,
  },
  {
    id: "queries",
    label: "Athena queries per day",
    values: INPUTS.queries,
    format: (v) => v.toLocaleString("en-US"),
  },
  { id: "scanGB", label: "Data scanned per query", values: INPUTS.scanGB, format: fmtGB },
  { id: "etl", label: "Glue ETL per day", values: INPUTS.etl, format: (v) => `${v} DPU-hours` },
];

export function AwsCost() {
  const [s, set] = useSceneState<AwsState>();
  const { lines } = estimate(s.cost, s.s3tables);
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
              <span className="text-muted text-xs">Tables live in</span>
              <Segmented
                size="sm"
                value={s.s3tables ? "tables" : "gp"}
                options={[
                  ["tables", "S3 Tables (managed)"],
                  ["gp", "S3 buckets (you maintain)"],
                ]}
                onChange={(v) => set({ s3tables: v === "tables" })}
              />
            </div>
          }
          assumptions={
            <>
              <p>
                US East (N. Virginia) on-demand list prices, September 2026: S3 $0.023/GB-month; S3
                Tables $0.0265/GB-month + $0.025 per 1,000 objects monitored + compaction; Data
                Firehose into Iceberg $0.075/GB; one dms.t3.medium at $0.0745/hour; Glue 6
                $0.308/DPU-hour; Athena $5/TB (10 MB minimum per query, ignored here).
              </p>
              <p>
                About 5 objects per GB stored. Ignores requests, data transfer, the Glue Data
                Catalog (free for the first million objects and requests), Quick Sight licences,
                discounts and free tiers. An illustration, not a quote.
              </p>
            </>
          }
        />
      }
    >
      <p>
        Cloud bills follow usage. Move the sliders and watch which line grows. Then push queries and
        scan size up together.
      </p>
      <p className="text-muted text-sm">
        Compare the two storage options too: S3 Tables costs a little more per GB, and in return you
        don&apos;t run and pay for compaction jobs yourself.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: the bill -------------------------------------------------------------------------- */

export function BillCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The surprising bill"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="aws-bill"
            prompt="Brewline's Athena line is $37,000 a month: 5,000 dashboard queries a day, each scanning 50 GB. What helps most?"
            options={[
              {
                id: "skip",
                label:
                  "Make each query read less: partition or cluster on the filter columns, select fewer columns, pre-aggregate in gold",
                correct: true,
                feedback:
                  "Right. Athena bills bytes scanned, so cutting 50 GB to 0.5 GB per query cuts that line by 99%.",
              },
              {
                id: "tables",
                label: "Move the tables from S3 Tables to general-purpose buckets",
                feedback: "That changes storage by a few percent. The bill is in scanning.",
              },
              {
                id: "glue",
                label: "Give the Glue jobs more DPUs",
                feedback: "Glue runs the nightly jobs; it doesn't affect how much Athena scans.",
              },
              {
                id: "region",
                label: "Move to a cheaper region",
                feedback: "Prices differ a little by region; the scan volume is the real problem.",
              },
            ]}
            explanation="The query-engines lesson has a price tag on pay-per-scan services: every byte skipped is money saved."
          />
        </div>
      }
    >
      <p>Use the estimator if you like: set queries and scan size to their maximum.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "S3 or S3 Tables",
    "Plain buckets and your own maintenance, or managed Iceberg tables that maintain themselves.",
  ],
  [
    "Glue Data Catalog is the hub",
    "Hive and Iceberg REST; S3 Tables show up in it; every AWS engine reads it.",
  ],
  [
    "Lake Formation for fine-grained access",
    "Rows, columns, cells and tags, applied across engines.",
  ],
  [
    "Pick engines by pattern",
    "Glue or EMR for pipelines, Athena for pay-per-query SQL, Redshift for a busy warehouse.",
  ],
  [
    "Names change",
    "Data Firehose was Kinesis Data Firehose; Quick Sight was QuickSight. Old blog posts use old names.",
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
      <p>The architecture is the same one you&apos;ve learned all along; only the names changed.</p>
      <p>Next: the same exercise on Google Cloud.</p>
    </StepLayout>
  );
}

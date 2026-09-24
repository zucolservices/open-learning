"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Copy, Link2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LayerStory, type LayerRow } from "../_platform/layer-story";
import { PlatformBuilder, type ServiceOption, type Slot } from "../_platform/builder";
import { CostEstimator, fmtUsd, type CostInput } from "../_platform/cost";
import { INPUTS, PRICE, estimate } from "./pricing";
import type { AzureState } from "./state";

/* 1 ─ The layers, Azure edition ⭐ ----------------------------------------------------------------- */

const ROWS: LayerRow[] = [
  {
    id: "storage",
    layer: "Object storage",
    services: "ADLS Gen2 · OneLake",
    title: "Storage: ADLS Gen2 and OneLake",
    body: (
      <>
        <p>
          Azure Data Lake Storage Gen2 isn&apos;t a separate service: it&apos;s Blob Storage with
          the &ldquo;hierarchical namespace&rdquo; switched on, giving real folders.
        </p>
        <p>
          Microsoft Fabric adds <strong>OneLake</strong>: exactly one lake per organisation, built
          on ADLS, where every Fabric table lands as Delta (readable as Iceberg too).
        </p>
      </>
    ),
  },
  {
    id: "catalog",
    layer: "Catalog & governance",
    services: "Unity Catalog · OneLake security · Purview",
    title: "Catalogs and permissions",
    body: (
      <p>
        Azure Databricks uses Unity Catalog. Fabric has the OneLake catalog and OneLake security
        roles (folder, table, row and column rules). Microsoft Purview catalogs, classifies and
        labels data across the whole estate.
      </p>
    ),
  },
  {
    id: "ingest",
    layer: "Ingestion",
    services: "Event Hubs · Data Factory · Mirroring",
    title: "Getting data in",
    body: (
      <p>
        Event Hubs takes streams, and speaks Kafka so Kafka clients connect without code changes.
        Data Factory pipelines and Copy jobs move data in bulk, incrementally or by CDC. Fabric
        mirroring keeps a database replicated into OneLake.
      </p>
    ),
  },
  {
    id: "process",
    layer: "Processing",
    services: "Azure Databricks · Fabric Spark",
    title: "Processing",
    body: (
      <p>
        Azure Databricks is Databricks run as an Azure service, billed in DBUs. Fabric has its own
        Spark in notebooks and pipelines, billed from its shared capacity.
      </p>
    ),
  },
  {
    id: "sql",
    layer: "SQL, warehouse & BI",
    services: "Fabric Warehouse · Databricks SQL · Power BI",
    title: "SQL and dashboards",
    body: (
      <p>
        Every Fabric lakehouse gets a read-only SQL endpoint; the Fabric Warehouse adds full T-SQL
        writes. Databricks SQL is Databricks&apos; warehouse. Power BI&apos;s Direct Lake mode reads
        Delta tables in OneLake without importing a copy.
      </p>
    ),
  },
];

export function AzureLayers() {
  return (
    <LayerStory
      platform="Azure"
      rows={ROWS}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            The layers you know, Azure edition
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Azure offers two main routes: Azure Databricks, and Microsoft Fabric. Many companies use
            both.
          </p>
        </div>
      }
      opening={{
        title: "Same parts, two storefronts",
        body: (
          <>
            <p>
              Like a city with two big shopping centres, Azure has two main places to build a
              lakehouse: Azure Databricks and Microsoft Fabric. Both sell the same basic goods:
              storage, tables, engines, dashboards.
            </p>
            <p>Here&apos;s where each part you know lives on Azure.</p>
          </>
        ),
      }}
      closing={{
        title: "And the older services?",
        body: (
          <>
            <p>
              Azure Synapse Analytics still runs, but new work is steered to Fabric, with migration
              guides and tools. HDInsight on AKS was retired in January 2025.
            </p>
            <p>
              Orchestration: Data Factory pipelines, Fabric&apos;s Apache Airflow jobs, or
              Databricks Lakeflow Jobs.
            </p>
          </>
        ),
      }}
    />
  );
}

/* 2 ─ Assemble Brewline on Azure ⭐ ---------------------------------------------------------------- */

const SLOTS: Slot[] = [
  {
    id: "ingest-db",
    layer: "App database",
    need: "Keep the Azure SQL app database replicated in the lake",
  },
  {
    id: "ingest-events",
    layer: "App events",
    need: "Receive events from existing Kafka clients, no code changes",
  },
  { id: "storage", layer: "The lake", need: "One lake for the whole company" },
  {
    id: "existing",
    layer: "Partner data",
    need: "Use 40 TB of Delta tables that live in Amazon S3, without copying them",
  },
  { id: "transform", layer: "Transformations", need: "Spark pipelines: bronze → silver → gold" },
  { id: "govern", layer: "Access rules", need: "Row and column rules on Fabric lake tables" },
  {
    id: "bi",
    layer: "Dashboards",
    need: "Power BI straight on Delta tables, without an import copy",
  },
];

const OPTIONS: ServiceOption[] = [
  {
    id: "mirroring",
    name: "Fabric mirroring",
    blurb: "keeps the database replicated into OneLake.",
    fits: ["ingest-db"],
  },
  {
    id: "eventhubs",
    name: "Event Hubs",
    blurb: "streaming ingestion with a Kafka-compatible endpoint.",
    fits: ["ingest-events"],
    whyNot: {
      "ingest-db":
        "Event Hubs receives streams you send it; it doesn't replicate a database by itself.",
    },
  },
  {
    id: "adf",
    name: "Data Factory pipeline",
    blurb: "moves and orchestrates data.",
    fits: [],
    whyNot: {
      "ingest-db":
        "A pipeline or Copy job could do it, but mirroring keeps the replica continuously in sync with no pipeline to maintain.",
      existing: "A pipeline would copy the 40 TB: the opposite of what's asked.",
    },
  },
  {
    id: "onelake",
    name: "OneLake",
    blurb: "Fabric's single lake per organisation.",
    fits: ["storage"],
  },
  {
    id: "blob-archive",
    name: "Blob archive tier",
    blurb: "cheapest storage, offline.",
    fits: [],
    whyNot: { storage: "Archive blobs must be rehydrated (taking hours) before they can be read." },
  },
  {
    id: "shortcut",
    name: "OneLake shortcut",
    blurb: "a pointer to data where it lives, no copy.",
    fits: ["existing"],
  },
  {
    id: "databricks",
    name: "Azure Databricks",
    blurb: "Databricks Spark, SQL and ML on Azure.",
    fits: ["transform"],
  },
  {
    id: "fabric-spark",
    name: "Fabric Spark",
    blurb: "Spark notebooks and jobs inside Fabric.",
    fits: ["transform"],
  },
  {
    id: "hdinsight-aks",
    name: "HDInsight on AKS",
    blurb: "retired.",
    fits: [],
    whyNot: { transform: "HDInsight on AKS was retired in January 2025." },
  },
  {
    id: "onelake-security",
    name: "OneLake security",
    blurb: "roles with folder, table, row and column rules.",
    fits: ["govern"],
  },
  {
    id: "purview",
    name: "Microsoft Purview",
    blurb: "estate-wide catalog, classification and labels.",
    fits: [],
    whyNot: {
      govern:
        "Purview catalogs, classifies and labels across the estate; row and column rules on Fabric tables come from OneLake security.",
    },
  },
  {
    id: "directlake",
    name: "Power BI Direct Lake",
    blurb: "loads Delta from OneLake into memory, no import.",
    fits: ["bi"],
  },
  {
    id: "import",
    name: "Power BI import",
    blurb: "copies data into the model.",
    fits: [],
    whyNot: { bi: "Import mode is a copy that must be refreshed. The need says no import copy." },
  },
];

export function AssembleAzure() {
  const [s, set] = useSceneState<AzureState>();
  return (
    <StepLayout
      eyebrow="Build it"
      title="Assemble Brewline on Azure"
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
          doneText="A complete Azure lakehouse: mirroring and Event Hubs bring data into OneLake, a shortcut reaches the S3 tables in place, Spark refines them, OneLake security guards them, and Power BI reads them directly."
        />
      }
    >
      <p>
        Brewline&apos;s Azure team wants Fabric at the centre. Pick the service for each job; wrong
        picks explain themselves.
      </p>
      <p className="text-muted text-sm">
        For the Spark pipelines, Azure Databricks and Fabric Spark both work. Many companies do
        engineering in Databricks and BI in Fabric, on the same tables.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Shortcuts vs copies ⭐ ---------------------------------------------------------------------- */

const TB = 40;

export function Shortcuts() {
  const [s, set] = useSceneState<AzureState>();
  const extraStorage = s.shortcut ? 0 : TB * 1000 * PRICE.oneLakeHotPerGB;
  const rows: [string, string, "good" | "bad" | "neutral"][] = s.shortcut
    ? [
        ["Copies of the data", "1 (it stays in S3)", "good"],
        ["Extra OneLake storage", "$0", "good"],
        ["Freshness", "Live: readers see S3 as it is now", "good"],
        ["A row deleted in S3", "Gone for Fabric readers immediately", "good"],
        [
          "Who pays for reads",
          s.cache
            ? "AWS charges egress on first reads; the shortcut cache serves repeats from Azure"
            : "AWS charges egress every time data crosses clouds",
          s.cache ? "neutral" : "bad",
        ],
      ]
    : [
        ["Copies of the data", "2 (S3 and OneLake)", "bad"],
        ["Extra OneLake storage", `${TB} TB × $0.026 = ${fmtUsd(extraStorage)}/month`, "bad"],
        ["Freshness", "Up to a day old (nightly copy)", "bad"],
        ["A row deleted in S3", "Still in the copy until the next sync", "bad"],
        ["Who pays for reads", "AWS egress for each night's changes, plus the pipeline", "neutral"],
      ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Shortcuts: data without copies"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.shortcut ? "shortcut" : "copy"}
            options={[
              ["copy", "Copy it nightly with a pipeline"],
              ["shortcut", "Create a OneLake shortcut"],
            ]}
            onChange={(v) => set({ shortcut: v === "shortcut" })}
          />
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="border-line bg-surface rounded-xl border p-3 text-center">
              <p className="text-muted text-[10px]">Amazon S3</p>
              <p className="text-sm font-semibold">partner_sales (Delta)</p>
              <div className="mt-2 flex justify-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className="bg-viz-data h-6 w-4 rounded-sm" />
                ))}
              </div>
              <p className="text-subtle mt-1 text-[10px]">{TB} TB</p>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={String(s.shortcut)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-1"
              >
                {s.shortcut ? (
                  <Link2 className="text-accent size-6" />
                ) : (
                  <Copy className="text-bad size-6" />
                )}
                <ArrowRight className="text-subtle size-4" />
                <span className="text-muted text-[10px]">
                  {s.shortcut ? "pointer" : "nightly copy"}
                </span>
              </motion.div>
            </AnimatePresence>
            <div className="border-line bg-surface rounded-xl border p-3 text-center">
              <p className="text-muted text-[10px]">OneLake</p>
              <p className="text-sm font-semibold">
                {s.shortcut ? "partner_sales (shortcut)" : "partner_sales (copy)"}
              </p>
              <div className="mt-2 flex h-6 justify-center gap-1">
                {s.shortcut ? (
                  <span className="border-accent text-accent flex items-center rounded-md border border-dashed px-2 text-[10px]">
                    → S3
                  </span>
                ) : (
                  Array.from({ length: 5 }, (_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="bg-viz-data h-6 w-4 rounded-sm"
                    />
                  ))
                )}
              </div>
              <p className="text-subtle mt-1 text-[10px]">
                {s.shortcut ? "0 TB stored" : `${TB} TB stored again`}
              </p>
            </div>
          </div>
          {s.shortcut && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.cache}
                onChange={(e) => set({ cache: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Turn on the shortcut cache
            </label>
          )}
          <div className="grid gap-1.5">
            {rows.map(([k, v, tone]) => (
              <div
                key={k}
                className={cn(
                  "grid gap-1 rounded-lg border px-3 py-1.5 text-xs sm:grid-cols-[10rem_1fr]",
                  tone === "good"
                    ? "border-good/40 bg-good/5"
                    : tone === "bad"
                      ? "border-bad/40 bg-bad/5"
                      : "border-line bg-surface",
                )}
              >
                <span className="text-muted">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-xs">
            OneLake hot storage at $0.026/GB-month (East US list). Reading through a shortcut uses
            the Fabric capacity it&apos;s read from; egress prices are set by the other cloud.
          </p>
        </div>
      }
    >
      <p>
        A OneLake <Term id="shortcut">shortcut</Term> is a signpost, not a copy: it makes data in
        ADLS, Amazon S3, Google Cloud Storage and other places appear inside OneLake, while it stays
        where it is.
      </p>
      <p>
        Compare it with the old habit of copying data every night. Watch copies, cost, freshness and
        what happens when something is deleted at the source.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: Databricks and Fabric together ------------------------------------------------- */

export function MirrorCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Databricks and Fabric, one set of tables"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="azure-mirror"
            prompt="The data engineering team keeps its Delta tables in Azure Databricks Unity Catalog. The BI team wants them in Fabric for Power BI Direct Lake, without copying any data. What do you set up?"
            options={[
              {
                id: "uc-mirror",
                label: "Mirror the Unity Catalog into Fabric",
                correct: true,
                feedback:
                  "Right. Unity Catalog mirroring copies only the catalog: the tables are reached through shortcuts, with no data movement.",
              },
              {
                id: "pipeline",
                label: "A nightly Data Factory pipeline into a Fabric Warehouse",
                feedback: "That's a copy, a day stale, stored and paid for twice.",
              },
              {
                id: "import",
                label: "Power BI import mode on Databricks SQL",
                feedback: "Import copies the data into the Power BI model and needs refreshing.",
              },
              {
                id: "synapse",
                label: "Move everything to Azure Synapse",
                feedback:
                  "Synapse still runs, but new work is steered to Fabric, and moving everything is the opposite of no copies.",
              },
            ]}
            explanation="Fabric's mirroring comes in kinds: database mirroring copies data (e.g. from Azure SQL or Snowflake), while metadata mirroring of Unity Catalog just points at the tables through shortcuts."
          />
        </div>
      }
    >
      <p>A very common Azure question.</p>
    </StepLayout>
  );
}

/* 5 ─ What will it cost? ⭐ ------------------------------------------------------------------------- */

const COST_INPUTS: CostInput[] = [
  { id: "sku", label: "Fabric capacity", values: INPUTS.sku, format: (v) => `F${v} (${v} CU)` },
  {
    id: "hours",
    label: "Hours running per day (paused otherwise)",
    values: INPUTS.hours,
    format: (v) => `${v} h`,
  },
  { id: "storedTB", label: "OneLake storage", values: INPUTS.storedTB, format: (v) => `${v} TB` },
  {
    id: "dbu",
    label: "Databricks serverless jobs per day",
    values: INPUTS.dbu,
    format: (v) => `${v} DBU`,
  },
  { id: "tus", label: "Event Hubs throughput units", values: INPUTS.tus, format: (v) => `${v} TU` },
];

export function AzureCost() {
  const [s, set] = useSceneState<AzureState>();
  const lines = estimate(s.cost, s.reserved);
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
              <span className="text-muted text-xs">Fabric billing</span>
              <Segmented
                size="sm"
                value={s.reserved ? "res" : "payg"}
                options={[
                  ["payg", "Pay as you go"],
                  ["res", "1-year reservation"],
                ]}
                onChange={(v) => set({ reserved: v === "res" })}
              />
            </div>
          }
          assumptions={
            <>
              <p>
                East US list prices from the Azure Retail Prices API, September 2026: Fabric $0.18
                per CU-hour pay-as-you-go, or $938 per CU per year reserved (billed every hour);
                OneLake hot storage $0.026/GB-month; Azure Databricks Premium serverless jobs
                $0.45/DBU; Event Hubs Standard $0.03 per TU-hour + $0.028 per million events
                (assumed ~50 million per TU per day); Data Factory $1 per 1,000 activity runs and
                $0.25 per DIU-hour.
              </p>
              <p>
                Not included: Power BI licences (below F64, every viewer needs Pro or PPU), overage,
                VMs for classic Databricks compute, networking, discounts. An illustration, not a
                quote.
              </p>
            </>
          }
        />
      }
    >
      <p>
        Fabric works like renting a generator: you pay for the capacity every hour it&apos;s
        switched on, whatever you run on it. Databricks and Data Factory are more like meters on
        each appliance.
      </p>
      <p className="text-muted text-sm">
        Try pausing the capacity outside working hours, then compare with a reservation, which is
        cheaper per hour but billed around the clock.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: the idle capacity ---------------------------------------------------------------- */

export function IdleCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The idle capacity"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="azure-idle"
            prompt="A team's F8 capacity runs pay-as-you-go around the clock, but it's only used about 8 hours on weekdays. Which single change saves the most?"
            options={[
              {
                id: "pause",
                label: "Pause the capacity outside working hours",
                correct: true,
                feedback:
                  "Right. Pay-as-you-go stops when paused: running ~176 of 730 hours cuts that line by about three quarters.",
              },
              {
                id: "reserve",
                label: "Buy a 1-year reservation",
                feedback:
                  "That saves about 41%, but a reservation is billed every hour, used or not. Better for capacity that's busy all day.",
              },
              {
                id: "cool",
                label: "Move OneLake data to the cool tier",
                feedback: "Storage is a small part of this bill, and cool data costs more to read.",
              },
              {
                id: "bigger",
                label: "Upgrade to F16 so jobs finish faster",
                feedback: "Doubling the capacity doubles the hourly price.",
              },
            ]}
            explanation="Capacity pricing rewards matching the hours you pay for to the hours you work, or committing when usage is steady."
          />
        </div>
      }
    >
      <p>Use the estimator to check your answer.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "ADLS Gen2 and OneLake",
    "Blob Storage with folders underneath everything; OneLake is Fabric's one lake per organisation.",
  ],
  [
    "Two routes, often together",
    "Azure Databricks for engineering and ML, Fabric for BI and self-service, on the same Delta tables.",
  ],
  [
    "Shortcuts beat copies",
    "Point at data in ADLS, S3 or GCS instead of copying it: one copy, always fresh.",
  ],
  [
    "Capacity is a different bill",
    "Fabric charges per capacity-hour: pause it or reserve it; add Power BI licences below F64.",
  ],
  [
    "Know what's retiring",
    "Synapse keeps running but new work goes to Fabric; HDInsight on AKS is gone.",
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
      <p>Three clouds, one architecture. Only the names and the billing models change.</p>
      <p>Next: the whole landscape side by side, including the pure open-source route.</p>
    </StepLayout>
  );
}

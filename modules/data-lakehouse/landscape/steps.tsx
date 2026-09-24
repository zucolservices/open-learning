"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { PlatformBuilder, type ServiceOption, type Slot } from "@/toolkit/builders/slot-builder";
import { BLOCKS, PLATFORMS, ROSETTA, type PlatformId } from "./data";
import type { LandscapeState } from "./state";

/* 1 ─ The Rosetta stone ⭐ ------------------------------------------------------------------------ */

const STAGES = [
  { id: "ingest", label: "Ingest" },
  { id: "store", label: "Store" },
  { id: "process", label: "Process" },
  { id: "serve", label: "Serve" },
] as const;

function RosettaBlock({
  id,
  platform,
  selected,
  onSelect,
}: {
  id: string;
  platform: PlatformId;
  selected: boolean;
  onSelect(id: string): void;
}) {
  const b = BLOCKS.find((x) => x.id === id)!;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "bg-surface w-full rounded-xl border px-2.5 py-2 text-left transition",
        selected ? "border-accent ring-accent/30 ring-2" : "border-line hover:border-line-strong",
      )}
    >
      <span className="text-muted block text-[10px]">{b.label}</span>
      <AnimatePresence mode="wait">
        <motion.span
          key={platform + id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="block text-xs font-semibold"
        >
          {ROSETTA[id][platform]}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function Rosetta() {
  const [s, set] = useSceneState<LandscapeState>();
  const p = s.platform as PlatformId;
  const block = BLOCKS.find((b) => b.id === s.block) ?? BLOCKS[4];
  return (
    <StepLayout
      eyebrow="The big idea"
      title="One architecture, many names"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Platform">
            {PLATFORMS.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={s.platform === x.id}
                onClick={() => set({ platform: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  s.platform === x.id
                    ? "border-accent bg-accent text-accent-fg"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {STAGES.map((st) => (
              <div key={st.id} className="grid content-start gap-2">
                <p className="text-subtle text-[10px] tracking-wide uppercase">{st.label}</p>
                {BLOCKS.filter((b) => b.stage === st.id).map((b) => (
                  <RosettaBlock
                    key={b.id}
                    id={b.id}
                    platform={p}
                    selected={s.block === b.id}
                    onSelect={(id) => set({ block: id })}
                  />
                ))}
              </div>
            ))}
          </div>
          <RosettaBlock
            id="governance"
            platform={p}
            selected={s.block === "governance"}
            onSelect={(id) => set({ block: id })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted mb-2 text-xs">
              <span className="text-fg font-medium">{block.label}</span>, everywhere
            </p>
            <div className="grid gap-1 sm:grid-cols-2">
              {PLATFORMS.map((x) => (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ platform: x.id })}
                  className={cn(
                    "flex justify-between gap-2 rounded-lg px-2 py-1 text-left text-xs",
                    x.id === p ? "bg-accent-soft text-accent" : "hover:bg-surface-2",
                  )}
                >
                  <span className="text-muted shrink-0">{x.label}</span>
                  <span className="text-right font-medium">{ROSETTA[block.id][x.id]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <p>
        The Rosetta Stone carries the same decree in three scripts, which is how scholars finally
        learned to read hieroglyphs. Lakehouse diagrams work the same way: the boxes are always the
        same; only the names on them change.
      </p>
      <p>
        Switch platforms and watch every box relabel itself. Click a box to see its name everywhere
        at once.
      </p>
      <p className="text-muted text-sm">
        Databricks and Snowflake run on top of the big clouds, so their columns sit alongside the
        cloud&apos;s own storage and networking.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The vendors -------------------------------------------------------------------------------- */

const VENDORS: { id: string; name: string; what: string; tables: string; adds: string }[] = [
  {
    id: "databricks",
    name: "Databricks",
    what: "A lakehouse platform on AWS, Azure and Google Cloud, from the creators of Spark and Delta Lake.",
    tables:
      "Delta natively; Iceberg via UniForm and managed Iceberg tables. Unity Catalog serves an Iceberg REST API that other engines can read and write.",
    adds: "Photon, serverless compute, Lakeflow pipelines, ML and AI tools, Lakebase (managed Postgres).",
  },
  {
    id: "snowflake",
    name: "Snowflake",
    what: "A cloud data platform that grew from a warehouse into open tables.",
    tables:
      "Iceberg tables, exposed through the Horizon Iceberg REST catalog for external engines to read and write. Open Catalog is managed Apache Polaris.",
    adds: "Separate storage and compute warehouses, Snowpark for Python, Cortex AI features.",
  },
  {
    id: "dremio",
    name: "Dremio",
    what: "An Iceberg lakehouse query engine.",
    tables: "Iceberg, with a built-in catalog based on Apache Polaris.",
    adds: "Reflections (pre-computed accelerations it picks automatically), a semantic layer.",
  },
  {
    id: "starburst",
    name: "Starburst",
    what: "The company behind Trino.",
    tables: "Iceberg first (their term: the “Icehouse” = Trino + Iceberg), plus Delta and Hudi.",
    adds: "Galaxy (managed) and Enterprise (self-managed) editions, governance, many connectors.",
  },
  {
    id: "cloudera",
    name: "Cloudera",
    what: "Enterprise data platform with roots in Hadoop, on-premises and in the cloud.",
    tables: "An open data lakehouse powered by Iceberg, with an Iceberg REST catalog.",
    adds: "Hybrid deployment: the same platform in your data centre and in the cloud.",
  },
  {
    id: "onehouse",
    name: "Onehouse",
    what: "Managed lakehouse from the team behind Apache Hudi and XTable.",
    tables: "Hudi, Iceberg and Delta, translated between each other.",
    adds: "Managed ingestion and table maintenance.",
  },
  {
    id: "motherduck",
    name: "MotherDuck",
    what: "A serverless cloud warehouse built on DuckDB.",
    tables: "DuckDB tables and DuckLake.",
    adds: "DuckDB's simplicity, shared in the cloud.",
  },
  {
    id: "clickhouse",
    name: "ClickHouse Cloud",
    what: "Managed ClickHouse, a very fast analytics database.",
    tables:
      "Reads Iceberg, Delta, Hudi and Paimon; writes Iceberg and Delta; talks to many catalogs.",
    adds: "Real-time analytics at high speed, alongside its own native tables.",
  },
];

export function Vendors() {
  const [s, set] = useSceneState<LandscapeState>();
  const v = VENDORS.find((x) => x.id === s.vendor) ?? VENDORS[0];
  return (
    <StepLayout
      eyebrow="The landscape"
      title="The vendors, and what they add"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1.5">
            {VENDORS.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ vendor: x.id })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition",
                  x.id === v.id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {x.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border p-4"
            >
              <p className="text-lg font-semibold">{v.name}</p>
              <p className="text-muted mt-1 text-sm">{v.what}</p>
              <dl className="mt-3 grid gap-2 text-sm">
                <div className="grid gap-0.5 sm:grid-cols-[7rem_1fr]">
                  <dt className="text-muted text-xs">Tables & catalog</dt>
                  <dd>{v.tables}</dd>
                </div>
                <div className="grid gap-0.5 sm:grid-cols-[7rem_1fr]">
                  <dt className="text-muted text-xs">What it adds</dt>
                  <dd>{v.adds}</dd>
                </div>
              </dl>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Notice the pattern: nearly every vendor now reads and writes open table formats, and
            most expose an Iceberg REST catalog. They compete on engines, speed and convenience.
          </p>
        </div>
      }
    >
      <p>
        Between the big clouds and pure open source sit the vendor platforms. Most run on top of
        AWS, Azure or Google Cloud, and add an engine, a catalog, and a lot of convenience.
      </p>
      <p>Click through them. Look for which table formats each speaks.</p>
    </StepLayout>
  );
}

/* 3 ─ Run it yourself ⭐ -------------------------------------------------------------------------- */

const SLOTS: Slot[] = [
  {
    id: "storage",
    layer: "Object storage",
    need: "S3-compatible storage you run, from a well-governed project",
  },
  { id: "catalog", layer: "Catalog", need: "An Iceberg REST catalog" },
  { id: "cdc", layer: "Database changes", need: "Capture changes from Postgres" },
  { id: "streaming", layer: "Event streams", need: "A durable event log" },
  { id: "spark", layer: "Pipelines", need: "Batch and streaming transformations" },
  { id: "sql", layer: "Shared SQL", need: "Interactive SQL for 200 analysts" },
  {
    id: "governance",
    layer: "Access control",
    need: "Column masks and row filters in the SQL engine",
  },
  { id: "orchestration", layer: "Orchestration", need: "Schedule and retry the pipelines" },
  { id: "bi", layer: "Dashboards", need: "Open-source dashboards" },
];

const OPTIONS: ServiceOption[] = [
  {
    id: "ceph",
    name: "Ceph RGW",
    blurb: "S3 gateway on Ceph: heavy, but proven at scale.",
    fits: ["storage"],
  },
  {
    id: "seaweed",
    name: "SeaweedFS",
    blurb: "Apache-2.0 object and file store with an S3 API.",
    fits: ["storage"],
  },
  {
    id: "garage",
    name: "Garage",
    blurb: "light, geo-distributed S3-compatible storage (AGPLv3).",
    fits: ["storage"],
  },
  {
    id: "minio",
    name: "MinIO",
    blurb: "formerly popular S3-compatible store.",
    fits: [],
    whyNot: {
      storage:
        "The community edition's repository was archived in April 2026, and its free successor (AIStor Free) is commercially licensed. Pick a project with community or foundation governance.",
    },
  },
  {
    id: "polaris",
    name: "Apache Polaris",
    blurb: "Iceberg REST catalog (Apache top-level project, 2026).",
    fits: ["catalog"],
  },
  {
    id: "lakekeeper",
    name: "Lakekeeper",
    blurb: "a lightweight Iceberg REST catalog written in Rust.",
    fits: ["catalog"],
  },
  { id: "debezium", name: "Debezium", blurb: "CDC from database logs.", fits: ["cdc"] },
  {
    id: "kafka",
    name: "Apache Kafka",
    blurb: "the durable event log.",
    fits: ["streaming"],
    whyNot: { cdc: "Kafka carries change events, but Debezium is what reads them from Postgres." },
  },
  { id: "spark", name: "Apache Spark", blurb: "batch and streaming processing.", fits: ["spark"] },
  { id: "flink", name: "Apache Flink", blurb: "streaming-first processing.", fits: ["spark"] },
  { id: "trino", name: "Trino", blurb: "distributed interactive SQL.", fits: ["sql"] },
  {
    id: "duckdb",
    name: "DuckDB",
    blurb: "in-process SQL.",
    fits: [],
    whyNot: {
      sql: "Perfect for one person on one machine; for 200 analysts sharing a service, a distributed engine like Trino fits.",
    },
  },
  {
    id: "ranger",
    name: "Apache Ranger",
    blurb: "policies with masks and row filters; Trino has a built-in Ranger plugin.",
    fits: ["governance"],
  },
  {
    id: "airflow",
    name: "Apache Airflow",
    blurb: "the most widely used orchestrator.",
    fits: ["orchestration"],
  },
  { id: "dagster", name: "Dagster", blurb: "asset-based orchestration.", fits: ["orchestration"] },
  { id: "superset", name: "Apache Superset", blurb: "open-source BI.", fits: ["bi"] },
];

export function RunItYourself() {
  const [s, set] = useSceneState<LandscapeState>();
  return (
    <StepLayout
      eyebrow="Build it"
      title="Run it yourself"
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
          doneText="A fully open-source lakehouse. No licence fees, and every part replaceable. In exchange, you run, upgrade, secure and maintain all of it yourselves."
        />
      }
    >
      <p>
        A startup wants no cloud lock-in: everything open source, on its own servers. Pick a project
        for each job.
      </p>
      <p className="text-muted text-sm">
        Spark doesn&apos;t have a built-in Ranger plugin (the Apache Kyuubi project adds one), which
        is why governance sits in the SQL engine here.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: what locks you in? ------------------------------------------------------------ */

export function LockInSort() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What actually locks you in?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="lock-in"
            prompt="If Brewline changed platforms next year, which of these would move easily, and which would take real work?"
            categories={[
              { id: "portable", label: "Moves easily" },
              { id: "sticky", label: "Takes work" },
            ]}
            items={[
              {
                id: "files",
                label: "Parquet data files in Iceberg tables",
                category: "portable",
                why: "Any engine that speaks Iceberg can read them where they are.",
              },
              {
                id: "catalog",
                label:
                  "Permissions and table history kept only in a vendor catalog with no open API",
                category: "sticky",
                why: "The catalog holds the pointers and rules: open files don't help if nothing else can read the catalog.",
              },
              {
                id: "rest",
                label: "Tables in a catalog with a read-and-write Iceberg REST API",
                category: "portable",
                why: "Other engines can connect to it directly, today.",
              },
              {
                id: "procs",
                label: "Hundreds of stored procedures in one warehouse's own SQL dialect",
                category: "sticky",
                why: "Proprietary SQL has to be rewritten.",
              },
              {
                id: "pyspark",
                label: "Pipelines written in PySpark",
                category: "portable",
                why: "Spark runs on every platform in this module.",
              },
              {
                id: "egress",
                label: "500 TB in one cloud, to be read every day from another",
                category: "sticky",
                why: "Egress fees make crossing clouds expensive. Keep compute near the data.",
              },
            ]}
            explanation="Open file formats solved half of lock-in. The rest lives in catalogs, dialects and data gravity. The Iceberg REST catalog is the escape hatch: check it supports writes as well as reads."
          />
        </div>
      }
    >
      <p>
        &ldquo;Open&rdquo; has layers. An open <Term id="table-format">table format</Term>{" "}
        doesn&apos;t guarantee an open catalog.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: the MinIO lesson ----------------------------------------------------------------- */

export function GovernanceCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="When open source changes course"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="oss-governance"
            prompt="In 2024 a team built on a popular open-source object store run by one company. By 2026 its repository is archived and the free successor isn't open source. What's the lesson for picking components?"
            options={[
              {
                id: "governance",
                label:
                  "Prefer projects governed by a foundation or broad community, pin versions, and plan an exit",
                correct: true,
                feedback:
                  "Right. Apache and Linux Foundation projects can't be withdrawn by one company, and a planned exit turns a crisis into a migration.",
              },
              {
                id: "never",
                label: "Never use open source for storage",
                feedback:
                  "Commercial products change terms too. The point is who controls the project, and your exit plan.",
              },
              {
                id: "fork",
                label: "Always fork every dependency yourself",
                feedback:
                  "Forking means maintaining it forever, security fixes included. Rarely the best first move.",
              },
              {
                id: "licence",
                label: "Only the licence matters; governance doesn't",
                feedback:
                  "The code stayed AGPL, yet maintenance stopped. A licence doesn't guarantee a maintained product.",
              },
            ]}
            explanation="This really happened: MinIO's community edition went from removed console features (June 2025) to source-only (December 2025) to an archived repository (April 2026)."
          />
        </div>
      }
    >
      <p>A true story from 2025–2026.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "One architecture",
    "Ingest, store, catalog, process, serve, govern: every platform has the same boxes.",
  ],
  [
    "Learn to translate",
    "Knowing the Rosetta row for each box lets you read any vendor's diagram.",
  ],
  [
    "Vendors meet at open tables",
    "Almost every platform now reads and writes Iceberg or Delta; they compete on engines and convenience.",
  ],
  [
    "Open format ≠ open catalog",
    "Lock-in moved to catalogs, SQL dialects and egress. Check for a read-and-write Iceberg REST API.",
  ],
  [
    "Open source needs governance",
    "Prefer foundation projects, pin versions, and keep an exit plan.",
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
      <p>That completes the platforms chapter.</p>
      <p>Next, the capstone: design a whole lakehouse from a real brief.</p>
    </StepLayout>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CatalogState } from "./state";

/* 4 ─ A commit through the Iceberg REST API -------------------------------------------------------- */

interface RestFrame {
  title: string;
  text: string;
  request?: string;
  response?: string;
  tone?: "good" | "bad";
}

function restFrames(conflict: boolean): RestFrame[] {
  const base: RestFrame[] = [
    {
      title: "1. Ask the catalog how to talk to it",
      text: "The engine starts with one URL. The config endpoint tells it the rest: prefixes and default settings.",
      request: "GET /v1/config?warehouse=brewline",
      response: '{ "defaults": {…}, "overrides": { "prefix": "brewline" } }',
    },
    {
      title: "2. Load the table",
      text: "The engine asks for sales.orders. The catalog returns where the current metadata file is, the metadata itself and, if asked, short-lived storage credentials, so the engine never needs permanent keys to the bucket.",
      request:
        "GET /v1/brewline/namespaces/sales/tables/orders\nX-Iceberg-Access-Delegation: vended-credentials",
      response:
        '{ "metadata-location": "s3://…/00007-….metadata.json",\n  "metadata": { … current snapshot S7 … },\n  "storage-credentials": [ { "prefix": "s3://…/orders/", "config": {…} } ] }',
    },
    {
      title: "3. Write the data files",
      text: "Using the vended credentials, the engine writes new Parquet files and a manifest straight to object storage. The catalog doesn't handle the data itself.",
    },
    {
      title: "4. Commit: requirements + updates",
      text: "The engine sends what it assumes (the table is still the same table, main still points at S7) and what it wants changed. The catalog checks the requirements and applies the updates atomically.",
      request:
        'POST /v1/brewline/namespaces/sales/tables/orders\n{ "requirements": [\n    { "type": "assert-table-uuid", "uuid": "9c0b…" },\n    { "type": "assert-ref-snapshot-id", "ref": "main", "snapshot-id": 7 } ],\n  "updates": [\n    { "action": "add-snapshot", "snapshot": { "snapshot-id": 8, … } },\n    { "action": "set-snapshot-ref", "ref-name": "main", "snapshot-id": 8 } ] }',
    },
  ];
  return [
    ...base,
    conflict
      ? {
          title: "5. 409: someone committed first",
          text: "Another writer moved main to S8 already, so “main is at S7” is false. The catalog refuses with CommitFailedException. The engine reloads the table, checks for conflicts and retries on top of the new state.",
          response: '409 Conflict\n{ "error": { "type": "CommitFailedException", … } }',
          tone: "bad",
        }
      : {
          title: "5. 200: the new version is live",
          text: "The requirements held, so the catalog wrote the new metadata and moved the pointer. Every engine that loads the table from now on gets S8.",
          response: '200 OK\n{ "metadata-location": "s3://…/00008-….metadata.json", … }',
          tone: "good",
        },
  ];
}

export function RestCommit() {
  const [s, set] = useSceneState<CatalogState>();
  const frames = restFrames(s.restConflict);
  const step = Math.min(s.restStep, frames.length - 1);
  const f = frames[step];

  return (
    <StepLayout
      eyebrow="Under the hood"
      title="A commit through the Iceberg REST API"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.restConflict ? "conflict" : "ok"}
            options={[
              ["ok", "Alone"],
              ["conflict", "Another writer commits first"],
            ]}
            onChange={(v) => set({ restConflict: v === "conflict", restStep: 0 })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-muted mb-1 text-[11px]">Engine → catalog</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`q-${s.restConflict}-${step}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Code className="min-h-24 text-[10px] whitespace-pre-wrap">
                    {f.request ?? "—"}
                  </Code>
                </motion.div>
              </AnimatePresence>
            </div>
            <div>
              <p className="text-muted mb-1 text-[11px]">Catalog → engine</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`r-${s.restConflict}-${step}`}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <Code
                    className={cn(
                      "min-h-24 text-[10px] whitespace-pre-wrap",
                      f.tone === "bad" && "text-bad",
                      f.tone === "good" && "text-good",
                    )}
                  >
                    {f.response ?? "—"}
                  </Code>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <Stepper step={step} count={frames.length} onChange={(n) => set({ restStep: n })} />
          <FrameCaption frameKey={`${s.restConflict}-${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Every catalog used to have its own client library. The{" "}
        <Term id="iceberg-rest">Iceberg REST catalog API</Term> replaced that with one open HTTP
        protocol: an engine that speaks it works with any catalog that serves it.
      </p>
      <p>
        Step through one commit. Notice who does what: the engine writes the files, the catalog only
        checks the assumptions and moves the pointer.
      </p>
      <p className="text-subtle text-xs">
        A 409 is safe to retry after reloading. A 5xx error is different: the commit may or may not
        have landed, so the engine must check before retrying. The spec also defines an optional
        endpoint for atomic commits across several tables.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The catalog landscape -------------------------------------------------------------------- */

const CATALOGS: { name: string; body: string; rest: boolean; oss: boolean; tags: string }[] = [
  {
    name: "Hive Metastore",
    body: "The original: a Thrift service backed by a relational database. For Iceberg it stores the current metadata location; for Delta just the path, since the log is the truth.",
    rest: false,
    oss: true,
    tags: "Hive tables · Iceberg · Delta (path only)",
  },
  {
    name: "AWS Glue Data Catalog",
    body: "AWS's managed, Hive-compatible catalog. Also serves an Iceberg REST endpoint for tables in ordinary S3 buckets and in S3 Tables.",
    rest: true,
    oss: false,
    tags: "Iceberg · Delta · Hudi · Hive",
  },
  {
    name: "Unity Catalog",
    body: "Databricks' catalog (catalog.schema.table), open-sourced in 2024. On Databricks, external engines read and write managed Iceberg tables over Iceberg REST; with Delta 4.x it can coordinate Delta commits too.",
    rest: true,
    oss: true,
    tags: "Delta · Iceberg",
  },
  {
    name: "Apache Polaris",
    body: "An Iceberg REST catalog, an Apache top-level project since February 2026. Snowflake Open Catalog is a managed Polaris. Can federate other catalogs.",
    rest: true,
    oss: true,
    tags: "Iceberg (+ generic tables, without commit coordination)",
  },
  {
    name: "Project Nessie",
    body: "Git-like: branches, tags and commits across the whole catalog, with multi-table commits. Serves Iceberg REST.",
    rest: true,
    oss: true,
    tags: "Iceberg",
  },
  {
    name: "Lakekeeper",
    body: "A lightweight Iceberg REST catalog written in Rust.",
    rest: true,
    oss: true,
    tags: "Iceberg",
  },
  {
    name: "Apache Gravitino",
    body: "A “federated metadata lake” that presents many catalogs and sources through one layer. Top-level project since 2025.",
    rest: true,
    oss: true,
    tags: "Iceberg · Hive · others",
  },
  {
    name: "Google Lakehouse runtime catalog",
    body: "Formerly BigLake metastore. Serves an Iceberg REST catalog shared by BigQuery, Spark and other engines.",
    rest: true,
    oss: false,
    tags: "Iceberg",
  },
  {
    name: "Snowflake Horizon Catalog",
    body: "Serves Snowflake-managed Iceberg tables to external engines over Iceberg REST, for reads and writes.",
    rest: true,
    oss: false,
    tags: "Iceberg",
  },
];

export function Landscape() {
  const [s, set] = useSceneState<CatalogState>();
  const shown = CATALOGS.filter((c) =>
    s.landscapeFilter === "rest" ? c.rest : s.landscapeFilter === "oss" ? c.oss : true,
  );
  return (
    <StepLayout
      eyebrow="Landscape"
      title="Who's who in catalogs"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.landscapeFilter}
            options={[
              ["all", "All"],
              ["rest", "Speaks Iceberg REST"],
              ["oss", "Open source"],
            ]}
            onChange={(v) => set({ landscapeFilter: v as CatalogState["landscapeFilter"] })}
          />
          <motion.div layout className="grid gap-3 md:grid-cols-2">
            <AnimatePresence>
              {shown.map((c) => (
                <motion.div
                  key={c.name}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="border-line bg-surface rounded-2xl border p-4"
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-muted mt-1 text-xs leading-relaxed">{c.body}</p>
                  <p className="text-subtle mt-2 font-mono text-[10px]">{c.tags}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      }
    >
      <p>
        There are many catalogs, and they increasingly speak the same language. Filter to see how
        many serve the Iceberg REST API, and which are open source.
      </p>
      <p>
        When choosing, the questions are the same as for formats: which engines must read and write,
        which platform you&apos;re on, and where access control should live (next module).
      </p>
      <p className="text-subtle text-xs">As of September 2026. This space changes fast.</p>
    </StepLayout>
  );
}

/* 6 ─ Branching a whole catalog ------------------------------------------------------------------- */

const BRANCH_FRAMES = [
  {
    title: "The nightly job updates two tables",
    iceberg:
      "orders gets today's orders; order_items gets their line items. Dashboards join the two.",
    nessie:
      "orders gets today's orders; order_items gets their line items. Dashboards join the two.",
    live: { orders: "old", items: "old" },
    nessieLive: { orders: "old", items: "old" },
  },
  {
    title: "Write to a branch",
    iceberg: "Each table gets its own audit branch, and the job writes to both. main is untouched.",
    nessie: "The whole catalog gets one branch, nightly. The job writes both tables on it.",
    live: { orders: "old", items: "old" },
    nessieLive: { orders: "old", items: "old" },
  },
  {
    title: "Publish",
    iceberg: "Fast-forward orders' main… then order_items' main. Two separate commits.",
    nessie: "Merge the nightly branch into main: one commit covering both tables.",
    live: { orders: "new", items: "old" },
    nessieLive: { orders: "new", items: "new" },
  },
  {
    title: "What a dashboard can see",
    iceberg:
      "Between the two publishes, a dashboard can see new orders without their items. The window is short, but it exists.",
    nessie:
      "There's no in-between state: both tables switch together, like a multi-table transaction.",
    live: { orders: "new", items: "old" },
    nessieLive: { orders: "new", items: "new" },
  },
];

export function Branching() {
  const [s, set] = useSceneState<CatalogState>();
  const step = Math.min(s.branchStep, BRANCH_FRAMES.length - 1);
  const f = BRANCH_FRAMES[step];
  const mixed = (st: { orders: string; items: string }) => st.orders !== st.items;

  const column = (title: string, text: string, st: { orders: string; items: string }) => (
    <div
      className={cn(
        "rounded-2xl border p-3",
        mixed(st) ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
      )}
    >
      <p className="text-sm font-semibold">{title}</p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {(["orders", "items"] as const).map((t) => (
          <motion.div
            key={t}
            animate={{ scale: st[t] === "new" ? [1, 1.06, 1] : 1 }}
            className={cn(
              "rounded-lg border px-2 py-2 text-center font-mono text-[11px]",
              st[t] === "new"
                ? "border-viz-add bg-viz-add/20"
                : "border-viz-data/50 bg-viz-data/10",
            )}
          >
            {t === "orders" ? "orders" : "order_items"}
            <span className="text-muted block text-[10px]">
              main: {st[t] === "new" ? "tonight's data" : "yesterday"}
            </span>
          </motion.div>
        ))}
      </div>
      <p className="text-muted mt-2 text-xs">{text}</p>
    </div>
  );

  return (
    <StepLayout
      eyebrow="Git for data"
      title="Branching a whole catalog"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {column("Iceberg branches (per table)", f.iceberg, f.live)}
            {column("Nessie (whole catalog)", f.nessie, f.nessieLive)}
          </div>
          <Stepper
            step={step}
            count={BRANCH_FRAMES.length}
            onChange={(n) => set({ branchStep: n })}
          />
          <FrameCaption frameKey={step} title={f.title} tone={step === 3 ? "bad" : undefined}>
            {step === 3
              ? "Per-table branches publish one table at a time. A catalog-level branch publishes many tables in one step."
              : "Step through both approaches side by side."}
          </FrameCaption>
        </div>
      }
    >
      <p>
        In the Iceberg module you branched a single table for write-audit-publish. Real pipelines
        often change several related tables together.
      </p>
      <p>
        A catalog like Project Nessie branches the <em>whole catalog</em>, Git-style: many tables
        change on a branch and merge in one commit. The Iceberg REST spec also defines an optional
        multi-table commit, but not every catalog implements it.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Checkpoint --------------------------------------------------------------------------------- */

export function RestCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why a common catalog API matters"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="why-rest"
            prompt="Why has the Iceberg REST catalog API become so widely adopted?"
            options={[
              {
                id: "faster",
                label: "It makes queries faster than other catalogs",
                feedback:
                  "Query speed comes from the engine and the table layout. The catalog is consulted once per query.",
              },
              {
                id: "any",
                label:
                  "Engines implement one client and work with any catalog; the catalog checks commits and can vend storage credentials",
                correct: true,
                feedback:
                  "Right. It decouples engines from catalog vendors, and moves commit checks and access to storage behind one server.",
              },
              {
                id: "stores",
                label: "It stores the table's data, so engines don't need object storage",
                feedback:
                  "Data stays in object storage. The catalog tracks the pointer and metadata.",
              },
              {
                id: "delta",
                label: "It converts Delta tables to Iceberg automatically",
                feedback:
                  "That's UniForm or XTable's job. The REST API is about finding and committing tables.",
              },
            ]}
            explanation="The same pattern is spreading: Unity Catalog, Polaris, Glue, S3 Tables, Google's and Snowflake's catalogs all serve it."
          />
        </div>
      }
    >
      <p>Think about what the API standardises.</p>
    </StepLayout>
  );
}

/* 8 ─ Wrap-up ------------------------------------------------------------------------------------ */

const TAKEAWAYS: [string, string][] = [
  [
    "The catalog is the contact list",
    "Engines find tables by name, and learn where they live and which version is current.",
  ],
  [
    "It holds the commit pointer",
    "Every engine that asks the same catalog sees the same latest version; pinned readers go stale.",
  ],
  ["One owner per table", "Two catalogs managing one table fork its history."],
  [
    "Iceberg REST is the common language",
    "One HTTP API for loading, committing and vending credentials, served by most modern catalogs.",
  ],
  [
    "Some catalogs branch everything",
    "Catalog-level branches and multi-table commits keep related tables consistent.",
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
        The catalog started as a phone book and became the heart of the lakehouse: it decides what
        exists, what&apos;s current and, as you&apos;ll see next, who may touch it.
      </p>
      <p>
        Next, <strong>Governance, security &amp; privacy</strong>: access control, credential
        vending and erasing personal data from immutable storage.
      </p>
    </StepLayout>
  );
}

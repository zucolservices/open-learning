"use client";

import { motion } from "motion/react";
import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";

/* 4 ─ How they grew together ⭐ ------------------------------------------------- */

const COLS = [
  { name: "Hudi", tone: "border-viz-add/60 bg-viz-add/10" },
  { name: "Iceberg", tone: "border-viz-meta/60 bg-viz-meta/10" },
  { name: "Delta", tone: "border-viz-data/60 bg-viz-data/10" },
];

function Columns({ rows }: { rows: [string, string, string][] }) {
  return (
    <div className="flex h-full flex-col justify-center gap-2">
      <div className="grid grid-cols-3 gap-2">
        {COLS.map((c) => (
          <p key={c.name} className="text-center text-sm font-semibold">
            {c.name}
          </p>
        ))}
      </div>
      {rows.map((row, r) => (
        <div key={r} className="grid grid-cols-3 gap-2">
          {row.map((cell, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 * (r * 3 + i) }}
              className={cn(
                "rounded-lg border px-2 py-2 text-center text-[11px] leading-snug",
                cell ? COLS[i].tone : "border-line border-dashed",
              )}
            >
              {cell || "–"}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

function SceneOrigins() {
  return (
    <Columns
      rows={[
        ["Uber, 2016", "Netflix, 2017", "Databricks, open 2019"],
        [
          "Upserts and incremental pipelines",
          "Correct tables at huge scale, any engine",
          "Reliable Spark batch and streaming",
        ],
      ]}
    />
  );
}

function SceneBorrow() {
  return (
    <Columns
      rows={[
        ["Merge-on-Read tables", "v2 delete files", "Deletion vectors"],
        ["Clustering service", "Partition evolution", "Liquid clustering"],
        ["Metadata table + indexes", "Manifest stats", "Log stats + checkpoints"],
      ]}
    />
  );
}

function SceneTranslate() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="flex gap-2">
        {["_delta_log/", "metadata/", ".hoodie/"].map((m, i) => (
          <motion.span
            key={m}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 * i + 0.2 }}
            className="border-viz-meta/60 bg-viz-meta/15 rounded-lg border px-2 py-1 font-mono text-[11px]"
          >
            {m}
          </motion.span>
        ))}
      </div>
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-line-strong h-6 w-px origin-top"
      />
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="border-viz-data/60 bg-viz-data/15 h-9 w-7 rounded border" />
        ))}
      </div>
      <p className="text-muted text-center text-xs">
        One copy of the Parquet files. Several sets of metadata describing it.
      </p>
    </div>
  );
}

function SceneCatalogs() {
  const items = [
    "Unity Catalog",
    "Apache Polaris",
    "AWS Glue / S3 Tables",
    "Nessie · Lakekeeper · Gravitino",
  ];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <div className="bg-accent-soft border-accent/60 rounded-xl border px-4 py-2 text-sm font-semibold">
        Iceberg REST catalog API
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((it, i) => (
          <motion.span
            key={it}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-center text-[11px]"
          >
            {it}
          </motion.span>
        ))}
      </div>
      <p className="text-muted max-w-xs text-center text-xs">
        Engines talk to any of these catalogs through one common API.
      </p>
    </div>
  );
}

function SceneShared() {
  return (
    <Columns
      rows={[
        ["", "v3 deletion vectors", "Deletion vectors"],
        ["VARIANT (1.2)", "VARIANT (v3)", "VARIANT (4.0)"],
        ["", "Row lineage (v3)", "Row tracking"],
      ]}
    />
  );
}

function SceneDiffer() {
  return (
    <Columns
      rows={[
        ["Timeline + file groups", "Metadata tree + catalog", "Transaction log"],
        [
          "Indexes, built-in services, incrementals",
          "Hidden partitioning, widest engine support",
          "Deep Spark + Databricks integration",
        ],
      ]}
    />
  );
}

const SCENES = [SceneOrigins, SceneBorrow, SceneTranslate, SceneCatalogs, SceneShared, SceneDiffer];

const SECTIONS: StorySection[] = [
  {
    id: "origins",
    kicker: "2016–2019",
    title: "Three starting points",
    body: (
      <>
        <p>
          The three formats were born within a few years of each other, at three companies with
          different pains. Uber needed constant upserts. Netflix needed huge tables that stayed
          correct and could be read by any engine. Databricks needed reliable Spark pipelines.
        </p>
        <p>
          Each design reflects its first problem. That&apos;s why their metadata looks so different.
        </p>
      </>
    ),
  },
  {
    id: "borrow",
    kicker: "Early 2020s",
    title: "Feature lists that overlap",
    body: (
      <>
        <p>
          Then their feature lists began to overlap. Iceberg added delete files for{" "}
          <Term id="merge-on-read">merge-on-read</Term>. Delta added{" "}
          <Term id="deletion-vector">deletion vectors</Term>, and later clustering it can change
          without rewriting everything. Hudi grew a metadata table with rich indexes.
        </p>
        <p>By the mid-2020s, each could handle most workloads the others could.</p>
      </>
    ),
  },
  {
    id: "translate",
    kicker: "2023–2024",
    title: "Translate the metadata, keep the data",
    body: (
      <>
        <p>
          Since all three store data as Parquet, why copy it to switch formats? Delta&apos;s{" "}
          <strong>UniForm</strong> writes Iceberg metadata alongside its own log.{" "}
          <strong>Apache XTable</strong> (first called OneTable) translates metadata between any of
          the three.
        </p>
        <p>You&apos;ll try both shortly.</p>
      </>
    ),
  },
  {
    id: "catalogs",
    kicker: "2024–2026",
    title: "The contest moves to catalogs",
    body: (
      <>
        <p>
          In June 2024, Databricks agreed to buy Tabular, the company founded by Iceberg&apos;s
          creators. Snowflake announced the Polaris catalog, now Apache Polaris, a top-level project
          since February 2026. Databricks open-sourced Unity Catalog.
        </p>
        <p>
          Increasingly, the question isn&apos;t only which format, but which{" "}
          <Term id="catalog">catalog</Term>. Many now speak the Iceberg REST API.
        </p>
      </>
    ),
  },
  {
    id: "shared",
    kicker: "2025–2026",
    title: "Shared features, even shared bits",
    body: (
      <>
        <p>
          Iceberg v3&apos;s deletion vectors were designed to be compatible with Delta&apos;s. A
          semi-structured VARIANT type arrived in Delta 4.0, Iceberg v3 and Hudi 1.2. Row-level
          lineage is converging too.
        </p>
        <p>The gap between the formats is the smallest it has ever been.</p>
      </>
    ),
  },
  {
    id: "differ",
    kicker: "Today",
    title: "What still sets them apart",
    body: (
      <>
        <p>
          The differences that remain are real, but they&apos;re more about ecosystem and focus than
          raw capability: Hudi&apos;s upsert and pipeline tooling, Iceberg&apos;s neutrality across
          engines and vendors, Delta&apos;s depth in Spark and Databricks.
        </p>
        <p>That&apos;s why choosing one is mostly about where you work. More on that soon.</p>
      </>
    ),
  },
];

export function GrewTogether() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => {
        const Scene = SCENES[i];
        return <Scene />;
      }}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">Scroll story</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            How the formats grew together
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            A decade of the table-format story, from three rivals to near-neighbours. Scroll slowly.
          </p>
        </div>
      }
    />
  );
}

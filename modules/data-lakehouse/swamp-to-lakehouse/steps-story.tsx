"use client";

import { ScrollStory, type StorySection } from "@/toolkit/layout/scroll-story";
import { ERA_SCENES } from "./eras";
import { Term } from "@/toolkit/glossary/term";

const SECTIONS: StorySection[] = [
  {
    id: "warehouse",
    kicker: "1980s–90s",
    title: "The data warehouse",
    body: (
      <>
        <p>
          Brewline copies the day&apos;s sales every night from the tills database into a{" "}
          <Term id="data-warehouse">
            <strong>data warehouse</strong>
          </Term>
          , a separate database built for analytics. The idea was described at IBM in 1988, made
          popular by Bill Inmon in the early 1990s and by Ralph Kimball&apos;s dimensional modelling
          in 1996. Teradata had been selling parallel analytics machines since the 1980s.
        </p>
        <p>
          You get clean tables, fast SQL and one trusted version of the numbers. The catch: storage
          and compute come bundled in one expensive system, the data sits in a proprietary format,
          and only tidy rows and columns fit.
        </p>
      </>
    ),
  },
  {
    id: "hadoop",
    kicker: "2006",
    title: "Big data and Hadoop",
    body: (
      <>
        <p>
          Brewline launches an app. Now there are clickstreams, logs, JSON events and photos: too
          much, too messy and too varied for the warehouse.
        </p>
        <p>
          Building on Google&apos;s GFS (2003) and MapReduce (2004) papers, <strong>Hadoop</strong>{" "}
          (2006) stored anything on clusters of cheap servers. Facebook&apos;s <strong>Hive</strong>{" "}
          (2008) added SQL. Data went in raw, and structure was applied when reading (
          <Term id="schema-on-read">
            <em>schema-on-read</em>
          </Term>
          ). In 2010 this pool of raw data got a name: the{" "}
          <Term id="data-lake">
            <strong>data lake</strong>
          </Term>
          .
        </p>
      </>
    ),
  },
  {
    id: "swamp",
    kicker: "2010s",
    title: "…and then the swamp",
    body: (
      <>
        <p>Pouring data in was easy. Keeping it usable was not.</p>
        <p>
          With no <strong>transactions</strong>, a failed job left half-written files that readers
          picked up anyway. With no enforced <strong>schema</strong>, one team&apos;s change broke
          another team&apos;s reports. With no <strong>catalog</strong>, nobody knew which of five
          &ldquo;final&rdquo; files was real.
        </p>
        <p>
          Many lakes became{" "}
          <Term id="data-swamp">
            <strong>data swamps</strong>
          </Term>
          : lots of data, very little trust.
        </p>
      </>
    ),
  },
  {
    id: "cloud",
    kicker: "2006–2015",
    title: "The cloud splits storage from compute",
    body: (
      <>
        <p>
          Meanwhile,{" "}
          <Term id="object-storage">
            <strong>object storage</strong>
          </Term>{" "}
          arrived: Amazon S3 in 2006, later Google Cloud Storage and Azure&apos;s ADLS. It is cheap,
          durable and practically unlimited. But it stores objects, not files, and you can&apos;t
          rename a folder atomically. That detail comes back later.
        </p>
        <p>
          Cloud warehouses followed: BigQuery (public in 2012), Redshift (2013), Snowflake (2015).
          BigQuery and Snowflake were built on <strong>separating storage from compute</strong>:
          keep the data in one place, and start and stop compute as you need it.
        </p>
      </>
    ),
  },
  {
    id: "two-tier",
    kicker: "2010s",
    title: "Two tiers, two copies",
    body: (
      <>
        <p>
          So most companies ran both. Raw data landed in the <strong>lake</strong> for data science
          and ML. A curated subset was copied into a <strong>warehouse</strong> for BI.
        </p>
        <p>
          It works, but Brewline now stores data twice, runs ETL jobs that break, governs two
          systems, and its dashboards show yesterday&apos;s numbers. The usual complaints:
          reliability, stale data, weak support for advanced analytics, cost, and lock-in.
        </p>
      </>
    ),
  },
  {
    id: "formats",
    kicker: "2013",
    title: "Open, columnar files",
    body: (
      <>
        <p>
          <strong>ORC</strong> (Hortonworks and Facebook) and <strong>Parquet</strong> (Twitter and
          Cloudera) arrived within weeks of each other in 2013. They gave the lake an open, columnar
          file format with fast scans and strong compression. Spark, Trino, Hive and more could all
          read them.
        </p>
        <p>
          Good files. But a folder of files still isn&apos;t a <em>table</em>: no transactions, no
          safe updates, no reliable way to know which files belong.
        </p>
      </>
    ),
  },
  {
    id: "tables",
    kicker: "2016–2019",
    title: "Open table formats",
    body: (
      <>
        <p>
          Engineers at Uber (<strong>Apache Hudi</strong>, 2016), Netflix (
          <strong>Apache Iceberg</strong>, 2017) and Databricks (<strong>Delta Lake</strong>,
          open-sourced 2019) each solved the same problem. They added a metadata layer that records
          exactly which files make up the table.
        </p>
        <p>
          That layer brings{" "}
          <Term id="acid">
            <strong>ACID transactions</strong>
          </Term>
          , time travel, schema enforcement and row-level updates to plain Parquet files in object
          storage.
        </p>
      </>
    ),
  },
  {
    id: "lakehouse",
    kicker: "2020 →",
    title: "The lakehouse",
    body: (
      <>
        <p>
          Stack the layers and you get a{" "}
          <Term id="lakehouse">
            <strong>lakehouse</strong>
          </Term>
          : one copy of open data in object storage, open file and table formats, a catalog for
          governance, and any engine on top. BI, ML and AI all read the same tables.
        </p>
        <p>
          The word appeared as early as 2017 and was popularised by Databricks in 2020, but the
          pattern grew up across many companies at once. Today most platforms, cloud warehouses
          included, can read and write open table formats.
        </p>
      </>
    ),
  },
];

export function Story() {
  return (
    <ScrollStory
      sections={SECTIONS}
      renderScene={(i) => {
        const Scene = ERA_SCENES[i];
        return <Scene />;
      }}
      intro={
        <div>
          <p className="text-accent text-xs font-medium tracking-wide uppercase">
            30 years in one scroll
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            How analytics found a home
          </h2>
          <p className="text-muted mt-3 text-[15px]">
            Scroll down. Brewline&apos;s data platform changes with each era. Watch which problem
            each new idea solves, and which new problem it creates.
          </p>
        </div>
      }
    />
  );
}

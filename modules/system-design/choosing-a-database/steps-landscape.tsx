"use client";

import { motion } from "motion/react";
import { StepLayout } from "@/toolkit/layout/step-layout";

/* 5 ─ The landscape -------------------------------------------------------------------------------- */

const ROWS: [string, string, string, string, string][] = [
  [
    "Relational",
    "RDS, Aurora",
    "Cloud SQL, AlloyDB",
    "Azure SQL, Azure Database for PostgreSQL",
    "PostgreSQL, MySQL",
  ],
  [
    "Distributed SQL",
    "Aurora DSQL",
    "Spanner",
    "PostgreSQL elastic clusters (Citus)",
    "CockroachDB, YugabyteDB, TiDB",
  ],
  [
    "Key-value",
    "DynamoDB, ElastiCache",
    "Memorystore, Bigtable",
    "Cosmos DB, Azure Managed Redis",
    "Redis / Valkey, etcd",
  ],
  [
    "Document",
    "DocumentDB, DynamoDB",
    "Firestore",
    "Cosmos DB (NoSQL, MongoDB APIs)",
    "MongoDB, Couchbase",
  ],
  [
    "Wide-column",
    "Keyspaces",
    "Bigtable",
    "Managed Instance for Apache Cassandra",
    "Cassandra, ScyllaDB, HBase",
  ],
  [
    "Graph",
    "Neptune",
    "Spanner Graph",
    "Cosmos DB Gremlin (legacy-leaning), Fabric graph",
    "Neo4j, JanusGraph",
  ],
  [
    "Time-series",
    "Timestream for InfluxDB",
    "Bigtable, BigQuery",
    "Azure Data Explorer",
    "TimescaleDB, InfluxDB 3, Prometheus",
  ],
  [
    "Search",
    "OpenSearch Service",
    "BigQuery search indexes",
    "Azure AI Search",
    "OpenSearch, Elasticsearch",
  ],
  [
    "Vector",
    "S3 Vectors, OpenSearch",
    "AlloyDB / Spanner vectors",
    "Cosmos DB, Azure AI Search",
    "pgvector, Milvus, Qdrant, Weaviate",
  ],
];

const NOTES = [
  "Timescale the company is now Tiger Data (the TimescaleDB extension keeps its name).",
  "Amazon Timestream for LiveAnalytics closed to new customers in June 2025; AWS points to Timestream for InfluxDB.",
  "Spanner Graph became generally available in January 2025; Amazon S3 Vectors in December 2025.",
  "Elasticsearch added an AGPL licence option in 2024; OpenSearch moved to a Linux Foundation foundation the same year.",
  "Redis and Valkey are now separate products; say which you mean.",
  "Azure Cosmos DB for PostgreSQL retires on 31 March 2029; its successor is Azure Database for PostgreSQL elastic clusters. Aurora DSQL has been generally available since May 2025.",
];

export function Landscape() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Databases you'll meet"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full text-[11px]">
              <thead className="bg-surface-2 text-muted text-left">
                <tr>
                  {["Family", "AWS", "Google Cloud", "Azure", "Open source"].map((h) => (
                    <th key={h} className="px-2.5 py-1.5 font-normal whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r, i) => (
                  <motion.tr
                    key={r[0]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-line border-t align-top"
                  >
                    {r.map((c, j) => (
                      <td
                        key={j}
                        className={
                          j === 0
                            ? "px-2.5 py-1.5 font-semibold whitespace-nowrap"
                            : "px-2.5 py-1.5"
                        }
                      >
                        {c}
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="text-muted grid gap-1 text-xs">
            {NOTES.map((n) => (
              <li key={n}>• {n}</li>
            ))}
          </ul>
          <p className="text-subtle text-[10px]">
            For orientation, as of September 2026: check current capabilities before choosing.
          </p>
        </div>
      }
    >
      <p>
        Every cloud offers each family, often under several names. Names change often; the families
        don&apos;t.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Shapes, not brands",
    "Relational, key-value, document, wide-column, graph, time-series, search and vector each fit different questions.",
  ],
  ["Start with the access pattern", "How will you read and write it? The answer picks the family."],
  [
    "Start simple",
    "One well-understood database covers a lot; add specialised stores when a real limit appears.",
  ],
  [
    "Read the fine print",
    "Item sizes, transaction scopes and consistency settings shape your design.",
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
      <p>Next: keeping several databases in step when one business action touches them all.</p>
    </StepLayout>
  );
}

# Sources: Medallion architecture

Fact-checked 2026-09-24. Page text saved in the session scratchpad (`medallion/`).

| Claim in the module                                                                                              | Verdict                                | Source                                                                                                                             |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Bronze raw/appended with source fidelity + metadata; silver cleaned, deduped, validated; gold aggregated         | Verified                               | docs.databricks.com/aws/en/lakehouse/medallion                                                                                     |
| Databricks' name for the pattern (not "coined by"); Fabric recommends it                                         | Nuanced, reworded                      | databricks.com/glossary/medallion-architecture ; learn.microsoft.com/en-us/fabric/onelake/onelake-medallion-lakehouse-architecture |
| Three layers is the simplest form; landing zone; multiple gold layers per domain                                 | Verified                               | Databricks medallion page; deployment guide                                                                                        |
| Lakeflow pipelines (formerly DLT); Spark Declarative Pipelines in Spark 4.1; expectations are Databricks-only    | Verified                               | docs.databricks.com/aws/en/ldp/where-is-dlt ; spark.apache.org declarative pipelines guide                                         |
| `CONSTRAINT … EXPECT … ON VIOLATION DROP ROW / FAIL UPDATE`; warn is the default                                 | Verified                               | docs.databricks.com/aws/en/ldp/expectations                                                                                        |
| Quarantine is a pattern (Databricks: is_quarantined flag + valid/invalid views)                                  | Verified                               | docs.databricks.com/aws/en/ldp/expectation-patterns                                                                                |
| dbt: SELECT models, ref(), 4 built-in generic data tests, unit tests (1.8); dbt v2 (Fusion engine) GA 2026-09-16 | Verified                               | docs.getdbt.com (data-tests, unit-tests, blog/dbt-v2-is-ga)                                                                        |
| Delta replaceWhere; Iceberg overwritePartitions (Iceberg prefers MERGE)                                          | Verified                               | docs.databricks.com/aws/en/delta/selective-overwrite ; iceberg.apache.org/docs/latest/spark-writes/                                |
| Airflow 3: scheduler-managed backfills (UI/API/CLI), datasets → assets, catchup off by default                   | Verified                               | airflow.apache.org release notes; core-concepts/backfill                                                                           |
| Dagster assets, partitions, backfills, asset checks                                                              | Verified ("asset definitions" wording) | docs.dagster.io                                                                                                                    |
| GX Core; Soda Core                                                                                               | Verified                               | docs.greatexpectations.io ; docs.soda.io                                                                                           |

## Decisions

- Backfill numbers and the parser bug are illustrative, stated in the UI; model checked with tsx for all write modes × runs × gold rebuild.

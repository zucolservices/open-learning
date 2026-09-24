# Sources: Serving BI, ML & AI

Fact-checked 2026-09-24. Page text saved in the session scratchpad (`serving/`).

| Claim in the module                                                                                                                                                   | Verdict             | Source                                                                                  |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------- |
| dbt Semantic Layer powered by MetricFlow; MetricFlow Apache 2.0 (Oct 2025); hosted is paid                                                                            | Verified            | getdbt.com blog; docs.getdbt.com sl-faqs                                                |
| Cube, LookML, Databricks metric views, Snowflake semantic views                                                                                                       | Verified            | cube.dev; cloud.google.com/looker; docs.databricks.com/metric-views; docs.snowflake.com |
| OSI → Apache Ossie (incubating, July 2026)                                                                                                                            | Verified (renamed)  | ossie.apache.org                                                                        |
| Power BI Direct Lake reads Delta in OneLake without import (Fabric)                                                                                                   | Verified            | learn.microsoft.com/fabric/fundamentals/direct-lake-overview                            |
| BigQuery BI Engine in-memory cache                                                                                                                                    | Verified            | cloud.google.com/bigquery/docs/bi-engine-intro                                          |
| Point-in-time correctness prevents leakage; Feast PIT joins; SageMaker offline store in S3 (Glue or Iceberg); Google's feature store on BigQuery (now Agent Platform) | Verified            | Databricks feature store docs; docs.feast.dev; AWS SageMaker docs; cloud.google.com     |
| Offline vs online stores; Databricks online store on Lakebase                                                                                                         | Verified            | docs.databricks.com online-feature-store                                                |
| Databricks AI Search (formerly Vector Search), Delta Sync with CDF; BigQuery VECTOR_SEARCH; Cortex Search hybrid; S3 Vectors GA Dec 2025; pgvector; Lance             | Verified (renames)  | respective docs                                                                         |
| Permissions do not follow rows into AI Search (no row filters/masks; filter on metadata)                                                                              | Corrected in module | docs.databricks.com/vector-search                                                       |
| Genie / Cortex Analyst rely on semantic definitions plus curated examples                                                                                             | Nuanced wording     | docs.databricks.com/genie; docs.snowflake.com cortex-analyst                            |
| Reverse ETL: Fivetran Activations (formerly Census), Hightouch                                                                                                        | Verified            | fivetran.com/docs/activations; hightouch.com/docs                                       |
| Lakebase managed Postgres; Snowflake hybrid tables                                                                                                                    | Verified            | docs.databricks.com/oltp; docs.snowflake.com tables-hybrid                              |

## Decisions

- Revenue figures, churn table accuracies and similarity scores are illustrative and labelled as such.

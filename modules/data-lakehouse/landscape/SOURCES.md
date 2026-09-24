# Sources: The open-source & vendor landscape

Fact-checked 2026-09-24. Saved in the session scratchpad (`landscape/`, plus `aws/`, `gcp/`, `azure/` for the cloud columns).

| Claim in the module                                                                                                                          | Verdict                                      | Source                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------- |
| MinIO community edition: console features removed (Jun 2025), source-only (Dec 2025), repo archived (25 Apr 2026); AIStor Free is commercial | Verified (corrected from "maintenance mode") | github.com/minio/minio ; min.io/pricing |
| Ceph RGW, SeaweedFS (Apache-2.0), Garage (AGPLv3), Apache Ozone as alternatives                                                              | Verified                                     | project docs                            |
| Polaris TLP (Feb 2026); Nessie active; Gravitino TLP; Unity Catalog OSS sandbox (LF AI & Data); Lakekeeper Rust Iceberg REST                 | Verified                                     | ASF, GitHub, LF AI & Data               |
| Trino Ranger plugin; Spark via Kyuubi AuthZ                                                                                                  | Verified                                     | trino.io ranger docs ; kyuubi docs      |
| Databricks: Delta native, Iceberg via UniForm/managed Iceberg, UC Iceberg REST read/write, Lakebase GA Feb 2026                              | Verified                                     | docs.databricks.com                     |
| Snowflake: Horizon Iceberg REST read/write; Open Catalog = managed Polaris; Snowpark                                                         | Verified                                     | docs.snowflake.com                      |
| Dremio catalog built on Polaris; reflections                                                                                                 | Verified                                     | docs.dremio.com                         |
| Starburst = Trino company; Galaxy/Enterprise; "Icehouse"                                                                                     | Verified                                     | starburst.io                            |
| Cloudera open data lakehouse on Iceberg                                                                                                      | Verified                                     | cloudera.com                            |
| Onehouse multi-format (Hudi/XTable team); MotherDuck on DuckDB with DuckLake; ClickHouse lake formats                                        | Verified                                     | vendor docs                             |
| Cloud Rosetta rows (names as of Sept 2026)                                                                                                   | Verified                                     | modules 24–26 sources                   |

## Decisions

- Rosetta cells for Databricks/Snowflake CDC and BI are deliberately generic ("Lakeflow Connect", "Partner connectors", "Partner BI tools") where one product name would mislead.

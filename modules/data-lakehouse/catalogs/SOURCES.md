# Sources: Catalogs, the source of truth

Fact-checked 2026-09-24 against the Iceberg REST OpenAPI spec and docs, Hive and Delta docs, AWS, Databricks, Unity Catalog, Polaris, Nessie, Lakekeeper, Gravitino, Google Cloud, Snowflake, Trino and DuckDB docs. Page text saved in the session scratchpad (`catalogs/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| REST endpoints: /v1/config, loadTable (metadata-location, metadata, config, storage-credentials), commit with requirements (assert-table-uuid, assert-ref-snapshot-id) + updates (add-snapshot, set-snapshot-ref); 409 CommitFailedException; optional multi-table /transactions/commit; 5xx = commit state unknown | Verified | apache/iceberg open-api/rest-catalog-open-api.yaml |
| `X-Iceberg-Access-Delegation: vended-credentials` / remote-signing | Verified | same spec |
| Spark REST catalog config (`SparkCatalog`, `type = rest`, `uri`) | Verified | iceberg spark-configuration |
| Trino `iceberg.catalog.type=rest`, `iceberg.rest-catalog.uri` | Verified | trino.io metastores docs |
| DuckDB `ATTACH … (TYPE iceberg, ENDPOINT …)`; `iceberg_scan` of a metadata file; writes since v1.4 | Verified | duckdb.org Iceberg posts and docs |
| Readers pull the latest pointer on their next query; Spark caches catalog metadata 30 s by default | Verified (`cache.expiration-interval-ms` = 30000) | iceberg spark-configuration; REST spec |
| Hive Metastore: Thrift + RDBMS; Iceberg stores `metadata_location` and commits under a lock; Delta stores only the location (log is the truth) | Verified | Hive admin docs; Iceberg HiveTableOperations; docs.delta.io |
| Glue Iceberg REST endpoint for tables in S3 and S3 Tables | Verified | AWS Glue connect-glu-iceberg-rest |
| Unity Catalog open-sourced June 2024; Databricks Iceberg REST read/write for managed Iceberg; catalog-managed Delta commits (Delta 4.x) | Verified (OSS UC still an LF AI sandbox project, v0.6.0) | unitycatalog GitHub; Databricks external-access docs; delta.io blog |
| Apache Polaris TLP (Feb 2026); generic tables without commit coordination; federation; Snowflake Open Catalog = managed Polaris | Verified | polaris.apache.org; Snowflake docs |
| Nessie: catalog-wide branches, multi-table commits, Iceberg REST, active in 2026 | Verified | projectnessie.org; GitHub releases |
| Lakekeeper (Rust Iceberg REST catalog); Gravitino TLP (June 2025), "federated metadata lake" | Verified | GitHub; ASF announcement; gravitino.apache.org |
| Google: BigLake metastore renamed Lakehouse runtime catalog (Apr 2026), Iceberg REST endpoint | Verified | cloud.google.com/bigquery/docs/blms-rest-catalog |
| Snowflake Horizon Catalog serves Snowflake-managed Iceberg tables over Iceberg REST (reads GA Feb 2026, writes GA May 2026) | Verified | Snowflake docs |

## Decisions

- The "three engines" lab is conceptual: versions are simulated, but the connection snippets are real configuration syntax.
- Gravitino is listed as speaking Iceberg REST via its Iceberg REST service; the fact-check verified its federation role rather than that endpoint specifically.
- Access control and credential vending in depth are left to the governance module.

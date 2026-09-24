# Sources: Delta vs Iceberg vs Hudi

Fact-checked 2026-09-24 against the Delta protocol and docs, the Iceberg spec and docs, Hudi docs and source, and vendor documentation (Databricks, AWS, Google Cloud, Microsoft, Snowflake). Page text saved in the session scratchpad (`showdown/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Delta INSERT = Parquet + `_delta_log/<20-digit>.json` with commitInfo + add | Verified | delta-io/delta PROTOCOL.md |
| Delta UPDATE with DVs: `deletion_vector_<uuid>.bin` + remove/add(with DV) + new file for updated rows | Verified (small DVs may be inline in the log instead) | PROTOCOL.md, DV format |
| Delta ADD COLUMN writes only a metaData action; rename/drop need column mapping | Verified | docs.delta.io column mapping |
| Iceberg INSERT: data file, manifest, manifest list, metadata.json, pointer swap | Verified | iceberg.apache.org/spec |
| Iceberg `write.update/delete/merge.mode` default copy-on-write; MoR = v2 position deletes or v3 DV in Puffin; no new position deletes in v3 | Verified | Iceberg configuration docs; spec |
| Iceberg ADD COLUMN: new metadata.json, current snapshot unchanged | Verified | spec §Schema evolution |
| Hudi INSERT creates a new file group base file; timeline files `<req>_<completed>.<action>` | Verified | docs/timeline; docs/table_types |
| Hudi UPDATE: CoW new file slice; MoR log file; `commit` vs `deltacommit` | Verified | docs/table_types |
| Hudi ADD COLUMN via Spark SQL = empty commit with operation ALTER_SCHEMA; `.hoodie/.schema/` only with experimental schema-on-read | Verified | Hudi source (AlterHoodieTableAddColumnsCommand); docs/schema_evolution |
| UniForm: Iceberg metadata for Delta tables; Hudi in preview; needs column mapping; read-only for non-Delta clients; IcebergCompatV2 excludes DVs, IcebergCompatV3 allows them; since Delta 4.3 written atomically with the commit | Verified | docs.delta.io/latest/delta-uniform.html; Databricks UniForm + Iceberg v3 docs; Delta release notes |
| XTable (incubating, formerly OneTable): metadata translation, incremental/full sync, catalog sync; CoW / read-optimized only | Verified | xtable.apache.org features-and-limitations |
| Iceberg v3 DVs use Roaring bitmaps, big-endian "for compatibility with existing deletion vectors in Delta tables" | Verified | Iceberg Puffin spec |
| VARIANT in Delta 4.0, Iceberg v3, Hudi 1.2; row lineage v3 / Delta row tracking | Verified | release notes; spec |
| Databricks agreed to acquire Tabular (4 June 2024); Apache Polaris top-level project (19 Feb 2026); Unity Catalog serves Iceberg REST | Verified | Databricks press release; polaris.apache.org; Databricks docs |
| DuckLake v1.0 (13 Apr 2026), metadata in PostgreSQL/MySQL/SQLite/DuckDB; Paimon 2.0 (7 Aug 2026), LSM, formerly Flink Table Store; Lance "open lakehouse format for multimodal AI" | Verified | ducklake.select; apache/paimon; lance-format/lance |
| Ecosystem: Athena Delta read-only; BigQuery Delta via BigLake + Iceberg managed tables; Fabric Delta-native + metadata virtualization; Snowflake Delta Direct; Databricks managed Iceberg | Verified | vendor docs listed in the check |

## Decisions

- File names are shortened and illustrative; the Puffin file's folder in the Iceberg column is illustrative (the spec doesn't fix a location).
- The "choose a format" advice is framed as a starting point with "what would change the answer", not a ranking. No scores.
- The convergence scene lists overlapping features side by side without claiming who borrowed from whom.
- Redshift write support, and exact Trino/Flink/DuckDB feature coverage, were not verified; the module only claims that those engines support each format in general.

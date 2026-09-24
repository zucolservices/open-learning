# Sources: Schema evolution & enforcement

Fact-checked 2026-09-24 against Hive source and wiki, Spark docs and source, docs.delta.io, docs.databricks.com, iceberg.apache.org and hudi.apache.org. Page text and source files saved in the session scratchpad (`schema/`).

| Claim in the module | Verdict | Source |
| --- | --- | --- |
| Hive and Spark match Parquet columns by name by default, so after a metastore rename old files read NULL (the Monday incident) | Verified (`parquet.column.index.access` = false; Spark field-ID reads off by default) | Hive `DataWritableReadSupport.java`; Spark SQLConf |
| Hive reads ORC by position (`orc.force.positional.evolution` = true in Hive); text/CSV always positional, so drops/reorders shift values | Verified (Spark's native ORC reader matches by name, so engines can disagree) | HiveConf.java; orc.apache.org config docs |
| Hive `CHANGE COLUMN` changes metadata only, never data | Verified | Hive LanguageManual DDL |
| Delta enforcement: unknown columns rejected, missing columns → null, unsafe casts (string→int) fail; whole write fails | Verified (safe casts such as int→bigint allowed under ANSI store assignment) | docs.delta.io/delta-batch; Databricks schema-enforcement; Spark ANSI docs |
| `mergeSchema` / autoMerge add new columns | Verified | Databricks update-schema; SchemaMergingUtils.scala |
| Column mapping (`delta.columnMapping.mode = 'name'`) needed for RENAME and DROP; DROP is metadata-only, bytes remain until rewrite | Verified | docs.delta.io/delta-column-mapping |
| Delta type widening (`delta.enableTypeWidening`, out of preview in 4.0): int→long, float→double, decimal increases, date→timestamp_ntz, no rewrite | Verified | docs.delta.io/delta-type-widening; Delta 4.0 release notes |
| Iceberg: renames/drops/reorders metadata-only by ID; promotions int→long, float→double, decimal precision; v3 date→timestamp; nested fields have IDs | Verified | iceberg.apache.org/spec; spark-ddl |
| Hudi: new nullable columns added automatically on write; widening allowed, narrowing never; rename/drop/reorder need experimental schema-on-read (drop also via an explicit allow setting) | Verified | hudi.apache.org/docs/schema_evolution, configurations |
| VARIANT in Delta 4.0 (GA), Iceberg v3, Hudi 1.2; shredding stores common fields as columns | Verified (Delta shredding was preview in 4.0, production feature from 4.3) | Delta releases; Iceberg spec; Hudi 1.2 release notes |

## Decisions

- The incident uses a Hive-style Parquet table because that is where the rename-returns-NULL failure is verified default behaviour.
- The change menu simplifies Hive to one column; its cells name the file format (Parquet by name, ORC/CSV by position) where the behaviour differs.
- VARIANT query syntax is shown in Databricks/Spark style and labelled as engine-specific.
- The planned separate "Letting the schema grow" step was merged into the front-desk step as a checkbox; the storyboard notes this.

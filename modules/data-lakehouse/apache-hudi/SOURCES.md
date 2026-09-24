# Sources: Apache Hudi, the timeline

Fact-checked 2026-09-24 against hudi.apache.org (docs at 1.2.0), ASF announcements and the Uber engineering blog. Saved page text used for spot checks lives in the session scratchpad (`hudi/`).

| Claim in the module                                                                                                                                                            | Verdict                                           | Source                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------- |
| Built at Uber in 2016 ("Hoodie"), open-sourced 2017, Incubator Jan 2019, top-level project June 2020; Hadoop Upserts Deletes and Incrementals                                  | Verified                                          | news.apache.org TLP announcement; uber.com/blog/apache-hudi |
| Timeline under `.hoodie/timeline/`; instants = action + requested time + state (requested → inflight → completed); completed file named `<requested>_<completed>.<action>`     | Verified (1.x)                                    | docs/timeline                                               |
| Readers ignore incomplete writes; failed writes are rolled back                                                                                                                | Verified                                          | docs/rollbacks                                              |
| Compaction completes as a `commit`; clustering completes as `replacecommit`                                                                                                    | Verified                                          | docs/timeline (Action Types)                                |
| Meta columns `_hoodie_commit_time`, `_commit_seqno`, `_record_key`, `_partition_path`, `_file_name` (+ `_hoodie_operation` on Flink); disabling them loses incremental queries | Verified                                          | learn/tech-specs; docs/configurations                       |
| File groups → file slices → base file + log files                                                                                                                              | Verified (base can also be ORC/HFile/Lance)       | docs/storage_layouts                                        |
| Index types Simple, Bloom, Bucket (incl. consistent hashing, MoR only), `RECORD_LEVEL_INDEX` (1.1+); **Spark default is SIMPLE**, Flink uses Flink state                       | Verified after correction (default was not Bloom) | docs/indexes                                                |
| CoW rewrites base files; MoR appends logs, compaction (async by default, `hoodie.compact.inline`)                                                                              | Verified                                          | docs/table_types; docs/compaction                           |
| Query types: snapshot, read_optimized, incremental (`hoodie.datasource.read.begin.instanttime`, completion time in 1.x), time travel `as.of.instant`, CDC                      | Verified                                          | docs/configurations; docs/sql_queries                       |
| Cleaning KEEP_LATEST_COMMITS, `hoodie.clean.commits.retained` default 10; savepoints; archiving `hoodie.keep.max.commits` default 30                                           | Verified                                          | docs/cleaning; docs/configurations                          |
| Metadata table partitions: files, column_stats, partition_stats, bloom_filters, record_index, secondary/expression indexes                                                     | Verified                                          | docs/metadata                                               |
| Concurrency: single writer + async services; OCC with lock providers (storage-based, ZooKeeper, DynamoDB, HMS); NBCC for MoR + bucket index                                    | Verified                                          | docs/concurrency_control                                    |
| Hudi 1.0 released Dec 2024; latest 1.2.0 (May 2026)                                                                                                                            | Verified                                          | releases page; GitHub releases                              |
| Ecosystem: Spark, Flink, Trino, Presto, Hive, StarRocks, Doris, AWS EMR/Glue/Athena/Redshift, Onehouse; Apache XTable (incubating)                                             | Verified                                          | hudi.apache.org/ecosystem; xtable.apache.org                |

## Decisions

- Simulation sizes (120 MB base, ~1 MB log) are illustrative and labelled as such.
- Incremental query highlighting shows whole affected file groups; the precise mechanism (commit metadata + `_hoodie_commit_time` filtering) is described in text rather than drawn.
- Inserts are shown going to an existing small file group (small-file handling); the exact MoR insert path depends on index type and is left out at this level.
- Ordering fields (formerly precombine) and merge modes are not taught here; they belong in _CDC, MERGE & slowly changing dimensions_.
- "Uber had this problem in 2016" is kept qualitative; no latency figures are quoted.

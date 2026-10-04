# Sources: Where to test in a pipeline (fact-checked 2026-10-04)

- M. Ufford, "Whoops, the Numbers are Wrong! Scaling Data Quality @ Netflix", 2017 slides (Write - Audit - Publish).
- Apache Iceberg docs (branching and tagging since 1.2.0, March 2023; `write.wap.enabled`, `spark.wap.branch`; `fast_forward`).
- Project Nessie docs; lakeFS docs and licence change to BSL 1.1 at v1.87.0 (22 Sep 2026); Delta Lake SHALLOW CLONE docs.
- dbt docs: sources (test assumptions, freshness); `dbt build` skipping downstream nodes.

The pipeline, checks and scenarios are made up; SQL is simplified.

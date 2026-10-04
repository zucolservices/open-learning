# Sources: Failing well (fact-checked 2026-10-04)

- dbt docs: test configs (`severity` default error, `warn_if`/`error_if`, `store_failures` audit tables); `dbt build` skipping downstream nodes.
- Databricks docs: pipeline expectations (`expect`, `expect_or_drop`, `expect_or_fail`); quarantine pattern; Lakeflow pipelines naming (formerly Delta Live Tables, renamed Lakeflow Declarative Pipelines June 2025; built on Apache Spark Declarative Pipelines, Spark 4.1).
- AWS Glue Data Quality docs (row-level results; failing jobs optional).
- Apache Kafka KIP-298 / Kafka Connect docs (dead letter queues for sink connectors since 2.0).
- S. Uttamchandani (Intuit), circuit breakers for data pipelines, 8 Oct 2018; M. Fowler on the circuit breaker pattern (Nygard, Release It!); Airbnb Wall framework, Aug 2021.

The night's load and its outcomes are made up; code is simplified.

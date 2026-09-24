# Sources: Lakehouse on AWS

Fact-checked 2026-09-24 against AWS docs, What's New posts and the AWS Price List API (us-east-1 files published 2026-09-11; S3 2026-09-18). Saved in the session scratchpad (`aws/`).

| Claim in the module                                                                                                                                                              | Verdict            | Source                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| S3 Tables: managed Iceberg, automatic compaction, snapshot management, unreferenced file removal; appear in Glue as s3tablescatalog; IAM by default, Lake Formation optional     | Verified (updated) | docs.aws.amazon.com/AmazonS3/latest/userguide/s3-tables-integrating-aws.html               |
| Glue Data Catalog Hive + Iceberg REST; Glue ETL per DPU-hour ($0.308 Glue 6, $0.44 older)                                                                                        | Verified           | docs.aws.amazon.com/glue ; AWSGlue price list                                              |
| Lake Formation row/column/cell, LF-Tags, credential vending                                                                                                                      | Verified           | docs.aws.amazon.com/lake-formation                                                         |
| "Lakehouse architecture of Amazon SageMaker", SageMaker Unified Studio built on DataZone                                                                                         | Verified (renamed) | docs.aws.amazon.com/sagemaker-lakehouse-architecture ; sagemaker-unified-studio adminguide |
| EMR Serverless: Spark and Hive only                                                                                                                                              | Verified           | EMR Serverless user guide                                                                  |
| Redshift writes Iceberg since Nov 2025; MERGE etc. Apr 2026                                                                                                                      | Verified           | AWS What's New 2025/11, 2026/04                                                            |
| Amazon Data Firehose (formerly Kinesis Data Firehose) into Iceberg incl. S3 Tables                                                                                               | Verified           | AWS What's New 2024/02 ; Firehose dev guide                                                |
| Amazon Quick Sight, part of Amazon Quick (formerly QuickSight)                                                                                                                   | Corrected          | docs.aws.amazon.com/quick                                                                  |
| MWAA on Airflow 3                                                                                                                                                                | Verified           | AWS What's New 2026/09                                                                     |
| Prices: S3 $0.023; S3 Tables $0.0265 + $0.025/1k objects monitored + compaction $0.005/GB & $0.002/1k objects; Athena $5/TB; Firehose→Iceberg $0.075/GB; dms.t3.medium $0.0745/h | Verified           | AWS Price List API                                                                         |

## Decisions

- The estimator is illustrative: assumptions (objects per GB, compaction workload, always-on DMS) are shown in the UI; requests, transfer, BI licences and free tiers are ignored.

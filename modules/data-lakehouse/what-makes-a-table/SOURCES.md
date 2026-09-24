# Fact check: What makes a table a table

Checked 2026-09-24 against primary sources.

| Claim                                                                                                                    | Source                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Hive table = metastore entry (name, schema, location, partitions) + files in the directory; partitions registered in HMS | https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DDL                                                            |
| New partitions added outside Hive need ALTER TABLE ADD PARTITION / MSCK REPAIR                                           | same                                                                                                                           |
| Listing cost: Iceberg docs (O(n) listing calls); Delta paper (LIST 1,000 keys per call, tens–hundreds of ms each)        | https://iceberg.apache.org/docs/latest/reliability/ ; https://www.vldb.org/pvldb/vol13/p3411-armbrust.pdf                      |
| No atomicity across objects, partial writes visible, no isolation between queries                                        | Delta Lake VLDB 2020 §1, §2.2                                                                                                  |
| "Around half the support escalations" (2014–2016) from cloud-storage data problems                                       | Delta Lake VLDB 2020                                                                                                           |
| Iceberg designed to solve correctness problems of Hive tables in S3; state split between metastore and file system       | https://iceberg.apache.org/docs/latest/reliability/                                                                            |
| Hive ACID: ORC only, Hive-specific constraints                                                                           | https://cwiki.apache.org/confluence/display/Hive/Hive+Transactions                                                             |
| INSERT OVERWRITE semantics; optional Hive locking only among Hive clients                                                | https://cwiki.apache.org/confluence/display/Hive/LanguageManual+DML ; https://cwiki.apache.org/confluence/display/Hive/Locking |
| _SUCCESS marker from Hadoop FileOutputCommitter; Spark ignores _-prefixed files                                          | Hadoop FileOutputCommitter source; https://spark.apache.org/docs/latest/sql-data-sources-parquet.html                          |
| Hive schema changes modify metadata only; files are not validated                                                        | LanguageManual DDL/DML                                                                                                         |

## Editorial decisions

- Incident timelines and ₹ values are illustrative; the failure modes are the documented ones.
- Eventual consistency (fixed on major clouds by 2021) is not used as a current problem.

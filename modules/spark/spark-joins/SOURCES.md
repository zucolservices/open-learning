# Sources: Join strategies (fact-checked 2026-10-04)

- Spark 4.2 SQL Performance Tuning: `spark.sql.autoBroadcastJoinThreshold` (10 MB; -1 disables), `spark.sql.broadcastTimeout` (300 s), join strategy hints and their priority, "no guarantee".
- Spark 4.2 SQL reference, Hints: BROADCAST / MERGE / SHUFFLE_HASH / SHUFFLE_REPLICATE_NL; only BROADCAST before 3.0.
- Spark source, SQLConf.scala (branch-4.0): internal `spark.sql.join.preferSortMergeJoin` default true and its description (sort-merge uses less memory; shuffled hash can be faster when one side is much smaller).

Table sizes, executor count and the strategy rules in the simulation are illustrative and simplified.

# Sources: The Catalyst optimiser (fact-checked 2026-10-04)

- M. Armbrust et al., "Spark SQL: Relational Data Processing in Spark", SIGMOD 2015 (four phases; rule-based logical optimisation including constant folding, predicate pushdown, projection pruning); Databricks blog "Deep Dive into Spark SQL's Catalyst Optimizer", 13 April 2015.
- Spark 4.2 docs: EXPLAIN syntax (EXTENDED, CODEGEN, COST, FORMATTED); PySpark DataFrame.explain modes; configuration (spark.sql.cbo.enabled false); SQL performance tuning (statistics via ANALYZE TABLE).
- Spark source: Optimizer.scala rule names ColumnPruning and PushDownPredicates.

Plans are simplified; table sizes in the rules simulation are illustrative.

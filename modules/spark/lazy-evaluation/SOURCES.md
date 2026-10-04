# Sources: Transformations, actions and laziness (fact-checked 2026-10-04)

- Spark 4.2 docs, RDD programming guide (transformations and actions; "All transformations in Spark are lazy…"; collect vs take).
- M. Zaharia et al., "Resilient Distributed Datasets", NSDI 2012 (narrow and wide dependencies; stage boundaries at shuffles; lazy computation for pipelining).
- Spark DAGScheduler source documentation (stages broken at shuffle boundaries); Cluster Mode Overview glossary.

The plan builder's stage and task counts are illustrative.

# Sources: Join algorithms (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Planner/Optimizer §51.5.1 (nested loop, merge join, hash join quotes; plans grow exponentially) and GEQO (geqo_threshold 12).
- PostgreSQL docs, Resource Consumption (work_mem default 4MB; hash_mem_multiplier 2.0; "temporary disk files"; "many times the value of work_mem") and join_collapse_limit / from_collapse_limit (default eight).
- Microsoft Learn, Joins (Nested Loops, Merge, Hash, Adaptive joins 2017+; nested loops "particularly effective if the outer input is small and the inner input is preindexed and large").
- MySQL 8.0.18 and 8.0.20 release notes (hash join; block nested loop removed).

Work estimates in the simulation are illustrative, not real cost-model output.

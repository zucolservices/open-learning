# Sources: Capstone, the slow nightly job (fact-checked 2026-10-04)

- A. Ching, S. Kedia, S. Wang, "Apache Spark @Scale: A 60 TB+ production use case", Engineering at Meta, 31 Aug 2016 (three of ten hours moving ~100 MB output files; 70,000 tasks).
- M. Shen et al., "Magnet: A scalable and performant shuffle architecture for Apache Spark", LinkedIn Engineering, 21 Oct 2020 (10–20% of compute idle on shuffle fetch).
- W. Fan, H. van Hövell, M. Xue, "Adaptive Query Execution: Speeding Up Spark SQL at Runtime", Databricks blog, 29 May 2020 (partition-count dilemma; skew joins).
- V. Soni, S. Thallam, S. Pande, "Spark Analysers: Catching Anti-Patterns In Spark Apps", Uber Engineering, 1 June 2023 (excessive partition scan; duplicate plans; ~100K apps a day).
- Spark 4.2 Web UI docs and source (the "SQL / DataFrame" tab; Spill (Memory) / Spill (Disk); summary metrics); SQL Performance Tuning (AQE defaults, skew thresholds).

The retailer, its job, evidence, timings and savings are illustrative.

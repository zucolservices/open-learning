# Storyboard: Capstone, the slow nightly job

1. **The brief** (story): a nightly job four hours over its deadline.
2. **Find and fix** ⭐ (fix the problem): five problems with Spark UI evidence (partition scan, recomputation, skew with AQE turned off, spill, small files); choosing fixes shrinks the runtime bar.
3. **It happens for real** (explore): Meta, LinkedIn, Databricks, Uber.
4. **A diagnosis routine** (checkpoint `spark-routine`, order).
5. **The whole track** (wrap).

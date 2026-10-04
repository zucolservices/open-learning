# Sources: Cost and right-sizing (fact-checked 2026-10-04)

- Spark 4.2 Configuration and Job Scheduling docs: dynamic allocation (off by default; 60 s idle timeout; 1 s backlog timeout; requires shuffle tracking, an external shuffle service or decommissioning); `shuffleTracking.enabled` default true; no external shuffle service on Kubernetes; decommissioning configs (since 3.1).
- Spark core migration guide (shuffle tracking by default since 3.4; block decommissioning since 3.4).
- Cloudera, "How-to: Tune Your Apache Spark Jobs (Part 2)", 30 March 2015 (five cores per executor, 64 GB upper limit; marked historical in 2021).
- AWS EMR management guide and EMR best practices (Spot for task nodes, not primary/core); EC2 two-minute interruption notice.
- Google Cloud, Managed Service for Apache Spark secondary workers (spot and preemptible VMs, no data stored).

The job, prices, spot discount and interruption costs in the simulation are illustrative.

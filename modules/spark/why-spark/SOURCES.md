# Sources: Why Spark exists (fact-checked 2026-10-04)

- J. Dean and S. Ghemawat, "MapReduce: Simplified Data Processing on Large Clusters", OSDI 2004.
- M. Zaharia et al., "Spark: Cluster Computing with Working Sets", HotCloud 2010 (10× on iterative ML; "each job must reload the data from disk").
- M. Zaharia et al., "Resilient Distributed Datasets", NSDI 2012, Best Paper (up to 20× for iterative applications; reuse between MapReduce jobs requires stable storage).
- spark.apache.org history and news (AMPLab 2009; open-sourced 2010; Apache Incubator June 2013; top-level February 2014; Spark 4.0 May 2025; 4.2.0 July 2026); Apache Incubator status page.
- Databricks blog, R. Xin, 5 Nov 2014 (GraySort: 100 TB in 23 min on 206 machines, on disk, tied with UCSD); sortbenchmark.org.

The disk-trip timings are illustrative.

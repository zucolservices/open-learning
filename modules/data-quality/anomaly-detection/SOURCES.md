# Sources: Anomaly detection (fact-checked 2026-10-04)

- Elementary docs: anomaly tests (`anomaly_sensitivity` default 3; training period; `seasonality: day_of_week`).
- NIST/SEMATECH e-Handbook of Statistical Methods: outliers, IQR fences, modified z-score.
- R. B. Cleveland, W. S. Cleveland, J. E. McRae, I. Terpenning, "STL: A Seasonal-Trend Decomposition Procedure Based on Loess", Journal of Official Statistics, 1990.
- S. J. Taylor & B. Letham, "Forecasting at Scale", The American Statistician, 2018; Prophet released by Facebook, Feb 2017.
- AWS Glue Data Quality anomaly detection (preview Nov 2023, GA Aug 2024; at least 3 data points; excluding anomalies); Databricks data quality monitoring (Public Preview); Soda docs ("an anomaly is a signal").
- Google, Site Reliability Engineering (2016), "Monitoring Distributed Systems": every page should be actionable; alarm fatigue literature (AHRQ PSNet).

The eight weeks of row counts are illustrative.

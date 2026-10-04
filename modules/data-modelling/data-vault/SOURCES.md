# Sources: Data Vault (fact-checked 2026-10-04)

- D. Linstedt, "Data Vault Series 2 – Data Vault Components", TDAN, 1 Jan 2003 (hubs as lists of business keys; links as the glue between keys; satellites keyed by hub key plus load date).
- D. Linstedt and M. Olschimke, Building a Scalable Data Warehouse with Data Vault 2.0, Morgan Kaufmann, 15 Sep 2015 (Elsevier: invented by Linstedt at the US Department of Defense).
- Wikipedia, "Data vault modeling" (conceived in the 1990s, published 2000; DV 2.0 in 2013; satellites append-only; load date and record source on every row).
- Scalefree, "Hash Keys in the Data Vault" (sequence dependencies in DV 1.0; parallel loading with hash keys; hash diff).
- Databricks glossary, "Data Vault" (hubs, links, satellites; vault in Silver, marts in Gold). Data Vault Alliance site (Data Vault 2.1).

Customers, orders and the load plan are made up; the short keys are not a real hash function.

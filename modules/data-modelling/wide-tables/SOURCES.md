# Sources: One big table (fact-checked 2026-10-04)

- M. Stonebraker et al., "C-Store: A Column-oriented DBMS", VLDB 2005 (read only the columns a query needs; earlier column products noted).
- M. Kaminsky, "Star Schema vs. OBT for Data Warehouse Performance", Fivetran blog, 16 Aug 2022 (TPC-DS; OBT 25–50% faster on Redshift, Snowflake, BigQuery; storage caveats).
- Google Cloud, BigQuery docs: "Use nested and repeated fields" and "Specify nested and repeated columns" (denormalise with STRUCT/ARRAY; star schemas may perform about the same).

Sizes, compression and row counts in the simulation are illustrative.

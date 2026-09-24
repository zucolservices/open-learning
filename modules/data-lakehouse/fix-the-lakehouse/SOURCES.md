# Sources: The slow, expensive lakehouse (capstone)

An applied module: every diagnosis and fix restates a fact verified in an earlier module (see their SOURCES.md):

- Small files, compaction, snapshot expiry, orphan files: `table-maintenance`, `ingestion`
- Functions on filter columns defeat pushdown; files read in plans: `query-engines`
- Clustering and min/max skipping: `data-skipping`
- Append vs MERGE/overwrite, retries: `medallion`, `cdc-and-merge`
- Scan-based costs: `on-aws`, `on-gcp`

Decisions: all metrics and dollar figures are illustrative (model.ts) and labelled as such in the UI.

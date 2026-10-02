# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m15-facts.md` (raw pages in `cicd/m15/`).

- Danilo Sato, bliki "ParallelChange" (13 May 2014): "breaking the change into three distinct phases: expand, migrate, and contract"; "it allows your code to be released in any of these three phases."
- GitLab development docs, avoiding downtime in migrations: "Renaming columns the standard way requires downtime".
- strong_migrations (Rails): safe rename steps (create, write both, backfill, move reads, stop writing, drop); batched backfills; short lock timeouts.
- PostgreSQL 18 docs: most ALTER TABLE forms take ACCESS EXCLUSIVE; ADD COLUMN with no default (or a constant default since PG 11) avoids a table rewrite; `lock_timeout`; CREATE INDEX CONCURRENTLY.
- GoCardless, "Zero-downtime Postgres migrations - the hard parts": about 15 seconds of API downtime from a lock queue during a planned migration.
- GitHub availability report, November 2021: 27 Nov 2021, 2 h 50 min, the final rename step of a schema migration on a large MySQL table led to a semaphore deadlock on read replicas.
- Redgate Flyway docs: keep "backwards compatibility between the DB and all versions of the code currently deployed"; `flyway_schema_history`; undo needs the Teams edition. Liquibase uses FSL from 5.0 (Sept 2025). gh-ost, pt-online-schema-change; Squawk, Atlas lint.
- Kubernetes Jobs: a Job's pod "may sometimes be started twice".
- The orders table, versions and lock-queue numbers are illustrative.

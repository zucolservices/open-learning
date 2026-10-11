# Sources: Schema migrations (fact-checked 2026-10-12)

- Danilo Sato, "ParallelChange" (martinfowler.com, 13 May 2014): expand → migrate → contract.
- PostgreSQL docs: PG 11 fast ADD COLUMN with constant default; CREATE INDEX CONCURRENTLY (not in a transaction; INVALID on failure); lock_timeout; PG 18 NOT NULL … NOT VALID.
- Tools: Flyway 13 (Teams closed to new customers May 2025), Liquibase 5.0 FSL (Sep 2025), Alembic, Rails, Django, EF Core 10, Prisma 7 (Prisma 8 RC changes migrate), Atlas (EULA binaries).

The service and error counts are made up/illustrative. Notes: scratchpad `sd/backend/m09-facts.md`.

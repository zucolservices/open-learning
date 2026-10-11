# Sources: Transactions in your code (fact-checked 2026-10-12)

- PostgreSQL 18 docs (Read Committed default; serialization failures must be retried; SELECT … FOR UPDATE). MySQL 8.4 (InnoDB Repeatable Read default). SQL Server docs (Read Committed; RCSI on by default in Azure SQL Database).
- Jakarta Persistence @Version; EF Core concurrency tokens.
- Stripe idempotent requests (Idempotency-Key, ≤255 chars, ≥24 h, replays saved response incl. 500s). IETF draft-ietf-httpapi-idempotency-key-header -07, expired Apr 2026.

Asha, Ravi and the café are made up. Notes: scratchpad `sd/backend/m10-facts.md`.

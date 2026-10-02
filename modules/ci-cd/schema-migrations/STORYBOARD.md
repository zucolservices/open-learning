# Database changes without downtime (CI/CD, module 15)

1. **Rename a column, live** ⭐ (step-through): all at once (old pods break, rollback fails) vs expand and contract across five releases; pods, columns, rollback safety, SQL.
2. **The lock queue** (simulation): a slow query, an ALTER and the queue behind it; lock_timeout; GoCardless.
3. **Migrations in the pipeline** (practice): versioned tools, run once, backward compatible, linting, online DDL; GitHub 2021.
4. **Put the steps in order** (order checkpoint).
5. **Wrap**.

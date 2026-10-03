# Sources: Capstone, the slow database (fact-checked 2026-10-04)

- D. Cramer, "Transaction ID Wraparound in Postgres", Sentry blog, 23 July 2015 (outage of 20 July 2015).
- Mailchimp, "What we learned from the recent Mandrill outage" (February 2019; XID limit hit at 05:35 UTC, 4 February).
- GitHub Availability Report: March 2021 (12 March incident: reversed index order, full table scan; MySQL).
- PostgreSQL 18 docs: pg_stat_statements (shared_preload_libraries); auto_explain; idle_in_transaction_session_timeout (default 0); Routine Vacuuming (wraparound warnings).

The payments system, its evidence and all metrics are fictional and illustrative.

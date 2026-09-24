# Storyboard: Governance, security & privacy

Track: Modern Data Lakehouse · Chapter 5 · Module 17 (closes the chapter) · ~30 min · level: core

## What must the learner understand?

1. One governed table serves many roles through grants, row filters and column masks enforced at query time.
2. Those policies protect only access paths through the catalog and trusted engines; direct storage access bypasses them, hence locked-down buckets and credential vending.
3. Personal data spreads (raw copies, derived tables, exports, old versions, streams); erasure is a search-then-plan problem on immutable storage.
4. Law in brief (DPDP, GDPR) without overstating it: erasure unless law requires retention; DPDP duties from 13 May 2027; pseudonymised ≠ anonymous.

## Steps

| #   | Step                            | Interaction                                                    | Gate   |
| --- | ------------------------------- | -------------------------------------------------------------- | ------ |
| 1   | One table, four people          | Switch roles; rows/columns filtered and masked                 |        |
| 2   | Where one person's data goes ⭐ | **Scroll story**: sign-up → bronze → silver → gold → copies    |        |
| 3   | The side door                   | Direct bucket keys vs catalog-vended access                    |        |
| 4   | Checkpoint                      | Row filter vs DuckDB reading files directly                    | choice |
| 5   | Controls and plumbing           | Per-platform access control; encryption, audit, lineage        |        |
| 6   | Privacy law, in brief           | DPDP and GDPR essentials, with a not-legal-advice note         |        |
| 7   | Priya's erasure request ⭐      | **Fix the problem**: sort places that still hold her data      | sort   |
| 8   | The erasure plan                | Delete, rewrite, retention, clean-up, derived data, what stays |        |
| 9   | Checkpoint                      | Personal or anonymous?                                         | sort   |
| 10  | Takeaways                       |                                                                |        |

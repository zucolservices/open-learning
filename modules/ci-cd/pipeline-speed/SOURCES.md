# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m06-facts.md` (raw pages in `cicd/m06/`).

- Martin Fowler, "Continuous Integration" (revised 18 Jan 2024): "The whole point of Continuous Integration is to provide rapid feedback"; "the XP guideline of a ten minute build".
- DORA, "Test automation": developers "should be able to get feedback from automated tests in less than ten minutes both on local workstations and from the continuous integration system"; faster unit tests run before slower ones.
- Google research on build latency (Jaspan & Green, 2023): no single threshold; every minute matters; predictability matters.
- Sharding and change detection: Jest and Playwright `--shard`, GitLab `parallel` with `CI_NODE_INDEX`/`CI_NODE_TOTAL`, CircleCI timing-based splitting, GitHub `paths` filters, GitLab `rules:changes`, `nx affected`, `turbo run --affected` (Turborepo 2.1, Aug 2024). GitHub matrix `fail-fast` defaults to true (matrix jobs only).
- Shopify Engineering (Feb 2021): main app CI p95 cut from 45 to 18 minutes; the under-10-minute target was not reached.
- Machalica et al., "Predictive Test Selection" (Meta, ICSE-SEIP 2019): over 95% of individual test failures and over 99.9% of faulty changes still reported at half the testing cost.
- The pipeline, its jobs, start-up costs and all minutes in the simulations are illustrative.

# Sources: Tests in CI (fact-checked 2026-10-11)

- Martin Fowler, "Continuous Integration" (first 2000, revised 2006, rewritten Jan 2024).
- DORA: five software delivery metrics (rework rate added 2024; "failed deployment recovery time" since 2023); capability "Test automation"; _Accelerate_ findings are correlational; developer-owned tests correlate, QA/outsourced-owned do not. DORA 2025 replaced performance clusters with team archetypes.
- Machalica et al., "Predictive Test Selection" (Facebook; ICSE-SEIP 2019): halved testing infrastructure cost, >95% of individual failures and >99.9% of faulty changes still caught. Launchable acquired by CloudBees (Aug 2024), now CloudBees Smart Tests.
- Jest `--shard` (v28, Apr 2022); Playwright `--shard`; pytest-xdist (single machine), pytest-split/pytest-shard for CI machines. GitHub merge queue GA (12 Jul 2023); GitLab merge trains (Premium+).

Full notes: scratchpad `sd/testing/m20-facts.md`. The pipeline and its stage times are made up and illustrative.

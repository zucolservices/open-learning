# Sources: Freshness, SLAs and SLOs (fact-checked 2026-10-04)

- Google, Site Reliability Engineering (2016), ch. 4 "Service Level Objectives": SLI, SLO, SLA definitions; "what happens if the SLOs aren't met?".
- Google, The Site Reliability Workbook (2018): "Implementing SLOs" and "Data Processing Pipelines" (freshness, correctness, coverage; three freshness formats; end-to-end measurement; error budgets; Spotify case).
- dbt docs: source freshness (`warn_after`, `error_after`, `loaded_at_field`; `freshness` under `config` since v1.10, backported to 1.9; metadata-based freshness since v1.7).

The month of ready times is illustrative.

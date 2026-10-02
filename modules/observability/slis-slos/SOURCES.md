# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m13-facts.md` (raw pages in `obs/m13/`).

- Google, _Site Reliability Engineering_, ch. 4: SLI "a carefully defined quantitative measure of some aspect of the level of service that is provided"; SLO "a target value or range of values for a service level that is measured by an SLI"; SLA "an explicit or implicit contract with your users that includes consequences of meeting (or missing) the SLOs they contain."
- _Site Reliability Engineering_, ch. 1: "100% is the wrong reliability target for basically everything (pacemakers and anti-lock brakes being notable exceptions)"; "no user can tell the difference between a system being 100% available and 99.999% available."
- _The Site Reliability Workbook_, ch. 2: an SLI is "the number of good events divided by the total number of events"; SLI types; a four-week rolling window recommended.
- SRE book Appendix A, availability table (30-day month, 365-day year): 99.9% = 43.2 minutes per 30 days, 8.76 hours per year; 99.999% = 25.9 seconds per 30 days.
- Amazon EC2 SLA: 99.99% region-level, credits of 10% / 30% / 100% below 99.99% / 99.0% / 95.0%.
- OpenSLO specification; Sloth; Pyrra; Google Cloud Service Monitoring; Datadog, Grafana SLO, Nobl9.
- The pizza shop and the checkout indicator candidates are illustrative.

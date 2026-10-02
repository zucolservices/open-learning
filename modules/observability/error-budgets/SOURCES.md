# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m14-facts.md` (raw pages in `obs/m13/`).

- Google, _Site Reliability Engineering_, ch. 3: the error budget "provides a clear, objective metric that determines how unreliable the service is allowed to be within a single quarter." Ch. 1: "The use of an error budget resolves the structural conflict of incentives between development and SRE."
- _The Site Reliability Workbook_, Appendix B, example error budget policy: "halt all changes and releases other than P0 issues or security fixes until the service is back within its SLO"; a postmortem when a single incident consumes more than 20% of the error budget over four weeks; "not intended to serve as a punishment". Ch. 2 example: 3 million requests at 99.9% over four weeks allows 3,000 errors.
- Workbook ch. 5, "Alerting on SLOs": burn rate is "how fast, relative to the SLO, the service consumes the error budget"; 14.4× for 1 hour = 2%, 6× for 6 hours = 5%, 1× for 3 days = 10% of a 30-day budget; 1,000× empties it in 43 minutes.
- GitLab handbook: 99.95% over 28 days (about 20 minutes), shared between stage and infrastructure teams.
- The incidents and their error counts are illustrative.

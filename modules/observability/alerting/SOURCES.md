# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m15-facts.md` (raw pages in `obs/m15/`).

- _The Site Reliability Workbook_, ch. 5 "Alerting on SLOs": precision, recall, detection time, reset time (definitions quoted); six approaches ending with multiwindow, multi-burn-rate alerts; recommended parameters for a 99.9% SLO: page at 14.4× over 1 h (short window 5 min), page at 6× over 6 h (30 min), ticket at 1× over 3 days (6 h); low-traffic caveat.
- Google, _Site Reliability Engineering_, ch. 6: "Every time the pager goes off, I should be able to react with a sense of urgency. I can only react with a sense of urgency a few times a day before I become fatigued." "Every page should be actionable." Ch. 11: an incident takes about 6 hours, so "the maximum number of incidents per day is 2 per 12-hour on-call shift"; alert fatigue quote.
- Rob Ewaschuk, "My Philosophy on Alerting" (c. 2014): "Pages should be urgent, important, actionable, and real."
- Prometheus Alertmanager docs: grouping, routing, inhibition, silences. Prometheus alerting rules: `for` (pending) and `keep_firing_for`.
- The week of error rates, its incidents and the page counts are illustrative.

# Sources (fact-checked 2026-09)

- Google SRE book, "Service Level Objectives" (SLI, SLO, SLA definitions), "Embracing Risk" (error budgets), "Monitoring Distributed Systems" (four golden signals).
- Google SRE Workbook, "Alerting on SLOs": multi-window, multi-burn-rate alerts for a 99.9% SLO: 2% of budget in 1 h (burn 14.4, 5 min short window) page; 5% in 6 h (burn 6, 30 min) page; 10% in 3 days (burn 1, 6 h) ticket.
- B. Gregg, the USE method; T. Wilkie, the RED method (Grafana blog, 2018).
- W3C Trace Context (Recommendation, 23 Nov 2021): traceparent = version-traceid(32 hex)-parentid(16 hex)-flags. Level 2 is a Candidate Recommendation Draft.
- OpenTelemetry: CNCF graduation 11 May 2026. Prometheus: CNCF graduated 2018, v3.x. Jaeger v2 built on the OpenTelemetry Collector (v1 end of life 31 Dec 2025).
- AWS X-Ray SDKs and daemon: maintenance mode from 25 Feb 2026, end of support 25 Feb 2027 (migrate to OpenTelemetry). CloudWatch Application Signals SLOs (period- and request-based, burn rates).

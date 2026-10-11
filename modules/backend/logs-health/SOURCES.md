# Sources: Logs, health checks and shutdown (fact-checked 2026-10-12)

- Kubernetes docs: liveness/readiness/startup probes; Pod termination (endpoints removal in parallel, preStop, SIGTERM, 30 s default grace, SIGKILL).
- Spring Boot 3.4 release notes (graceful shutdown default); Go net/http Server.Shutdown; Node.js server.close() (closes idle connections since v19).
- W3C Trace Context Level 1 Recommendation (23 Nov 2021; Level 2 CR draft). OpenTelemetry logs specification (stable; SDK status varies).

The café service is made up. Notes: scratchpad `sd/backend/m20-facts.md`.

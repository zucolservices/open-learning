# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m10-facts.md` (raw pages in `obs/m09/`).

- Sigelman et al., "Dapper, a Large-Scale Distributed Systems Tracing Infrastructure" (Google technical report, April 2010): trees of spans; "a sampling rate as low as 1/1024".
- W3C Trace Context (Recommendation, 23 Nov 2021): `traceparent` = version-traceid(32 lowercase hex)-parentid(16 hex)-flags(2 hex); example `00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`. Level 2 is a Candidate Recommendation Draft (Mar 2024).
- OpenTelemetry tracing spec: span name, parent, start and end times, span context, attributes, events, links, status; kinds SERVER, CLIENT, PRODUCER, CONSUMER, INTERNAL. Messaging semantic conventions: creation context carried with messages; links for batches.
- Jaeger: CNCF graduated 31 Oct 2019; v2.0.0 (10 Nov 2024) built on the OpenTelemetry Collector. Zipkin open-sourced by Twitter in 2012. AWS X-Ray SDKs and daemon in maintenance mode since 25 Feb 2026; OpenTelemetry is the primary instrumentation.
- The checkout, its services, span timings and IDs (other than the W3C example) are illustrative.

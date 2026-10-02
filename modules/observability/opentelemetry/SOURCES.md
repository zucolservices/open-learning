# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m03-facts.md` (raw pages in `obs/m03/`).

- OpenTelemetry: formed in 2019 from OpenTracing and OpenCensus; CNCF incubating 2021; graduated (CNCF announcement, May 2026); "second-highest project velocity" in the CNCF after Kubernetes; 12,000+ contributors from 2,800+ companies.
- OpenTelemetry docs: API vs SDK separation; OTLP over gRPC (4317) and HTTP (4318); Collector receivers, processors, exporters and pipelines; agent and gateway deployment; zero-code instrumentation (Java agent, `opentelemetry-instrument` for Python, .NET, Node.js); default propagators `tracecontext,baggage`; `service.name` defaults to `unknown_service`.
- Signal status by language (Oct 2026): traces and metrics stable in major languages; logs stable in Java, .NET, C++, PHP (Go release candidate; Python and JavaScript in development); profiles public alpha (26 Mar 2026). OBI (OpenTelemetry eBPF Instrumentation, from Grafana Beyla, 2025) is pre-1.0 and Linux only.
- Backends: Prometheus 3 OTLP receiver (`--web.enable-otlp-receiver`, `/api/v1/otlp`), Grafana Tempo (OTLP gRPC 4317), Loki OTLP endpoint (`/otlp`), Jaeger v2 built on the Collector (Nov 2024). OpenTelemetry Operator for Kubernetes.
- The payments service, its spans and the vendor and cloud endpoints are illustrative.

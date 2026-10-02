# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m02-facts.md` (raw pages in `obs/m01/`).

- OpenTelemetry docs, signals: traces "The path of a request through your application"; metrics "A measurement captured at runtime"; logs "A recording of an event"; baggage passes context between services. Profiles signal in public alpha since 26 Mar 2026.
- Cindy Sridharan, _Distributed Systems Observability_ (O'Reilly, 2018): "Logs, metrics, and traces are often known as the three pillars of observability."
- Ben Sigelman, "Three Pillars, Zero Answers" (KubeCon NA, 11 Dec 2018): "metrics, logs, and traces are just data – they are the fuel, not the car."
- Prometheus storage docs: "Prometheus stores an average of only 1-2 bytes per sample."
- Honeycomb: "The building block of o11y 2.0 is wide, structured log events."
- Exemplars: stable in the OpenTelemetry data model; opt-in in Prometheus (`--enable-feature=exemplar-storage`). HTTP semantic conventions stable since v1.23.0 (Nov 2023): `http.request.method`, `http.response.status_code`.
- The 14:08 incident, its logs, spans and the storage volumes are illustrative.

# Distributed tracing (Observability, module 10)

1. **Follow one checkout** ⭐ (step-through): a waterfall built span by span with the traceparent header at each hop; then click the span to blame (a locked database query on the critical path).
2. **The header that holds it together** (explore): traceparent parts; queues and span links.
3. **The gap** (choice checkpoint): time without child spans.
4. **Wrap**: Dapper, Zipkin, Jaeger, Tempo, X-Ray.

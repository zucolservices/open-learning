# Sampling traces (Observability, module 11)

1. **Keep the trace that mattered** ⭐ (simulation): head sampling at 1–50% vs tail sampling (errors, slow, 1% of the rest); traces kept, errors and slow kept, tomorrow's complaint kept or lost.
2. **How tail sampling works** (step-through): routing by trace ID, decision_wait, policies, costs.
3. **Count first, then sample** (explore): span_metrics and exemplars; Dapper's 1/1024.
4. **Head or tail?** (sort checkpoint).
5. **Wrap**: ProbabilitySampler.

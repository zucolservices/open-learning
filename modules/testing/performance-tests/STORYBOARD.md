# Storyboard: Performance and load tests

1. **The café counter at 1 pm** (story): queues explode near capacity.
2. **Ramp up the traffic and find the knee** ⭐ (simulation): M/M/1 latency curve (average, p50, p95), traffic slider, p95 budget, new build 2.5 ms slower fails the CI check at expected peak.
3. **Load, stress, spike, soak** (explore): traffic shapes and questions.
4. **Measuring honestly** (explore): percentiles, coordinated omission, budgets in CI, tools, INP.
5. **Reading the numbers** (checkpoint `testing-perf`).
6. **What to remember** (wrap).

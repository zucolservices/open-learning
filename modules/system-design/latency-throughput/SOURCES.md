# Sources: Latency, throughput & percentiles

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-foundations/`).

| Claim in the module                                                                                                                                                | Verdict              | Source                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------------------- |
| M/M/1: W = S/(1−ρ); wait in line = ρ/(1−ρ) × S (1× at 50%, 4× at 80%, 9× at 90%, 19× at 95%)                                                                       | Verified             | Adan & Resing, _Queueing Systems_ §4          |
| Simulation matches theory (80,000 customers, seeded): 0.99–1.05× theory at 30–95%                                                                                  | Verified empirically | `sim.ts` (tsx run)                            |
| Little's Law L = λW holds for any stable system, no distribution assumptions                                                                                       | Verified             | Little, _Operations Research_ 59(3), 2011     |
| Tail at Scale: 1-in-100 slow × 100 servers → 63% slow; hedging after 10 ms cut p99.9 from 1,800 ms to 74 ms with 2% more requests; hedging after p95 adds ~5% load | Verified             | Dean & Barroso, CACM 56(2), 2013              |
| p50 typical, p99 plausible worst case; averages obscure tails                                                                                                      | Verified             | sre.google/sre-book/service-level-objectives/ |
| Quantiles can't be aggregated; merge histograms                                                                                                                    | Verified             | prometheus.io/docs/practices/histograms/      |

## Decisions

- Hedging maths assumes independent slowness (stated in the UI).

# Sources: Horizontal scaling & autoscaling

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-stateless/`).

| Claim in the module                                                                                                                                                      | Verdict            | Source                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ | -------------------------------------------------------------- |
| "Twelve-factor processes are stateless and share-nothing"; session state in Memcached/Redis                                                                              | Verified           | 12factor.net/processes                                         |
| AWS policies: target tracking, step, simple, scheduled, predictive; 300 s cooldown applies to simple scaling only; default instance warmup is off, 300 s suggested start | Verified (nuanced) | AWS EC2 Auto Scaling docs (cooldowns, default instance warmup) |
| GCP autoscaler initialisation period (formerly cool down) default 60 s                                                                                                   | Verified           | cloud.google.com/compute/docs/autoscaler                       |
| Kubernetes HPA: desired = ceil(current × metric/target); 15 s sync; 0.1 tolerance; 300 s downscale stabilisation                                                         | Verified           | kubernetes.io HPA docs                                         |
| Cluster Autoscaler and Karpenter sponsored by SIG Autoscaling; KEDA feeds the HPA and scales 0↔1                                                                         | Verified           | kubernetes.io node autoscaling; keda.sh                        |
| Lambda cold starts: under 1% of invocations, under 100 ms to over 1 s                                                                                                    | Verified           | AWS Lambda runtime environment docs                            |
| Azure VMSS autoscale exists (defaults not verified, so none stated)                                                                                                      | Partly verified    | —                                                              |

## Decisions

- The lunch-rush simulation is illustrative (100 req/s per server, ±15% noise, tripling spike within 3 minutes); checked with tsx across settings before building the UI.

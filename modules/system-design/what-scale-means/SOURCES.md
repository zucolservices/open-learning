# Sources: What "at scale" means

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-foundations/`).

| Claim in the module                                                                                                                                                                        | Verdict                            | Source                                                                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Largest rentable VM: AWS u7inh-32tb.480xlarge, 1,920 vCPU, 32 TiB RAM                                                                                                                      | Verified                           | aws.amazon.com/ec2/instance-types/u7i/                                                                                      |
| Growth path (one server → split tiers → load balancer + stateless app servers → cache/DB replicas/CDN → sharding) is a common teaching pattern; vertical scaling "will run into a ceiling" | Verified (as a pattern, not a law) | aws.amazon.com/blogs/startups/scaling-on-aws-part-1-a-primer/ ; "Scaling Up to Your First 10 Million Users" (AWS re:Invent) |

## Decisions

- User counts at each stage are illustrative and labelled so; the text says the order varies by workload.
- Brewline (from the Lakehouse track) is reused as the running example.

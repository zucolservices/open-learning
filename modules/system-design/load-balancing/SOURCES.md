# Sources: Load balancing

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-stateless/`).

| Claim in the module                                                                                                                                              | Verdict                        | Source                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| L4 vs L7; AWS NLB/ALB, GCP Network/Application LBs, Azure Load Balancer/Application Gateway/Front Door/Traffic Manager                                           | Verified                       | AWS ELB docs; cloud.google.com/load-balancing/docs/choosing-load-balancer; Azure load-balancing overview |
| ALB default round robin (least outstanding requests opt-in); Envoy default ROUND_ROBIN, LEAST_REQUEST uses P2C; NGINX default weighted round robin, `random two` | Verified                       | AWS target group attributes; envoyproxy.io load balancers; nginx.org upstream module                     |
| Power of two choices: Azar, Broder, Karlin & Upfal (STOC 1994); Mitzenmacher (TPDS 2001) for queues: exponential gain from 1 → 2 choices, small from 2 → 3       | Verified (attribution nuanced) | eecs.harvard.edu/~michaelm/postscripts/tpds2001.pdf                                                      |
| ALB health check defaults: 30 s interval, unhealthy after 2, healthy after 5; deregistration delay 300 s                                                         | Verified                       | AWS target group health checks                                                                           |
| Envoy outlier detection = passive health checking                                                                                                                | Verified                       | envoyproxy.io outlier detection                                                                          |
| Sticky sessions bypass the routing algorithm after the first request; twelve-factor calls them a violation                                                       | Verified                       | AWS target group attributes; 12factor.net/processes                                                      |
| DNS-based global routing (Route 53, Traffic Manager fails over slower than Front Door); anycast global LB (GCP), Cloudflare                                      | Verified                       | Route 53 routing policies; GCP external Application LB; Cloudflare docs                                  |

## Decisions

- The simulation (sim.ts) is a seeded model: six single-worker servers, exponential service times; checked with tsx before building the UI.

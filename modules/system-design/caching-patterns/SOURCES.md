# Sources: Caching patterns

Fact-checked 2026-09-24. Papers saved in the session scratchpad (`sd-caching/`).

| Claim in the module                                                                                                                                        | Verdict                      | Source                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| Lazy loading (cache-aside) and write-through, their costs; add TTLs                                                                                        | Verified                     | docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html    |
| Cache-aside: write the store, then invalidate; ordering matters                                                                                            | Verified                     | learn.microsoft.com/azure/architecture/patterns/cache-aside        |
| Read-through (loader), write-through (writer), write-behind (queued, lag)                                                                                  | Verified                     | ehcache.org caching-patterns                                       |
| Facebook: demand-filled look-aside cache; delete on write (idempotent); leases stop stale sets, a delete invalidates the lease; one token per key per 10 s | Verified                     | Nishtala et al., "Scaling Memcache at Facebook", NSDI 2013, §3.2.1 |
| Shared cache reads well under 1 ms (ElastiCache Serverless p50 GET ≈ 751 µs)                                                                               | Nuanced (not "microseconds") | AWS News Blog, ElastiCache Serverless GA                           |
| "Two hard things" attributed to Phil Karlton                                                                                                               | Verified (as quoted)         | martinfowler.com/bliki/TwoHardThings.html                          |

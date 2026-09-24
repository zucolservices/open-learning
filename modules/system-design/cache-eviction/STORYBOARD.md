# Storyboard: Eviction, invalidation & stampedes

Track: System Design at Scale · Chapter 3 · Module 8 · ~30 min · level: deep

## Steps

| #   | Step                                 | Interaction                                                                                      | Gate   |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------------ | ------ |
| 1   | What to throw out? ⭐                | **Simulation**: LRU/LFU/random × capacity × crawler scan × popularity shift; hit ratio over time |        |
| 2   | Why did Redis stop accepting writes? | volatile-lru with no TTLs                                                                        | choice |
| 3   | The thundering herd ⭐               | **Simulation**: none / coalesce / refresh early / serve stale / leases                           |        |
| 4   | Everything expires at once           | 10,000 keys, TTL jitter 0–20%                                                                    |        |
| 5   | Hot keys                             | One node melts; local copy; several copies                                                       |        |
| 6   | Pick the defence                     | Stale-tolerant list → serve stale                                                                | choice |
| 7   | Caches you'll meet                   | Redis/Valkey, managed caches, Memcached, Caffeine, stampede helpers                              |        |
| 8   | What to remember                     |                                                                                                  |        |

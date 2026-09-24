# Storyboard: CDNs & the edge

Track: System Design at Scale · Chapter 2 · Module 6 · ~25 min · level: core

## Steps

| #   | Step                       | Interaction                                                                | Gate   |
| --- | -------------------------- | -------------------------------------------------------------------------- | ------ |
| 1   | Far away is slow ⭐        | **Map**: 8 cities to a Mumbai origin vs local edges; RTT from distance     |        |
| 2   | The hit ratio ⭐           | **Simulation**: TTL × cache-key variants × shield → hit ratio, origin load |        |
| 3   | Publishing a change        | Wait for TTL vs purge vs versioned file names                              |        |
| 4   | What should the CDN cache? | Sort six responses: long / brief / not at the edge                         | sort   |
| 5   | CDNs, and code at the edge | Providers with current network figures; edge compute                       |        |
| 6   | The stubborn old version   | Fingerprinted file names                                                   | choice |
| 7   | What to remember           |                                                                            |        |

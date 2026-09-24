# Storyboard: Load balancing

Track: System Design at Scale · Chapter 2 · Module 4 · ~30 min · level: core

## Steps

| #   | Step                                  | Interaction                                                                                | Gate   |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------ | ------ |
| 1   | The host at the door                  | Restaurant host analogy; L4 vs L7 routing of three requests                                |        |
| 2   | Round robin, or something smarter? ⭐ | **Simulation**: 4 algorithms × slow/broken server × passive checks × load; 30,000 requests |        |
| 3   | One slow server                       | Round robin can't route around slowness                                                    | choice |
| 4   | How fast is a failure noticed?        | Interval × threshold timeline; requests lost meanwhile; draining                           |        |
| 5   | Who balances the balancer?            | One / redundant / global (DNS vs anycast)                                                  |        |
| 6   | Sticky sessions                       | State on servers breaks balancing and failover                                             | choice |
| 7   | Load balancers you'll meet            | L4 / L7 / global across AWS, Google Cloud, Azure, open source                              |        |
| 8   | What to remember                      |                                                                                            |        |

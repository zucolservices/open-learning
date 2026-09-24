# Storyboard: Horizontal scaling & autoscaling

Track: System Design at Scale · Chapter 2 · Module 5 · ~30 min · level: core

## Steps

| #   | Step                       | Interaction                                                                                         | Gate    |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------- | ------- |
| 1   | Any server, any request    | Supermarket checkouts; cart in memory vs shared store vs token; remove a server                     |         |
| 2   | Survive the lunch rush ⭐  | **Simulation**: 3 hours minute-by-minute; target CPU × warm-up × scale-in wait × scheduled capacity |         |
| 3   | What will Kubernetes do?   | HPA formula: ceil(4 × 90/60) = 6                                                                    | predict |
| 4   | The bottleneck moves       | App servers × 20 connections vs a 500-connection database; pooler                                   |         |
| 5   | A spike you can see coming | Results at 10:00 → schedule ahead                                                                   | choice  |
| 6   | Autoscalers you'll meet    | AWS, Google Cloud, Azure, Kubernetes HPA, Cluster Autoscaler/Karpenter, KEDA, serverless            |         |
| 7   | What to remember           |                                                                                                     |         |

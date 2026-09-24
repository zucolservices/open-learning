# Availability math: storyboard

1. **How many nines?** ⭐ Shop "open 99% of the time" analogy. Pick 99%…99.999%: downtime per year/month/week/day, monthly bars for every level, what each level feels like.
2. **Find the weak link** ⭐ (calculator, `model.ts`). Chain: one zone (when not spread) × load balancer × app servers (1–4) × database (1–2) × payment provider (1–2). Parallel copies 1 − (1 − a)ⁿ; spreading across 3 zones folds the zone into each tier. The weakest part is outlined; the message moves the learner along. One zone caps at 99.88%; fully spread reaches 99.989%.
3. **Ten dependencies** (predict): 0.999¹⁰ ≈ 99%.
4. **When copies fail together** (choice): correlated failures from a shared release/config; CrowdStrike 2024.
5. **What the cloud promises**: outage slider → uptime, service credit (10/25/100% tiers) vs orders lost; SLA figures for AWS, Azure, Google Cloud.
6. **What to remember**.

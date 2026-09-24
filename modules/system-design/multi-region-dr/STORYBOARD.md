# Multi-region & disaster recovery: storyboard

1. **Four ways to be ready** ⭐ (animated infographic). Second-home analogy per strategy. Region A vs region B boxes (servers / database / images: running, small, off, stored); RPO, RTO (rough tiers from AWS's DR guidance), running cost.
2. **RPO or RTO?** (sort checkpoint).
3. **The failover drill** ⭐ (branching scenario, `drill.ts`). Earlier choices: region B strategy, data (nightly backups vs continuous replication; active-active forces replication), routing (manual DNS with 24 h TTL, DNS failover with health checks, global anycast load balancer). "Region A goes dark at 14:00" reveals a timeline event by event; results: RTO for most users, last users back (DNS caches), data lost, monthly cost multiple.
4. **Where may the copy live?** (choice): RBI payment data localisation rules out Singapore; use a second Indian region.
5. **Building blocks**: routing, multi-region databases, backups, game days.
6. **What to remember**.

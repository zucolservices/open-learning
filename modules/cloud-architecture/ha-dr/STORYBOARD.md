# High availability and disaster recovery (Cloud Architecture, module 17)

1. **No spare, spare tyre, run-flats** (analogy, from Google's DR guide): cold, warm, hot.
2. **Two numbers** ⭐ (simulation): sliders for time since last good copy (RPO) and time to recover (RTO) on a timeline around a disaster; check against SEBI's exchange rule (45 min / 15 min).
3. **Fail a region** ⭐ (simulation): system (wiki, portal, exchange, payments) × strategy (backup, pilot light, warm standby, active-active); fail Mumbai; data lost, downtime, illustrative cost, cheapest strategy that meets the target.
4. **Counting nines** (calculator): component availability, chain length, parallel copies → system availability and downtime a year.
5. **Prove it works** (explore): OVHcloud 2021, NSE 2021, UniSuper 2024, AWS us-east-1 2025; RBI restore-testing rule; chaos engineering.
6. **Pick the strategy** (sort checkpoint).
7. **Wrap**.

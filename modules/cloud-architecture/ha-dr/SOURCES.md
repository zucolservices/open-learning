# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m17-facts.md`.

- AWS Well-Architected REL13-BP02: backup & restore "RPO in hours, RTO in 24 hours or less"; pilot light "RPO in minutes, RTO in tens of minutes"; warm standby "RPO in seconds, RTO in minutes"; active-active "RPO near zero, RTO potentially zero". Google DR planning guide: cold/warm/hot, tyre analogy.
- Availability: 99.9% = 8.76 h/yr; 99.99% = 52.56 min; 99.999% = 5.26 min; 0.999³ = 99.70%; 1 − (1 − 0.99)² = 99.99% (independent failures).
- Synchronous cross-region options: DynamoDB global tables multi-Region strong consistency (GA 30 Jun 2025, three Regions); Spanner dual-region India (Mumbai + Delhi), 99.999% (Enterprise Plus). Other: AWS Elastic Disaster Recovery, Aurora Global Database (lag typically < 1 s), S3 RTC (99.9% within 15 min), Azure Site Recovery ($25/VM/month), GRS (no SLA; geo priority replication SLA since Nov 2025), Google turbo replication (15-min RPO).
- Incidents: OVHcloud SBG2 fire (10 Mar 2021, 14,046 servers; 2023 court ruling); NSE halt (24 Feb 2021, ~3 h 50 min, no DR switch); UniSuper (May 2024; recovered from GCS backups and third-party backups); AWS us-east-1 (19–20 Oct 2025, ~14.5 h).
- India: SEBI circular (22 Mar 2021) for MIIs — RTO 45 min, RPO 15 min, live trading from DR site; RBI IT governance direction (Nov 2023) — DR drills every six months, "periodically restore such backed-up data to check its usability".
- Chaos Monkey (Netflix, Dec 2010); AWS FIS (GA Mar 2021); Azure Chaos Studio (GA Nov 2023).
- Strategy costs in the simulator are illustrative; times follow AWS's published ranges.

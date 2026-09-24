# Sources (fact-checked 2026-09)

- AWS whitepaper, *Disaster Recovery of Workloads on AWS*: backup and restore, pilot light, warm standby, multi-site active/active; RTO and RPO definitions. The hours / tens of minutes / minutes / near-real-time tiers are from its diagram and presented as approximate.
- Amazon Route 53 HealthCheckConfig: request interval 30 s by default (10 s fast), failure threshold 3. AWS Global Accelerator: two static anycast IPv4 addresses. Azure Traffic Manager (DNS-based) and Front Door; Google Cloud global external Application Load Balancer (single anycast IP).
- Aurora Global Database docs: cross-Region replication typically under a second; switchover without data loss; failover may lose data.
- DynamoDB global tables multi-Region strong consistency, GA June 2025 (RPO zero; three Regions). Cosmos DB reliability docs (multi-region writes; RPO by consistency level). Azure SQL failover groups.
- RBI circular DPSS.CO.OD No.2785/06.08.005/2017-2018 (6 Apr 2018): payment system data stored only in India. India DPDP Rules notified 13 Nov 2025.
- Region counts: AWS 39 Regions; Google Cloud 43 regions; Azure 70+ regions (provider sites, Sep 2026).
- AWS Fault Injection Service; Azure Chaos Studio.

# Sources (fact-checked 2026-09)

- Downtime arithmetic: 365.25-day year; month = year / 12.
- AWS SLAs: Compute (EC2 region-level 99.99% across AZs, instance-level 99.5%; credits 10/30/100%), S3 Standard 99.9%, DynamoDB 99.99% (global tables 99.999%), RDS Multi-AZ 99.95% (Single-AZ 99.5%), Aurora Multi-AZ 99.99%; credits 10/25/100% for these.
- Azure SLA for Virtual Machines: single VM 99.9% with Premium SSD / Ultra Disk (99.5% Standard SSD), availability set 99.95%, availability zones 99.99%. Cosmos DB reliability docs: multi-region writes 99.999%.
- Google Cloud SLAs: Compute Engine multi-zone 99.99%, single instance 99.9% (99.95% memory-optimised); Spanner regional 99.99%, multi-region and dual-region 99.999% (credits up to 50%).
- Credits are applied to future bills, must usually be claimed, and are capped at the bill.
- Correlated failures: AWS us-east-1 summaries (7 Dec 2021; 19–20 Oct 2025 DynamoDB DNS race condition); CrowdStrike Channel File 291 RCA (19 Jul 2024; ~8.5M Windows devices per Microsoft).

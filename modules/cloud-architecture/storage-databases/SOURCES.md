# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m16-facts.md`.

- AWS Price List API, ap-south-1, 2 Oct 2026 (USD): S3 Standard $0.025, Standard-IA $0.0138, One Zone-IA $0.011, Glacier Instant Retrieval $0.005, Glacier Flexible $0.0045, Deep Archive $0.002 per GB-month; Intelligent-Tiering monitoring $0.0025 per 1,000 objects; retrieval fees (IA $0.01/GB, GIR $0.03/GB, Deep Archive standard $0.024/GB). EBS gp3 $0.0912 (us-east-1 $0.08), snapshots $0.05. EFS Standard $0.33, IA $0.0272. RDS db.t4g.medium PostgreSQL $0.084/h Single-AZ, $0.167 Multi-AZ; gp3 storage $0.131 / $0.262 per GB-month; Extended Support $0.114 per vCPU-hour (years 1–2), $0.228 (year 3).
- S3 minimum durations 30/90/90/180 days; 128 KB minimum billable size (IA, GIR); lifecycle doesn't transition objects < 128 KB by default (Sep 2024); 11 nines durability; Deep Archive restore within 12 h (standard), 48 h (bulk). Azure Blob tiers 30/90/180 days, rehydration up to 15 h, smart tier; GCS Nearline/Coldline/Archive 30/90/365 days, millisecond access.
- gp3: 3,000 IOPS / 125 MiB/s baseline, up to 80,000 IOPS, one AZ. Filestore minimums vary by tier.
- RDS engines (PostgreSQL, MySQL, MariaDB, Oracle, SQL Server, Db2); backup retention 0–35 days (console default 7); MySQL 8.0 standard support ended 31 Jul 2026, PostgreSQL 13 on 28 Feb 2026. Aurora six copies across three AZs (AWS blog).
- GitLab, 31 Jan 2017: ~6 hours of database data lost; backup mechanisms failed; restored from a staging snapshot.
- National Logistics Portal-Marine (TechCrunch, 2023): public S3 buckets exposed seafarers' passport details; fixed after CERT-In involvement.
- Department data volumes and the two-year lifecycle scenario are illustrative; ₹ at 96 per USD.

# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m21-facts.md`.

- AWS Prescriptive Guidance 7 Rs: Retire, Retain, Rehost ("lift and shift"), Relocate, Repurchase ("drop and shop"), Replatform ("lift and reshape"), Refactor or re-architect; Orban's 6 Rs (1 Nov 2016), Relocate added 2017; move first, modernise after. Gartner 5 Rs (May 2011). Azure CAF 8 strategies (Retire, Rehost, Replatform, Refactor, Rearchitect, Replace, Rebuild, Retain); rehost only if no modernisation needed within two years; migrate steps Plan, Prepare, Execute, Optimize, Decommission. Google migration types (lift and shift, lift and optimize, move and improve, continue to modernize, remove and replace, repurchase); phases Assess, Plan, Deploy, Optimize. AWS phases Assess, Mobilize, Migrate & Modernize.
- Tools: AWS Transform (GA 15 May 2025); Application Migration Service renamed AWS Transform MGN (June 2026); Migration Hub closed to new customers (7 Nov 2025); SMS ended 31 Mar 2022, CloudEndure Migration 30 Dec 2022; Amazon EVS GA Aug 2025 (Mumbai Nov 2025); Azure Migrate; Google Migrate to Virtual Machines.
- Transfer: AWS Snow devices not available to new customers (Snowball Edge existing customers only since 7 Nov 2025); DataSync, Data Transfer Terminal, partner devices; Azure Data Box 120/525 GA Apr 2025; Google Transfer Appliance (TA7/TA40/TA300, available in India). 100 TB over 1 Gbps = 800,000 s ≈ 9.26 days.
- Cutover: Azure CAF near-zero-downtime migrations, rollback triggers, go/no-go, avoid freezes and peaks.
- Stories: Air India to Azure (2023, ~85 cut-overs); Delhivery (AWS blog, 7 Nov 2024: 500+ TB, 45 days, US East → Mumbai, 800+ pipelines); TSB (Apr 2018, 5.2 m customers, £330.2 m costs, £48.65 m fines Dec 2022 — a core-banking "big bang" migration, not cloud); McKinsey (Oct 2021) ~$100 bn migration spend wasted over three years.
- The ten-app portfolio and feedback are illustrative.

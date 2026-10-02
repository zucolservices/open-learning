# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m19-facts.md`.

- AWS Well-Architected Framework (version 6 Nov 2024): six pillars; Sustainability added Nov–Dec 2021; review is a "lightweight process (hours not days) that is a conversation and not an audit", at key milestones; Well-Architected Tool at no charge; high-risk issues "might result in significant negative impact to a business"; lenses incl. Serverless, SaaS, Financial Services, Generative AI (Apr 2025), Responsible AI (Nov 2025).
- Best practices: REL10-BP01 "Deploy the workload to multiple locations" (anti-patterns: single AZ; multi-Region when multi-AZ suffices); REL09-BP04 "Perform periodic recovery of the data to verify backup integrity and processes" (Medium); SEC02-BP02 "Use temporary credentials"; SEC02-BP03 "Store and use secrets securely"; COST01-BP03 "Establish cloud budgets and forecasts"; OPS08-BP04 "Create actionable alerts"; SUS01-BP01 "Choose Region based on both business requirements and sustainability goals".
- Azure Well-Architected Framework: five pillars; sustainability as a workload guide; per-pillar principles, checklists and trade-offs; trade-off quotes ("higher replica count, which leads to increased costs"; "Replicas, by design, increase the workload's surface area"; inspection controls "add latency to requests"; "Decreasing log and metric volume… reduces system observability"; "don't compromise on security to gain cost optimizations").
- Google Cloud Well-Architected Framework: six pillars incl. Sustainability (28 Jan 2026), "Performance optimization", "Security, privacy, and compliance"; System design category removed Aug 2024; perspectives AI/ML and FSI.
- Google CFE: asia-south1 (Mumbai) 20%, asia-south2 (Delhi) 39% (2025 data).
- The scholarship portal design and trade-off arrows are illustrative.

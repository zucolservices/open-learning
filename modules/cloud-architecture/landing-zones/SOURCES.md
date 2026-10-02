# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m14-facts.md`.

- Definitions: AWS Prescriptive Guidance ("well-architected, multi-account AWS environment that is scalable and secure"); Microsoft CAF ("a proven and flexible architecture for governing, securing, and scaling a multi-subscription Azure environment"); Google landing zone docs (identity, resource hierarchy, network, security).
- AWS Control Tower: landing zone 4.0 (17 Nov 2025): Config, CloudTrail, security roles, Backup optional; Security OU optional; controls-only mode. Classic layout: Log Archive + Audit accounts in Security OU, IAM Identity Center, organisation CloudTrail. Free (pay for underlying services). Account Factory (Service Catalog), AFT, CfCT, auto-enrolment (Oct 2025). Mumbai and Hyderabad supported. Landing Zone Accelerator universal configuration ≈ $1,372/month with no workloads. Security Hub renamed Security Hub CSPM (June 2025); new unified Security Hub GA Dec 2025.
- Azure landing zones: 8 design areas; platform vs workload landing zones; management groups Platform (Security, Management, Connectivity, Identity), Landing zones (Corp, Online, Local); Azure Verified Modules (avm-ptn-alz; caf-enterprise-scale archived; ALZ-Bicep → Bicep Classic); subscription vending (avm-ptn-alz-sub-vending). Sentinel moving to Defender portal (31 Mar 2027).
- Google Cloud: Cloud Setup (PoC / production / advanced; Terraform export); terraform-example-foundation stages 0-bootstrap … 5-app-infra (3-networks-svpc / hub-and-spoke), v6.0.0; Cloud Foundation Fabric FAST; project factory; _Required log bucket 400 days.
- Pitfalls: management account not covered by SCPs/preventive controls; "never use overlapping IP addresses in a single routing domain"; editing Control Tower resources outside supported methods → "unknown state"; Microsoft guidance on application-team autonomy.
- India: SEBI Cloud Framework circular (6 Mar 2023): MeitY-empanelled CSPs, RE retains ownership of data, keys and logs; SEBI FAQ (June 2025).
- The vending example (GST analytics team, CIDR, budget) is illustrative.

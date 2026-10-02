# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m09-facts.md`.

- AWS IAM: users, groups, roles; identity-based and resource-based policies (managed, inline); nine policy types incl. permissions boundaries, SCPs, RCPs, session policies, VPC endpoint policies. Evaluation: implicit deny by default; explicit deny overrides any allow; within one account an allow in identity- or resource-based policy suffices; boundaries/SCPs/RCPs/session policies only limit (intersection). Policy language "Version": "2012-10-17". NotAction with Allow grants everything not listed.
- Azure RBAC: security principal, role definition, scope (management group, subscription, resource group, resource), role assignment; additive; Actions − NotActions ("NotActions is not a deny rule"); deny assignments are created only by Azure (deployment stacks deny settings) and checked first. 5,000 role assignments per subscription. Azure Blueprints retiring (fully by 31 Jan 2027). Classic administrators retired.
- Google Cloud IAM: principals; basic/predefined/custom roles; permissions service.resource.verb; allow policies inherit down organisation → folder → project → resource; deny policies checked before allow; principal access boundary policies; basic roles discouraged in production; role recommendations (free for basic roles; others need Security Command Center Premium/Enterprise), 90 days of usage.
- Least privilege tooling: AWS IAM Access Analyzer (policy generation from up to 90 days of CloudTrail, unused access $0.20 per role/user per month, custom policy checks $0.002 per call); Microsoft Entra Permissions Management retired 1 Nov 2025; Azure PIM (Entra ID P2/Governance).
- IAM is free on all three clouds.
- Capital One 2019: ~100 million US and ~6 million Canadian individuals; DOJ: "misconfigured web application firewall"; OCC civil penalty $80 million (6 Aug 2020). Over-broad role wording per secondary analyses.
- MFA: AWS root MFA required (management accounts May 2024, standalone June 2024, member accounts June 2025); Azure mandatory MFA phase 1 Oct 2024 (portal), phase 2 1 Oct 2025 (CLI, PowerShell, IaC, SDK create/update/delete); Google Cloud 2-step verification phased 2025–2026 (company accounts without SSO from 20 Oct 2026; SSO accounts not yet announced).
- Policy examples in the module (reports bucket, nightly job) are illustrative.

# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m15-facts.md`.

- Terraform plan format (v1.16.4 source): + create, - destroy, ~ update in-place, -/+ destroy then create replacement, +/- create then destroy, <= read; "# forces replacement", "(known after apply)", "Note: Objects have changed outside of Terraform"; summary "Plan: X to add, Y to change, Z to destroy." (a replacement counts in add and destroy).
- AWS provider (v6.67.0): aws_s3_bucket `bucket` forces new resource; aws_instance `ami` forces replacement (schema), `instance_type` in place with stop/start; aws_db_instance `identifier` updates in place (engine, storage_encrypted, username force replacement).
- State: plaintext incl. secrets; S3 native locking `use_lockfile` (1.10, GA 1.11), DynamoDB locking deprecated; `-refresh-only`; moved (1.1), import (1.5), removed (1.7).
- Licensing: BSL announced 10 Aug 2023, first BSL release 1.6.0; OpenTofu 1.6.0 (10 Jan 2024), CNCF Sandbox (23 Apr 2025), state encryption 1.7; IBM–HashiCorp closed 27 Feb 2025; CDKTF archived 10 Dec 2025.
- CloudFormation change sets, drift detection, IaC generator (Feb 2024), drift-aware change sets with REVERT_DRIFT (18 Nov 2025); CDK v2 languages. Bicep production-ready (v0.3, Mar 2021); what-if symbols; deployment stacks GA May 2024. Google Infrastructure Manager (Terraform ≤1.5.7), Config Connector; Deployment Manager support ended 31 Mar 2026. Pulumi HCL (Dec 2025); Crossplane CNCF graduated (6 Nov 2025). GitOps (Weaveworks, 2017).
- Atlassian outage (5 Apr 2022): 883 sites, 775 customers, up to 14 days.
- Plan and drift scenarios in the module are illustrative.

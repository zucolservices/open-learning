# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m11-facts.md` (raw pages in `cicd/m11/`).

- Terraform plan output (HashiCorp source and docs): legend "-/+ destroy and then create replacement", "# forces replacement", "must be replaced", summary "Plan: X to add, Y to change, Z to destroy." A replacement counts as one add and one destroy. In the AWS provider, `storage_encrypted` on aws_db_instance forces replacement.
- `terraform plan -out` / `terraform apply <planfile>` applies exactly the saved plan; error "Saved plan is stale" if state changed. Plan files and state can contain secrets in plain text.
- Terraform docs, `prevent_destroy`: "Terraform rejects plans that would destroy the infrastructure object … This rule doesn't prevent Terraform from destroying a resource if you remove its configuration." `create_before_destroy` doesn't preserve data. AWS RDS `deletion_protection`.
- `terraform plan -refresh-only -detailed-exitcode` (exit 2 = changes). S3 backend native locking `use_lockfile` (1.10; GA in 1.11 with DynamoDB locking deprecated).
- Terraform BSL 1.1 (10 Aug 2023); OpenTofu GA 10 Jan 2024 (Linux Foundation; CNCF Sandbox 23 Apr 2025); IBM completed HashiCorp acquisition 27 Feb 2025; Terraform Cloud renamed HCP Terraform (Apr 2024).
- Pulumi preview, CloudFormation change sets, CDK diff, Bicep what-if, Google Infrastructure Manager. Atlantis (CNCF Sandbox, 2024), Spacelift, env0, Terrateam; OPA/Conftest, Sentinel, Checkov, Trivy (tfsec checks).
- Google Cloud blog (25 May 2024), UniSuper GCVE incident: "leaving a parameter blank" in an internal tool led to automatic deletion after a one-year default term; backups in Cloud Storage aided restoration. Not an infrastructure-as-code tool.
- Pull request #412, its resources and the plan text are illustrative (real Terraform wording).

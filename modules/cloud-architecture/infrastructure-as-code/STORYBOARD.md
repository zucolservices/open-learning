# Infrastructure as code (Cloud Architecture, module 15)

1. **Draw the floor plan** (analogy): hand a contractor the plan; they reply build / change / rebuild / demolish (+ ~ -/+ -) before touching anything.
2. **Run it twice** ⭐ (simulation): imperative script vs declaration; each Run doubles the script's servers while the declaration reports "No changes" (idempotence).
3. **Read a plan** ⭐ (checkpoint): a pull-request diff of six changes; predict create / update / replace / destroy; reveal the real-format terraform plan (3 to add, 2 to change, 3 to destroy). Surprise: database identifier renames in place.
4. **Someone clicked in the console** ⭐ (step-through): code / state / real cloud columns; SSH opened to the internet at 2 a.m.; plan notices; choose revert vs adopt.
5. **The tools** (explore): Terraform/OpenTofu, CloudFormation/CDK, Bicep/deployment stacks, Google Infrastructure Manager, Pulumi/Crossplane/GitOps; Atlassian 2022.
6. **Wrap**.

/** The plan a pull request produced, line by line (illustrative resources, real Terraform wording). */

export interface PlanLine {
  text: string;
  /** Lines a reviewer can click; one of them is the real danger. */
  id?: string;
  tone?: "add" | "change" | "destroy" | "replace";
}

export const PLAN: PlanLine[] = [
  { text: "Terraform will perform the following actions:" },
  { text: "" },
  { text: "  # aws_cloudwatch_metric_alarm.cpu_high will be created", id: "alarm", tone: "add" },
  { text: '  + resource "aws_cloudwatch_metric_alarm" "cpu_high" {', tone: "add" },
  { text: '      + alarm_name = "payments-db-cpu-high"', tone: "add" },
  { text: "    }", tone: "add" },
  { text: "" },
  {
    text: "  # aws_security_group_rule.app_to_db will be updated in-place",
    id: "sg",
    tone: "change",
  },
  { text: '  ~ resource "aws_security_group_rule" "app_to_db" {', tone: "change" },
  { text: '      ~ description = "app" -> "payments app to database"', tone: "change" },
  { text: "    }", tone: "change" },
  { text: "" },
  { text: "  # aws_db_instance.main must be replaced", id: "db", tone: "replace" },
  { text: '-/+ resource "aws_db_instance" "main" {', tone: "replace" },
  {
    text: '      ~ arn               = "arn:aws:rds:…:db:payments" -> (known after apply)',
    tone: "replace",
  },
  {
    text: "      ~ storage_encrypted = false -> true # forces replacement",
    id: "db",
    tone: "replace",
  },
  { text: "        # (31 unchanged attributes hidden)", tone: "replace" },
  { text: "    }", tone: "replace" },
  { text: "" },
  { text: "  # aws_s3_bucket_versioning.logs will be updated in-place", id: "s3", tone: "change" },
  { text: '  ~ resource "aws_s3_bucket_versioning" "logs" {', tone: "change" },
  { text: '      ~ status = "Suspended" -> "Enabled"', tone: "change" },
  { text: "    }", tone: "change" },
  { text: "" },
  { text: "Plan: 2 to add, 2 to change, 1 to destroy.", id: "summary" },
];

export const PICK_FEEDBACK: Record<string, { ok: boolean; text: string }> = {
  alarm: { ok: false, text: "A new alarm is harmless: it only adds something." },
  sg: { ok: false, text: "Only the rule's description changes, in place. The rule itself stays." },
  s3: { ok: false, text: "Turning versioning on keeps more history. That's safer, not riskier." },
  db: {
    ok: true,
    text: "Turning on storage encryption can't be done to an existing database in place, so Terraform will destroy the production database and create a new, empty one.",
  },
  summary: {
    ok: true,
    text: "Right instinct: '1 to destroy' in a change meant to add an alarm is the red flag. It's the database: the -/+ line means destroy, then create a replacement.",
  },
};

export const FIXES: { id: string; label: string; ok: boolean; text: string }[] = [
  {
    id: "merge",
    label: "Merge it; the new database will be encrypted",
    ok: false,
    text: "And empty. Every payment record goes with the old one.",
  },
  {
    id: "migrate",
    label:
      "Revert that line; plan a migration instead: snapshot, restore into an encrypted copy, switch over",
    ok: true,
    text: "The change still happens, deliberately and with the data. Then add prevent_destroy and deletion_protection so a future plan can't do this by accident.",
  },
  {
    id: "cbd",
    label: "Add create_before_destroy so the new one exists first",
    ok: false,
    text: "The new database would still be created empty. create_before_destroy changes the order, not the data.",
  },
];

/** The pipeline for an infrastructure repository. */
export const STAGES: { t: string; cmd: string; d: string; when: "pr" | "merge" | "nightly" }[] = [
  {
    t: "Format and validate",
    cmd: "terraform fmt -check && terraform validate",
    d: "Cheap checks that the code is tidy and makes sense.",
    when: "pr",
  },
  {
    t: "Plan",
    cmd: "terraform plan -out=tfplan",
    d: "Compares the code with what exists and saves exactly what would change.",
    when: "pr",
  },
  {
    t: "Policy check",
    cmd: "terraform show -json tfplan > plan.json && conftest test plan.json",
    d: "Rules as code, such as 'never delete a database' or 'no storage open to the internet', fail the pipeline.",
    when: "pr",
  },
  {
    t: "Post the plan",
    cmd: "comment on the pull request",
    d: "Reviewers read what will change, not just the code diff.",
    when: "pr",
  },
  {
    t: "Apply the saved plan",
    cmd: "terraform apply tfplan",
    d: "After approval and merge, applies exactly what was reviewed. If anything changed meanwhile, Terraform refuses: 'Saved plan is stale'.",
    when: "merge",
  },
  {
    t: "Drift check",
    cmd: "terraform plan -refresh-only -detailed-exitcode",
    d: "Every night: exit code 2 means someone changed things by hand, so raise an alert.",
    when: "nightly",
  },
];

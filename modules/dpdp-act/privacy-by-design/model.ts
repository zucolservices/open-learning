/**
 * Privacy-by-design components and the DPDP duties each helps meet. The Act never says "privacy by
 * design"; the hook is s.8(4)'s technical and organisational measures. Backups are not mentioned
 * in the law; the approaches shown are common practice.
 */

export type Comp =
  "minimal" | "ledger" | "tags" | "ttl" | "fanout" | "vault" | "logs" | "rights" | "shred";

export const COMPONENTS: { id: Comp; label: string; does: string }[] = [
  { id: "minimal", label: "Minimal sign-up form", does: "Asks only for what the service needs." },
  {
    id: "ledger",
    label: "Consent ledger",
    does: "Records each yes and withdrawal with the notice version shown.",
  },
  {
    id: "tags",
    label: "Purpose tags on data",
    does: "Every field and table says which purpose it serves.",
  },
  { id: "ttl", label: "Retention jobs", does: "Expire data automatically when its purpose ends." },
  {
    id: "fanout",
    label: "Deletion fan-out",
    does: "One erase event reaches caches, warehouse and every vendor.",
  },
  {
    id: "vault",
    label: "Token vault",
    does: "Swaps identifiers like phone and Aadhaar for tokens.",
  },
  { id: "logs", label: "Access logs, kept a year", does: "Who read which record, and when." },
  {
    id: "rights",
    label: "Rights request API",
    does: "Finds a person's data everywhere for access and erasure.",
  },
  {
    id: "shred",
    label: "Per-user keys for backups",
    does: "Delete a key and that person's backup copies become unreadable.",
  },
];

export type Duty =
  | "minimise"
  | "prove"
  | "purpose"
  | "retain"
  | "eraseAll"
  | "secure"
  | "trace"
  | "answer"
  | "backups";

export const DUTIES: { id: Duty; label: string; law: string; needs: Comp[] }[] = [
  { id: "minimise", label: "Collect only what's needed", law: "s.6(1)", needs: ["minimal"] },
  { id: "prove", label: "Prove notice and consent", law: "s.6(10)", needs: ["ledger"] },
  { id: "purpose", label: "Use data only for its purpose", law: "s.6(1), Rule 3", needs: ["tags"] },
  {
    id: "retain",
    label: "Erase when the purpose ends",
    law: "s.8(7), Rule 8",
    needs: ["tags", "ttl"],
  },
  { id: "eraseAll", label: "Make processors erase too", law: "s.8(7)(b)", needs: ["fanout"] },
  { id: "secure", label: "Mask or tokenise identifiers", law: "Rule 6(1)(a)", needs: ["vault"] },
  {
    id: "trace",
    label: "Log access and keep logs a year",
    law: "Rule 6(1)(c), (e)",
    needs: ["logs"],
  },
  {
    id: "answer",
    label: "Answer access and erasure requests",
    law: "ss.11–12",
    needs: ["rights", "fanout"],
  },
  { id: "backups", label: "Handle backups on erasure", law: "Law is silent", needs: ["shred"] },
];

export const TOOLS: { pattern: string; aws: string; gcp: string; azure: string; oss: string }[] = [
  {
    pattern: "Find personal data",
    aws: "Amazon Macie",
    gcp: "Sensitive Data Protection",
    azure: "Microsoft Purview",
    oss: "Presidio",
  },
  {
    pattern: "Keys and crypto-shredding",
    aws: "AWS KMS",
    gcp: "Cloud KMS",
    azure: "Azure Key Vault",
    oss: "OpenBao, per-user keys",
  },
  {
    pattern: "Access logs",
    aws: "CloudTrail data events",
    gcp: "Cloud Audit Logs (Data Access)",
    azure: "Azure Monitor resource logs",
    oss: "Your own audit log",
  },
  {
    pattern: "Retention jobs",
    aws: "S3 Lifecycle",
    gcp: "Object Lifecycle Management",
    azure: "Blob lifecycle management",
    oss: "Scheduled jobs, TTL indexes",
  },
  {
    pattern: "Who may see what",
    aws: "IAM",
    gcp: "IAM",
    azure: "Azure RBAC",
    oss: "Open Policy Agent, OpenFGA, Apache Ranger",
  },
];

export const GOTCHAS: string[] = [
  "Data-access logging is off by default in AWS CloudTrail and most Google Cloud services: switch it on.",
  "Deleting a key in AWS KMS or Cloud KMS waits 30 days by default before it's gone.",
  "Write-once storage (S3 Object Lock in compliance mode, Azure immutable containers) blocks deletion, including erasure.",
  "Presidio left Microsoft in 2026 and is now community-run; its India recognisers are off by default.",
];

export type BackupWay = "nothing" | "suppress" | "shred";

export const BACKUP_WAYS: { id: BackupWay; label: string; result: string; ok: boolean }[] = [
  {
    id: "nothing",
    label: "Do nothing",
    result: "Restore last week's backup and the erased person is back in production.",
    ok: false,
  },
  {
    id: "suppress",
    label: "Suppression list plus short rotation",
    result: "Restores skip erased IDs, and the old snapshots age out within the rotation period.",
    ok: true,
  },
  {
    id: "shred",
    label: "Per-user encryption keys",
    result:
      "Delete the person's key and every copy of their data, backups included, becomes unreadable.",
    ok: true,
  },
];

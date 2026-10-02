"use client";

import { motion } from "motion/react";
import { AlertTriangle, Ban, Camera, Check, Lock, Wrench } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { GuardState, Mode } from "./state";

type Cloud = GuardState["cloud"];

/* 1 ─ Locks, cameras and caretakers ------------------------------------------------------------- */

const KINDS: [typeof Lock, string, string, string][] = [
  [Lock, "Lock", "The terrace door is locked: nobody gets up there, however senior.", "Preventive"],
  [
    Camera,
    "Camera",
    "Anyone can park anywhere, but the camera spots the car in the fire lane and the secretary gets a message.",
    "Detective",
  ],
  [
    Wrench,
    "Caretaker",
    "Lights left on in the stairwell? The caretaker switches them off on the next round.",
    "Corrective",
  ],
];

export function Locks() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Locks, cameras and caretakers"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {KINDS.map(([Icon, t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex items-start gap-3 rounded-xl border px-4 py-3"
            >
              <Icon className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">
                  {t} <span className="text-muted text-xs font-normal">· {k}</span>
                </p>
                <p className="text-muted mt-0.5 text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A housing society doesn&apos;t rely on every resident remembering every rule. Some rules are
        locks, some are cameras, and some are a caretaker who quietly puts things right.
      </p>
      <p>
        Cloud <Term id="guardrail">guardrails</Term> work the same way. They are set once, high up
        in the organisation, and apply to every account and project below, even to administrators.
        Permissions (module 9) say what one person may do; guardrails set the limits for everyone.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Try to break the rules ⭐ -------------------------------------------------------------------- */

type RuleId = "public" | "region" | "tag";

const RULES: {
  id: RuleId;
  key: "publicMode" | "regionMode" | "tagMode";
  attempt: string;
  rule: string;
  modes: Mode[];
}[] = [
  {
    id: "public",
    key: "publicMode",
    attempt: "Create a storage bucket open to the internet",
    rule: "No public storage",
    modes: ["off", "detect", "prevent", "fix"],
  },
  {
    id: "region",
    key: "regionMode",
    attempt: "Start a server in the US (us-east-1 / eastus / us-east1)",
    rule: "Only India regions",
    modes: ["off", "detect", "prevent"],
  },
  {
    id: "tag",
    key: "tagMode",
    attempt: "Create a database without a cost-centre tag",
    rule: "Every resource has a cost-centre tag",
    modes: ["off", "detect", "prevent", "fix"],
  },
];

const MODE_LABEL: Record<Mode, string> = {
  off: "Off",
  detect: "Flag",
  prevent: "Block",
  fix: "Fix",
};

const HOW: Record<RuleId, Record<Cloud, Partial<Record<Mode, string>>>> = {
  public: {
    aws: {
      prevent:
        "S3 Block Public Access (on by default for new buckets since 2023; organisation-wide since Nov 2025)",
      detect: "AWS Config rule that flags public buckets",
      fix: "AWS Config rule with automatic remediation",
    },
    azure: {
      prevent: "Azure Policy with the Deny effect on public blob access",
      detect: "Azure Policy with the Audit effect",
      fix: "Azure Policy with the Modify effect turns public access off",
    },
    gcp: {
      prevent:
        "Organization policy storage.publicAccessPrevention (it also removes public access from existing buckets)",
      detect: "Security Command Center finding",
      fix: "Organization policy storage.publicAccessPrevention, applied to existing buckets too",
    },
  },
  region: {
    aws: {
      prevent:
        "Service control policy denying requests where aws:RequestedRegion isn't ap-south-1 or ap-south-2",
      detect: "AWS Config / Security Hub finding for resources outside approved regions",
    },
    azure: {
      prevent: "Built-in Azure Policy “Allowed locations” (Deny)",
      detect: "“Allowed locations” assigned with the Audit effect",
    },
    gcp: {
      prevent: "Organization policy gcp.resourceLocations allowing in:in-locations",
      detect: "The same constraint in dry-run mode: violations logged, nothing blocked",
    },
  },
  tag: {
    aws: {
      prevent:
        "Service control policy denying creation when the aws:RequestTag/cost-centre key is missing (tag policies alone don't block untagged resources)",
      detect: "AWS Config required-tags rule",
      fix: "Config remediation that adds the tag",
    },
    azure: {
      prevent: "Built-in Azure Policy “Require a tag on resources” (Deny)",
      detect: "A tag policy with the Audit effect",
      fix: "“Inherit a tag from the resource group” (Modify effect)",
    },
    gcp: {
      prevent: "Custom organization policy constraint (written in CEL) requiring the label",
      detect: "Custom constraint in dry-run mode",
      fix: "A scheduled job (for example Cloud Custodian) that adds the label",
    },
  },
};

const OUTCOME: Record<
  Mode,
  { label: string; tone: "good" | "bad" | "warn" | "fix"; Icon: typeof Check }
> = {
  off: { label: "Created. Nobody notices.", tone: "bad", Icon: Check },
  detect: { label: "Created, then flagged for someone to fix", tone: "warn", Icon: AlertTriangle },
  prevent: { label: "Blocked: request denied", tone: "good", Icon: Ban },
  fix: { label: "Created, then put right automatically", tone: "fix", Icon: Wrench },
};

export function TryIt() {
  const [s, set] = useSceneState<GuardState>();
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Try to break the rules"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.cloud}
            options={[
              ["aws", "AWS"],
              ["azure", "Azure"],
              ["gcp", "Google Cloud"],
            ]}
            onChange={(v) => set({ cloud: v })}
          />
          {RULES.map((r) => {
            const mode = s[r.key];
            const o = OUTCOME[mode];
            const how = HOW[r.id][s.cloud][mode];
            return (
              <div
                key={r.id}
                className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">{r.rule}</p>
                  <Segmented
                    size="sm"
                    value={mode}
                    options={r.modes.map((m) => [m, MODE_LABEL[m]] as [Mode, string])}
                    onChange={(v) => set({ [r.key]: v } as Partial<GuardState>)}
                  />
                </div>
                <p className="text-muted text-xs">Attempt: {r.attempt}</p>
                <motion.div
                  key={mode + s.cloud}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-2 rounded-md px-2 py-1 text-xs",
                    o.tone === "bad"
                      ? "bg-bad/10"
                      : o.tone === "good"
                        ? "bg-good/10"
                        : "bg-surface-2",
                  )}
                >
                  <o.Icon
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0",
                      o.tone === "bad"
                        ? "text-bad"
                        : o.tone === "good"
                          ? "text-good"
                          : "text-accent",
                    )}
                  />
                  <span>
                    <span className="font-medium">{o.label}</span>
                    {how && <span className="text-muted"> · {how}</span>}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </div>
      }
    >
      <p>
        Three things nobody should do, and three ways to stop them. Pick a cloud, then set each rule
        to flag, block or fix, and see what happens to the attempt and which feature does it.
      </p>
      <p>
        Blocking is a <Term id="preventive-control">preventive control</Term>: nothing bad ever
        exists. Flagging is a <Term id="detective-control">detective control</Term>: it catches what
        slipped through, including resources created before the rule existed. Most organisations use
        both. Public buckets are a classic: in 2020 one held millions of Indian diagnostic-lab
        patient bookings.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The same rule on three clouds ------------------------------------------------------------- */

const CODE: Record<Cloud, { title: string; code: string; note: string }> = {
  aws: {
    title: "AWS service control policy (simplified)",
    code: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideIndia",
    "Effect": "Deny",
    "NotAction": ["iam:*", "organizations:*", "sts:*", "support:*", "…"],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": ["ap-south-1", "ap-south-2"]
      }
    }
  }]
}`,
    note: "NotAction exempts global services that don't live in a region. SCPs never grant anything, and don't apply to the organisation's management account.",
  },
  azure: {
    title: "Azure Policy assignment (built-in “Allowed locations”)",
    code: `{
  "policyDefinitionId": ".../policyDefinitions/e56962a6-4747-49cd-b67b-bf8b01975c4c",
  "parameters": {
    "listOfAllowedLocations": {
      "value": ["centralindia", "southindia", "westindia", "indiasouthcentral"]
    }
  },
  "scope": "/providers/Microsoft.Management/managementGroups/acme"
}`,
    note: "Assigned at a management group, it covers every subscription below. A new assignment takes effect in about 5 minutes; a full compliance scan runs every 24 hours.",
  },
  gcp: {
    title: "Google Cloud organization policy",
    code: `name: organizations/123456/policies/gcp.resourceLocations
spec:
  rules:
  - values:
      allowedValues:
      - in:in-locations`,
    note: "in:in-locations is Google's group for Mumbai (asia-south1) and Delhi (asia-south2). Run it in dry-run first to see what would break.",
  },
};

export function SameRule() {
  const [s, set] = useSceneState<GuardState>();
  const c = CODE[s.codeCloud];
  return (
    <StepLayout
      eyebrow="Explore · real syntax"
      title="The same rule on three clouds"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.codeCloud}
            options={[
              ["aws", "AWS"],
              ["azure", "Azure"],
              ["gcp", "Google Cloud"],
            ]}
            onChange={(v) => set({ codeCloud: v })}
          />
          <p className="text-sm font-semibold">{c.title}</p>
          <Code className="text-[10px] break-all whitespace-pre-wrap">{c.code}</Code>
          <p className="text-muted text-xs">{c.note}</p>
        </div>
      }
    >
      <p>
        &ldquo;Only India regions&rdquo; is a common rule for data residency: RBI has required
        payment data to be stored only in India since 2018. Here it is as each cloud writes it.
      </p>
      <p>
        These are short text files, so they can live in git, be reviewed and tested like code: that
        is <Term id="policy-as-code">policy as code</Term>. All three services cost nothing extra;
        detective tools such as AWS Config charge per resource recorded and per rule evaluation.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Catch it before it ships ⭐ ------------------------------------------------------------------ */

export function ShiftLeft() {
  const [s, set] = useSceneState<GuardState>();
  const tf = `resource "aws_s3_bucket" "reports" {
  bucket = "acme-reports"${s.fixTag ? `\n  tags = { cost-centre = "finance" }` : ""}
}
${
  s.fixPublic
    ? `
resource "aws_s3_bucket_public_access_block" "reports" {
  bucket                  = aws_s3_bucket.reports.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}`
    : `
resource "aws_s3_bucket_policy" "reports" {
  bucket = aws_s3_bucket.reports.id
  policy = jsonencode({ Statement = [{ Effect = "Allow",
    Principal = "*", Action = "s3:GetObject", ... }] })
}`
}`;
  const checks: [string, boolean][] = [
    ["Bucket must not allow public reads", s.fixPublic],
    ["Every resource has a cost-centre tag", s.fixTag],
  ];
  const pass = checks.every((c) => c[1]);
  const STAGES = ["Editor", "Pull request check", "Cloud guardrail", "Runtime detection"];
  return (
    <StepLayout
      eyebrow="Simulation · infrastructure as code"
      title="Catch it before it ships"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Code className="text-[10px] whitespace-pre-wrap">{tf}</Code>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => set({ fixPublic: !s.fixPublic })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {s.fixPublic ? "Undo: make it public again" : "Fix: block public access"}
              </button>
              <button
                type="button"
                onClick={() => set({ fixTag: !s.fixTag })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 text-xs"
              >
                {s.fixTag ? "Undo: remove the tag" : "Fix: add the tag"}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted text-xs">
              Policy check in the pull request (Checkov, Conftest/OPA, Trivy…)
            </p>
            {checks.map(([n, ok]) => (
              <div
                key={n}
                className={cn(
                  "flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                )}
              >
                {ok ? (
                  <Check className="text-good size-3.5" />
                ) : (
                  <Ban className="text-bad size-3.5" />
                )}
                <span className="flex-1">{n}</span>
                <span className="font-mono text-[10px]">{ok ? "PASS" : "FAIL"}</span>
              </div>
            ))}
            <p className={cn("rounded-lg px-3 py-2 text-sm", pass ? "bg-good/10" : "bg-bad/10")}>
              {pass
                ? "Checks pass: the change can be merged and deployed."
                : "Merge blocked until the code is fixed. Nothing reached the cloud."}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[10px]">
              {STAGES.map((st, i) => (
                <span
                  key={st}
                  className={cn(
                    "flex-1 rounded-md px-1 py-1 text-center",
                    i === 1 ? "bg-accent text-accent-fg" : "bg-surface-2 text-muted",
                  )}
                >
                  {st}
                </span>
              ))}
            </div>
            <p className="text-muted text-[10px]">
              Further left is cheaper to fix; keep the cloud guardrails as the backstop.
            </p>
          </div>
        </div>
      }
    >
      <p>
        When infrastructure is written as code (module 15), the same rules can run on the code in
        every pull request, before anything is created. Fix the two problems and watch the check
        turn green. This is called shifting left.
      </p>
      <p>
        Open-source tools: Open Policy Agent (Rego language) with Conftest, and Gatekeeper or
        Kyverno for Kubernetes (Groww is a Kyverno user); Checkov and Trivy scan Terraform. Vendor
        options include HashiCorp Sentinel and AWS CloudFormation Guard. AWS Control Tower calls
        these &ldquo;proactive&rdquo; controls.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Block, flag or fix? ----------------------------------------------------------------------- */

export function Kinds() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Block, flag or fix?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="guardrail-kinds"
            prompt="What kind of control is each?"
            categories={[
              { id: "prevent", label: "Preventive" },
              { id: "detect", label: "Detective" },
              { id: "fix", label: "Corrective" },
            ]}
            items={[
              {
                id: "scp",
                label:
                  "An AWS service control policy that denies launches outside Mumbai and Hyderabad",
                category: "prevent",
                why: "The request is refused; nothing is created.",
              },
              {
                id: "audit",
                label: "An Azure Policy with the Audit effect on untagged resources",
                category: "detect",
                why: "Resources are created and marked non-compliant.",
              },
              {
                id: "config",
                label: "An AWS Config rule that reports public buckets on a dashboard",
                category: "detect",
                why: "It finds problems after they exist, including old ones.",
              },
              {
                id: "modify",
                label:
                  "An Azure Policy with the Modify effect that copies the resource group's tag onto new resources",
                category: "fix",
                why: "It changes the resource to comply.",
              },
              {
                id: "ci",
                label: "A Checkov check that fails the pull request",
                category: "prevent",
                why: "The change never merges, so nothing is deployed.",
              },
              {
                id: "dryrun",
                label: "A Google organization policy in dry-run mode",
                category: "detect",
                why: "Dry-run logs what would be blocked without blocking it.",
              },
            ]}
            explanation="Prevent what you can, detect what you can't, and auto-fix only where the fix is safe."
          />
        </div>
      }
    >
      <p>Six controls to classify.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Set once, apply everywhere", "Guardrails sit above accounts and bind even admins."],
  ["Block, flag, fix", "Prevent where you can; detect the rest and old resources."],
  ["Three clouds, one idea", "SCPs, Azure Policy, Google organization policies."],
  ["Policy as code", "Rules in git, checked in every pull request."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        In 2019 Gartner predicted that through 2025, 99% of cloud security failures would be the
        customer&apos;s fault, mostly misconfiguration. Guardrails are how you make the right
        configuration the only one possible. Next: the hierarchy of accounts and folders they attach
        to.
      </p>
    </StepLayout>
  );
}

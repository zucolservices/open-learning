"use client";

import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { IacState } from "./state";

/* 1 ─ Draw the floor plan ------------------------------------------------------------------------- */

export function FloorPlan() {
  const rows: [string, string, string][] = [
    ["+", "Build", "A new study where the store room was"],
    ["~", "Change", "Repaint the bedroom"],
    ["-/+", "Rebuild", "Move the kitchen sink: the counter must be torn out and rebuilt"],
    ["-", "Demolish", "The old shed you left off the plan"],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Draw the floor plan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs">
            You hand the contractor the floor plan you want. They walk the house and reply:
          </p>
          {rows.map(([sym, verb, d], i) => (
            <motion.div
              key={verb}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span
                className={cn(
                  "w-8 text-center font-mono font-bold",
                  sym === "+" ? "text-good" : sym === "~" ? "text-accent" : "text-bad",
                )}
              >
                {sym}
              </span>
              <span className="w-20 font-semibold">{verb}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
          <p className="text-muted text-xs">Nothing is touched until you sign off.</p>
        </div>
      }
    >
      <p>
        So far every network, account and guardrail in this track could be built by clicking in a
        web console. That works once. It doesn&apos;t work for fifty accounts, or when you need to
        know exactly what changed last Tuesday.
      </p>
      <p>
        <Term id="infrastructure-as-code">Infrastructure as code</Term> is the floor-plan approach:
        you describe the infrastructure you want in text files, and a tool works out what to build,
        change or remove to get there, shows you that <Term id="iac-plan">plan</Term>, and only then
        acts.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Run it twice ⭐ ------------------------------------------------------------------------------ */

export function RunTwice() {
  const [s, set] = useSceneState<IacState>();
  const runs = s.runs;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Run it twice"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold">A script (imperative)</p>
              <Code className="text-[10px]">{`aws ec2 run-instances --count 2 ...
aws s3 mb s3://acme-reports`}</Code>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: runs * 2 }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px]",
                      i < 2 ? "bg-surface-2" : "bg-bad/15 text-bad",
                    )}
                  >
                    server {i + 1}
                  </motion.span>
                ))}
              </div>
              {runs > 1 && (
                <p className="text-bad text-[11px]">
                  Run {runs}: {runs * 2} servers (and the bucket command fails: it already exists).
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <p className="text-xs font-semibold">A declaration</p>
              <Code className="text-[10px]">{`resource "aws_instance" "web" {
  count = 2 ...
}
resource "aws_s3_bucket" "reports" {
  bucket = "acme-reports"
}`}</Code>
              <div className="flex flex-wrap gap-1">
                {runs > 0 &&
                  [1, 2].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-surface-2 rounded px-1.5 py-0.5 text-[10px]"
                    >
                      server {i}
                    </motion.span>
                  ))}
              </div>
              {runs > 1 && (
                <p className="text-good text-[11px]">
                  Run {runs}: &ldquo;No changes. Your infrastructure matches the
                  configuration.&rdquo;
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => set({ runs: Math.min(runs + 1, 5) })}
              className="bg-accent text-accent-fg rounded-full px-4 py-1.5 text-xs font-medium"
            >
              {runs === 0 ? "Run" : "Run again"}
            </button>
            <button
              type="button"
              onClick={() => set({ runs: 0 })}
              className="border-line rounded-full border px-3 py-1.5 text-xs"
            >
              Reset
            </button>
          </div>
        </div>
      }
    >
      <p>
        A script lists steps: do this, then that. Run it twice and it does everything twice. A{" "}
        <Term id="declarative">declarative</Term> file describes the end result, and the tool only
        makes the difference. Press Run a few times.
      </p>
      <p>
        Running it again and getting the same result is called idempotence. It is what makes the
        files safe to re-run, review in a pull request and keep in git as the record of what exists.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Read a plan ⭐ (checkpoint) ------------------------------------------------------------------ */

const DIFF = `  resource "aws_s3_bucket" "reports" {
-   bucket = "acme-reports"
+   bucket = "acme-reports-mumbai"
  }
  resource "aws_instance" "web" {
-   instance_type = "t3.small"
+   instance_type = "t3.medium"
  }
  resource "aws_instance" "worker" {
-   ami = "ami-0aa1…"
+   ami = "ami-0bb2…"
  }
  resource "aws_db_instance" "main" {
-   identifier = "app-db"
+   identifier = "portal-db"
  }
- resource "aws_security_group" "old" { … }
+ resource "aws_sqs_queue" "jobs" { … }`;

const PLAN = `  # aws_db_instance.main will be updated in-place
  ~ resource "aws_db_instance" "main" {
      ~ identifier = "app-db" -> "portal-db"
    }

  # aws_instance.web will be updated in-place
  ~ resource "aws_instance" "web" {
      ~ instance_type = "t3.small" -> "t3.medium"
    }

  # aws_instance.worker must be replaced
-/+ resource "aws_instance" "worker" {
      ~ ami = "ami-0aa1…" -> "ami-0bb2…" # forces replacement
      ~ id  = "i-0c3…" -> (known after apply)
    }

  # aws_s3_bucket.reports must be replaced
-/+ resource "aws_s3_bucket" "reports" {
      ~ bucket = "acme-reports" -> "acme-reports-mumbai" # forces replacement
    }

  # aws_security_group.old will be destroyed
  - resource "aws_security_group" "old" { … }

  # aws_sqs_queue.jobs will be created
  + resource "aws_sqs_queue" "jobs" { … }

Plan: 3 to add, 2 to change, 3 to destroy.`;

export function ReadPlan() {
  const [s, set] = useSceneState<IacState>();
  return (
    <StepLayout
      eyebrow="Checkpoint · real Terraform output format"
      title="Read a plan"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold">The change in the pull request</p>
            <Code className="text-[10px] whitespace-pre-wrap">{DIFF}</Code>
            <button
              type="button"
              onClick={() => set({ showPlan: !s.showPlan })}
              className="border-line hover:bg-surface-2 self-start rounded-full border px-3 py-1 text-xs"
            >
              {s.showPlan ? "Hide" : "Show"} terraform plan
            </button>
            {s.showPlan && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Code className="text-[10px] whitespace-pre-wrap">{PLAN}</Code>
              </motion.div>
            )}
          </div>
          <SortCheckpoint
            id="read-plan"
            prompt="What will Terraform do to each resource?"
            categories={[
              { id: "create", label: "Create" },
              { id: "update", label: "Update in place" },
              { id: "replace", label: "Replace" },
              { id: "destroy", label: "Destroy" },
            ]}
            items={[
              {
                id: "bucket",
                label: "Bucket renamed",
                category: "replace",
                why: "A bucket's name can't change: it is destroyed and a new one created (-/+). The data in it goes too, unless you move it first.",
              },
              {
                id: "web",
                label: "Web server's instance type changed",
                category: "update",
                why: "Changed in place (~), though AWS stops and starts the server to do it.",
              },
              {
                id: "worker",
                label: "Worker's machine image changed",
                category: "replace",
                why: "A new image means a new server: # forces replacement.",
              },
              {
                id: "db",
                label: "Database identifier renamed",
                category: "update",
                why: "Surprise: the AWS provider renames a database in place. Changing its engine or encryption would replace it.",
              },
              {
                id: "sg",
                label: "Security group deleted from the code",
                category: "destroy",
                why: "Not in the files any more, so Terraform removes it (-).",
              },
              {
                id: "queue",
                label: "Queue added to the code",
                category: "create",
                why: "New in the files: created (+).",
              },
            ]}
            explanation="A replacement counts twice in the summary: once to add and once to destroy. That's why 1 new queue + 2 replacements = 3 to add."
          />
        </div>
      }
    >
      <p>
        A teammate&apos;s pull request changes six things. Before anything runs,{" "}
        <code className="font-mono text-xs">terraform plan</code> compares the code, its{" "}
        <Term id="iac-state">state file</Term> (its record of what it built) and the real cloud, and
        prints exactly what it will do. Predict each line, then check against the real plan.
      </p>
      <p>
        Reading plans is the most important skill in infrastructure as code. The line to fear is
        <code className="font-mono text-xs"> # forces replacement</code> on anything holding data.
        Which changes force replacement is listed in each provider&apos;s documentation, and not
        always where you expect.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Someone clicked in the console ⭐ ------------------------------------------------------------ */

type Col = { code: string; state: string; real: string };

const DRIFT: { title: string; text: string; c: Col; tone?: "good" | "bad" }[] = [
  {
    title: "1. Everything matches",
    text: "Applied from code on Monday. Code, state and the real cloud agree: SSH open only to the office range.",
    c: { code: "SSH from 10.0.0.0/8", state: "SSH from 10.0.0.0/8", real: "SSH from 10.0.0.0/8" },
  },
  {
    title: "2. A 2 a.m. fix in the console",
    text: "During an incident, someone opens SSH to the whole internet in the console to debug from home, and forgets to close it.",
    c: { code: "SSH from 10.0.0.0/8", state: "SSH from 10.0.0.0/8", real: "SSH from 0.0.0.0/0" },
    tone: "bad",
  },
  {
    title: "3. The next plan notices",
    text: 'Terraform refreshes from the real cloud first and reports “Note: Objects have changed outside of Terraform”, then plans to put it back: ~ ingress cidr "0.0.0.0/0" -> "10.0.0.0/8".',
    c: {
      code: "SSH from 10.0.0.0/8",
      state: "SSH from 0.0.0.0/0 (seen at refresh)",
      real: "SSH from 0.0.0.0/0",
    },
  },
];

export function Drift() {
  const [s, set] = useSceneState<IacState>();
  const last = s.frame >= DRIFT.length - 1;
  const f = DRIFT[Math.min(s.frame, DRIFT.length - 1)];
  const c: Col =
    last && s.choice === "revert"
      ? { code: "SSH from 10.0.0.0/8", state: "SSH from 10.0.0.0/8", real: "SSH from 10.0.0.0/8" }
      : last && s.choice === "adopt"
        ? { code: "SSH from 0.0.0.0/0", state: "SSH from 0.0.0.0/0", real: "SSH from 0.0.0.0/0" }
        : f.c;
  const cols: [string, string][] = [
    ["Code (git)", c.code],
    ["State file", c.state],
    ["Real cloud", c.real],
  ];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Someone clicked in the console"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-3 gap-2">
            {cols.map(([h, v]) => {
              const open = v.includes("0.0.0.0/0");
              return (
                <motion.div
                  key={h + v}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center",
                    open ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
                  )}
                >
                  <p className="text-muted text-[10px]">{h}</p>
                  <p className="font-mono text-[11px]">{v}</p>
                </motion.div>
              );
            })}
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper
            step={s.frame}
            count={DRIFT.length}
            onChange={(n) => set({ frame: n, choice: "none" })}
          />
          {last && (
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => set({ choice: "revert" })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    s.choice === "revert" ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  Apply: put it back to the code
                </button>
                <button
                  type="button"
                  onClick={() => set({ choice: "adopt" })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    s.choice === "adopt" ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  Change the code to match
                </button>
              </div>
              {s.choice !== "none" && (
                <p
                  className={cn(
                    "flex gap-1.5 text-xs",
                    s.choice === "revert" ? "text-good" : "text-bad",
                  )}
                >
                  {s.choice === "revert" ? (
                    <Check className="size-3.5 shrink-0" />
                  ) : (
                    <X className="size-3.5 shrink-0" />
                  )}
                  {s.choice === "revert"
                    ? "Back in line. Here the code was right; the click was the mistake."
                    : "Consistent again, but you've just made “SSH open to the internet” official. Adopt drift only when the console change was the right one, and review it like any other change."}
                </p>
              )}
            </div>
          )}
        </div>
      }
    >
      <p>
        When the real cloud no longer matches the code, that&apos;s <Term id="drift">drift</Term>.
        It almost always comes from someone changing things by hand: an emergency fix, a quick test,
        a forgotten setting.
      </p>
      <p>
        Plans catch it, and <code className="font-mono text-xs">terraform plan -refresh-only</code>{" "}
        reports it without changing anything. Running a plan on a schedule turns drift into an
        alert. AWS CloudFormation can detect drift too, and since November 2025 can revert it. Many
        teams make console access read-only in production so changes go through code and review.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The tools --------------------------------------------------------------------------------- */

type Tool = IacState["tool"];

const TOOLS: Record<Tool, [string, string][]> = {
  terraform: [
    [
      "Terraform",
      "The most widely used, for every cloud. HashiCorp switched it to a source-available licence (BSL) from version 1.6 in 2023; IBM bought HashiCorp in 2025.",
    ],
    [
      "OpenTofu",
      "The open-source fork of Terraform under the Linux Foundation (1.6 released January 2024), now a CNCF Sandbox project. Adds features such as state encryption.",
    ],
    [
      "State",
      "Kept in a shared backend (for example S3 with native locking since Terraform 1.10–1.11). It holds secret values in plain text, so lock it down.",
    ],
  ],
  aws: [
    [
      "CloudFormation",
      "AWS's own: stacks, change sets to preview, drift detection. Free for AWS resources. Its IaC generator can turn existing resources into templates.",
    ],
    [
      "AWS CDK",
      "Write TypeScript, Python, Java, C#, Go or JavaScript; it generates CloudFormation.",
    ],
  ],
  azure: [
    [
      "Bicep",
      "Azure's concise language (production-ready since 2021) that compiles to ARM JSON templates. `what-if` previews changes with + create, ~ modify, - delete.",
    ],
    [
      "Deployment stacks",
      "Manage a group of resources as one unit, and optionally deny changes made outside it (GA 2024).",
    ],
  ],
  gcp: [
    [
      "Infrastructure Manager",
      "Google's managed service for running Terraform (versions up to 1.5.7).",
    ],
    ["Config Connector", "Manage Google Cloud resources as Kubernetes objects."],
    ["Deployment Manager", "The old tool: support ended 31 March 2026."],
  ],
  other: [
    [
      "Pulumi",
      "Infrastructure in general-purpose languages (TypeScript, Python, Go, .NET, Java) and YAML, and since late 2025 HCL too.",
    ],
    [
      "Crossplane",
      "Infrastructure managed from Kubernetes; graduated from the CNCF in November 2025.",
    ],
    [
      "GitOps",
      "A term coined by Weaveworks in 2017: git is the source of truth and an agent keeps the cloud in line with it.",
    ],
  ],
};

export function Tools() {
  const [s, set] = useSceneState<IacState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="The tools"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.tool}
            options={[
              ["terraform", "Terraform"],
              ["aws", "AWS"],
              ["azure", "Azure"],
              ["gcp", "Google"],
              ["other", "Others"],
            ]}
            onChange={(v) => set({ tool: v })}
          />
          {TOOLS[s.tool].map(([t, d], i) => (
            <motion.div
              key={s.tool + t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every cloud has its own tool, and Terraform (or OpenTofu) works across all of them. The
        ideas are the same everywhere: declare, preview, apply, keep state, watch for drift.
      </p>
      <p>
        Code still needs care. In April 2022 a maintenance script at Atlassian deleted 883 customer
        sites instead of an old app inside them; some were down for 14 days. A plan you can read, a
        reviewer, and a small blast radius are the defences.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Declare the result", "Files describe what should exist; tools make the difference."],
  ["Read the plan", "+ create, ~ change, -/+ replace, - destroy. Fear “forces replacement”."],
  ["State is precious", "Shared, locked and protected: it contains secrets."],
  ["Hunt drift", "Scheduled plans; read-only consoles in production."],
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
        That completes organising the cloud. Next chapter: where data lives, and how to keep it.
      </p>
    </StepLayout>
  );
}

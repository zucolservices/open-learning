"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CapState } from "./state";

/* The decisions ---------------------------------------------------------------------------------- */

type Verdict = "good" | "warn" | "bad";

interface Option {
  id: string;
  label: string;
  verdict: Verdict;
  pillar: string;
  finding: string;
}

const DECISIONS: { id: string; area: string; module: number; options: Option[] }[] = [
  {
    id: "tree",
    area: "Account structure",
    module: 13,
    options: [
      {
        id: "one",
        label: "One account for everything",
        verdict: "bad",
        pillar: "Security",
        finding:
          "One leaked credential or bad command reaches every system. Split into accounts (module 13).",
      },
      {
        id: "teams",
        label: "One account per team",
        verdict: "warn",
        pillar: "Security",
        finding:
          "Better, but production and testing share accounts, and there's no home for logs and security tools.",
      },
      {
        id: "ous",
        label: "Security, Infrastructure, Prod, Dev/test and Sandbox folders",
        verdict: "good",
        pillar: "Security",
        finding: "Grouped by the rules each needs, with blast radius contained.",
      },
    ],
  },
  {
    id: "network",
    area: "Network",
    module: 7,
    options: [
      {
        id: "overlap",
        label: "Each team builds its own 10.0.0.0/16",
        verdict: "bad",
        pillar: "Operations",
        finding: "Overlapping ranges can never be connected. Use one IP plan (modules 5 and 14).",
      },
      {
        id: "mesh",
        label: "Peer every network with every other",
        verdict: "warn",
        pillar: "Operations",
        finding: "Works at three networks; at fifteen it's 105 peerings. Use a hub (module 7).",
      },
      {
        id: "hub",
        label: "Hub-and-spoke with a central IP plan and shared exit",
        verdict: "good",
        pillar: "Operations",
        finding: "One place for connectivity, inspection and the link to the secretariat.",
      },
    ],
  },
  {
    id: "identity",
    area: "Identity",
    module: 10,
    options: [
      {
        id: "keys",
        label: "IAM users with access keys, including in the pipeline",
        verdict: "bad",
        pillar: "Security",
        finding:
          "Long-lived keys leak; attackers use them within minutes. Use SSO and OIDC (module 10).",
      },
      {
        id: "sso",
        label: "Single sign-on for staff, roles for workloads, OIDC for CI",
        verdict: "good",
        pillar: "Security",
        finding: "Nothing permanent to steal; leavers lose access everywhere at once.",
      },
    ],
  },
  {
    id: "guardrails",
    area: "Guardrails",
    module: 12,
    options: [
      {
        id: "none",
        label: "None: teams are trusted",
        verdict: "bad",
        pillar: "Security",
        finding:
          "Nothing stops a public bucket or a server in the US. Add preventive guardrails (module 12).",
      },
      {
        id: "detect",
        label: "Flag problems on a dashboard",
        verdict: "warn",
        pillar: "Security",
        finding: "Catches mistakes after the fact. Block the ones that must never happen.",
      },
      {
        id: "prevent",
        label: "Block: India regions only, no public storage, required cost-centre tag",
        verdict: "good",
        pillar: "Security",
        finding: "The safe configuration is the only one possible, for admins too.",
      },
    ],
  },
  {
    id: "data",
    area: "Keys and secrets",
    module: 11,
    options: [
      {
        id: "env",
        label: "Default encryption; database password in an .env file",
        verdict: "bad",
        pillar: "Security",
        finding:
          "Secrets in files end up in git and screenshots. Use a secret manager (module 11).",
      },
      {
        id: "kms",
        label: "Customer-managed KMS keys; secrets in a secret manager",
        verdict: "good",
        pillar: "Security",
        finding: "Key use is permission-checked and logged; secrets rotate.",
      },
      {
        id: "external",
        label: "Keys held in the department's own HSM outside the cloud",
        verdict: "warn",
        pillar: "Reliability",
        finding:
          "Total control, but if the HSM is down, so is everything. Not needed for Category B data.",
      },
    ],
  },
  {
    id: "logs",
    area: "Logging",
    module: 14,
    options: [
      {
        id: "local",
        label: "Each account keeps its own logs for 30 days",
        verdict: "bad",
        pillar: "India rules",
        finding:
          "CERT-In requires 180 days within India, and admins could delete the evidence. Centralise (module 14).",
      },
      {
        id: "central",
        label: "Central log archive in Mumbai, kept a year, workload admins can't delete",
        verdict: "good",
        pillar: "India rules",
        finding: "Meets CERT-In's 180 days and survives a compromised account.",
      },
    ],
  },
  {
    id: "dr",
    area: "Recovery (target: back in 4 h, lose ≤ 1 h)",
    module: 17,
    options: [
      {
        id: "singapore",
        label: "Nightly backups copied to Singapore",
        verdict: "bad",
        pillar: "India rules",
        finding:
          "Data leaves India, and nightly backups mean up to a day of lost applications (module 17, 20).",
      },
      {
        id: "pilot",
        label: "Pilot light in Hyderabad with continuous replication",
        verdict: "good",
        pillar: "Reliability",
        finding: "Minutes of data loss, tens of minutes to recover, and the copy stays in India.",
      },
      {
        id: "active",
        label: "Active-active in Mumbai and Hyderabad",
        verdict: "warn",
        pillar: "Cost",
        finding:
          "Meets the target, but costs at least double for a goal pilot light already meets.",
      },
    ],
  },
  {
    id: "cost",
    area: "Cost",
    module: 18,
    options: [
      {
        id: "ondemand",
        label: "All on-demand, no budgets",
        verdict: "bad",
        pillar: "Cost",
        finding:
          "Paying full price for the steady floor, and the first warning is the invoice (module 18).",
      },
      {
        id: "peak",
        label: "3-year commitment sized for subsidy-window peaks",
        verdict: "warn",
        pillar: "Cost",
        finding: "Commitments bill every hour: you pay for peak capacity all year.",
      },
      {
        id: "floor",
        label: "Savings plan for the floor, autoscaling for peaks, budgets and tags",
        verdict: "good",
        pillar: "Cost",
        finding: "Cheap steady capacity, elastic peaks, and spend visible per team.",
      },
    ],
  },
  {
    id: "delivery",
    area: "How it's built",
    module: 15,
    options: [
      {
        id: "console",
        label: "Clicked together in the console",
        verdict: "bad",
        pillar: "Operations",
        finding:
          "No record, no review, drift from day one. Use infrastructure as code (module 15).",
      },
      {
        id: "iac",
        label: "Infrastructure as code with plans and policy checks in every pull request",
        verdict: "good",
        pillar: "Operations",
        finding: "Reviewed, repeatable, and new accounts are vended in minutes.",
      },
    ],
  },
];

const PILLARS = ["Security", "Reliability", "Cost", "Operations", "India rules"];

/* 1 ─ The brief ----------------------------------------------------------------------------------- */

export function Brief() {
  const facts: [string, string][] = [
    ["Who", "A state Department of Agriculture, with three app teams and a small central IT team."],
    [
      "What",
      "A subsidy portal for farmers, a scheme-management back office, and analytics on crop data.",
    ],
    ["Data", "Farmers' land and bank details: personal data, government Category B."],
    ["Traffic", "Quiet most of the year; surges when a subsidy window opens."],
    ["Targets", "Portal back within 4 hours, at most 1 hour of applications lost."],
    ["Rules", "Data stays in India; MeitY-empanelled cloud; CERT-In logging."],
  ];
  return (
    <StepLayout
      eyebrow="Story"
      title="The brief"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {facts.map(([k, v], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface flex gap-3 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="text-accent w-16 shrink-0 font-semibold">{k}</span>
              <span>{v}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You&apos;re the cloud architect. The department is leaving its ageing server room, and
        before any app moves, it needs a <Term id="landing-zone">landing zone</Term>: the foundation
        every team will build on.
      </p>
      <p>
        Every decision in the next step draws on a module in this track. There are no marks: the
        review afterwards explains what each choice means, and you can change your mind as often as
        you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

export function Choose() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const made = DECISIONS.filter((d) => choices[d.id]).length;
  return (
    <StepLayout
      eyebrow="Design"
      title="Make the choices"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {DECISIONS.map((d) => (
            <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-xs font-semibold">
                {d.area} <span className="text-muted font-normal">· module {d.module}</span>
              </p>
              <div className="mt-1 flex flex-wrap gap-1">
                {d.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => set({ choices: { ...choices, [d.id]: o.id } })}
                    className={cn(
                      "rounded-lg border px-2 py-1 text-left text-[11px]",
                      choices[d.id] === o.id
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to the review."}
          </p>
        </div>
      }
    >
      <p>
        Nine decisions, one per area. Choose what you would actually propose to the department. Some
        options are traps people really fall into; some are sensible but more than this department
        needs.
      </p>
      <p>Nothing is judged yet. The review comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ Review your design ⭐ ----------------------------------------------------------------------- */

const ORDER: Record<Verdict, number> = { bad: 0, warn: 1, good: 2 };

export function Review() {
  const [s] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const picked = DECISIONS.map((d) => ({
    d,
    o: d.options.find((o) => o.id === choices[d.id]),
  })).filter((x) => x.o) as { d: (typeof DECISIONS)[number]; o: Option }[];
  const sorted = [...picked].sort((a, b) => ORDER[a.o.verdict] - ORDER[b.o.verdict]);
  const open = DECISIONS.length - picked.length;
  return (
    <StepLayout
      eyebrow="Review"
      title="Review your design"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-5 gap-1.5">
            {PILLARS.map((p) => {
              const mine = picked.filter((x) => x.o.pillar === p);
              const worst = mine.reduce<Verdict>(
                (w, x) => (ORDER[x.o.verdict] < ORDER[w] ? x.o.verdict : w),
                "good",
              );
              return (
                <div
                  key={p}
                  className={cn(
                    "rounded-lg border px-1 py-2 text-center text-[10px]",
                    mine.length === 0
                      ? "border-line bg-surface text-muted"
                      : worst === "good"
                        ? "border-good/50 bg-good/10"
                        : worst === "warn"
                          ? "border-accent/50 bg-accent-soft"
                          : "border-bad/50 bg-bad/10",
                  )}
                >
                  {p}
                </div>
              );
            })}
          </div>
          {picked.length === 0 && (
            <p className="text-muted text-sm">
              Make your choices in the previous step; the review appears here.
            </p>
          )}
          <div className="flex flex-col gap-1.5">
            {sorted.map(({ d, o }) => (
              <motion.div
                key={d.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex items-start gap-2 rounded-lg border px-3 py-1.5 text-xs",
                  o.verdict === "good"
                    ? "border-line bg-surface"
                    : o.verdict === "warn"
                      ? "border-accent/40 bg-accent-soft"
                      : "border-bad/50 bg-bad/10",
                )}
              >
                {o.verdict === "good" ? (
                  <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                ) : o.verdict === "warn" ? (
                  <AlertTriangle className="text-accent mt-0.5 size-3.5 shrink-0" />
                ) : (
                  <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                )}
                <span>
                  <span className="font-medium">{d.area}:</span> {o.finding}
                </span>
              </motion.div>
            ))}
          </div>
          {open > 0 && picked.length > 0 && (
            <p className="text-muted text-xs">{open} decisions not made yet.</p>
          )}
        </div>
      }
    >
      <p>
        Here is your design reviewed the way a well-architected review would (module 19): findings
        grouped by pillar, plus India&apos;s rules, highest risk first.
      </p>
      <p>
        Go back and change anything, and the review updates. A strong design here isn&apos;t the
        most expensive one: it meets the targets and rules with the least running cost and the
        fewest ways to fail.
      </p>
    </StepLayout>
  );
}

/* 4 ─ What to fix first -------------------------------------------------------------------------- */

export function FixFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What to fix first"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="fix-first"
            prompt="A colleague's design has these findings. Which must be fixed before go-live?"
            categories={[
              { id: "now", label: "Before go-live" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "key",
                label: "The deployment pipeline uses a long-lived admin access key",
                category: "now",
                why: "High risk: leaked keys are used within minutes.",
              },
              {
                id: "sg",
                label: "Disaster-recovery backups are copied to Singapore",
                category: "now",
                why: "Breaks data residency for government data.",
              },
              {
                id: "logs",
                label: "Logs are kept 30 days in each account",
                category: "now",
                why: "CERT-In requires 180 days within India.",
              },
              {
                id: "spot",
                label: "Nightly analytics jobs run on on-demand servers, not spot",
                category: "later",
                why: "A saving, not a risk.",
              },
              {
                id: "carbon",
                label: "Nobody has compared the regions' carbon intensity",
                category: "later",
                why: "Worth doing; residency already limits the choice.",
              },
              {
                id: "budget",
                label: "No budget alerts on any account",
                category: "now",
                why: "A high-risk issue in AWS's framework: a runaway cost shows up only on the invoice.",
              },
            ]}
            explanation="Security, legal and recovery gaps block a launch; savings and refinements go on the improvement plan."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s design is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Renting computing, regions, zones and shared responsibility."],
  ["Compute", "VMs, containers and functions; autoscaling and load balancers."],
  ["Networking", "Private networks, getting in and out, connecting networks, DNS."],
  ["Identity and security", "IAM, workload identity, encryption and guardrails."],
  ["Organising the cloud", "Accounts, landing zones and infrastructure as code."],
  ["Data, resilience and cost", "Storage, recovery, FinOps and well-architected reviews."],
  ["In practice", "India's rules, migration, and this foundation."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="The whole track"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {CHAPTERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That&apos;s Cloud Architecture: twenty-two modules from &ldquo;why rent a computer&rdquo; to
        a foundation a real department could build on.
      </p>
      <p>
        The habits carry over to any cloud: contain the blast radius, prefer short-lived
        credentials, make the safe way the default, write it as code, know your recovery targets,
        watch the bill, and check the rules before the region.
      </p>
    </StepLayout>
  );
}

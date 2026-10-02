"use client";

import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Check, Minus, Search } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { WaState } from "./state";

/* 1 ─ A house inspection ------------------------------------------------------------------------- */

export function Inspection() {
  const rooms = [
    "Foundations and walls",
    "Wiring and locks",
    "Plumbing and leaks",
    "Running costs",
    "Insulation and energy",
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A house inspection"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs">
            Before you buy a flat, an inspector walks through it with you, area by area:
          </p>
          {rooms.map((r, i) => (
            <motion.div
              key={r}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <Search className="text-accent size-4" /> {r}
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            You get a list: fix the gas leak now, the cracked tile someday. Nobody fails.
          </p>
        </div>
      }
    >
      <p>
        Eighteen modules have each taught one area. A{" "}
        <Term id="well-architected-review">well-architected review</Term> walks a whole design
        through all of them, like an inspector with a checklist, and ends with a list of what to fix
        first.
      </p>
      <p>
        AWS describes it as a &ldquo;lightweight process (hours not days) that is a conversation and
        not an audit&rdquo;, best done early in design and again before go-live. Its tool is free;
        so are Azure&apos;s and Google&apos;s equivalents.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The pillars --------------------------------------------------------------------------------- */

const PILLARS: { name: string; q: string; aws: string; azure: string; gcp: string }[] = [
  {
    name: "Security",
    q: "Who can get in, and what can they reach?",
    aws: "Security",
    azure: "Security",
    gcp: "Security, privacy, and compliance",
  },
  {
    name: "Reliability",
    q: "What happens when something fails?",
    aws: "Reliability",
    azure: "Reliability",
    gcp: "Reliability",
  },
  {
    name: "Cost",
    q: "Are we paying only for what we need?",
    aws: "Cost Optimization",
    azure: "Cost Optimization",
    gcp: "Cost optimization",
  },
  {
    name: "Operations",
    q: "Can we see, change and fix it safely?",
    aws: "Operational Excellence",
    azure: "Operational Excellence",
    gcp: "Operational excellence",
  },
  {
    name: "Performance",
    q: "Is it fast enough, and does it scale?",
    aws: "Performance Efficiency",
    azure: "Performance Efficiency",
    gcp: "Performance optimization",
  },
  {
    name: "Sustainability",
    q: "How much energy and carbon does it use?",
    aws: "Sustainability (since 2021)",
    azure: "A guide, not a pillar",
    gcp: "Sustainability (since 2026)",
  },
];

export function Pillars() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The pillars"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <div className="border-line overflow-x-auto rounded-xl border">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2">
                <tr>
                  <th className="px-2 py-1.5">Pillar</th>
                  <th className="px-2 py-1.5">AWS</th>
                  <th className="px-2 py-1.5">Azure</th>
                  <th className="px-2 py-1.5">Google Cloud</th>
                </tr>
              </thead>
              <tbody>
                {PILLARS.map((p) => (
                  <tr key={p.name} className="border-line border-t">
                    <td className="px-2 py-1.5">
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-muted text-[10px]">{p.q}</p>
                    </td>
                    <td className="px-2 py-1.5">{p.aws}</td>
                    <td
                      className={cn("px-2 py-1.5", p.azure.startsWith("A guide") && "text-muted")}
                    >
                      {p.azure}
                    </td>
                    <td className="px-2 py-1.5">{p.gcp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
    >
      <p>
        Each cloud groups good practice into <Term id="wa-pillar">pillars</Term>, and they almost
        line up. AWS has six; Azure five, with sustainability as a separate guide; Google six since
        adding sustainability in January 2026.
      </p>
      <p>
        Each pillar is a set of questions with best practices underneath, and specialist
        &ldquo;lenses&rdquo; or &ldquo;perspectives&rdquo; add more for serverless, SaaS, financial
        services or generative AI.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Review a design ⭐ -------------------------------------------------------------------------- */

type Risk = "High" | "Medium" | "None";

const PARTS: {
  id: string;
  label: string;
  detail: string;
  col: number;
  row: number;
  pillar: string;
  risk: Risk;
  bp: string;
  finding: string;
}[] = [
  {
    id: "region",
    label: "Mumbai region",
    detail: "ap-south-1",
    col: 0,
    row: 0,
    pillar: "Sustainability",
    risk: "None",
    bp: "SUS01-BP01",
    finding:
      "No issue: close to users and meets data residency. Region carbon is worth knowing: Google reports Mumbai at 20% carbon-free energy, Delhi 39%.",
  },
  {
    id: "lb",
    label: "Load balancer",
    detail: "public, HTTPS",
    col: 1,
    row: 0,
    pillar: "—",
    risk: "None",
    bp: "",
    finding: "No issue: TLS terminates here and it spans zones.",
  },
  {
    id: "web",
    label: "2 web servers",
    detail: "both in ap-south-1a",
    col: 1,
    row: 1,
    pillar: "Reliability",
    risk: "High",
    bp: "REL10-BP01 Deploy the workload to multiple locations",
    finding:
      "Both servers in one zone: a zone outage takes the portal down. Spread them across zones.",
  },
  {
    id: "db",
    label: "Database",
    detail: "single instance, 1a",
    col: 1,
    row: 2,
    pillar: "Reliability",
    risk: "High",
    bp: "REL10-BP01 Deploy the workload to multiple locations",
    finding: "No standby: add a Multi-AZ standby so the database survives a zone failure.",
  },
  {
    id: "backup",
    label: "Backup bucket",
    detail: "nightly copies",
    col: 2,
    row: 2,
    pillar: "Reliability",
    risk: "Medium",
    bp: "REL09-BP04 Perform periodic recovery of the data to verify backup integrity and processes",
    finding: "Backups have never been restored. Schedule test restores (module 17).",
  },
  {
    id: "repo",
    label: "Config repo",
    detail: "deploy settings",
    col: 2,
    row: 0,
    pillar: "Security",
    risk: "High",
    bp: "SEC02-BP02 Use temporary credentials · SEC02-BP03 Store and use secrets securely",
    finding:
      "An admin access key sits in a config file. Replace with a role and federation (module 10).",
  },
  {
    id: "billing",
    label: "Billing account",
    detail: "one invoice",
    col: 0,
    row: 2,
    pillar: "Cost",
    risk: "High",
    bp: "COST01-BP03 Establish cloud budgets and forecasts",
    finding:
      "No budget or alerts, and nothing is tagged: a runaway cost would show up only on the invoice (module 18).",
  },
  {
    id: "monitor",
    label: "Monitoring",
    detail: "default metrics only",
    col: 0,
    row: 1,
    pillar: "Operations",
    risk: "High",
    bp: "OPS08-BP04 Create actionable alerts",
    finding:
      "No alarms: students report outages before the team knows. Add alerts on errors and latency.",
  },
];

const RISK_ORDER: Record<Risk, number> = { High: 0, Medium: 1, None: 2 };

export function Review() {
  const [s, set] = useSceneState<WaState>();
  const found = s.found ?? [];
  const real = PARTS.filter((p) => p.risk !== "None");
  const plan = PARTS.filter((p) => found.includes(p.id) && p.risk !== "None").sort(
    (a, b) => RISK_ORDER[a.risk] - RISK_ORDER[b.risk],
  );
  const remaining = real.filter((p) => !found.includes(p.id)).length;
  const last = PARTS.find((p) => p.id === found[found.length - 1]);
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Review a design"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col gap-2">
            <p className="text-muted text-xs">
              A state scholarship portal. Click each part to inspect it.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PARTS.map((p) => {
                const on = found.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => !on && set({ found: [...found, p.id] })}
                    style={{ gridColumn: p.col + 1, gridRow: p.row + 1 }}
                    className={cn(
                      "rounded-lg border px-2 py-2 text-left",
                      !on
                        ? "border-line bg-surface hover:bg-surface-2"
                        : p.risk === "None"
                          ? "border-good/50 bg-good/10"
                          : p.risk === "High"
                            ? "border-bad/60 bg-bad/10"
                            : "border-accent/60 bg-accent-soft",
                    )}
                  >
                    <p className="text-xs font-semibold">{p.label}</p>
                    <p className="text-muted text-[10px]">{p.detail}</p>
                  </button>
                );
              })}
            </div>
            {last && (
              <motion.div
                key={last.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
              >
                <p className="font-semibold">
                  {last.label}
                  {last.risk !== "None" && (
                    <span
                      className={cn(
                        "ml-2 rounded-full px-1.5 py-0.5 text-[10px]",
                        last.risk === "High" ? "bg-bad/15 text-bad" : "bg-accent-soft text-accent",
                      )}
                    >
                      {last.risk} risk · {last.pillar}
                    </span>
                  )}
                </p>
                <p className="mt-1">{last.finding}</p>
                {last.bp && <p className="text-muted mt-1 font-mono text-[10px]">{last.bp}</p>}
              </motion.div>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold">Improvement plan</p>
            {plan.length === 0 && (
              <p className="text-muted text-xs">Findings appear here, highest risk first.</p>
            )}
            {plan.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 text-xs"
              >
                <span
                  className={cn(
                    "mt-0.5 rounded px-1 text-[10px]",
                    p.risk === "High" ? "bg-bad/15 text-bad" : "bg-accent-soft text-accent",
                  )}
                >
                  {i + 1}
                </span>
                <span>
                  <span className="font-medium">{p.label}:</span>{" "}
                  <span className="text-muted">{p.finding.split(".")[0]}.</span>
                </span>
              </motion.div>
            ))}
            <p className="text-muted mt-1 text-[11px]">
              {remaining > 0
                ? `${remaining} more ${remaining === 1 ? "issue is" : "issues are"} hiding in the design.`
                : "All issues found. Now it's a plan, not a verdict."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Here is a real-shaped design for a portal where students apply for scholarships. Inspect
        each part. Some are fine; others map to a best practice the frameworks call out, with a risk
        level.
      </p>
      <p>
        AWS calls the serious ones <Term id="high-risk-issue">high-risk issues</Term>: choices that
        &ldquo;might result in significant negative impact to a business&rdquo;. The output of a
        review is an improvement plan, highest risk first, not a score.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Every fix has a price ⭐ -------------------------------------------------------------------- */

type Effect = 1 | -1 | 0;

const CHANGES: {
  id: string;
  name: string;
  effects: Record<string, Effect>;
  quote: string;
  note: string;
}[] = [
  {
    id: "zones",
    name: "Run copies in a second zone",
    effects: { Reliability: 1, Cost: -1, Security: 0, Operations: 0, Performance: 0 },
    quote: "“higher replica count, which leads to increased costs”",
    note: "Usually worth it for anything users depend on.",
  },
  {
    id: "regions",
    name: "Go active-active in two regions",
    effects: { Reliability: 1, Cost: -1, Security: -1, Operations: -1, Performance: 0 },
    quote: "“Replicas, by design, increase the workload's surface area”",
    note: "AWS lists going multi-region when multi-zone would do as an anti-pattern. Match it to the RTO and RPO (module 17).",
  },
  {
    id: "inspect",
    name: "Inspect all traffic through a firewall",
    effects: { Security: 1, Performance: -1, Cost: -1, Reliability: 0, Operations: 0 },
    quote: "inspection controls “add latency to requests”",
    note: "Often required; size it and measure the latency.",
  },
  {
    id: "logs",
    name: "Cut log retention to save money",
    effects: { Cost: 1, Operations: -1, Security: -1, Reliability: 0, Performance: 0 },
    quote: "“Decreasing log and metric volume… reduces system observability”",
    note: "Mind legal minimums such as CERT-In's 180 days. Azure's advice: “don't compromise on security to gain cost optimizations”.",
  },
  {
    id: "spot",
    name: "Move batch jobs to spot capacity",
    effects: { Cost: 1, Reliability: -1, Security: 0, Operations: 0, Performance: 0 },
    quote: "Interruptible capacity trades reliability for price.",
    note: "Fine for restartable work (module 18).",
  },
];

const PILLAR_NAMES = ["Security", "Reliability", "Cost", "Operations", "Performance"];

export function TradeOffs() {
  const [s, set] = useSceneState<WaState>();
  const ch = CHANGES.find((c) => c.id === s.change) ?? CHANGES[0];
  return (
    <StepLayout
      eyebrow="Explore · quotes from Azure's trade-off guidance"
      title="Every fix has a price"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col gap-1">
            {CHANGES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => set({ change: c.id })}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-left text-xs",
                  c.id === ch.id
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface hover:bg-surface-2",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {PILLAR_NAMES.map((p) => {
              const e = ch.effects[p] ?? 0;
              const Icon = e > 0 ? ArrowUp : e < 0 ? ArrowDown : Minus;
              return (
                <motion.div
                  key={ch.id + p}
                  initial={{ scale: 0.95, opacity: 0.5 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg border px-1 py-2 text-center",
                    e > 0
                      ? "border-good/50 bg-good/10"
                      : e < 0
                        ? "border-bad/50 bg-bad/10"
                        : "border-line bg-surface",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4",
                      e > 0 ? "text-good" : e < 0 ? "text-bad" : "text-muted",
                    )}
                  />
                  <span className="text-[10px]">{p}</span>
                </motion.div>
              );
            })}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
            <p className="italic">{ch.quote}</p>
            <p className="text-muted mt-1">{ch.note}</p>
          </div>
        </div>
      }
    >
      <p>
        Pillars pull against each other. More copies raise reliability and cost; more inspection
        raises security and latency; fewer logs save money and leave you blind. Pick a change to see
        what it helps and what it costs.
      </p>
      <p>
        A good review doesn&apos;t maximise every pillar. It makes each trade-off on purpose,
        written down, matched to what the system actually needs.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which pillar? ------------------------------------------------------------------------------- */

export function WhichPillar() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which pillar?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-pillar"
            prompt="Which pillar does each finding belong to?"
            categories={[
              { id: "sec", label: "Security" },
              { id: "rel", label: "Reliability" },
              { id: "cost", label: "Cost" },
              { id: "ops", label: "Operations" },
              { id: "perf", label: "Performance" },
              { id: "sus", label: "Sustainability" },
            ]}
            items={[
              {
                id: "restore",
                label: "Backups have never been restored",
                category: "rel",
                why: "REL09-BP04: verify backups by recovering from them.",
              },
              {
                id: "key",
                label: "A long-lived admin key in the deployment scripts",
                category: "sec",
                why: "SEC02: use temporary credentials, store secrets securely.",
              },
              {
                id: "budget",
                label: "No budget alerts on the account",
                category: "cost",
                why: "COST01-BP03: establish budgets and forecasts.",
              },
              {
                id: "alarm",
                label: "The team learns about outages from users",
                category: "ops",
                why: "OPS08-BP04: create actionable alerts.",
              },
              {
                id: "slow",
                label: "Pages slow down badly at exam time; nothing caches",
                category: "perf",
                why: "Scaling and caching are performance concerns.",
              },
              {
                id: "carbon",
                label: "Batch jobs could run in a lower-carbon region where residency allows",
                category: "sus",
                why: "SUS01-BP01: choose a region on business needs and sustainability goals.",
              },
            ]}
            explanation="Every finding maps to a pillar and a named best practice, which turns opinions into a shared checklist."
          />
        </div>
      }
    >
      <p>Six findings, six pillars.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Same pillars everywhere",
    "Security, reliability, cost, operations, performance, sustainability.",
  ],
  ["A conversation", "Hours, not days; early and before go-live; blame-free."],
  ["A plan, not a score", "Findings ranked by risk, each tied to a best practice."],
  ["Trade-offs on purpose", "Every fix helps one pillar and costs another."],
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
              <p className="flex items-center gap-1.5 font-semibold">
                <Check className="text-good size-4" />
                {t}
              </p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        That completes the data, resilience and cost chapter. The last chapter puts it into
        practice, starting with the cloud in India.
      </p>
    </StepLayout>
  );
}

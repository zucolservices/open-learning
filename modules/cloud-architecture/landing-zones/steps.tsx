"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, Circle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { LzState } from "./state";

type Cloud = LzState["cloud"];

const CLOUDS: [Cloud, string][] = [
  ["aws", "AWS"],
  ["azure", "Azure"],
  ["gcp", "Google Cloud"],
];

/* 1 ─ Roads before houses ------------------------------------------------------------------------ */

export function Township() {
  const items = [
    "Roads and plot numbers",
    "Water and power lines",
    "A security gate with a visitor log",
    "Society rules",
    "A form to buy a plot",
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Roads before houses"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <p className="text-muted text-xs">
            Before the first family moves in, a planned township already has:
          </p>
          {items.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <Check className="text-good size-4" /> {t}
            </motion.div>
          ))}
          <p className="text-muted text-xs">
            Each new house plugs in on day one, instead of digging its own well.
          </p>
        </div>
      }
    >
      <p>
        The last few modules built the pieces: networks and hubs, identity, encryption, guardrails
        and the account tree. A <Term id="landing-zone">landing zone</Term> puts them together as
        prepared ground that every new team lands on.
      </p>
      <p>
        Microsoft defines it as &ldquo;a proven and flexible architecture for governing, securing,
        and scaling a multi-subscription Azure environment&rdquo;; AWS and Google say much the same.
        Build it once, centrally, and every new account arrives with the roads, pipes and gate
        already there.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Assemble a landing zone ⭐ ------------------------------------------------------------------- */

type Fit = "yes" | "part" | "no";

const PIECES: { id: string; name: string; risk: string; by: Record<Cloud, [Fit, string]> }[] = [
  {
    id: "tree",
    name: "Account tree and guardrails",
    risk: "Every team invents its own rules; one mistake can reach everything.",
    by: {
      aws: ["yes", "Control Tower: organisation, OUs and controls"],
      azure: ["yes", "Management group hierarchy and Azure Policy assignments"],
      gcp: ["yes", "Folders and organization policies (stage 1-org)"],
    },
  },
  {
    id: "identity",
    name: "Single sign-on for people",
    risk: "Separate passwords per account; leavers keep access.",
    by: {
      aws: ["yes", "IAM Identity Center"],
      azure: [
        "part",
        "Uses your Microsoft Entra tenant; an Identity subscription for domain controllers if needed",
      ],
      gcp: ["part", "Uses your Cloud Identity or Workspace groups"],
    },
  },
  {
    id: "logs",
    name: "Central log archive",
    risk: "An attacker with admin in one account can delete the evidence.",
    by: {
      aws: ["yes", "Log Archive account receiving the organisation's CloudTrail and Config logs"],
      azure: ["yes", "Log Analytics workspace in the Management subscription"],
      gcp: ["yes", "Organisation-level log sinks to a central logging project"],
    },
  },
  {
    id: "security",
    name: "Security tooling account",
    risk: "Nobody sees threats across all accounts in one place.",
    by: {
      aws: ["yes", "Audit account; Security Hub and GuardDuty with a delegated admin"],
      azure: ["yes", "Security subscription: Microsoft Defender for Cloud, Sentinel"],
      gcp: ["yes", "Security Command Center at organisation level"],
    },
  },
  {
    id: "network",
    name: "Shared network hub and IP plan",
    risk: "Overlapping address ranges; every team builds its own way out to the internet.",
    by: {
      aws: [
        "part",
        "Not in Control Tower itself; Landing Zone Accelerator adds Transit Gateway and IPAM",
      ],
      azure: ["yes", "Connectivity subscription: hub-and-spoke or Virtual WAN"],
      gcp: ["yes", "Shared VPC or hub-and-spoke (stage 3-networks)"],
    },
  },
  {
    id: "vending",
    name: "Account vending",
    risk: "New accounts are hand-made, slowly, each a bit different.",
    by: {
      aws: ["yes", "Account Factory, or Account Factory for Terraform"],
      azure: ["yes", "Subscription vending module"],
      gcp: ["yes", "Project factory (stage 4-projects)"],
    },
  },
];

const FIT_ICON = { yes: Check, part: Circle, no: Circle };

export function Assemble() {
  const [s, set] = useSceneState<LzState>();
  const have = s.pieces ?? [];
  const toggle = (id: string) =>
    set({ pieces: have.includes(id) ? have.filter((x) => x !== id) : [...have, id] });
  const missing = PIECES.filter((p) => !have.includes(p.id));
  return (
    <StepLayout
      eyebrow="Build"
      title="Assemble a landing zone"
      stage={
        <div className="grid flex-1 content-center gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-muted text-xs">Add the pieces</p>
            {PIECES.map((p) => {
              const on = have.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => toggle(p.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm",
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded border",
                      on ? "border-accent bg-accent text-accent-fg" : "border-line",
                    )}
                  >
                    {on && <Check className="size-3" />}
                  </span>
                  {p.name}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col gap-2">
            {missing.length ? (
              <div className="flex flex-col gap-1">
                <p className="text-muted text-xs">Still risky</p>
                {missing.map((p) => (
                  <motion.p
                    key={p.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-bad/10 flex gap-1.5 rounded-md px-2 py-1 text-xs"
                  >
                    <AlertTriangle className="text-bad mt-0.5 size-3.5 shrink-0" />
                    {p.risk}
                  </motion.p>
                ))}
              </div>
            ) : (
              <p className="bg-good/10 rounded-lg px-3 py-2 text-sm">
                A complete landing zone. Now compare it with what each cloud&apos;s blueprint gives
                you.
              </p>
            )}
            <div className="border-line mt-1 flex flex-col gap-1.5 rounded-lg border px-3 py-2">
              <Segmented
                size="sm"
                value={s.cloud}
                options={CLOUDS}
                onChange={(v) => set({ cloud: v })}
              />
              {PIECES.filter((p) => have.includes(p.id)).map((p) => {
                const [fit, how] = p.by[s.cloud];
                const Icon = FIT_ICON[fit];
                return (
                  <p key={p.id} className="flex gap-1.5 text-[11px]">
                    <Icon
                      className={cn(
                        "mt-0.5 size-3 shrink-0",
                        fit === "yes" ? "text-good" : "text-muted",
                      )}
                    />
                    <span>
                      <span className="font-medium">{p.name}:</span>{" "}
                      <span className="text-muted">{how}</span>
                    </span>
                  </p>
                );
              })}
              {have.length === 0 && (
                <p className="text-muted text-[11px]">
                  Add pieces to see what the blueprint provides.
                </p>
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Add each piece and watch the risks it removes. Then pick a cloud to see which of its
        blueprints provides it: a tick means the standard blueprint sets it up; an open circle means
        you bring it or add it.
      </p>
      <p>
        AWS Control Tower&apos;s classic layout puts a Log Archive and an Audit account in a
        Security OU. Since version 4.0 (November 2025) almost every part is optional, so you can
        shape it to your own tree.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Vend a new account ⭐ ------------------------------------------------------------------------- */

const VEND: { title: string; text: string; adds: [string, string] }[] = [
  {
    title: "1. A team asks",
    text: "The GST analytics team fills in a short request, or opens a pull request: name, environment, owner, cost centre.",
    adds: ["Request", "gst-analytics-prod · owner: tax-data team · cost-centre: 4410"],
  },
  {
    title: "2. The account is created in the right folder",
    text: "It lands in Workloads › Prod, so it inherits every production guardrail at once.",
    adds: ["Folder", "Workloads › Prod (guardrails inherited)"],
  },
  {
    title: "3. Baseline applied",
    text: "Logs flow to the central archive, security tooling enrols it, and nobody in the team can switch that off.",
    adds: ["Baseline", "Logging to archive · security tooling · encryption defaults"],
  },
  {
    title: "4. Network attached",
    text: "The IP plan hands out the next free, non-overlapping range, and the network attaches to the hub.",
    adds: ["Network", "10.20.12.0/22 · attached to the hub"],
  },
  {
    title: "5. Access and budget",
    text: "The team's group gets a role through single sign-on; a budget alerts them before the bill surprises anyone.",
    adds: ["Access", "tax-data-engineers via SSO · budget alert ₹1.5 lakh/month"],
  },
  {
    title: "6. Handed over",
    text: "Minutes, not weeks. Every account made this way is identical in its foundations, and the whole recipe is code.",
    adds: ["Status", "Ready"],
  },
];

export function Vend() {
  const [s, set] = useSceneState<LzState>();
  const f = VEND[s.frame] ?? VEND[0];
  return (
    <StepLayout
      eyebrow="Step through · illustrative"
      title="Vend a new account"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface flex flex-col gap-1 rounded-xl border px-3 py-2 text-xs">
            <p className="text-sm font-semibold">New account</p>
            {VEND.map((v, i) => (
              <motion.div
                key={v.title}
                animate={{ opacity: i <= s.frame ? 1 : 0.2 }}
                className="flex gap-2"
              >
                <span className="text-muted w-16 shrink-0">{v.adds[0]}</span>
                <span className={cn(i === s.frame && "text-accent font-medium")}>
                  {i <= s.frame ? v.adds[1] : "—"}
                </span>
              </motion.div>
            ))}
          </div>
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === VEND.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={VEND.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        The landing zone earns its keep when a new team arrives.{" "}
        <Term id="account-vending">Account vending</Term> turns a request into a ready account with
        the foundations built in.
      </p>
      <p>
        AWS calls it Account Factory (built on Service Catalog) or Account Factory for Terraform;
        Azure has a subscription vending module; Google&apos;s blueprint has a project factory. On
        AWS, moving an existing account into an OU now applies that OU&apos;s baseline
        automatically.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Each cloud's blueprint ------------------------------------------------------------------------ */

const TOOLS: Record<Cloud, [string, string][]> = {
  aws: [
    [
      "AWS Control Tower",
      "Sets up and governs the multi-account environment. Free; you pay for the services it turns on (Config, CloudTrail…). Available in Mumbai and Hyderabad.",
    ],
    [
      "Landing Zone Accelerator",
      "Open-source add-on that deploys networking, security services and compliance-mapped settings. Its universal configuration costs about $1,372 a month before any workload: a landing zone has a running cost.",
    ],
    ["Account Factory for Terraform", "Vends and customises accounts from a git repo."],
  ],
  azure: [
    [
      "Azure landing zone",
      "Eight design areas, from billing and Entra tenants to platform automation. A platform landing zone (identity, management, connectivity, security) serves many workload landing zones.",
    ],
    [
      "Accelerators",
      "Deploy from the portal, or as code with Azure Verified Modules for Terraform or Bicep (the older enterprise-scale Terraform module is archived).",
    ],
    [
      "Subscription vending",
      "A module that creates subscriptions with networking, budgets and access in place.",
    ],
  ],
  gcp: [
    [
      "Cloud Setup",
      "A guided checklist in the console for proof-of-concept or production foundations; can export the result as Terraform.",
    ],
    [
      "Enterprise foundations blueprint",
      "Terraform in stages: bootstrap, organisation, environments, networks, projects, app infrastructure.",
    ],
    [
      "Cloud Foundation Fabric (FAST)",
      "An opinionated, community-maintained alternative in Terraform.",
    ],
  ],
};

export function Blueprints() {
  const [s, set] = useSceneState<LzState>();
  return (
    <StepLayout
      eyebrow="Explore"
      title="Each cloud's blueprint"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={s.tools}
            options={CLOUDS}
            onChange={(v) => set({ tools: v })}
          />
          {TOOLS[s.tools].map(([t, d], i) => (
            <motion.div
              key={s.tools + t}
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
        Nobody builds a landing zone from a blank page. Each cloud publishes one, and they agree on
        the shape: a platform layer run centrally, and workload accounts that teams own.
      </p>
      <p>
        Regulated sectors in India add their own requirements. SEBI&apos;s 2023 cloud framework, for
        example, requires regulated entities to use MeitY-empanelled providers and to keep ownership
        of their data, keys and logs. Those become guardrails and logging settings in the landing
        zone.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Good practice or pitfall? -------------------------------------------------------------------- */

export function GoodOrPitfall() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good practice or pitfall?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="lz-pitfalls"
            prompt="Sort each habit."
            categories={[
              { id: "good", label: "Good practice" },
              { id: "bad", label: "Pitfall" },
            ]}
            items={[
              {
                id: "mgmt",
                label: "Running a few workloads in the organisation's management account",
                category: "bad",
                why: "Guardrails like SCPs don't apply there; keep it for billing and governance only.",
              },
              {
                id: "ipam",
                label: "Handing out network ranges from one central IP plan",
                category: "good",
                why: "No overlaps, so any two networks can later be connected.",
              },
              {
                id: "click",
                label: "Fixing the landing zone's own resources by hand in the console",
                category: "bad",
                why: "AWS warns this can leave Control Tower in an unknown state; change it through code.",
              },
              {
                id: "vend",
                label: "Creating every new account through the vending pipeline",
                category: "good",
                why: "Identical foundations, recorded in code.",
              },
              {
                id: "logs",
                label: "Keeping logs in an account that workload admins can't touch",
                category: "good",
                why: "Evidence survives a compromised workload account.",
              },
              {
                id: "allstrict",
                label: "Applying production's strictest rules to sandboxes too",
                category: "bad",
                why: "Teams get blocked and work around the platform. Centralise only what clearly pays off.",
              },
            ]}
            explanation="A landing zone should make the safe way the easy way."
          />
        </div>
      }
    >
      <p>Six habits seen in real landing zones.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Prepared ground", "Tree, guardrails, identity, logs, security, network."],
  ["Platform vs workloads", "A central platform team serves many owning teams."],
  ["Vend, don't hand-make", "New accounts in minutes, identical foundations."],
  ["Start from a blueprint", "Control Tower, Azure landing zones, Google's foundation."],
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
        Every blueprint here is delivered as code. Next: infrastructure as code itself, and why
        clicking in the console doesn&apos;t scale.
      </p>
    </StepLayout>
  );
}

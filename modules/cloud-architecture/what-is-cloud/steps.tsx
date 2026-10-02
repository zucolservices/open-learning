"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OWN_PER_SERVER_DAY, RENT_PER_SERVER_DAY, WORKLOADS, demand } from "./demand";
import type { WhatIsCloudState } from "./state";

type Model = WhatIsCloudState["model"];

/* 2 ─ Who manages what ------------------------------------------------------------------------ */

/** Top to bottom; the number is the lowest layer you still manage under each model. */
const LAYERS = [
  "Your data, and who can see it",
  "Your application",
  "Runtime and libraries",
  "Operating system",
  "Virtualisation",
  "Servers and storage",
  "Network",
  "Building, power and cooling",
];

/** How many layers from the top are yours. */
const YOURS: Record<Model, number> = { onprem: 8, iaas: 4, paas: 2, saas: 1 };

const MODELS: [Model, string][] = [
  ["onprem", "On premises"],
  ["iaas", "IaaS"],
  ["paas", "PaaS"],
  ["saas", "SaaS"],
];

const ABOUT: Record<Model, [string, string]> = {
  onprem: [
    "Everything is yours",
    "Your building, your servers, your software: total control, and every job is yours.",
  ],
  iaas: [
    "Rent the machines",
    "Amazon EC2, Azure Virtual Machines, Google Compute Engine; OpenStack if you build a cloud yourself.",
  ],
  paas: [
    "Hand over your code",
    "AWS Elastic Beanstalk, Azure App Service, Google Cloud Run: you bring the application, the platform runs and scales it.",
  ],
  saas: [
    "Use a finished product",
    "Microsoft 365, Google Workspace, Salesforce: you just use it. Your data, and who can see it, stay your job.",
  ],
};

export function WhoManages() {
  const [s, set] = useSceneState<WhatIsCloudState>();
  const mine = YOURS[s.model];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who manages what"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.model}
            options={MODELS}
            onChange={(v) => set({ model: v })}
          />
          <div className="flex flex-col gap-1">
            {LAYERS.map((l, i) => {
              const yours = i < mine;
              return (
                <motion.div
                  key={l}
                  layout
                  className={cn(
                    "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
                    yours ? "border-accent bg-accent-soft" : "border-line bg-surface-2 text-muted",
                  )}
                >
                  <span className={cn(yours && "font-medium")}>{l}</span>
                  <span className="text-[10px]">{yours ? "You" : "Provider"}</span>
                </motion.div>
              );
            })}
          </div>
          <motion.div
            key={s.model}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
          >
            <p className="font-semibold">{ABOUT[s.model][0]}</p>
            <p className="text-muted mt-0.5">{ABOUT[s.model][1]}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Cloud services come in three broad kinds, depending on how much of the stack the provider
        runs for you. Switch between them and watch the line move.
      </p>
      <p>
        <Term id="iaas">IaaS</Term> (infrastructure as a service) rents you virtual machines.{" "}
        <Term id="paas">PaaS</Term> (platform as a service) runs your code without you managing
        servers. <Term id="saas">SaaS</Term> (software as a service) is a finished application you
        log in to.
      </p>
      <p>
        One thing never moves: your data and who can see it. Even with SaaS, setting permissions
        badly is your mistake, not the provider&apos;s. Module 2 makes this precise. And a
        &ldquo;private cloud&rdquo; isn&apos;t the same as on premises: it means a cloud used by one
        organisation, which can sit in its own building or someone else&apos;s.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Own or rent? ⭐ (simulation, illustrative numbers) ----------------------------------------- */

const W = 320;
const H = 130;

export function OwnOrRent() {
  const [s, set] = useSceneState<WhatIsCloudState>();
  const d = demand(s.workload);
  const peak = Math.max(...d);
  const top = Math.max(peak, s.servers) + 1;
  const X = (i: number) => (i / 364) * W;
  const Y = (v: number) => H - (v / top) * (H - 8);
  const outageDays = d.filter((v) => v > s.servers).length;
  const ownCost = s.servers * 365 * OWN_PER_SERVER_DAY;
  const rentCost = d.reduce((a, v) => a + Math.ceil(v) * RENT_PER_SERVER_DAY, 0);
  const used = d.reduce((a, v) => a + Math.min(v, s.servers), 0) / (s.servers * 365);
  const about = WORKLOADS.find((w) => w[0] === s.workload)!;
  return (
    <StepLayout
      eyebrow="Simulation · illustrative numbers"
      title="Own or rent?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.workload}
            options={WORKLOADS.map(([k, n]) => [k, n] as [WhatIsCloudState["workload"], string])}
            onChange={(v) => set({ workload: v })}
          />
          <p className="text-muted text-xs">{about[2]}</p>
          <svg
            viewBox={`0 0 ${W} ${H + 14}`}
            className="bg-surface-2 w-full rounded-lg"
            role="img"
            aria-label="A year of demand against the servers you own"
          >
            {d.map((v, i) =>
              v > s.servers ? (
                <line
                  key={i}
                  x1={X(i)}
                  x2={X(i)}
                  y1={Y(v)}
                  y2={Y(s.servers)}
                  className="stroke-bad"
                  strokeWidth="1.2"
                />
              ) : null,
            )}
            <polyline
              points={d.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ")}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1.4"
            />
            <line
              x1="0"
              x2={W}
              y1={Y(s.servers)}
              y2={Y(s.servers)}
              className="stroke-fg"
              strokeDasharray="4 3"
            />
            <text x="4" y={Y(s.servers) - 3} className="fill-fg text-[7px]">
              {s.servers} servers you own
            </text>
            <text x="2" y={H + 11} className="fill-muted text-[7px]">
              Jan
            </text>
            <text x={W - 2} y={H + 11} textAnchor="end" className="fill-muted text-[7px]">
              Dec
            </text>
          </svg>
          <label className="flex items-center gap-2 text-xs">
            <span className="text-muted w-28 shrink-0">Servers you buy</span>
            <input
              type="range"
              min={1}
              max={25}
              value={s.servers}
              onChange={(e) => set({ servers: Number(e.target.value) })}
              className="accent-accent flex-1"
            />
            <span className="w-6 text-right font-mono">{s.servers}</span>
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2 text-xs",
                outageDays ? "border-bad/50 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">Own {s.servers} servers</p>
              <p className="font-mono text-lg">{ownCost.toLocaleString("en-IN")} units</p>
              <p className="text-muted">
                {outageDays
                  ? `Overloaded on ${outageDays} day${outageDays > 1 ? "s" : ""}. `
                  : "Never overloaded. "}
                Busy {Math.round(used * 100)}% of the time you paid for.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Rent what each day needs</p>
              <p className="font-mono text-lg">
                {Math.round(rentCost).toLocaleString("en-IN")} units
              </p>
              <p className="text-muted">
                Never overloaded; each server-day costs 2.5× more than owning one.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Three made-up systems, a year of daily demand, and a choice: buy servers, or rent exactly
        what each day needs. Renting a server for a day is assumed to cost 2.5 times as much as
        owning one for a day (purchase, power, space and care spread over its life). The numbers are
        illustrative; the shapes are the point.
      </p>
      <p>
        For the results portal, owning enough servers for the rush costs about five times as much as
        renting, because they sit idle all year; owning fewer means the site is overloaded around
        results day. For the steady system it flips: owning costs about half as much as renting,
        because there&apos;s no spike to pay for. Payroll sits in between.
      </p>
      <p>
        Real organisations reach the same conclusion. Most run a mix of their own and cloud servers,
        and a few move steady workloads back: 37signals, maker of Basecamp, says leaving AWS for its
        own servers in rented racks will save about $10 million over five years (their own
        estimate). Paying only for what you use, the <Term id="pay-as-you-go">pay-as-you-go</Term>{" "}
        model, pays off most when demand swings.
      </p>
    </StepLayout>
  );
}

/* 4 ─ IaaS, PaaS or SaaS? ---------------------------------------------------------------------- */

export function SortServices() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="IaaS, PaaS or SaaS?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="service-models"
            prompt="Which kind of service is each of these?"
            categories={[
              { id: "iaas", label: "IaaS" },
              { id: "paas", label: "PaaS" },
              { id: "saas", label: "SaaS" },
            ]}
            items={[
              {
                id: "vm",
                label: "Renting a virtual machine and installing your own database on it",
                category: "iaas",
                why: "You get a machine; the operating system and everything above it are yours.",
              },
              {
                id: "email",
                label: "Staff email and documents used in the browser",
                category: "saas",
                why: "A finished product: you manage users and data, not software.",
              },
              {
                id: "run",
                label: "Google Cloud Run: give it a container, it runs and scales it",
                category: "paas",
                why: "You bring the application; the platform handles servers and scaling.",
              },
              {
                id: "azvm",
                label: "Azure Virtual Machines",
                category: "iaas",
                why: "Rented machines; you patch the operating system.",
              },
              {
                id: "beanstalk",
                label: "AWS Elastic Beanstalk: upload your code, it sets up servers and scaling",
                category: "paas",
                why: "The platform runs the servers for your code.",
              },
              {
                id: "crm",
                label: "A customer-relationship app bought as a subscription",
                category: "saas",
                why: "You use the application; the vendor runs everything underneath.",
              },
            ]}
            explanation="The question to ask: what do I still have to look after? Everything above the operating system (IaaS), just my code (PaaS), or only my data and users (SaaS)."
          />
        </div>
      }
    >
      <p>Sort six services by how much the provider runs for you.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Rented, not bought", "Someone else's data centres, used through a website, paid by the meter."],
  ["Five traits", "Self-service, network access, shared pools, elasticity, metering (NIST, 2011)."],
  ["IaaS, PaaS, SaaS", "How much the provider runs for you. Your data is always yours to protect."],
  ["Best for swings", "Renting wins when demand varies; steady loads can be cheaper to own."],
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
        Next: where these data centres actually are, how they fail, and which security jobs stay
        yours.
      </p>
    </StepLayout>
  );
}

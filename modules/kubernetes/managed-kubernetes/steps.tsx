"use client";

import { motion } from "motion/react";
import { Car } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { extras, options } from "./prices";
import type { MkState } from "./state";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/* 1 ─ Own, lease or taxi ------------------------------------------------------------------------ */

export function OwnLease() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Own, lease, or take a taxi"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Build and maintain your own car",
              "Full control, and every repair is yours.",
              "Self-managed Kubernetes (kubeadm, on your own machines)",
            ],
            [
              "Lease the car, you still drive",
              "Someone else services the engine; you choose the route and fill the tank.",
              "EKS, GKE, AKS: provider runs the control plane, you run the nodes",
            ],
            [
              "Lease with a driver",
              "You say where to go; they handle the car too.",
              "GKE Autopilot, EKS Auto Mode, AKS Automatic",
            ],
            [
              "Take a taxi",
              "No car at all; pay per trip.",
              "Cloud Run, ECS with Fargate, Azure Container Apps",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr] items-start gap-3 rounded-lg border px-3 py-2"
            >
              <Car className="text-accent mt-0.5 size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
                <p className="mt-0.5 text-[11px]">{k}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Running the control plane yourself (etcd backups, upgrades, certificates) is hard and rarely
        worth it. Most teams use <Term id="managed-kubernetes">managed Kubernetes</Term>, which
        comes in several degrees of &ldquo;managed&rdquo;.
      </p>
      <p>Each step down the list hands more work to the provider, and changes how you pay.</p>
    </StepLayout>
  );
}

/* 2 ─ Price the same cluster ⭐ -------------------------------------------------------------------- */

export function PriceCluster() {
  const [s, set] = useSceneState<MkState>();
  const opts = options(s.nodes, s.region, s.requestPct);
  const add = s.extras ? extras(s.region) : 0;
  const max = Math.max(...opts.map((o) => o.monthly)) + add;
  const min = Math.min(...opts.map((o) => o.monthly));
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Price the same cluster"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={String(s.nodes)}
              options={[
                ["3", "3 nodes"],
                ["6", "6 nodes"],
                ["12", "12 nodes"],
              ]}
              onChange={(v) => set({ nodes: Number(v) })}
            />
            <Segmented
              size="sm"
              value={s.region}
              options={[
                ["us", "US"],
                ["mumbai", "Mumbai"],
              ]}
              onChange={(v) => set({ region: v })}
            />
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.extras}
                onChange={(e) => set({ extras: e.target.checked })}
                className="accent-accent"
              />
              Add a load balancer, NAT gateway, 300 GB disk
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs">
            <span className="flex justify-between">
              <span className="text-muted">
                Pods request this share of the nodes&apos; capacity (affects Autopilot only)
              </span>
              <span className="font-mono">{s.requestPct}%</span>
            </span>
            <input
              type="range"
              min={10}
              max={100}
              step={10}
              value={s.requestPct}
              onChange={(e) => set({ requestPct: Number(e.target.value) })}
              className="accent-accent"
            />
          </label>
          <div className="flex flex-col gap-1.5">
            {opts.map((o) => (
              <div key={o.id}>
                <div className="flex items-baseline justify-between gap-2 text-xs">
                  <span className="font-semibold">{o.name}</span>
                  <span className="font-mono">{usd(o.monthly + add)}/mo</span>
                </div>
                <div className="bg-surface-2 mt-0.5 h-2 rounded">
                  <motion.div
                    animate={{ width: `${((o.monthly + add) / max) * 100}%` }}
                    className={cn(
                      "h-2 rounded",
                      o.monthly === min
                        ? "bg-good"
                        : o.id === "autopilot"
                          ? "bg-viz-meta"
                          : "bg-accent/70",
                    )}
                  />
                </div>
                <p className="text-subtle text-[10px]">{o.how}</p>
              </div>
            ))}
          </div>
          <p className="text-muted text-[10px]">
            Illustrative: list prices read 2–3 October 2026, 730-hour month, on-demand, no discounts
            or free credits. Nodes are 4 vCPU / 16 GiB. AKS Free tier ($0 control plane, no SLA) and
            GKE&apos;s one free zonal cluster would lower some totals; check current pages.
          </p>
        </div>
      }
    >
      <p>
        The same three-node cluster on four providers. Most charge about $0.10 an hour for the
        control plane (roughly $73 a month), so the nodes dominate. Mumbai is a little dearer for
        x86 nodes, but Arm (Graviton) nodes are about 29% cheaper there.
      </p>
      <p>
        Autopilot bills what pods request, not whole nodes, so it wins when pods ask for little and
        loses when they ask for a lot. OpenShift adds a licence per 4 vCPUs for Red Hat&apos;s
        platform and support. A vendor report (Cast AI, 2026) found average Kubernetes CPU
        utilisation fell to 8% in 2025: most clusters pay for far more than they use.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What you hand over ------------------------------------------------------------------------- */

const ROWS: [string, boolean[]][] = [
  ["Control plane, etcd, API upgrades", [false, true, true, true]],
  ["Node OS patching and node upgrades", [false, false, true, true]],
  ["Choosing node sizes and scaling nodes", [false, false, true, true]],
  ["Kubernetes API, kubectl, Helm", [true, true, true, false]],
  ["Running your own operators and DaemonSets", [true, true, false, false]],
];
const COLS = [
  "Self-managed",
  "EKS / GKE / AKS",
  "Autopilot / Auto Mode / Automatic",
  "Cloud Run / Fargate / Container Apps",
];

export function HandOver() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="What you hand over"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[30rem] text-xs">
              <thead>
                <tr>
                  <th className="text-muted px-2 py-1 text-left font-normal" />
                  {COLS.map((c) => (
                    <th key={c} className="text-muted px-2 py-1 text-center font-normal">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, cells], i) => (
                  <tr key={label} className="border-line border-t">
                    <td className="px-2 py-1.5">{label}</td>
                    {cells.map((c, j) => (
                      <td key={j} className="px-2 py-1.5 text-center">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.03 * (i * 4 + j) }}
                          className={cn(
                            "inline-block rounded px-1.5 py-0.5 text-[10px]",
                            i < 3
                              ? c
                                ? "bg-good/15 text-good"
                                : "bg-surface-2 text-muted"
                              : c
                                ? "bg-good/15 text-good"
                                : "bg-surface-2 text-muted",
                          )}
                        >
                          {i < 3
                            ? c
                              ? "provider"
                              : "you"
                            : c
                              ? "yes"
                              : j === 3
                                ? "no"
                                : "limited"}
                        </motion.span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-line bg-surface rounded-xl border px-4 py-3 text-xs">
            <p className="mb-1 font-semibold">Costs that don&apos;t show on the node bill</p>
            <p className="text-muted">
              Load balancers (AWS ALB from $0.0225/h plus usage), NAT gateways ($0.045/h plus
              $0.045/GB in us-east-1), traffic between zones (AWS $0.01/GB each way), disks, and log
              ingestion ($0.50/GB on CloudWatch or Google Cloud Logging, $2.30/GB on Azure Log
              Analytics). Tools such as OpenCost (CNCF incubating) break the bill down by namespace.
            </p>
          </div>
        </div>
      }
    >
      <p>
        The more the provider manages, the less you can customise: the most managed modes restrict
        things like privileged DaemonSets or custom node setups. Serverless container services drop
        the Kubernetes API altogether.
      </p>
      <p>
        Google&apos;s own comparison puts it plainly: GKE &ldquo;is best suited for complex
        microservices&rdquo; and stateful applications. For one simple service, a serverless
        container platform is usually cheaper and simpler. (The details in this table are
        simplified.)
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which platform? ---------------------------------------------------------------------------- */

export function WhichPlatform() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which platform?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-platform"
            prompt="Where would you run each workload?"
            categories={[
              { id: "nodes", label: "Kubernetes, you run the nodes" },
              { id: "managed", label: "Kubernetes, provider runs the nodes" },
              { id: "serverless", label: "Serverless containers" },
            ]}
            items={[
              {
                id: "api",
                label: "One small API built by two developers",
                category: "serverless",
                why: "Cloud Run, ECS Express Mode or Container Apps: no cluster to run.",
              },
              {
                id: "platform",
                label: "Sixty services, GPUs and custom networking, with a platform team",
                category: "nodes",
                why: "Full control of node types, DaemonSets and operators.",
              },
              {
                id: "nopeople",
                label: "A team that wants the Kubernetes API but has nobody to patch nodes",
                category: "managed",
                why: "Autopilot, Auto Mode or AKS Automatic.",
              },
              {
                id: "agent",
                label: "A security agent that must run as a privileged DaemonSet on every node",
                category: "nodes",
                why: "The most managed modes restrict privileged workloads.",
              },
              {
                id: "event",
                label: "A job triggered by uploads a few times a day",
                category: "serverless",
                why: "Pay per run; nothing idles.",
              },
              {
                id: "spiky",
                label: "Many small services with uneven traffic, no special node needs",
                category: "managed",
                why: "Billing by pod requests suits uneven, small workloads.",
              },
            ]}
            explanation="Hand over as much as your needs allow: the less you run, the less can go wrong at 2 a.m."
          />
        </div>
      }
    >
      <p>Six workloads. Where should each run?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Control plane is cheap", "About $0.10/hour; nodes are the real bill."],
  ["Pick the level of managed", "Nodes yourself, nodes managed, or no cluster at all."],
  ["Utilisation is the lever", "Average CPU use is low; right-size requests and nodes."],
  ["Count the extras", "Load balancers, NAT, cross-zone traffic and logs add up."],
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
      <p>Next: the capstone, a payments API on Kubernetes.</p>
    </StepLayout>
  );
}

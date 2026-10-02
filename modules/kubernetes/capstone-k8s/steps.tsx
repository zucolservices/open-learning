"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, CreditCard, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DECISIONS, INCIDENTS, outcome, type Level, type Verdict } from "./model";
import type { CapState } from "./state";

/* 1 ─ The brief ---------------------------------------------------------------------------------- */

const NEEDS: [string, string][] = [
  ["Always up", "Merchants take payments around the clock; a minute down costs real money."],
  ["Busy days", "Volume quadruples during festival sales."],
  ["Safe releases", "Several releases a week, none of them allowed to take payments down."],
  [
    "Locked down",
    "It handles card and bank data: a breached pod must not become a breached company.",
  ],
  ["Routine operations", "Nodes get patched and Kubernetes upgraded without drama."],
];

export function Brief() {
  return (
    <StepLayout
      eyebrow="The brief"
      title="A payments API on Kubernetes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="border-accent/40 bg-accent-soft flex items-center gap-3 rounded-xl border px-4 py-3">
            <CreditCard className="text-accent size-6 shrink-0" />
            <p className="text-sm">
              An illustrative payments company moves its payments API onto a managed Kubernetes
              cluster spread over three zones. You decide how it runs.
            </p>
          </div>
          {NEEDS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[7.5rem_1fr] gap-2 rounded-lg border px-3 py-2 text-sm"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted">{d}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        You&apos;re the platform engineer. Every decision in the next step draws on a module in this
        track, from <Term id="deployment">Deployments</Term> and probes to RBAC and pod security.
      </p>
      <p>
        Then the bad day: seven things that really happen to clusters. There are no marks, and you
        can change your mind as often as you like.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Make the choices ⭐ ------------------------------------------------------------------------- */

const VERDICT_CLS: Record<Verdict, string> = {
  good: "text-good",
  warn: "text-accent",
  bad: "text-bad",
};

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
          {DECISIONS.map((d) => {
            const o = d.options.find((x) => x.id === choices[d.id]);
            return (
              <div key={d.id} className="border-line bg-surface rounded-xl border px-3 py-2">
                <p className="text-xs font-semibold">
                  {d.area} <span className="text-muted font-normal">· module {d.module}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {d.options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => set({ choices: { ...choices, [d.id]: opt.id } })}
                      className={cn(
                        "rounded-lg border px-2 py-1 text-left text-[11px]",
                        choices[d.id] === opt.id
                          ? "border-accent bg-accent-soft"
                          : "border-line hover:bg-surface-2",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {o && <p className={cn("mt-1 text-[10px]", VERDICT_CLS[o.verdict])}>{o.note}</p>}
              </div>
            );
          })}
          <p className="text-muted text-xs">
            {made < DECISIONS.length
              ? `${DECISIONS.length - made} decisions still open.`
              : "Every decision made. Continue to the bad day."}
          </p>
        </div>
      }
    >
      <p>
        Nine decisions, from replicas to where the database password lives. Choose what you would
        actually ship. Some options are traps people really fall into.
      </p>
      <p>A note under each choice says what it buys you. The real test comes next.</p>
    </StepLayout>
  );
}

/* 3 ─ The bad day ⭐ ------------------------------------------------------------------------------- */

const LEVEL: Record<Level, { cls: string; icon: typeof Check; label: string }> = {
  holds: { cls: "border-good/50 bg-good/10", icon: Check, label: "Holds" },
  degrades: { cls: "border-accent/50 bg-accent-soft", icon: AlertTriangle, label: "Degrades" },
  breaks: { cls: "border-bad/60 bg-bad/10", icon: X, label: "Breaks" },
};

export function BadDay() {
  const [s, set] = useSceneState<CapState>();
  const choices = s.choices ?? {};
  const inc = INCIDENTS.find((x) => x.id === s.incident) ?? INCIDENTS[0];
  const o = outcome(inc.id, choices);
  const all = INCIDENTS.map((x) => ({ x, o: outcome(x.id, choices) }));
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="The bad day"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {all.map(({ x, o: r }) => {
              const Icon = r ? LEVEL[r.level].icon : null;
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ incident: x.id })}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1 text-xs",
                    s.incident === x.id
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:bg-surface-2",
                  )}
                >
                  {Icon && r && (
                    <Icon
                      className={cn(
                        "size-3",
                        r.level === "holds"
                          ? "text-good"
                          : r.level === "breaks"
                            ? "text-bad"
                            : "text-accent",
                      )}
                    />
                  )}
                  {x.name}
                </button>
              );
            })}
          </div>
          <p className="text-sm">{inc.text}</p>
          <motion.div
            key={`${inc.id}-${JSON.stringify(choices)}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border px-4 py-3",
              o ? LEVEL[o.level].cls : "border-line bg-surface",
            )}
          >
            {o ? (
              <>
                <p className="font-semibold">
                  {LEVEL[o.level].label}{" "}
                  <span className="text-muted text-xs font-normal">· see module {o.module}</span>
                </p>
                <p className="text-sm">{o.text}</p>
              </>
            ) : (
              <p className="text-muted text-sm">
                The decision this depends on isn&apos;t made yet. Go back a step to choose.
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>
        Seven things that really happen to clusters. Pick one to see how your design copes; the
        icons show every result at a glance.
      </p>
      <p>
        Go back, change a choice, and come here again. Most incidents depend on two or three
        decisions together, as real ones do: in March 2023 a routine Kubernetes 1.23 → 1.24 upgrade
        took Reddit down for 314 minutes, because a networking component still looked for a node
        label the new version had removed; in 2017 a Kubernetes and etcd client bug set off a
        1½-hour payments outage at the UK bank Monzo.
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
            id="k8s-fix-first"
            prompt="A colleague's payments deployment has these findings. Which must be fixed before launch?"
            categories={[
              { id: "now", label: "Before launch" },
              { id: "later", label: "Improve later" },
            ]}
            items={[
              {
                id: "admin",
                label: "The API's service account is bound to cluster-admin",
                category: "now",
                why: "One compromised pod would own the cluster.",
              },
              {
                id: "live",
                label: "The liveness probe checks the database",
                category: "now",
                why: "A database blip restarts every pod at once.",
              },
              {
                id: "single",
                label: "It runs a single replica",
                category: "now",
                why: "Every restart, drain or node failure is an outage.",
              },
              {
                id: "arm",
                label: "Nodes are x86 when Arm would be cheaper",
                category: "later",
                why: "A saving, not a risk.",
              },
              {
                id: "vpa",
                label: "Requests were sized once and never revisited",
                category: "later",
                why: "Worth tuning with VPA recommendations, but not a blocker.",
              },
              {
                id: "dash",
                label: "There's no cost breakdown per namespace",
                category: "later",
                why: "Add OpenCost when you can.",
              },
            ]}
            explanation="Anything that can take payments down or hand an attacker the cluster blocks launch; cost and tuning go on the improvement list."
          />
        </div>
      }
    >
      <p>Reviewing someone else&apos;s deployment is half the job.</p>
    </StepLayout>
  );
}

/* 5 ─ The whole track ---------------------------------------------------------------------------- */

const CHAPTERS: [string, string][] = [
  ["The big picture", "Why Kubernetes, desired state and control loops, the cluster's parts."],
  ["Running workloads", "Pods, Deployments, health checks and the other controllers."],
  ["Networking", "Services and DNS, Ingress and Gateway API, network policies."],
  ["Configuration and storage", "ConfigMaps and Secrets, persistent volumes."],
  ["Scheduling and scaling", "Requests and limits, the scheduler, autoscaling, upgrades."],
  ["Security and operations", "RBAC, pod security, Helm and GitOps, debugging."],
  ["In practice", "Operators, managed Kubernetes and cost, and this capstone."],
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
        That&apos;s Kubernetes: twenty-three modules from &ldquo;why not just copy files to twenty
        servers&rdquo; to a payments API that survives a bad day.
      </p>
      <p>
        The habits carry over to any cluster: declare what you want and let controllers keep it,
        tell the cluster honestly what your pods need, spread for failure, budget your disruptions,
        grant the least access, and keep the truth in Git.
      </p>
    </StepLayout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Construction, Play } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TICKS, run } from "./model";
import type { DisState, Scenario } from "./state";

/* 1 ─ Road works --------------------------------------------------------------------------------- */

export function RoadWorks() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Road works on a busy highway"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Planned road works",
              "The crew closes lanes on purpose. A rule says at least two of three lanes must stay open, so they work one lane at a time.",
              "Voluntary disruption + PodDisruptionBudget",
            ],
            [
              "A landslide",
              "Nobody chose it and no rule prevents it. The lanes are gone until it's cleared.",
              "Involuntary disruption",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <Construction className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Nodes need patching, replacing and upgrading. Those are <em>voluntary</em> disruptions:
        someone chose them, so they can be paced. Hardware failures and zone outages are{" "}
        <em>involuntary</em>.
      </p>
      <p>
        A <Term id="pdb">PodDisruptionBudget</Term> is the &ldquo;two lanes open&rdquo; rule for an
        app. &ldquo;Involuntary disruptions cannot be prevented by PDBs; however they do count
        against the budget.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 2 ─ Drain the nodes ⭐ ---------------------------------------------------------------------------- */

const SCENARIOS: [Scenario, string][] = [
  ["one", "One node at a time"],
  ["two", "Two nodes at once"],
  ["all", "All three at once"],
];

export function DrainNodes() {
  const [s, set] = useSceneState<DisState>();
  const frames = run(s.scenario, s.pdb);
  const [tick, setTick] = useState(0);
  const [playing, setPlaying] = useState(false);
  const active = playing && tick < TICKS - 1;
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setTick((t) => Math.min(TICKS - 1, t + 1)), 550);
    return () => clearInterval(id);
  }, [active]);
  const f = frames[tick];
  const minReady = Math.min(...frames.slice(0, tick + 1).map((x) => x.readyWeb));
  const blockedSoFar = frames.slice(0, tick + 1).reduce((a, x) => a + x.blocked, 0);
  const done = tick === TICKS - 1;
  const stuck = done && f.pods.some((p) => p.node === null || f.cordoned[p.node ?? 0]);
  const restart = (patch: Partial<DisState>) => {
    set(patch);
    setTick(0);
    setPlaying(false);
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Drain the nodes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={s.scenario}
              options={SCENARIOS}
              onChange={(v) => restart({ scenario: v })}
            />
            <label className="flex items-center gap-1.5 text-xs">
              <input
                type="checkbox"
                checked={s.pdb}
                onChange={(e) => restart({ pdb: e.target.checked })}
                className="accent-accent"
              />
              PDB: web minAvailable 2
            </label>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={active}
              onClick={() => {
                if (done) setTick(0);
                setPlaying(true);
              }}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm disabled:opacity-50"
            >
              <Play className="size-3.5" /> {done ? "Replay" : "Run"}
            </button>
            <span className="text-muted font-mono text-xs">{tick * 10} s</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((n) => (
              <div
                key={n}
                className={cn(
                  "flex min-h-28 flex-col gap-1 rounded-xl border p-2",
                  f.cordoned[n]
                    ? "border-accent bg-accent-soft border-dashed"
                    : "border-line bg-surface",
                )}
              >
                <span className="font-mono text-[10px] font-semibold">
                  node-{n + 1}
                  {f.cordoned[n] && <span className="text-accent font-normal"> · cordoned</span>}
                </span>
                {f.pods
                  .filter((p) => p.node === n)
                  .map((p) => (
                    <motion.span
                      key={p.id}
                      layout
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "rounded border px-1.5 py-0.5 font-mono text-[10px]",
                        p.app === "batch"
                          ? "border-line bg-surface-2"
                          : p.age >= 2
                            ? "border-good bg-good/15"
                            : "border-good/60 border-dashed",
                      )}
                    >
                      {p.id}
                      {p.app === "web" && p.age < 2 ? " (starting)" : ""}
                    </motion.span>
                  ))}
              </div>
            ))}
          </div>
          {f.pods.some((p) => p.node === null) && (
            <p className="text-bad font-mono text-xs">
              Pending:{" "}
              {f.pods
                .filter((p) => p.node === null)
                .map((p) => p.id)
                .join(", ")}{" "}
              (no schedulable node)
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["web pods ready now", f.readyWeb, f.readyWeb < 2],
              ["fewest ready so far", minReady, minReady < 2],
              ["evictions refused (429)", blockedSoFar, false],
            ].map(([l, v, bad]) => (
              <div
                key={l as string}
                className={cn(
                  "rounded-lg border px-2 py-1.5",
                  bad ? "border-bad/60 bg-bad/10" : "border-line bg-surface",
                )}
              >
                <p className="text-muted text-[10px]">{l as string}</p>
                <p className="font-mono text-lg font-semibold">{v as number}</p>
              </div>
            ))}
          </div>
          <p className="border-line bg-surface min-h-10 rounded-lg border px-3 py-2 font-mono text-[11px]">
            {f.log ?? "…"}
          </p>
          {done && (
            <p className={cn("text-sm", minReady < 2 ? "text-bad" : "")}>
              {minReady === 0
                ? "Outage: every web pod was evicted before replacements were ready."
                : minReady < 2
                  ? "Degraded: evictions ran ahead of replacements and web dropped below two ready pods."
                  : stuck
                    ? "No outage, but the drain can't finish: there's nowhere to put the replacements, and the budget refuses more evictions. Add capacity or drain fewer nodes."
                    : "Web never dropped below two ready pods: the budget made each eviction wait for a replacement."}
            </p>
          )}
        </div>
      }
    >
      <p>
        The kubernetes.io example: three nodes, a web Deployment with one pod on each, and an
        unrelated batch pod. <code>kubectl drain</code> cordons the node, then evicts its pods
        through the Eviction API, which checks budgets; refused evictions get a 429 and are retried.
      </p>
      <p>
        Run each scenario with and without a budget. Note what the budget doesn&apos;t cover:
        deleting pods or Deployments bypasses it, and rolling updates follow their own
        maxUnavailable instead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Upgrading Kubernetes ----------------------------------------------------------------------- */

const UP = [
  {
    title: "Where you start",
    cp: "1.35",
    nodes: ["1.35", "1.35", "1.35"],
    text: "Kubernetes releases a minor version about three times a year, and each gets about 14 months of patches. Only the three newest are maintained: today 1.37, 1.36 and 1.35.",
  },
  {
    title: "Control plane first, one minor at a time",
    cp: "1.36",
    nodes: ["1.35", "1.35", "1.35"],
    text: 'Upgrade the API server first. "Skipping MINOR versions when upgrading is unsupported", so 1.35 → 1.37 means stopping at 1.36.',
  },
  {
    title: "Again to 1.37",
    cp: "1.37",
    nodes: ["1.35", "1.35", "1.35"],
    text: 'Nodes can lag: a kubelet "may be up to three minor versions older" than the API server, but "must not be newer". 1.35 kubelets still work with a 1.37 control plane.',
  },
  {
    title: "Then the nodes",
    cp: "1.37",
    nodes: ["1.37", "1.35", "1.35"],
    text: "Replace or upgrade nodes one by one: add a new node, drain an old one (budgets apply), repeat. Managed node pools call this a surge upgrade; blue/green builds a whole new pool first.",
  },
  {
    title: "Done",
    cp: "1.37",
    nodes: ["1.37", "1.37", "1.37"],
    text: "Before you start, check for removed APIs: manifests using an API version that's no longer served will fail. A tool such as Pluto finds them.",
  },
];

export function Upgrading() {
  const [s, set] = useSceneState<DisState>();
  const f = UP[s.frame] ?? UP[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Upgrading Kubernetes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid grid-cols-[1fr_2fr] gap-2">
            <motion.div
              key={`cp-${f.cp}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="border-accent bg-accent-soft rounded-xl border px-3 py-3 text-center"
            >
              <p className="text-muted text-[10px]">Control plane</p>
              <p className="font-mono text-2xl font-semibold">{f.cp}</p>
            </motion.div>
            <div className="grid grid-cols-3 gap-1.5">
              {f.nodes.map((v, i) => (
                <motion.div
                  key={`${i}-${v}`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className={cn(
                    "rounded-lg border px-2 py-3 text-center",
                    v === f.cp ? "border-good/60 bg-good/10" : "border-line bg-surface",
                  )}
                >
                  <p className="text-muted text-[9px]">node-{i + 1}</p>
                  <p className="font-mono text-sm font-semibold">{v}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === UP.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={UP.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Falling behind isn&apos;t an option for long: versions go out of support within about 14
        months. Managed services help: EKS adds 12 months of paid extended support (about six times
        the normal cluster fee), GKE has release channels with maintenance windows, and AKS offers
        two-year LTS on its Premium tier.
      </p>
      <p>
        The skew rules exist so that each component can always understand the others mid-upgrade.
        Respect the order and an upgrade is routine.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Does the budget apply? ---------------------------------------------------------------------- */

export function BudgetApplies() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does the budget apply?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="budget-applies"
            prompt="How does a PodDisruptionBudget relate to each event?"
            categories={[
              { id: "respects", label: "Respects the budget" },
              { id: "involuntary", label: "Involuntary" },
              { id: "bypasses", label: "Bypasses it" },
            ]}
            items={[
              {
                id: "drain",
                label: "kubectl drain before a kernel patch",
                category: "respects",
                why: "Drain evicts through the Eviction API.",
              },
              {
                id: "hw",
                label: "A node's hardware fails",
                category: "involuntary",
                why: "Nothing can prevent it, though it counts against the budget.",
              },
              {
                id: "ca",
                label: "The Cluster Autoscaler removes an underused node",
                category: "respects",
                why: "It evicts respecting PDBs.",
              },
              {
                id: "delete",
                label: "Someone runs kubectl delete pod web-b",
                category: "bypasses",
                why: "Deleting pods directly skips the Eviction API.",
              },
              {
                id: "rolling",
                label: "A Deployment rolling update replaces pods",
                category: "bypasses",
                why: "Rolling updates are limited by maxUnavailable, not PDBs.",
              },
              {
                id: "zone",
                label: "A whole zone goes offline",
                category: "involuntary",
                why: "An involuntary disruption.",
              },
            ]}
            explanation="Budgets pace evictions: drains and autoscalers. They can't stop failures, and direct deletes and rolling updates don't consult them."
          />
        </div>
      }
    >
      <p>Six events. Which respect a PodDisruptionBudget?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Budgets pace planned work", "minAvailable or maxUnavailable; drains wait for replacements."],
  ["Not a shield", "Failures, deletes and rolling updates don't ask the budget."],
  ["Leave room to drain", "A budget plus no spare capacity means drains can't finish."],
  ["Upgrade in order", "Control plane first, one minor at a time; nodes may lag up to three."],
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
      <p>Next chapter: security and operations, starting with access control.</p>
    </StepLayout>
  );
}

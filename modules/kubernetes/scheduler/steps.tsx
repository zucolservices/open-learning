"use client";

import { motion } from "motion/react";
import { Armchair } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { REQUEST, schedule } from "./model";
import type { SchedState } from "./state";

/* 1 ─ Seating guests ------------------------------------------------------------------------------ */

export function Seating() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Seating wedding guests"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Rule out",
              "Tables that are full, the children's table for adults, the family table for strangers.",
              "filter",
            ],
            [
              "Rank the rest",
              "Prefer tables with more space, near friends, away from the speakers.",
              "score",
            ],
            ["Seat them", "Pick the best; if two tie, either will do.", "bind"],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <Armchair className="text-accent size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent font-mono text-[11px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Seating hundreds of guests works in two passes: rule out the tables that can&apos;t work,
        then rank the ones that can. The <Term id="kube-scheduler">scheduler</Term> does the same
        for every new pod: &ldquo;filtering and scoring&rdquo;.
      </p>
      <p>
        If no node passes the filters, the pod stays Pending until one does. If several tie for the
        top score, it picks one at random.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Be the scheduler ⭐ ------------------------------------------------------------------------- */

const RULES: [keyof SchedState, string, string][] = [
  ["ssd", "Node affinity: disk=ssd (required)", "nodeAffinity"],
  ["tolerate", "Tolerate the gpu taint", "tolerations"],
  ["anti", "Anti-affinity: not next to another api pod", "podAntiAffinity"],
  ["preferA", "Prefer zone a (weight 30)", "preferred affinity"],
  ["big", "Request 4 CPUs instead of 2", "resources"],
];

export function BeScheduler() {
  const [s, set] = useSceneState<SchedState>();
  const { verdicts, winner } = schedule(s);
  const tolerateTrap = s.tolerate && winner === "node-4";
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Be the scheduler"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-accent bg-accent-soft rounded-xl border px-3 py-2 text-xs">
            <p className="font-mono font-semibold">
              pod api-7f9c · requests cpu: {s.big ? 4 : REQUEST} · Pending
            </p>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              {RULES.map(([k, l]) => (
                <label key={k} className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={Boolean(s[k])}
                    onChange={(e) => set({ [k]: e.target.checked })}
                    className="accent-accent"
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            {verdicts.map((v) => {
              const win = v.node.name === winner;
              return (
                <motion.div
                  key={v.node.name}
                  layout
                  className={cn(
                    "grid grid-cols-[4.5rem_1fr_auto] items-center gap-2 rounded-lg border px-2.5 py-1.5",
                    win
                      ? "border-good bg-good/15"
                      : v.fail
                        ? "border-line bg-surface-2/40 opacity-70"
                        : "border-line bg-surface",
                  )}
                >
                  <div>
                    <p className="font-mono text-xs font-semibold">{v.node.name}</p>
                    <p className="text-muted font-mono text-[9px]">
                      zone {v.node.zone} · {v.node.disk}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="bg-surface-2 rounded px-1 font-mono">
                      {v.node.free} CPU free
                    </span>
                    {v.node.gpuTaint && (
                      <span className="border-viz-remove text-viz-remove rounded border px-1 font-mono">
                        taint gpu:NoSchedule
                      </span>
                    )}
                    {v.node.hasApi && (
                      <span className="bg-surface-2 rounded px-1 font-mono">runs api</span>
                    )}
                    {v.fail && <span className="text-bad">✕ {v.fail}</span>}
                  </div>
                  <div className="text-right">
                    {v.fail ? (
                      <span className="text-muted text-[10px]">filtered</span>
                    ) : (
                      <>
                        <p className="font-mono text-sm font-semibold">{v.score}</p>
                        <div className="bg-surface-2 h-1.5 w-16 rounded">
                          <motion.div
                            animate={{ width: `${Math.min(100, v.score)}%` }}
                            className={cn("h-1.5 rounded", win ? "bg-good" : "bg-viz-compute")}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <p className={cn("text-sm", !winner && "text-bad")}>
            {!winner
              ? "No node passes every filter: the pod stays Pending, with an event listing why each node failed."
              : tolerateTrap
                ? "Bound to node-4, the GPU node: a toleration allows the pod onto tainted nodes but doesn't steer it away from them. Dedicated nodes need a taint and a node affinity."
                : `Bound to ${winner}: it passed every filter and has the highest score (more room left wins with the default LeastAllocated strategy${s.preferA ? ", plus the zone preference" : ""}).`}
          </p>
        </div>
      }
    >
      <p>
        A new api pod needs 2 CPUs (or 4). Each node is filtered (enough room? matching labels? a
        taint the pod doesn&apos;t tolerate? a neighbour it must avoid?), then the survivors are
        scored.
      </p>
      <p>
        Turn rules on and watch the choice change. <Term id="node-affinity">Node affinity</Term>{" "}
        attracts pods to labelled nodes; a <Term id="taint">taint</Term> repels pods unless they
        carry a matching <Term id="toleration">toleration</Term>: &ldquo;Tolerations allow
        scheduling but don&apos;t guarantee scheduling&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Spread across zones ------------------------------------------------------------------------- */

export function SpreadZones() {
  const [s, set] = useSceneState<SchedState>();
  const dist = s.spread ? { a: 3, b: 3 } : { a: 1, b: 5 };
  const survivors = s.zoneDown ? dist.a : dist.a + dist.b;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Spread across zones"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.spread}
                onChange={(e) => set({ spread: e.target.checked })}
                className="accent-accent"
              />
              topologySpreadConstraints: zone, maxSkew 1
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.zoneDown}
                onChange={(e) => set({ zoneDown: e.target.checked })}
                className="accent-accent"
              />
              Zone b goes down
            </label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["a", "b"] as const).map((z) => (
              <div
                key={z}
                className={cn(
                  "rounded-xl border border-dashed p-3",
                  z === "b" && s.zoneDown ? "border-bad bg-bad/10" : "border-line",
                )}
              >
                <p className="text-muted mb-2 font-mono text-[10px]">zone {z}</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: dist[z] }, (_, i) => (
                    <motion.span
                      key={`${z}-${i}-${s.spread}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1, opacity: z === "b" && s.zoneDown ? 0.25 : 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="border-accent bg-accent/30 flex size-8 items-center justify-center rounded-md border font-mono text-[9px]"
                    >
                      api
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className={cn("text-sm", s.zoneDown && survivors < 3 && "text-bad")}>
            {s.zoneDown
              ? `${survivors} of 6 replicas still running.`
              : s.spread
                ? "Even: the zones differ by at most one pod."
                : "Most replicas landed in zone b, where the nodes happened to have more room."}{" "}
            {s.zoneDown && !s.spread ? "Losing one zone took most of the capacity with it." : ""}
          </p>
        </div>
      }
    >
      <p>
        Six replicas, two zones. Scoring alone may pile them where there&apos;s most room. A{" "}
        <Term id="topology-spread">topology spread constraint</Term> limits how uneven they can be
        (maxSkew) across a topology key such as the zone or the node.
      </p>
      <p>
        Kubernetes applies gentle defaults (ScheduleAnyway, skew 3 per node and 5 per zone), but for
        real resilience set your own, and decide whether a violation should block scheduling
        (DoNotSchedule, the default) or just lower the score (ScheduleAnyway). The placement here is
        illustrative.
      </p>
    </StepLayout>
  );
}

/* 4 ─ More levers --------------------------------------------------------------------------------- */

const LEVERS: [string, string][] = [
  [
    "Priority and preemption",
    "A PriorityClass gives pods a priority. If a high-priority pod can't fit, the scheduler can evict lower-priority pods to make room. Built-ins: system-cluster-critical and system-node-critical.",
  ],
  [
    "Bin-packing instead of spreading",
    "The default LeastAllocated strategy spreads load; MostAllocated packs nodes tightly so the autoscaler can remove empty ones (module 15).",
  ],
  [
    "GPUs and devices",
    "Dynamic Resource Allocation (GA in 1.34) lets pods request GPUs and other devices by their attributes, not just a count.",
  ],
  [
    "All or nothing",
    "Gang scheduling places a group of pods together or not at all, for distributed training. Alpha in 1.35, beta (off by default) in 1.37.",
  ],
  [
    "Inter-pod affinity at scale",
    'Powerful but slow: the docs advise against it "in clusters larger than several hundred nodes".',
  ],
];

export function MoreLevers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="More levers"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {LEVERS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Under the hood the scheduler is a framework of plugins (filter, score, bind and more), so
        cloud providers and projects can add their own logic.
      </p>
      <p>
        Most apps need only requests, a spread constraint and perhaps one affinity rule. Reach for
        the rest when you have a specific reason.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which tool? -------------------------------------------------------------------------------- */

export function WhichTool() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which tool?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-scheduling-tool"
            prompt="Which scheduling tool fits each goal?"
            categories={[
              { id: "affinity", label: "Node affinity" },
              { id: "taint", label: "Taint + toleration" },
              { id: "anti", label: "Pod anti-affinity" },
              { id: "spread", label: "Topology spread" },
            ]}
            items={[
              {
                id: "ssd",
                label: "Run the database only on nodes with SSDs",
                category: "affinity",
                why: "Attract it to nodes labelled disk=ssd.",
              },
              {
                id: "gpu",
                label: "Keep ordinary pods off the expensive GPU nodes",
                category: "taint",
                why: "Taint the GPU nodes; only pods that tolerate it may land there.",
              },
              {
                id: "replica",
                label: "Never put two database replicas on the same node",
                category: "anti",
                why: "Anti-affinity on kubernetes.io/hostname.",
              },
              {
                id: "zones",
                label: "Keep replicas evenly balanced across three zones",
                category: "spread",
                why: "maxSkew on topology.kubernetes.io/zone.",
              },
              {
                id: "spot",
                label: "Run batch pods only on nodes labelled lifecycle=spot",
                category: "affinity",
                why: "Required node affinity on that label.",
              },
              {
                id: "team",
                label: "Stop other teams' pods from landing on the payments team's nodes",
                category: "taint",
                why: "A taint repels them (add affinity too, so payments pods stay there).",
              },
            ]}
            explanation="Affinity attracts, taints repel, anti-affinity separates individual pods, and spread constraints balance whole groups."
          />
        </div>
      }
    >
      <p>Six placement goals. Which tool does each call for?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Filter, then score", "Feasible nodes are ranked; none feasible means Pending."],
  ["Affinity attracts, taints repel", "Tolerations only permit; combine them for dedicated nodes."],
  ["Spread for resilience", "Topology spread keeps replicas across nodes and zones."],
  ["Priority can preempt", "Critical pods can push lower-priority pods off a full cluster."],
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
      <p>Next: autoscaling, adding pods and nodes as traffic grows.</p>
    </StepLayout>
  );
}

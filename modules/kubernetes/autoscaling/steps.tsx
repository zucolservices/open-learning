"use client";

import { motion } from "motion/react";
import { Store } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { TICK, simulate, summary, type Tick } from "./model";
import type { AsState } from "./state";

/* 1 ─ Festival day at the shop ------------------------------------------------------------------- */

export function FestivalDay() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Festival day at the sweet shop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "Open more counters",
              "Staff already in the shop move to the counters within minutes.",
              "Pod autoscaling (HPA)",
            ],
            [
              "Bring in more space",
              "When there's no room for another counter, the owner rents the shop next door. That takes longer.",
              "Node autoscaling",
            ],
            [
              "Bigger counters",
              "Give each counter a larger tray instead of adding counters.",
              "Vertical autoscaling (VPA)",
            ],
            [
              "Count the queue, not the heat",
              "Open counters based on how many people are waiting outside.",
              "Event-driven (KEDA)",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={k}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
              <Store className="text-accent size-5" />
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
              </div>
              <span className="text-accent text-right font-mono text-[10px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        On Diwali the sweet shop&apos;s queue goes round the block. More counters help only if
        there&apos;s room for them, and finding more room is slower than moving staff.
      </p>
      <p>
        Kubernetes scales in the same two layers: more <Term id="pod">pods</Term> when they&apos;re
        busy, and more <Term id="node">nodes</Term> when the pods no longer fit.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Survive the spike ⭐ -------------------------------------------------------------------------- */

function Chart({
  data,
  value,
  max,
  cls,
  line,
  label,
  warn,
}: {
  data: Tick[];
  value: (t: Tick) => number;
  max: number;
  cls: (t: Tick) => string;
  line?: (t: Tick) => number;
  label: string;
  warn?: (t: Tick) => boolean;
}) {
  return (
    <div>
      <p className="text-muted mb-0.5 text-[10px]">{label}</p>
      <div className="bg-surface-2 relative flex h-14 items-end gap-px overflow-hidden rounded px-0.5">
        {data.map((t) => (
          <div key={t.t} className="relative flex h-full flex-1 items-end">
            <div
              className={cn("w-full rounded-t-[1px]", warn?.(t) ? "bg-bad" : cls(t))}
              style={{ height: `${Math.min(100, (value(t) / max) * 100)}%` }}
            />
            {line && (
              <div
                className="bg-fg/60 absolute right-0 left-0 h-px"
                style={{ bottom: `${Math.min(100, (line(t) / max) * 100)}%` }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SurviveSpike() {
  const [s, set] = useSceneState<AsState>();
  const data = simulate(s.hpa, s.nodes, s.target);
  const sum = summary(data);
  const shown = data.filter((_, i) => i % 2 === 0);
  const peakUtil = Math.round((data.find((d) => (d.t * TICK) / 60 >= 20)?.util ?? 0) * 100);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Survive the spike"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.hpa}
                onChange={(e) => set({ hpa: e.target.checked })}
                className="accent-accent"
              />
              Horizontal Pod Autoscaler
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.nodes}
                onChange={(e) => set({ nodes: e.target.checked })}
                className="accent-accent"
              />
              Node autoscaler (Cluster Autoscaler or Karpenter)
            </label>
          </div>
          {s.hpa && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Target CPU</span>
              <Segmented
                size="sm"
                value={String(s.target)}
                options={[
                  ["50", "50%"],
                  ["70", "70%"],
                  ["90", "90%"],
                ]}
                onChange={(v) => set({ target: Number(v) })}
              />
            </div>
          )}
          <Chart
            data={shown}
            label="Requests per second: capacity of ready pods (bars), demand (line); red = requests failing"
            value={(t) => Math.min(t.load, t.ready * 200)}
            max={5000}
            line={(t) => t.load}
            cls={() => "bg-good/70"}
            warn={(t) => t.dropped > 0}
          />
          <Chart
            data={shown}
            label="Pods: ready (bars); Pending in red"
            value={(t) => t.ready + t.pending}
            max={42}
            cls={() => "bg-viz-compute/70"}
            warn={(t) => t.pending > 0}
          />
          <Chart
            data={shown}
            label="Nodes"
            value={(t) => t.nodes}
            max={11}
            cls={() => "bg-viz-data/70"}
          />
          <div className="text-subtle flex justify-between font-mono text-[9px]">
            {[0, 10, 20, 30, 40, 50].map((m) => (
              <span key={m}>{m} min</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              ["Minutes with errors", sum.errorMinutes.toFixed(1), sum.errorMinutes > 5],
              ["Peak nodes", sum.peakNodes, false],
              ["Nodes at the end", sum.endNodes, sum.endNodes > 2],
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
          <p className="text-sm">
            {!s.hpa
              ? "Six pods can serve 1,200 requests a second. For twenty minutes demand is 4,000 and most requests fail."
              : !s.nodes
                ? "The HPA asks for more pods, but the two nodes fit only eight. The rest sit Pending for the whole spike."
                : `Pods scale out at once, but new nodes take about four minutes to arrive, so the first minutes still fail. Afterwards the HPA waits five minutes before scaling down, and spare nodes go ten minutes after that.${s.target === 90 ? ` At 90% the pods run hot (${peakUtil}% at the peak), leaving no room for the next bump.` : s.target === 50 ? " At 50% you pay for many more pods and nodes at the peak." : ""}`}
          </p>
        </div>
      }
    >
      <p>
        A festival sale quadruples traffic for twenty minutes. Each tick is {TICK} seconds. Turn on
        the <Term id="hpa">Horizontal Pod Autoscaler</Term>, then a{" "}
        <Term id="node-autoscaler">node autoscaler</Term>, and try different CPU targets.
      </p>
      <p>
        The HPA&apos;s rule is simple: desired pods = ceil(current pods × current CPU ÷ target CPU),
        checked every 15 seconds, measured against each pod&apos;s CPU request. The node autoscaler
        reacts to Pending pods; the Cluster Autoscaler&apos;s own FAQ puts a new cloud node at three
        to four minutes. Numbers here are illustrative.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The autoscaling family --------------------------------------------------------------------- */

const FAMILY: [string, string][] = [
  [
    "HPA (built in)",
    "More or fewer pods from CPU, memory, custom or external metrics. Scale-down waits 300 s by default to avoid flapping. Scaling to zero is beta in 1.37, with an object or external metric.",
  ],
  [
    "VPA (add-on)",
    "Adjusts requests and limits per pod. Modes include Off (recommend only), Initial, Recreate and in-place resizing. Don't use it with the HPA on the same CPU or memory metric.",
  ],
  [
    "Cluster Autoscaler",
    "Adds nodes to node groups when pods are Pending for lack of room; removes nodes whose requests stay under 50% for 10 minutes, respecting disruption budgets.",
  ],
  [
    "Karpenter",
    "A Kubernetes SIG Autoscaling project (v1.0 in 2024): launches right-sized nodes directly, no node groups, and consolidates. EKS Auto Mode and AKS Node Auto Provisioning are built on it.",
  ],
  [
    "KEDA (CNCF graduated)",
    "Scales on events such as Kafka lag, queue length or a schedule, and can scale to zero.",
  ],
];

export function Family() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The autoscaling family"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {FAMILY.map(([t, d], i) => (
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
        Pod autoscaling needs good requests (module 13), because CPU percentage is measured against
        them, and metrics-server, an add-on that supplies the numbers.
      </p>
      <p>
        Node autoscaling decides by requests too, not real usage. On GKE, node pool auto-creation
        plays the same role. For predictable peaks such as a sale, scaling up ahead of time beats
        any reaction.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which autoscaler? ------------------------------------------------------------------------- */

export function WhichAutoscaler() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which autoscaler?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-autoscaler"
            prompt="Which autoscaler solves each problem?"
            categories={[
              { id: "hpa", label: "HPA" },
              { id: "vpa", label: "VPA" },
              { id: "node", label: "Node autoscaler" },
              { id: "keda", label: "KEDA" },
            ]}
            items={[
              {
                id: "cpu",
                label: "Web pods hit 95% CPU every evening",
                category: "hpa",
                why: "Add pods as CPU rises.",
              },
              {
                id: "pending",
                label: "New pods sit Pending: Insufficient cpu",
                category: "node",
                why: "The cluster needs more nodes.",
              },
              {
                id: "guess",
                label: "Nobody knows what requests to set for a service",
                category: "vpa",
                why: "VPA can recommend (Off mode) or set requests from observed usage.",
              },
              {
                id: "kafka",
                label: "Consumers fall behind when Kafka lag grows; idle at night",
                category: "keda",
                why: "Scale on lag, down to zero when there's nothing to do.",
              },
              {
                id: "empty",
                label: "Half-empty nodes keep running after the peak",
                category: "node",
                why: "The node autoscaler removes underused nodes.",
              },
              {
                id: "queue",
                label: "A worker should run only when a queue has messages",
                category: "keda",
                why: "Event-driven scale-to-zero.",
              },
            ]}
            explanation="HPA for more pods, VPA for right-sized pods, a node autoscaler for room to put them, KEDA for scaling on events."
          />
        </div>
      }
    >
      <p>Six scaling problems. Which tool fixes each?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Two layers", "Pods scale in seconds; nodes take minutes."],
  ["Requests drive it all", "HPA percentages and node decisions use requests."],
  ["Scale down slowly", "Stabilisation windows stop flapping."],
  ["Plan known peaks", "Scale up before a sale; autoscaling covers surprises."],
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
      <p>Next: disruptions and upgrades, taking nodes away without an outage.</p>
    </StepLayout>
  );
}

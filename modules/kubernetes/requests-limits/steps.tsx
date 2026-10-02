"use client";

import { motion } from "motion/react";
import { RotateCcw, UtensilsCrossed } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { KINDS, NODE, place, totals } from "./model";
import type { RlState } from "./state";

const cores = (m: number) => `${(m / 1000).toFixed(m % 1000 ? 1 : 0)}`;
const gib = (mi: number) => `${(mi / 1024).toFixed(1)}`;

/* 1 ─ Table booked, plate size --------------------------------------------------------------------- */

export function TableBooked() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A booked table and a plate size"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "The booking",
              "You reserve a table for four. The restaurant plans its evening around bookings, even if you only order a salad.",
              "request",
            ],
            [
              "The plate size",
              "However hungry you are, a plate holds only so much. Want more and you wait (CPU), or overflow it and you're asked to leave (memory).",
              "limit",
            ],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-line bg-surface flex flex-col gap-2 rounded-xl border px-4 py-4"
            >
              <UtensilsCrossed className="text-accent size-5" />
              <p className="font-semibold">{t}</p>
              <p className="text-muted text-sm">{d}</p>
              <p className="mt-auto font-mono text-xs">{k}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every container can state two numbers for CPU and memory. Its{" "}
        <Term id="resource-request">request</Term> is what it reserves; the scheduler uses it to
        find room. Its <Term id="resource-limit">limit</Term> is the most it may use.
      </p>
      <p>
        CPU is counted in cores or thousandths of a core (500m is half a core); memory in bytes,
        usually Mi or Gi. Careful: &ldquo;If you request 400m of memory, this is a request for 0.4
        bytes&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Pack the nodes ⭐ ---------------------------------------------------------------------------- */

export function PackNodes() {
  const [s, set] = useSceneState<RlState>();
  const placed = place(s.placed ?? []);
  const pending = placed.filter((p) => p.node === null);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Pack the nodes"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {Object.entries(KINDS).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => set({ placed: [...(s.placed ?? []), k] })}
                className="border-line hover:bg-surface-2 rounded-full border px-3 py-1 font-mono text-[11px]"
              >
                + {v.label}{" "}
                <span className="text-muted">
                  ({cores(v.cpu)} CPU, {gib(v.mem)} Gi)
                </span>
              </button>
            ))}
            {(s.placed ?? []).length > 0 && (
              <button
                type="button"
                onClick={() => set({ placed: [] })}
                className="text-muted flex items-center gap-1 px-2 py-1 text-xs"
              >
                <RotateCcw className="size-3" /> Clear
              </button>
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {[0, 1].map((n) => {
              const t = totals(placed, n);
              return (
                <div key={n} className="border-line bg-surface rounded-xl border p-2.5">
                  <p className="font-mono text-[11px] font-semibold">
                    node-{n + 1} · allocatable 14.5 CPU, 28.5 Gi
                  </p>
                  {(
                    [
                      [
                        "CPU requested",
                        t.cpu / NODE.cpu,
                        `${cores(t.cpu)} / 14.5`,
                        t.useCpu / NODE.cpu,
                      ],
                      ["Memory requested", t.mem / NODE.mem, `${gib(t.mem)} / 28.5 Gi`, null],
                    ] as [string, number, string, number | null][]
                  ).map(([l, frac, txt, use]) => (
                    <div key={l} className="mt-1.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-muted">{l}</span>
                        <span className="font-mono">{txt}</span>
                      </div>
                      <div className="bg-surface-2 relative h-2.5 overflow-hidden rounded">
                        <motion.div
                          animate={{ width: `${Math.min(1, frac) * 100}%` }}
                          className="bg-viz-compute/70 absolute h-2.5"
                        />
                        {use !== null && (
                          <motion.div
                            animate={{ width: `${use * 100}%` }}
                            className="bg-viz-compute absolute h-2.5"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {placed
                      .filter((p) => p.node === n)
                      .map((p, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="border-accent/60 bg-accent-soft rounded border px-1 font-mono text-[9px]"
                        >
                          {KINDS[p.kind].label}
                        </motion.span>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
          {pending.length > 0 ? (
            <p className="text-bad text-sm">
              {pending.length} pod{pending.length > 1 ? "s" : ""} Pending: &ldquo;0/2 nodes are
              available: 2 Insufficient cpu&rdquo; (or memory), even though actual usage (the darker
              bar) is low. The scheduler counts requests, not usage.
            </p>
          ) : (
            <p className="text-muted text-sm">
              Add pods. Light bars are what pods reserved; the darker part of the CPU bar is what
              they actually use.
            </p>
          )}
        </div>
      }
    >
      <p>
        Add pods and watch the scheduler pack them. Each node offers its{" "}
        <Term id="allocatable">allocatable</Term> resources: the docs&apos; example node has 16 CPUs
        and 32 GiB, but after reserving some for the system and the kubelet, 14.5 CPUs and 28.5 GiB
        are left for pods.
      </p>
      <p>
        Add a couple of ml-train pods and others go Pending while the nodes sit mostly idle.
        Requests set too high waste money; set too low, and pods get crammed together and fight.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Hit the limit ⭐ ----------------------------------------------------------------------------- */

const CPU_LIMIT = 500;
const MEM_LIMIT = 512;

export function HitLimit() {
  const [s, set] = useSceneState<RlState>();
  const cpuUsed = s.limits ? Math.min(s.cpuDemand, CPU_LIMIT) : s.cpuDemand;
  const throttled = s.limits && s.cpuDemand > CPU_LIMIT;
  const oom = s.limits && s.memDemand > MEM_LIMIT;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Hit the limit"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
            {`resources:
  requests: { cpu: 250m, memory: 256Mi }
  ${s.limits ? "limits:   { cpu: 500m, memory: 512Mi }" : "# no limits"}`}
          </pre>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={s.limits}
              onChange={(e) => set({ limits: e.target.checked })}
              className="accent-accent"
            />
            Set limits
          </label>
          {(
            [
              ["CPU the app wants", "cpuDemand", 0, 2000, 50, `${s.cpuDemand}m`],
              ["Memory the app wants", "memDemand", 0, 1024, 16, `${s.memDemand} Mi`],
            ] as const
          ).map(([l, key, min, max, step, txt]) => (
            <label key={key} className="flex flex-col gap-1 text-xs">
              <span className="flex justify-between">
                <span className="text-muted">{l}</span>
                <span className="font-mono">{txt}</span>
              </span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={s[key]}
                onChange={(e) => set({ [key]: Number(e.target.value) })}
                className="accent-accent"
              />
            </label>
          ))}
          <div className="grid gap-2 sm:grid-cols-2">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                throttled ? "border-accent bg-accent-soft" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">CPU</p>
              <p className="font-mono text-lg font-semibold">{cpuUsed}m used</p>
              <p className="text-xs">
                {throttled
                  ? `Throttled: wants ${s.cpuDemand}m, gets ${CPU_LIMIT}m. Slower, still running.`
                  : s.limits
                    ? "Under the limit."
                    : "No limit: it can use spare CPU on the node."}
              </p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                oom ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Memory</p>
              <p className="font-mono text-lg font-semibold">
                {oom ? "OOMKilled" : `${s.memDemand} Mi used`}
              </p>
              <p className="text-xs">
                {oom
                  ? "Over 512 Mi: the kernel kills the container, and the kubelet restarts it (module 4)."
                  : s.limits
                    ? "Under the limit."
                    : "No limit: fine until the node itself runs short."}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Push the app past its limits. CPU and memory behave differently: &ldquo;cpu limits are
        enforced by CPU throttling&rdquo;, but &ldquo;memory limits are enforced by the kernel with
        out of memory (OOM) kills&rdquo;. You can slow a process down; you can&apos;t make it give
        back memory.
      </p>
      <p>
        Many teams always set memory limits and argue about CPU limits: throttling adds latency, but
        no limit lets one pod hog a node. Kubernetes&apos; docs present CPU limits as a choice, not
        a rule. If you set only a limit, the request is copied from it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ When a node runs short ---------------------------------------------------------------------- */

const QOS = [
  {
    title: "Three QoS classes",
    text: "From its requests and limits, every pod gets a Quality of Service class. Guaranteed: every container has requests equal to limits for CPU and memory. BestEffort: no requests or limits at all. Burstable: anything in between.",
  },
  {
    title: "The node runs out of memory",
    text: "Pods together use more memory than the node has. The kubelet must evict some pods to protect the node.",
  },
  {
    title: "Who goes first",
    text: "The kubelet ranks pods by: whether their usage exceeds their requests, then pod priority, then usage relative to requests. It does not use the QoS class directly.",
  },
  {
    title: "Why QoS still predicts it",
    text: "BestEffort pods request nothing, so any usage exceeds their requests: they go first. Guaranteed pods are rarely over their requests, so they go last. Set honest requests for anything you care about.",
  },
];

export function NodeShort() {
  const [s, set] = useSceneState<RlState>();
  const f = QOS[s.frame] ?? QOS[0];
  const order = s.frame >= 2;
  return (
    <StepLayout
      eyebrow="Step through"
      title="When a node runs short"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              ["Guaranteed", "requests = limits", "1Gi / 1Gi", "using 0.9Gi", 3],
              ["Burstable", "requests < limits", "256Mi / 1Gi", "using 0.7Gi", 2],
              ["BestEffort", "nothing set", "— / —", "using 0.4Gi", 1],
            ].map(([q, rule, rl, use, rank]) => (
              <motion.div
                key={q as string}
                layout
                className={cn(
                  "rounded-lg border px-3 py-2",
                  s.frame >= 1 ? "border-line bg-surface" : "border-accent/50 bg-accent-soft",
                )}
              >
                <p className="font-mono text-xs font-semibold">{q as string}</p>
                <p className="text-muted text-[10px]">{rule as string}</p>
                <p className="mt-1 font-mono text-[10px]">req/limit {rl as string}</p>
                <p className="font-mono text-[10px]">{use as string}</p>
                {order && (
                  <p
                    className={cn(
                      "mt-1 text-xs font-semibold",
                      rank === 1 ? "text-bad" : rank === 2 ? "text-accent" : "text-good",
                    )}
                  >
                    evicted {rank === 1 ? "first" : rank === 2 ? "second" : "last"}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
          {s.frame >= 1 && (
            <div className="bg-surface-2 h-3 overflow-hidden rounded">
              <motion.div
                initial={{ width: "60%" }}
                animate={{ width: "100%" }}
                className="bg-bad h-3"
              />
            </div>
          )}
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === 3 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={QOS.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Requests and limits also decide who suffers when a node runs short of memory. Kubernetes
        labels each pod with a <Term id="qos-class">QoS class</Term>, which tells you roughly how it
        will be treated.
      </p>
      <p>
        Namespaces get guard rails too: a LimitRange can fill in default requests and limits, and a
        ResourceQuota caps a namespace&apos;s total.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which QoS class? -------------------------------------------------------------------------- */

export function WhichQos() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which QoS class?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-qos"
            prompt="Which QoS class does each pod get?"
            categories={[
              { id: "g", label: "Guaranteed" },
              { id: "b", label: "Burstable" },
              { id: "be", label: "BestEffort" },
            ]}
            items={[
              {
                id: "eq",
                label: "requests cpu 1, memory 1Gi; limits cpu 1, memory 1Gi",
                category: "g",
                why: "Requests equal limits for both.",
              },
              {
                id: "none",
                label: "No requests or limits at all",
                category: "be",
                why: "Nothing set.",
              },
              {
                id: "less",
                label: "requests 250m, 256Mi; limits 1, 1Gi",
                category: "b",
                why: "Requests below limits.",
              },
              {
                id: "limonly",
                label: "Only limits: cpu 1, memory 1Gi",
                category: "g",
                why: "The requests are copied from the limits, so they're equal.",
              },
              {
                id: "memreq",
                label: "Only a memory request of 512Mi",
                category: "b",
                why: "Something is set, but not requests = limits for both.",
              },
              {
                id: "mixed",
                label: "Two containers: one with requests = limits, one with nothing",
                category: "b",
                why: "Guaranteed needs every container to qualify.",
              },
            ]}
            explanation="Guaranteed: every container has requests equal to limits. BestEffort: nothing set anywhere. Everything else: Burstable."
          />
        </div>
      }
    >
      <p>Six pod specs. Which class does each get?</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Requests reserve", "The scheduler packs by requests, not by real usage."],
  ["Limits cap", "CPU over the limit is throttled; memory over the limit is OOMKilled."],
  ["Set honest requests", "Too high wastes nodes; too low invites eviction."],
  ["QoS predicts eviction", "BestEffort first, Guaranteed last, via usage over requests."],
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
      <p>Next: the scheduler, and how it chooses between nodes that fit.</p>
    </StepLayout>
  );
}

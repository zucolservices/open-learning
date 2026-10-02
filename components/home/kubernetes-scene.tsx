"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/cn";

type Part = { id: string; name: string; text: string };

/** Tour order: from your file to traffic reaching a pod, then the safety nets. */
const PARTS: Part[] = [
  {
    id: "git",
    name: "Desired state in Git",
    text: "you describe what should run; a GitOps agent or kubectl apply sends it to the cluster (modules 2, 19).",
  },
  {
    id: "api",
    name: "API server",
    text: "the front door: authenticates, checks RBAC and admission policies, then stores the object in etcd (modules 3, 17, 18).",
  },
  {
    id: "controllers",
    name: "Controllers",
    text: "loops that compare desired and actual state and fix the difference: the Deployment creates ReplicaSets, the ReplicaSet creates pods (modules 2, 5).",
  },
  {
    id: "scheduler",
    name: "Scheduler",
    text: "picks a node for each new pod: filters by requests, taints and affinity, then scores the rest (modules 13, 14).",
  },
  {
    id: "nodes",
    name: "Nodes and kubelets",
    text: "each node's kubelet starts containers, runs health probes and restarts what crashes (modules 4, 6).",
  },
  {
    id: "pods",
    name: "Pods across zones",
    text: "three replicas spread over zones survive a node or zone failing (modules 12, 14).",
  },
  {
    id: "service",
    name: "Service",
    text: "one stable name and IP in front of pods that come and go, routing only to Ready ones (module 8).",
  },
  {
    id: "gateway",
    name: "Gateway",
    text: "the edge router that sends outside traffic to the right Service by host and path (module 9).",
  },
  {
    id: "scaling",
    name: "Autoscalers",
    text: "add pods when they're busy and nodes when pods no longer fit (module 15).",
  },
];

const T = "fill-muted font-mono text-[8px]";

function Box({
  x,
  y,
  w,
  h,
  label,
  on,
  cls = "fill-surface stroke-line-strong",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  on: boolean;
  cls?: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : cls}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 3}
        textAnchor="middle"
        className={cn(
          "font-mono",
          label.length > 8 ? "text-[6.5px]" : "text-[8px]",
          on ? "fill-accent" : "fill-fg",
        )}
      >
        {label}
      </text>
    </g>
  );
}

function Diagram({ active, onSelect }: { active: string; onSelect(id: string): void }) {
  const f = (ids: string[]) => ({
    opacity: ids.includes(active) ? 1 : 0.35,
    transition: { duration: 0.35 },
  });
  const hit = (id: string) => ({
    onClick: () => onSelect(id),
    style: { cursor: "pointer" } as const,
    role: "button",
    "aria-label": PARTS.find((p) => p.id === id)?.name,
  });
  return (
    <svg
      viewBox="0 0 380 224"
      className="w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <motion.g animate={f(["git"])} {...hit("git")}>
        <Box
          x={8}
          y={20}
          w={64}
          h={22}
          label="git · YAML"
          on={active === "git"}
          cls="fill-viz-meta/10 stroke-viz-meta"
        />
      </motion.g>
      <path d="M72 31h22" className="stroke-line-strong" />
      {/* Control plane */}
      <rect
        x={94}
        y={8}
        width={180}
        height={66}
        rx={8}
        className="fill-surface-2/40 stroke-line-strong"
        strokeDasharray="4 3"
      />
      <text x={100} y={18} className={T}>
        control plane
      </text>
      <motion.g animate={f(["api"])} {...hit("api")}>
        <Box x={102} y={24} w={60} h={22} label="API server" on={active === "api"} />
        <ellipse cx={132} cy={60} rx={16} ry={4} className="fill-viz-data/15 stroke-viz-data" />
        <text x={132} y={70} textAnchor="middle" className="fill-muted font-mono text-[6px]">
          etcd
        </text>
      </motion.g>
      <motion.g animate={f(["controllers"])} {...hit("controllers")}>
        <Box x={170} y={24} w={48} h={22} label="controllers" on={active === "controllers"} />
      </motion.g>
      <motion.g animate={f(["scheduler"])} {...hit("scheduler")}>
        <Box x={222} y={24} w={46} h={22} label="scheduler" on={active === "scheduler"} />
      </motion.g>
      {/* Zones and nodes */}
      {[0, 1, 2].map((z) => {
        const x = 94 + z * 62;
        return (
          <g key={z}>
            <motion.g animate={f(["nodes", "pods"])} {...hit("nodes")}>
              <rect
                x={x}
                y={92}
                width={56}
                height={58}
                rx={6}
                className={
                  active === "nodes"
                    ? "fill-accent/10 stroke-accent"
                    : "fill-surface-2/40 stroke-line-strong"
                }
              />
              <text x={x + 4} y={102} className="fill-muted font-mono text-[6.5px]">
                zone {"abc"[z]}
              </text>
            </motion.g>
            <motion.g animate={f(["pods", "nodes", "scaling"])} {...hit("pods")}>
              <motion.rect
                x={x + 8}
                y={110}
                width={16}
                height={16}
                rx={3}
                className={
                  active === "pods"
                    ? "fill-accent/40 stroke-accent"
                    : "fill-viz-compute/30 stroke-viz-compute"
                }
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 2.4, delay: z * 0.4 }}
              />
              {active === "scaling" && (
                <motion.rect
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  x={x + 30}
                  y={110}
                  width={16}
                  height={16}
                  rx={3}
                  className="fill-accent/30 stroke-accent"
                  strokeDasharray="2 2"
                />
              )}
            </motion.g>
          </g>
        );
      })}
      <path d="M184 74v18" className="stroke-line-strong" strokeDasharray="2 2" />
      {/* Service and gateway */}
      <motion.g animate={f(["service"])} {...hit("service")}>
        <Box
          x={150}
          y={170}
          w={88}
          h={20}
          label="Service payments"
          on={active === "service"}
          cls="fill-surface stroke-accent/60"
        />
        {[0, 1, 2].map((z) => (
          <path
            key={z}
            d={`M194 170L${110 + z * 62} 126`}
            className="stroke-line-strong"
            strokeDasharray="2 2"
          />
        ))}
      </motion.g>
      <motion.g animate={f(["gateway"])} {...hit("gateway")}>
        <Box x={20} y={170} w={70} h={20} label="Gateway" on={active === "gateway"} />
        <motion.path
          d="M90 180h60"
          className="stroke-accent"
          strokeWidth={1.4}
          strokeDasharray="3 3"
          animate={{ strokeDashoffset: [12, 0] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <text x={8} y={210} className={T}>
          users
        </text>
        <path d="M24 205v-15" className="stroke-line-strong" strokeDasharray="2 2" />
      </motion.g>
      <motion.g animate={f(["scaling"])} {...hit("scaling")}>
        <Box x={290} y={100} w={82} h={22} label="HPA + nodes" on={active === "scaling"} />
        <path d="M290 111h-14" className="stroke-line-strong" strokeDasharray="2 2" />
      </motion.g>
    </svg>
  );
}

/** Kubernetes showcase: a small production cluster, toured part by part; click any part. */
export function KubernetesScene() {
  const [i, setI] = useState(0);
  const [auto, setAuto] = useState(true);
  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setI((n) => (n + 1) % PARTS.length), 2600);
    return () => clearInterval(id);
  }, [auto]);
  const part = PARTS[i];
  return (
    <div className="flex flex-col gap-3">
      <Diagram
        active={part.id}
        onSelect={(id) => {
          setAuto(false);
          setI(PARTS.findIndex((p) => p.id === id));
        }}
      />
      <AnimatePresence mode="wait">
        <motion.p
          key={part.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-muted min-h-10 text-sm"
        >
          <span className="text-fg font-semibold">{part.name}:</span> {part.text}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

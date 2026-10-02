"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, PARTS, type Part } from "./frames";
import type { AnatomyState } from "./state";

/* 1 ─ A restaurant kitchen ---------------------------------------------------------------------- */

const KITCHEN: [string, string, string][] = [
  [
    "Front desk",
    "Every order and every member of staff goes through it. It checks who you are and whether you're allowed.",
    "API server",
  ],
  ["Order book", "The one written record of every order and its state.", "etcd"],
  ["Head chef", "Decides which station cooks each dish.", "Scheduler"],
  [
    "Floor managers",
    "Each watches one thing (tables, stock, staff) and fixes what's missing.",
    "Controllers",
  ],
  ["Station cooks", "Cook what's assigned to their station and report back.", "kubelets on nodes"],
];

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A restaurant kitchen"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {KITCHEN.map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border px-3 py-2"
            >
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
        A busy kitchen works because everyone has one job and one place orders flow through. A{" "}
        <Term id="cluster">cluster</Term> is organised the same way.
      </p>
      <p>
        The <Term id="control-plane">control plane</Term> holds what you asked for and decides; the
        worker <Term id="node">nodes</Term> do the running. And, as at the front desk, nobody talks
        to anybody except through the <Term id="api-server">API server</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Follow one kubectl apply ⭐ ------------------------------------------------------------------ */

const PATHS: Partial<Record<`${Part}>${Part}`, string>> = {
  "kubectl>api": "M64 109H98",
  "api>etcd": "M140 131V166",
  "api>cm": "M120 87V46",
  "cm>api": "M110 46V86",
  "api>sched": "M170 87V46",
  "sched>api": "M160 46V86",
  "api>kubelet": "M182 104H254",
  "kubelet>api": "M254 116H184",
  "kubelet>runtime": "M314 108H320",
};

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  on,
  part,
  onPick,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  on: boolean;
  part: Part;
  onPick?: (p: Part) => void;
}) {
  return (
    <g
      onClick={() => onPick?.(part)}
      style={{ cursor: onPick ? "pointer" : undefined }}
      role={onPick ? "button" : undefined}
      aria-label={onPick ? PARTS[part].name : undefined}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        className={on ? "fill-accent/15 stroke-accent" : "fill-surface stroke-line-strong"}
        strokeWidth={on ? 1.6 : 1}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + (sub ? 0 : 3)}
        textAnchor="middle"
        className={cn(
          "font-mono",
          label.length > 8 ? "text-[7px]" : "text-[8px]",
          on ? "fill-accent" : "fill-fg",
        )}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 9}
          textAnchor="middle"
          className="fill-muted font-mono text-[6.5px]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

export function Diagram({
  on,
  arrows,
  pods,
  gate,
  onPick,
}: {
  on: Part[];
  arrows: [Part, Part][];
  pods: number;
  gate?: string;
  onPick?: (p: Part) => void;
}) {
  const is = (p: Part) => on.includes(p);
  return (
    <svg
      viewBox="0 0 380 222"
      className="mx-auto w-full max-w-2xl"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        x={68}
        y={6}
        width={176}
        height={210}
        rx={8}
        className="fill-surface-2/40 stroke-line-strong"
        strokeDasharray="4 3"
      />
      <text x={76} y={212} className="fill-muted font-mono text-[7px]">
        control plane
      </text>
      <Box
        x={8}
        y={95}
        w={56}
        h={28}
        label="kubectl"
        on={is("kubectl")}
        part="kubectl"
        onPick={onPick}
      />
      <Box
        x={74}
        y={16}
        w={76}
        h={30}
        label="controller"
        sub="manager"
        on={is("cm")}
        part="cm"
        onPick={onPick}
      />
      <Box
        x={156}
        y={16}
        w={80}
        h={30}
        label="scheduler"
        on={is("sched")}
        part="sched"
        onPick={onPick}
      />
      <Box
        x={98}
        y={87}
        w={84}
        h={44}
        label="API server"
        sub={gate}
        on={is("api")}
        part="api"
        onPick={onPick}
      />
      <g
        onClick={() => onPick?.("etcd")}
        style={{ cursor: onPick ? "pointer" : undefined }}
        role={onPick ? "button" : undefined}
        aria-label={onPick ? "etcd" : undefined}
      >
        <ellipse
          cx={140}
          cy={170}
          rx={30}
          ry={6}
          className={
            is("etcd") ? "fill-accent/15 stroke-accent" : "fill-viz-data/15 stroke-viz-data"
          }
        />
        <path
          d="M110 170v24a30 6 0 0 0 60 0v-24"
          className={
            is("etcd") ? "fill-accent/10 stroke-accent" : "fill-viz-data/10 stroke-viz-data"
          }
        />
        <text
          x={140}
          y={190}
          textAnchor="middle"
          className={cn("font-mono text-[8px]", is("etcd") ? "fill-accent" : "fill-fg")}
        >
          etcd
        </text>
      </g>
      {pods === 1 &&
        [0, 1, 2].map((k) => (
          <motion.rect
            key={k}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 * k }}
            x={196 + k * 14}
            y={140}
            width={10}
            height={10}
            rx={2}
            className="stroke-accent"
            strokeDasharray="2 2"
          />
        ))}
      {pods === 1 && (
        <text x={196} y={162} className="fill-muted font-mono text-[6.5px]">
          pods, no node
        </text>
      )}
      {[0, 1, 2].map((n) => {
        const y = 10 + n * 70;
        return (
          <g key={n}>
            <rect
              x={256}
              y={y}
              width={118}
              height={62}
              rx={6}
              className="fill-surface-2/40 stroke-line-strong"
            />
            <text x={262} y={y + 9} className="fill-muted font-mono text-[6.5px]">
              node-{n + 1}
            </text>
            <Box
              x={262}
              y={y + 13}
              w={52}
              h={16}
              label="kubelet"
              on={is("kubelet")}
              part="kubelet"
              onPick={onPick}
            />
            <Box
              x={320}
              y={y + 13}
              w={48}
              h={16}
              label="runtime"
              on={is("runtime")}
              part="runtime"
              onPick={onPick}
            />
            <Box
              x={262}
              y={y + 35}
              w={52}
              h={16}
              label="kube-proxy"
              on={is("proxy")}
              part="proxy"
              onPick={onPick}
            />
            {pods >= 2 && (
              <motion.rect
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                x={336}
                y={y + 37}
                width={14}
                height={14}
                rx={3}
                className={pods === 3 ? "fill-accent/40 stroke-accent" : "stroke-accent"}
                strokeDasharray={pods === 3 ? undefined : "2 2"}
              />
            )}
          </g>
        );
      })}
      {arrows.map(([a, b]) => {
        const d = PATHS[`${a}>${b}`];
        if (!d) return null;
        return (
          <motion.path
            key={`${a}-${b}`}
            d={d}
            className="stroke-accent"
            strokeWidth={1.8}
            strokeDasharray="4 3"
            initial={{ strokeDashoffset: 14 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
          />
        );
      })}
    </svg>
  );
}

export function FollowApply() {
  const [s, set] = useSceneState<AnatomyState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Follow one kubectl apply"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <pre className="border-line bg-surface rounded-lg border px-3 py-1.5 font-mono text-[11px]">
            $ kubectl apply -f payments-api.yaml # Deployment, replicas: 3
          </pre>
          <Diagram on={f.on} arrows={f.arrows} pods={f.pods} gate={f.gate} />
          <FrameCaption
            frameKey={s.frame}
            title={f.title}
            tone={s.frame === FRAMES.length - 1 ? "good" : undefined}
          >
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        One command, and nine things happen. Step through and watch which part of the cluster is
        busy at each moment.
      </p>
      <p>
        Notice the shape: every arrow goes to or from the API server. Components never call each
        other directly; they watch the API server for changes and write their results back.
        Kubernetes&apos; docs call this a &ldquo;hub-and-spoke&rdquo; pattern.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Who does what ------------------------------------------------------------------------------ */

export function WhoDoesWhat() {
  const [s, set] = useSceneState<AnatomyState>();
  const part = (s.part as Part) in PARTS ? (s.part as Part) : "api";
  const p = PARTS[part];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Who does what"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Diagram on={[part]} arrows={[]} pods={3} onPick={(x) => set({ part: x })} />
          <motion.div
            key={part}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3"
          >
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-sm font-semibold">{p.name}</p>
              <p className="text-muted text-[10px]">{p.where}</p>
            </div>
            <p className="mt-1 text-sm">{p.text}</p>
          </motion.div>
        </div>
      }
    >
      <p>Click any part of the diagram.</p>
      <p>
        On a managed service such as EKS, GKE or AKS, the provider runs and hides the whole control
        plane; you see the API endpoint and your nodes. In their most managed modes (GKE Autopilot,
        EKS Auto Mode, AKS Automatic) they manage the nodes too. Add-ons complete the picture:
        CoreDNS answers name lookups, and metrics-server feeds autoscaling.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Which component? --------------------------------------------------------------------------- */

export function WhichComponent() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which component?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-component"
            prompt="Which component does each job?"
            categories={[
              { id: "api", label: "API server" },
              { id: "etcd", label: "etcd" },
              { id: "sched", label: "Scheduler" },
              { id: "kubelet", label: "kubelet" },
            ]}
            items={[
              {
                id: "deny",
                label: "Refuses a request from a user without permission",
                category: "api",
                why: "Authentication and authorisation happen at the API server.",
              },
              {
                id: "store",
                label: "Holds the desired state of every object",
                category: "etcd",
                why: "etcd is the backing store; only the API server should talk to it.",
              },
              {
                id: "pick",
                label: "Chooses node-2 for a new pod",
                category: "sched",
                why: "It filters and scores nodes, then binds the pod.",
              },
              {
                id: "start",
                label: "Tells containerd to start a pod's containers",
                category: "kubelet",
                why: "Through the Container Runtime Interface.",
              },
              {
                id: "default",
                label: "Adds default values to an object before it's stored",
                category: "api",
                why: "Mutating admission runs inside the API server's request path.",
              },
              {
                id: "restart",
                label: "Restarts a crashed container on its machine",
                category: "kubelet",
                why: "The kubelet runs on every node and looks after its pods.",
              },
            ]}
            explanation="The API server guards and routes, etcd remembers, the scheduler places, the kubelet runs. Controllers (not sorted here) close the gaps."
          />
        </div>
      }
    >
      <p>Six jobs. Which part of the cluster does each?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Control plane decides", "API server, etcd, scheduler, controller manager."],
  ["Nodes run", "kubelet, a container runtime and usually kube-proxy."],
  ["Everything via the API server", "Hub and spoke: watch, act, write back."],
  ["apply returns early", '"created" means stored, not running. Controllers do the rest.'],
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
      <p>Next: pods, the smallest thing Kubernetes runs.</p>
    </StepLayout>
  );
}

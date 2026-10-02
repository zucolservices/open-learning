"use client";

import { motion } from "motion/react";
import { Home } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { PodState } from "./state";

/* 1 ─ A shared flat ---------------------------------------------------------------------------- */

export function SharedFlat() {
  const rows: [string, string][] = [
    [
      "One address",
      "Everyone in the flat shares a postal address. A pod has one IP address; its containers reach each other on localhost.",
    ],
    ["Shared rooms", "The kitchen is shared. Containers in a pod can share folders (volumes)."],
    [
      "Own bedrooms",
      "Each flatmate has a private room. Each container has its own filesystem and process.",
    ],
    [
      "Moving out together",
      "When the lease ends, everyone leaves. Containers in a pod start, stop and are placed on a node together.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Analogy"
      title="A shared flat"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {rows.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface flex gap-3 rounded-xl border px-4 py-3"
            >
              <Home className="text-accent mt-0.5 size-5 shrink-0" />
              <div>
                <p className="font-semibold">{t}</p>
                <p className="text-muted text-sm">{d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Kubernetes never runs a container on its own. It runs <Term id="pod">pods</Term>: &ldquo;the
        smallest deployable units of computing that you can create and manage in Kubernetes&rdquo;.
      </p>
      <p>
        The docs explain the name: &ldquo;A Pod (as in a pod of whales or pea pod) is a group of one
        or more containers, with shared storage and network resources, and a specification for how
        to run the containers.&rdquo; Think of it as a small shared flat.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Build a pod ⭐ ---------------------------------------------------------------------------- */

function Toggle({
  on,
  label,
  onChange,
}: {
  on: boolean;
  label: string;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-xs">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent"
      />
      {label}
    </label>
  );
}

export function BuildPod() {
  const [s, set] = useSceneState<PodState>();
  const clash = s.sidecar && s.sidecarPort === 8080;
  const order = [
    ...(s.init ? ["init: migrate-db (runs, then exits)"] : []),
    ...(s.sidecar ? ["sidecar: log-shipper (keeps running)"] : []),
    "app: payments-api",
  ];
  return (
    <StepLayout
      eyebrow="Build"
      title="Build a pod"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            <Toggle
              on={s.init}
              label="Init container: run DB migrations first"
              onChange={(v) => set({ init: v })}
            />
            <Toggle
              on={s.sidecar}
              label="Sidecar: ship logs"
              onChange={(v) => set({ sidecar: v })}
            />
            <Toggle
              on={s.volume}
              label="Shared volume for log files"
              onChange={(v) => set({ volume: v })}
            />
          </div>
          {s.sidecar && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted">Sidecar listens on</span>
              <Segmented
                size="sm"
                value={String(s.sidecarPort)}
                options={[
                  ["9090", "port 9090"],
                  ["8080", "port 8080"],
                ]}
                onChange={(v) => set({ sidecarPort: Number(v) })}
              />
            </div>
          )}
          <motion.div layout className="border-accent/60 bg-accent-soft rounded-2xl border-2 p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="font-mono text-xs font-semibold">pod: payments-api-7d9f</span>
              <span className="font-mono text-[11px]">IP 10.1.2.7</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {s.init && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-viz-idle bg-surface flex-1 rounded-lg border border-dashed px-3 py-2 text-xs"
                >
                  <p className="font-semibold">migrate-db</p>
                  <p className="text-muted text-[10px]">init container · exits when done</p>
                </motion.div>
              )}
              <motion.div
                layout
                className={cn(
                  "bg-surface flex-1 rounded-lg border px-3 py-2 text-xs",
                  clash ? "border-bad" : "border-viz-compute",
                )}
              >
                <p className="font-semibold">payments-api</p>
                <p className="text-muted font-mono text-[10px]">:8080</p>
              </motion.div>
              {s.sidecar && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "bg-surface flex-1 rounded-lg border px-3 py-2 text-xs",
                    clash ? "border-bad" : "border-viz-meta",
                  )}
                >
                  <p className="font-semibold">log-shipper</p>
                  <p className="text-muted font-mono text-[10px]">:{s.sidecarPort} · sidecar</p>
                </motion.div>
              )}
            </div>
            {s.volume && (
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-viz-data bg-viz-data/10 mt-2 rounded-lg border px-3 py-1.5 font-mono text-[10px]"
              >
                volume: logs (emptyDir) · mounted in{" "}
                {s.sidecar ? "payments-api and log-shipper" : "payments-api"}
              </motion.div>
            )}
          </motion.div>
          <div>
            <p className="text-muted mb-1 text-[10px]">Start-up order</p>
            <div className="flex flex-wrap items-center gap-1 text-[11px]">
              {order.map((o, i) => (
                <span key={o} className="flex items-center gap-1">
                  {i > 0 && <span className="text-subtle">→</span>}
                  <span className="border-line bg-surface rounded border px-2 py-0.5 font-mono">
                    {o}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <p className={cn("text-sm", clash && "text-bad")}>
            {clash
              ? "Port clash: both containers share one network, so only one can listen on 8080. The second fails to start."
              : s.sidecar && !s.volume
                ? "The log shipper can't see the app's log files: containers have separate filesystems unless they share a volume."
                : s.sidecar && s.volume
                  ? "Both containers mount the same volume: the app writes logs, the sidecar reads and ships them."
                  : "One container per pod is the most common case."}
          </p>
        </div>
      }
    >
      <p>
        Add helpers to a pod. An <Term id="init-container">init container</Term> runs to completion
        before the app starts; a <Term id="sidecar-container">sidecar</Term> starts first and keeps
        running alongside it (native sidecars are stable since Kubernetes 1.33).
      </p>
      <p>
        Containers in a pod share one IP address and can share volumes, so they must not fight over
        ports. Multiple containers in one pod is &ldquo;a relatively advanced use case&rdquo;: only
        for helpers tightly coupled to the main app.
      </p>
    </StepLayout>
  );
}

/* 3 ─ A pod's life ⭐ ------------------------------------------------------------------------------ */

const BACKOFF = [10, 20, 40, 80, 160, 300];

const FRAMES: {
  title: string;
  phase: string;
  text: string;
  restarts: number;
  tone?: "good" | "bad";
  backoff?: number;
}[] = [
  {
    title: "Pending",
    phase: "Pending",
    restarts: 0,
    text: "The pod is accepted, but no container is running yet: it's waiting to be scheduled, or for its images to download.",
  },
  {
    title: "Init containers run",
    phase: "Pending",
    restarts: 0,
    text: "On its node, init containers run one after another. If one fails, the kubelet retries it until it succeeds.",
  },
  {
    title: "Running",
    phase: "Running",
    restarts: 0,
    tone: "good",
    text: "The pod is bound to a node and its containers have started. Sidecars start before the app and keep running.",
  },
  {
    title: "The app crashes",
    phase: "Running",
    restarts: 1,
    backoff: 1,
    text: "With the default restartPolicy (Always), the kubelet restarts the crashed container on the same node, after a 10-second wait.",
  },
  {
    title: "CrashLoopBackOff",
    phase: "Running",
    restarts: 6,
    backoff: 6,
    tone: "bad",
    text: "It keeps crashing. The wait doubles each time, 10, 20, 40 seconds, up to five minutes. kubectl shows CrashLoopBackOff: a status, not a phase. Ten minutes of running cleanly resets the timer.",
  },
  {
    title: "Termination",
    phase: "Running",
    restarts: 6,
    text: "When the pod is deleted, each container gets SIGTERM and up to 30 seconds (the default grace period) to finish its work; a preStop hook can run first. Then SIGKILL. Sidecars stop after the app.",
  },
  {
    title: "Gone for good",
    phase: "(deleted)",
    restarts: 6,
    text: "A pod \"is never 'rescheduled' to a different node; instead, that Pod can be replaced by a new, near-identical Pod\", with a new name and a new IP. That's a controller's job.",
  },
];

export function PodLife() {
  const [s, set] = useSceneState<PodState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="A pod's life"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["Pending", "Running", "Succeeded", "Failed", "Unknown"].map((p) => (
              <span
                key={p}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px]",
                  f.phase.includes(p) ? "border-accent bg-accent-soft" : "border-line text-muted",
                )}
              >
                {p}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Phase</p>
              <p className="font-mono text-lg font-semibold">{f.phase}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">Restarts</p>
              <p className="font-mono text-lg font-semibold">{f.restarts}</p>
            </div>
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px]">Wait before each restart (seconds)</p>
            <div className="flex h-20 items-end gap-1.5">
              {BACKOFF.map((b, i) => (
                <div key={b} className="flex flex-1 flex-col items-center gap-0.5">
                  <motion.div
                    animate={{
                      height: `${(b / 300) * 64}px`,
                      opacity: f.backoff && i < f.backoff ? 1 : 0.15,
                    }}
                    className={cn("w-full rounded-t", i === 5 ? "bg-viz-remove" : "bg-viz-compute")}
                  />
                  <span className="text-muted font-mono text-[9px]">{b}</span>
                </div>
              ))}
            </div>
          </div>
          <FrameCaption frameKey={s.frame} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
          <Stepper step={s.frame} count={FRAMES.length} onChange={(n) => set({ frame: n })} />
        </div>
      }
    >
      <p>
        Every pod moves through a few <Term id="pod-phase">phases</Term>, and the kubelet on its
        node restarts crashed containers according to the pod&apos;s{" "}
        <Term id="restart-policy">restart policy</Term>. Step through one pod&apos;s life.
      </p>
      <p>
        That&apos;s why &ldquo;You&apos;ll rarely create individual Pods directly in Kubernetes—even
        singleton Pods&rdquo;: pods are disposable. Deployments and other controllers (modules 5 and
        7) create and replace them for you.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Same pod or separate? ---------------------------------------------------------------------- */

export function SameOrSeparate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Same pod or separate?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="same-or-separate"
            prompt="Should these containers share a pod?"
            categories={[
              { id: "same", label: "Same pod" },
              { id: "separate", label: "Separate pods" },
            ]}
            items={[
              {
                id: "logs",
                label: "A web app and a helper that ships its log files",
                category: "same",
                why: "A classic sidecar: tightly coupled, sharing a volume.",
              },
              {
                id: "db",
                label: "A web app and its PostgreSQL database",
                category: "separate",
                why: "They scale, fail and upgrade independently; the database needs its own storage.",
              },
              {
                id: "proxy",
                label: "An app and a proxy that handles its TLS on localhost",
                category: "same",
                why: "Service-mesh proxies run as sidecars sharing the pod's network.",
              },
              {
                id: "frontend",
                label: "The frontend and the backend API",
                category: "separate",
                why: "Different teams, different scaling. Connect them with a Service (module 8).",
              },
              {
                id: "migrate",
                label: "A database migration that must finish before the app starts",
                category: "same",
                why: "An init container in the app's pod.",
              },
              {
                id: "copies",
                label: "Two copies of the same web app, for more capacity",
                category: "separate",
                why: "More capacity means more pods (replicas), not more containers in one pod.",
              },
            ]}
            explanation="Put containers in one pod only when they must live and die together and share a network or files. Everything else gets its own pods."
          />
        </div>
      }
    >
      <p>Six pairings. Which belong in one pod?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Smallest unit", "Kubernetes runs pods, not bare containers."],
  ["Shared home", "One IP, localhost between containers, optional shared volumes."],
  ["Helpers", "Init containers run first and exit; sidecars run alongside."],
  ["Disposable", "Crashed containers restart with back-off; dead pods are replaced, never moved."],
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
      <p>Next: Deployments, and releasing new versions without downtime.</p>
    </StepLayout>
  );
}

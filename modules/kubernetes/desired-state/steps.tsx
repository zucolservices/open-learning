"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Flame, Minus, Pause, Play, Plus, Power, Snowflake, Trash2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { deletePod, fmt, setNode, start, tick, type Sim } from "./model";
import type { DesiredState } from "./state";

/* 1 ─ The thermostat ----------------------------------------------------------------------------- */

export function Thermostat() {
  const [s, set] = useSceneState<DesiredState>();
  const [room, setRoom] = useState(30);
  useEffect(() => {
    const id = setInterval(() => {
      setRoom((r) =>
        Math.abs(r - s.target) < 0.25 ? s.target : r + (r < s.target ? 0.25 : -0.25),
      );
    }, 150);
    return () => clearInterval(id);
  }, [s.target]);
  const mode = Math.abs(room - s.target) < 0.25 ? "idle" : room > s.target ? "cool" : "heat";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="The thermostat"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="grid w-full max-w-sm grid-cols-2 gap-3 text-center">
            <div className="border-accent bg-accent-soft rounded-xl border px-3 py-3">
              <p className="text-muted text-[10px]">Desired state (you set)</p>
              <p className="font-mono text-3xl font-semibold">{s.target}°</p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-3">
              <p className="text-muted text-[10px]">Current state (the room)</p>
              <p className="font-mono text-3xl font-semibold">{room.toFixed(1)}°</p>
            </div>
          </div>
          <input
            type="range"
            min={18}
            max={30}
            value={s.target}
            onChange={(e) => set({ target: Number(e.target.value) })}
            className="accent-accent w-full max-w-sm"
            aria-label="Desired temperature"
          />
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm",
              mode === "idle" ? "border-good/50 bg-good/10" : "border-line bg-surface",
            )}
          >
            {mode === "cool" ? (
              <Snowflake className="text-viz-data size-4" />
            ) : mode === "heat" ? (
              <Flame className="text-viz-remove size-4" />
            ) : null}
            {mode === "idle"
              ? "Matches: nothing to do"
              : mode === "cool"
                ? "Too warm: cooling on"
                : "Too cold: heating on"}
          </motion.div>
        </div>
      }
    >
      <p>
        You don&apos;t tell a thermostat &ldquo;run the cooler for twelve minutes&rdquo;. You set
        the temperature you want, and it keeps comparing the room with that and switching things on
        or off. Move the slider.
      </p>
      <p>
        Kubernetes&apos; documentation uses exactly this picture: &ldquo;When you set the
        temperature, that&apos;s telling the thermostat about your <em>desired state</em>. The
        actual room temperature is the <em>current state</em>.&rdquo; Kubernetes is built from
        dozens of these loops, called <Term id="controller">controllers</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Break it, watch it heal ⭐ ------------------------------------------------------------------- */

export function Heal() {
  const [s, set] = useSceneState<DesiredState>();
  const [sim, setSim] = useState<Sim>(() => start(s.replicas, s.managed));
  const [running, setRunning] = useState(true);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSim((x) => tick(x, s.replicas, s.managed)), 700);
    return () => clearInterval(id);
  }, [running, s.replicas, s.managed]);
  const reset = (managed: boolean, replicas = s.replicas) => {
    set({ managed, replicas });
    setSim(start(replicas, managed));
  };
  const nodeDown = sim.nodes.some((n) => !n.up);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Break it, watch it heal"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={s.managed ? "managed" : "bare"}
              options={[
                ["managed", "Pods from a Deployment"],
                ["bare", "Pods created directly"],
              ]}
              onChange={(v) => reset(v === "managed")}
            />
            <div className="border-line flex items-center gap-1 rounded-full border px-1 py-0.5 text-xs">
              <button
                type="button"
                aria-label="Fewer replicas"
                disabled={!s.managed}
                onClick={() => set({ replicas: Math.max(1, s.replicas - 1) })}
                className="hover:bg-surface-2 rounded-full p-1 disabled:opacity-30"
              >
                <Minus className="size-3" />
              </button>
              <span className="font-mono">replicas: {s.replicas}</span>
              <button
                type="button"
                aria-label="More replicas"
                disabled={!s.managed}
                onClick={() => set({ replicas: Math.min(9, s.replicas + 1) })}
                className="hover:bg-surface-2 rounded-full p-1 disabled:opacity-30"
              >
                <Plus className="size-3" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setRunning(!running)}
              className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs"
            >
              {running ? <Pause className="size-3" /> : <Play className="size-3" />}
              {running ? "Pause" : "Run"}
            </button>
            <span className="text-muted font-mono text-xs">clock {fmt(sim.clock)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {sim.nodes.map((n, i) => (
              <div
                key={i}
                className={cn(
                  "flex min-h-36 flex-col gap-1.5 rounded-xl border p-2",
                  n.up ? "border-line bg-surface" : "border-bad/60 bg-bad/10",
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold">node-{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => setSim((x) => setNode(x, i, !n.up))}
                    aria-label={n.up ? `Cut power to node-${i + 1}` : `Restore node-${i + 1}`}
                    className={cn(
                      "rounded-full p-1",
                      n.up ? "text-muted hover:bg-surface-2" : "text-bad",
                    )}
                  >
                    <Power className="size-3.5" />
                  </button>
                </div>
                {sim.pods
                  .filter((p) => p.node === i)
                  .map((p) => (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "flex items-center justify-between gap-1 rounded-md border px-1.5 py-1 font-mono text-[10px]",
                        p.phase === "Unknown"
                          ? "border-bad/60 text-muted border-dashed"
                          : "border-accent/60 bg-accent-soft",
                      )}
                    >
                      <span className="truncate">{p.id}</span>
                      <button
                        type="button"
                        aria-label={`Delete ${p.id}`}
                        onClick={() => setSim((x) => deletePod(x, p.id))}
                        className="text-muted hover:text-bad shrink-0"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </motion.div>
                  ))}
                {!n.up && <p className="text-bad mt-auto text-[9px]">no heartbeat</p>}
              </div>
            ))}
          </div>
          <div className="border-line bg-surface rounded-lg border px-3 py-2 font-mono text-[10px]">
            {sim.log.slice(-5).map((l, i) => (
              <p
                key={`${l}-${i}`}
                className={i === Math.min(4, sim.log.length - 1) ? "text-fg" : "text-muted"}
              >
                {l}
              </p>
            ))}
          </div>
          {nodeDown && (
            <button
              type="button"
              onClick={() =>
                setSim((x) =>
                  Array.from({ length: 6 }).reduce<Sim>((a) => tick(a, s.replicas, s.managed), x),
                )
              }
              className="text-accent self-start text-xs underline"
            >
              Skip ahead one minute
            </button>
          )}
        </div>
      }
    >
      <p>
        Delete a pod with its bin icon, change the replica count, or cut the power to a node. Each
        tick is ten simulated seconds. The controller compares how many pods exist with how many you
        asked for, and fixes the difference.
      </p>
      <p>
        A dead node is slower: by default the cluster waits 50 seconds without a heartbeat, then
        another 300 seconds before evicting its pods, in case the node comes back. Now switch to
        pods created directly: with no controller watching, a deleted pod stays deleted.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Spec and status --------------------------------------------------------------------------- */

const FRAMES = [
  {
    title: "You write the spec",
    spec: 3,
    status: "—",
    text: 'kubectl apply sends your file to the API server, which stores it. The spec is your desired state: the object is a "record of intent".',
    yaml: true,
  },
  {
    title: "Status reports reality",
    spec: 3,
    status: "0 of 3 ready",
    text: "Almost every object has two halves: the spec you write and the status the system writes. Right after apply, nothing is running yet.",
  },
  {
    title: "Controllers close the gap",
    spec: 3,
    status: "3 of 3 ready",
    text: "The Deployment's controllers create pods until status matches spec. You never said how; you said what.",
  },
  {
    title: "Level-based, not step by step",
    spec: 3,
    status: "3 of 3 ready",
    text: 'Change replicas to 5, then quickly back to 3. The controller only looks at the latest spec, so it never has to pass through 5. Kubernetes\' API conventions call this "level-based rather than edge-based".',
    yaml: true,
  },
  {
    title: "Drift",
    spec: 8,
    status: "8 of 8 ready",
    text: "A colleague runs kubectl scale --replicas=8. That changes the live spec. Re-applying your file puts it back to 3 only if the file sets replicas; mixing commands and files for one object is asking for surprises.",
    tone: "bad" as const,
  },
];

export function SpecStatus() {
  const [s, set] = useSceneState<DesiredState>();
  const f = FRAMES[s.frame] ?? FRAMES[0];
  return (
    <StepLayout
      eyebrow="Step through"
      title="Spec and status"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
              {`kind: Deployment
metadata:
  name: payments-api
spec:
  replicas: `}
              <span className={cn("font-semibold", f.spec !== 3 ? "text-bad" : "text-accent")}>
                {f.spec}
              </span>
              {`
  template: …`}
            </pre>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">status (written by Kubernetes)</p>
              <p className="font-mono text-lg font-semibold">{f.status}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {Array.from(
                  { length: f.status.startsWith("0") || f.status === "—" ? 0 : f.spec },
                  (_, i) => (
                    <motion.span
                      key={`${s.frame}-${i}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.05 * i }}
                      className="border-accent bg-accent/30 size-4 rounded-sm border"
                    />
                  ),
                )}
              </div>
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
        Every change you make is a change to an object&apos;s <Term id="spec-status">spec</Term>.
        You can make it with commands (<code>kubectl create</code>, <code>kubectl scale</code>) or
        by applying files (<code>kubectl apply -f</code>). Teams use files kept in Git, because the
        file is then the whole truth.
      </p>
      <p>
        Kubernetes&apos; own advice: &ldquo;A Kubernetes object should be managed using only one
        technique. Mixing and matching techniques for the same object results in undefined
        behavior.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 4 ─ Will it come back? -------------------------------------------------------------------------- */

export function ComeBack() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Will it come back?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="come-back"
            prompt="After each event, does Kubernetes restore what was there?"
            categories={[
              { id: "yes", label: "Yes, put back" },
              { id: "no", label: "No" },
            ]}
            items={[
              {
                id: "del",
                label: "You delete one of a Deployment's pods",
                category: "yes",
                why: "The ReplicaSet controller sees one too few and creates a replacement, with a new name and IP.",
              },
              {
                id: "bare",
                label: "You delete a pod you created directly, with no controller",
                category: "no",
                why: "Nothing holds a desired count for it, so nothing recreates it.",
              },
              {
                id: "node",
                label: "A node loses power",
                category: "yes",
                why: "After about five minutes by default, its pods are evicted and recreated on healthy nodes.",
              },
              {
                id: "scale",
                label: "Someone runs kubectl scale --replicas=8",
                category: "no",
                why: "That changed the desired state itself; the cluster now keeps 8 until someone changes it again.",
              },
              {
                id: "deploy",
                label: "You delete the Deployment",
                category: "no",
                why: "You removed the desired state; its pods are cleaned up too.",
              },
              {
                id: "crash",
                label: "The app inside a pod crashes",
                category: "yes",
                why: "The kubelet on that node restarts the container (the default restart policy is Always).",
              },
            ]}
            explanation="Kubernetes restores whatever the desired state says. Change or delete the desired state, and that becomes the new truth."
          />
        </div>
      }
    >
      <p>Six things happen to a running app. Which ones does the cluster undo?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Desired vs current", "You write the spec; Kubernetes writes the status."],
  ["Controllers reconcile", "Loops that keep comparing and fixing the difference."],
  ["Level-based", "Only the latest desired state matters, not the steps to it."],
  ["Files, not commands", "Keep the desired state in files, ideally in Git, and change it there."],
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
      <p>Next: the cluster taken apart, and what really happens on kubectl apply.</p>
    </StepLayout>
  );
}

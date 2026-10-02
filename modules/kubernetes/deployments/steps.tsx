"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Pause, Play, RotateCcw, Undo2 } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEADLINE_S, REPLICAS, initial, retarget, step, type Roll } from "./model";
import type { DeployState } from "./state";

/* 1 ─ Shift change ------------------------------------------------------------------------------ */

export function ShiftChange() {
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Shift change at a busy restaurant"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Everyone at once",
              "The whole day shift leaves, then the night shift arrives. For twenty minutes nobody serves the tables.",
              "Recreate",
              false,
            ],
            [
              "A few at a time",
              "Two new waiters arrive, learn the tables, then two old ones leave. Every table is served throughout.",
              "Rolling update",
              true,
            ],
          ].map(([t, d, k, ok], i) => (
            <motion.div
              key={t as string}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i }}
              className={cn(
                "flex flex-col gap-2 rounded-xl border px-4 py-4",
                ok ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t as string}</p>
              <p className="text-muted text-sm">{d as string}</p>
              <p className="mt-auto font-mono text-xs">{k as string}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A restaurant can&apos;t close every time the shift changes. Neither can your app every time
        you ship a new version.
      </p>
      <p>
        A <Term id="deployment">Deployment</Term> keeps a set number of identical pods running and,
        when you change the version, swaps them a few at a time: a{" "}
        <Term id="rolling-update">rolling update</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Roll it out ⭐ ------------------------------------------------------------------------------ */

const NUMS = [0, 1, 2, 3, 4, 5];

export function RollItOut() {
  const [s, set] = useSceneState<DeployState>();
  const [roll, setRoll] = useState<Roll>(initial);
  const [running, setRunning] = useState(false);
  const active = running && !roll.done && !roll.stalled;
  const opts = {
    strategy: s.strategy,
    surge: s.surge,
    unavailable: s.unavailable,
    broken: s.broken,
  };
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setRoll((r) => step(r, opts)), 600);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, s.strategy, s.surge, s.unavailable, s.broken]);
  const ready = roll.pods.filter((p) => p.ready).length;
  const minAvail = s.strategy === "Recreate" ? 0 : REPLICAS - s.unavailable;
  const invalid = s.strategy === "RollingUpdate" && s.surge === 0 && s.unavailable === 0;
  const launch = () => {
    setRoll((r) => retarget(r.target === "v2" ? initial() : r, "v2"));
    setRunning(true);
  };
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Roll it out"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Segmented
              size="sm"
              value={s.strategy}
              options={[
                ["RollingUpdate", "RollingUpdate"],
                ["Recreate", "Recreate"],
              ]}
              onChange={(v) => set({ strategy: v })}
            />
            <label className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={s.broken}
                onChange={(e) => set({ broken: e.target.checked })}
                className="accent-accent"
              />
              v2 is broken (never Ready)
            </label>
          </div>
          {s.strategy === "RollingUpdate" && (
            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ["maxSurge", "surge", "extra pods allowed"],
                  ["maxUnavailable", "unavailable", "pods allowed to be missing"],
                ] as const
              ).map(([label, key, hint]) => (
                <div key={key} className="flex flex-col gap-1 text-xs">
                  <span className="text-muted">
                    <span className="text-fg font-mono">{label}</span> · {hint}
                  </span>
                  <Segmented
                    size="sm"
                    value={String(s[key])}
                    options={NUMS.map((n) => [String(n), String(n)])}
                    onChange={(v) => set({ [key]: Number(v) })}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={invalid || active}
              onClick={launch}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm disabled:opacity-40"
            >
              <Play className="size-3.5" /> Deploy v2
            </button>
            {!roll.done && (
              <button
                type="button"
                onClick={() => setRunning(!active)}
                className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
              >
                {active ? <Pause className="size-3" /> : <Play className="size-3" />}
                {active ? "Pause" : "Resume"}
              </button>
            )}
            {roll.target === "v2" && (roll.stalled || !roll.done) && (
              <button
                type="button"
                onClick={() => {
                  setRoll((r) => retarget(r, "v1"));
                  setRunning(true);
                }}
                className="border-line hover:bg-surface-2 flex items-center gap-1 rounded-full border px-3 py-1 font-mono text-xs"
              >
                <Undo2 className="size-3" /> kubectl rollout undo
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setRoll(initial());
                setRunning(false);
              }}
              className="text-muted flex items-center gap-1 px-2 py-1 text-xs"
            >
              <RotateCcw className="size-3" /> Reset
            </button>
            <span className="text-muted font-mono text-xs">{roll.clock} s</span>
          </div>
          {invalid && (
            <p className="text-bad text-xs">
              maxSurge and maxUnavailable can&apos;t both be 0: the rollout could never move.
            </p>
          )}
          {(["v1", "v2"] as const).map((v) => {
            const pods = roll.pods.filter((p) => p.v === v);
            return (
              <div key={v}>
                <p className="text-muted mb-1 font-mono text-[10px]">
                  ReplicaSet payments-api-{v === "v1" ? "75675f5897" : "6b474476c4"} ({v}) ·{" "}
                  {pods.length} pods
                </p>
                <div className="flex min-h-7 flex-wrap gap-1">
                  {pods.map((p) => (
                    <motion.span
                      key={p.id}
                      layout
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-md border font-mono text-[9px]",
                        p.ready
                          ? v === "v1"
                            ? "border-viz-idle bg-viz-idle/30"
                            : "border-accent bg-accent/30"
                          : s.broken && v === "v2"
                            ? "border-bad text-bad border-dashed"
                            : "border-accent border-dashed",
                      )}
                    >
                      {v}
                    </motion.span>
                  ))}
                </div>
              </div>
            );
          })}
          <div>
            <p className="text-muted mb-1 text-[10px]">
              Ready pods over time (line: the least allowed)
            </p>
            <div className="bg-surface-2 relative flex h-16 items-end gap-px overflow-hidden rounded px-1">
              {roll.history.slice(-60).map((h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    h < minAvail || h === 0 ? "bg-bad" : "bg-good/70",
                  )}
                  style={{ height: h === 0 ? "6%" : `${(h / (REPLICAS + 5)) * 100}%` }}
                />
              ))}
              {minAvail > 0 && (
                <div
                  className="border-fg/50 absolute right-0 left-0 border-t border-dashed"
                  style={{ bottom: `${(minAvail / (REPLICAS + 5)) * 100}%` }}
                />
              )}
            </div>
          </div>
          <p className={cn("text-sm", roll.stalled && "text-bad")}>
            {roll.stalled
              ? `No progress for ${DEADLINE_S} s: the Deployment reports ProgressDeadlineExceeded. Kubernetes does not roll back by itself; ${ready} pods still serve v1. Undo it.`
              : roll.done && roll.target === "v2"
                ? `Done in ${roll.clock} s. ${s.strategy === "Recreate" ? "But for a while there were no ready pods at all: downtime." : "Ready pods never dropped below the line."}`
                : roll.done && roll.target === "v1" && roll.clock > 0
                  ? "Rolled back to v1, the same careful way."
                  : `${ready} of ${REPLICAS} ready · ${roll.pods.length} pods in total (at most ${REPLICAS + (s.strategy === "Recreate" ? 0 : s.surge)})`}
          </p>
        </div>
      }
    >
      <p>
        Ten pods run v1. Deploy v2 and watch the two ReplicaSets trade places. maxSurge is how many
        extra pods may exist during the rollout; maxUnavailable is how many may be missing. Both
        default to 25%: for ten replicas that&apos;s 3 extra and 2 missing (surge rounds up,
        unavailable rounds down).
      </p>
      <p>
        Try 1 and 0 (slow and safe), Recreate (fast, with downtime), then a broken v2. New pods only
        count once their readiness check passes (module 6), so a bad version stalls instead of
        replacing everything.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Under the hood ----------------------------------------------------------------------------- */

export function UnderTheHood() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Under the hood"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-col items-center gap-2">
            <div className="border-accent bg-accent-soft rounded-lg border px-4 py-2 font-mono text-xs">
              Deployment payments-api · replicas: 10
            </div>
            <div className="text-subtle text-xs">owns</div>
            <div className="grid w-full gap-2 sm:grid-cols-2">
              {[
                ["payments-api-75675f5897", "revision 1 · v1 · 0 pods", true],
                ["payments-api-6b474476c4", "revision 2 · v2 · 10 pods", false],
              ].map(([n, d, old]) => (
                <div
                  key={n as string}
                  className={cn(
                    "rounded-lg border px-3 py-2 font-mono text-[11px]",
                    old
                      ? "border-line bg-surface text-muted"
                      : "border-viz-compute bg-viz-compute/10",
                  )}
                >
                  <p>ReplicaSet {n as string}</p>
                  <p className="text-[10px]">{d as string}</p>
                </div>
              ))}
            </div>
            <div className="text-subtle text-xs">owns</div>
            <div className="flex flex-wrap justify-center gap-1 font-mono text-[10px]">
              {["7ci7o", "kzszj", "qqcnn", "m2x7v"].map((x) => (
                <span
                  key={x}
                  className="border-accent/60 bg-accent-soft rounded border px-1.5 py-0.5"
                >
                  payments-api-6b474476c4-{x}
                </span>
              ))}
              <span className="text-muted">…</span>
            </div>
          </div>
          <pre className="border-line bg-surface overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[11px] leading-relaxed">
            {`kubectl rollout status  deployment/payments-api
kubectl rollout history deployment/payments-api
kubectl rollout undo    deployment/payments-api --to-revision=1
kubectl rollout pause | resume deployment/payments-api`}
          </pre>
        </div>
      }
    >
      <p>
        A Deployment doesn&apos;t manage pods directly. Each version of the pod template gets its
        own <Term id="replicaset">ReplicaSet</Term>, named after the Deployment plus a hash of the
        template; pods get the ReplicaSet&apos;s name plus a random suffix. A rollout is the
        Deployment scaling the new ReplicaSet up and the old one down.
      </p>
      <p>
        Old ReplicaSets are kept, scaled to zero (ten by default), which is what makes rollback
        quick. For blue/green or canary releases, which Deployments don&apos;t do by themselves,
        teams use two Deployments behind one Service, or tools such as Argo Rollouts and Flagger.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Does it roll? ------------------------------------------------------------------------------ */

export function DoesItRoll() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Does it roll?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="does-it-roll"
            prompt="Which changes start a rollout?"
            categories={[
              { id: "yes", label: "Starts a rollout" },
              { id: "no", label: "No rollout" },
            ]}
            items={[
              {
                id: "image",
                label: "Change the image from v2 to v3",
                category: "yes",
                why: "The pod template changed, so a new ReplicaSet is created.",
              },
              {
                id: "scale",
                label: "Scale from 10 to 20 replicas",
                category: "no",
                why: "Scaling only changes how many pods the current ReplicaSet runs.",
              },
              {
                id: "env",
                label: "Add an environment variable to the container",
                category: "yes",
                why: "Anything inside .spec.template counts.",
              },
              {
                id: "surge",
                label: "Change maxSurge from 3 to 1",
                category: "no",
                why: "That's the strategy, not the pod template. It applies to the next rollout.",
              },
              {
                id: "undo",
                label: "Run kubectl rollout undo",
                category: "yes",
                why: "It puts the previous template back, which rolls out the old ReplicaSet again.",
              },
              {
                id: "label",
                label: "Add a label to the Deployment itself (not its pods)",
                category: "no",
                why: "Only changes to .spec.template trigger a rollout.",
              },
            ]}
            explanation="A rollout happens if and only if the pod template changes. Scaling and strategy changes don't replace any pods."
          />
        </div>
      }
    >
      <p>Six edits to a Deployment. Which ones replace pods?</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  ["Deployment → ReplicaSets → Pods", "One ReplicaSet per version of the pod template."],
  ["Rolling by default", "maxSurge extra, maxUnavailable missing; both 25% by default."],
  ["Readiness gates progress", "Broken versions stall; Kubernetes reports, it doesn't undo."],
  ["Rollback is one command", "kubectl rollout undo scales the old ReplicaSet back up."],
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
      <p>Next: health checks, and how Kubernetes knows a pod is ready.</p>
    </StepLayout>
  );
}

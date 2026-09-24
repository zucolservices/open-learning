"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { LAGS_MS, commitModel, reads, type Strategy } from "./model";
import type { ReplicationState } from "./state";

/* 1 ─ Where did my change go? ⭐ ----------------------------------------------------------------- */

const STRATEGIES: [Strategy, string, string][] = [
  ["any", "Any replica", "The load balancer picks a replica for each read."],
  ["sticky", "Same replica", "Each user always reads from one replica."],
  ["leader", "Leader after writes", "For a few seconds after writing, read from the leader."],
  [
    "wait",
    "Wait to catch up",
    "Remember the write's position; the replica waits until it has applied it.",
  ],
];

const fmt = (ms: number) => (ms >= 1000 ? `${ms / 1000} s` : `${ms} ms`);

export function WhereDidItGo() {
  const [s, set] = useSceneState<ReplicationState>();
  const lag = LAGS_MS[s.lag];
  const rs = reads(lag, s.readStrategy);
  const oldAfterNew = rs.some((r, i) => i > 0 && !r.fresh && rs.slice(0, i).some((p) => p.fresh));
  const anyStale = rs.some((r) => !r.fresh);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Where did my change go?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Replication lag</span>
            <Segmented
              size="sm"
              value={String(s.lag)}
              options={LAGS_MS.map(
                (l, i) => [String(i), `${fmt(l)}${i === 2 ? " (busy)" : ""}`] as [string, string],
              )}
              onChange={(v) => set({ lag: Number(v) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {STRATEGIES.map(([id, label, how]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ readStrategy: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left",
                  s.readStrategy === id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-semibold">{label}</span>
                <span className="text-muted block text-[10px] leading-snug">{how}</span>
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-sm">
              At 0 ms Priya changes her display name from <span className="font-mono">priya_k</span>{" "}
              to <span className="font-mono">Priya ☕</span> (written to the leader). Then she
              refreshes:
            </p>
            <div className="mt-3 grid gap-1.5">
              {rs.map((r, i) => (
                <motion.div
                  key={`${s.lag}${s.readStrategy}${i}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={cn(
                    "grid grid-cols-[4.5rem_6rem_1fr] items-center gap-2 rounded-lg border px-3 py-1.5 text-xs",
                    r.fresh ? "border-good/40 bg-good/5" : "border-bad/40 bg-bad/10",
                  )}
                >
                  <span className="text-muted font-mono">+{fmt(r.at)}</span>
                  <span className="text-muted">{r.server}</span>
                  <span className="font-mono">
                    {r.fresh ? "Priya ☕" : "priya_k"}
                    {r.extraWaitMs > 0 && (
                      <span className="text-muted font-sans"> (waited {fmt(r.extraWaitMs)})</span>
                    )}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              anyStale ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {oldAfterNew
              ? "She saw her new name, then the old one again: reads jumped to a replica further behind. That breaks both read-your-writes and monotonic reads."
              : anyStale
                ? "Her own change isn't visible yet: read-your-writes is broken, though each refresh never goes backwards."
                : s.readStrategy === "wait" && rs.some((r) => r.extraWaitMs > 0)
                  ? "Always fresh, at the cost of an occasional wait when a replica is behind."
                  : "She sees her own change every time."}
          </p>
        </div>
      }
    >
      <p>
        A bank&apos;s head office updates its ledger, and each branch receives a copy a little
        later. Ask a branch too soon and you get yesterday&apos;s balance.
      </p>
      <p>
        Databases do the same: a <Term id="leader-follower">leader</Term> takes the writes and{" "}
        <Term id="replica">replicas</Term> copy them, a little behind. That delay is{" "}
        <Term id="replication-lag">replication lag</Term>. Usually milliseconds; under load, seconds
        or more. Try each lag and each way of choosing where to read.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Wait for the copy, or not? ---------------------------------------------------------------- */

export function SyncOrAsync() {
  const [s, set] = useSceneState<ReplicationState>();
  const c = commitModel(s.mode, s.remote);
  return (
    <StepLayout
      eyebrow="The trade-off"
      title="Wait for the copy, or not?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.mode}
            options={[
              ["async", "Asynchronous"],
              ["semi", "Semi-synchronous"],
              ["sync", "Synchronous"],
            ]}
            onChange={(v) => set({ mode: v as ReplicationState["mode"] })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.remote}
              onChange={(e) => set({ remote: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            The replica is in another region
          </label>
          <div className="border-line bg-surface grid gap-2 rounded-xl border p-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="border-viz-data/60 bg-viz-data/10 rounded-lg border px-2 py-1">
                Leader
              </span>
              <motion.span
                key={s.mode}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className={cn(
                  "h-0.5 flex-1 origin-left",
                  s.mode === "async" ? "bg-line-strong border-t border-dashed" : "bg-accent",
                )}
              />
              <span className="border-viz-data/40 rounded-lg border border-dashed px-2 py-1">
                Replica{s.remote ? " (far away)" : ""}
              </span>
            </div>
            <p className="text-muted text-center text-[11px]">
              {s.mode === "async"
                ? "The user hears 'saved' before the copy is sent."
                : "The user hears 'saved' only after the replica confirms."}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                c.latency > 50 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">Time to confirm a write</p>
              <motion.p
                key={c.latency}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                ≈ {c.latency} ms
              </motion.p>
            </div>
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                s.mode === "async" ? "border-bad/40 bg-bad/5" : "border-good/40 bg-good/5",
              )}
            >
              <p className="text-muted text-[10px]">If the leader dies, lost</p>
              <p className="text-sm">{c.lost}</p>
            </div>
          </div>
          <p className="text-subtle text-xs">
            Illustrative: 1 ms to flush locally, ~1.5 ms to a replica nearby, ~140 ms to one on
            another continent.
          </p>
        </div>
      }
    >
      <p>
        Should the leader wait for a replica before telling the user &ldquo;saved&rdquo;? Waiting
        protects against losing data if the leader dies; not waiting keeps writes fast.
      </p>
      <p className="text-muted text-sm">
        Many databases let you choose per system, or even per transaction. A common compromise: wait
        for one nearby replica, copy to far-away ones asynchronously.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint --------------------------------------------------------------------------------- */

export function LagCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The disappearing photo"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="disappearing-photo"
            prompt="Priya uploads a new profile photo. The page reloads showing her old photo; a second reload shows the new one; a third shows the old one again. What's happening, and what's the usual fix?"
            options={[
              {
                id: "lag",
                label:
                  "Reads go to different replicas with different lag; read her own profile from the leader (or a caught-up replica) for a short while after she changes it",
                correct: true,
                feedback:
                  "Right. Read-your-writes only needs to hold for the person who wrote; everyone else can tolerate a moment's lag.",
              },
              {
                id: "cache",
                label: "The browser cached the old photo",
                feedback:
                  "Possible for images, but flipping back and forth points to different servers returning different answers.",
              },
              {
                id: "sync",
                label: "Make all replication synchronous",
                feedback:
                  "That would fix it at a high cost to every write. Routing her reads is far cheaper.",
              },
              {
                id: "bug",
                label: "The upload failed and was retried",
                feedback: "Then the new photo wouldn't appear at all on the second reload.",
              },
            ]}
            explanation="Replicas are allowed to be behind. Design reads so that users never see their own changes vanish."
          />
        </div>
      }
    >
      <p>A classic bug report.</p>
    </StepLayout>
  );
}

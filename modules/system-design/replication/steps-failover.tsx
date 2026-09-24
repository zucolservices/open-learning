"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ReplicationState } from "./state";

/* 4 ─ When the leader dies ⭐ --------------------------------------------------------------------- */

type Box = {
  label: string;
  role: string;
  tone: "leader" | "replica" | "dead" | "zombie" | "fenced";
};
interface FailFrame {
  title: string;
  text: string;
  boxes: [Box, Box, Box];
  tone?: "good" | "bad";
}

function failFrames(fencing: boolean): FailFrame[] {
  const f: FailFrame[] = [
    {
      title: "All is well",
      text: "Node A leads and takes every write; B and C copy it asynchronously, a few writes behind.",
      boxes: [
        { label: "A", role: "leader · write #1042", tone: "leader" },
        { label: "B", role: "replica · has #1040", tone: "replica" },
        { label: "C", role: "replica · has #1039", tone: "replica" },
      ],
    },
    {
      title: "A stops answering",
      text: "Health checks to A time out. Is it dead, or just slow, or cut off by the network? From outside, these look the same.",
      boxes: [
        { label: "A", role: "no answer", tone: "dead" },
        { label: "B", role: "replica · has #1040", tone: "replica" },
        { label: "C", role: "replica · has #1039", tone: "replica" },
      ],
    },
    {
      title: "Promote the most up-to-date replica",
      text: "B had the most recent writes, so it becomes the new leader, and writes are redirected to it. Writes #1041 and #1042 never reached B: they're lost.",
      boxes: [
        { label: "A", role: "presumed dead", tone: "dead" },
        { label: "B", role: "new leader", tone: "leader" },
        { label: "C", role: "follows B", tone: "replica" },
      ],
      tone: "bad",
    },
    fencing
      ? {
          title: "A comes back, and is fenced off",
          text: "A was only cut off. It returns believing it still leads, but its leadership 'epoch' is old: storage and replicas reject its writes, and it rejoins as a replica.",
          boxes: [
            { label: "A", role: "fenced · rejoins as replica", tone: "fenced" },
            { label: "B", role: "leader (epoch 2)", tone: "leader" },
            { label: "C", role: "follows B", tone: "replica" },
          ],
          tone: "good",
        }
      : {
          title: "A comes back: two leaders",
          text: "A was only cut off. It returns believing it still leads and accepts writes, while B does too. The data splits in two directions: split brain.",
          boxes: [
            { label: "A", role: "thinks it's leader!", tone: "zombie" },
            { label: "B", role: "leader", tone: "leader" },
            { label: "C", role: "follows B", tone: "replica" },
          ],
          tone: "bad",
        },
  ];
  return f;
}

const BOX_STYLE: Record<Box["tone"], string> = {
  leader: "border-accent bg-accent-soft",
  replica: "border-viz-data/50 bg-viz-data/10",
  dead: "border-line border-dashed opacity-50",
  zombie: "border-bad bg-bad/15",
  fenced: "border-line bg-surface-2",
};

export function Failover() {
  const [s, set] = useSceneState<ReplicationState>();
  const fs = failFrames(s.fencing);
  const step = Math.min(s.failFrame, fs.length - 1);
  const f = fs[step];
  return (
    <StepLayout
      eyebrow="Step through"
      title="When the leader dies"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={s.fencing}
              onChange={(e) => set({ fencing: e.target.checked })}
              className="accent-[var(--accent)]"
            />
            Use fencing (leadership epochs)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {f.boxes.map((b) => (
              <motion.div
                key={b.label + b.tone + b.role}
                layout
                initial={{ opacity: 0.5, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn("rounded-xl border px-2 py-3 text-center", BOX_STYLE[b.tone])}
              >
                <p className="text-lg font-semibold">{b.label}</p>
                <p className="text-muted text-[11px]">{b.role}</p>
              </motion.div>
            ))}
          </div>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ failFrame: n })} />
          <FrameCaption frameKey={`${s.fencing}${step}`} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Replicas also let you survive losing the leader: promote one to take over. That&apos;s{" "}
        <Term id="failover">failover</Term>. It sounds simple and is one of the hardest things in
        distributed systems.
      </p>
      <p>Step through it, then again with fencing switched on.</p>
      <p className="text-muted text-sm">
        Two lessons: with asynchronous replication, failover can lose recent writes; and an old
        leader that comes back must be stopped from acting as leader.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Three shapes of replication ---------------------------------------------------------------- */

const TOPOS: Record<
  ReplicationState["topo"],
  { title: string; nodes: string[]; how: string; good: string; bad: string }
> = {
  single: {
    title: "Single leader",
    nodes: ["Leader", "Replica", "Replica"],
    how: "One node takes all writes; others copy it.",
    good: "Simple; no write conflicts. Used by PostgreSQL, MySQL and most managed databases.",
    bad: "All writes go through one node; failover takes time.",
  },
  multi: {
    title: "Multi-leader",
    nodes: ["Leader (Mumbai)", "Leader (Frankfurt)", "Leader (Virginia)"],
    how: "Several nodes accept writes (often one per region) and exchange changes.",
    good: "Fast local writes in every region; keeps working if a region is cut off.",
    bad: "Two regions can change the same record at once: conflicts must be resolved.",
  },
  leaderless: {
    title: "Leaderless",
    nodes: ["Node", "Node", "Node"],
    how: "Clients write to several nodes and read from several; no node is special (the Dynamo style, e.g. Cassandra).",
    good: "No failover needed; tolerates slow or failed nodes.",
    bad: "Replicas can disagree; reads and writes need quorums and repair.",
  },
};

export function Topologies() {
  const [s, set] = useSceneState<ReplicationState>();
  const t = TOPOS[s.topo];
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Three shapes of replication"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.topo}
            options={(Object.keys(TOPOS) as ReplicationState["topo"][]).map(
              (k) => [k, TOPOS[k].title] as [string, string],
            )}
            onChange={(v) => set({ topo: v as ReplicationState["topo"] })}
          />
          <div className="border-line bg-surface flex min-h-32 items-center justify-center gap-3 rounded-xl border p-4">
            <AnimatePresence mode="popLayout">
              {t.nodes.map((n, i) => (
                <motion.span
                  key={s.topo + i}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-center text-xs",
                    n.startsWith("Leader")
                      ? "border-accent bg-accent-soft font-semibold"
                      : "border-viz-data/50 bg-viz-data/10",
                  )}
                >
                  {n}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <motion.div
            key={s.topo}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-2 text-sm"
          >
            <p>{t.how}</p>
            <p className="border-good/40 bg-good/10 rounded-xl border px-3 py-2">{t.good}</p>
            <p className="border-bad/40 bg-bad/10 rounded-xl border px-3 py-2">{t.bad}</p>
          </motion.div>
        </div>
      }
    >
      <p>
        Single-leader is the default almost everywhere. The other two trade simplicity for
        availability.
      </p>
    </StepLayout>
  );
}

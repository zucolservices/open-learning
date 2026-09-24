"use client";

import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, CircleDashed, MinusCircle } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Stepper } from "@/toolkit/controls/stepper";
import { cn } from "@/lib/cn";
import { DECISIONS, REQUIREMENTS, requirementStatus } from "./data";
import type { DesignState } from "./state";

const STATUS_ICON = {
  met: <CheckCircle2 className="text-good size-3.5" />,
  partial: <MinusCircle className="text-viz-compute size-3.5" />,
  risk: <AlertTriangle className="text-bad size-3.5" />,
  open: <CircleDashed className="text-subtle size-3.5" />,
};

const VERDICT = {
  strong: "border-good/40 bg-good/10",
  workable: "border-viz-compute/40 bg-viz-compute/10",
  risky: "border-bad/40 bg-bad/10",
};

export function Checklist({ choices }: { choices: Record<string, string> }) {
  const status = requirementStatus(choices);
  return (
    <div className="border-line bg-surface grid gap-1 rounded-xl border p-3">
      <p className="text-muted mb-1 text-[10px] tracking-wide uppercase">
        The brief&apos;s requirements
      </p>
      {REQUIREMENTS.map((r) => (
        <p key={r.id} className="flex items-center gap-2 text-xs">
          {STATUS_ICON[status[r.id]]}
          <span className={status[r.id] === "open" ? "text-muted" : undefined}>{r.label}</span>
        </p>
      ))}
    </div>
  );
}

/* 2 ─ Make the decisions ⭐ ----------------------------------------------------------------------- */

export function Decisions() {
  const [s, set] = useSceneState<DesignState>();
  const d = DECISIONS[s.current];
  const chosen = d.options.find((o) => o.id === s.choices[d.id]);
  return (
    <StepLayout
      eyebrow="Branching scenario"
      title="Make the decisions"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap gap-1">
            {DECISIONS.map((x, i) => {
              const o = x.options.find((y) => y.id === s.choices[x.id]);
              return (
                <button
                  key={x.id}
                  type="button"
                  onClick={() => set({ current: i })}
                  className={cn(
                    "rounded-full border px-2.5 py-0.5 text-[11px] transition",
                    i === s.current
                      ? "border-accent bg-accent text-accent-fg"
                      : o
                        ? "border-line bg-surface-2"
                        : "border-line text-muted",
                  )}
                >
                  {i + 1}. {x.title}
                </button>
              );
            })}
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="flex flex-col gap-3">
              <p className="font-semibold">{d.question}</p>
              <div className="grid gap-2">
                {d.options.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={chosen?.id === o.id}
                    onClick={() => set({ choices: { ...s.choices, [d.id]: o.id } })}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-left text-sm transition",
                      chosen?.id === o.id
                        ? "border-accent ring-accent/30 ring-2"
                        : "border-line hover:bg-surface-2",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                {chosen && (
                  <motion.div
                    key={chosen.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn("rounded-xl border px-4 py-3 text-sm", VERDICT[chosen.verdict])}
                  >
                    <p className="font-semibold capitalize">{chosen.verdict}</p>
                    <p className="text-muted mt-1">{chosen.consequence}</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Stepper
                step={s.current}
                count={DECISIONS.length}
                onChange={(n) => set({ current: n })}
                label={`Decision ${s.current + 1} of ${DECISIONS.length}`}
              />
            </div>
            <Checklist choices={s.choices} />
          </div>
        </div>
      }
    >
      <p>
        Seven decisions, each drawing on a chapter of this track. Every option is something real
        teams do; each has consequences. Choose, read what happens, and watch the brief&apos;s
        checklist.
      </p>
      <p className="text-muted text-sm">
        Change your mind as often as you like. Some decisions have several good answers: the point
        is knowing <em>why</em>.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: the layout ---------------------------------------------------------------------- */

export function LayoutCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Defend the layout"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="capstone-layout"
            prompt="A board member asks: 'Branch managers look up single accounts all day. Why not partition the transactions table by account?' What's your answer?"
            options={[
              {
                id: "cardinality",
                label:
                  "Hundreds of thousands of accounts would mean hundreds of thousands of tiny partitions; day partitions plus clustering by account give fast lookups without that",
                correct: true,
                feedback:
                  "Right. Clustering lets min/max statistics skip files for one account, while partitions stay few and large.",
              },
              {
                id: "cant",
                label: "Tables can't be partitioned by a numeric column",
                feedback: "They can. The problem is how many distinct values it has.",
              },
              {
                id: "security",
                label: "Partitioning by account would expose account numbers in folder names",
                feedback: "A fair side concern with Hive-style paths, but not the main reason.",
              },
              {
                id: "slower",
                label: "Partitioning always makes queries slower",
                feedback:
                  "Good partitioning speeds queries up a lot; the wrong column is what hurts.",
              },
            ]}
            explanation="Partition on a low-cardinality column that most queries filter on (usually a date); cluster or sort on the high-cardinality ones."
          />
        </div>
      }
    >
      <p>From the partitioning and file-layout modules.</p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: the auditor --------------------------------------------------------------------- */

export function AuditorCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The auditor returns"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="capstone-auditor"
            prompt="Eighteen months after a filing, an auditor wants the exact rows it was based on. Your design tagged that snapshot. What else must be true for time travel to work?"
            options={[
              {
                id: "retention",
                label:
                  "Snapshot expiry and file clean-up must keep tagged snapshots and the files they point to",
                correct: true,
                feedback:
                  "Right. Time travel needs the old data files. Expiry and vacuum settings must protect tagged snapshots, or the tag points at files that no longer exist.",
              },
              {
                id: "format",
                label: "The table must be in Delta Lake",
                feedback:
                  "Iceberg tags, Delta versions and Hudi savepoints all support this in their own way.",
              },
              {
                id: "catalog",
                label: "The catalog must be backed up nightly",
                feedback: "Useful in general, but the snapshot's data files are what matter here.",
              },
              {
                id: "nothing",
                label: "Nothing: time travel works forever by default",
                feedback:
                  "Maintenance jobs deliberately delete old snapshots and unreferenced files. That's why tags and retention exist.",
              },
            ]}
            explanation="Reproducibility and maintenance pull in opposite directions. Decide explicitly what's kept, for how long, and how that squares with erasure requests."
          />
        </div>
      }
    >
      <p>From the time travel and table maintenance modules.</p>
    </StepLayout>
  );
}

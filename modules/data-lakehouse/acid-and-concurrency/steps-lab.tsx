"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { judge, OPS, opById, PARTITIONS, type Level, type Op } from "./data";
import type { AcidState } from "./state";

/* 3 ─ Conflict lab ⭐ --------------------------------------------------------------- */

const FRAME_TITLES = [
  "1. Both start from v10",
  "2. Both write their new files",
  "3. A commits first: v11",
  "4. B tries v11, and is refused",
  "5. B checks what v11 changed",
  "6. The verdict",
];

export function ConflictLab() {
  const [s, set] = useSceneState<AcidState>();
  const a = opById[s.opA] ?? OPS[0];
  const b = opById[s.opB] ?? OPS[0];
  const step = Math.min(s.labStep, FRAME_TITLES.length - 1);
  const v = judge(a, b, s.level);
  const checking = step >= 4;

  const caption: Record<number, React.ReactNode> = {
    0: "Neither writer takes a lock. Each reads the table as of version 10 and works on its own.",
    1: "New Parquet files have unique names, so the writers can never overwrite each other's data files.",
    2: "A wins the race: its commit for version 11 is accepted atomically.",
    3: "Only one writer can create version 11. B's attempt is rejected. Nothing of A's is harmed.",
    4: (
      <>
        B doesn&apos;t give up yet. It compares what A&apos;s commit changed (highlighted) with what
        B read and depends on (outlined).
      </>
    ),
    5: (
      <>
        {v.why}
        {v.exception && <span className="mt-1 block font-mono text-xs">{v.exception}</span>}
      </>
    ),
  };

  return (
    <StepLayout
      eyebrow="Simulation"
      title="The conflict lab"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <OpPicker
              label="Writer A (commits first)"
              value={a.id}
              onChange={(id) => set({ opA: id, labStep: 0 })}
              tone="compute"
            />
            <OpPicker
              label="Writer B (commits second)"
              value={b.id}
              onChange={(id) => set({ opB: id, labStep: 0 })}
              tone="meta"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Isolation level</span>
            <Segmented
              size="sm"
              value={s.level}
              options={[
                ["serializable", "Serializable"],
                ["writeserializable", "WriteSerializable"],
              ]}
              onChange={(l) => set({ level: l as Level, labStep: 0 })}
            />
          </div>

          <div className="border-line bg-bg/40 grid gap-3 rounded-2xl border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <Lane name="A" op={a} step={step} tone="compute" committed={step >= 2} />
            <Lane
              name="B"
              op={b}
              step={step}
              tone="meta"
              committed={step >= 5 && v.ok}
              failed={step >= 5 && !v.ok}
            />
            <div className="sm:col-span-2">
              <p className="text-muted mb-1.5 text-[11px]">orders, partitioned by date</p>
              <div className="grid grid-cols-3 gap-2">
                {PARTITIONS.map((p) => {
                  const changedByA = step >= 2 && (a.adds.includes(p) || a.removes.includes(p));
                  const readByB = b.reads.includes(p);
                  const overlap = step >= 5 && v.overlap.includes(p);
                  return (
                    <motion.div
                      key={p}
                      animate={{ scale: overlap ? 1.04 : 1 }}
                      className={cn(
                        "rounded-lg border-2 px-2 py-2 text-center font-mono text-[11px] transition-colors",
                        overlap
                          ? "border-bad bg-bad/15"
                          : checking && readByB
                            ? "border-viz-meta border-dashed"
                            : "border-line",
                        changedByA && !overlap && "bg-viz-compute/20",
                      )}
                    >
                      date={p}
                      <span className="text-muted block text-[9px]">
                        {[changedByA && "changed by A", checking && readByB && "read by B"]
                          .filter(Boolean)
                          .join(" · ") || " "}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
              {a.metadata && step >= 2 && (
                <p className="text-viz-compute mt-2 text-[11px]">
                  A changed the schema (metadata).
                </p>
              )}
            </div>
          </div>

          <Stepper step={step} count={FRAME_TITLES.length} onChange={(n) => set({ labStep: n })} />
          <FrameCaption
            frameKey={`${a.id}-${b.id}-${s.level}-${step}`}
            title={
              step === 5 ? (v.ok ? "B retries as v12 and succeeds" : "B fails") : FRAME_TITLES[step]
            }
            tone={step === 5 ? (v.ok ? "good" : "bad") : undefined}
          >
            {caption[step]}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Two jobs write to the same Delta table at once. Pick what each one does, then step through
        what happens when they race to commit.
      </p>
      <p>
        This is <Term id="optimistic-concurrency">optimistic concurrency</Term>: work first, check
        at the end. The loser of the race isn&apos;t automatically a failure. It only fails if the
        winner changed something it depended on.
      </p>
      <p>
        Try: two updates on different dates; an INSERT with an UPDATE of today under each{" "}
        <Term id="isolation">isolation</Term> level; OPTIMIZE with anything.
      </p>
      <p className="text-subtle text-xs">
        Rules shown are Delta Lake&apos;s, for a table partitioned by date without deletion vectors.
        Open-source Delta always uses Serializable; WriteSerializable is the default on Databricks.
        Iceberg and Hudi validate in similar ways.
      </p>
    </StepLayout>
  );
}

function OpPicker({
  label,
  value,
  onChange,
  tone,
}: {
  label: string;
  value: string;
  onChange(id: string): void;
  tone: "compute" | "meta";
}) {
  return (
    <div>
      <p
        className={cn(
          "mb-1.5 text-xs font-medium",
          tone === "compute" ? "text-viz-compute" : "text-viz-meta",
        )}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-1">
        {OPS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] transition-colors",
              o.id === value
                ? tone === "compute"
                  ? "bg-viz-compute text-bg"
                  : "bg-viz-meta text-bg"
                : "bg-surface-2 text-muted hover:text-fg",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Lane({
  name,
  op,
  step,
  tone,
  committed,
  failed,
}: {
  name: string;
  op: Op;
  step: number;
  tone: "compute" | "meta";
  committed?: boolean;
  failed?: boolean;
}) {
  const status =
    name === "A"
      ? ["reads v10", "writes files", "commits v11 ✓", "committed", "committed", "committed"][step]
      : [
          "reads v10",
          "writes files",
          "waiting…",
          "v11 refused",
          "checking v11…",
          committed ? "commits v12 ✓" : "fails ✗",
        ][step];
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2 transition-colors",
        failed
          ? "border-bad/50 bg-bad/10"
          : committed
            ? "border-good/50 bg-good/10"
            : tone === "compute"
              ? "border-viz-compute/40"
              : "border-viz-meta/40",
      )}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p
          className={cn(
            "text-sm font-semibold",
            tone === "compute" ? "text-viz-compute" : "text-viz-meta",
          )}
        >
          Writer {name}
        </p>
        <span className="font-mono text-[11px]">{status}</span>
      </div>
      <Code className="mt-1.5 text-[10px] whitespace-pre-wrap">{op.sql}</Code>
    </div>
  );
}

/* 4 ─ Checkpoint ------------------------------------------------------------------ */

export function LabCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Predict the race"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="predict-race"
            prompt="Open-source Delta. Job B runs UPDATE … WHERE date = today. While it works, job A appends today's new orders and commits first. What happens when B tries to commit?"
            options={[
              {
                id: "both",
                label: "B retries as the next version and both succeed",
                feedback:
                  "That's what happens under WriteSerializable on Databricks. Open-source Delta always uses Serializable.",
              },
              {
                id: "b-fails",
                label: "B fails: A added files to the partition B read",
                correct: true,
                feedback:
                  "Right. Under Serializable, B's UPDATE never saw A's new rows, so it fails with ConcurrentAppendException and must re-run.",
              },
              {
                id: "a-fails",
                label: "A's append is undone because B's update started first",
                feedback:
                  "Committed versions are never undone. A won the race; only B can be affected.",
              },
              {
                id: "corrupt",
                label: "Both commit as version 11 and the table is corrupted",
                feedback:
                  "The atomic commit makes that impossible: only one writer can create each version.",
              },
            ]}
            explanation="Notice who fails: the operation that read data, never the blind append. So retry logic belongs on the UPDATE, DELETE or MERGE."
          />
        </div>
      }
    >
      <p>Use what you saw in the lab, and remember which isolation level open-source Delta uses.</p>
    </StepLayout>
  );
}

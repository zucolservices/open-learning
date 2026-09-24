"use client";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, StepForward } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { cn } from "@/lib/cn";
import type { StorageState } from "./state";
import { Term } from "@/toolkit/glossary/term";

/* 6 ─ Two writers, one key ------------------------------------------------ */

const KEY = "_delta_log/…00007.json";

interface RaceFrame {
  text: string;
  a?: string;
  b?: string;
  holder?: "A" | "B";
  extra?: string;
  tone?: "good" | "bad";
}

function raceFrames(conditional: boolean): RaceFrame[] {
  const header = conditional ? " If-None-Match: *" : "";
  return [
    { text: "Both writers read version 6 and prepare version 7. Each will write the same key." },
    {
      text: "Writer A writes first. The key doesn't exist yet, so this succeeds.",
      a: `PUT ${KEY}${header} → 200 OK`,
      holder: "A",
    },
    conditional
      ? {
          text: "Writer B tries the same key with put-if-absent. It already exists, so S3 rejects the write. Nothing is overwritten.",
          a: `PUT ${KEY}${header} → 200 OK`,
          b: `PUT ${KEY}${header} → 412 Precondition Failed`,
          holder: "A",
        }
      : {
          text: "Writer B writes the same key. A plain PUT always succeeds: last writer wins.",
          a: `PUT ${KEY} → 200 OK`,
          b: `PUT ${KEY} → 200 OK`,
          holder: "B",
        },
    conditional
      ? {
          text: "B re-reads the log, checks A's changes for conflicts, and retries as version 8. Both commits survive.",
          a: `PUT ${KEY}${header} → 200 OK`,
          b: "PUT …00008.json If-None-Match: * → 200 OK",
          holder: "A",
          extra: "…00008.json holds B's commit",
          tone: "good",
        }
      : {
          text: "A's commit is gone. A got 200 OK and believes it committed. B silently overwrote it. Nobody gets an error: this is a lost update.",
          a: `PUT ${KEY} → 200 OK (lost!)`,
          b: `PUT ${KEY} → 200 OK`,
          holder: "B",
          tone: "bad",
        },
  ];
}

export function TwoWriters() {
  const [s, set] = useSceneState<StorageState>();
  const conditional = s.putMode === "conditional";
  const frames = raceFrames(conditional);
  const step = Math.min(s.raceStep, frames.length - 1);
  const f = frames[step];

  return (
    <StepLayout
      eyebrow="Two writers, one key"
      title="Who wins when two writers create the same object?"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              size="sm"
              value={s.putMode}
              options={[
                ["plain", "Plain PUT"],
                ["conditional", "Put-if-absent"],
              ]}
              onChange={(putMode) => set({ putMode, raceStep: 0 })}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set({ raceStep: 0 })}
                className="border-line-strong inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs"
              >
                <RotateCcw className="size-3.5" /> Restart
              </button>
              <button
                type="button"
                disabled={step === frames.length - 1}
                onClick={() => set({ raceStep: step + 1 })}
                className="bg-accent text-accent-fg inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium disabled:opacity-40"
              >
                <StepForward className="size-3.5" /> Next
              </button>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
            <Writer name="Writer A" line={f.a} lost={f.tone === "bad"} />
            <div className="grid justify-items-center gap-2">
              <p className="text-muted font-mono text-[10px]">{KEY}</p>
              <motion.div
                key={f.holder ?? "empty"}
                initial={{ scale: 1.25, rotate: f.holder === "B" && !conditional ? -6 : 0 }}
                animate={{ scale: 1, rotate: 0 }}
                className={cn(
                  "grid h-20 w-24 place-items-center rounded-xl border font-mono text-sm font-semibold",
                  f.holder === "A"
                    ? "border-viz-meta bg-viz-meta/15"
                    : f.holder === "B"
                      ? "border-viz-compute bg-viz-compute/15"
                      : "border-line-strong text-subtle border-dashed",
                )}
              >
                {f.holder ? `${f.holder}'s commit` : "empty"}
              </motion.div>
              {f.extra && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-viz-add font-mono text-[10px]"
                >
                  + {f.extra}
                </motion.p>
              )}
            </div>
            <Writer name="Writer B" line={f.b} rejected={f.b?.includes("412")} />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.putMode}-${step}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                f.tone === "good"
                  ? "border-good/40 bg-good/10"
                  : f.tone === "bad"
                    ? "border-bad/40 bg-bad/10"
                    : "border-line bg-surface",
              )}
            >
              {f.text}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        In the Delta Lake module, a commit meant <em>creating the next log file</em>, and only one
        writer could win. That needs one thing from storage:{" "}
        <Term id="put-if-absent">
          <strong>create this key only if it doesn&apos;t exist</strong>
        </Term>
        .
      </p>
      <p>Step through both modes. Which one would you trust with your table?</p>
      <p className="text-subtle text-xs">
        S3 added put-if-absent (<code>If-None-Match: *</code>) in August 2024 and compare-and-swap (
        <code>If-Match</code>) in November 2024. Before that, multi-writer setups on S3 relied on an
        outside coordinator, such as a DynamoDB table or a catalog. GCS (
        <code>ifGenerationMatch=0</code>) and Azure (<code>If-None-Match: *</code>) have long
        supported it.
      </p>
    </StepLayout>
  );
}

function Writer({
  name,
  line,
  lost,
  rejected,
}: {
  name: string;
  line?: string;
  lost?: boolean;
  rejected?: boolean;
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-3">
      <p className="text-viz-compute text-xs font-semibold">{name}</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={line ?? "waiting"}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "mt-2 rounded-md px-2 py-1.5 font-mono text-[10px] leading-relaxed break-all",
            rejected
              ? "bg-bad/15 text-bad"
              : lost
                ? "bg-bad/10 text-bad line-through"
                : line
                  ? "bg-surface-2 text-fg"
                  : "text-subtle",
          )}
        >
          {line ?? "preparing commit v7…"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* 7 ─ Checkpoint ------------------------------------------------------------ */

export function CommitCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Connect the dots"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="commit-one-file"
            prompt="Why do lakehouse table formats commit by creating one small new metadata file, instead of renaming a folder of data files?"
            options={[
              {
                id: "atomic",
                label:
                  "Creating a single object is atomic, and put-if-absent lets exactly one writer win",
                correct: true,
                feedback:
                  "Right. Data files are written first and stay invisible. One atomic object creation then makes them all visible at once.",
              },
              {
                id: "cheap",
                label: "Small files are cheaper to store than large ones",
                feedback: "Storage is priced per GB. Size isn't the reason. Atomicity is.",
              },
              {
                id: "slow",
                label: "Renames on S3 are atomic, just slow",
                feedback:
                  "They're not atomic at all: a prefix rename is many separate copies and deletes that can stop halfway.",
              },
              {
                id: "parquet",
                label: "Parquet files can't be renamed",
                feedback:
                  "Any object can be copied to a new key. The problem is doing it for many objects atomically.",
              },
            ]}
            explanation="Delta's _delta_log and Hudi's timeline build transactions on atomic object creation. Iceberg usually swaps a metadata pointer atomically in its catalog. Either way, a commit is one small atomic step, never a rename of data."
          />
        </div>
      }
    />
  );
}

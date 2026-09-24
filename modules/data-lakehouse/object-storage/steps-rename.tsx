"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Plug, RotateCcw, Scissors } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { cn } from "@/lib/cn";
import { Term } from "@/toolkit/glossary/term";
import { LIST_PAGE, formatBytes } from "./data";
import type { StorageState } from "./state";

/* 3 ─ Rename a folder ⭐ --------------------------------------------------- */

const SIZES = [48, 10_000, 250_000];
const TILES = 48;
const OBJECT_BYTES = 128_000_000;
const FROM = "sales/2026-09/";
const TO = "archive/2026-09/";

type Phase = "idle" | "running" | "crashed" | "done";

export function RenameFolder() {
  const [s, set] = useSceneState<StorageState>();
  const n = SIZES[s.renameSize];
  const hns = s.renameMode === "hns";
  const [phase, setPhase] = useState<Phase>("idle");
  const [copied, setCopied] = useState(0);

  const deleted = hns ? copied : Math.max(0, Math.min(n, copied - n * 0.12));

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setCopied((c) => {
        const next = Math.min(n * 1.12, c + n / 36);
        if (next >= n * 1.12) setPhase("done");
        return next;
      });
    }, 110);
    return () => clearInterval(id);
  }, [phase, n]);

  function reset(patch?: Partial<StorageState>) {
    setPhase("idle");
    setCopied(0);
    if (patch) set(patch);
  }

  function start() {
    if (hns) {
      setCopied(n);
      setPhase("done");
    } else {
      setCopied(0);
      setPhase("running");
    }
  }

  const copiedObjects = Math.min(n, Math.floor(copied));
  const deletedObjects = Math.floor(deleted);
  const per = n / TILES;
  const isCopied = (i: number) => copiedObjects >= Math.ceil((i + 1) * per);
  const isDeleted = (i: number) => deletedObjects >= Math.ceil((i + 1) * per);
  const lists = Math.ceil(n / LIST_PAGE);
  const requests = hns
    ? phase === "done"
      ? 1
      : 0
    : lists * (phase === "idle" ? 0 : 1) + copiedObjects + deletedObjects;

  return (
    <StepLayout
      eyebrow="The big one"
      title="Rename a folder"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented
              size="sm"
              value={s.renameMode}
              options={[
                ["s3", "S3 (flat keys)"],
                ["hns", "Real directories (HDFS, ADLS, GCS HNS)"],
              ]}
              onChange={(renameMode) => reset({ renameMode })}
            />
            <Segmented
              size="sm"
              value={String(s.renameSize)}
              options={SIZES.map(
                (v, i) => [String(i), `${v.toLocaleString("en-IN")} objects`] as [string, string],
              )}
              onChange={(v) => reset({ renameSize: Number(v) })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {phase === "idle" && (
              <button
                type="button"
                onClick={start}
                className="bg-accent text-accent-fg inline-flex h-9 items-center gap-2 rounded-full px-4 font-mono text-xs font-medium"
              >
                <Scissors className="size-3.5" /> mv {FROM} → {TO}
              </button>
            )}
            {phase === "running" && (
              <button
                type="button"
                onClick={() => setPhase("crashed")}
                className="bg-bad text-bg inline-flex h-9 animate-pulse items-center gap-2 rounded-full px-4 text-xs font-semibold"
              >
                <Plug className="size-3.5" /> Pull the plug!
              </button>
            )}
            {(phase === "done" || phase === "crashed") && (
              <button
                type="button"
                onClick={() => reset()}
                className="border-line-strong inline-flex h-9 items-center gap-2 rounded-full border px-4 text-xs"
              >
                <RotateCcw className="size-3.5" /> Reset
              </button>
            )}
            {!hns && phase === "idle" && (
              <span className="text-muted text-xs">Then try pulling the plug halfway through.</span>
            )}
          </div>

          <LayoutGroup>
            <div className="grid gap-3 sm:grid-cols-2">
              {[FROM, TO].map((prefix, side) => (
                <div key={prefix} className="border-line bg-bg/40 rounded-2xl border p-3">
                  <p className="text-viz-compute mb-2 font-mono text-xs">{prefix}</p>
                  <div className="grid grid-cols-8 gap-1">
                    {Array.from({ length: TILES }, (_, i) => {
                      if (hns) {
                        const moved = phase === "done";
                        const here = side === 0 ? !moved : moved;
                        return here ? (
                          <motion.div
                            key={i}
                            layoutId={`t-${i}`}
                            transition={{
                              type: "spring",
                              stiffness: 160,
                              damping: 22,
                              delay: i * 0.004,
                            }}
                            className="bg-viz-data/60 aspect-square rounded-[3px]"
                          />
                        ) : (
                          <div
                            key={i}
                            className="border-line aspect-square rounded-[3px] border border-dashed"
                          />
                        );
                      }
                      const present = side === 0 ? !isDeleted(i) : isCopied(i);
                      return (
                        <div
                          key={i}
                          className="border-line relative aspect-square rounded-[3px] border border-dashed"
                        >
                          <AnimatePresence>
                            {present && (
                              <motion.div
                                initial={{
                                  scale: side === 1 ? 0.3 : 1,
                                  opacity: side === 1 ? 0 : 1,
                                }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{
                                  scale: 0.3,
                                  opacity: 0,
                                  backgroundColor: "var(--viz-remove)",
                                }}
                                transition={{ duration: 0.25 }}
                                className={cn(
                                  "absolute inset-0 rounded-[3px]",
                                  side === 1
                                    ? "bg-viz-add/60"
                                    : phase === "crashed" && isCopied(i)
                                      ? "bg-viz-compute/70"
                                      : "bg-viz-data/60",
                                )}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </LayoutGroup>
          {n > TILES && (
            <p className="text-subtle -mt-2 text-[11px]">
              Each square ≈ {Math.round(per).toLocaleString("en-IN")} objects of ~128 MB.
            </p>
          )}

          <div className="grid grid-cols-3 gap-3">
            <Stat
              label="Requests"
              value={requests.toLocaleString("en-IN")}
              tone={hns ? "good" : undefined}
            />
            <Stat
              label="Bytes copied"
              value={formatBytes(hns ? 0 : copiedObjects * OBJECT_BYTES)}
              tone={hns ? "good" : undefined}
            />
            <Stat label="Operation" value={hns ? "1 metadata op" : "COPY + DELETE each"} small />
          </div>

          <AnimatePresence mode="wait">
            {phase === "crashed" && (
              <motion.div
                key="crash"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-bad/40 bg-bad/10 rounded-xl border p-4 text-sm"
              >
                <p className="text-bad font-semibold">The job died mid-rename.</p>
                <p className="text-muted mt-1">
                  A dashboard reading <code className="text-fg">{TO}</code> now sees{" "}
                  <strong className="text-fg">{copiedObjects.toLocaleString("en-IN")}</strong> of{" "}
                  {n.toLocaleString("en-IN")} objects. And{" "}
                  <strong className="text-fg">
                    {(copiedObjects - deletedObjects).toLocaleString("en-IN")}
                  </strong>{" "}
                  objects (amber) now exist in <em>both</em> places. Nothing rolls this back.
                </p>
              </motion.div>
            )}
            {phase === "done" && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-xl border p-4 text-sm",
                  hns ? "border-good/40 bg-good/10" : "border-line bg-surface",
                )}
              >
                {hns ? (
                  <p>
                    <strong className="text-good">One atomic metadata operation.</strong>{" "}
                    <span className="text-muted">
                      No data moved. Readers see the directory either before or after, never half.
                    </span>
                  </p>
                ) : (
                  <p className="text-muted">
                    <strong className="text-fg">Finished, eventually:</strong>{" "}
                    {n.toLocaleString("en-IN")} copies + {n.toLocaleString("en-IN")} deletes +{" "}
                    {lists.toLocaleString("en-IN")} list pages, and every byte copied. Throughout,
                    readers could see a half-moved folder.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        On a laptop, renaming a folder is instant. Brewline wants to move September&apos;s sales to
        an archive prefix. Let&apos;s do it on S3.
      </p>
      <p>
        S3 has no directories to rename, so a tool has to <strong>copy every object</strong> to a
        new key and <strong>delete the old one</strong>, one by one.
      </p>
      <p>
        Pull the plug halfway. Then switch to <strong>real directories</strong> (HDFS, or a
        hierarchical namespace in Azure Data Lake Storage or Google Cloud Storage) and compare.
      </p>
    </StepLayout>
  );
}

function Stat({
  label,
  value,
  tone,
  small,
}: {
  label: string;
  value: string;
  tone?: "good";
  small?: boolean;
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-3">
      <p className="text-muted text-[11px]">{label}</p>
      <p
        className={cn(
          "mt-0.5 font-semibold tabular-nums",
          small ? "text-sm" : "text-xl",
          tone === "good" && "text-good",
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* 4 ─ Predict ------------------------------------------------------------- */

export function PredictBytes() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How much data does a rename move?"
      stage={
        <div className="flex flex-1 items-center">
          <PredictCheckpoint
            id="rename-bytes"
            prompt="You rename a 2 TB prefix in a general-purpose S3 bucket. What share of those 2 TB gets copied?"
            min={0}
            max={100}
            step={5}
            unit="%"
            answer={100}
            tolerance={5}
            explanation={
              <>
                All of it. Every object is copied to its new key (server-side, but still a full
                copy) and the original deleted. A &ldquo;rename&rdquo; of 2 TB is a 2 TB copy job,
                which is why lakehouse designs avoid renames entirely.
              </>
            }
          />
        </div>
      }
    >
      <p>Commit to a guess. Is a rename just metadata, or real data movement?</p>
    </StepLayout>
  );
}

/* 5 ─ Why tables care ------------------------------------------------------ */

interface Lane {
  title: string;
  temp: number;
  final: number;
  log?: "none" | "pending" | "written";
  reader: string;
  tone?: "good" | "bad";
}

const FILES = 6;

const FRAMES: { text: string; lanes: [Lane, Lane] }[] = [
  {
    text: "A job writes 6 new files into a temporary directory. Readers only look in orders/, so they don't see them yet.",
    lanes: [
      { title: "HDFS (atomic rename)", temp: 6, final: 0, reader: "old data ✓" },
      { title: "S3 (copy + delete)", temp: 6, final: 0, reader: "old data ✓" },
    ],
  },
  {
    text: "To commit, the job renames the temporary directory into place.",
    lanes: [
      {
        title: "HDFS (atomic rename)",
        temp: 0,
        final: 6,
        reader: "all 6 new files ✓",
        tone: "good",
      },
      {
        title: "S3 (copy + delete)",
        temp: 4,
        final: 3,
        reader: "3 of 6 files ✗ partial",
        tone: "bad",
      },
    ],
  },
  {
    text: "The job crashes at this exact moment.",
    lanes: [
      {
        title: "HDFS (atomic rename)",
        temp: 0,
        final: 6,
        reader: "before or after, never between ✓",
        tone: "good",
      },
      {
        title: "S3 (copy + delete)",
        temp: 4,
        final: 3,
        reader: "stuck at 3 of 6, plus leftovers ✗",
        tone: "bad",
      },
    ],
  },
  {
    text: "The fix used by table formats: write data files straight to their final place (readers ignore files the log doesn't list), then commit by creating ONE small log file atomically.",
    lanes: [
      {
        title: "HDFS (atomic rename)",
        temp: 0,
        final: 6,
        reader: "works, but only on HDFS",
        tone: "good",
      },
      {
        title: "S3 + table format",
        temp: 0,
        final: 6,
        log: "pending",
        reader: "log not written: old data ✓",
      },
    ],
  },
  {
    text: "Creating one object is atomic: it either exists or it doesn't. The instant the log file lands, readers see all 6 files together.",
    lanes: [
      {
        title: "HDFS (atomic rename)",
        temp: 0,
        final: 6,
        reader: "works, but only on HDFS",
        tone: "good",
      },
      {
        title: "S3 + table format",
        temp: 0,
        final: 6,
        log: "written",
        reader: "all 6 files, atomically ✓",
        tone: "good",
      },
    ],
  },
];

export function WhyTablesCare() {
  const [s, set] = useSceneState<StorageState>();
  const step = Math.min(s.commitStep, FRAMES.length - 1);
  const f = FRAMES[step];

  return (
    <StepLayout
      eyebrow="Why this matters"
      title="Why rename broke the old way of committing"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-end gap-1">
            <NavButton
              label="Previous"
              onClick={() => set({ commitStep: Math.max(0, step - 1) })}
              disabled={step === 0}
            >
              <ChevronLeft className="size-4" />
            </NavButton>
            <span className="text-muted w-12 text-center font-mono text-xs tabular-nums">
              {step + 1}/{FRAMES.length}
            </span>
            <NavButton
              label="Next"
              primary
              onClick={() => set({ commitStep: Math.min(FRAMES.length - 1, step + 1) })}
              disabled={step === FRAMES.length - 1}
            >
              <ChevronRight className="size-4" />
            </NavButton>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {f.lanes.map((lane, li) => (
              <div key={li} className="border-line bg-bg/40 rounded-2xl border p-3">
                <p className="text-sm font-semibold">{lane.title}</p>
                <Dir name="_temporary/" count={lane.temp} cls="bg-viz-idle/50" />
                <Dir
                  name="orders/"
                  count={lane.final}
                  cls="bg-viz-data/60"
                  dim={lane.log === "pending"}
                />
                {lane.log && lane.log !== "none" && (
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-muted">_delta_log/00007.json</span>
                    <motion.span
                      key={lane.log}
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={cn(
                        "rounded px-1.5 py-0.5",
                        lane.log === "written"
                          ? "bg-viz-meta text-bg"
                          : "border-line-strong text-subtle border border-dashed",
                      )}
                    >
                      {lane.log === "written" ? "written" : "not yet"}
                    </motion.span>
                  </div>
                )}
                <motion.p
                  key={`${step}-${li}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "mt-3 rounded-lg px-2.5 py-1.5 text-xs",
                    lane.tone === "good"
                      ? "bg-good/10 text-good"
                      : lane.tone === "bad"
                        ? "bg-bad/10 text-bad"
                        : "bg-surface-2 text-muted",
                  )}
                >
                  A reader of orders/ sees: {lane.reader}
                </motion.p>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {f.text}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Classic Hadoop and Hive jobs committed their output by <strong>renaming</strong> a temporary
        directory into place. On HDFS that was one <Term id="atomic">atomic</Term> step.
      </p>
      <p>
        Move the same job to S3 and the commit becomes a slow copy that readers can catch halfway.
        Step through it.
      </p>
      <p className="text-subtle text-xs">
        Hadoop added special S3 committers to work around this. Table formats solved it at the root,
        as the last two frames show.
      </p>
    </StepLayout>
  );
}

function Dir({
  name,
  count,
  cls,
  dim,
}: {
  name: string;
  count: number;
  cls: string;
  dim?: boolean;
}) {
  return (
    <div className="mt-2">
      <p className="text-viz-compute font-mono text-[11px]">{name}</p>
      <div className="mt-1 flex h-6 gap-1">
        {Array.from({ length: FILES }, (_, i) => (
          <div key={i} className="border-line relative w-5 rounded-[3px] border border-dashed">
            <AnimatePresence>
              {i < count && (
                <motion.div
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: dim ? 0.35 : 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className={cn("absolute inset-0 rounded-[3px]", cls)}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NavButton({
  children,
  label,
  onClick,
  disabled,
  primary,
}: {
  children: React.ReactNode;
  label: string;
  onClick(): void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "grid size-8 place-items-center rounded-full transition disabled:opacity-30",
        primary ? "bg-accent text-accent-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

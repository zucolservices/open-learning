"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import type { DeltaState } from "./state";
import { Term } from "@/toolkit/glossary/term";

/* 8 ─ Checkpoints ------------------------------------------------------ */

const INTERVAL = 10;

function readCost(commits: number, checkpoints: boolean) {
  const head = commits - 1;
  const cp = checkpoints && head >= INTERVAL ? Math.floor(head / INTERVAL) * INTERVAL : undefined;
  const json = cp === undefined ? commits : head - cp;
  return { cp, json, total: cp === undefined ? json : json + 2 };
}

export function Checkpoints() {
  const [s, set] = useSceneState<DeltaState>();
  const n = s.commitCount;
  const { cp, json, total } = readCost(n, s.checkpoints);
  const naive = readCost(n, false).total;

  return (
    <StepLayout
      eyebrow="Scale"
      title="Replaying 10,000 commits? Checkpoints."
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex flex-1 items-center gap-3 text-sm">
              <span className="text-muted whitespace-nowrap">Commits</span>
              <input
                type="range"
                min={1}
                max={120}
                value={n}
                onChange={(e) => set({ commitCount: Number(e.target.value) })}
                className="flex-1 accent-[var(--viz-meta)]"
                aria-label="Number of commits"
              />
              <span className="w-10 font-mono tabular-nums">{n}</span>
            </label>
            <Segmented
              size="sm"
              value={s.checkpoints ? "on" : "off"}
              options={[
                ["off", "No checkpoints"],
                ["on", "Checkpoints every 10"],
              ]}
              onChange={(v) => set({ checkpoints: v === "on" })}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: n }, (_, v) => {
              const isCp = s.checkpoints && v > 0 && v % INTERVAL === 0;
              const read = cp === undefined ? true : v > cp || v === cp;
              return (
                <motion.div
                  key={v}
                  layout
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  title={isCp ? `v${v}: JSON commit + checkpoint Parquet` : `v${v}: JSON commit`}
                  className={cn(
                    "grid h-9 place-items-center rounded-md font-mono text-[9px] transition-colors duration-300",
                    isCp ? "w-12" : "w-5",
                    isCp
                      ? v === cp
                        ? "bg-viz-data text-bg"
                        : "bg-viz-data/25 text-viz-data"
                      : read
                        ? "bg-viz-meta/80"
                        : "bg-viz-meta/15",
                  )}
                >
                  {isCp ? `cp${v}` : ""}
                </motion.div>
              );
            })}
          </div>

          <ul className="text-muted -mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="bg-viz-meta/80 size-3 rounded-sm" /> JSON commit the reader must
              replay
            </li>
            <li className="flex items-center gap-1.5">
              <span className="bg-viz-meta/15 size-3 rounded-sm" /> skipped, already in the
              checkpoint
            </li>
            <li className="flex items-center gap-1.5">
              <span className="bg-viz-data size-3 rounded-sm" /> checkpoint the reader starts from
            </li>
          </ul>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-2xl border p-4">
              <p className="text-muted text-xs">Files a reader opens to find the current table</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">{total}</p>
              <p className="text-muted mt-1 text-xs">
                {cp === undefined
                  ? `${json} JSON commit${json === 1 ? "" : "s"}, replayed from v0`
                  : `_last_checkpoint + checkpoint @ v${cp} + ${json} JSON commit${json === 1 ? "" : "s"}`}
              </p>
            </div>
            <div className="border-line bg-surface rounded-2xl border p-4">
              <p className="text-muted text-xs">Without checkpoints</p>
              <p className="text-subtle mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                {naive}
              </p>
              <div className="bg-surface-2 mt-3 h-2 overflow-hidden rounded-full">
                <motion.div
                  className="bg-viz-meta h-full rounded-full"
                  animate={{ width: `${(total / naive) * 100}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                />
              </div>
              <p className="text-muted mt-1 text-xs">
                {Math.round((total / naive) * 100)}% of the naive work
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Replaying every JSON file from v0 gets slow as a table collects thousands of commits. Each
        one is a separate request to object storage.
      </p>
      <p>
        So Delta periodically writes a{" "}
        <Term id="checkpoint">
          <strong>checkpoint</strong>
        </Term>
        : a Parquet file holding the entire table state at that version. A tiny{" "}
        <code>_last_checkpoint</code> file points to the newest one. Readers start there and replay
        only the few commits after it.
      </p>
      <p>
        Delta&apos;s Spark writer creates one every 10 commits by default (
        <code>delta.checkpointInterval</code>). Newer tables can use V2 checkpoints, which split a
        very large state across sidecar files.
      </p>
      <p className="text-subtle text-xs">
        Old JSON commits are cleaned up after <code>delta.logRetentionDuration</code> (30 days by
        default). That also limits how far back you can time travel.
      </p>
    </StepLayout>
  );
}

/* 9 ─ Two writers, one log --------------------------------------------- */

type Mode = "append" | "conflict";

const SCENARIO: Record<Mode, { a: string; b: string }> = {
  append: {
    a: "INSERT INTO orders VALUES (1007, …)",
    b: "INSERT INTO orders VALUES (1008, …)",
  },
  conflict: {
    a: "DELETE FROM orders WHERE status = 'open'",
    b: "UPDATE orders SET amount = 175 WHERE order_id = 1005",
  },
};

interface Frame {
  text: string;
  a: string;
  b: string;
  log: [boolean, boolean, "a" | "b" | null, "a" | "b" | null]; // v6, v7 owner, v8 owner
  tone?: "good" | "bad";
}

function frames(mode: Mode): Frame[] {
  const shared: Frame[] = [
    {
      text: "Both writers read the latest snapshot: version 6.",
      a: "read v6",
      b: "read v6",
      log: [true, false, null, null],
    },
    {
      text: "Both write their new Parquet files. File names are unique, so data files never collide.",
      a: "wrote part-…a1.parquet",
      b: "wrote part-…b7.parquet",
      log: [true, false, null, null],
    },
    {
      text: "A commits first: it creates …00007.json with put-if-absent. The commit is atomic. It either exists completely or not at all.",
      a: "✓ created 00007.json",
      b: "…",
      log: [true, true, "a", null],
    },
    {
      text: "B tries to create …00007.json as well. It already exists, so B's put is rejected. Nothing is ever overwritten.",
      a: "done",
      b: "✗ 00007.json taken",
      log: [true, true, "a", null],
    },
  ];
  if (mode === "append") {
    return [
      ...shared,
      {
        text: "B checks what v7 changed. A only added new files, none of which B read. No conflict.",
        a: "done",
        b: "check v7: no conflict",
        log: [true, true, "a", null],
      },
      {
        text: "B retries as …00008.json and succeeds. Both inserts are in the table. Concurrent appends don't conflict.",
        a: "done",
        b: "✓ created 00008.json",
        log: [true, true, "a", "b"],
        tone: "good",
      },
    ];
  }
  return [
    ...shared,
    {
      text: "B checks what v7 changed. A's DELETE removed the file holding order 1005, the very file B read and rewrote. Conflict.",
      a: "done",
      b: "check v7: CONFLICT",
      log: [true, true, "a", null],
    },
    {
      text: "B fails with a concurrent-modification error (here, ConcurrentDeleteReadException). The job must re-run against v7. The table is never left half-written.",
      a: "done",
      b: "✗ transaction failed",
      log: [true, true, "a", null],
      tone: "bad",
    },
  ];
}

export function Concurrency() {
  const [s, set] = useSceneState<DeltaState>();
  const all = frames(s.concMode);
  const step = Math.min(s.concStep, all.length - 1);
  const f = all[step];

  return (
    <StepLayout
      eyebrow="Two writers, one log"
      title="What happens when two jobs commit at once?"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              size="sm"
              value={s.concMode}
              options={[
                ["append", "Two inserts"],
                ["conflict", "Delete vs update"],
              ]}
              onChange={(v) => set({ concMode: v, concStep: 0 })}
            />
            <div className="flex items-center gap-1">
              <IconButton
                label="Previous"
                onClick={() => set({ concStep: Math.max(0, step - 1) })}
                disabled={step === 0}
              >
                <ChevronLeft className="size-4" />
              </IconButton>
              <span className="text-muted w-12 text-center font-mono text-xs tabular-nums">
                {step + 1}/{all.length}
              </span>
              <IconButton
                label="Next"
                onClick={() => set({ concStep: Math.min(all.length - 1, step + 1) })}
                disabled={step === all.length - 1}
                primary
              >
                <ChevronRight className="size-4" />
              </IconButton>
              <IconButton label="Restart" onClick={() => set({ concStep: 0 })}>
                <RotateCcw className="size-3.5" />
              </IconButton>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3 sm:gap-6">
            <Writer name="Writer A" sql={SCENARIO[s.concMode].a} status={f.a} />
            <div className="grid justify-items-center gap-2 pt-1">
              <p className="text-muted font-mono text-[10px]">_delta_log/</p>
              {[6, 7, 8].map((v, i) => {
                const owner = [null, f.log[2], f.log[3]][i];
                const exists = i === 0 ? true : i === 1 ? f.log[1] : owner !== null;
                return (
                  <motion.div
                    key={v}
                    animate={{ scale: exists && owner ? [1.15, 1] : 1 }}
                    className={cn(
                      "grid h-10 w-24 place-items-center rounded-lg border font-mono text-[11px] transition-colors duration-500",
                      exists
                        ? owner === "b"
                          ? "border-viz-add bg-viz-add/15"
                          : "border-viz-meta bg-viz-meta/15"
                        : "border-line-strong text-subtle border-dashed",
                    )}
                  >
                    {String(v).padStart(5, "0")}.json
                    {owner && (
                      <span className="text-muted text-[9px]">by {owner.toUpperCase()}</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <Writer name="Writer B" sql={SCENARIO[s.concMode].b} status={f.b} tone={f.tone} />
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.concMode}-${step}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
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
        There is no lock server. Delta uses{" "}
        <Term id="optimistic-concurrency">
          <strong>optimistic concurrency</strong>
        </Term>
        : writers work in parallel and only coordinate at the last moment, when creating the next
        log file.
      </p>
      <p>Step through both scenarios. Where do they diverge?</p>
      <p className="text-subtle text-xs">
        This relies on storage that supports &ldquo;create only if absent&rdquo;. On S3, Delta for
        Spark uses a DynamoDB-backed log store for safe writes from multiple clusters. delta-rs 1.0
        uses S3 conditional writes. Open-source Delta commits at Serializable isolation.
      </p>
    </StepLayout>
  );
}

function Writer({
  name,
  sql,
  status,
  tone,
}: {
  name: string;
  sql: string;
  status: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="border-line bg-surface rounded-2xl border p-3">
      <p className="text-viz-compute text-xs font-semibold">{name}</p>
      <p className="text-muted mt-1 font-mono text-[10px] leading-relaxed break-words">{sql}</p>
      <motion.p
        key={status}
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "mt-2 rounded-md px-2 py-1 font-mono text-[11px]",
          tone === "good"
            ? "bg-good/15 text-good"
            : tone === "bad"
              ? "bg-bad/15 text-bad"
              : status.startsWith("✗")
                ? "bg-bad/10 text-bad"
                : "bg-surface-2 text-fg",
        )}
      >
        {status}
      </motion.p>
    </div>
  );
}

function IconButton({
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

/* 10 ─ Checkpoint: order a write --------------------------------------- */

export function WriteOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Put a Delta write in order"
      stage={
        <div className="flex flex-1 items-center">
          <OrderCheckpoint
            id="write-order"
            prompt="Drag the steps of a Delta commit into the order they happen."
            items={[
              { id: "read", label: "Read the latest snapshot of the log" },
              { id: "data", label: "Write new Parquet data files" },
              { id: "put", label: "Try to create the next …NNN.json log file atomically" },
              {
                id: "retry",
                label: "If another writer got there first: check for conflicts, then retry or fail",
              },
              { id: "visible", label: "Readers now see the new version" },
            ]}
            explanation="Data files are written first, and the commit comes last. Until the log file exists, the new data files are invisible to readers, so a crash half-way leaves only orphaned files and never a corrupt table."
          />
        </div>
      }
    >
      <p>
        One more idea is hidden in this order: why is it safe for a writer to crash after writing
        its data files but before committing?
      </p>
    </StepLayout>
  );
}

"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { File, FileJson, Folder, TriangleAlert } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Segmented } from "@/toolkit/controls/segmented";
import { cn } from "@/lib/cn";
import {
  COMMITS,
  FILE_IDS,
  FILES,
  actionMeaning,
  commitActions,
  liveFiles,
  logName,
  rowsAt,
} from "./data";
import { ActionLine, FileTile, RowsTable, actionColor } from "./ui";
import type { DeltaState } from "./state";
import { Term } from "@/toolkit/glossary/term";

const CURRENT = COMMITS.length - 1;
const revenue = (v: number) => rowsAt(v).reduce((s, r) => s + r.amount, 0);

/* 1 ─ The incident ---------------------------------------------------- */

function Counter({ from, to }: { from: number; to: number }) {
  const mv = useMotionValue(from);
  const text = useTransform(mv, (v) => Math.round(v).toLocaleString("en-IN"));
  useEffect(() => {
    const controls = animate(mv, to, { duration: 1.6, delay: 0.6, ease: "easeIn" });
    return () => controls.stop();
  }, [mv, to]);
  return <motion.span>{text}</motion.span>;
}

export function Incident() {
  return (
    <StepLayout
      eyebrow="14:05 · Thursday"
      title="Someone just broke the orders table"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-2xl border p-5">
              <p className="text-muted text-xs">Revenue dashboard · all orders</p>
              <p className="text-bad mt-1 text-5xl font-semibold tracking-tight tabular-nums">
                ₹<Counter from={revenue(3)} to={revenue(CURRENT)} />
              </p>
              <p className="text-muted mt-1 text-xs">
                yesterday: ₹{revenue(3).toLocaleString("en-IN")}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4 }}
              className="border-line bg-surface rounded-2xl border p-4 text-sm"
            >
              <p className="text-muted flex items-center gap-2 text-xs">
                <span className="bg-viz-compute/20 text-viz-compute grid size-6 place-items-center rounded-full text-[10px] font-bold">
                  ID
                </span>
                intern_dev · 14:04
              </p>
              <p className="mt-2">
                I ran an UPDATE on <code className="text-accent">orders</code> to fix one amount…
                and forgot the <code className="text-accent">WHERE</code>. 😬
              </p>
              <pre className="bg-surface-2 text-muted mt-2 overflow-x-auto rounded-lg px-3 py-2 font-mono text-[11px]">
                UPDATE orders SET amount = 0;
              </pre>
            </motion.div>
          </div>
          <RowsTable rows={rowsAt(CURRENT)} compact />
          <p className="text-bad flex items-center gap-2 text-xs">
            <TriangleAlert className="size-4" /> Last backup: last week. Maintenance also ran
            OPTIMIZE on the table at 14:30.
          </p>
        </div>
      }
    >
      <p>
        Every amount in <strong>orders</strong> is now zero. The nightly backup is days old, and a
        maintenance job has already rewritten the table&apos;s files.
      </p>
      <p>
        But <code>orders</code> is a <strong>Delta Lake</strong> table. By the end of this module
        you&apos;ll fix it in one statement and understand exactly why that works.
      </p>
      <p>First, let&apos;s look at what a Delta table actually is on disk.</p>
    </StepLayout>
  );
}

/* 2 ─ A table on disk ------------------------------------------------- */

export function Explorer() {
  const [s, set] = useSceneState<DeltaState>();
  const sel = s.explorerSel;
  const live = liveFiles(CURRENT);

  return (
    <StepLayout
      eyebrow="Explore"
      title="A Delta table is a folder you can open"
      stage={
        <div className="grid flex-1 gap-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="font-mono text-xs">
            <p className="flex items-center gap-1.5 font-semibold">
              <Folder className="text-accent size-4" /> orders/
            </p>
            <div className="border-line mt-1 ml-2 border-l pl-3">
              <p className="text-viz-meta mt-1 flex items-center gap-1.5">
                <Folder className="size-4" /> _delta_log/
              </p>
              <ul className="border-line mt-1 ml-2 border-l pl-2">
                {COMMITS.map((c) => (
                  <li key={c.version}>
                    <button
                      type="button"
                      onClick={() => set({ explorerSel: `log:${c.version}` })}
                      className={cn(
                        "hover:bg-surface-2 flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left",
                        sel === `log:${c.version}` && "bg-viz-meta/15 text-fg",
                      )}
                    >
                      <FileJson className="text-viz-meta size-3.5 shrink-0" />
                      <span className="truncate">
                        <span className="text-subtle">{"0".repeat(15)}</span>
                        {logName(c.version).slice(15)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <ul className="mt-2">
                {FILE_IDS.map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => set({ explorerSel: `file:${id}` })}
                      className={cn(
                        "hover:bg-surface-2 flex w-full items-center gap-1.5 rounded px-1.5 py-1 text-left",
                        sel === `file:${id}` && "bg-viz-data/15 text-fg",
                      )}
                    >
                      <File className="text-viz-data size-3.5 shrink-0" />
                      <span className="truncate">{FILES[id].path}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-line bg-bg/40 min-h-64 rounded-2xl border p-4">
            <Inspector sel={sel} liveIds={live} />
          </div>
        </div>
      }
    >
      <p>
        Two kinds of files live here.{" "}
        <Term id="parquet">
          <strong>Parquet data files</strong>
        </Term>{" "}
        hold the rows.{" "}
        <strong>
          <code>_delta_log/</code>
        </strong>{" "}
        holds one JSON file per commit, numbered 0, 1, 2… and zero-padded to 20 digits.
      </p>
      <p>Click around. Open a log file, then a Parquet file.</p>
      <p>
        Count the Parquet files: <strong>{FILE_IDS.length}</strong>. Yet the table right now is made
        of just <strong>{live.size}</strong>. Hold that thought.
      </p>
    </StepLayout>
  );
}

function Inspector({ sel, liveIds }: { sel?: string; liveIds: Set<string> }) {
  if (!sel) {
    return (
      <div className="text-subtle grid h-full place-items-center text-center text-sm">
        Select a file on the left to look inside.
      </div>
    );
  }
  const [kind, key] = sel.split(":");
  if (kind === "log") {
    const c = COMMITS[Number(key)];
    return (
      <div>
        <p className="font-mono text-xs">
          <span className="text-viz-meta">{logName(c.version)}</span>
          <span className="text-muted"> · {c.operation}</span>
        </p>
        <p className="text-muted mt-1 text-sm">{c.story}</p>
        <div className="mt-3 grid gap-1">
          {commitActions(c).map((a, i) => (
            <ActionLine key={i} action={a} />
          ))}
        </div>
        <p className="text-subtle mt-3 text-xs">
          One JSON object per line. Each line is an <em>action</em>.
        </p>
      </div>
    );
  }
  const f = FILES[key];
  const versions = COMMITS.filter((c) => liveFiles(c.version).has(key)).map((c) => c.version);
  const inTable = liveIds.has(key);
  return (
    <div>
      <div className="flex items-start gap-3">
        <FileTile id={key} state={inTable ? "live" : "storage"} />
        <div className="min-w-0">
          <p className="truncate font-mono text-xs">{f.path}</p>
          <p className={cn("mt-1 text-sm font-medium", inTable ? "text-viz-data" : "text-muted")}>
            {inTable ? "Part of the current table" : "In storage, but NOT in the current table"}
          </p>
          <p className="text-muted text-xs">
            Used by version{versions.length > 1 ? "s" : ""} {versions.join(", ")}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <RowsTable rows={f.rows} compact />
      </div>
      <p className="text-subtle mt-3 text-xs">
        Parquet files are never edited. A change writes a new file instead.
      </p>
    </div>
  );
}

/* 3 ─ Anatomy of a commit --------------------------------------------- */

const ANATOMY_COMMITS: [string, string][] = [
  ["0", "v0 CREATE"],
  ["2", "v2 UPDATE"],
  ["5", "v5 OPTIMIZE"],
];

export function Anatomy() {
  const [s, set] = useSceneState<DeltaState>();
  const commit = COMMITS[Number(s.anatomyCommit)];
  const actions = commitActions(commit);
  const selected = actions[Math.min(s.anatomyAction, actions.length - 1)];

  return (
    <StepLayout
      eyebrow="Anatomy of a commit"
      title="A commit is a list of actions"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Segmented
              size="sm"
              value={s.anatomyCommit}
              options={ANATOMY_COMMITS}
              onChange={(v) => set({ anatomyCommit: v, anatomyAction: 0 })}
            />
            <span className="text-muted font-mono text-xs">{logName(commit.version)}</span>
          </div>
          <div className="border-line bg-bg/40 grid gap-1 rounded-2xl border p-3">
            {actions.map((a, i) => (
              <ActionLine
                key={`${commit.version}-${i}`}
                action={a}
                active={a === selected}
                onSelect={() => set({ anatomyAction: i })}
              />
            ))}
          </div>
          <motion.div
            key={`${commit.version}-${s.anatomyAction}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-2xl border p-4"
          >
            <p className={cn("font-mono text-sm font-semibold", actionColor[selected.type])}>
              {selected.type}
            </p>
            <p className="text-muted mt-1 text-sm">{actionMeaning[selected.type]}</p>
            {selected.type === "add" && (
              <pre className="bg-surface-2 mt-3 overflow-x-auto rounded-lg p-3 font-mono text-[11px]">
                {JSON.stringify(JSON.parse(String(selected.body.stats)), null, 2)}
              </pre>
            )}
            {"dataChange" in selected.body && (
              <p className="text-muted mt-3 text-xs">
                <code className="text-fg">dataChange: {String(selected.body.dataChange)}</code>
                {selected.body.dataChange
                  ? " · rows really changed."
                  : " · files were reorganised but the data is identical, so streaming readers can ignore this commit."}
              </p>
            )}
          </motion.div>
        </div>
      }
    >
      <p>Click each line of the commit to see what it means.</p>
      <p>
        Look at <strong>v2 UPDATE</strong>. Nothing was edited in place. The commit{" "}
        <span className="text-viz-remove font-medium">removes</span> the old file from the table and{" "}
        <span className="text-viz-add font-medium">adds</span> a rewritten one.
      </p>
      <p>
        Then compare <strong>v0</strong>, which also records the table&apos;s schema and protocol,
        with <strong>v5</strong>, where OPTIMIZE rearranged files without changing any data.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Checkpoint: what does a reader use? ----------------------------- */

export function ReaderCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How does a reader find the table?"
      stage={
        <div className="flex flex-1 items-center">
          <ChoiceCheckpoint
            id="reader-uses-log"
            prompt={
              <>
                A query runs <code className="text-accent">SELECT * FROM orders</code>. The folder
                holds {FILE_IDS.length} Parquet files. Which does the engine read?
              </>
            }
            options={[
              {
                id: "all",
                label: `All ${FILE_IDS.length} Parquet files in the folder`,
                feedback:
                  "That would bring back deleted and overwritten rows. Removed files are still sitting in the folder.",
              },
              {
                id: "newest",
                label: "Only the newest Parquet file",
                feedback:
                  "Here the newest file happens to be the whole table, but usually a table spans many files written at different times.",
              },
              {
                id: "log",
                label:
                  "Whichever files the log says are in the table, found by replaying the commits",
                correct: true,
                feedback:
                  "Right. The engine replays the actions: each add puts a file in, each remove takes it out. What's left is the table.",
              },
            ]}
            explanation={
              <>
                The folder listing never defines a Delta table. The log does. That is also why
                listing millions of files on object storage isn&apos;t needed to plan a query.
              </>
            }
          />
        </div>
      }
    >
      <p>Before we replay the log ourselves, commit to an answer.</p>
      <p className="text-subtle text-xs">
        Hint: think about the file you inspected that said &ldquo;in storage, but not in the
        table&rdquo;.
      </p>
    </StepLayout>
  );
}

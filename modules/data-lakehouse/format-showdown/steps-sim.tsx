"use client";

import { AnimatePresence, motion } from "motion/react";
import { Play, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  FORMATS,
  OPS,
  filesFor,
  type FileKind,
  type FormatId,
  type SimFile,
  type SimOptions,
} from "./data";
import type { ShowdownState } from "./state";

/* 2 ─ Side by side ⭐ ------------------------------------------------------------ */

const kindCls: Record<FileKind, string> = {
  data: "text-viz-data",
  log: "text-viz-add",
  meta: "text-viz-meta",
  delete: "text-viz-remove",
  pointer: "text-accent",
};

const kindDot: Record<FileKind, string> = {
  data: "bg-viz-data",
  log: "bg-viz-add",
  meta: "bg-viz-meta",
  delete: "bg-viz-remove",
  pointer: "bg-accent",
};

export function SideBySide() {
  const [s, set] = useSceneState<ShowdownState>();
  const ops = Math.min(s.ops, OPS.length);
  const opts: SimOptions = { deltaDv: s.deltaDv, icebergMode: s.icebergMode, hudiType: s.hudiType };
  const nextOp = OPS[ops];

  return (
    <StepLayout
      eyebrow="Simulation"
      title="Same operations, three formats"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={!nextOp}
              onClick={() => set({ ops: ops + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition enabled:hover:brightness-110 disabled:opacity-35"
            >
              <Play className="size-3.5" />
              {nextOp ? `Run ${nextOp.label}` : "All three run"}
            </button>
            <button
              type="button"
              aria-label="Reset"
              disabled={ops === 0}
              onClick={() => set({ ops: 0 })}
              className="bg-surface-2 grid size-9 place-items-center rounded-full disabled:opacity-35"
            >
              <RotateCcw className="size-3.5" />
            </button>
            <ol className="text-muted ml-auto flex gap-1 font-mono text-[10px]">
              {OPS.map((o, i) => (
                <li
                  key={o.id}
                  className={cn(
                    "rounded-full px-2 py-0.5",
                    i < ops ? "bg-viz-meta/20 text-fg" : "bg-surface-2",
                    i === ops - 1 && "ring-accent ring-1",
                  )}
                >
                  {o.label}
                </li>
              ))}
            </ol>
          </div>

          {ops > 0 && <Code className="whitespace-pre-wrap">{OPS[ops - 1].sql}</Code>}

          <div className="grid gap-3 md:grid-cols-3">
            {FORMATS.map((f) => (
              <Explorer
                key={f.id}
                format={f.id}
                name={f.name}
                files={filesFor(f.id, ops, opts)}
                latestOp={ops - 1}
                toggle={
                  f.id === "delta" ? (
                    <Segmented
                      size="sm"
                      value={s.deltaDv ? "dv" : "rewrite"}
                      options={[
                        ["rewrite", "Rewrite"],
                        ["dv", "DV"],
                      ]}
                      onChange={(v) => set({ deltaDv: v === "dv" })}
                    />
                  ) : f.id === "iceberg" ? (
                    <Segmented
                      size="sm"
                      value={s.icebergMode}
                      options={[
                        ["cow", "CoW"],
                        ["mor", "MoR"],
                      ]}
                      onChange={(v) => set({ icebergMode: v as ShowdownState["icebergMode"] })}
                    />
                  ) : (
                    <Segmented
                      size="sm"
                      value={s.hudiType}
                      options={[
                        ["cow", "CoW"],
                        ["mor", "MoR"],
                      ]}
                      onChange={(v) => set({ hudiType: v as ShowdownState["hudiType"] })}
                    />
                  )
                }
              />
            ))}
          </div>

          <ul className="text-muted flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
            {(
              [
                ["data", "Parquet data file"],
                ["log", "change log (Hudi Merge-on-Read)"],
                ["meta", "metadata: Delta log, Iceberg metadata, Hudi timeline"],
                ["delete", "delete file or deletion vector"],
                ["pointer", "catalog pointer"],
              ] as [FileKind, string][]
            ).map(([k, label]) => (
              <li key={k} className="flex items-center gap-1.5">
                <span className={cn("size-2 rounded-full", kindDot[k])} />
                {label}
              </li>
            ))}
          </ul>

          <AnimatePresence mode="wait">
            <motion.p
              key={ops}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-line bg-surface text-muted rounded-xl border px-4 py-3 text-sm"
            >
              {ops === 0
                ? "Each table has just been created. Run the first operation."
                : OPS[ops - 1].takeaway}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Time to put the three formats next to each other. Run the same three statements and watch
        exactly what each <Term id="table-format">table format</Term> writes to storage.
      </p>
      <p>
        New files glow. Look for what&apos;s the same (the data files) and what&apos;s different
        (the metadata around them).
      </p>
      <p>
        Each column also has its own way to handle the UPDATE: rewrite the file (copy-on-write,
        CoW), or record the change separately (a deletion vector, DV, or merge-on-read, MoR). Flip
        them and compare.
      </p>
      <p className="text-subtle text-xs">
        File names are shortened: real ones carry long random IDs and timestamps. Hover a file for
        what it holds. Hudi also writes requested and inflight instant files and updates its
        metadata table; they&apos;re left out to keep the view readable.
      </p>
    </StepLayout>
  );
}

function Explorer({
  name,
  files,
  latestOp,
  toggle,
}: {
  format: FormatId;
  name: string;
  files: SimFile[];
  latestOp: number;
  toggle: React.ReactNode;
}) {
  const dirs = [...new Set(files.map((f) => dirOf(f.path)))].sort((a, b) =>
    a === "" ? -1 : b === "" ? 1 : a.localeCompare(b),
  );
  const fresh = files.filter((f) => f.op === latestOp && latestOp >= 0);
  const count = (k: FileKind) => fresh.filter((f) => f.kind === k).length;

  return (
    <div className="border-line bg-bg/40 flex min-w-0 flex-col gap-2 rounded-2xl border p-3">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">{name}</p>
        <span className="text-muted font-mono text-[10px] whitespace-nowrap">
          {latestOp >= 0
            ? `+${count("data") + count("log")} data · +${count("meta") + count("pointer")} meta${count("delete") > 0 ? ` · +${count("delete")} del` : ""}`
            : "new table"}
        </span>
      </div>
      <div className="[&_button]:flex-1 [&>div]:w-full">{toggle}</div>
      <div className="min-h-40 font-mono text-[10px] leading-relaxed">
        <p className="text-subtle">orders/</p>
        {dirs.map((d) => (
          <div key={d || "root"} className={cn(d && "ml-2")}>
            {d && <p className="text-subtle">{d}/</p>}
            <ul className={cn(d && "border-line ml-1 border-l pl-2")}>
              <AnimatePresence initial={false}>
                {files
                  .filter((f) => dirOf(f.path) === d)
                  .map((f) => {
                    const isNew = f.op === latestOp && latestOp >= 0;
                    return (
                      <motion.li
                        key={f.path}
                        layout
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: f.gone ? 0.4 : 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        title={f.note}
                        className={cn(
                          "flex items-center gap-1.5 truncate rounded px-1",
                          kindCls[f.kind],
                          isNew && "bg-viz-add/15 ring-viz-add/50 ring-1",
                          f.gone && "line-through",
                        )}
                      >
                        <span className={cn("size-1.5 shrink-0 rounded-full", kindDot[f.kind])} />
                        <span className="truncate">{f.label ?? baseOf(f.path)}</span>
                      </motion.li>
                    );
                  })}
              </AnimatePresence>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

const dirOf = (p: string) => (p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "");
const baseOf = (p: string) => p.slice(p.lastIndexOf("/") + 1);

/* 3 ─ Checkpoint: whose file is it? ---------------------------------------------- */

export function WhoseFile() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Whose file is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="whose-file"
            prompt="You're browsing a bucket. Which table format wrote each file?"
            categories={[
              { id: "delta", label: "Delta" },
              { id: "iceberg", label: "Iceberg" },
              { id: "hudi", label: "Hudi" },
            ]}
            items={[
              {
                id: "delta-log",
                label: <code>_delta_log/00000000000000000012.json</code>,
                category: "delta",
                why: "Delta's transaction log: one numbered JSON file per commit.",
              },
              {
                id: "snap",
                label: <code>metadata/snap-4127…-1-9f2c….avro</code>,
                category: "iceberg",
                why: "An Iceberg manifest list: one per snapshot.",
              },
              {
                id: "timeline",
                label: <code>.hoodie/timeline/20260924…_20260924….deltacommit</code>,
                category: "hudi",
                why: "A completed instant on Hudi's timeline, named by requested and completion time.",
              },
              {
                id: "dv",
                label: <code>deletion_vector_7c1e….bin</code>,
                category: "delta",
                why: "A Delta deletion vector file. Iceberg v3 keeps its deletion vectors in Puffin files instead.",
              },
              {
                id: "meta-json",
                label: <code>metadata/00007-3b9a….metadata.json</code>,
                category: "iceberg",
                why: "An Iceberg table metadata file; the catalog points to the current one.",
              },
              {
                id: "log",
                label: <code>.a41f…_20260924….log.1_0-2-0</code>,
                category: "hudi",
                why: "A Hudi Merge-on-Read log file for one file group.",
              },
            ]}
            explanation="Notice what's missing: the Parquet data files. Those look much the same whichever format wrote them."
          />
        </div>
      }
    >
      <p>
        Knowing the fingerprints of each format helps when you meet an unfamiliar bucket, or debug a
        table.
      </p>
    </StepLayout>
  );
}

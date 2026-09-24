"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import type { IcebergState } from "./state";

/* 5 ─ A commit builds a new top of the tree ----------------------------------- */

type Kind = "accent" | "meta" | "data";

interface DNode {
  id: string;
  x: number;
  y: number;
  kind: Kind;
  /** Frame at which it appears (new nodes). Old nodes use 0. */
  at: number;
  isNew?: boolean;
}

const ROW = { catalog: 9, meta: 29, list: 49, manifest: 69, data: 90 };

const D_NODES: DNode[] = [
  { id: "catalog", x: 50, y: ROW.catalog, kind: "accent", at: 0 },
  { id: "v3", x: 28, y: ROW.meta, kind: "meta", at: 0 },
  { id: "list3", x: 28, y: ROW.list, kind: "meta", at: 0 },
  { id: "m1", x: 12, y: ROW.manifest, kind: "meta", at: 0 },
  { id: "m2", x: 32, y: ROW.manifest, kind: "meta", at: 0 },
  { id: "m3", x: 52, y: ROW.manifest, kind: "meta", at: 0 },
  { id: "d1", x: 12, y: ROW.data, kind: "data", at: 0 },
  { id: "d2", x: 32, y: ROW.data, kind: "data", at: 0 },
  { id: "d3", x: 52, y: ROW.data, kind: "data", at: 0 },
  { id: "f10", x: 80, y: ROW.data, kind: "data", at: 1, isNew: true },
  { id: "m4", x: 80, y: ROW.manifest, kind: "meta", at: 2, isNew: true },
  { id: "list4", x: 72, y: ROW.list, kind: "meta", at: 3, isNew: true },
  { id: "v4", x: 72, y: ROW.meta, kind: "meta", at: 4, isNew: true },
];

const D_EDGES: { from: string; to: string; at: number; reused?: boolean }[] = [
  { from: "v3", to: "list3", at: 0 },
  { from: "list3", to: "m1", at: 0 },
  { from: "list3", to: "m2", at: 0 },
  { from: "list3", to: "m3", at: 0 },
  { from: "m1", to: "d1", at: 0 },
  { from: "m2", to: "d2", at: 0 },
  { from: "m3", to: "d3", at: 0 },
  { from: "m4", to: "f10", at: 2 },
  { from: "list4", to: "m1", at: 3, reused: true },
  { from: "list4", to: "m2", at: 3, reused: true },
  { from: "list4", to: "m3", at: 3, reused: true },
  { from: "list4", to: "m4", at: 3 },
  { from: "v4", to: "list4", at: 4 },
];

const kindCls: Record<Kind, string> = {
  accent: "border-accent bg-accent-soft",
  meta: "border-viz-meta/60 bg-viz-meta/15",
  data: "border-viz-data/60 bg-viz-data/20",
};

const FRAMES_ALONE = [
  {
    title: "Before: the table is at snapshot S3",
    text: "The catalog points to metadata v3. A job wants to append one new file of orders.",
  },
  {
    title: "1. Write the data file",
    text: "f10.parquet lands in storage. No reader can see it: nothing in the tree points to it yet.",
  },
  {
    title: "2. Write a new manifest",
    text: "Manifest m4 lists f10, with its partition and column stats.",
  },
  {
    title: "3. Write a new manifest list",
    text: "It names m1, m2 and m3 (reused, not copied) plus the new m4. Unchanged branches of the tree are shared.",
  },
  {
    title: "4. Write a new metadata file",
    text: "Metadata v4 is a full new guide: same schema, snapshot S4 added to the history, and S4 marked current.",
  },
  {
    title: "5. Swap the pointer: the commit",
    text: "The catalog changes orders from v3 to v4 in one atomic step, only if it still points to v3. Readers now see S4. Anyone mid-read of v3 carries on safely.",
  },
];

const FRAMES_RACE = [
  ...FRAMES_ALONE.slice(0, 5),
  {
    title: "5. Swap refused: someone else committed first",
    text: "Writer B swapped the pointer to their own v4 a moment ago. “Swap only if it still points to v3” fails, so nothing we wrote is visible. No damage is done.",
  },
  {
    title: "6. Retry on top of the new state",
    text: "Read B's metadata, check our change doesn't clash with theirs, then write a new manifest list and metadata file (v5) that include both. f10 and m4 are reused. The swap from B's v4 to v5 succeeds.",
  },
];

function nodeLabel(id: string, frame: number, race: boolean) {
  const retried = race && frame >= 6;
  switch (id) {
    case "catalog": {
      if (!race && frame >= 5) return "orders → v4";
      if (race && frame === 5) return "orders → v4 (B)";
      if (retried) return "orders → v5";
      return "orders → v3";
    }
    case "v3":
      return "metadata v3";
    case "list3":
      return "list · S3";
    case "list4":
      return retried ? "list · S5" : "list · S4";
    case "v4":
      return retried ? "metadata v5" : "metadata v4";
    case "d1":
      return "f1–f3";
    case "d2":
      return "f4–f6";
    case "d3":
      return "f7–f9";
    default:
      return id;
  }
}

export function CommitSteps() {
  const [s, set] = useSceneState<IcebergState>();
  const frames = s.race ? FRAMES_RACE : FRAMES_ALONE;
  const frame = Math.min(s.commitStep, frames.length - 1);
  const f = frames[frame];
  const pos = Object.fromEntries(D_NODES.map((n) => [n.id, n]));
  const committed = s.race ? frame >= 6 : frame >= 5;
  const failed = s.race && frame === 5;
  const pointerTo = committed ? "v4" : "v3";

  return (
    <StepLayout
      eyebrow="How writes work"
      title="A commit builds a new top of the tree"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.race ? "race" : "alone"}
            options={[
              ["alone", "One writer"],
              ["race", "Another writer gets there first"],
            ]}
            onChange={(v) => set({ race: v === "race", commitStep: 0 })}
          />
          <div className="border-line bg-bg/40 relative h-80 overflow-hidden rounded-2xl border">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {D_EDGES.map((e) => {
                const a = pos[e.from];
                const b = pos[e.to];
                const shown = frame >= e.at;
                return (
                  <motion.line
                    key={`${e.from}-${e.to}`}
                    x1={a.x}
                    y1={a.y + 4}
                    x2={b.x}
                    y2={b.y - 4}
                    vectorEffect="non-scaling-stroke"
                    strokeWidth={e.reused && frame === 3 ? 2 : 1.25}
                    strokeDasharray={e.reused ? "4 3" : undefined}
                    className={
                      e.reused || pos[e.from].isNew ? "stroke-viz-add" : "stroke-line-strong"
                    }
                    initial={false}
                    animate={{ opacity: shown ? 1 : 0 }}
                  />
                );
              })}
              <motion.line
                x1={50}
                y1={ROW.catalog + 4}
                vectorEffect="non-scaling-stroke"
                strokeWidth={2}
                className="stroke-accent"
                initial={false}
                animate={{
                  x2: pointerTo === "v4" ? 72 : failed ? 50 : 28,
                  y2: failed ? ROW.catalog + 4 : ROW.meta - 4,
                }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              />
            </svg>
            {D_NODES.map((n) => {
              const shown = frame >= n.at;
              const isCatalog = n.id === "catalog";
              return (
                <motion.div
                  key={n.id}
                  initial={false}
                  animate={{
                    opacity: shown ? 1 : 0,
                    scale: shown ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.35 }}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border px-2 py-1 font-mono text-[10px] whitespace-nowrap sm:px-2.5 sm:text-[11px]",
                    kindCls[n.kind],
                    n.isNew && "border-viz-add ring-viz-add/40 ring-1",
                    isCatalog && failed && "border-bad bg-bad/15",
                    isCatalog && committed && "ring-accent/50 ring-2",
                  )}
                >
                  {nodeLabel(n.id, frame, s.race)}
                </motion.div>
              );
            })}
          </div>
          <p className="-mt-1 flex flex-wrap gap-x-4 text-[10px]">
            <span className="text-viz-add">■ written by this commit</span>
            <span className="text-viz-add">┄ reused, not copied</span>
          </p>
          <Stepper step={frame} count={frames.length} onChange={(n) => set({ commitStep: n })} />
          <FrameCaption
            frameKey={`${s.race}-${frame}`}
            title={f.title}
            tone={committed ? "good" : failed ? "bad" : undefined}
          >
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Writing works bottom-up. Everything new is written first, where no reader can see it. Only
        then does one tiny, atomic change at the top make it all visible.
      </p>
      <p>
        That swap of the catalog&apos;s pointer is the <Term id="commit">commit</Term>. It either
        happens completely or not at all, which is what makes Iceberg writes{" "}
        <Term id="atomic">atomic</Term>.
      </p>
      <p>
        Then flip to the second tab to see two writers race. Like Delta, Iceberg uses{" "}
        <Term id="optimistic-concurrency">optimistic concurrency</Term>: assume no clash, check at
        the last moment, retry if needed.
      </p>
      <p className="text-subtle text-xs">
        A retry isn&apos;t blind. The writer first checks the other commit didn&apos;t change what
        it depends on, for example that files it&apos;s rewriting still exist. If they don&apos;t,
        the commit fails instead.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint: what does a commit write? ----------------------------------- */

export function CommitCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What does a small commit write?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="commit-writes"
            prompt="A big Iceberg table has 500 manifests. A job appends one new data file. Apart from that data file, what does the commit write?"
            options={[
              {
                id: "all",
                label: "A fresh copy of all 500 manifests, plus the new one",
                feedback:
                  "Manifests are immutable and shared between snapshots, so there's no need to copy them.",
              },
              {
                id: "three",
                label: "One new manifest, one new manifest list and one new metadata file",
                correct: true,
                feedback:
                  "Right. The new manifest list points to the 500 existing manifests plus the new one.",
              },
              {
                id: "catalog",
                label: "Only a new entry in the catalog's list of files",
                feedback:
                  "The catalog doesn't track files. It stores one pointer to the current metadata file.",
              },
              {
                id: "nothing",
                label: "Nothing. Readers pick the file up from the table's folder",
                feedback:
                  "Iceberg never lists folders. A file nothing points to is invisible to readers.",
              },
            ]}
            explanation="Then the catalog's pointer is swapped. Engines may later merge small manifests into bigger ones, but that's housekeeping, not part of every commit."
          />
        </div>
      }
    >
      <p>Think about which parts of the tree actually change.</p>
    </StepLayout>
  );
}

/* 7 ─ Snapshots, time travel, branches and tags ------------------------------- */

const SNAPSHOTS = [
  {
    n: 1,
    id: "4127795402126373617",
    at: "2026-09-22 23:10",
    op: "append",
    change: "+3 files (Sep 22)",
    manifests: ["m1"],
  },
  {
    n: 2,
    id: "6582113750945263540",
    at: "2026-09-23 23:12",
    op: "append",
    change: "+3 files (Sep 23)",
    manifests: ["m1", "m2"],
  },
  {
    n: 3,
    id: "2915390046211578836",
    at: "2026-09-24 23:08",
    op: "append",
    change: "+3 files (Sep 24)",
    manifests: ["m1", "m2", "m3"],
  },
  {
    n: 4,
    id: "8744736658442914487",
    at: "2026-09-25 09:40",
    op: "append",
    change: "+1 file (f10)",
    manifests: ["m1", "m2", "m3", "m4"],
  },
];

const WAP = [
  {
    title: "main points to S4",
    sql: "-- dashboards read orders, i.e. the main branch",
    text: "Every table has a main branch. Tonight's load could contain bad data, and dashboards read main.",
  },
  {
    title: "1. Create a branch",
    sql: "ALTER TABLE orders SET TBLPROPERTIES ('write.wap.enabled' = 'true');\nALTER TABLE orders CREATE BRANCH audit;",
    text: "A branch is just a named pointer to a snapshot. Creating one copies nothing.",
  },
  {
    title: "2. Write to the branch",
    sql: "SET spark.wap.branch = audit;\nINSERT INTO orders SELECT * FROM staging_orders;",
    text: "The load commits snapshot S5 on audit. main still points to S4, so dashboards see nothing new.",
  },
  {
    title: "3. Audit",
    sql: "SELECT count(*), sum(amount)\nFROM orders VERSION AS OF 'audit';",
    text: "Run your checks against the branch: row counts, nulls, totals. Everything looks right.",
  },
  {
    title: "4. Publish",
    sql: "CALL system.fast_forward('orders', 'main', 'audit');",
    text: "main jumps forward to S5. Readers see the whole load at once, already checked. This is write-audit-publish (WAP).",
  },
  {
    title: "5. Tag it",
    sql: "ALTER TABLE orders CREATE TAG q3_close\n  RETAIN 365 DAYS;",
    text: "A tag is a named, read-only pointer. Snapshot clean-up won't remove a tagged snapshot while the tag lasts: handy for audits and month-end reports.",
  },
];

export function Snapshots() {
  const [s, set] = useSceneState<IcebergState>();
  const snap = SNAPSHOTS.find((x) => x.n === s.snapshot) ?? SNAPSHOTS[2];
  const w = Math.min(s.wapStep, WAP.length - 1);
  const mainAt = w >= 4 ? 5 : 4;

  return (
    <StepLayout
      eyebrow="History"
      title="Snapshots, branches and tags"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.snapMode}
            options={[
              ["travel", "Time travel"],
              ["branch", "Branches & tags"],
            ]}
            onChange={(v) => set({ snapMode: v as IcebergState["snapMode"] })}
          />

          {s.snapMode === "travel" ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-4 gap-2">
                {SNAPSHOTS.map((x) => (
                  <button
                    key={x.n}
                    type="button"
                    onClick={() => set({ snapshot: x.n })}
                    className={cn(
                      "rounded-xl border px-2 py-2 text-left transition-colors",
                      x.n === snap.n
                        ? "border-accent bg-accent-soft"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <p className="font-mono text-xs font-semibold">S{x.n}</p>
                    <p className="text-muted text-[10px]">{x.at.slice(5)}</p>
                    <p className="text-subtle mt-0.5 text-[10px] max-sm:hidden">{x.change}</p>
                  </button>
                ))}
              </div>
              <div className="border-line bg-surface rounded-2xl border p-4">
                <p className="text-muted text-xs">
                  S{snap.n} · {snap.op} · {snap.change}
                </p>
                <p className="text-muted mt-3 mb-1.5 text-xs">Its manifest list names:</p>
                <div className="flex gap-1.5">
                  {["m1", "m2", "m3", "m4"].map((m) => {
                    const on = snap.manifests.includes(m);
                    return (
                      <motion.span
                        key={m}
                        layout
                        animate={{ opacity: on ? 1 : 0.25 }}
                        className={cn(
                          "rounded-md border px-2.5 py-1 font-mono text-[11px]",
                          on ? "border-viz-meta/60 bg-viz-meta/15" : "border-line border-dashed",
                        )}
                      >
                        {m}
                      </motion.span>
                    );
                  })}
                </div>
                <p className="text-muted mt-4 mb-1.5 text-xs">Read it (Spark SQL)</p>
                <Code>
                  {`SELECT * FROM orders VERSION AS OF ${snap.id};\n-- or by time: the snapshot current at that moment\nSELECT * FROM orders TIMESTAMP AS OF '${snap.at}:00';`}
                </Code>
                <p className="text-subtle mt-2 text-[11px]">
                  Trino: <code>FOR VERSION AS OF …</code> / <code>FOR TIMESTAMP AS OF …</code>
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="border-line bg-bg/40 rounded-2xl border p-4">
                <div className="grid grid-cols-5 items-center gap-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <SnapDot key={n} n={n} refs={refsAt(n, w, mainAt)} />
                  ))}
                  <div />
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} />
                  ))}
                  <motion.div
                    initial={false}
                    animate={{ opacity: w >= 2 ? 1 : 0, x: w >= 2 ? 0 : -12 }}
                  >
                    <SnapDot n={5} refs={refsAt(5, w, mainAt)} />
                  </motion.div>
                </div>
                <p className="text-subtle mt-2 text-[10px]">
                  Snapshots in order; S5 sits on the audit branch until it&apos;s published.
                </p>
              </div>
              <Stepper step={w} count={WAP.length} onChange={(n) => set({ wapStep: n })} />
              <FrameCaption frameKey={w} title={WAP[w].title} tone={w === 4 ? "good" : undefined}>
                <p>{WAP[w].text}</p>
                <Code className="mt-2 whitespace-pre-wrap">{WAP[w].sql}</Code>
              </FrameCaption>
            </div>
          )}
        </div>
      }
    >
      <p>
        Every commit adds a <Term id="snapshot">snapshot</Term> to the metadata file, and each
        snapshot keeps its own manifest list. Reading an old snapshot is{" "}
        <Term id="time-travel">time travel</Term>: the same walk down the tree, from an older root.
      </p>
      <p>
        Iceberg also lets you name snapshots. A <Term id="iceberg-branch">branch</Term> is a movable
        pointer you can commit to; a tag is a fixed one. Together they give you Git-like workflows
        on data.
      </p>
      <p className="text-subtle text-xs">
        Snapshot IDs are random 64-bit numbers. Old snapshots stay readable until they&apos;re
        expired (step 14).
      </p>
    </StepLayout>
  );
}

function refsAt(n: number, w: number, mainAt: number) {
  const refs: string[] = [];
  if (n === mainAt) refs.push("main");
  if (w >= 1 && n === (w >= 2 ? 5 : 4)) refs.push("audit");
  if (w >= 5 && n === 5) refs.push("q3_close");
  return refs;
}

function SnapDot({ n, refs }: { n: number; refs: string[] }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span
        className={cn(
          "grid size-9 place-items-center rounded-full border font-mono text-[11px]",
          n === 5 ? "border-viz-add bg-viz-add/20" : "border-viz-meta/60 bg-viz-meta/15",
        )}
      >
        S{n}
      </span>
      <div className="flex min-h-4 flex-wrap justify-center gap-0.5">
        {refs.map((r) => (
          <motion.span
            layoutId={`ref-${r}`}
            key={r}
            className={cn(
              "rounded-full px-1.5 py-px font-mono text-[9px]",
              r === "main"
                ? "bg-accent text-accent-fg"
                : r === "audit"
                  ? "bg-viz-compute/25 text-viz-compute"
                  : "bg-viz-meta/25 text-viz-meta",
            )}
          >
            {r}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

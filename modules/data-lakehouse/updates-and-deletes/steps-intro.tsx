"use client";

import { AnimatePresence, motion } from "motion/react";
import { BookOpen, Plus, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { Code, FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { UpdatesState } from "./state";

/* 1 ─ A typo in a printed book ------------------------------------------------------- */

const CHAPTERS = 8;
const PAGES_PER_CHAPTER = 40;
/** Which chapter each successive typo is found in. */
const TYPO_CHAPTERS = [2, 5, 2, 7, 0, 5, 3, 6];

export function PrintedBook() {
  const [s, set] = useSceneState<UpdatesState>();
  const typos = Math.min(s.typos, TYPO_CHAPTERS.length);
  const errata = s.typoMode === "errata";
  const hit = new Set(TYPO_CHAPTERS.slice(0, typos));
  const pagesReprinted = errata ? 0 : typos * PAGES_PER_CHAPTER;

  return (
    <StepLayout
      eyebrow="The big idea first"
      title="A typo in a printed book"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <Segmented
            size="sm"
            value={s.typoMode}
            options={[
              ["reprint", "Reprint the chapter"],
              ["errata", "Add an errata slip"],
            ]}
            onChange={(v) => set({ typoMode: v as UpdatesState["typoMode"] })}
          />

          <div className="flex items-end gap-4">
            <div className="grid flex-1 grid-cols-8 gap-1.5">
              {Array.from({ length: CHAPTERS }, (_, c) => (
                <motion.div
                  key={`${c}-${s.typoMode}-${hit.has(c) ? typos : 0}`}
                  initial={!errata && hit.has(c) ? { scale: 0.85, opacity: 0.4 } : false}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "grid h-20 place-items-center rounded-md border text-[10px]",
                    !errata && hit.has(c)
                      ? "border-viz-meta bg-viz-meta/25"
                      : "border-viz-data/50 bg-viz-data/10",
                  )}
                >
                  <span>
                    ch {c + 1}
                    {!errata && hit.has(c) && <span className="block text-center">new</span>}
                  </span>
                </motion.div>
              ))}
            </div>
            <div className="relative h-24 w-16 shrink-0">
              <AnimatePresence>
                {errata &&
                  Array.from({ length: typos }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ bottom: i * 10, left: (i % 2) * 3 }}
                      className="border-viz-add bg-surface absolute h-6 w-14 rounded border text-center text-[9px] leading-6 shadow-sm"
                    >
                      {i === typos - 1 ? `${typos} slip${typos > 1 ? "s" : ""}` : ""}
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={typos >= TYPO_CHAPTERS.length}
              onClick={() => set({ typos: typos + 1 })}
              className="bg-accent text-accent-fg flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition enabled:hover:brightness-110 disabled:opacity-35"
            >
              <Plus className="size-3.5" /> Find another typo
            </button>
            {errata && (
              <button
                type="button"
                disabled={typos === 0}
                onClick={() => set({ typos: 0 })}
                className="bg-surface-2 flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium disabled:opacity-35"
              >
                <BookOpen className="size-3.5" /> Print a new edition
              </button>
            )}
            <button
              type="button"
              aria-label="Reset"
              onClick={() => set({ typos: 1 })}
              className="bg-surface-2 grid size-9 place-items-center rounded-full"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">Pages reprinted by the publisher</p>
              <p className="text-viz-meta font-mono text-xl font-semibold tabular-nums">
                {pagesReprinted}
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[11px]">Slips every reader must check</p>
              <p className="text-viz-compute font-mono text-xl font-semibold tabular-nums">
                {errata ? typos : 0}
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        A textbook is printed and shipped. Then someone spots a typo. The printed pages can&apos;t
        be edited, just like a lakehouse&apos;s data files.
      </p>
      <p>
        The publisher can <strong>reprint the whole chapter</strong>: expensive now, but readers get
        a clean book. Or it can tuck in an <strong>errata slip</strong>: cheap now, but every reader
        has to check the slips, and they pile up.
      </p>
      <p>
        Find a few typos each way. That&apos;s <Term id="copy-on-write">Copy-on-Write</Term> versus{" "}
        <Term id="merge-on-read">Merge-on-Read</Term>. A new edition that folds the slips in is{" "}
        <Term id="compaction">compaction</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Anatomy of an UPDATE ------------------------------------------------------------- */

const FILES = ["f1", "f2", "f3", "f4", "f5", "f6"];
const TARGET = "f3";

const ANATOMY: { title: string; cow: string; mor: string }[] = [
  {
    title: "The statement",
    cow: "One order was refunded. Logically, an update is two things: delete the old version of the row, insert the new one.",
    mor: "One order was refunded. Logically, an update is two things: delete the old version of the row, insert the new one.",
  },
  {
    title: "1. Find the rows (same cost either way)",
    cow: "Partition pruning and file statistics narrow the search; the engine then reads the candidate files to find the row. Order 1042 is row 5,120 of f3.",
    mor: "Partition pruning and file statistics narrow the search; the engine then reads the candidate files to find the row. Order 1042 is row 5,120 of f3.",
  },
  {
    title: "2. Record the change",
    cow: "Write f3′: a full copy of f3's million rows, with row 5,120 replaced by its new version. About 128 MB written to change one row.",
    mor: "Write a tiny deletion vector saying “row 5,120 of f3 is deleted”, plus a small new file holding the updated row. A few KB written.",
  },
  {
    title: "3. Commit",
    cow: "The commit removes f3 from the table and adds f3′. f3 stays in storage for time travel until clean-up.",
    mor: "The commit attaches the deletion vector to f3 and adds the small file. f3 itself is untouched.",
  },
  {
    title: "4. Every read afterwards",
    cow: "Readers read f3′ like any other file. Nothing extra to do.",
    mor: "Readers load f3's deletion vector, skip row 5,120, and also read the small file. A little extra work, on every read, until compaction.",
  },
];

export function Anatomy() {
  const [s, set] = useSceneState<UpdatesState>();
  const step = Math.min(s.anatomyStep, ANATOMY.length - 1);
  const f = ANATOMY[step];
  const cow = s.anatomyMode === "cow";

  return (
    <StepLayout
      eyebrow="Mechanics"
      title="Anatomy of an UPDATE"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.anatomyMode}
            options={[
              ["cow", "Copy-on-Write"],
              ["mor", "Merge-on-Read"],
            ]}
            onChange={(v) => set({ anatomyMode: v as UpdatesState["anatomyMode"] })}
          />
          <Code>{"UPDATE orders SET status = 'refunded' WHERE order_id = 1042;"}</Code>
          <div className="border-line bg-bg/40 flex flex-wrap items-center gap-2 rounded-2xl border p-4">
            {FILES.map((id) => {
              const isTarget = id === TARGET;
              const found = step >= 1 && isTarget;
              const replaced = cow && step >= 3 && isTarget;
              return (
                <motion.div
                  key={id}
                  animate={{
                    opacity: step >= 1 && !isTarget ? 0.4 : 1,
                    scale: found && step === 1 ? 1.08 : 1,
                  }}
                  className={cn(
                    "relative grid h-16 w-12 place-items-center rounded-lg border font-mono text-[11px]",
                    replaced
                      ? "border-viz-remove text-viz-remove border-dashed line-through"
                      : found
                        ? "border-viz-compute bg-viz-compute/20"
                        : "border-viz-data/50 bg-viz-data/10",
                  )}
                >
                  {id}
                  {!cow && found && step >= 2 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-viz-remove text-bg absolute -top-2 -right-2 rounded px-1 text-[8px]"
                    >
                      DV
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  key={s.anatomyMode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "grid place-items-center rounded-lg border font-mono text-[11px]",
                    cow
                      ? "border-viz-add bg-viz-add/20 h-16 w-12"
                      : "border-viz-add bg-viz-add/20 h-8 w-10 self-end",
                  )}
                >
                  {cow ? "f3′" : "new"}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="text-muted ml-auto text-right font-mono text-[11px]">
              written:{" "}
              <strong className="text-fg">
                {step >= 2 ? (cow ? "≈128 MB" : "≈ a few KB") : "–"}
              </strong>
            </div>
          </div>
          <Stepper step={step} count={ANATOMY.length} onChange={(n) => set({ anatomyStep: n })} />
          <FrameCaption frameKey={`${s.anatomyMode}-${step}`} title={f.title}>
            {cow ? f.cow : f.mor}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Step through one UPDATE with each strategy. Notice where they&apos;re identical and where
        they split.
      </p>
      <p>
        Finding the row costs the same either way. The difference is only in how the “delete the old
        version” half is written down: by rewriting the file, or by marking the row.
      </p>
      <p className="text-subtle text-xs">
        A DELETE is the same without the insert; MERGE combines both. This is how Delta and Iceberg
        work. Two variations: Iceberg equality deletes skip finding the row, and Hudi finds the file
        group through its index and writes the new record version to a log.
      </p>
    </StepLayout>
  );
}

/* 3 ─ The Merge-on-Read family --------------------------------------------------------- */

const FAMILY: Record<
  UpdatesState["family"],
  { label: string; who: string; writes: string; reader: string; mustFind: string; readCost: number }
> = {
  dv: {
    label: "Deletion vectors",
    who: "Delta Lake; Iceberg format v3",
    writes: "A compact bitmap per data file, marking deleted row positions.",
    reader: "Load one small bitmap per file and skip the marked rows. Very cheap.",
    mustFind: "yes, its position",
    readCost: 1,
  },
  position: {
    label: "Position deletes",
    who: "Iceberg format v2 (not allowed for new writes in v3)",
    writes: "A delete file listing (file path, row position) pairs.",
    reader: "Load the delete files that apply to each data file and skip those positions.",
    mustFind: "yes, its position",
    readCost: 2,
  },
  equality: {
    label: "Equality deletes",
    who: "Iceberg (typically streaming writers such as Flink)",
    writes: "A delete file of key values, e.g. order_id = 1042. No need to find the row first.",
    reader:
      "Compare the rows of every older data file it applies to against the deleted keys. That makes them usually the most expensive to read.",
    mustFind: "no, only its key",
    readCost: 4,
  },
  log: {
    label: "Log files",
    who: "Hudi Merge-on-Read tables",
    writes: "Appends the changed records (and deletes) to a log file for the file group.",
    reader: "Merge the log records with the base file by record key (snapshot queries).",
    mustFind: "only its file group, via the index",
    readCost: 3,
  },
};

export function MorFamily() {
  const [s, set] = useSceneState<UpdatesState>();
  const f = FAMILY[s.family];

  return (
    <StepLayout
      eyebrow="Merge-on-Read"
      title="Four ways to write the errata slip"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.family}
            options={(Object.keys(FAMILY) as UpdatesState["family"][]).map(
              (k) => [k, FAMILY[k].label] as [string, string],
            )}
            onChange={(v) => set({ family: v as UpdatesState["family"] })}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={s.family}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-muted text-xs">Used by: {f.who}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-viz-meta/40 bg-viz-meta/10 rounded-xl border p-3">
                  <p className="text-sm font-semibold">What the writer writes</p>
                  <p className="text-muted mt-1 text-sm">{f.writes}</p>
                  <p className="mt-2 text-xs">
                    Must find the row first? <strong className="text-fg">{f.mustFind}</strong>
                  </p>
                </div>
                <div className="border-viz-compute/40 bg-viz-compute/10 rounded-xl border p-3">
                  <p className="text-sm font-semibold">What every reader must do</p>
                  <p className="text-muted mt-1 text-sm">{f.reader}</p>
                </div>
              </div>
              <div>
                <p className="text-muted mb-1 text-[11px]">Extra work for readers (relative)</p>
                <div className="bg-surface-2 h-2 overflow-hidden rounded-full">
                  <motion.div
                    className="bg-viz-compute h-full rounded-full"
                    initial={false}
                    animate={{ width: `${f.readCost * 24}%` }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        “Merge-on-Read” is a family, not one technique. All of them record the delete half
        separately, but they differ in what the writer needs to know and how much each reader pays.
      </p>
      <p>
        The cheapest to read, <Term id="deletion-vector">deletion vectors</Term>, have become the
        common direction: Delta uses them, and Iceberg v3 replaced position delete files with them.
      </p>
    </StepLayout>
  );
}

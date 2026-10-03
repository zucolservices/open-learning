"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { HEADER, PAGE, apply, used, type Op } from "./model";
import type { PageState } from "./state";

/* 1 ─ A page with a contents list ----------------------------------------------------------------- */

export function Ledger() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A page with a contents list"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <div className="border-line-strong bg-surface relative h-56 w-48 rounded-md border-2 p-2 font-mono text-[10px]">
            <p className="text-accent">contents</p>
            {["1 → line 30", "2 → line 27", "3 → line 24"].map((l, i) => (
              <motion.p
                key={l}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i }}
              >
                {l}
              </motion.p>
            ))}
            <p className="text-muted mt-6 text-center">… free space …</p>
            <div className="absolute inset-x-2 bottom-2 flex flex-col gap-0.5">
              {["Entry 3: Meera, ₹420", "Entry 2: Ravi, ₹180", "Entry 1: Asha, ₹960"].map(
                (l, i) => (
                  <motion.p
                    key={l}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + 0.15 * i }}
                    className="bg-accent-soft rounded px-1"
                  >
                    {l}
                  </motion.p>
                ),
              )}
            </div>
          </div>
        </div>
      }
    >
      <p>
        Imagine a ledger page where you write entries from the bottom up, and keep a short contents
        list at the top: &ldquo;entry 2 is on line 27&rdquo;. If you need to tidy the page and move
        an entry, you only change its line in the contents; anyone who looks up &ldquo;entry
        2&rdquo; still finds it.
      </p>
      <p>
        That&apos;s exactly how most databases lay out a <Term id="page">page</Term>. It&apos;s
        called a <Term id="slotted-page">slotted page</Term>: an array of pointers at the front,
        rows packed from the back, free space in between.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Inside an 8 kB page ⭐ ---------------------------------------------------------------------- */

const OPS: { id: Op; label: string }[] = [
  { id: "insert", label: "INSERT an order" },
  { id: "insertWide", label: "INSERT one with a 6 kB note" },
  { id: "update", label: "UPDATE an order" },
  { id: "delete", label: "DELETE an order" },
  { id: "vacuum", label: "VACUUM" },
  { id: "reset", label: "Start again" },
];

export function SlottedPage() {
  const [s, set] = useSceneState<PageState>();
  const slots = s.slots ?? [];
  const u = used(slots);
  const pct = (b: number) => `${(b / PAGE) * 100}%`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Inside an 8 kB page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {OPS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  const r = apply(slots, o.id);
                  set({ slots: r.slots, note: r.note });
                }}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                  o.id === "reset" ? "border-line text-muted" : "border-line hover:bg-surface-2",
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          <div className="border-line-strong flex h-10 overflow-hidden rounded-lg border">
            <div
              className="bg-viz-meta/50 flex items-center justify-center text-[9px]"
              style={{ width: pct(HEADER) }}
              title="page header"
            />
            <motion.div
              layout
              className="bg-accent/50"
              style={{ width: pct(u.pointers) }}
              title="line pointers"
            />
            <motion.div
              layout
              className="bg-surface flex flex-1 items-center justify-center text-[10px]"
            >
              <span className="text-muted">free {u.free.toLocaleString("en-IN")} B</span>
            </motion.div>
            {[...slots]
              .reverse()
              .filter((sl) => sl.size > 0)
              .map((sl) => (
                <motion.div
                  key={sl.n + sl.label}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "border-bg border-l",
                    sl.state === "dead" ? "bg-bad/50" : "bg-viz-data/60",
                  )}
                  style={{ width: pct(sl.size * 6) }}
                  title={sl.label}
                />
              ))}
          </div>
          <p className="text-muted text-[10px]">
            Header · line pointers → · free space · ← rows (row widths drawn 6× larger so you can
            see them)
          </p>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {slots.map((sl) => (
              <motion.div
                key={sl.n}
                layout
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[10px]",
                  sl.state === "live"
                    ? "border-viz-data/50 bg-viz-data/10"
                    : sl.state === "dead"
                      ? "border-bad/50 bg-bad/10"
                      : "border-line border-dashed",
                )}
              >
                <span className="text-muted">(0,{sl.n})</span>{" "}
                {sl.state === "unused" ? "unused" : sl.label}
                {sl.state === "dead" && <span className="text-bad"> dead</span>}
              </motion.div>
            ))}
          </div>
          <motion.p
            key={s.note}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {s.note}
          </motion.p>
          <p className="text-subtle text-[10px]">Simplified, with illustrative row sizes.</p>
        </div>
      }
    >
      <p>
        A PostgreSQL page: a 24-byte header, an array of 4-byte line pointers growing forward, and
        rows &ldquo;stored in space allocated backwards from the end of unallocated space&rdquo;.
        Try each operation and watch the free space in the middle.
      </p>
      <p>
        Two surprises. An UPDATE doesn&apos;t overwrite the row; it writes a new version and leaves
        the old one dead. And a DELETE frees nothing straight away. Only VACUUM gives the space
        back, which module 17 explains.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Addresses and padding ----------------------------------------------------------------------- */

export function RowAddress() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Addresses and padding"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`SELECT ctid, id FROM orders LIMIT 3;
 ctid  | id
-------+------
 (0,1) | ord_1
 (0,2) | ord_2
 (0,3) | ord_3      ← (page 0, slot 3)`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [
                "(flag bool, amount bigint, paid bool, ref bigint)",
                "32 bytes of data",
                "1 + 7 padding + 8 + 1 + 7 padding + 8",
              ],
              [
                "(amount bigint, ref bigint, flag bool, paid bool)",
                "18 bytes of data",
                "8 + 8 + 1 + 1",
              ],
            ].map(([cols, size, how], i) => (
              <div
                key={cols}
                className={cn(
                  "rounded-lg border px-3 py-2",
                  i === 0 ? "border-bad/40 bg-bad/5" : "border-good/40 bg-good/5",
                )}
              >
                <p className="font-mono text-[10px]">{cols}</p>
                <p className="text-sm font-semibold">{size}</p>
                <p className="text-muted text-[10px]">{how}</p>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Every row has a physical address, PostgreSQL&apos;s <Term id="ctid">ctid</Term>: a page
        number and a slot number. Indexes point at these. But a row&apos;s ctid changes when
        it&apos;s updated, so it&apos;s never safe to use as an ID in your application.
      </p>
      <p>
        Each row also carries a header, 23 bytes on most machines, and its values are aligned to
        boundaries: an 8-byte number must start at a multiple of 8, so padding fills the gaps.
        Putting wide columns first can make every row noticeably smaller; people call it
        &ldquo;column Tetris&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Heaps, trees and big values ----------------------------------------------------------------- */

const FACTS: [string, string][] = [
  [
    "PostgreSQL: a heap",
    "A new row can go in any page with room. A free space map records how much space each page has, one byte per page.",
  ],
  [
    "MySQL InnoDB: a clustered index",
    "Rows live inside the primary key's B-tree, in key order. Secondary indexes store the primary key, not a page address.",
  ],
  ["SQLite", "One file of pages, all the same size: a power of two between 512 and 65,536 bytes."],
  [
    "Big values",
    "“PostgreSQL uses a fixed page size (commonly 8 kB), and does not allow tuples to span multiple pages.” Rows wider than about 2 kB are compressed and moved out of line, a scheme called TOAST.",
  ],
];

export function HeapOrTree() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="Heaps, trees and big values"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FACTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Engines disagree on where a row goes. PostgreSQL stores tables as a{" "}
        <Term id="heap">heap</Term>: rows go wherever there&apos;s room, and indexes point at their
        addresses. InnoDB keeps rows sorted inside the primary key&apos;s tree.
      </p>
      <p>
        Neither is better everywhere. A clustered table makes primary-key range scans cheap; a heap
        makes inserts simple and lets every index point straight at the row.
      </p>
    </StepLayout>
  );
}

/* 5 ─ After an update ----------------------------------------------------------------------------- */

export function AfterUpdate() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="After an update"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="after-update"
            prompt="In PostgreSQL, an order at ctid (12,4) has its status updated. What happens in the table?"
            options={[
              {
                id: "overwrite",
                label: "The row at (12,4) is overwritten in place",
                feedback:
                  "That's what many people expect, but PostgreSQL never overwrites a row version.",
              },
              {
                id: "newversion",
                label:
                  "A new version is written (often on the same page) with a new ctid; the old one stays as a dead row until vacuum",
                correct: true,
                feedback:
                  "Exactly. That's why updates create work for vacuum, and why ctid isn't a stable ID.",
              },
              {
                id: "moved",
                label: "The whole page is rewritten to a new location on disk",
                feedback: "Only the changed row gets a new version; the page stays where it is.",
              },
              {
                id: "gone",
                label: "The old version is deleted immediately and its space reused",
                feedback:
                  "Not until vacuum: other transactions may still need to see the old version.",
              },
            ]}
            explanation="PostgreSQL updates by adding a new row version; old versions are cleaned up later."
          />
        </div>
      }
    >
      <p>Think back to the simulation.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Slotted pages", "Pointers at the front, rows from the back."],
  ["Rows have addresses", "Page and slot; they change on update."],
  ["Updates add versions", "Deletes and updates leave dead rows for vacuum."],
  ["Alignment matters", "Column order changes row size."],
  ["Heap or clustered", "PostgreSQL vs InnoDB."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {POINTS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>Next: what if you store each column together instead of each row?</p>
    </StepLayout>
  );
}

"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { KEYS, build, levels, path, type Node } from "./model";
import type { BtState } from "./state";

function Tree({ root, highlight }: { root: Node; highlight?: Node[] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      {levels(root).map((row, li) => (
        <div key={li} className="flex flex-wrap justify-center gap-1.5">
          {row.map((n, i) => {
            const on = highlight?.includes(n);
            return (
              <motion.div
                key={`${li}-${i}-${n.keys.join(",")}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                  "flex rounded-md border font-mono text-[11px]",
                  on
                    ? "border-accent bg-accent-soft"
                    : n.children
                      ? "border-viz-meta/50 bg-viz-meta/10"
                      : "border-viz-data/50 bg-viz-data/10",
                )}
              >
                {n.keys.map((k, j) => (
                  <span key={j} className={cn("px-1.5 py-1", j > 0 && "border-line border-l")}>
                    {k}
                  </span>
                ))}
              </motion.div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* 1 ─ Guide words --------------------------------------------------------------------------------- */

export function GuideWords() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Guide words"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["Shelf", "Volumes A–D, E–K, L–R, S–Z", "Pick one volume"],
            ["Volume L–R", "Pages: L–Ma, Mb–Mi, Mj–Mu …", "Pick one page"],
            ["Page Mj–Mu", "mosaic, mosque, mosquito …", "Find the word"],
          ].map(([t, d, k], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
              className="border-line bg-surface grid gap-x-3 rounded-lg border px-3 py-2 sm:grid-cols-[8rem_1fr_7rem]"
              style={{ marginLeft: i * 14 }}
            >
              <span className="text-sm font-semibold">{t}</span>
              <span className="text-muted font-mono text-xs">{d}</span>
              <span className="text-accent text-xs sm:text-right">{k}</span>
            </motion.div>
          ))}
          <p className="text-muted mt-1 text-xs">Three looks, out of thousands of pages.</p>
        </div>
      }
    >
      <p>
        To find &ldquo;mosquito&rdquo; in a multi-volume dictionary, you don&apos;t read from the
        start. The spines tell you the volume, the guide words at the top of each page tell you the
        page, and then you scan one page.
      </p>
      <p>
        A <Term id="btree">B-tree</Term> index is the same idea built from database pages. Rudolf
        Bayer and Edward McCreight described it in 1970; by 1979 a survey already called it
        &ldquo;The Ubiquitous B-Tree&rdquo;. It&apos;s still the default index in almost every
        relational database.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Grow a B-tree ⭐ ---------------------------------------------------------------------------- */

export function GrowTree() {
  const [s, set] = useSceneState<BtState>();
  const n = s.n ?? 3;
  const b = build(n);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Grow a B-tree"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={n >= KEYS.length}
              onClick={() => set({ n: n + 1 })}
              className="bg-accent text-accent-fg rounded-lg px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              {n < KEYS.length ? `Insert ${KEYS[n]}` : "All keys inserted"}
            </button>
            <button
              type="button"
              onClick={() => set({ n: 0 })}
              className="text-muted flex items-center gap-1 text-xs"
            >
              <RotateCcw className="size-3" /> Start again
            </button>
            <span className="text-muted ml-auto font-mono text-[10px]">
              {n} keys · {levels(b.root).length} level{levels(b.root).length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="border-line bg-surface min-h-40 rounded-xl border p-4">
            {n === 0 ? (
              <p className="text-muted text-center text-xs">An empty index: one empty page.</p>
            ) : (
              <Tree root={b.root} />
            )}
          </div>
          <div className="flex flex-wrap gap-3 text-[10px]">
            <span className="flex items-center gap-1">
              <span className="bg-viz-meta/30 size-2.5 rounded-sm" /> inner page: keys that guide
              the search
            </span>
            <span className="flex items-center gap-1">
              <span className="bg-viz-data/30 size-2.5 rounded-sm" /> leaf page: the indexed keys
              (and where their rows are)
            </span>
          </div>
          {b.events.length > 0 && (
            <motion.p
              key={n}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm"
            >
              {b.events[b.events.length - 1]}
            </motion.p>
          )}
          <p className="text-subtle text-[10px]">
            Pages here hold at most 3 keys; real pages hold hundreds.
          </p>
        </div>
      }
    >
      <p>
        Insert keys one at a time into a tiny index whose pages hold three keys each. Watch what
        happens when a page fills up.
      </p>
      <p>
        A full page <Term id="page-split">splits</Term>: half its keys move to a new page, and a key
        is added to the parent to point at it. Splits can ripple upwards, and when the root splits
        the tree grows a level, always at the top. That&apos;s why every leaf is the same distance
        from the root: the tree stays balanced on its own.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Find one key ⭐ ----------------------------------------------------------------------------- */

const SCALE: [string, number][] = [
  ["300 rows", 1],
  ["90,000 rows", 2],
  ["27 million rows", 3],
  ["8 billion rows", 4],
];

export function FindKey() {
  const [s, set] = useSceneState<BtState>();
  const b = build(KEYS.length);
  const p = path(b.root, s.find);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Find one key"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted text-xs">Find</span>
            {[8, 25, 45, 70].map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.find === k}
                onClick={() => set({ find: k })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-xs",
                  s.find === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {k}
              </button>
            ))}
            <span className="text-muted ml-auto font-mono text-[10px]">{p.length} page reads</span>
          </div>
          <div className="border-line bg-surface rounded-xl border p-4">
            <Tree root={b.root} highlight={p} />
          </div>
          <div className="border-line bg-surface overflow-hidden rounded-xl border text-xs">
            <p className="text-muted px-3 pt-2 text-[10px]">
              With about 300 keys per page (illustrative), levels needed:
            </p>
            {SCALE.map(([rows, lv]) => (
              <div key={rows} className="flex items-center justify-between px-3 py-1">
                <span>{rows}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: lv }, (_, i) => (
                    <span key={i} className="bg-accent/60 h-3 w-5 rounded-sm" />
                  ))}
                </span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        Pick a key and follow the highlighted pages from the root down. Each level is one page read,
        and at each page the keys say which child to go to.
      </p>
      <p>
        Because each page holds &ldquo;often hundreds&rdquo; of entries, the tree stays shallow.
        Markus Winand notes that real indexes with millions of records are four or five levels deep,
        and six is hardly ever seen. The top levels are used so often they almost always sit in the
        buffer pool.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Ranges and real engines --------------------------------------------------------------------- */

const REAL: [string, string][] = [
  [
    "Range scans",
    "Leaf pages are linked to their neighbours, so WHERE amount BETWEEN 100 AND 500 finds the first match, then walks along the leaves. In PostgreSQL every level is linked, and range scans read only leaf pages.",
  ],
  [
    "PostgreSQL",
    "“By default, the CREATE INDEX command creates B-tree indexes.” Since version 13, duplicate keys are stored once (deduplication), which shrinks indexes on repetitive data.",
  ],
  [
    "MySQL InnoDB",
    "The table itself is a B-tree on the primary key, with rows in its leaves; secondary indexes store primary key values.",
  ],
  [
    "SQLite",
    "Tables are stored in “table b-trees” with data in the leaves; indexes in “index b-trees” that store keys only.",
  ],
];

export function Ranges() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Ranges and real engines"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {REAL.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
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
      <p>
        The version in this module keeps all keys in the leaves and only guide keys above, a
        B+tree-style layout, which is what databases use. Because the leaves are in sorted order and
        linked, an index answers ranges and ORDER BY as cheaply as single lookups.
      </p>
      <p>
        The cost is on writes: every insert or update of an indexed column has to find its leaf and
        sometimes split pages. The next module is about when that trade is worth it.
      </p>
    </StepLayout>
  );
}

/* 5 ─ How many reads? ----------------------------------------------------------------------------- */

export function HowManyReads() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="How many reads?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="how-many-reads"
            prompt="A PostgreSQL B-tree index on customer_id is 4 levels deep. Nothing is cached. How many pages are read to fetch one customer's row by id?"
            options={[
              {
                id: "1",
                label: "1: the index points straight at the row",
                feedback: "The index has to be walked from the root first.",
              },
              {
                id: "4",
                label: "4: one per index level",
                feedback: "That finds the row's address, but the row itself lives in the table.",
              },
              {
                id: "5",
                label: "5: one page per index level, then the table page holding the row",
                correct: true,
                feedback:
                  "Root to leaf, then one heap page. In practice the top levels are almost always cached.",
              },
              {
                id: "all",
                label: "Every page of the table",
                feedback: "That's what happens without an index.",
              },
            ]}
            explanation="A lookup costs one page per level, plus the table page (unless the index alone answers the query, as module 7 shows)."
          />
        </div>
      }
    >
      <p>Count the pages.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Levels of pages", "Guide keys above, all keys in the leaves."],
  ["Splits keep it balanced", "The tree grows at the top."],
  ["Shallow, even when huge", "Hundreds of keys per page; a few levels."],
  ["Ranges are cheap", "Sorted, linked leaves."],
  ["Writes pay", "Every index adds work to inserts and updates."],
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
      <p>Next: when the planner will actually use your index, and when it won&apos;t.</p>
    </StepLayout>
  );
}

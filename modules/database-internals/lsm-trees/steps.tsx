"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { OPS, read, replay, type Entry } from "./model";
import type { LsmState } from "./state";

function Run({ title, entries, tone }: { title: string; entries: Entry[]; tone: string }) {
  return (
    <div className={cn("rounded-lg border px-2 py-1.5", tone)}>
      <p className="text-muted font-mono text-[9px]">{title}</p>
      <div className="mt-0.5 flex flex-wrap gap-1">
        {entries.length === 0 && <span className="text-subtle text-[10px]">empty</span>}
        {entries.map((e) => (
          <span
            key={e.key}
            className={cn(
              "rounded px-1 font-mono text-[10px]",
              e.value === null ? "bg-bad/20 line-through" : "bg-surface-2",
            )}
          >
            {e.key}
            {e.value !== null && <span className="text-muted">={e.value}</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* 1 ─ The order pad ------------------------------------------------------------------------------- */

export function OrderPad() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The order pad"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            ["The pad", "A waiter jots each order down instantly. No filing during the rush."],
            [
              "The tray",
              "When a page fills, it's sorted and torn off into a tray. Newest sheets on top.",
            ],
            [
              "The cabinet",
              "Later, someone merges the tray into the filing cabinet, keeping only the latest version of each order.",
            ],
          ].map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A B-tree files every change in its proper place straight away. A busy restaurant can&apos;t
        work like that: the waiter writes orders on a pad and sorts things out later.
      </p>
      <p>
        An <Term id="lsm-tree">LSM tree</Term> (log-structured merge-tree, described in 1996) works
        like the restaurant. Google&apos;s Bigtable used the design, and LevelDB and RocksDB brought
        it to many databases. Writes become very fast; reads may have to check the pad, the tray and
        the cabinet.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Writes ⭐ ----------------------------------------------------------------------------------- */

export function WritePath() {
  const [s, set] = useSceneState<LsmState>();
  const n = s.n ?? 0;
  const lsm = replay(n);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Writes: memtable, flush, compact"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={n >= OPS.length}
              onClick={() => set({ n: n + 1 })}
              className="bg-accent text-accent-fg rounded-lg px-3 py-1.5 font-mono text-xs disabled:opacity-40"
            >
              {n < OPS.length
                ? OPS[n].value === null
                  ? `DELETE ${OPS[n].key}`
                  : `PUT ${OPS[n].key}=${OPS[n].value}`
                : "All writes done"}
            </button>
            <button
              type="button"
              onClick={() => set({ n: 0 })}
              className="text-muted flex items-center gap-1 text-xs"
            >
              <RotateCcw className="size-3" /> Start again
            </button>
            <span className="text-muted ml-auto font-mono text-[10px]">
              {n} / {OPS.length} writes
            </span>
          </div>
          <Run
            title="memtable (memory, sorted)"
            entries={lsm.memtable}
            tone="border-viz-compute/50 bg-viz-compute/5"
          />
          <div className="flex flex-col gap-1">
            {lsm.l0.length === 0 && (
              <Run title="L0 (sorted files on disk)" entries={[]} tone="border-line bg-surface" />
            )}
            {lsm.l0.map((f, i) => (
              <Run
                key={i}
                title={`L0 file ${i + 1}${i === 0 ? " (newest)" : ""}`}
                entries={f}
                tone="border-viz-data/50 bg-viz-data/5"
              />
            ))}
          </div>
          <Run
            title="L1 (one big sorted run)"
            entries={lsm.l1}
            tone="border-viz-meta/50 bg-viz-meta/5"
          />
          <motion.p
            key={n}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm"
          >
            {lsm.event}
          </motion.p>
          <p className="text-subtle text-[10px]">
            Tiny sizes for visibility: a 4-entry memtable, compaction at 3 L0 files.
          </p>
        </div>
      }
    >
      <p>
        Every write goes to an in-memory sorted table, the <Term id="memtable">memtable</Term> (and
        to a log, for safety). When it fills, it&apos;s written out as an immutable sorted file, an{" "}
        <Term id="sstable">SSTable</Term>. Nothing on disk is ever updated in place.
      </p>
      <p>
        Background <Term id="compaction">compaction</Term> merges files, keeping only the newest
        value for each key. Deletes are just another write: a tombstone, which hides older values
        until compaction finally drops it.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Reads ⭐ ------------------------------------------------------------------------------------ */

const KEYS = ["asha", "ravi", "zoya", "noor", "priya"];

export function ReadPath() {
  const [s, set] = useSceneState<LsmState>();
  const lsm = replay(10);
  const r = read(lsm, s.key, s.bloom);
  const looked = r.steps.filter((x) => x.result !== "skipped").length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Reads: newest first"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-muted text-xs">GET</span>
            {KEYS.map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.key === k}
                onClick={() => set({ key: k })}
                className={cn(
                  "rounded-full border px-2.5 py-1 font-mono text-[11px]",
                  s.key === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {k}
              </button>
            ))}
            <button
              type="button"
              aria-pressed={s.bloom}
              onClick={() => set({ bloom: !s.bloom })}
              className={cn(
                "ml-auto rounded-full border px-2.5 py-1 text-[11px]",
                s.bloom ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
              )}
            >
              {s.bloom ? "✓ " : ""}Bloom filters
            </button>
          </div>
          <p className="text-muted text-[10px]">
            The tree after the first 10 writes: a memtable, two L0 files, nothing in L1 yet.
          </p>
          <div className="flex flex-col gap-1">
            {r.steps.map((st, i) => (
              <motion.div
                key={`${s.key}-${s.bloom}-${i}`}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
                  st.result === "found"
                    ? "border-good/50 bg-good/10"
                    : st.result === "deleted"
                      ? "border-bad/50 bg-bad/10"
                      : st.result === "skipped"
                        ? "border-line text-subtle border-dashed"
                        : "border-line bg-surface",
                )}
              >
                <span className="font-mono">{st.where}</span>
                <span>
                  {st.result === "found"
                    ? "found"
                    : st.result === "deleted"
                      ? "tombstone: deleted"
                      : st.result === "skipped"
                        ? "filter says: definitely not here"
                        : "not here, keep looking"}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="text-sm">
            {r.value !== null
              ? `${s.key} = ${r.value}`
              : r.steps.some((x) => x.result === "deleted")
                ? `${s.key} was deleted.`
                : `${s.key} doesn't exist.`}{" "}
            <span className="text-muted">
              ({looked} place{looked === 1 ? "" : "s"} actually searched)
            </span>
          </p>
        </div>
      }
    >
      <p>
        To read a key, look in the newest place first: the memtable, then each L0 file from newest
        to oldest, then each lower level. The first answer found wins, even if it&apos;s a
        tombstone.
      </p>
      <p>
        Looking for a key that doesn&apos;t exist means checking everywhere. A{" "}
        <Term id="bloom-filter">Bloom filter</Term> per file answers &ldquo;definitely not
        here&rdquo; or &ldquo;maybe&rdquo; from a few bits per key: RocksDB&apos;s docs give about
        10 bits per key for around a 1% false-positive rate. They help single-key lookups, not range
        scans.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Three kinds of amplification ---------------------------------------------------------------- */

const AMP: [string, string][] = [
  [
    "Write amplification",
    "How many bytes are written to disk for each byte you write: compaction rewrites data again and again. RocksDB's worked example for leveled compaction comes out around 33.",
  ],
  ["Read amplification", "How many places a read must look."],
  [
    "Space amplification",
    "How much extra disk old versions and tombstones take before compaction cleans them up.",
  ],
];

export function TradeOffs() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three kinds of amplification"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {AMP.map(([t, d], i) => (
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
          <div className="border-accent/40 bg-accent-soft rounded-lg border px-3 py-2 text-xs">
            Built on LSM trees: RocksDB (Facebook&apos;s fork of Google&apos;s LevelDB), Apache
            Cassandra, ScyllaDB, CockroachDB&apos;s Pebble, TiKV (under TiDB) and MyRocks for MySQL.
          </div>
        </div>
      }
    >
      <p>
        RocksDB&apos;s tuning guide names three costs and says &ldquo;compaction is key to change
        the trade-off among the three&rdquo;. Merge eagerly and reads are cheap but writes repeat;
        merge lazily and the reverse.
      </p>
      <p>
        The payoff can be big. At Facebook, MyRocks used about half the storage of compressed InnoDB
        when it was first deployed in 2016; by 2020, instances were 62% smaller.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Why reads can be slower --------------------------------------------------------------------- */

export function WhySlower() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why reads can be slower"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="why-slower"
            prompt="Why can reading one key from an LSM tree take more work than from a B-tree?"
            options={[
              {
                id: "unsorted",
                label: "LSM files aren't sorted",
                feedback: "Each file is sorted; there are just several of them.",
              },
              {
                id: "several",
                label:
                  "The newest value could be in the memtable or in any of several files, so a read may check more than one place",
                correct: true,
                feedback:
                  "Exactly: that's read amplification. Bloom filters and compaction keep it down.",
              },
              {
                id: "disk",
                label: "LSM trees keep everything on disk, never in memory",
                feedback: "The memtable is in memory, and files are cached like any other.",
              },
              {
                id: "locks",
                label: "Readers must wait for compaction to finish",
                feedback: "Files are immutable, so reads and compaction can run side by side.",
              },
            ]}
            explanation="LSM trees trade some read work for very cheap writes; compaction and Bloom filters claw it back."
          />
        </div>
      }
    >
      <p>Remember the order pad, the tray and the cabinet.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Write to memory first", "Then flush sorted, immutable files."],
  ["Compaction merges", "Newest value wins; tombstones finally vanish."],
  ["Reads check newest first", "Memtable, then files, level by level."],
  ["Bloom filters skip files", "For single-key lookups."],
  ["Choose your amplification", "Write, read and space trade off."],
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
      <p>
        Next: indexes for questions B-trees can&apos;t answer well, like words in text or similar
        images.
      </p>
    </StepLayout>
  );
}

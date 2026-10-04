"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ACTIONS, CACHED_GB, LEVELS, MEMS, MORE, times, type Level } from "./model";
import type { CacheState } from "./state";

/* 1 ─ Make the stock once ------------------------------------------------------------------------- */

export function Stock() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Make the stock once"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "Every soup from scratch",
              "Boil bones for six hours, make the soup. Next soup? Boil bones for six hours again.",
              "border-line bg-surface",
            ],
            [
              "Stock in the fridge",
              "Boil once, keep the stock, and every soup after that takes twenty minutes. Until the fridge is full.",
              "border-viz-meta bg-viz-meta/10",
            ],
          ].map(([t, d, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * i }}
              className={cn("rounded-xl border px-4 py-3", c)}
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A kitchen that makes three soups from the same stock doesn&apos;t boil bones three times. It
        makes the stock once and keeps it in the fridge.
      </p>
      <p>
        Spark is lazy (module 4): every action rebuilds its DataFrame from the source. If several
        actions use the same expensive result, you can <Term id="cache-spark">cache</Term> it, so
        Spark keeps it in executor memory (or on disk) after the first time.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Reuse without recomputing ⭐ ---------------------------------------------------------------- */

export function CacheSim() {
  const [s, set] = useSceneState<CacheState>();
  const memGb = MEMS[s.mem];
  const t = times(s.level, memGb);
  const none = times("none", memGb);
  const max = Math.max(...none.each);
  const levels: [Level, string][] = [
    ["none", "no cache"],
    ["MEMORY_ONLY", "MEMORY_ONLY"],
    ["MEMORY_AND_DISK", "MEMORY_AND_DISK"],
    ["DISK_ONLY", "DISK_ONLY"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Reuse without recomputing"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`clean = (spark.read.parquet("events/")          # 200 GB
           .join(users, "user_id").filter(...))     # ${CACHED_GB} GB result
${s.level === "none" ? "# no cache" : s.level === "MEMORY_AND_DISK" ? "clean.cache()   # = persist(MEMORY_AND_DISK)" : `clean.persist(StorageLevel.${s.level})`}
clean.count(); report(clean); train(clean)`}</Code>
          <div className="flex flex-col gap-1.5 text-xs">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-32">storage level</span>
              {levels.map(([l, n]) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={s.level === l}
                  onClick={() => set({ level: l })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                    s.level === l ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-muted w-32">cluster storage memory</span>
              {MEMS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={s.mem === i}
                  onClick={() => set({ mem: i })}
                  className={cn(
                    "rounded-md border px-2 py-0.5 font-mono text-[11px]",
                    s.mem === i ? "border-accent bg-accent-soft" : "border-line",
                  )}
                >
                  {m} GB
                </button>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface flex flex-col gap-1.5 rounded-xl border px-3 py-3">
            {ACTIONS.map((a, i) => (
              <div key={a} className="flex items-center gap-2 text-[11px]">
                <span className="w-32 font-mono">{a}</span>
                <div className="bg-surface-2 h-3 flex-1 overflow-hidden rounded">
                  <motion.div
                    animate={{ width: `${(t.each[i] / max) * 100}%` }}
                    className={cn(
                      "h-full",
                      i > 0 && s.level !== "none" ? "bg-viz-meta" : "bg-viz-compute",
                    )}
                  />
                </div>
                <span className="w-14 text-right font-mono">{t.each[i].toFixed(1)} min</span>
              </div>
            ))}
            <p className="mt-1 text-xs">
              Total <span className="font-mono font-semibold">{t.total.toFixed(1)} min</span>
              {s.level !== "none" && (
                <span className="text-good"> (vs {none.total.toFixed(0)} min uncached)</span>
              )}
            </p>
          </div>
          {s.level !== "none" && (
            <div className="text-muted flex flex-wrap gap-x-4 text-[11px]">
              <span className="font-semibold">Storage tab:</span>
              <span>in memory {t.memPct}%</span>
              <span>on disk {t.diskPct}%</span>
              {s.level === "MEMORY_ONLY" && t.memPct < 100 && (
                <span className="text-bad">
                  {100 - t.memPct}% not cached: recomputed every time
                </span>
              )}
            </div>
          )}
          <p className="text-subtle text-[10px]">Times and sizes illustrative.</p>
        </div>
      }
    >
      <p>
        Three actions use the same cleaned-up DataFrame. Without a cache, each one reads 200 GB and
        redoes the join. With one, the first action pays a little extra to store the result; the
        others reuse it.
      </p>
      <p>
        Shrink the memory and compare <Term id="storage-level">storage levels</Term>. With
        MEMORY_ONLY, partitions that don&apos;t fit are rebuilt every time. MEMORY_AND_DISK puts the
        overflow on local disk instead. That&apos;s why it&apos;s the default for DataFrames.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Storage levels ------------------------------------------------------------------------------ */

export function Levels() {
  const [s, set] = useSceneState<CacheState>();
  const l = LEVELS[s.pick] ?? LEVELS[1];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Storage levels"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((x, i) => (
              <button
                key={x.id}
                type="button"
                aria-pressed={s.pick === i}
                onClick={() => set({ pick: i })}
                className={cn(
                  "rounded-full border px-3 py-1 font-mono text-[11px]",
                  s.pick === i ? "border-accent bg-accent-soft" : "border-line",
                )}
              >
                {x.id}
              </button>
            ))}
          </div>
          <motion.div
            key={l.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border px-4 py-3 text-xs"
          >
            <p className="font-mono text-sm font-semibold">{l.id}</p>
            <div className="text-muted mt-1 grid grid-cols-2 gap-1">
              <span>stored in: {l.where}</span>
              <span>if it doesn&apos;t fit: {l.miss}</span>
            </div>
            <p className="mt-2">{l.note}</p>
          </motion.div>
          <div className="flex flex-col gap-1">
            {MORE.map(([k, d]) => (
              <div key={k} className="border-line rounded-lg border px-3 py-1.5 text-[11px]">
                <span className="font-mono">{k}</span>
                <span className="text-muted"> · {d}</span>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        <code>cache()</code> is shorthand for <code>persist()</code> with the default level.{" "}
        <code>persist(level)</code> lets you choose: memory or disk, objects or serialised bytes,
        one copy or two.
      </p>
      <p>
        The default differs: MEMORY_ONLY for RDDs, MEMORY_AND_DISK for DataFrames (adjustable since
        Spark 4.0 with <code>spark.sql.defaultCacheStorageLevel</code>). Whatever the level, a lost
        partition is simply rebuilt from its lineage.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Lazy, and easy to forget -------------------------------------------------------------------- */

export function LazyLeaky() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Lazy, and easy to forget"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Code>{`clean.cache()          # nothing happens yet: it's only marked
clean.count()          # first action: computes AND fills the cache
clean.groupBy(...)...  # reads from the cache

clean.unpersist()      # free it (doesn't wait, unless blocking=True)

-- SQL
CACHE TABLE clean_t            -- eager: caches now
CACHE LAZY TABLE clean_t       -- waits for first use
UNCACHE TABLE clean_t`}</Code>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Forgotten caches</p>
              <p className="text-muted">
                Cached data takes storage memory until you unpersist it, or Spark drops the
                least-recently-used blocks to make room.
              </p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2 text-xs">
              <p className="font-semibold">Shared</p>
              <p className="text-muted">
                Cached data is shared by all sessions on the cluster, so unpersisting affects
                everyone using it.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        <code>cache()</code> is lazy, like a transformation: it marks the DataFrame, and the first
        action fills the cache. SQL&apos;s <code>CACHE TABLE</code> is the exception: it caches
        straight away unless you add LAZY.
      </p>
      <p>
        When you&apos;re done, call <code>unpersist()</code>. The Spark UI&apos;s Storage tab shows
        what&apos;s cached, its level and how much of it fits.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Cache it? ----------------------------------------------------------------------------------- */

export function CacheIt() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Cache it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="cache-it"
            prompt="Is caching worth it here?"
            categories={[
              { id: "yes", label: "Cache" },
              { id: "no", label: "Don't bother" },
            ]}
            items={[
              {
                id: "reports",
                label: "An expensive join result used by five reports in the same job",
                category: "yes",
                why: "Computed once, reused four times.",
              },
              {
                id: "once",
                label: "A DataFrame read once and written once",
                category: "no",
                why: "No reuse, so caching only costs memory.",
              },
              {
                id: "ml",
                label: "Training data an algorithm passes over 50 times",
                category: "yes",
                why: "Iterative jobs are what caching was made for.",
              },
              {
                id: "cheap",
                label: "A cheap filter on a Parquet table, used twice",
                category: "no",
                why: "Recomputing may be as fast as reading a cache from disk.",
              },
              {
                id: "notebook",
                label: "A cleaned dataset you'll explore with many queries in a notebook",
                category: "yes",
                why: "Each query would otherwise redo the cleaning.",
              },
            ]}
            explanation="Cache what is reused and expensive to rebuild; skip what is used once or cheap to recompute."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Reused and expensive", "That's when to cache."],
  ["Lazy", "Filled by the first action (CACHE TABLE is eager)."],
  ["Defaults differ", "RDD: MEMORY_ONLY. DataFrame: MEMORY_AND_DISK, columnar."],
  ["Clean up", "unpersist(); otherwise LRU eviction."],
  ["Safe", "Lost partitions are rebuilt from lineage."],
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
        Next: reading and writing files well, from formats and compression to partitioned layouts.
      </p>
    </StepLayout>
  );
}

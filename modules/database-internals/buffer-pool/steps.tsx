"use client";

import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FRAMES, POLICIES, simulate, type Policy } from "./model";
import type { BpState } from "./state";

/* 1 ─ The librarian's desk ------------------------------------------------------------------------ */

export function LibrarianDesk() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The librarian's desk"
      stage={
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <BookOpen className="text-accent size-8" />
          <div className="grid grid-cols-4 gap-1.5">
            {["Ramayana", "NCERT 10", "Malgudi", "Atlas", "Gita", "Panchatantra", "—", "—"].map(
              (b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className={cn(
                    "rounded-md border px-2 py-2 text-center text-[10px]",
                    b === "—"
                      ? "border-line text-subtle border-dashed"
                      : "border-accent/50 bg-accent-soft",
                  )}
                >
                  {b}
                </motion.div>
              ),
            )}
          </div>
          <p className="text-muted text-center text-xs">
            Eight spaces on the desk; the stacks are far away.
          </p>
        </div>
      }
    >
      <p>
        A librarian keeps the most requested books on the desk, and fetches the rest from the
        stacks. With eight spaces, the question is always: when a new book comes, which one goes
        back?
      </p>
      <p>
        A database&apos;s <Term id="buffer-pool">buffer pool</Term> is that desk: memory holding
        copies of recently used pages. Finding a page there is a <Term id="cache-hit">hit</Term>;
        going to storage is a miss. Then one day someone asks for every book in the archive, once.
      </p>
    </StepLayout>
  );
}

/* 2 ─ One big scan ⭐ ----------------------------------------------------------------------------- */

export function CacheSim() {
  const [s, set] = useSceneState<BpState>();
  const r = simulate(s.policy);
  const rate = (i: 0 | 1 | 2) => (r.totals[i] ? Math.round((r.hits[i] / r.totals[i]) * 100) : 0);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One big scan"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(POLICIES) as Policy[]).map((p) => (
              <button
                key={p}
                type="button"
                aria-pressed={s.policy === p}
                onClick={() => set({ policy: p })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.policy === p
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {POLICIES[p].name}
              </button>
            ))}
          </div>
          <p className="text-muted text-xs">{POLICIES[s.policy].idea}</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                ["Busy app", "120 reads of 6 hot pages", 0],
                ["Report scan", "24 pages, each read once", 1],
                ["Busy app again", "60 reads of the hot pages", 2],
              ] as [string, string, 0 | 1 | 2][]
            ).map(([t, d, i]) => (
              <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
                <p className="text-xs font-semibold">{t}</p>
                <p className="text-muted text-[10px]">{d}</p>
                <p
                  className={cn(
                    "mt-1 font-mono text-lg font-semibold",
                    i === 2 && rate(2) < 95 ? "text-bad" : "",
                  )}
                >
                  {rate(i)}%
                </p>
                <p className="text-muted text-[10px]">hit rate</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-muted mb-1 text-[10px]">
              The pool at the end of the scan ({FRAMES} frames)
            </p>
            <div className="grid grid-cols-8 gap-1">
              {Array.from({ length: FRAMES }, (_, i) => {
                const lost = r.lostHot;
                const hot = s.policy === "ring" ? i < 6 : i >= 2 && i < 8 && lost === 0;
                return (
                  <motion.div
                    key={`${s.policy}-${i}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.03 * i }}
                    className={cn(
                      "rounded py-1.5 text-center font-mono text-[10px]",
                      hot
                        ? "bg-good/30"
                        : s.policy === "ring"
                          ? "bg-surface-2"
                          : "bg-viz-compute/30",
                    )}
                  >
                    {s.policy === "ring" ? (i < 6 ? "hot" : "—") : "scan"}
                  </motion.div>
                );
              })}
            </div>
          </div>
          <p
            className={cn(
              "rounded-lg border px-3 py-2 text-sm",
              r.lostHot ? "border-bad/50 bg-bad/5" : "border-good/50 bg-good/5",
            )}
          >
            {r.lostHot
              ? `The scan pushed out all ${r.lostHot} hot pages. The app's next reads miss until they're fetched back from storage.`
              : "The scan cycled through its own two frames. Every hot page survived, and the app never noticed."}
          </p>
          <p className="text-subtle text-[10px]">Illustrative workload and pool size.</p>
        </div>
      }
    >
      <p>
        A busy app keeps reading the same six pages. Then a report scans 24 pages it will never read
        again. Compare three ways of choosing what to <Term id="eviction">evict</Term>.
      </p>
      <p>
        Plain LRU and clock sweep both let a big one-off scan flush the pages everyone needs.
        PostgreSQL&apos;s answer is to give large sequential scans a small ring of buffers of their
        own (256 kB to start with), so they can&apos;t trample the shared pool.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Dirty pages --------------------------------------------------------------------------------- */

export function DirtyPages() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Dirty pages"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "A write changes the page in memory",
              "The copy in the buffer pool is now newer than the one on disk: it's dirty.",
            ],
            [
              "Writing it back can wait",
              "The change is already safe in the write-ahead log (module 13), so the page can be flushed later, in bulk.",
            ],
            [
              "Background helpers do most of it",
              "PostgreSQL's background writer and checkpointer, InnoDB's page cleaner threads. Queries sometimes have to write a dirty page themselves before reusing its frame.",
            ],
            [
              "Before eviction, flush",
              "A dirty page must be written out before its frame can hold another page.",
            ],
          ].map(([t, d], i) => (
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
        The buffer pool isn&apos;t only for reading. Changes are made to the copy in memory, which
        becomes a <Term id="dirty-page">dirty page</Term>, and written back to storage later.
      </p>
      <p>
        That&apos;s how a database can accept thousands of small changes a second without thousands
        of random disk writes: it batches them, relying on the log for safety in between.
      </p>
    </StepLayout>
  );
}

/* 4 ─ How real engines do it ---------------------------------------------------------------------- */

export function RealPools() {
  return (
    <StepLayout
      eyebrow="Compare"
      title="How real engines do it"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "PostgreSQL",
              "shared_buffers, default 128 MB. A starting point of 25% of RAM on a dedicated server; beyond about 40% rarely helps, because PostgreSQL also relies on the operating system's cache. Eviction by clock sweep, usage counts capped at 5.",
            ],
            [
              "MySQL InnoDB",
              "The buffer pool often gets “up to 80% of physical memory” on a dedicated server. A variation of LRU with midpoint insertion: new pages enter an “old” sublist (3/8 of the pool) and move to the “young” part only if read again.",
            ],
          ].map(([t, d]) => (
            <div key={t} className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted text-xs">{d}</p>
            </div>
          ))}
          <Code>{`EXPLAIN (ANALYZE, BUFFERS) SELECT … ;
  Buffers: shared hit=1204 read=36
  -- hit: found in shared buffers
  -- read: not there (may still come from the OS cache)`}</Code>
        </div>
      }
    >
      <p>
        Both engines solve the scan problem in their own way: PostgreSQL with rings for big scans,
        InnoDB by making new pages prove themselves before joining the hot part of the list. The
        research behind them goes back to LRU-K (1993) and 2Q (1994).
      </p>
      <p>
        You can watch the pool at work. EXPLAIN with BUFFERS counts hits and reads for a query (and
        PostgreSQL 18 includes it with ANALYZE automatically); the pg_buffercache extension shows
        what&apos;s in the pool right now.
      </p>
    </StepLayout>
  );
}

/* 5 ─ The slow morning ---------------------------------------------------------------------------- */

export function WhySlow() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="The slow morning"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="why-slow"
            prompt="A database with simple LRU caching runs a nightly report that scans a huge table. Every morning the app is slow for the first half hour, then recovers. What's the most likely cause?"
            options={[
              {
                id: "disk",
                label: "The disk wears out a little more every night",
                feedback: "Hardware doesn't recover every morning.",
              },
              {
                id: "flush",
                label:
                  "The scan pushed the app's hot pages out of memory, so early requests miss and read from storage until the cache warms up again",
                correct: true,
                feedback:
                  "Exactly: a cache flushed by a one-off scan. Scan-resistant eviction or scan rings prevent it.",
              },
              {
                id: "locks",
                label: "The report holds locks all night",
                feedback: "It finished hours ago; locks are released when it ends.",
              },
              {
                id: "network",
                label: "Morning traffic overloads the network",
                feedback:
                  "Possible in general, but it doesn't explain the link to the nightly scan.",
              },
            ]}
            explanation="A big one-off read can evict the working set; the cost shows up as misses afterwards."
          />
        </div>
      }
    >
      <p>Every morning, the same pattern.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Memory holds hot pages", "Hits are cheap; misses go to storage."],
  ["Eviction policy matters", "LRU, clock sweep and their refinements."],
  ["Big scans flush caches", "Rings and midpoint insertion protect the hot set."],
  ["Dirty pages wait", "Written back later, safely, thanks to the log."],
  ["Measure it", "EXPLAIN BUFFERS: hit versus read."],
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
      <p>Next chapter: indexes, starting with the B-tree.</p>
    </StepLayout>
  );
}

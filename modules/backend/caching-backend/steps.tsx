"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { metrics, type Ttl } from "./model";
import type { CacheState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Board() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The specials board"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {[
            [
              "Ask the chef every time",
              "Accurate, but the chef gets nothing else done and customers wait.",
            ],
            [
              "Write it on a board",
              "Instant for everyone. The danger: the board still says “samosas” after they've run out.",
            ],
          ].map(([t, b], i) => (
            <div
              key={t}
              className={cn(
                "rounded-xl border p-3 text-xs",
                i ? "border-good/50 bg-good/10" : "border-line bg-surface",
              )}
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </div>
          ))}
        </div>
      }
    >
      <p>
        A café could send every customer to ask the chef what&apos;s on today. Writing it on a board
        is much faster, as long as someone wipes the board when things change.
      </p>
      <p>
        A <Term id="cache">cache</Term> is that board: a copy of slow-to-compute data kept in fast
        memory. The hard parts are keeping it fresh and handling the moment it&apos;s wiped.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

export function Simulate() {
  const [s, set] = useSceneState<CacheState>();
  const m = metrics(s.ttl, s.invalidate, s.coalesce);
  const cached = s.ttl !== "none";
  const stats: [string, string, boolean][] = [
    ["Cache hit rate", `${m.hit}%`, m.hit > 90],
    ["Typical response", `${m.latency} ms`, m.latency < 10],
    ["Database queries a minute", `${m.dbPerMin.toLocaleString("en-IN")}`, m.dbPerMin < 100],
    [
      "Old price shown after a change",
      cached && m.stale ? `up to ${m.stale} s` : "never",
      m.stale === 0,
    ],
    [
      "Queries when the entry expires at peak",
      cached ? `${m.stampede}` : "n/a",
      !cached || m.stampede === 1,
    ],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Put a cache in front of the menu"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted">Cache lifetime</span>
            <Segmented<Ttl>
              size="sm"
              value={s.ttl}
              onChange={(ttl) => set({ ttl })}
              options={[
                ["none", "No cache"],
                ["60", "1 minute"],
                ["3600", "1 hour"],
              ]}
            />
          </div>
          <label className={cn("flex items-center gap-2 text-xs", !cached && "opacity-40")}>
            <input
              type="checkbox"
              disabled={!cached}
              checked={s.invalidate}
              onChange={() => set({ invalidate: !s.invalidate })}
            />
            Delete the cached menu whenever a price changes
          </label>
          <label className={cn("flex items-center gap-2 text-xs", !cached && "opacity-40")}>
            <input
              type="checkbox"
              disabled={!cached}
              checked={s.coalesce}
              onChange={() => set({ coalesce: !s.coalesce })}
            />
            When the entry expires, let one request rebuild it while others wait
          </label>
          <div className="grid gap-1">
            {stats.map(([l, v, ok]) => (
              <motion.div
                key={l}
                layout
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs",
                  ok ? "border-good/50 bg-good/10" : "border-bad/40 bg-bad/10",
                )}
              >
                <span>{l}</span>
                <span className="font-mono font-semibold">{v}</span>
              </motion.div>
            ))}
          </div>
        </div>
      }
    >
      <p>
        The café&apos;s menu query takes 200 ms and runs 100 times a second. Add a cache, choose how
        long entries live, and deal with the two classic problems: stale data and the{" "}
        <Term id="cache-stampede">stampede</Term> when a popular entry expires.
      </p>
      <p>Numbers are illustrative. Aim for all green.</p>
    </StepLayout>
  );
}

/* 3 ─ Patterns ------------------------------------------------------------------------------------- */

export function Patterns() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Cache-aside and friends"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Cache-aside",
              "Read the cache; on a miss, read the database and store the result. The most common pattern.",
            ],
            [
              "On writes, delete, don't update",
              "Removing the entry avoids races where an old value overwrites a new one.",
            ],
            [
              "Write-through and write-behind",
              "Write to the cache and database together, or the cache first and the database later (riskier).",
            ],
            [
              "Cache “not found” briefly",
              "Stops repeated lookups for missing items hammering the database.",
            ],
            [
              "Pick an eviction policy",
              "Redis's default, noeviction, refuses new writes when memory is full; choose LRU or LFU for a cache.",
            ],
            [
              "Per-user data needs per-user keys",
              "Never cache one customer's data under a shared key.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Every lifetime you set is a decision about how stale data may be. A one-hour menu cache is
        fine if prices rarely change and you delete it when they do.
      </p>
      <p>
        Measure the hit rate: a cache that rarely hits only adds latency and another thing to run.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Tools, licences and stampede tricks"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Redis",
              "Source-available from 2024; since Redis 8 (May 2025) also available under the open-source AGPL.",
            ],
            [
              "Valkey",
              "The Linux Foundation's BSD-licensed fork (March 2024); version 9.1 in May 2026. Offered by AWS, Google Cloud and others.",
            ],
            ["Memcached", "Simple, fast, multithreaded; no persistence or rich types."],
            [
              "Request coalescing",
              "One rebuild per key; Go's singleflight package does exactly this.",
            ],
            [
              "Early refresh and jitter",
              "Refresh popular entries a little before they expire (the XFetch method, 2015) and randomise lifetimes so they don't all expire together.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <span className="font-semibold">{t}</span>
              <span className="text-muted"> · {b}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        An in-process cache (a map inside your service) is fastest but separate for every instance.
        A shared cache like Redis or Valkey keeps every instance in step.
      </p>
      <p>Check licences when choosing: they changed more than once in 2024–25.</p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function CacheCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Cache it or not?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="backend-caching"
            prompt="Should each be cached?"
            categories={[
              { id: "yes", label: "Cache it" },
              { id: "no", label: "Don't, or be very careful" },
            ]}
            items={[
              {
                id: "menu",
                label: "Today's menu, the same for everyone",
                category: "yes",
                why: "Read often, changes rarely.",
              },
              {
                id: "basket",
                label: "A customer's basket, under the key “basket”",
                category: "no",
                why: "Shared key: one customer would see another's basket.",
              },
              {
                id: "notfound",
                label: "“No such item” for an id that doesn't exist, for 30 seconds",
                category: "yes",
                why: "Negative caching protects the database.",
              },
              {
                id: "payment",
                label: "Whether a payment has gone through",
                category: "no",
                why: "Must be current; a stale answer causes double charges or refunds.",
              },
              {
                id: "rates",
                label: "Exchange rates refreshed hourly",
                category: "yes",
                why: "Fresh enough, and expensive to fetch.",
              },
            ]}
            explanation="Cache data that's read often, changes rarely and can be slightly stale. Keep per-user data under per-user keys, and don't cache answers that must be exact right now."
          />
        </div>
      }
    >
      <p>Sort each item.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["A cache is a copy", "Fast, and possibly stale."],
        ["Delete on change", "Don't wait for expiry."],
        ["Tame the stampede", "One rebuild per key, jittered lifetimes."],
        ["Right data, right keys", "Never share per-user data."],
        ["Measure hit rate", "Remove caches that don't help."],
      ]}
    >
      <p>That ends the data chapter. Next: how users prove who they are.</p>
    </WrapStep>
  );
}

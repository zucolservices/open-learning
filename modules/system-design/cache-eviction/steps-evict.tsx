"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { evictionSim, type Policy } from "./sim";
import type { EvictionState } from "./state";

/* 1 ─ What to throw out? ⭐ ---------------------------------------------------------------------- */

const CAPS = [50, 100, 200];
const POLICIES: [Policy, string, string][] = [
  ["lru", "LRU", "Throw out the item unused for longest."],
  ["lfu", "LFU", "Throw out the item used least often."],
  ["random", "Random", "Throw out any item."],
];

export function WhatToThrowOut() {
  const [s, set] = useSceneState<EvictionState>();
  const { policy, capacity, scan, shift } = s;
  const r = useMemo(
    () => evictionSim(policy, CAPS[capacity], scan, shift),
    [policy, capacity, scan, shift],
  );
  const W = 300;
  const H = 100;
  const x = (i: number) => 28 + (i / (r.window.length - 1)) * (W - 36);
  const y = (v: number) => H - 10 - v * (H - 20);
  const path = r.window.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(v)}`).join(" ");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="What to throw out?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-3 gap-1.5">
            {POLICIES.map(([id, label, how]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ policy: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left",
                  policy === id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-semibold">{label}</span>
                <span className="text-muted block text-[10px] leading-snug">{how}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Cache holds</span>
            <Segmented
              size="sm"
              value={String(capacity)}
              options={CAPS.map((c, i) => [String(i), `${c} of 1,000 items`] as [string, string])}
              onChange={(v) => set({ capacity: Number(v) })}
            />
          </div>
          <div className="flex flex-wrap gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={scan}
                onChange={(e) => set({ scan: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              A crawler reads thousands of one-off pages
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shift}
                onChange={(e) => set({ shift: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Halfway, different items become popular
            </label>
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <div className="flex items-baseline justify-between">
              <p className="text-muted text-[11px]">Hit ratio over time (per 1,000 requests)</p>
              <motion.p
                key={r.hitRatio.toFixed(3)}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg"
              >
                {(r.hitRatio * 100).toFixed(1)}%
              </motion.p>
            </div>
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto mt-1 w-full max-w-lg"
              role="img"
              aria-label="Hit ratio over time"
            >
              {scan && (
                <rect
                  x={x(10)}
                  y={4}
                  width={x(13) - x(10)}
                  height={H - 14}
                  fill="var(--bad)"
                  opacity={0.12}
                />
              )}
              {shift && (
                <line
                  x1={x(15)}
                  x2={x(15)}
                  y1={4}
                  y2={H - 10}
                  stroke="var(--viz-meta)"
                  strokeDasharray="3 3"
                />
              )}
              {[0, 0.5, 1].map((v) => (
                <g key={v}>
                  <line
                    x1={10}
                    x2={W - 10}
                    y1={y(v)}
                    y2={y(v)}
                    stroke="var(--line)"
                    strokeWidth={0.5}
                  />
                  <text x={24} y={y(v) + 3} textAnchor="end" className="fill-subtle text-[7px]">
                    {v * 100}%
                  </text>
                </g>
              ))}
              <motion.path
                key={policy + capacity + scan + shift}
                d={path}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={2}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <p className="text-subtle text-[10px]">
              {scan && "Shaded: the crawler. "}
              {shift && "Dashed: popularity changes."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        A cache is small, so when it&apos;s full something must go. Like clearing a fridge: throw
        out what you haven&apos;t touched in ages, or what you rarely eat? That choice is the{" "}
        <Term id="eviction">eviction policy</Term>.
      </p>
      <p>
        Try each policy, then turn on the crawler and the popularity change. Neither policy wins
        everywhere.
      </p>
      <p className="text-muted text-sm">
        LRU is flushed by one-off scans; LFU clings to yesterday&apos;s favourites. Modern caches
        blend the two: Caffeine&apos;s W-TinyLFU, Memcached&apos;s segmented LRU, and newer ideas
        like SIEVE (2024).
      </p>
    </StepLayout>
  );
}

/* 2 ─ Checkpoint: Redis out of memory --------------------------------------------------------- */

export function RedisOomCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why did Redis stop accepting writes?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="redis-oom"
            prompt="A Redis/Valkey cache hits its memory limit and starts rejecting writes with out-of-memory errors. Its policy is volatile-lru. The app never sets TTLs. Why isn't it evicting?"
            options={[
              {
                id: "volatile",
                label:
                  "volatile-* policies only evict keys that have a TTL; with none, it behaves like noeviction",
                correct: true,
                feedback:
                  "Right. Either set TTLs on cached keys or switch to allkeys-lru / allkeys-lfu.",
              },
              {
                id: "full",
                label: "LRU never evicts; it only reorders keys",
                feedback: "LRU does evict. The catch is which keys it's allowed to consider.",
              },
              {
                id: "memory",
                label: "The server simply needs more memory",
                feedback: "More memory only delays the same problem.",
              },
              {
                id: "bug",
                label: "It's a bug in Redis",
                feedback: "It's documented behaviour, and a very common surprise.",
              },
            ]}
            explanation="Defaults differ: self-run Redis and Valkey start with noeviction (writes fail when full); AWS ElastiCache starts with volatile-lru. Know which one you're running."
          />
        </div>
      }
    >
      <p>
        Redis and Valkey let you choose the policy with <code>maxmemory-policy</code>: LRU or LFU,
        over all keys or only keys with a TTL (&ldquo;volatile&rdquo;). Both approximate: they
        sample a few keys and evict the best candidate among them.
      </p>
    </StepLayout>
  );
}

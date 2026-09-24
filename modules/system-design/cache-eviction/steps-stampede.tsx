"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { expiryHistogram, stampede, type Mitigation } from "./sim";
import type { EvictionState } from "./state";

/* 3 ─ The thundering herd ⭐ --------------------------------------------------------------------- */

const MITIGATIONS: [Mitigation, string, string, string][] = [
  [
    "none",
    "Nothing",
    "Every request that misses queries the database.",
    "if (!cache.get(key)) cache.set(key, db.query(...))",
  ],
  [
    "coalesce",
    "Coalesce",
    "Requests for the same key wait for one in-flight query (per server).",
    "singleflight.Do(key, () => db.query(...))  // Go\nproxy_cache_lock on;                       # NGINX",
  ],
  [
    "early",
    "Refresh early",
    "One request refreshes a little before expiry, chosen at random (XFetch).",
    "if now - delta * beta * log(rand()) >= expiry:\n    recompute()   # before anyone misses",
  ],
  [
    "swr",
    "Serve stale",
    "Keep serving the old value while one request refreshes in the background.",
    "Cache-Control: max-age=60, stale-while-revalidate=30",
  ],
  [
    "lease",
    "Leases",
    "The cache lets one client refill the key; others wait briefly and retry.",
    "value, lease = cache.get_or_lease(key)\nif lease: cache.set_with_lease(key, db.query(...), lease)",
  ],
];

export function ThunderingHerd() {
  const [s, set] = useSceneState<EvictionState>();
  const m = s.mitigation;
  const r = useMemo(() => stampede(m), [m]);
  const info = MITIGATIONS.find((x) => x[0] === m)!;
  const max = Math.max(...r.buckets, 1);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The thundering herd"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
            {MITIGATIONS.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ mitigation: id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  m === id
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">
              Database queries for the menu, every 50 ms around its expiry
            </p>
            <div className="relative mt-2 flex h-28 items-end gap-0.5">
              {r.buckets.map((q, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ height: `${Math.max(q > 0 ? 3 : 0, (q / max) * 100)}%` }}
                  className={cn("flex-1 rounded-t-sm", r.overloaded ? "bg-bad/70" : "bg-viz-data")}
                />
              ))}
              <div
                className="border-subtle absolute inset-y-0 border-l border-dashed"
                style={{ left: `${(10 / 30) * 100}%` }}
              />
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[9px]">
              <span>−0.5 s</span>
              <span>expiry</span>
              <span>+1 s</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Database queries"
              value={r.queries.toLocaleString("en-US")}
              bad={r.overloaded}
            />
            <Stat
              label="Users wait (worst)"
              value={r.userWaitMs ? `${(r.userWaitMs / 1000).toFixed(1)} s` : "0 s"}
              bad={r.userWaitMs > 1000}
            />
            <Stat
              label="Stale served for"
              value={r.staleServedS ? `${r.staleServedS} s` : "none"}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={m}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid gap-2"
            >
              <p
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm",
                  r.overloaded ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
                )}
              >
                {r.overloaded
                  ? `1,000 identical queries hit a database that handles ${r.dbLimit} at once. It slows down, so more requests miss, so it slows down more.`
                  : info[2]}
              </p>
              <Code>{info[3]}</Code>
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-xs">
            Illustrative: 2,000 requests/s for one popular key, 20 app servers, a 500 ms query, a
            database comfortable with 200 concurrent queries.
          </p>
        </div>
      }
    >
      <p>
        Brewline&apos;s menu is cached and read 2,000 times a second. The moment it expires, every
        request misses, and each one asks the database for the same thing. That&apos;s a{" "}
        <Term id="stampede">cache stampede</Term>, or thundering herd.
      </p>
      <p>Try each defence. They trade a little freshness or waiting for a lot less load.</p>
      <p className="text-muted text-sm">
        Leases, from Facebook&apos;s memcache paper, cut peak database queries there from 17,000/s
        to 1,300/s. &ldquo;Refresh early&rdquo; is the XFetch rule from a 2015 VLDB paper.
      </p>
    </StepLayout>
  );
}

function Stat({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border px-3 py-2",
        bad ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
      )}
    >
      <p className="text-muted text-[10px]">{label}</p>
      <motion.p
        key={value}
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 1 }}
        className="font-mono text-sm"
      >
        {value}
      </motion.p>
    </div>
  );
}

/* 4 ─ Everything expires at once ------------------------------------------------------------------ */

const JITTERS = [0, 5, 10, 20];

export function Jitter() {
  const [s, set] = useSceneState<EvictionState>();
  const hist = useMemo(() => expiryHistogram(JITTERS[s.jitter]), [s.jitter]);
  const max = Math.max(...hist);
  const scale = 10_000; // fixed, so spreading shows as shrinking
  return (
    <StepLayout
      eyebrow="Another herd"
      title="Everything expires at once"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Random jitter on each TTL</span>
            <Segmented
              size="sm"
              value={String(s.jitter)}
              options={JITTERS.map((j, i) => [String(i), `±${j}%`] as [string, string])}
              onChange={(v) => set({ jitter: Number(v) })}
            />
          </div>
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[11px]">
              10,000 keys filled at the same moment, TTL 60 minutes: expiries per minute
            </p>
            <div className="mt-2 flex h-32 items-end gap-0.5">
              {hist.map((n, i) => (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ height: `${Math.max(n > 0 ? 2 : 0, (n / scale) * 100)}%` }}
                  className={cn("flex-1 rounded-t-sm", n > 2000 ? "bg-bad/70" : "bg-viz-data")}
                />
              ))}
            </div>
            <div className="text-subtle mt-1 flex justify-between text-[9px]">
              <span>45 min</span>
              <span>60 min</span>
              <span>75 min</span>
            </div>
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              max > 2000 ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {max > 2000
              ? "After a deploy or restart warms the cache all at once, every key expires in the same minute: 10,000 misses together."
              : `The same misses, spread over ${Math.round((JITTERS[s.jitter] * 2 * 60) / 100)} minutes: at most ${max.toLocaleString("en-US")} a minute.`}
          </p>
        </div>
      }
    >
      <p>
        Stampedes also happen across many keys. A cache warmed all at once (after a deploy, restart
        or bulk import) expires all at once.
      </p>
      <p className="text-muted text-sm">
        The fix is one line: add a little randomness to each TTL, called{" "}
        <Term id="jitter">jitter</Term>. The same trick spreads out retries, which you&apos;ll meet
        later.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Hot keys ------------------------------------------------------------------------------------ */

const HOT: Record<EvictionState["hotFix"], { loads: number[]; text: string }> = {
  none: {
    loads: [96, 12, 10, 11],
    text: "The menu lives on node 1, and a third of all traffic asks for it. Node 1 is flat out while the others idle.",
  },
  local: {
    loads: [22, 12, 10, 11],
    text: "Each app server keeps the menu in its own memory for a few seconds. Most reads never reach the cache cluster.",
  },
  copies: {
    loads: [30, 30, 29, 31],
    text: "The menu is stored under four keys (menu#1…menu#4) on different nodes; readers pick one at random. The client must update every copy.",
  },
};

export function HotKeys() {
  const [s, set] = useSceneState<EvictionState>();
  const h = HOT[s.hotFix];
  return (
    <StepLayout
      eyebrow="Another bottleneck"
      title="Hot keys"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.hotFix}
            options={[
              ["none", "One key, one node"],
              ["local", "Local in-memory copy"],
              ["copies", "Several copies"],
            ]}
            onChange={(v) => set({ hotFix: v as EvictionState["hotFix"] })}
          />
          <div className="border-line bg-surface grid grid-cols-4 items-end gap-3 rounded-xl border p-4">
            {h.loads.map((l, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="bg-surface-2 flex h-28 w-full items-end overflow-hidden rounded">
                  <motion.div
                    initial={false}
                    animate={{ height: `${l}%` }}
                    className={cn("w-full", l > 85 ? "bg-bad/70" : "bg-viz-add")}
                  />
                </div>
                <span className="text-muted text-[10px]">node {i + 1}</span>
                <span className="font-mono text-[10px]">{l}% CPU</span>
              </div>
            ))}
          </div>
          <p
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              h.loads[0] > 85 ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
            )}
          >
            {h.text}
          </p>
        </div>
      }
    >
      <p>
        A cache cluster spreads keys across nodes. That works until one key is far more popular than
        the rest: a <Term id="hot-key">hot key</Term>. Then its node does all the work.
      </p>
      <p className="text-muted text-sm">
        Tools can find them (<code>--hotkeys</code> in Redis and Valkey, with an LFU policy).
        Illustrative loads.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Checkpoint ------------------------------------------------------------------------------- */

export function HerdCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the defence"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="herd-defence"
            prompt="The home page's 'trending coffees' list is read 5,000 times a second and takes 2 seconds to compute. Being a few seconds out of date is fine; making users wait is not. Which defence fits best?"
            options={[
              {
                id: "swr",
                label: "Serve the stale list while one request refreshes it in the background",
                correct: true,
                feedback:
                  "Right. Users never wait, only one computation runs, and a few seconds of staleness is acceptable here.",
              },
              {
                id: "coalesce",
                label: "Coalesce requests so only one computes it",
                feedback: "It stops the herd, but everyone waiting still waits 2 seconds.",
              },
              {
                id: "longer",
                label: "Increase the TTL to a day",
                feedback:
                  "Fewer stampedes, but 'trending' would be a day old, and the one that happens is just as bad.",
              },
              {
                id: "none",
                label: "Nothing: the cache already absorbs the load",
                feedback: "Until the moment it expires. Then 10,000 requests compute it at once.",
              },
            ]}
            explanation="If stale-for-a-moment is fine, serve stale and refresh in the background. If it isn't, coalesce or use leases, and accept a short wait."
          />
        </div>
      }
    >
      <p>Match the defence to what the data can tolerate.</p>
    </StepLayout>
  );
}

/* 7 ─ Tools ------------------------------------------------------------------------------------ */

const TOOLS: [string, string][] = [
  [
    "Redis & Valkey",
    "Redis became source-available in 2024 (RSAL/SSPL, plus AGPLv3 from Redis 8); the Linux Foundation's Valkey fork stayed BSD. Redis 8.6 added 'least recently modified' policies.",
  ],
  [
    "Managed caches",
    "AWS ElastiCache and Google Memorystore offer Valkey (and Redis/Memcached). Azure Cache for Redis retires in 2027–2028; Azure Managed Redis replaces it.",
  ],
  ["Memcached", "Simple and fast; a segmented LRU (hot, warm, cold) resists one-off scans."],
  [
    "In-process caches",
    "Caffeine (Java) uses W-TinyLFU, adapting between recency and frequency; many languages have similar libraries.",
  ],
  [
    "Stampede helpers",
    "Go's singleflight, NGINX's proxy_cache_lock and proxy_cache_use_stale, and stale-while-revalidate in HTTP caches and CDNs.",
  ],
];

export function Tools() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Caches you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              className="border-line bg-surface rounded-xl border px-3 py-2"
            >
              <p className="text-sm font-semibold">{t}</p>
              <p className="text-muted mt-0.5 text-xs">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        &ldquo;Redis&rdquo; now means two lines of software. When you mean either, say &ldquo;Redis
        or Valkey&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 8 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "No policy wins everywhere",
    "LRU suffers from scans; LFU from shifting popularity; modern caches blend both.",
  ],
  ["Know your defaults", "noeviction and volatile-lru both refuse to evict keys without TTLs."],
  [
    "Expiry can stampede",
    "Coalesce, refresh early, serve stale, or lease: one query instead of a thousand.",
  ],
  ["Add jitter", "Randomise TTLs so keys filled together don't expire together."],
  ["Watch for hot keys", "Copy them locally or across nodes before one node melts."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          {TAKEAWAYS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-xl border px-4 py-3"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted mt-1 text-sm">{d}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>That completes caching.</p>
      <p>Next chapter: data at scale, starting with copies of the database itself.</p>
    </StepLayout>
  );
}

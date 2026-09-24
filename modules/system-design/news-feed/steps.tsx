"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { FEED_READS_PER_S, THRESHOLDS, evaluate } from "./model";
import type { FeedState } from "./state";

function human(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(n >= 1e7 ? 0 : 1)} million`;
  if (n >= 1e3) return `${Math.round(n / 1e3)} thousand`;
  return String(n);
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

/* 1 ─ Deliver or collect? ⭐ ------------------------------------------------------------------------- */

const FOLLOWERS = ["Ravi", "Meera", "Kabir", "Zoya", "Arjun", "Nina"];
const FOLLOWEES = ["Asha", "Dev", "Ira", "Sam", "Tara", "Leo"];

export function PushPull() {
  const [s, set] = useSceneState<FeedState>();
  const push = s.mode === "push";
  const W = 340;
  const H = 200;
  const center = { x: push ? 60 : 280, y: H / 2 };
  const others = (push ? FOLLOWERS : FOLLOWEES).map((n, i) => ({
    n,
    x: push ? 280 : 60,
    y: 22 + i * 31,
  }));
  const key = push ? s.posts : s.opens;
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Deliver or collect?"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.mode}
            options={[
              ["push", "Deliver at post time (push)"],
              ["pull", "Collect at read time (pull)"],
            ]}
            onChange={(v) => set({ mode: v as FeedState["mode"] })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox={`0 0 ${W + 24} ${H}`}
              className="mx-auto w-full max-w-md"
              role="img"
              aria-label="Posts moving between users"
            >
              {others.map((o) => (
                <line
                  key={o.n}
                  x1={center.x}
                  y1={center.y}
                  x2={o.x}
                  y2={o.y}
                  stroke="var(--line-strong)"
                />
              ))}
              {key > 0 &&
                others.map((o, i) => (
                  <motion.circle
                    key={`${key}-${o.n}`}
                    r={4}
                    fill="var(--viz-data)"
                    initial={
                      push
                        ? { cx: center.x, cy: center.y, opacity: 1 }
                        : { cx: o.x, cy: o.y, opacity: 1 }
                    }
                    animate={
                      push
                        ? { cx: o.x, cy: o.y, opacity: [1, 1, 0.9] }
                        : { cx: center.x, cy: center.y, opacity: [1, 1, 0.9] }
                    }
                    transition={{ duration: 0.9, delay: push ? i * 0.12 : 0.1 + i * 0.05 }}
                  />
                ))}
              <circle
                cx={center.x}
                cy={center.y}
                r={16}
                fill="var(--accent-soft)"
                stroke="var(--accent)"
              />
              <text
                x={center.x}
                y={center.y + 30}
                textAnchor="middle"
                className="fill-fg text-[9px]"
              >
                {push ? "Asha posts" : "Ravi reads"}
              </text>
              {others.map((o) => (
                <g key={o.n}>
                  <rect
                    x={o.x - 24}
                    y={o.y - 10}
                    width={48}
                    height={20}
                    rx={5}
                    fill="var(--surface)"
                    stroke="var(--line-strong)"
                  />
                  <text x={o.x} y={o.y + 3.5} textAnchor="middle" className="fill-fg text-[8px]">
                    {o.n}
                  </text>
                  {push && s.posts > 0 && (
                    <motion.text
                      key={s.posts}
                      x={o.x + 30}
                      y={o.y + 3.5}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="fill-muted text-[7px]"
                    >
                      {s.posts} new
                    </motion.text>
                  )}
                </g>
              ))}
            </svg>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => set(push ? { posts: s.posts + 1 } : { opens: s.opens + 1 })}
              className="bg-accent text-accent-fg rounded-full px-3 py-1.5 text-xs font-medium"
            >
              {push ? "Asha posts" : "Ravi opens his feed"}
            </button>
            <p className="text-muted text-xs">
              {push
                ? "Six copies are written, one into each follower's ready-made feed. Reading later is a single fetch."
                : "Nothing happens when people post. When Ravi opens the app, his feed asks all six accounts he follows for their latest posts and merges them."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        A newspaper can be delivered to every subscriber&apos;s door each morning, or each reader
        can walk to the newsstand and pick up what they want. Delivery is work up front; the
        newsstand is work when you read.
      </p>
      <p>
        Feeds face the same choice. Delivering at post time is called{" "}
        <Term id="fan-out">fan-out</Term> on write; collecting at read time is fan-out on read.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The celebrity posts ⭐ ------------------------------------------------------------------------ */

export function Celebrity() {
  const [s, set] = useSceneState<FeedState>();
  const threshold = THRESHOLDS[s.threshold];
  const r = evaluate(s.strategy, threshold);
  const msg =
    s.strategy === "write"
      ? "Reading is a single cache fetch, but writing isn't: one post from a 10-million-follower account means 10 million inserts, and with many big accounts posting, the fan-out workers fall behind. Followers see posts minutes late."
      : s.strategy === "read"
        ? `Posting is free, but every feed load fetches from 200 accounts: ${human(r.lookupsPerS)} lookups a second across ${human(FEED_READS_PER_S)} feed loads. Slow feeds, and a huge read bill.`
        : `Ordinary accounts fan out on write; accounts over ${human(threshold)} followers are fetched when you read. Each feed merges ${r.lookupsPerFeed} big accounts into a precomputed timeline.`;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="The celebrity posts"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.strategy}
            options={[
              ["write", "Fan-out on write"],
              ["read", "Fan-out on read"],
              ["hybrid", "Hybrid"],
            ]}
            onChange={(v) => set({ strategy: v as FeedState["strategy"] })}
          />
          <div
            className={cn(
              "flex flex-wrap items-center gap-2",
              s.strategy !== "hybrid" && "opacity-40",
            )}
          >
            <span className="text-muted text-xs">Treat as a celebrity above</span>
            <Segmented
              size="sm"
              value={String(s.threshold)}
              options={THRESHOLDS.map(
                (t, i) => [String(i), `${human(t)} followers`] as [string, string],
              )}
              onChange={(v) => set({ threshold: Number(v), strategy: "hybrid" })}
            />
          </div>
          <div className="border-line bg-surface space-y-2 rounded-xl border p-3">
            {(
              [
                ["Work when posting (timeline inserts/s)", r.writesPerS, 3_000_000, r.overloaded],
                [
                  "Work when reading (lookups/s)",
                  r.lookupsPerS,
                  60_000_000,
                  r.lookupsPerS > 10_000_000,
                ],
              ] as const
            ).map(([label, v, max, bad]) => (
              <div key={label}>
                <div className="text-muted mb-0.5 flex justify-between text-[10px]">
                  <span>{label}</span>
                  <span className="font-mono">{human(v)}</span>
                </div>
                <div className="bg-surface-2 relative h-3 overflow-hidden rounded">
                  <motion.div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded",
                      bad ? "bg-bad/70" : "bg-viz-compute/60",
                    )}
                    initial={false}
                    animate={{ width: `${Math.max(0.5, (v / max) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat
              label="Accounts fetched per feed"
              value={String(r.lookupsPerFeed)}
              bad={r.lookupsPerFeed > 50}
            />
            <Stat label="Feed load time" value={`~${r.feedMs} ms`} bad={r.feedMs > 50} />
            <Stat label="Celebrity post reaches all" value={r.celebDeliver} bad={r.overloaded} />
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={`${s.strategy}${s.threshold}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                s.strategy === "hybrid" ? "border-good/40 bg-good/10" : "border-bad/40 bg-bad/10",
              )}
            >
              {msg}
            </motion.p>
          </AnimatePresence>
          <details className="text-muted text-xs">
            <summary className="cursor-pointer">About these numbers</summary>
            <p className="mt-2">
              Illustrative, loosely based on Twitter&apos;s 2012 talk &ldquo;Timelines at
              Scale&rdquo;: about 5,000 posts and 300,000 timeline reads a second. Fan-out workers
              here handle 2.5 million inserts a second; users follow 200 accounts on average.
            </p>
          </details>
        </div>
      }
    >
      <p>
        Now at the scale of a big social network. A celebrity with 10 million followers posts.
        Compare the two approaches, then try a hybrid: fan out on write for most accounts, but fetch
        the biggest ones at read time.
      </p>
      <p className="text-muted text-sm">
        In 2012 Twitter fanned out every tweet into Redis timelines (capped at 800 entries each);
        big accounts&apos; tweets could take minutes to reach everyone, and it planned to merge them
        at read time instead.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ------------------------------------------------------------------------------------- */

export function PredictFanout() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How long to reach everyone?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="fanout-time"
            prompt="The fan-out workers have spare capacity for 1 million timeline inserts a second. An account with 10 million followers posts. How many seconds until the last follower's feed has it?"
            min={0}
            max={60}
            step={1}
            unit=" s"
            answer={10}
            tolerance={1}
            explanation="10 million ÷ 1 million per second = 10 s, and only if nothing else is posting. Two such posts at once, and followers wait twice as long; everyone else's posts queue behind them. That's why hybrids skip fan-out for the biggest accounts."
          />
        </div>
      }
    >
      <p>Back-of-the-envelope maths tells you whether a design survives its busiest users.</p>
    </StepLayout>
  );
}

/* 4 ─ Scrolling while it changes ⭐ ------------------------------------------------------------------ */

const PAGE = 5;

function feedItems(stage: number): number[] {
  // Newest first. Two new posts (21, 22) arrive at stage 2.
  const base = Array.from({ length: 20 }, (_, i) => 20 - i);
  return stage >= 2 ? [22, 21, ...base] : base;
}

export function Paging() {
  const [s, set] = useSceneState<FeedState>();
  const page1 = feedItems(1).slice(0, PAGE);
  const now = feedItems(s.pageStage);
  const lastSeen = page1[page1.length - 1];
  const page2 =
    s.paging === "offset"
      ? now.slice(PAGE, PAGE * 2)
      : now.filter((id) => id < lastSeen).slice(0, PAGE);
  const shown = s.pageStage >= 3 ? [...page1, ...page2] : s.pageStage >= 1 ? page1 : [];
  const dupes = new Set(page2.filter((id) => page1.includes(id)));
  const actions = ["Load the feed", "Two new posts arrive", "Scroll: load page 2"];
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="Scrolling while it changes"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.paging}
            options={[
              ["offset", "Page numbers (offset)"],
              ["cursor", "Cursor (“older than …”)"],
            ]}
            onChange={(v) => set({ paging: v as FeedState["paging"], pageStage: 0 })}
          />
          <div className="flex flex-wrap items-center gap-2">
            {s.pageStage < 3 ? (
              <button
                type="button"
                onClick={() => set({ pageStage: s.pageStage + 1 })}
                className="bg-accent text-accent-fg rounded-full px-3 py-1.5 text-xs font-medium"
              >
                {actions[s.pageStage]}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => set({ pageStage: 0 })}
                className="border-line rounded-full border px-3 py-1.5 text-xs"
              >
                Start over
              </button>
            )}
            <Code className="flex-1">
              {s.pageStage < 3
                ? "GET /feed?limit=5"
                : s.paging === "offset"
                  ? "GET /feed?limit=5&offset=5"
                  : `GET /feed?limit=5&before=post-${lastSeen}`}
            </Code>
          </div>
          <div className="border-line bg-surface min-h-40 rounded-xl border p-3">
            {s.pageStage === 2 && (
              <p className="text-muted mb-2 text-[10px]">
                Posts 22 and 21 were just published above what you&apos;re reading.
              </p>
            )}
            <div className="grid gap-1">
              <AnimatePresence initial={false}>
                {shown.map((id, i) => (
                  <motion.div
                    key={`${i}-${id}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex items-center justify-between rounded-md border px-2.5 py-1 text-xs",
                      i >= PAGE && dupes.has(id) ? "border-bad/50 bg-bad/10" : "border-line",
                    )}
                  >
                    <span>Post {id}</span>
                    <span className="text-muted text-[10px]">
                      {i < PAGE ? "page 1" : dupes.has(id) ? "page 2: already seen!" : "page 2"}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {!shown.length && <p className="text-subtle text-xs">Nothing loaded yet.</p>}
            </div>
          </div>
          {s.pageStage >= 3 && (
            <p
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                dupes.size ? "border-bad/40 bg-bad/10" : "border-good/40 bg-good/10",
              )}
            >
              {dupes.size
                ? "“Skip 5” now skips the two new posts plus only three old ones, so posts 16 and 17 show up twice. (If posts were deleted, you'd skip some instead.)"
                : "“Older than post 16” doesn't care what was added on top. Each page starts exactly where the last ended."}
            </p>
          )}
        </div>
      }
    >
      <p>
        Feeds change while you scroll. Load a page, let new posts arrive, then scroll to page 2,
        first with page numbers, then with <Term id="cursor-pagination">a cursor</Term>.
      </p>
      <p className="text-muted text-sm">
        Slack&apos;s API moved from page numbers to cursors for this reason (and because deep
        offsets are slow for databases: they still read every skipped row).
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: push or pull? ------------------------------------------------------------------ */

export function PushOrPull() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Deliver or collect?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="push-or-pull"
            prompt="In a hybrid design, which approach suits each case?"
            categories={[
              { id: "push", label: "Deliver on post" },
              { id: "pull", label: "Collect on read" },
            ]}
            items={[
              {
                id: "friend",
                label: "A friend with 150 followers posts a photo",
                category: "push",
                why: "Cheap to fan out: 150 inserts, and reads stay fast.",
              },
              {
                id: "star",
                label: "A film star with 40 million followers posts",
                category: "pull",
                why: "Too many inserts; fetch it when followers read.",
              },
              {
                id: "inactive",
                label: "Timelines for users who haven't opened the app in a year",
                category: "pull",
                why: "Don't keep precomputed feeds nobody reads; build them if they return.",
              },
              {
                id: "team",
                label: "A small team's shared channel",
                category: "push",
                why: "Few readers, quick delivery.",
              },
              {
                id: "news",
                label: "A news account posting 300 times a day to 5 million followers",
                category: "pull",
                why: "Constant, huge fan-out; better merged at read time.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Real systems mix both, and also rank the merged posts (Meta says its feed ranking uses
        thousands of signals) rather than just sorting by time.
      </p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Push or pull", "Do the work when posting, or when reading."],
  ["Celebrities break push", "Millions of inserts per post; fetch them at read time instead."],
  ["Hybrids win", "Push for most accounts, pull for the biggest."],
  ["Precompute for active users", "Don't build feeds nobody will read."],
  ["Paginate with cursors", "Offsets shift when new items arrive."],
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
      <p>Feeds can arrive a few seconds late. Chat messages can&apos;t.</p>
      <p>Next: real-time chat.</p>
    </StepLayout>
  );
}

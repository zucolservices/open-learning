"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { CacheState } from "./state";

/* 4 ─ The stale-read race ⭐ ---------------------------------------------------------------------- */

type Fix = CacheState["raceFix"];
interface RaceFrame {
  who: "reader" | "writer" | "result";
  title: string;
  text: string;
  cache: string;
  db: string;
  tone?: "good" | "bad";
}

function frames(fix: Fix): RaceFrame[] {
  const lease = fix === "lease";
  const upd = fix === "update";
  const f: RaceFrame[] = [
    {
      who: "reader",
      title: "Reader: cache miss",
      text: lease
        ? "The reader misses. With leases, the cache hands it a token: 'you may fill this key'."
        : "The cache entry has just expired. A reader misses.",
      cache: lease ? "empty (lease #41 out)" : "empty",
      db: "₹180",
    },
    {
      who: "reader",
      title: "Reader: reads the database",
      text: "It reads ₹180, then pauses (a slow network, a garbage-collection pause…).",
      cache: lease ? "empty (lease #41 out)" : "empty",
      db: "₹180",
    },
    {
      who: "writer",
      title: "Writer: updates the database",
      text: "Meanwhile, the price changes to ₹200 in the database.",
      cache: lease ? "empty (lease #41 out)" : "empty",
      db: "₹200",
    },
    upd
      ? {
          who: "writer",
          title: "Writer: updates the cache",
          text: "Instead of deleting, the writer puts ₹200 in the cache.",
          cache: "₹200",
          db: "₹200",
        }
      : {
          who: "writer",
          title: "Writer: deletes the cache key",
          text: lease ? "The delete also cancels lease #41." : "There's nothing to delete yet.",
          cache: lease ? "empty (lease cancelled)" : "empty",
          db: "₹200",
        },
    lease
      ? {
          who: "reader",
          title: "Reader: tries to fill the cache",
          text: "It sends ₹180 with lease #41, but that lease was cancelled, so the cache refuses.",
          cache: "empty",
          db: "₹200",
          tone: "good",
        }
      : {
          who: "reader",
          title: "Reader: fills the cache",
          text: "The reader wakes up and stores what it read: ₹180.",
          cache: "₹180",
          db: "₹200",
          tone: "bad",
        },
  ];
  const result: RaceFrame =
    fix === "lease"
      ? {
          who: "result",
          title: "Result: fresh",
          text: "The next read misses, gets a new lease, and caches ₹200. The race can't leave stale data behind.",
          cache: "₹200",
          db: "₹200",
          tone: "good",
        }
      : fix === "ttl"
        ? {
            who: "result",
            title: "Result: stale, but only for a while",
            text: "The cache says ₹180 until its TTL (say 5 minutes) expires. The TTL doesn't prevent the race; it limits the damage.",
            cache: "₹180 (for ≤ 5 min)",
            db: "₹200",
            tone: "bad",
          }
        : fix === "update"
          ? {
              who: "result",
              title: "Result: still stale",
              text: "The reader's late ₹180 overwrote the writer's ₹200. Updating instead of deleting doesn't help, and two writers updating the cache can race each other too.",
              cache: "₹180",
              db: "₹200",
              tone: "bad",
            }
          : {
              who: "result",
              title: "Result: stale, possibly for good",
              text: "The cache says ₹180 while the database says ₹200. With no TTL, it stays wrong until something else deletes it.",
              cache: "₹180",
              db: "₹200",
              tone: "bad",
            };
  return [...f, result];
}

export function StaleRace() {
  const [s, set] = useSceneState<CacheState>();
  const fs = frames(s.raceFix);
  const step = Math.min(s.raceFrame, fs.length - 1);
  const f = fs[step];
  const stale = f.cache.startsWith("₹180") && f.db === "₹200";
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The stale-read race"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.raceFix}
            options={[
              ["none", "Delete on write"],
              ["update", "Update on write"],
              ["ttl", "Delete + TTL"],
              ["lease", "Delete + lease"],
            ]}
            onChange={(v) => set({ raceFix: v as Fix, raceFrame: 0 })}
          />
          <div className="grid grid-cols-2 gap-2">
            {(["reader", "writer"] as const).map((who) => (
              <div
                key={who}
                className={cn(
                  "rounded-xl border px-3 py-2 text-center text-sm transition",
                  f.who === who
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-surface opacity-60",
                )}
              >
                {who === "reader"
                  ? "Request A: reading the price"
                  : "Request B: changing the price"}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-3 text-center",
                stale ? "border-bad/50 bg-bad/10" : "border-viz-add/50 bg-viz-add/10",
              )}
            >
              <p className="text-muted text-[10px]">Cache</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={f.cache}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-sm"
                >
                  {f.cache}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="border-viz-data/50 bg-viz-data/10 rounded-xl border px-3 py-3 text-center">
              <p className="text-muted text-[10px]">Database</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={f.db}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-mono text-sm"
                >
                  {f.db}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <Stepper step={step} count={fs.length} onChange={(n) => set({ raceFrame: n })} />
          <FrameCaption frameKey={s.raceFix + step} title={f.title} tone={f.tone}>
            {f.text}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Cache-aside has a classic flaw. When a read and a write interleave badly, an old value can
        land in the cache <em>after</em> the new one reached the database.
      </p>
      <p>
        Step through it with each fix. Facebook described this exact race, and their fix, in their
        paper on scaling memcache: a <Term id="lease">lease</Term>.
      </p>
      <p className="text-muted text-sm">
        The ordering matters too: update the database first, then delete the cache entry. Deleting
        first leaves a window for a reader to put the old value straight back.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: update or delete? ------------------------------------------------------------- */

export function DeleteCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Update or delete?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="update-or-delete"
            prompt="With cache-aside, after changing a product's price in the database, what should the app do with the cached copy?"
            options={[
              {
                id: "delete",
                label:
                  "Delete it, after the database write succeeds, and keep a TTL as a safety net",
                correct: true,
                feedback:
                  "Right. Deletes are simple and safe to repeat; the next read refills from the source. The TTL bounds any damage from races you missed.",
              },
              {
                id: "update",
                label: "Update it with the new price, so the next read is a hit",
                feedback:
                  "Tempting, but concurrent writers and slow readers can leave the cache holding the wrong one.",
              },
              {
                id: "before",
                label: "Delete it before writing to the database",
                feedback:
                  "A reader in between re-caches the old value, which then outlives the write.",
              },
              {
                id: "nothing",
                label: "Nothing: the TTL will sort it out",
                feedback:
                  "Users see the old price until it expires. Fine for some data, not for prices.",
              },
            ]}
            explanation="Write the source of truth, then invalidate. Add leases (or versioned writes) where even a short stale window matters."
          />
        </div>
      }
    >
      <p>The rule most teams settle on.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Caches come in layers",
    "Browser, CDN, in-process, shared, database: each hit spares everything below.",
  ],
  [
    "Cache-aside by default",
    "Read-through, write-through and write-back trade simplicity, freshness and safety.",
  ],
  ["Write, then delete", "Update the database, then invalidate the cache. Always set a TTL."],
  ["Races happen", "Leases or version checks stop old values landing after new ones."],
  [
    "A cache is a copy",
    "Every copy can be stale. Decide how stale is acceptable for each kind of data.",
  ],
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
      <p>
        &ldquo;There are only two hard things in computer science: cache invalidation and naming
        things.&rdquo; (Phil Karlton, as quoted by Martin Fowler.)
      </p>
      <p>Next: what happens when the cache fills up, and when a popular entry expires.</p>
    </StepLayout>
  );
}

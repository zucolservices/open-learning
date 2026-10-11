"use client";

import { motion } from "motion/react";
import { Wifi, WifiOff } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { WrapStep } from "@/toolkit/layout/wrap-step";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import {
  NAME,
  START,
  edit,
  setOnline,
  type Dev,
  type Mode,
  type Order,
  type Strategy,
} from "./model";
import type { OfflineState } from "./state";

/* 1 ─ Story ---------------------------------------------------------------------------------------- */

export function Notebook() {
  return (
    <StepLayout
      eyebrow="Story"
      title="The waiter's notepad"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {[
            [
              "At the table",
              "The waiter writes your order on a notepad. No need to run to the kitchen first.",
            ],
            ["Walking back", "Orders from several tables pile up on the pad."],
            [
              "At the kitchen",
              "The waiter hands them all over. If two waiters took different orders for one table, they sort it out.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12 * i }}
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
        A waiter doesn&apos;t sprint to the kitchen after every word you say. They write it down,
        keep serving, and pass the orders on when they get there.
      </p>
      <p>
        An <Term id="offline-first">offline-first</Term> app does the same: it reads and writes a
        local copy of the data, keeps a queue of changes, and <Term id="sync">syncs</Term> when a
        connection returns. The hard part is the last step: what if two devices changed the same
        thing?
      </p>
    </StepLayout>
  );
}

/* 2 ─ Simulation ⭐ -------------------------------------------------------------------------------- */

function OrderView({ o }: { o: Order }) {
  const items = Object.entries(o.items);
  return (
    <div className="text-[11px]">
      {items.length ? (
        items.map(([k, n]) => (
          <p key={k}>
            {n} × {k}
          </p>
        ))
      ) : (
        <p className="text-subtle">No items yet</p>
      )}
      <p className="text-muted">Pickup {o.pickup}</p>
    </div>
  );
}

export function Lift() {
  const [s, set] = useSceneState<OfflineState>();
  const w = s.world;
  const mode = s.mode as Mode;
  const strategy = s.strategy as Strategy;
  const devs: [Dev, string][] = [
    ["phone", "12:30"],
    ["tablet", "12:45"],
  ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="An order in a lift"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3 text-xs">
          <div className="flex flex-wrap gap-2">
            <Segmented<Mode>
              size="sm"
              value={mode}
              onChange={(v) => set({ mode: v, world: START })}
              options={[
                ["online-only", "Online only"],
                ["offline-first", "Offline first"],
              ]}
            />
            {mode === "offline-first" && (
              <Segmented<Strategy>
                size="sm"
                value={strategy}
                onChange={(v) => set({ strategy: v, world: START })}
                options={[
                  ["lww", "Last write wins"],
                  ["merge", "Merge changes"],
                ]}
              />
            )}
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {devs.map(([d, time]) => {
              const dev = w.devices[d];
              return (
                <div
                  key={d}
                  className={cn(
                    "rounded-xl border p-2",
                    dev.online ? "border-line-strong bg-surface" : "border-viz-idle bg-surface-2",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between gap-1">
                    <span className="font-semibold">{NAME[d]}</span>
                    <button
                      type="button"
                      aria-pressed={dev.online}
                      onClick={() => set({ world: setOnline(w, d, !dev.online, strategy) })}
                      className={cn(
                        "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px]",
                        dev.online ? "border-good text-good" : "border-bad text-bad",
                      )}
                    >
                      {dev.online ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
                      {dev.online ? "Online" : "Offline"}
                    </button>
                  </div>
                  <OrderView o={dev.local} />
                  {dev.outbox.length > 0 && (
                    <p className="text-viz-meta mt-1 text-[10px]">
                      {dev.outbox.length} change{dev.outbox.length > 1 ? "s" : ""} queued
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {["chai", "dosa"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          set({ world: edit(w, d, { kind: "add", item }, mode, strategy) })
                        }
                        className="border-line-strong rounded-full border px-2 py-0.5 text-[10px]"
                      >
                        + {item}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        set({ world: edit(w, d, { kind: "pickup", value: time }, mode, strategy) })
                      }
                      className="border-line-strong rounded-full border px-2 py-0.5 text-[10px]"
                    >
                      Pickup {time}
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="border-viz-compute bg-viz-compute/5 rounded-xl border p-2">
              <p className="mb-1 font-semibold">Server</p>
              <OrderView o={w.server} />
            </div>
          </div>
          <div className="border-line bg-surface-2 max-h-28 overflow-y-auto rounded-lg border px-3 py-2">
            {w.log.slice(-4).map((l, i, a) => (
              <p key={`${w.log.length}-${i}`} className={i === a.length - 1 ? "" : "text-muted"}>
                {l}
              </p>
            ))}
          </div>
          <button
            type="button"
            onClick={() => set({ world: START })}
            className="text-muted self-start"
          >
            Reset
          </button>
        </div>
      }
    >
      <p>
        Two friends share one group order. Take the phone offline (it&apos;s in a lift), add chai
        and set pickup to 12:30. Meanwhile, on the tablet, add a dosa and choose 12:45. Then bring
        the phone back online.
      </p>
      <p>
        Try it with each setting. Online only refuses changes without a signal. Last write wins lets
        one device&apos;s copy flatten the other&apos;s. Merging keeps both sets of items and flags
        the clash over the pickup time.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Write strategies ----------------------------------------------------------------------------- */

export function Writes() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three ways to write"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[
            [
              "Online only",
              "Send first, save locally after. If there's no signal, say so.",
              "Payments, bookings with limited seats",
            ],
            [
              "Queued",
              "Put it in a queue and send later, retrying with growing gaps.",
              "Analytics events, logs",
            ],
            [
              "Local first (lazy)",
              "Save locally now, queue it, sync later. Needs a plan for conflicts.",
              "Notes, to-do lists, a basket",
            ],
          ].map(([t, b, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p>
                <span className="font-semibold">{t}</span>
                <span className="text-muted"> · {b}</span>
              </p>
              <p className="text-subtle text-[10px]">For example: {e}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Android&apos;s official offline-first guide names these three write strategies, and one
        golden rule: the local database is the app&apos;s <em>source of truth</em>. Screens read
        only from it; the network just keeps it up to date.
      </p>
      <p>
        Not everything should work offline. Charging a card twice because a queued payment retried
        is far worse than asking someone to wait for a signal.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Tools ---------------------------------------------------------------------------------------- */

export function Tools() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Building blocks"
      stage={
        <div className="grid flex-1 content-center gap-1.5 sm:grid-cols-2">
          {[
            [
              "Local database",
              "SQLite underneath, via Room, SwiftData or Core Data, or a cross-platform package.",
            ],
            [
              "Background sync",
              "WorkManager on Android, background tasks on iOS, retrying when the network returns.",
            ],
            [
              "Sync engines",
              "PowerSync, Ditto, ElectricSQL, Couchbase Lite and others sync a local database with a server.",
            ],
            [
              "Merging without loss",
              "CRDTs such as Automerge merge edits made on different devices automatically.",
            ],
          ].map(([t, b], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="text-muted">{b}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Firebase&apos;s Firestore caches data offline by default on Android and iOS (100 MB unless
        you change it), and uses last write wins per document.
      </p>
      <p>
        Hosted sync services can disappear: MongoDB&apos;s Atlas Device Sync (formerly Realm Sync)
        shut down on 30 September 2025, forcing apps to migrate. Keep your sync layer behind your
        own interface so it can be swapped.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint ----------------------------------------------------------------------------------- */

export function OfflineCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which write strategy?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="mobile-offline"
            prompt="Which write strategy suits each action in the café app?"
            categories={[
              { id: "online", label: "Online only" },
              { id: "queued", label: "Queued" },
              { id: "local", label: "Local first" },
            ]}
            items={[
              {
                id: "pay",
                label: "Paying for the order",
                category: "online",
                why: "Must be confirmed; never retry blindly.",
              },
              {
                id: "basket",
                label: "Adding a dish to the basket",
                category: "local",
                why: "Instant, sync later.",
              },
              {
                id: "event",
                label: "Recording that the menu was opened",
                category: "queued",
                why: "Fire and forget, send later.",
              },
              {
                id: "fav",
                label: "Starring a favourite dish",
                category: "local",
                why: "Small, personal, easy to merge.",
              },
              {
                id: "table",
                label: "Booking the last free table",
                category: "online",
                why: "Someone else may take it.",
              },
            ]}
            explanation="Use online-only writes where the server must agree right now (money, scarce things), queues for fire-and-forget data, and local-first writes for everything people edit, with a plan for conflicts."
          />
        </div>
      }
    >
      <p>Sort each action.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <WrapStep
      points={[
        ["Local is the source of truth", "Screens read the device's database."],
        ["Queue changes", "Send them when the network returns."],
        ["Plan for conflicts", "Last write wins loses data; merging keeps it."],
        ["Not everything offline", "Payments and scarce things need the server."],
        ["Own your sync layer", "Hosted services come and go."],
      ]}
    >
      <p>Next: when the network is there, but slow.</p>
    </WrapStep>
  );
}

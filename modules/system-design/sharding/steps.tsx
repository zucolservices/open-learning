"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { PredictCheckpoint } from "@/toolkit/checkpoints/predict";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SERVER_NAMES, loads, movedShare } from "./model";
import { RingScene } from "./ring-scene";
import type { ShardState } from "./state";

/* 1 ─ Split the phone book ------------------------------------------------------------------------ */

const RANGE = {
  write: [2, 3, 95],
  week: [0, 0, 1],
  labels: ["Jan–Apr", "May–Aug", "Sep–Dec (now)"],
};
const HASH = { write: [33, 34, 33], week: [1, 1, 1], labels: ["hash 0–⅓", "hash ⅓–⅔", "hash ⅔–1"] };

export function PhoneBook() {
  const [s, set] = useSceneState<ShardState>();
  const d = s.partitioning === "range" ? RANGE : HASH;
  return (
    <StepLayout
      eyebrow="The big idea"
      title="Split the phone book"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.partitioning}
            options={[
              ["range", "By range of order date"],
              ["hash", "By hash of order ID"],
            ]}
            onChange={(v) => set({ partitioning: v as ShardState["partitioning"] })}
          />
          <div className="grid grid-cols-3 gap-2">
            {d.labels.map((l, i) => (
              <div key={l} className="border-line bg-surface rounded-xl border p-3 text-center">
                <p className="text-sm font-semibold">Shard {i + 1}</p>
                <p className="text-muted text-[10px]">{l}</p>
                <div className="bg-surface-2 mt-2 flex h-20 items-end overflow-hidden rounded">
                  <motion.div
                    initial={false}
                    animate={{ height: `${d.write[i]}%` }}
                    className={cn("mt-auto w-full", d.write[i] > 80 ? "bg-bad/70" : "bg-viz-data")}
                  />
                </div>
                <p className="text-muted mt-1 text-[10px]">today&apos;s writes: {d.write[i]}%</p>
                <p className={cn("mt-1 text-[10px]", d.week[i] ? "text-accent" : "text-subtle")}>
                  {d.week[i] ? "✓ asked for last week" : "—"}
                </p>
              </div>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={s.partitioning}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="border-line bg-surface rounded-xl border px-4 py-3 text-sm"
            >
              {s.partitioning === "range"
                ? "Range: 'last week's orders' touches one shard. But every new order lands in the newest range, so one shard takes almost all the writes: a hot spot."
                : "Hash: writes spread evenly. But 'last week's orders' must ask every shard, because neighbouring dates are scattered."}
            </motion.p>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        A city phone book too thick to bind is split into volumes: A–H, I–P, Q–Z. When data is too
        big or busy for one machine, it&apos;s split the same way into{" "}
        <Term id="shard">shards</Term> (also called partitions).
      </p>
      <p>
        The first choice is how to split. By <em>range</em> keeps neighbours together; by{" "}
        <em>hash</em> scatters them evenly. Compare them on Brewline&apos;s orders.
      </p>
    </StepLayout>
  );
}

/** Same colours as the 3D scene, so the bars double as a legend. */
const SERVER_BG = ["bg-viz-data", "bg-viz-meta", "bg-viz-compute", "bg-viz-add", "bg-accent"];

/* 2 ─ Add a server ⭐ ---------------------------------------------------------------------------- */

const SCHEMES: [ShardState["scheme"], string, string][] = [
  ["mod", "hash mod N", "Owner = hash(key) mod number of servers."],
  [
    "ring",
    "Consistent hashing",
    "Servers and keys sit on a ring; a key belongs to the next server clockwise.",
  ],
  ["vnodes", "+ virtual nodes", "Each server appears at 32 points around the ring."],
];

export function AddAServer() {
  const [s, set] = useSceneState<ShardState>();
  const moved = s.servers > 3 ? movedShare(s.servers - 1, s.servers, s.scheme) : 0;
  const ld = loads(s.servers, s.scheme);
  const ideal = 1 / s.servers;
  return (
    <StepLayout
      eyebrow="3D model"
      title="Add a server"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="grid grid-cols-3 gap-1.5">
            {SCHEMES.map(([id, label, how]) => (
              <button
                key={id}
                type="button"
                onClick={() => set({ scheme: id })}
                className={cn(
                  "rounded-xl border px-2.5 py-1.5 text-left",
                  s.scheme === id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                <span className="block text-xs font-semibold">{label}</span>
                <span className="text-muted block text-[10px] leading-snug">{how}</span>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted text-xs">Servers</span>
            <Segmented
              size="sm"
              value={String(s.servers)}
              options={[3, 4, 5].map((n) => [String(n), `${n}`] as [string, string])}
              onChange={(v) => set({ servers: Number(v) })}
            />
            <span className="text-subtle text-[11px]">
              Add one and watch the keys that change colour lift up.
            </span>
          </div>
          <div className="border-line bg-bg/40 relative h-72 overflow-hidden rounded-xl border sm:h-80">
            <RingScene servers={s.servers} scheme={s.scheme} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div
              className={cn(
                "rounded-xl border px-3 py-2",
                moved > 0.5 ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
              )}
            >
              <p className="text-muted text-[10px]">
                Keys that moved when server {SERVER_NAMES[s.servers - 1]} joined
              </p>
              <p className="font-mono text-lg">
                {s.servers > 3 ? `${Math.round(moved * 100)}%` : "—"}
              </p>
              <p className="text-subtle text-[10px]">
                a fair share for the new server: {Math.round((1 / s.servers) * 100)}%
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-muted text-[10px]">
                Share of keys per server (ideal {Math.round(ideal * 100)}%)
              </p>
              <div className="mt-1 flex items-end gap-1">
                {ld.map((l, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center">
                    <div className="bg-surface-2 flex h-10 w-full items-end rounded-sm">
                      <motion.div
                        initial={false}
                        animate={{ height: `${Math.min(100, l * 180)}%` }}
                        className={cn(
                          "w-full rounded-sm",
                          SERVER_BG[i],
                          Math.abs(l - ideal) > ideal * 0.5 && "ring-bad ring-2",
                        )}
                      />
                    </div>
                    <span className="text-subtle text-[9px]">
                      {SERVER_NAMES[i]} {Math.round(l * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <p>
        The simplest way to pick a shard: hash the key and take the remainder, mod the number of
        servers. Now add a server.
      </p>
      <p>
        With <Term id="consistent-hashing">consistent hashing</Term>, adding a server only takes
        keys from its neighbour on the ring. With virtual nodes, each server owns many small slices,
        so load evens out and a new server takes a little from everyone.
      </p>
      <p className="text-muted text-sm">
        Moving keys means copying data across the network while serving traffic, so moving less
        matters a lot. Percentages are measured over 4,000 keys; the ring shows 72.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Predict ------------------------------------------------------------------------------------ */

export function PredictMove() {
  return (
    <StepLayout
      eyebrow="Predict"
      title="How much moves?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <PredictCheckpoint
            id="mod-move"
            prompt="Data is spread over 10 servers using hash mod N. You add an 11th. Roughly what percentage of keys move to a different server?"
            min={0}
            max={100}
            step={1}
            unit="%"
            answer={91}
            tolerance={5}
            explanation="About N/(N+1) = 10/11 ≈ 91%. Nearly everything moves, because almost every remainder changes. Consistent hashing moves only about 1/11 ≈ 9%, the minimum needed to give the new server its share."
          />
        </div>
      }
    >
      <p>Use what you saw on the ring.</p>
    </StepLayout>
  );
}

/* 4 ─ Hot keys and cross-shard queries ------------------------------------------------------------ */

export function HotAndScattered() {
  const [s, set] = useSceneState<ShardState>();
  const hotLoads = s.hotFix ? [34, 33, 33] : [88, 6, 6];
  return (
    <StepLayout
      eyebrow="Two catches"
      title="Hot keys and scattered queries"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="grid gap-2">
            <p className="text-sm font-semibold">1. A celebrity account</p>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={s.hotFix}
                onChange={(e) => set({ hotFix: e.target.checked })}
                className="accent-[var(--accent)]"
              />
              Split the hot key: write to{" "}
              <code className="font-mono text-xs">user42#0 … user42#9</code>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hotLoads.map((l, i) => (
                <div key={i} className="text-center">
                  <div className="bg-surface-2 flex h-16 items-end overflow-hidden rounded">
                    <motion.div
                      initial={false}
                      animate={{ height: `${l}%` }}
                      className={cn("w-full", l > 80 ? "bg-bad/70" : "bg-viz-data")}
                    />
                  </div>
                  <p className="text-muted mt-1 text-[10px]">
                    shard {i + 1}: {l}%
                  </p>
                </div>
              ))}
            </div>
            <p className="text-muted text-xs">
              {s.hotFix
                ? "Writes spread across shards. The price: reading the account now means gathering all ten pieces."
                : "One key gets half of all traffic, and no sharding scheme can split a single key."}
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-semibold">
              2. Orders are sharded by order ID. Find all of customer 88&apos;s orders.
            </p>
            <Segmented
              size="sm"
              value={s.lookup}
              options={[
                ["scatter", "Ask every shard"],
                ["global", "Use a global index"],
              ]}
              onChange={(v) => set({ lookup: v as ShardState["lookup"] })}
            />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <span
                  key={n}
                  className={cn(
                    "flex-1 rounded-lg border py-2 text-center text-[10px]",
                    s.lookup === "scatter" || n === 3
                      ? "border-accent bg-accent-soft"
                      : "border-line opacity-50",
                  )}
                >
                  shard {n}
                </span>
              ))}
            </div>
            <p className="text-muted text-xs">
              {s.lookup === "scatter"
                ? "Scatter-gather: every shard does work, and the answer waits for the slowest one (the tail at scale again)."
                : "A global index, sharded by customer, points straight to the orders. But it's updated separately, so it can lag (DynamoDB's global secondary indexes are eventually consistent)."}
            </p>
          </div>
        </div>
      }
    >
      <p>
        Sharding spreads data evenly only if the data is evenly popular, and it only helps queries
        that include the shard key.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: pick the shard key ------------------------------------------------------------ */

export function ShardKeyCheck() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Pick the shard key"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="shard-key"
            prompt="Brewline's orders table must be sharded. Almost every query asks for one customer's orders. Which shard key?"
            options={[
              {
                id: "customer",
                label: "customer_id (hashed)",
                correct: true,
                feedback:
                  "Right. Each customer's orders live together, so the common query hits one shard, and millions of customers spread evenly.",
              },
              {
                id: "date",
                label: "order_date",
                feedback:
                  "Today's date takes every new write: a hot shard. And customer queries would touch every shard.",
              },
              {
                id: "uuid",
                label: "A random order UUID",
                feedback:
                  "Even spread, but every customer query becomes scatter-gather across all shards.",
              },
              {
                id: "store",
                label: "store_id",
                feedback:
                  "Store sizes vary hugely: the flagship store's shard would be overloaded.",
              },
            ]}
            explanation="Shard by what your main queries filter on, and check the key has many values with fairly even popularity."
          />
        </div>
      }
    >
      <p>The most important sharding decision, and the hardest to change later.</p>
    </StepLayout>
  );
}

/* 6 ─ Real systems -------------------------------------------------------------------------------- */

const SYSTEMS: [string, string][] = [
  ["Cassandra", "A token ring with virtual nodes (16 per node by default since 4.0)."],
  [
    "DynamoDB",
    "Hash-partitioned; each partition tops out at 3,000 reads / 1,000 writes per second (capacity units). Adaptive capacity can give one hot item its own partition.",
  ],
  [
    "MongoDB",
    "Range or hashed shard keys; data moves in ranges of 128 MB by default. Resharding without downtime since 5.0.",
  ],
  [
    "CockroachDB",
    "Splits tables into ranges of up to 512 MiB, moved and replicated automatically.",
  ],
  ["Vitess · Citus", "Sharding layers for MySQL (Vitess) and PostgreSQL (Citus)."],
];

export function RealSystems() {
  return (
    <StepLayout
      eyebrow="The landscape"
      title="Sharding you'll meet"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {SYSTEMS.map(([t, d], i) => (
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
      <p>Most databases now shard for you. You still choose the key.</p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  [
    "Range or hash",
    "Range keeps neighbours together but creates hot spots; hash spreads load but scatters ranges.",
  ],
  [
    "Don't use mod N",
    "Consistent hashing moves about 1/(N+1) of keys instead of nearly all of them.",
  ],
  ["Virtual nodes even things out", "Many small slices per server balance load and share moves."],
  ["Hot keys beat any scheme", "Split or cache them; one key can't be spread by hashing."],
  ["Shard by your main query", "Queries without the shard key must ask every shard."],
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
        Next: what happens when copies of data can&apos;t talk to each other: consistency and CAP.
      </p>
    </StepLayout>
  );
}

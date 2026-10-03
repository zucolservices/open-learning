"use client";

import { motion } from "motion/react";
import { HardDrive, Refrigerator, Store, UtensilsCrossed } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DEVICE_US, FETCHES, LADDER, human, real, type Device, type Fetch } from "./model";
import type { ShState } from "./state";

/* 1 ─ Counter, fridge, shop ----------------------------------------------------------------------- */

const PLACES = [
  {
    icon: UtensilsCrossed,
    t: "On the counter",
    d: "Instant. Room for a few things.",
    k: "CPU cache",
  },
  {
    icon: Refrigerator,
    t: "In the fridge",
    d: "A few steps. Holds the week's food, but a power cut spoils it.",
    k: "Memory (RAM)",
  },
  {
    icon: Store,
    t: "The shop down the road",
    d: "A trip out. Has everything and never forgets.",
    k: "SSD",
  },
  {
    icon: HardDrive,
    t: "A warehouse in another city",
    d: "Huge, cheap and very slow to reach.",
    k: "Spinning disk",
  },
];

export function Kitchen() {
  return (
    <StepLayout
      eyebrow="Story"
      title="Counter, fridge, shop"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {PLACES.map(({ icon: Icon, t, d, k }, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="border-line bg-surface grid grid-cols-[1.5rem_1fr_7rem] items-center gap-2 rounded-lg border px-3 py-2"
            >
              <Icon className="text-accent size-4" />
              <span className="text-sm">
                <span className="font-semibold">{t}:</span> <span className="text-muted">{d}</span>
              </span>
              <span className="text-accent text-right font-mono text-[11px]">{k}</span>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Cooking dinner, you keep what you&apos;re using on the counter, the week&apos;s food in the
        fridge, and go to the shop only when you must. Nobody fetches one onion at a time from the
        shop.
      </p>
      <p>
        Computers store data the same way, in layers from tiny and fast to huge and slow. A database
        is mostly a machine for keeping the data you need near the counter, and for making each trip
        to the shop count.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The latency ladder ⭐ ----------------------------------------------------------------------- */

export function Ladder() {
  const [s, set] = useSceneState<ShState>();
  const max = Math.log10(LADDER[LADDER.length - 1].ns / 0.5);
  return (
    <StepLayout
      eyebrow="Animated infographic"
      title="The latency ladder"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <Segmented<"human" | "real">
              size="sm"
              value={s.humanScale ? "human" : "real"}
              onChange={(v) => set({ humanScale: v === "human" })}
              options={[
                ["human", "If a cache hit took 1 second"],
                ["real", "Real times"],
              ]}
            />
          </div>
          <div className="flex flex-col gap-2">
            {LADDER.map((r, i) => (
              <div key={r.label} className="border-line bg-surface rounded-lg border px-3 py-2">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold">{r.label}</span>
                  <motion.span
                    key={String(s.humanScale) + i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-mono text-sm"
                  >
                    {s.humanScale ? human(r.ns) : real(r.ns)}
                  </motion.span>
                </div>
                <div className="bg-surface-2 mt-1 h-2 overflow-hidden rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(2, (Math.log10(r.ns / 0.5) / max) * 100)}%` }}
                    transition={{ delay: 0.1 * i }}
                    className={cn(
                      "h-full rounded-full",
                      i < 2 ? "bg-good/60" : i === 2 ? "bg-viz-compute/60" : "bg-bad/60",
                    )}
                  />
                </div>
                <p className="text-muted mt-0.5 text-[10px]">{r.note}</p>
              </div>
            ))}
          </div>
          <p className="text-subtle text-[10px]">
            Rough orders of magnitude, c. 2012: Jeff Dean&apos;s version of a table by Peter Norvig.
            Bars use a log scale.
          </p>
        </div>
      }
    >
      <p>
        Engineers carry a list of rough timings around in their heads. If reaching the CPU&apos;s
        cache took one second, memory would be a few minutes away, an SSD days away and a spinning
        disk months away.
      </p>
      <p>
        Modern NVMe SSDs are much faster than the 2012 figure (a drive rated at 22,000 random reads
        a second, one at a time, takes about 45 µs each), but the gap to memory is still hundreds of
        times. That gap is why databases exist in the shape they do.
      </p>
    </StepLayout>
  );
}

/* 3 ─ One row costs a page ⭐ --------------------------------------------------------------------- */

export function WholePage() {
  const [s, set] = useSceneState<ShState>();
  const f = FETCHES[s.fetch];
  const us = f.pages * DEVICE_US[s.device];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="One row costs a page"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(FETCHES) as Fetch[]).map((k) => (
              <button
                key={k}
                type="button"
                aria-pressed={s.fetch === k}
                onClick={() => set({ fetch: k })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  s.fetch === k ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {FETCHES[k].label}
              </button>
            ))}
          </div>
          <div>
            <Segmented<Device>
              size="sm"
              value={s.device}
              onChange={(device) => set({ device })}
              options={[
                ["ssd", "SSD (~100 µs a read)"],
                ["hdd", "Spinning disk (~8 ms a read)"],
              ]}
            />
          </div>
          <div className="grid grid-cols-10 gap-1">
            {Array.from({ length: 80 }, (_, i) => {
              const read = s.fetch === "spread" ? true : i === 0;
              return (
                <motion.div
                  key={`${s.fetch}-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: read ? 0.005 * i : 0 }}
                  className={cn("h-4 rounded-sm", read ? "bg-accent/70" : "bg-surface-2")}
                />
              );
            })}
          </div>
          <p className="text-muted text-[10px]">
            Each square is an 8 kB page of the orders table; filled squares are read.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Rows wanted", String(f.rows)],
              ["Pages read", String(f.pages)],
              ["Time", us >= 1000 ? `${(us / 1000).toFixed(1)} ms` : `${us} µs`],
            ].map(([l, v]) => (
              <div key={l} className="border-line bg-surface rounded-lg border px-2 py-1.5">
                <p className="text-muted text-[10px]">{l}</p>
                <p className="font-mono text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>
          <p className="text-sm">{f.note}</p>
          <p className="text-subtle text-[10px]">Illustrative per-read times.</p>
        </div>
      }
    >
      <p>
        Storage doesn&apos;t hand over single rows. It reads fixed-size <Term id="page">pages</Term>{" "}
        (8 kB in PostgreSQL, 16 KB in InnoDB), and the operating system works in 4 KiB pages
        underneath. Fetching one 100-byte row costs a whole page; fetching its 80 neighbours costs
        nothing more.
      </p>
      <p>
        So what matters is how many pages you touch, not how many rows you want. Keeping related
        rows together, and finding them without reading everything else, is the theme of the next
        few modules.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Memory forgets ------------------------------------------------------------------------------ */

const FACTS: [string, string][] = [
  [
    "fsync",
    "A program asks the operating system to push its writes all the way to the storage device, and waits until it confirms.",
  ],
  [
    "Sequential beats random",
    "Appending to one log file is far cheaper than scattering writes across many pages, which is why databases log first (module 13).",
  ],
  [
    "Cloud disks",
    "AWS describes gp3 volumes as “single-digit millisecond” latency and io2 Block Express as “sub-millisecond”: network storage is slower than a local NVMe drive.",
  ],
];

export function Forgetful() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Memory forgets"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {FACTS.map(([t, d], i) => (
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
        If memory is so fast, why not keep everything there? Because it forgets: a power cut wipes
        it. A database that promises <Term id="durability">durability</Term> must have put the
        change somewhere that survives, and that means storage, with all its slowness.
      </p>
      <p>
        Linux&apos;s <Term id="fsync">fsync()</Term> flushes a file&apos;s changes &ldquo;so that
        all changed information can be retrieved even if the system crashes or is rebooted.&rdquo;
        PostgreSQL keeps that cost down by writing a sequential log: &ldquo;the cost of syncing the
        WAL is much less than the cost of flushing the data pages.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 5 ─ Fastest to slowest -------------------------------------------------------------------------- */

export function FastestFirst() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Fastest to slowest"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="fastest-first"
            prompt="Order these from fastest to slowest."
            items={[
              { id: "l1", label: "Read from the CPU's L1 cache" },
              { id: "ram", label: "Read from main memory" },
              { id: "ssd", label: "A random 4 KB read from an SSD" },
              { id: "hdd", label: "A random read from a spinning disk" },
            ]}
            explanation="Each step down is roughly a hundred to a thousand times slower, which is why databases fight to stay in memory."
          />
        </div>
      }
    >
      <p>Drag them into order.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Huge gaps", "Memory is hundreds of times faster than SSD, which is far faster than disk."],
  ["Pages, not rows", "Every read brings in a whole page."],
  ["Count pages", "Pages touched decide the cost."],
  ["Memory forgets", "Durability means writing to storage."],
  ["Log sequentially", "Cheap, ordered writes make commits fast."],
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
      <p>Next chapter: inside one of those pages, and how rows are packed into it.</p>
    </StepLayout>
  );
}

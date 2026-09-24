"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { Segmented } from "@/toolkit/controls/segmented";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import type { ScaleState } from "./state";

/* 2 ─ Up or out? ⭐ ---------------------------------------------------------------------------- */

/** Load levels, as multiples of what one 8-vCPU server handles. */
const LOADS = [1, 2, 4, 8, 16, 32, 64, 128, 256];
const BASE_VCPU = 8;
/** Largest general-purpose-ish VM we assume you can rent (see SOURCES.md). */
export const MAX_VCPU = 1920;

export function UpOrOut() {
  const [s, set] = useSceneState<ScaleState>();
  const load = LOADS[s.load];
  const need = load * BASE_VCPU;
  const up = s.strategy === "up";
  const fits = need <= MAX_VCPU;
  const servers = up ? 1 : load + 1; // scale out: N + 1 spare
  const rows: [string, string, "good" | "bad" | "neutral"][] = up
    ? [
        [
          "Machines",
          fits ? `1 × ${need} vCPU` : `needs ${need} vCPU: no machine is that big`,
          fits ? "neutral" : "bad",
        ],
        ["If that machine fails", "Everything is down", "bad"],
        ["Growing further", "Pick a bigger size, usually with a restart", "neutral"],
        ["What your code needs", "Nothing changes", "good"],
      ]
    : [
        ["Machines", `${servers} × ${BASE_VCPU} vCPU (one spare), plus a load balancer`, "neutral"],
        ["If one machine fails", "The others carry on; the spare takes up the slack", "good"],
        ["Growing further", "Add machines, no downtime", "good"],
        [
          "What your code needs",
          "Any server must handle any request: no state kept on one machine",
          "neutral",
        ],
      ];
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Up or out?"
      stage={
        <div className="flex flex-1 flex-col gap-4">
          <Segmented
            size="sm"
            value={s.strategy}
            options={[
              ["up", "Scale up (bigger machine)"],
              ["out", "Scale out (more machines)"],
            ]}
            onChange={(v) => set({ strategy: v as ScaleState["strategy"] })}
          />
          <label className="grid gap-1">
            <span className="flex justify-between text-xs">
              <span className="text-muted">Traffic</span>
              <span className="font-mono">{load}× one server&apos;s worth</span>
            </span>
            <input
              type="range"
              min={0}
              max={LOADS.length - 1}
              value={s.load}
              aria-label="Traffic"
              onChange={(e) => set({ load: Number(e.target.value) })}
              className="accent-[var(--accent)]"
            />
          </label>

          <div className="border-line bg-surface flex min-h-40 items-end justify-center gap-1.5 rounded-xl border p-4">
            <AnimatePresence mode="popLayout">
              {up ? (
                <motion.div
                  key="big"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    height: `${Math.min(100, 12 + Math.sqrt(need / MAX_VCPU) * 88)}%`,
                  }}
                  className={cn(
                    "flex w-28 flex-col items-center justify-end rounded-lg border-2 pb-2 text-[10px] font-medium",
                    fits ? "border-viz-compute bg-viz-compute/15" : "border-bad bg-bad/15",
                  )}
                  style={{ minHeight: 40 }}
                >
                  <span className="font-mono">{fits ? `${need} vCPU` : "too big"}</span>
                </motion.div>
              ) : (
                <div className="flex flex-wrap items-end justify-center gap-1">
                  {Array.from({ length: Math.min(servers, 60) }, (_, i) => (
                    <motion.span
                      key={i}
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: Math.min(i, 20) * 0.015 }}
                      className={cn(
                        "size-5 rounded border",
                        i === servers - 1
                          ? "border-viz-compute/60 border-dashed"
                          : "border-viz-compute bg-viz-compute/20",
                      )}
                    />
                  ))}
                  {servers > 60 && (
                    <span className="text-muted ml-1 text-xs">+{servers - 60} more</span>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid gap-1.5">
            {rows.map(([k, v, tone]) => (
              <div
                key={k}
                className={cn(
                  "grid gap-1 rounded-lg border px-3 py-1.5 text-xs sm:grid-cols-[9rem_1fr]",
                  tone === "good"
                    ? "border-good/40 bg-good/5"
                    : tone === "bad"
                      ? "border-bad/40 bg-bad/5"
                      : "border-line bg-surface",
                )}
              >
                <span className="text-muted">{k}</span>
                <span>{v}</span>
              </div>
            ))}
          </div>
          <p className="text-subtle text-xs">
            Illustrative: one server = 8 vCPU. The biggest machine you can rent today is AWS&apos;s
            u7inh-32tb: 1,920 vCPUs and 32 TiB of memory, a rare and very expensive giant. Beyond
            that, scaling up simply runs out.
          </p>
        </div>
      }
    >
      <p>
        There are two ways to handle more load. <Term id="vertical-scaling">Scale up</Term>: buy a
        bigger machine. <Term id="horizontal-scaling">Scale out</Term>: add more machines and share
        the work.
      </p>
      <p>
        Push the traffic slider up under each strategy. Watch what happens to the ceiling, to
        failures, and to what your code has to do.
      </p>
      <p className="text-muted text-sm">
        Real teams do both: scale up while it&apos;s cheap and simple, scale out when it isn&apos;t.
        Databases usually scale up first, because splitting data is hard.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Checkpoint: the typical order --------------------------------------------------------------- */

export function GrowthOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What comes next?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="growth-order"
            prompt="Put these in the order a typical app adds them as it grows."
            items={[
              { id: "db", label: "Move the database to its own server" },
              { id: "lb", label: "Add a load balancer and more app servers" },
              { id: "cache", label: "Add a cache and read replicas" },
              { id: "cdn", label: "Serve static files from a CDN; move slow jobs to a queue" },
              { id: "shard", label: "Split the database into shards" },
            ]}
            explanation="Each step fixes the bottleneck of the moment, cheapest and simplest first. Real apps vary: an image-heavy app adds a CDN on day one. Sharding comes last because it's the hardest to undo."
          />
        </div>
      }
    >
      <p>From the scroll story.</p>
    </StepLayout>
  );
}

/* 4 ─ Three kinds of scale ------------------------------------------------------------------------- */

export function KindsOfScale() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Three kinds of scale"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="kinds-of-scale"
            prompt="Each symptom is a different kind of growth. Which?"
            categories={[
              { id: "load", label: "More traffic" },
              { id: "data", label: "More data" },
              { id: "people", label: "More people" },
            ]}
            items={[
              {
                id: "lunch",
                label: "Checkout takes 8 seconds at lunchtime",
                category: "load",
                why: "Too many requests at once.",
              },
              {
                id: "sale",
                label: "A flash sale brings 20× normal traffic",
                category: "load",
                why: "A spike in requests.",
              },
              {
                id: "disk",
                label: "The orders table no longer fits on one disk",
                category: "data",
                why: "Volume, not requests.",
              },
              {
                id: "backup",
                label: "The nightly backup now takes 30 hours",
                category: "data",
                why: "The data outgrew the process.",
              },
              {
                id: "deploy",
                label: "Every release needs six teams to coordinate",
                category: "people",
                why: "The organisation outgrew the design.",
              },
              {
                id: "break",
                label: "Two teams keep breaking each other's code",
                category: "people",
                why: "Too many people in one codebase.",
              },
            ]}
            explanation="Scale isn't only servers. Traffic, data volume and team size each push a design in different ways, and each has its own fixes."
          />
        </div>
      }
    >
      <p>
        &ldquo;Scaling&rdquo; means more than handling more requests. Data grows, and so do the
        teams building the system.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Checkpoint: the first move ------------------------------------------------------------------ */

export function FirstMove() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Measure before you shard"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="first-move"
            prompt="Brewline has 5,000 users and the app feels slow. The database server's CPU is at 95%; the app server's at 20%. A colleague wants to shard the database. What do you try first?"
            options={[
              {
                id: "measure",
                label:
                  "Find the slowest queries and fix them (an index, fewer queries per page), then consider a bigger database server",
                correct: true,
                feedback:
                  "Right. At 5,000 users the usual culprit is a missing index or a chatty page. Cheap, fast fixes first; sharding brings years of complexity.",
              },
              {
                id: "shard",
                label: "Shard the database across three servers",
                feedback:
                  "It might help, at enormous cost in complexity. Nothing suggests the data or load is too big for one well-tuned server.",
              },
              {
                id: "apps",
                label: "Add more app servers behind a load balancer",
                feedback:
                  "The app servers are at 20%: they aren't the bottleneck. More of them would send even more queries to the busy database.",
              },
              {
                id: "cdn",
                label: "Put the site behind a CDN",
                feedback: "A CDN helps with static files, but the database is the busy part here.",
              },
            ]}
            explanation="Find the actual bottleneck before adding machinery. Most systems need far less architecture than their builders fear."
          />
        </div>
      }
    >
      <p>A common trap: reaching for big-company architecture too early.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS = [
  ["Scale breaks things in turn", "Each order of magnitude exposes a new bottleneck."],
  [
    "Up, then out",
    "Bigger machines are simple but have a ceiling and one point of failure; more machines need stateless code.",
  ],
  [
    "Cheapest fix first",
    "Separate, cache, copy, then split. Sharding is powerful and hard to undo.",
  ],
  ["Load, data and people", "Growth comes in several kinds, each with its own fixes."],
  ["Measure first", "Find the real bottleneck before adding architecture."],
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
      <p>You&apos;ve seen the whole map. Every box in that diagram gets its own module.</p>
      <p>
        Next: how to measure &ldquo;slow&rdquo; properly, with latency, throughput and percentiles.
      </p>
    </StepLayout>
  );
}

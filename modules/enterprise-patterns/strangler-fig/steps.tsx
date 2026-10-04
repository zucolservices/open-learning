"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { OrderCheckpoint } from "@/toolkit/checkpoints/order";
import { Code } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { ROUTES } from "./model";
import type { SfState } from "./state";

/* 2 ─ Strangle it route by route ⭐ --------------------------------------------------------------- */

export function Strangle() {
  const [s, set] = useSceneState<SfState>();
  const moved = s.moved ?? [];
  const verified = s.verified ?? [];
  const pct = ROUTES.filter((r) => moved.includes(r.id)).reduce((n, r) => n + r.traffic, 0);
  const incidents = s.bigbang
    ? ROUTES.filter((r) => r.quirk)
    : ROUTES.filter((r) => r.quirk && moved.includes(r.id) && !verified.includes(r.id));
  const allMoved = moved.length === ROUTES.length;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Strangle it route by route"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div>
            <div className="flex justify-between text-xs">
              <span className="text-muted">traffic on the new system</span>
              <span className="font-mono font-semibold">{s.bigbang ? 100 : pct}%</span>
            </div>
            <div className="bg-surface-2 mt-1 h-2.5 rounded-full">
              <motion.div
                className="bg-viz-add h-full rounded-full"
                animate={{ width: `${s.bigbang ? 100 : pct}%` }}
              />
            </div>
          </div>
          {!s.bigbang && (
            <div className="flex flex-col gap-1.5">
              {ROUTES.map((r) => {
                const isMoved = moved.includes(r.id);
                const isVerified = verified.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className={cn(
                      "grid grid-cols-[8rem_1fr] items-center gap-2 rounded-lg border px-3 py-1.5 sm:grid-cols-[8rem_3rem_1fr]",
                      isMoved ? "border-viz-add/50 bg-viz-add/5" : "border-line bg-surface",
                    )}
                  >
                    <span className="font-mono text-xs">{r.path}</span>
                    <span className="text-muted hidden text-[10px] sm:inline">{r.traffic}%</span>
                    <div className="flex flex-wrap gap-1">
                      {!isMoved && (
                        <>
                          <button
                            type="button"
                            disabled={isVerified}
                            onClick={() => set({ verified: [...verified, r.id] })}
                            className="border-line hover:bg-surface-2 rounded-md border px-2 py-0.5 text-[10px] disabled:opacity-40"
                          >
                            {isVerified ? "parallel run done" : "Parallel run first"}
                          </button>
                          <button
                            type="button"
                            onClick={() => set({ moved: [...moved, r.id] })}
                            className="bg-accent text-accent-fg rounded-md px-2 py-0.5 text-[10px]"
                          >
                            Switch route to new
                          </button>
                        </>
                      )}
                      {isMoved && (
                        <span className="text-viz-add text-[11px]">✓ served by the new system</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-1">
            {ROUTES.filter((r) => r.quirk && verified.includes(r.id) && !s.bigbang).map((r) => (
              <motion.p
                key={r.id + "f"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-good/40 bg-good/5 rounded-lg border px-3 py-1.5 text-xs"
              >
                {r.found}
              </motion.p>
            ))}
            {incidents.map((r) => (
              <motion.p
                key={r.id + "i"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-bad/40 bg-bad/5 rounded-lg border px-3 py-1.5 text-xs"
              >
                Incident: {r.quirk}
              </motion.p>
            ))}
          </div>
          {allMoved && !s.retired && !s.bigbang && (
            <button
              type="button"
              onClick={() => set({ retired: true })}
              className="bg-accent text-accent-fg self-start rounded-md px-3 py-1.5 text-xs font-medium"
            >
              Switch off the legacy system
            </button>
          )}
          {s.retired && (
            <p
              className={cn(
                "rounded-xl border px-4 py-3 text-sm",
                incidents.length ? "border-line bg-surface" : "border-good/50 bg-good/10",
              )}
            >
              Legacy switched off.{" "}
              {incidents.length === 0
                ? "No customer ever noticed the migration."
                : "Done, but customers felt the routes you didn't verify."}
            </p>
          )}
          {s.bigbang && (
            <p className="border-bad/50 bg-bad/10 rounded-xl border px-4 py-3 text-sm">
              Big-bang cut-over weekend: everything switches at once, and every hidden rule surfaces
              in production together, with no easy way back.
            </p>
          )}
          <div className="flex items-center justify-between gap-2">
            {!s.bigbang && moved.length === 0 && (
              <button
                type="button"
                onClick={() => set({ bigbang: true })}
                className="border-bad/50 text-bad rounded-md border border-dashed px-2.5 py-1 text-[11px]"
              >
                Or: cut everything over in one weekend
              </button>
            )}
            {(moved.length > 0 || s.bigbang || verified.length > 0) && (
              <button
                type="button"
                onClick={() => set({ moved: [], verified: [], retired: false, bigbang: false })}
                className="text-muted ml-auto flex items-center gap-1 text-xs"
              >
                <RotateCcw className="size-3" /> Start again
              </button>
            )}
          </div>
          <p className="text-subtle text-[10px]">A fictional pension system. Illustrative.</p>
        </div>
      }
    >
      <p>
        A state pension system has five routes behind a new façade. Move them to the new system one
        at a time. Two hide old rules nobody wrote down. Try moving them with and without a parallel
        run first, or try the big-bang weekend.
      </p>
      <p>
        A <Term id="parallel-run">parallel run</Term> sends real requests to both systems, returns
        the old answer, and records every difference. GitHub open-sourced its tool for this,
        Scientist, in 2016: &ldquo;From the caller&apos;s perspective, nothing has changed.&rdquo;
        Sometimes the difference turns out to be a bug in the old system.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Branch by abstraction ----------------------------------------------------------------------- */

export function BranchByAbstraction() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Branch by abstraction"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            [
              "1. Add an abstraction",
              `class Pricing(Protocol):\n    def price(self, order) -> Money: ...\n\nlegacy = LegacyPricing()   # wraps the old code`,
            ],
            [
              "2. Build the new one behind it",
              `class NewPricing(Pricing): ...\n\npricing = LegacyPricing()  # still live; NewPricing in progress`,
            ],
            [
              "3. Switch, then delete the old",
              `pricing = NewPricing() if flags.new_pricing else LegacyPricing()\n# later: delete LegacyPricing and the flag`,
            ],
          ].map(([t, c], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col gap-1"
            >
              <p className="text-sm font-semibold">{t}</p>
              <Code>{c}</Code>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        A façade only works where you can intercept requests. For a component deep inside a system,
        use <Term id="branch-by-abstraction">branch by abstraction</Term>: in Fowler&apos;s words,
        &ldquo;a technique for making a large-scale change to a software system in gradual way that
        allows you to release the system regularly while the change is still in-progress.&rdquo;
      </p>
      <p>
        Paul Hammant introduced the name in 2007, crediting Stacy Curl, and noted the technique
        itself was long-standing practice. It&apos;s a strangler fig on the inside.
      </p>
    </StepLayout>
  );
}

/* 4 ─ The migration toolkit ----------------------------------------------------------------------- */

const TOOLS: [string, string][] = [
  ["Strangler fig application", "Route requests at a façade, piece by piece."],
  ["UI composition", "Assemble screens from old and new parts."],
  ["Branch by abstraction", "Swap internal components behind an interface."],
  ["Parallel run", "Run both, compare, trust the new one only when they agree."],
  [
    "Decorating collaborator",
    "Add new behaviour around the old system's calls without changing it.",
  ],
  [
    "Change data capture",
    "Copy the old system's data changes to the new one as they happen (module 18).",
  ],
];

export function Toolkit() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="The migration toolkit"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {TOOLS.map(([t, d], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
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
        Sam Newman&apos;s &ldquo;Monolith to Microservices&rdquo; (2019) collects these six patterns
        for splitting a system, plus more for splitting its database. The one-line summaries here
        are ours.
      </p>
      <p>
        All of them need temporary code: façades, adapters, flags and comparisons you&apos;ll delete
        later. Fowler&apos;s 2024 rewrite of his article admits people balk at this
        &ldquo;transitional architecture&rdquo;, but &ldquo;the reduced risk and earlier value from
        the gradual approach outweigh its costs.&rdquo;
      </p>
    </StepLayout>
  );
}

/* 5 ─ In the right order -------------------------------------------------------------------------- */

export function InOrder() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="In the right order"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <OrderCheckpoint
            id="strangler-order"
            prompt="Drag the steps of a strangler-fig migration into order."
            items={[
              {
                id: "facade",
                label: "Put a façade in front of the legacy system, passing everything through",
              },
              { id: "pick", label: "Pick a small, valuable piece to move first" },
              { id: "build", label: "Build that piece in the new system" },
              {
                id: "parallel",
                label: "Parallel run: compare old and new answers on real traffic",
              },
              { id: "switch", label: "Switch that route at the façade" },
              { id: "retire", label: "When every route has moved, switch off the legacy system" },
            ]}
            explanation="Façade first, then small pieces, each verified before its route moves. Retire the old system only when nothing depends on it."
          />
        </div>
      }
    >
      <p>Arrange the migration.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Avoid the big bang", "Rewrites from scratch usually fail."],
  ["Façade first", "Route requests between old and new."],
  ["Small, reversible moves", "One route at a time, switch back if needed."],
  ["Parallel run", "Hidden rules surface before customers find them."],
  ["Transitional code is worth it", "Plan to build it, and to delete it."],
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
      <p>
        Some legacy systems won&apos;t be replaced for years. Next: how to live alongside them
        without inheriting their problems.
      </p>
    </StepLayout>
  );
}

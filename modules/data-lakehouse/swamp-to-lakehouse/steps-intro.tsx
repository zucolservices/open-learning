"use client";

import { motion } from "motion/react";
import { FileBarChart, Split, Store } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { cn } from "@/lib/cn";
import type { SwampState } from "./state";
import { Term } from "@/toolkit/glossary/term";

/* 1 ─ One database, two jobs ------------------------------------------- */

const TILLS = 4;

export function TwoJobs() {
  const [s, set] = useSceneState<SwampState>();
  const contended = s.reportRunning && !s.separated;
  const latency = contended ? 940 : 12;
  const cpu = contended ? 97 : s.reportRunning ? 24 : 18;

  return (
    <StepLayout
      eyebrow="Brewline · a tea-shop chain"
      title="One database, two very different jobs"
      stage={
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => set({ reportRunning: !s.reportRunning })}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition",
                s.reportRunning
                  ? "border-viz-compute bg-viz-compute/15"
                  : "border-line-strong hover:bg-surface-2",
              )}
            >
              <FileBarChart className="size-4" />
              {s.reportRunning ? "Month-end report running…" : "Run the month-end report"}
            </button>
            <button
              type="button"
              onClick={() => set({ separated: !s.separated })}
              className={cn(
                "inline-flex h-9 items-center gap-2 rounded-full border px-4 text-sm transition",
                s.separated
                  ? "border-accent bg-accent text-accent-fg"
                  : "border-line-strong hover:bg-surface-2",
              )}
            >
              <Split className="size-4" />
              {s.separated ? "Analytics has its own system" : "Give analytics its own system"}
            </button>
          </div>

          <svg
            viewBox="0 0 420 220"
            className="w-full"
            role="img"
            aria-label="Tills send small orders to the app database; a big report competes for the same database unless analytics is moved elsewhere."
          >
            {Array.from({ length: TILLS }, (_, i) => {
              const y = 30 + i * 48;
              return (
                <g key={i}>
                  <rect
                    x={8}
                    y={y - 14}
                    width={58}
                    height={28}
                    rx={7}
                    className="fill-surface-2 stroke-line-strong"
                  />
                  <text x={37} y={y + 4} textAnchor="middle" className="fill-fg text-[10px]">
                    till {i + 1}
                  </text>
                  <line x1={68} y1={y} x2={164} y2={110} className="stroke-line-strong" />
                  <motion.circle
                    r={3.5}
                    className="fill-viz-data"
                    animate={{ cx: [68, 164], cy: [y, 110] }}
                    transition={{
                      duration: contended ? 3.2 : 0.9,
                      repeat: Infinity,
                      delay: i * 0.22,
                      ease: "linear",
                    }}
                  />
                </g>
              );
            })}
            <path
              d="M166 78v64c0 7 15 11 34 11s34-4 34-11V78"
              className={cn(
                "stroke-viz-idle transition-colors",
                contended ? "fill-bad/20" : "fill-viz-idle/20",
              )}
              strokeWidth={1.5}
            />
            <ellipse
              cx={200}
              cy={78}
              rx={34}
              ry={11}
              className="fill-surface-2 stroke-viz-idle"
              strokeWidth={1.5}
            />
            <text x={200} y={176} textAnchor="middle" className="fill-fg text-[11px] font-semibold">
              app database
            </text>
            <text
              x={200}
              y={114}
              textAnchor="middle"
              className={cn(
                "font-mono text-[11px] font-semibold",
                contended ? "fill-bad" : "fill-muted",
              )}
            >
              CPU {cpu}%
            </text>

            {/* The report */}
            {s.reportRunning && !s.separated && (
              <motion.rect
                x={236}
                y={98}
                height={24}
                rx={6}
                className="fill-viz-compute/40 stroke-viz-compute"
                initial={{ width: 0 }}
                animate={{ width: 150 }}
              />
            )}
            {s.reportRunning && !s.separated && (
              <text x={312} y={114} textAnchor="middle" className="fill-fg text-[10px]">
                scanning 3 years of orders…
              </text>
            )}

            {s.separated && (
              <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <path d="M236 110h60" className="stroke-accent flow" strokeWidth={2} />
                <text
                  x={266}
                  y={100}
                  textAnchor="middle"
                  className="fill-muted font-mono text-[8px]"
                >
                  nightly copy
                </text>
                <rect
                  x={300}
                  y={78}
                  width={112}
                  height={64}
                  rx={10}
                  className="fill-viz-meta/15 stroke-viz-meta"
                  strokeWidth={1.5}
                />
                <text
                  x={356}
                  y={102}
                  textAnchor="middle"
                  className="fill-fg text-[10px] font-semibold"
                >
                  analytics system
                </text>
                <text
                  x={356}
                  y={120}
                  textAnchor="middle"
                  className={cn("text-[9px]", s.reportRunning ? "fill-viz-compute" : "fill-subtle")}
                >
                  {s.reportRunning ? "report runs here" : "idle"}
                </text>
              </motion.g>
            )}
          </svg>

          <div className="grid grid-cols-2 gap-3">
            <div
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                contended ? "border-bad/40 bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="text-muted flex items-center gap-1.5 text-xs">
                <Store className="size-3.5" /> Checkout time per order
              </p>
              <motion.p
                key={latency}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className={cn(
                  "mt-1 text-3xl font-semibold tabular-nums",
                  contended ? "text-bad" : "text-fg",
                )}
              >
                {latency} ms
              </motion.p>
              <p className="text-muted text-xs">
                {contended ? "Queues at every till." : "Customers barely notice."}
              </p>
            </div>
            <div className="border-line bg-surface rounded-2xl border p-4">
              <p className="text-muted text-xs">What each job needs</p>
              <p className="mt-1 text-sm">
                <span className="text-viz-data font-medium">Orders:</span> thousands of tiny reads
                and writes, fast.
              </p>
              <p className="mt-1 text-sm">
                <span className="text-viz-compute font-medium">Report:</span> one huge scan of years
                of data.
              </p>
            </div>
          </div>
          <p className="text-subtle text-[11px]">Illustrative numbers.</p>
        </div>
      }
    >
      <p>
        Meet <strong>Brewline</strong>, a fictional tea-shop chain. Every till writes orders to one
        app database.
      </p>
      <p>
        At month end, finance wants revenue by city for the last three years. Run that report on the
        same database and see what happens at the tills.
      </p>
      <p>
        Then fix it the way the industry did: give analytics <strong>its own system</strong>. That
        one decision is where this whole story begins.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Sort the questions ------------------------------------------------ */

export function SortQuestions() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="App question or analytics question?"
      stage={
        <div className="flex flex-1 items-center">
          <SortCheckpoint
            id="oltp-olap"
            prompt="Sort each of Brewline's questions."
            categories={[
              { id: "oltp", label: "App (OLTP)" },
              { id: "olap", label: "Analytics (OLAP)" },
            ]}
            items={[
              {
                id: "add",
                label: "Add a masala chai to order #88213",
                category: "oltp",
                why: "One small write to one order, and it must be instant.",
              },
              {
                id: "revenue",
                label: "Total revenue by city for the last 3 years",
                category: "olap",
                why: "It scans millions of orders and aggregates them.",
              },
              {
                id: "points",
                label: "Show this customer's loyalty points at the till",
                category: "oltp",
                why: "A single-record lookup while someone waits.",
              },
              {
                id: "rain",
                label: "Which products sell together on rainy days?",
                category: "olap",
                why: "It joins sales with weather across all stores and all time.",
              },
              {
                id: "stock",
                label: "Reduce stock by 1 when a pastry is sold",
                category: "oltp",
                why: "A tiny update that must be correct even when many tills do it at once.",
              },
              {
                id: "forecast",
                label: "Train a model to forecast demand per store",
                category: "olap",
                why: "Machine learning reads large histories. It's an analytical workload, not a transaction.",
              },
            ]}
            explanation={
              <>
                <Term id="oltp">
                  <strong>OLTP</strong>
                </Term>{" "}
                (online transaction processing) means many small, fast reads and writes of
                individual records.{" "}
                <Term id="olap">
                  <strong>OLAP</strong>
                </Term>{" "}
                (online analytical processing) means big scans and aggregations over lots of
                history. Every architecture in this module is an answer to &ldquo;where should OLAP
                live?&rdquo;
              </>
            }
          />
        </div>
      }
    >
      <p>The two jobs from the last step have names. Sort Brewline&apos;s questions into them.</p>
    </StepLayout>
  );
}

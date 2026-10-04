"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { SYSTEM_NAMES, connections, ring, type Wiring } from "./model";
import type { WhyState } from "./state";

/* 2 ─ Wire them together ⭐ ----------------------------------------------------------------------- */

export function WireThem() {
  const [s, set] = useSceneState<WhyState>();
  const n = s.n;
  const pts = ring(n);
  const links = connections(n, s.wiring);
  const toFix = s.wiring === "p2p" ? n - 1 : 1;
  const lines: [number, number][] = [];
  if (s.wiring === "p2p")
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) lines.push([i, j]);
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Wire them together"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <Segmented<Wiring>
              size="sm"
              value={s.wiring}
              onChange={(wiring) => set({ wiring })}
              options={[
                ["p2p", "Point to point"],
                ["hub", "Through a hub"],
              ]}
            />
            <label className="flex flex-1 items-center gap-2 text-xs">
              <span className="text-muted">systems</span>
              <input
                type="range"
                min={3}
                max={20}
                value={n}
                onChange={(e) => set({ n: Number(e.target.value) })}
                className="accent-accent flex-1"
              />
              <span className="w-6 text-right font-mono">{n}</span>
            </label>
          </div>
          <svg viewBox="0 0 200 200" className="mx-auto w-full max-w-72" aria-hidden>
            {lines.map(([a, b]) => {
              const hot = s.changed && (a === 0 || b === 0);
              return (
                <line
                  key={`${a}-${b}`}
                  x1={pts[a].x}
                  y1={pts[a].y}
                  x2={pts[b].x}
                  y2={pts[b].y}
                  className={hot ? "stroke-bad" : "stroke-line-strong"}
                  strokeWidth={hot ? 1 : 0.5}
                />
              );
            })}
            {s.wiring === "hub" &&
              pts.map((p, i) => (
                <line
                  key={i}
                  x1={100}
                  y1={100}
                  x2={p.x}
                  y2={p.y}
                  className={s.changed && i === 0 ? "stroke-bad" : "stroke-line-strong"}
                  strokeWidth={s.changed && i === 0 ? 1.2 : 0.7}
                />
              ))}
            {s.wiring === "hub" && (
              <rect
                x={86}
                y={90}
                width={28}
                height={20}
                rx={4}
                className="fill-accent/20 stroke-accent"
              />
            )}
            {s.wiring === "hub" && (
              <text x={100} y={103} textAnchor="middle" className="fill-fg font-mono text-[7px]">
                hub
              </text>
            )}
            {pts.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r={5}
                className={cn(
                  i === 0 && s.changed ? "fill-bad/30 stroke-bad" : "fill-surface stroke-viz-data",
                )}
                strokeWidth={1.2}
              >
                <title>{SYSTEM_NAMES[i]}</title>
              </circle>
            ))}
          </svg>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="text-muted text-[10px]">connections to build and run</p>
              <motion.p
                key={links}
                initial={{ opacity: 0.4 }}
                animate={{ opacity: 1 }}
                className="font-mono text-lg font-semibold"
              >
                {links.toLocaleString("en-IN")}
              </motion.p>
            </div>
            <button
              type="button"
              aria-pressed={s.changed}
              onClick={() => set({ changed: !s.changed })}
              className={cn(
                "rounded-lg border px-3 py-2 text-left",
                s.changed ? "border-bad/50 bg-bad/10" : "border-line bg-surface hover:bg-surface-2",
              )}
            >
              <p className="text-muted text-[10px]">
                {s.changed
                  ? "core banking changed its address format"
                  : "change core banking's address format"}
              </p>
              <p className="font-mono text-lg font-semibold">
                {s.changed ? `${toFix} to fix` : "Try it"}
              </p>
            </button>
          </div>
          <p className="text-subtle text-[10px]">
            Counts the worst case, where every system talks to every other. Illustrative.
          </p>
        </div>
      }
    >
      <p>
        Connect systems directly, each to each, and the number of links grows fast: n systems need
        up to n(n−1)/2 of them. Ten systems, 45 links; twenty, 190. Slide and watch.
      </p>
      <p>
        <Term id="point-to-point">Point-to-point</Term> links are quick to build one at a time. The
        trouble comes later: change one system and every link to it may break. A shared hub or a
        common format means each system needs only one connection, and a change touches one adapter.
        Hubs bring their own problems, as module 12 shows.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Three speeds of change ---------------------------------------------------------------------- */

const LAYERS: [string, string, string, string][] = [
  [
    "Systems of record",
    "Core transactions and the organisation's critical master data. Change slowly, often under regulation.",
    "General ledger, core banking, payroll",
    "slow",
  ],
  [
    "Systems of differentiation",
    "What makes this company different. A one-to-three-year life, reconfigured often.",
    "Loan pricing engine, customer app",
    "medium",
  ],
  [
    "Systems of innovation",
    "Experiments for new ideas, usually zero to twelve months.",
    "A chatbot pilot, a new partner offer",
    "fast",
  ],
];

export function ThreeSpeeds() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="Three speeds of change"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-2">
          {LAYERS.map(([t, d, ex, speed], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface grid grid-cols-[3.5rem_1fr] gap-3 rounded-lg border px-3 py-2"
            >
              <div className="flex flex-col items-center justify-center gap-1">
                <div className="flex gap-0.5">
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      className={cn("h-3 w-1.5 rounded-sm", k <= i ? "bg-accent" : "bg-line")}
                    />
                  ))}
                </div>
                <span className="text-muted font-mono text-[9px]">{speed}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted text-xs">{d}</p>
                <p className="text-accent mt-0.5 text-[11px]">e.g. {ex}</p>
              </div>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Not every system should change at the same pace. In 2012 Gartner, borrowing an idea from
        building architecture, proposed sorting applications into three{" "}
        <Term id="pace-layers">pace layers</Term>.
      </p>
      <p>
        The same application can sit in different layers at different companies, and moves between
        them as it matures. The trouble starts when a fast experiment is wired straight into a slow
        system of record, and every change needs both teams.
      </p>
    </StepLayout>
  );
}

/* 4 ─ By the numbers ------------------------------------------------------------------------------ */

const STATS: [string, string, string][] = [
  ["957", "applications in the average organisation", "MuleSoft survey of 1,050 IT leaders, 2026"],
  ["27%", "of them connected to each other", "same survey"],
  ["36%", "of IT teams' time spent building custom integrations", "same survey"],
  ["80%", "of US federal IT spending goes on running existing systems", "GAO, July 2025"],
  [
    "23–60",
    "years old: the 11 US federal legacy systems most in need of replacing",
    "GAO, July 2025",
  ],
];

export function ByNumbers() {
  return (
    <StepLayout
      eyebrow="Explore"
      title="By the numbers"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {STATS.map(([v, d, src], i) => (
            <motion.div
              key={d}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.07 * i }}
              className={cn(
                "border-line bg-surface rounded-xl border px-4 py-3",
                i === 4 && "sm:col-span-2",
              )}
            >
              <p className="text-accent font-mono text-2xl font-semibold">{v}</p>
              <p className="text-sm">{d}</p>
              <p className="text-subtle mt-1 text-[10px]">{src}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Vendor surveys are self-reported, so treat the exact figures loosely. The pattern is
        consistent year after year: hundreds of applications, most of them not connected, and a
        large share of IT effort going into joining them up.
      </p>
      <p>
        And old systems don&apos;t go away. The US Government Accountability Office found the
        federal government spends over $100 billion a year on IT, about 80% of it on operating and
        maintaining existing systems; two of the oldest it reviewed still run on COBOL and assembly
        language. A <Term id="legacy-system">legacy system</Term> is often the one that works best
        and is hardest to change.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which layer? -------------------------------------------------------------------------------- */

export function WhichLayer() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which layer?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="which-layer"
            prompt="At a typical bank, which pace layer does each system belong to?"
            categories={[
              { id: "record", label: "Record" },
              { id: "diff", label: "Differentiation" },
              { id: "innov", label: "Innovation" },
            ]}
            items={[
              {
                id: "ledger",
                label: "The general ledger that holds every account balance",
                category: "record",
                why: "Core transactions, heavily regulated, changes rarely.",
              },
              {
                id: "kyc",
                label: "The master record of each customer's verified identity",
                category: "record",
                why: "Critical master data that everything else depends on.",
              },
              {
                id: "pricing",
                label: "A loan pricing engine tuned to the bank's own risk appetite",
                category: "diff",
                why: "What makes this bank different; reconfigured often.",
              },
              {
                id: "app",
                label: "The customer mobile app, updated every few weeks",
                category: "diff",
                why: "A differentiator that changes regularly.",
              },
              {
                id: "pilot",
                label: "A three-month pilot of voice banking in one city",
                category: "innov",
                why: "A short experiment that may be thrown away.",
              },
            ]}
            explanation="Records change slowly and carefully; differentiators change regularly; experiments change constantly. Keep the fast ones from being welded to the slow ones."
          />
        </div>
      }
    >
      <p>Sort these by how fast they should change. Other banks might place some differently.</p>
    </StepLayout>
  );
}

/* 6 ─ What's ahead -------------------------------------------------------------------------------- */

const AHEAD: [string, string][] = [
  ["People first", "Systems mirror the teams that build them (module 2)."],
  ["Domains and boundaries", "Model the business in pieces with clear edges (modules 3–7)."],
  ["Integrating systems", "Files, calls, messages and the patterns between them (modules 8–12)."],
  ["Architecture styles", "Hexagons, monoliths, microservices, events and data ownership (13–16)."],
  ["Change and legacy", "Replace old systems a piece at a time, and record why (17–20)."],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What's ahead"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {AHEAD.map(([t, d], i) => (
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
        Remember Priya: one fact, many copies, many pipes. Almost every pattern in this track is a
        way to make that picture less fragile.
      </p>
    </StepLayout>
  );
}

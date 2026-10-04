"use client";

import { motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CAP, STEPS, simulate } from "./model";
import type { CtxState } from "./state";

/* 1 ─ A small desk -------------------------------------------------------------------------------- */

export function Desk() {
  return (
    <StepLayout
      eyebrow="Story"
      title="A small desk"
      stage={
        <div className="grid flex-1 content-center gap-3 sm:grid-cols-2">
          <div className="border-bad bg-bad/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">Everything on the desk</p>
            <p className="text-muted mt-1">
              Every paper from a month-long project, piled up. The one you need is somewhere in the
              middle.
            </p>
          </div>
          <div className="border-good bg-good/10 rounded-xl border px-4 py-3 text-xs">
            <p className="text-sm font-semibold">A tidy desk</p>
            <p className="text-muted mt-1">
              Today&apos;s papers, a page of notes, and files in the cabinet you can fetch when you
              need them.
            </p>
          </div>
        </div>
      }
    >
      <p>
        Work on a long project at a small desk and you can&apos;t keep everything on it. Pile it all
        up and you lose track; keep notes, file things away and fetch them when needed, and you can
        work for months.
      </p>
      <p>
        An agent&apos;s context window is that desk. Long tasks produce more text than fits, and
        quality drops as it fills. <Term id="context-engineering">Context engineering</Term> is the
        craft of keeping only the right things on the desk.
      </p>
    </StepLayout>
  );
}

/* 2 ─ A 200-step task ⭐ -------------------------------------------------------------------------- */

export function LongTask() {
  const [s, set] = useSceneState<CtxState>();
  const r = simulate({
    compact: s.compact,
    threshold: s.threshold,
    notes: s.notes,
    subagents: s.subagents,
  });
  const W = 420;
  const H = 130;
  const x = (i: number) => 10 + (i / STEPS) * (W - 20);
  const y = (f: number) => H - 10 - (f / CAP) * (H - 20);
  const ok = r.failedAt === null;
  return (
    <StepLayout
      eyebrow="Simulation"
      title="A 200-step task"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <p className="text-muted text-xs">
            Task: update 40 services to a new library version: read code, edit, run tests, 200 steps
            in all. The context window holds 200k tokens.
          </p>
          <div className="flex flex-wrap gap-3 text-xs">
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.compact}
                onChange={(e) => set({ compact: e.target.checked })}
                className="accent-accent"
              />
              Compact (summarise) at
            </label>
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={s.threshold}
              disabled={!s.compact}
              onChange={(e) => set({ threshold: Number(e.target.value) })}
              className="accent-accent w-24 disabled:opacity-40"
              aria-label="Compaction threshold"
            />
            <span className="font-mono">{s.threshold}%</span>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.notes}
                onChange={(e) => set({ notes: e.target.checked })}
                className="accent-accent"
              />
              Keep a notes file
            </label>
            <label className="flex items-center gap-1.5">
              <input
                type="checkbox"
                checked={s.subagents}
                onChange={(e) => set({ subagents: e.target.checked })}
                className="accent-accent"
              />
              Sub-agents read the code
            </label>
          </div>
          <div className="border-line bg-surface rounded-xl border p-2">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full"
              role="img"
              aria-label="Context window fill over the task"
            >
              <line
                x1={10}
                y1={y(CAP)}
                x2={W - 10}
                y2={y(CAP)}
                className="stroke-bad"
                strokeDasharray="3 3"
              />
              <text x={W - 10} y={y(CAP) - 3} textAnchor="end" className="fill-bad text-[9px]">
                window full
              </text>
              {s.compact && (
                <line
                  x1={10}
                  y1={y((s.threshold / 100) * CAP)}
                  x2={W - 10}
                  y2={y((s.threshold / 100) * CAP)}
                  className="stroke-accent"
                  strokeDasharray="2 3"
                />
              )}
              <polyline
                points={r.series.map((f, i) => `${x(i)},${y(f)}`).join(" ")}
                className="stroke-viz-data fill-none"
                strokeWidth={1.6}
              />
              {!ok && <circle cx={x(r.failedAt!)} cy={y(CAP)} r={4} className="fill-bad" />}
              <text x={10} y={H - 1} className="fill-muted text-[9px]">
                step 0
              </text>
              <text x={W - 10} y={H - 1} textAnchor="end" className="fill-muted text-[9px]">
                step 200
              </text>
            </svg>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                ok ? "border-good bg-good/10" : "border-bad bg-bad/10",
              )}
            >
              <p className="font-mono text-lg font-semibold">{ok ? "200" : r.failedAt}</p>
              <p className="text-muted">{ok ? "steps done" : "steps before full"}</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{Math.round(r.quality * 100)}%</p>
              <p className="text-muted">avg step quality</p>
            </div>
            <div
              className={cn(
                "rounded-lg border px-3 py-2",
                r.lost ? "border-bad bg-bad/10" : "border-line bg-surface",
              )}
            >
              <p className="font-mono text-lg font-semibold">{r.lost}</p>
              <p className="text-muted">details lost</p>
            </div>
            <div className="border-line bg-surface rounded-lg border px-3 py-2">
              <p className="font-mono text-lg font-semibold">{(r.read / 1000).toFixed(1)}M</p>
              <p className="text-muted">tokens read</p>
            </div>
          </div>
          <p className="text-subtle text-[10px]">
            Illustrative model: quality falls as the window fills; each compaction without notes
            drops a few decisions.
          </p>
        </div>
      }
    >
      <p>
        With no help, the context fills and the run dies partway.{" "}
        <Term id="compaction">Compaction</Term> summarises the history and starts a fresh window,
        but each summary can drop details, such as which services are already done, unless the agent
        also keeps notes outside the window.
      </p>
      <p>
        Sub-agents help most: they read the code in their own clean windows and hand back short
        summaries, so the main agent&apos;s desk stays clear. Every token in the window is re-read
        on every step, so a fuller window also costs more.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Bigger isn't better ------------------------------------------------------------------------- */

export function Rot() {
  const pts = [0.75, 0.62, 0.54, 0.52, 0.55, 0.63, 0.78];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Bigger isn't better"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="border-line bg-surface rounded-xl border p-3">
            <p className="text-muted text-[10px]">
              ACCURACY BY WHERE THE KEY FACT SITS IN A LONG PROMPT (SHAPE ONLY)
            </p>
            <div className="mt-2 flex h-28 items-end gap-2">
              {pts.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${p * 100}%` }}
                  transition={{ delay: 0.06 * i }}
                  className={cn(
                    "flex-1 rounded-t-sm",
                    i === 0 || i === pts.length - 1 ? "bg-accent" : "bg-viz-data/60",
                  )}
                />
              ))}
            </div>
            <div className="text-muted mt-1 flex justify-between text-[10px]">
              <span>start</span>
              <span>middle</span>
              <span>end</span>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Models have grown huge context windows, but more context isn&apos;t perfect memory. The
        &ldquo;Lost in the Middle&rdquo; study (2023, published 2024) found models used facts at the
        start and end of a long prompt far better than those in the middle.
      </p>
      <p>
        A 2025 report from Chroma tested 18 models and found they all became less reliable as inputs
        grew, sometimes called context rot. Hence Anthropic&apos;s advice to aim for &ldquo;the
        smallest possible set of high-signal tokens&rdquo;.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Four ways to keep going --------------------------------------------------------------------- */

export function Techniques() {
  const items: [string, string, string][] = [
    [
      "Compaction",
      "Summarise the history and continue in a fresh window.",
      "Claude Code's /compact; compaction in the Claude and OpenAI APIs.",
    ],
    [
      "Notes outside the window",
      "Keep a to-do list, NOTES.md or progress log the agent re-reads.",
      "Anthropic uses a progress file plus git history for multi-day coding.",
    ],
    [
      "Sub-agents",
      "Hand a self-contained job to a helper with its own window; get back a short summary.",
      "Often 1,000–2,000 tokens back from a long exploration.",
    ],
    [
      "Just in time",
      "Keep pointers (file paths, links, queries) and load content only when needed.",
      "Like keeping the filing cabinet, not the files, on the desk.",
    ],
  ];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four ways to keep going"
      stage={
        <div className="grid flex-1 content-center gap-2 sm:grid-cols-2">
          {items.map(([t, d, e], i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="border-line bg-surface rounded-lg border px-3 py-2 text-xs"
            >
              <p className="font-semibold">{t}</p>
              <p className="mt-0.5">{d}</p>
              <p className="text-muted mt-1">{e}</p>
            </motion.div>
          ))}
        </div>
      }
    >
      <p>
        Anthropic&apos;s September 2025 guide to context engineering for agents describes these four
        techniques. They combine well: a long-running agent might keep notes, compact when the
        window fills, and send exploration to sub-agents.
      </p>
      <p>
        The cost trade-off is real. Anthropic measured agents using about four times the tokens of a
        chat, and multi-agent systems about fifteen times.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Which technique? ---------------------------------------------------------------------------- */

export function WhichTechnique() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which technique?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="context-technique"
            prompt="Which technique fits each situation best?"
            categories={[
              { id: "compact", label: "Compaction" },
              { id: "notes", label: "Notes file" },
              { id: "sub", label: "Sub-agent" },
              { id: "jit", label: "Just in time" },
            ]}
            items={[
              {
                id: "full",
                label: "The window is 90% full in the middle of a long session",
                category: "compact",
                why: "Summarise and continue.",
              },
              {
                id: "days",
                label: "Decisions must survive until tomorrow's session",
                category: "notes",
                why: "Written down outside the window.",
              },
              {
                id: "read",
                label: "Read 30 files, but only the conclusions matter",
                category: "sub",
                why: "A helper reads; the main agent gets a summary.",
              },
              {
                id: "logs",
                label: "Huge log files that may or may not be needed",
                category: "jit",
                why: "Keep the path; open them only if needed.",
              },
            ]}
            explanation="Compact when the window fills, write notes for what must survive, send heavy reading to sub-agents, and load bulky material only when needed."
          />
        </div>
      }
    >
      <p>Sort the situations.</p>
    </StepLayout>
  );
}

/* 6 ─ Wrap ---------------------------------------------------------------------------------------- */

const POINTS: [string, string][] = [
  ["Context is a small desk", "Quality drops as it fills."],
  ["Compact", "Summarise and start fresh."],
  ["Write notes", "So details survive compaction."],
  ["Delegate reading", "Sub-agents return short summaries."],
  ["Load just in time", "Keep pointers, not piles."],
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
      <p>Next: agents that survive crashes, wait for approval and pick up where they left off.</p>
    </StepLayout>
  );
}

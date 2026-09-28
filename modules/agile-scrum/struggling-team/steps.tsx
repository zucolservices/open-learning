"use client";

import { motion } from "motion/react";
import { Check, Pin } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { DAYS, type Result } from "../kanban-wip/model";
import { BEFORE, BOARD, CHANGES, MAX_CHANGES, after } from "./case";
import type { CaseState } from "./state";

/* Charts ------------------------------------------------------------------------------------------ */

const W = 320;
const H = 150;
const L = 28;
const R = 312;
const T = 10;
const B = 128;

function Cfd({ r }: { r: Result }) {
  const days = Array.from({ length: DAYS }, (_, d) => d);
  const count = (f: (i: Result["items"][number]) => number | undefined) =>
    days.map((d) => r.items.filter((i) => (f(i) ?? Infinity) <= d).length);
  const arrived = count((i) => i.arrive);
  const started = count((i) => i.start);
  const tested = count((i) => i.testStart);
  const done = count((i) => i.finish);
  const max = arrived[DAYS - 1] + 2;
  const x = (i: number) => L + (i / (DAYS - 1)) * (R - L);
  const y = (v: number) => B - (v / max) * (B - T);
  const band = (top: number[], bottom: number[]) =>
    top.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ") +
    " " +
    bottom
      .map((v, i) => [v, i] as const)
      .reverse()
      .map(([v, i]) => `L${x(i)},${y(v)}`)
      .join(" ") +
    " Z";
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-label="Cumulative flow diagram"
    >
      <line x1={L} y1={B} x2={R} y2={B} className="stroke-line-strong" />
      <path d={band(arrived, started)} className="fill-viz-idle/40" />
      <path d={band(started, tested)} className="fill-viz-data/50" />
      <path d={band(tested, done)} className="fill-viz-compute/50" />
      <path
        d={band(
          done,
          days.map(() => 0),
        )}
        className="fill-good/50"
      />
      <text x={(L + R) / 2} y={B + 16} textAnchor="middle" className="fill-muted text-[8px]">
        day (last 60 days)
      </text>
    </svg>
  );
}

const CFD_KEY: [string, string][] = [
  ["bg-viz-idle/40", "To do"],
  ["bg-viz-data/50", "Develop"],
  ["bg-viz-compute/50", "Test"],
  ["bg-good/50", "Done"],
];

function Scatter({ r }: { r: Result }) {
  const pts = r.items
    .filter((i) => i.finish !== undefined)
    .map((i) => ({ d: i.finish!, c: i.finish! - i.start! + 1 }));
  const max = Math.max(10, ...pts.map((p) => p.c)) + 2;
  const x = (d: number) => L + (d / DAYS) * (R - L);
  const y = (v: number) => B - (v / max) * (B - T);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-lg"
      role="img"
      aria-label="Cycle-time scatterplot"
    >
      <line x1={L} y1={B} x2={R} y2={B} className="stroke-line-strong" />
      <line x1={L} y1={B} x2={L} y2={T} className="stroke-line-strong" />
      {[0, 10, 20, 30, 40]
        .filter((v) => v < max)
        .map((v) => (
          <text key={v} x={L - 4} y={y(v) + 3} textAnchor="end" className="fill-muted text-[8px]">
            {v}
          </text>
        ))}
      {pts.map((p, i) => (
        <circle key={i} cx={x(p.d)} cy={y(p.c)} r={3} className="fill-accent/70" />
      ))}
      <text x={(L + R) / 2} y={B + 16} textAnchor="middle" className="fill-muted text-[8px]">
        day finished · height = days from start to finish
      </text>
    </svg>
  );
}

/* 1 ─ The case -------------------------------------------------------------------------------------- */

export function TheCase() {
  return (
    <StepLayout
      eyebrow="Capstone"
      title="The case"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          {[
            ["The client", "“We asked for the new claims flow two months ago. What's happening?”"],
            ["The manager", "“Everyone's busy all day. We need more people, or a better tool.”"],
            ["A developer", "“I'm working on about fifteen things. I finish none of them.”"],
          ].map(([who, q], i) => (
            <motion.blockquote
              key={who}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 * i }}
              className="border-accent bg-surface rounded-r-xl border-l-4 px-4 py-2.5 text-sm"
            >
              {q}
              <span className="text-muted mt-1 block text-[11px]">{who}</span>
            </motion.blockquote>
          ))}
        </div>
      }
    >
      <p>
        Team Falcon builds an insurance claims app. They say they do Scrum: every event is in the
        calendar. But delivery is slow, the client is frustrated and people are unhappy.
      </p>
      <p>
        You&apos;ve been asked to help. Think like a good doctor: examine first, diagnose second,
        treat last. Everyone already has a theory; your job is to follow the evidence.
      </p>
      <p className="text-muted text-xs">
        The team and notes are made up. The flow data comes from the same board simulation as the
        Kanban module.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Gather the evidence ⭐ ---------------------------------------------------------------------- */

const CLUES: Record<string, { tab: string; label: string; meaning: string }> = {
  wip: {
    tab: "board",
    label: `${BOARD.dev} items in Develop, shared by 3 developers`,
    meaning: "Everyone juggles over a dozen things. Switching between them eats the day.",
  },
  test: {
    tab: "board",
    label: "The Test column is empty",
    meaning: "The tester is waiting. Testing isn't the hold-up yet: work rarely gets that far.",
  },
  age: {
    tab: "board",
    label: `Oldest item started ${BOARD.oldest} days ago`,
    meaning: "Work Item Age: an early warning you can read before anything finishes.",
  },
  band: {
    tab: "cfd",
    label: "The Develop band keeps widening",
    meaning: "More is started than finished, week after week: work in progress is growing.",
  },
  flat: {
    tab: "cfd",
    label: "The Done line is nearly flat",
    meaning: "Very little is finishing. Busy isn't the same as productive.",
  },
  rise: {
    tab: "scatter",
    label: "Cycle times keep climbing",
    meaning: "The longer the pile grows, the longer each item takes. Few items finish at all.",
  },
  sales: {
    tab: "retro",
    label: "“Sales message developers directly with urgent asks”",
    meaning: "Work bypasses the Product Owner, so nobody weighs it against the Sprint Goal.",
  },
  big: {
    tab: "retro",
    label: "“The payments revamp story has been open six weeks”",
    meaning: "Stories are far too big to finish in a Sprint.",
  },
  quiet: {
    tab: "retro",
    label: "Four notes say “Nothing to add”",
    meaning:
      "Most people stay quiet while the manager runs the retro: a sign of low psychological safety.",
  },
};

const RETRO = [
  {
    id: "sales",
    text: "Sales message developers directly with urgent asks",
    tone: "bg-viz-compute/20",
  },
  { id: "big", text: "The payments revamp story has been open six weeks", tone: "bg-viz-data/20" },
  { id: "", text: "Same three actions as last retro", tone: "bg-viz-meta/20" },
  { id: "quiet", text: "Nothing to add ×4", tone: "bg-viz-idle/30" },
];

function ClueButton({
  id,
  s,
  set,
}: {
  id: string;
  s: CaseState;
  set: (p: Partial<CaseState>) => void;
}) {
  const on = s.clues.includes(id);
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => set({ clues: on ? s.clues.filter((c) => c !== id) : [...s.clues, id] })}
      className={cn(
        "flex items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-left text-xs",
        on ? "border-accent bg-accent-soft" : "border-line bg-surface hover:bg-surface-2",
      )}
    >
      <Pin className={cn("mt-0.5 size-3 shrink-0", on ? "text-accent" : "text-muted")} />
      {CLUES[id].label}
    </button>
  );
}

export function Evidence() {
  const [s, set] = useSceneState<CaseState>();
  const tabClues = Object.entries(CLUES)
    .filter(([, c]) => c.tab === s.tab)
    .map(([id]) => id);
  return (
    <StepLayout
      eyebrow="Investigate"
      title="Gather the evidence"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.tab}
            options={[
              ["board", "Board"],
              ["cfd", "Cumulative flow"],
              ["scatter", "Cycle times"],
              ["retro", "Retro notes"],
            ]}
            onChange={(v) => set({ tab: v })}
          />
          <motion.div
            key={s.tab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-40"
          >
            {s.tab === "board" && (
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  ["To do", BOARD.todo],
                  ["Develop", BOARD.dev],
                  ["Test", BOARD.test],
                  ["Done", BOARD.done],
                ].map(([c, k]) => (
                  <div key={c} className="bg-surface-2 flex flex-col gap-1 rounded-lg p-1.5">
                    <span className="text-muted text-[10px]">
                      {c} · {k}
                    </span>
                    <div className="flex flex-wrap gap-0.5">
                      {Array.from({ length: k as number }, (_, i) => (
                        <span
                          key={i}
                          className={cn(
                            "h-2.5 w-3.5 rounded-sm",
                            c === "Done"
                              ? "bg-good/60"
                              : c === "Develop"
                                ? "bg-viz-data/60"
                                : "bg-line-strong",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {s.tab === "cfd" && (
              <div>
                <Cfd r={BEFORE} />
                <div className="text-muted flex flex-wrap gap-x-3 text-[10px]">
                  {CFD_KEY.map(([c, l]) => (
                    <span key={l} className="flex items-center gap-1">
                      <span className={cn("size-2 rounded-sm", c)} />
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {s.tab === "scatter" && <Scatter r={BEFORE} />}
            {s.tab === "retro" && (
              <div className="grid grid-cols-2 gap-2">
                {RETRO.map((n) => (
                  <div key={n.text} className={cn("rounded-md p-2.5 text-xs shadow-sm", n.tone)}>
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
          <div>
            <p className="text-muted mb-1 text-xs">Pin anything that looks important:</p>
            <div className="flex flex-col gap-1.5">
              {tabClues.map((id) => (
                <ClueButton key={id} id={id} s={s} set={set} />
              ))}
            </div>
          </div>
          {s.clues.length > 0 && (
            <div className="border-line bg-surface rounded-xl border px-3 py-2">
              <p className="text-xs font-semibold">Your notebook</p>
              <ul className="mt-1 flex flex-col gap-1">
                {s.clues.map((id) => (
                  <li key={id} className="flex gap-1.5 text-[11px]">
                    <Check className="text-accent mt-0.5 size-3 shrink-0" />
                    <span>
                      <span className="font-medium">{CLUES[id].label}.</span>{" "}
                      <span className="text-muted">{CLUES[id].meaning}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      }
    >
      <p>
        Four sources of evidence: the board today, the <Term id="cfd">cumulative flow diagram</Term>
        , the cycle times of finished items, and the last retrospective&apos;s notes. Look through
        each and pin what matters; your notebook explains each clue.
      </p>
      <p className="text-muted text-sm">
        Tip: <Term id="wip">work in progress</Term> and{" "}
        <Term id="work-item-age">the age of the oldest items</Term> tell you about trouble before
        anything finishes.
      </p>
    </StepLayout>
  );
}

/* 3 ─ What's really wrong? -------------------------------------------------------------------- */

export function Diagnose() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="What's really wrong?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="diagnose"
            prompt="Which explanations does the evidence support?"
            categories={[
              { id: "yes", label: "Supported" },
              { id: "no", label: "Not supported" },
            ]}
            items={[
              {
                id: "wip",
                label: "Far too much work in progress",
                category: "yes",
                why: "Dozens of items in Develop, a widening band on the CFD, and a developer juggling about fifteen things.",
              },
              {
                id: "tester",
                label: "The tester is too slow",
                category: "no",
                why: "The Test column is empty: work hardly reaches testing. Blaming one person hides the system problem.",
              },
              {
                id: "big",
                label: "Stories are too big",
                category: "yes",
                why: "A story open for six weeks, and cycle times of a month or more.",
              },
              {
                id: "side",
                label: "Side requests bypass the Product Owner",
                category: "yes",
                why: "The retro note: sales message developers directly, so extra work lands without the PO weighing it.",
              },
              {
                id: "lazy",
                label: "People aren't working hard enough",
                category: "no",
                why: "Everyone is busy all day. The problem is how work flows, not effort.",
              },
              {
                id: "tool",
                label: "The team needs a better tool",
                category: "no",
                why: "Nothing in the evidence points to the tool; the habits would follow into any tool.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Everyone had a theory: more people, a better tool, a slow tester. Sort each explanation by
        whether the evidence supports it.
      </p>
      <p className="text-muted text-sm">
        A useful habit here is Toyota&apos;s &ldquo;ask why five times&rdquo;, made famous by
        Taiichi Ohno: why is delivery slow? Too much in progress. Why? New work starts whenever it
        arrives. Why? Nobody limits it, and requests skip the PO…
      </p>
    </StepLayout>
  );
}

/* 4 ─ Choose the first changes ⭐ (simulation) ------------------------------------------------ */

export function Treat() {
  const [s, set] = useSceneState<CaseState>();
  const res = after(s.changes);
  const toggle = (id: string) =>
    set({
      changes: s.changes.includes(id)
        ? s.changes.filter((c) => c !== id)
        : s.changes.length < MAX_CHANGES
          ? [...s.changes, id]
          : s.changes,
    });
  const tile = (k: string, before: string, now: string, better: boolean) => (
    <div key={k} className="border-line bg-surface rounded-lg border px-2 py-1.5 text-center">
      <p className="text-muted text-[10px]">{k}</p>
      <p className="text-sm font-semibold tabular-nums">
        <span className="text-muted font-normal line-through">{before}</span>{" "}
        <span className={better ? "text-good" : ""}>{now}</span>
      </p>
    </div>
  );
  const swarmOnly = s.changes.includes("swarm") && !s.changes.includes("wip");
  return (
    <StepLayout
      eyebrow="Simulation"
      title="Choose the first changes"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <p className="text-muted text-xs">
            Pick up to {MAX_CHANGES} changes to start with ({s.changes.length} chosen):
          </p>
          <div className="flex flex-col gap-1.5">
            {CHANGES.map((c) => {
              const on = s.changes.includes(c.id);
              const full = !on && s.changes.length >= MAX_CHANGES;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="checkbox"
                  aria-checked={on}
                  disabled={full}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-left text-xs",
                    on
                      ? "border-accent bg-accent-soft"
                      : "border-line bg-surface hover:bg-surface-2",
                    full && "opacity-40",
                  )}
                >
                  <span className="font-medium">{c.label}</span>
                  {on && <span className="text-muted mt-0.5 block text-[11px]">{c.note}</span>}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {tile(
              "Avg cycle time",
              `${BEFORE.avgCycle.toFixed(0)}d`,
              `${res.avgCycle.toFixed(1)}d`,
              res.avgCycle < BEFORE.avgCycle - 1,
            )}
            {tile(
              "Items finished",
              `${BEFORE.finished}`,
              `${res.finished}`,
              res.finished > BEFORE.finished,
            )}
            {tile(
              "Avg in progress",
              `${BEFORE.avgWip.toFixed(0)}`,
              `${res.avgWip.toFixed(0)}`,
              res.avgWip < BEFORE.avgWip - 1,
            )}
            {tile(
              "Oldest item",
              `${BEFORE.oldestAge}d`,
              `${res.oldestAge}d`,
              res.oldestAge < BEFORE.oldestAge - 1,
            )}
          </div>
          <div>
            <p className="text-muted text-[10px]">
              Cumulative flow after the changes (days 20–60 measured)
            </p>
            <Cfd r={res} />
          </div>
          {swarmOnly && (
            <p className="text-muted text-xs">
              Helping with testing changed almost nothing: testing wasn&apos;t the constraint yet.
              Limit work in progress first, and then the Test step becomes the one to help.
            </p>
          )}
        </div>
      }
    >
      <p>
        Real teams can&apos;t change everything at once, so choose up to three changes and see how
        the same board would have run. Try different combinations.
      </p>
      <p>
        Eliyahu Goldratt&apos;s <Term id="theory-of-constraints">Theory of Constraints</Term> fits:
        find the constraint, make the most of it, subordinate everything else to it, then elevate
        it, and start again. Fix one constraint and the next one appears.
      </p>
      <p className="text-muted text-xs">
        Flow numbers come from the module 13 board model; people-side changes aren&apos;t modelled.
      </p>
    </StepLayout>
  );
}

/* 5 ─ Wrap --------------------------------------------------------------------------------------- */

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <blockquote className="border-accent bg-surface rounded-r-xl border-l-4 px-4 py-3 text-sm">
            &ldquo;Regardless of what we discover, we understand and truly believe that everyone did
            the best job they could, given what they knew at the time, their skills and abilities,
            the resources available, and the situation at hand.&rdquo;
            <span className="text-muted mt-1 block text-xs">
              The Retrospective Prime Directive, Norm Kerth (2001), commonly quoted form
            </span>
          </blockquote>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Stop starting, start finishing</p>
              <p className="text-muted mt-1 text-xs">
                A well-known Kanban slogan, and the single biggest fix for Team Falcon.
              </p>
            </div>
            <div className="border-line bg-surface rounded-xl border px-4 py-3">
              <p className="text-sm font-semibold">Safety first</p>
              <p className="text-muted mt-1 text-xs">
                Google&apos;s Project Aristotle (2015) found psychological safety &ldquo;far and
                away the most important&rdquo; of five team dynamics.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <p>
        Diagnose from evidence, not opinion. Look at the system (how work flows, where requests come
        from, whether people feel safe to speak) before blaming a person or buying a tool.
      </p>
      <p>
        That completes the Agile &amp; Scrum track: from why plans break, through Scrum and Kanban,
        to running a Sprint and helping a team that&apos;s stuck. The ideas travel to any team and
        any tool.
      </p>
    </StepLayout>
  );
}

"use client";

import { AnimatePresence, motion } from "motion/react";
import { Footprints, RotateCcw } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { EPIC, FITS, PATTERNS, split } from "./model";
import type { SplitState } from "./state";

/* 1 ─ Slice the cake -------------------------------------------------------------------------------- */

const LAYERS = [
  ["Screens", "fill-viz-meta/30 stroke-viz-meta"],
  ["Logic", "fill-viz-compute/30 stroke-viz-compute"],
  ["Data", "fill-viz-data/30 stroke-viz-data"],
] as const;

export function Cake() {
  const [s, set] = useSceneState<SplitState>();
  const v = s.cut === "vertical";
  const h = s.cut === "horizontal";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Slice the cake"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <Segmented
            size="sm"
            value={s.cut}
            options={[
              ["none", "Whole cake"],
              ["horizontal", "Slice by layer"],
              ["vertical", "Slice top to bottom"],
            ]}
            onChange={(c) => set({ cut: c })}
          />
          <div className="border-line bg-surface rounded-xl border p-3">
            <svg
              viewBox="0 0 320 170"
              className="mx-auto w-full max-w-md"
              role="img"
              aria-label="A three-layer cake"
            >
              {LAYERS.map(([name, cls], i) => (
                <g key={name}>
                  <text x={44} y={52 + i * 40} textAnchor="end" className="fill-muted text-[9px]">
                    {name}
                  </text>
                  <motion.g
                    animate={{
                      x: h && i === 0 ? 24 : 0,
                      y: h && i === 0 ? -18 : 0,
                      opacity: v ? 0.35 : 1,
                    }}
                  >
                    <rect x={52} y={30 + i * 40} width={190} height={36} rx={6} className={cls} />
                  </motion.g>
                </g>
              ))}
              <AnimatePresence>
                {v && (
                  <motion.g
                    key="slice"
                    initial={{ x: -210, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {LAYERS.map(([name, cls], i) => (
                      <rect
                        key={name}
                        x={262}
                        y={30 + i * 40}
                        width={40}
                        height={36}
                        rx={6}
                        className={cls}
                        strokeWidth={2}
                      />
                    ))}
                  </motion.g>
                )}
              </AnimatePresence>
              {v && (
                <text
                  x={282}
                  y={160}
                  textAnchor="middle"
                  className="fill-good text-[9px] font-semibold"
                >
                  a real slice
                </text>
              )}
              {h && (
                <text
                  x={170}
                  y={10}
                  textAnchor="middle"
                  className="fill-bad text-[9px] font-semibold"
                >
                  just the icing
                </text>
              )}
            </svg>
          </div>
          <p
            className={cn(
              "rounded-xl border px-3 py-2 text-sm",
              v
                ? "border-good/40 bg-good/10"
                : h
                  ? "border-bad/40 bg-bad/10"
                  : "border-line bg-surface-2",
            )}
          >
            {v
              ? "A thin slice through every layer: a small feature a citizen can actually use. Bill Wake: “slice vertically through the layers.”"
              : h
                ? "“Build all the screens” is small-ish, but nobody can use screens with nothing behind them. Gojko Adzic: “no sane person would eat only the lettuce.”"
                : "A feature needs every layer: screens, logic and data. How you cut it decides whether each piece is worth anything."}
          </p>
        </div>
      }
    >
      <p>
        You can cut a layer cake two ways. Take the top layer and you get only icing. Cut top to
        bottom and every slice is a proper piece of cake, just smaller.
      </p>
      <p>
        Big backlog items are the same. Richard Lawrence: &ldquo;Many new agile teams attempt to
        split stories by architectural layer… This may satisfy small, but it fails at independent
        and valuable.&rdquo;
      </p>
      <p className="text-muted text-sm">
        Good splits are <Term id="vertical-slice">vertical slices</Term>.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Split the big feature ⭐ (sandbox) ------------------------------------------------------------ */

export function Sandbox() {
  const [s, set] = useSceneState<SplitState>();
  const { stories, rest } = split(s.applied);
  const trap = s.applied.includes("layers");
  const allFit = !trap && rest <= FITS && stories.every((x) => x.size <= FITS);
  return (
    <StepLayout
      eyebrow="Sandbox"
      title="Split the big feature"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-accent/40 bg-accent-soft rounded-xl border px-3 py-2">
            <p className="text-muted text-[10px] uppercase">The big feature · {EPIC.size} points</p>
            <p className="text-sm">{EPIC.text}</p>
          </div>
          <div>
            <p className="mb-1 text-xs font-semibold">Apply a splitting pattern:</p>
            <div className="grid gap-1.5 sm:grid-cols-3">
              {PATTERNS.map((p) => {
                const on = s.applied.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      set({
                        applied: on
                          ? s.applied.filter((x) => x !== p.id)
                          : p.trap
                            ? ["layers"]
                            : [...s.applied.filter((x) => x !== "layers"), p.id],
                      })
                    }
                    className={cn(
                      "rounded-xl border px-2.5 py-2 text-left",
                      on
                        ? p.trap
                          ? "border-bad bg-bad/10"
                          : "border-accent bg-accent-soft"
                        : p.trap
                          ? "border-bad/30 border-dashed"
                          : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    <span className="block text-xs font-semibold">{p.name}</span>
                    <span className="text-muted block text-[10px] leading-snug">{p.idea}</span>
                    <span className="text-subtle block text-[9px]">{p.source}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">
              Stories so far ({stories.length + (rest > 0 && !trap ? 1 : 0)})
            </p>
            {s.applied.length > 0 && (
              <button
                type="button"
                onClick={() => set({ applied: [] })}
                className="text-muted hover:text-fg flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="size-3" /> start again
              </button>
            )}
          </div>
          <div className="grid gap-1">
            <AnimatePresence>
              {stories.map((st) => (
                <motion.div
                  key={st.text}
                  layout
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[11px]",
                    !st.valuable ? "border-bad/40 bg-bad/5" : "border-line bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 min-w-5 shrink-0 place-items-center rounded px-1 font-mono text-[10px]",
                      st.size <= FITS ? "bg-good/20 text-good" : "bg-bad/15 text-bad",
                    )}
                  >
                    {st.size}
                  </span>
                  <span className="flex-1">{st.text}</span>
                  {st.skeleton && (
                    <span className="text-accent flex items-center gap-1 text-[9px] font-semibold">
                      <Footprints className="size-3" /> walking skeleton
                    </span>
                  )}
                  {!st.valuable && <span className="text-bad text-[9px]">no value alone</span>}
                </motion.div>
              ))}
            </AnimatePresence>
            {!trap && rest > 0 && (
              <div className="border-line-strong flex items-center gap-2 rounded-lg border border-dashed px-2.5 py-1.5 text-[11px]">
                <span
                  className={cn(
                    "grid h-5 min-w-5 shrink-0 place-items-center rounded px-1 font-mono text-[10px]",
                    rest <= FITS ? "bg-good/20 text-good" : "bg-bad/15 text-bad",
                  )}
                >
                  {rest}
                </span>
                <span className="text-muted flex-1">
                  The rest of the big feature, not yet split
                </span>
              </div>
            )}
          </div>
          <p
            className={cn(
              "rounded-xl border px-3 py-2 text-xs",
              trap
                ? "border-bad/40 bg-bad/10"
                : allFit
                  ? "border-good/40 bg-good/10"
                  : "border-line bg-surface-2",
            )}
          >
            {trap
              ? "Three stories, none usable on its own, each 15 points and dependent on the others. That's the horizontal trap: small-ish, but not independent or valuable."
              : allFit
                ? `Every piece is ${FITS} points or less and delivers something usable. Most teams would start with the walking skeleton, then order the rest by value.`
                : s.applied.length === 0
                  ? "Try Workflow steps first: it gives you the thinnest end-to-end path."
                  : `Keep going: the remainder is still ${rest} points, too big for a Sprint.`}
          </p>
        </div>
      }
    >
      <p>
        This feature is far too big for one Sprint. Apply splitting patterns, one at a time, and
        watch it break into thin slices that still work end to end.
      </p>
      <p className="text-muted text-sm">
        The patterns come from Mike Cohn&apos;s SPIDR (Spike, Paths, Interfaces, Data, Rules) and
        Richard Lawrence&apos;s story-splitting patterns. Lawrence&apos;s advice on spikes: use them
        last, because they should be your last resort.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Good split or bad split? ------------------------------------------------------------------ */

export function SplitMyths() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Good split or bad split?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="split-myths"
            prompt="Sort each way of splitting the certificate feature."
            categories={[
              { id: "good", label: "Good split" },
              { id: "bad", label: "Bad split" },
            ]}
            items={[
              {
                id: "upi",
                label: "Pay by UPI first; cards and net banking later",
                category: "good",
                why: "Paths: one working way to pay, fully usable.",
              },
              {
                id: "frontend",
                label: "Front-end team does the screens, back-end team the APIs",
                category: "bad",
                why: "Split by layer: neither half is usable alone.",
              },
              {
                id: "income",
                label: "Income certificates first; other types later",
                category: "good",
                why: "Data: fewer kinds of certificate first.",
              },
              {
                id: "tasks",
                label: "Split it into tasks so each developer has one",
                category: "bad",
                why: "That's planning the work, not splitting the story. Mike Cohn: “Tasks organize work. Stories describe useful outcomes.”",
              },
              {
                id: "manual",
                label: "Officers check eligibility by hand for now; automate it later",
                category: "good",
                why: "Rules: relax a rule, still deliver value.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        A slice needn&apos;t be worth releasing to the public by itself. It must be usable and meet
        the Definition of Done, so you can show it and learn from it.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Why small? ----------------------------------------------------------------------------------- */

export function WhySmall() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Why small?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="why-small"
            prompt="Why do teams that split work into small, thin slices usually get things done faster?"
            options={[
              {
                id: "batch",
                label:
                  "Smaller batches spend less time waiting in queues, get feedback sooner and carry less risk",
                correct: true,
                feedback:
                  "Yes. Donald Reinertsen's first batch-size principle: “Reducing batch size reduces cycle time.” He adds that it accelerates feedback and reduces risk.",
              },
              {
                id: "less",
                label: "Small stories contain less total work",
                feedback:
                  "The total is about the same. What changes is how quickly each piece flows and gets feedback.",
              },
              {
                id: "points",
                label: "Small stories earn more points",
                feedback:
                  "Points aren't the goal. Small items finish sooner and reveal problems earlier.",
              },
              {
                id: "people",
                label: "Each developer can work alone",
                feedback:
                  "Splitting isn't about dividing people; thin slices often need several skills together.",
              },
            ]}
            explanation="A rule of thumb from Humanizing Work: small enough to fit 6 to 10 into a Sprint. Not a rule, but a useful target."
          />
        </div>
      }
    >
      <p>Small, thin slices flow through a team faster. The flow chapter shows why in detail.</p>
    </StepLayout>
  );
}

/* 5 ─ Wrap ------------------------------------------------------------------------------------------ */

const TAKEAWAYS: [string, string][] = [
  ["Slice vertically", "Each piece goes through every layer and is usable."],
  ["Start with the skeleton", "The thinnest end-to-end path first, then add to it."],
  ["Use the patterns", "Workflow, paths, data, rules, interfaces, operations, performance."],
  ["Spikes last", "When you truly can't size something, timebox an investigation."],
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
        Alistair Cockburn&apos;s <Term id="walking-skeleton">walking skeleton</Term>: &ldquo;a tiny
        implementation of the system that performs a small end-to-end function.&rdquo;
      </p>
      <p>Next: with many small items, which comes first? Ordering the backlog.</p>
    </StepLayout>
  );
}

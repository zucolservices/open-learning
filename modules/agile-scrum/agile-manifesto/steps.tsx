"use client";

import { AnimatePresence, motion } from "motion/react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { ChoiceCheckpoint } from "@/toolkit/checkpoints/choice";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { FrameCaption, Stepper } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { AUTHORS, CLOSING, LEAD_IN, PRINCIPLES, REFLECTIONS, THEMES, VALUES } from "./content";
import type { ManifestoState } from "./state";

/* 1 ─ Seventeen people at a ski lodge ------------------------------------------------------------- */

const METHODS = [
  "Extreme Programming",
  "Scrum",
  "DSDM",
  "Adaptive Software Development",
  "Crystal",
  "Feature-Driven Development",
  "Pragmatic Programming",
];

export function Snowbird() {
  return (
    <StepLayout
      eyebrow="The story"
      title="Seventeen people at a ski lodge"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted font-mono text-[11px]">
              11–13 February 2001 · The Lodge at Snowbird, Utah
            </p>
            <p className="mt-1 text-sm">
              Invited by Robert C. Martin to put &ldquo;all the lightweight method leaders in one
              room&rdquo;.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {METHODS.map((m, i) => (
                <motion.span
                  key={m}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="bg-viz-meta/15 rounded-full px-2 py-0.5 text-[11px]"
                >
                  {m}
                </motion.span>
              ))}
            </div>
          </div>
          <div className="border-line bg-surface rounded-xl border p-4">
            <p className="text-muted mb-2 text-[11px]">The seventeen authors</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-3">
              {AUTHORS.map((a, i) => (
                <motion.span
                  key={a}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + 0.03 * i }}
                  className="text-xs"
                >
                  {a}
                </motion.span>
              ))}
            </div>
          </div>
          <p className="text-subtle text-[11px]">
            All seventeen were men; Dave Thomas later called the group &ldquo;seventeen middle-aged
            white guys&rdquo;. Nobody liked the label &ldquo;lightweight&rdquo;; they chose
            &ldquo;agile&rdquo;, which Martin Fowler said &ldquo;captured the adaptiveness and
            response to change&rdquo;.
          </p>
        </div>
      }
    >
      <p>
        Think of a family that agrees &ldquo;time together over a spotless house&rdquo;. They still
        clean. The rule only matters when the two pull against each other: then, time together wins.
      </p>
      <p>
        The <Term id="agile-manifesto">Agile Manifesto</Term> is that kind of statement, for
        building software. In 2001, people behind several competing &ldquo;lightweight&rdquo;
        methods met and found they agreed on what mattered.
      </p>
      <p className="text-muted text-sm">
        They wrote the values at the meeting and finished the principles over the following couple
        of months.
      </p>
    </StepLayout>
  );
}

/* 2 ─ Four values, weighed ⭐ ---------------------------------------------------------------------- */

function Scale({ left, right }: { left: string; right: string }) {
  // The beam tips 9° towards the left; pans hang level from its ends.
  const d = 17;
  const pans: [number, number, string, boolean][] = [
    [51, d, left, true],
    [269, -d, right, false],
  ];
  return (
    <svg
      viewBox="0 0 320 160"
      className="mx-auto w-full max-w-md"
      role="img"
      aria-label={`${left} over ${right}`}
    >
      <path d="M160 40v95M125 140h70" className="stroke-line-strong" strokeWidth={3} />
      <motion.line
        initial={{ x1: 51, y1: 40, x2: 269, y2: 40 }}
        animate={{ x1: 51, y1: 40 + d, x2: 269, y2: 40 - d }}
        transition={{ type: "spring", stiffness: 60, damping: 10 }}
        className="stroke-fg"
        strokeWidth={2.5}
      />
      <circle cx={160} cy={40} r={4} className="fill-fg" />
      {pans.map(([x, dy, label, heavy]) => (
        <motion.g
          key={x}
          initial={{ y: 0 }}
          animate={{ y: dy }}
          transition={{ type: "spring", stiffness: 60, damping: 10 }}
        >
          <line x1={x} y1={40} x2={x - 28} y2={72} className="stroke-line-strong" />
          <line x1={x} y1={40} x2={x + 28} y2={72} className="stroke-line-strong" />
          <path
            d={`M${x - 40} 72h80l-8 ${heavy ? 22 : 12}h-64z`}
            className={heavy ? "fill-accent/30 stroke-accent" : "fill-viz-idle/25 stroke-viz-idle"}
          />
          <text
            x={heavy ? x - 42 : x + 42}
            y={heavy ? 110 : 100}
            textAnchor={heavy ? "start" : "end"}
            className={heavy ? "fill-fg text-[10px] font-semibold" : "fill-muted text-[10px]"}
          >
            {label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

export function FourValues() {
  const [s, set] = useSceneState<ManifestoState>();
  const v = s.value >= 0 && s.value < VALUES.length ? VALUES[s.value] : null;
  return (
    <StepLayout
      eyebrow="Explore"
      title="Four values, weighed"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => set({ value: -1 })}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs",
                !v ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
              )}
            >
              The whole text
            </button>
            {VALUES.map((x, i) => (
              <button
                key={x.left}
                type="button"
                onClick={() => set({ value: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  s.value === i ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                {i + 1}. {x.left}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {!v ? (
              <motion.div
                key="all"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="border-line bg-surface rounded-xl border p-5"
              >
                <p className="text-muted text-[11px] tracking-wide uppercase">
                  Manifesto for Agile Software Development
                </p>
                <p className="mt-3 text-sm">{LEAD_IN}</p>
                <div className="my-4 grid gap-2">
                  {VALUES.map((x) => (
                    <p key={x.left} className="text-center">
                      <span className="text-lg font-semibold">{x.left}</span>{" "}
                      <span className="text-muted">over {x.right}</span>
                    </p>
                  ))}
                </div>
                <p className="text-sm">{CLOSING}</p>
                <p className="text-subtle mt-3 text-[10px]">
                  © 2001, the above authors. This declaration may be freely copied in any form, but
                  only in its entirety through this notice. (agilemanifesto.org)
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={v.left}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-2"
              >
                <div className="border-line bg-surface rounded-xl border p-3">
                  <Scale left={v.left} right={v.right} />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  {[
                    ["What it means", v.means, "border-line bg-surface"],
                    ["On the portal team", v.example, "border-accent/40 bg-accent-soft"],
                    ["What it doesn't mean", v.notMeans, "border-line bg-surface-2"],
                  ].map(([t, d, cls]) => (
                    <div key={t} className={cn("rounded-xl border px-3 py-2 text-xs", cls)}>
                      <p className="mb-1 font-semibold">{t}</p>
                      <p>{d}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Each value names two good things and says which wins when they conflict. The scale tips
        left, but the right-hand pan is never empty.
      </p>
      <p>
        Read the closing line twice: &ldquo;while there is value in the items on the right, we value
        the items on the left more.&rdquo; Most myths about agile come from skipping it.
      </p>
      <p className="text-muted text-sm">Open each value to see it on a real team.</p>
    </StepLayout>
  );
}

/* 3 ─ Twelve principles ------------------------------------------------------------------------------ */

export function Principles() {
  const [s, set] = useSceneState<ManifestoState>();
  const theme = THEMES.find((t) => t.id === s.theme) ?? THEMES[0];
  return (
    <StepLayout
      eyebrow="Explore"
      title="Twelve principles"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => set({ theme: t.id })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  t.id === theme.id
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:bg-surface-2",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
            {PRINCIPLES.map((_, i) => {
              const on = theme.items.includes(i + 1);
              return (
                <motion.div
                  key={i}
                  animate={{ opacity: on ? 1 : 0.3, scale: on ? 1 : 0.92 }}
                  className={cn(
                    "grid h-8 place-items-center rounded-md border font-mono text-xs",
                    on ? "border-accent bg-accent text-accent-fg" : "border-line bg-surface",
                  )}
                >
                  {i + 1}
                </motion.div>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <p className="text-sm font-medium">{theme.gist}</p>
              {theme.items.map((n) => (
                <div
                  key={n}
                  className="border-line bg-surface flex gap-3 rounded-xl border px-3 py-2 text-sm"
                >
                  <span className="text-accent font-mono font-semibold">{n}</span>
                  <span>&ldquo;{PRINCIPLES[n - 1]}&rdquo;</span>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <p className="text-subtle text-[10px]">
            Principles quoted verbatim from agilemanifesto.org/principles.html. The six themes are
            our grouping, to make twelve easier to remember; the manifesto lists them plainly.
          </p>
        </div>
      }
    >
      <p>The values say what matters. The twelve principles say what that looks like day to day.</p>
      <p>
        Notice what&apos;s absent: no sprints, no stand-ups, no story points. The manifesto names no
        method at all. Those come from frameworks like Scrum, which you&apos;ll meet next.
      </p>
      <p className="text-muted text-sm">
        Principle 8 is often forgotten: a <Term id="sustainable-pace">sustainable pace</Term> the
        team can keep up indefinitely.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Says it, or myth? ---------------------------------------------------------------------------- */

export function SaysOrMyth() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Says it, or myth?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="says-or-myth"
            prompt="Sort each claim: does the Agile Manifesto say it, or is it a myth?"
            categories={[
              { id: "says", label: "The manifesto says it" },
              { id: "myth", label: "Myth" },
            ]}
            items={[
              {
                id: "docs",
                label: "Agile teams shouldn't write documentation",
                category: "myth",
                why: "Working software is valued “over” comprehensive documentation, and “there is value in the items on the right”.",
              },
              {
                id: "progress",
                label: "Working software is the primary measure of progress",
                category: "says",
                why: "That's principle 7, word for word.",
              },
              {
                id: "faster",
                label: "Agile is about delivering faster",
                category: "myth",
                why: "The text talks about valuable software, a sustainable pace and simplicity. It never says “faster”.",
              },
              {
                id: "scrum",
                label: "Agile is another name for Scrum",
                category: "myth",
                why: "The manifesto names no method. Scrum is one framework among several (XP, DSDM, Crystal…).",
              },
              {
                id: "late",
                label: "Changing requirements are welcome, even late in development",
                category: "says",
                why: "That's principle 2.",
              },
              {
                id: "contracts",
                label: "Contracts are unnecessary with agile",
                category: "myth",
                why: "Customer collaboration is valued over contract negotiation; contracts still have value.",
              },
            ]}
          />
        </div>
      }
    >
      <p>Most arguments about agile are about things the manifesto never said.</p>
    </StepLayout>
  );
}

/* 5 ─ Which principle? ------------------------------------------------------------------------------ */

export function WhichPrinciple() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Which principle is it?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <ChoiceCheckpoint
            id="which-principle"
            prompt="To hit a launch date, a team has worked late every night for six weeks. Bugs are rising and two people have gone on sick leave. Which principle is being broken most directly?"
            options={[
              {
                id: "p8",
                label:
                  "8: “Agile processes promote sustainable development… maintain a constant pace indefinitely.”",
                correct: true,
                feedback:
                  "Yes. A pace that burns people out isn't sustainable, and quality usually falls with it.",
              },
              {
                id: "p3",
                label: "3: “Deliver working software frequently…”",
                feedback: "They are delivering. The problem is the pace they pay for it with.",
              },
              {
                id: "p6",
                label: "6: “…face-to-face conversation.”",
                feedback: "Nothing here is about how information is shared.",
              },
              {
                id: "p10",
                label: "10: “Simplicity… maximizing the amount of work not done…”",
                feedback:
                  "Cutting scope might help fix it, but the principle being broken is the pace.",
              },
            ]}
            explanation="Overtime can rescue a week; as a habit it lowers quality and loses people. Principle 8 asks for a pace sponsors, developers and users can all keep up."
          />
        </div>
      }
    >
      <p>Principles are most useful as a lens: which one would have prevented this?</p>
    </StepLayout>
  );
}

/* 6 ─ What the authors said later ------------------------------------------------------------------- */

export function Reflections() {
  const [s, set] = useSceneState<ManifestoState>();
  const f = Math.min(s.frame, REFLECTIONS.length - 1);
  const r = REFLECTIONS[f];
  return (
    <StepLayout
      eyebrow="Step through"
      title="What the authors said later"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <motion.div
            key={f}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-line bg-surface rounded-xl border p-5"
          >
            <p className="text-muted font-mono text-[11px]">
              {r.who} · {r.when}
            </p>
            <p className="mt-1 font-semibold">{r.title}</p>
            <p className="text-accent mt-3 text-xl font-semibold">&ldquo;{r.quote}&rdquo;</p>
          </motion.div>
          <Stepper step={f} count={REFLECTIONS.length} onChange={(n) => set({ frame: n })} />
          <FrameCaption frameKey={f} title="The point">
            {r.gist}
          </FrameCaption>
        </div>
      }
    >
      <p>
        Within fifteen years, several authors were warning that &ldquo;agile&rdquo; had drifted from
        what they wrote: sold as a product, imposed on teams, reduced to rituals.
      </p>
      <p className="text-muted text-sm">
        Their fix is the same: go back to the values, and let teams inspect and adapt how they work.
      </p>
    </StepLayout>
  );
}

/* 7 ─ Wrap ----------------------------------------------------------------------------------------- */

const TAKEAWAYS: [string, string][] = [
  [
    "Four values, not four bans",
    "Each prefers one good thing over another; both sides keep value.",
  ],
  [
    "Twelve principles",
    "Early value, welcome change, trusted people, craft, sustainable pace, reflection.",
  ],
  [
    "No method inside",
    "The manifesto names no framework. Scrum, Kanban and XP are ways to live it.",
  ],
  ["Agility, not “Agile”", "Its own authors warn against selling it as a product or imposing it."],
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
      <p>The manifesto is short enough to read in two minutes, and worth rereading every year.</p>
      <p>Next: the engine underneath all of it, inspecting and adapting.</p>
    </StepLayout>
  );
}

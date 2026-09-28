"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { useSceneState } from "@/lib/module-sdk";
import { StepLayout } from "@/toolkit/layout/step-layout";
import { SortCheckpoint } from "@/toolkit/checkpoints/sort";
import { Segmented } from "@/toolkit/controls/segmented";
import { FrameCaption } from "@/toolkit/controls/stepper";
import { Term } from "@/toolkit/glossary/term";
import { cn } from "@/lib/cn";
import { CASES } from "./cases";
import type { AntiState } from "./state";

/* 1 ─ Teaching to the test ------------------------------------------------------------------------ */

const SERIES = {
  aid: { velocity: [21, 19, 22, 20, 23, 21, 22, 21], features: [10, 9, 11, 10, 11, 10, 11, 10] },
  target: { velocity: [21, 23, 26, 28, 31, 34, 37, 40], features: [10, 10, 9, 10, 9, 9, 8, 9] },
};

function Mini({
  title,
  values,
  max,
  className,
}: {
  title: string;
  values: number[];
  max: number;
  className: string;
}) {
  const W = 200;
  const H = 70;
  const x = (i: number) => 8 + (i / (values.length - 1)) * (W - 16);
  const y = (v: number) => H - 8 - (v / max) * (H - 16);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  return (
    <div className="border-line bg-surface rounded-xl border px-3 py-2">
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-medium">{title}</p>
        <p className="text-sm font-semibold tabular-nums">{values[values.length - 1]}</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-hidden>
        <line x1={8} x2={W - 8} y1={H - 8} y2={H - 8} className="stroke-line" />
        <motion.path
          initial={false}
          animate={{ d }}
          fill="none"
          className={className}
          strokeWidth={2.5}
        />
      </svg>
      <p className="text-muted text-[10px]">Sprints 1–8</p>
    </div>
  );
}

export function Targets() {
  const [s, set] = useSceneState<AntiState>();
  const k = s.target ? "target" : "aid";
  return (
    <StepLayout
      eyebrow="Analogy"
      title="Teaching to the test"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <Segmented
            size="sm"
            value={k}
            options={[
              ["aid", "Velocity for the team's planning"],
              ["target", "Velocity as a target: +10% a quarter"],
            ]}
            onChange={(v) => set({ target: v === "target" })}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Mini
              title="Velocity (points per Sprint)"
              values={SERIES[k].velocity}
              max={45}
              className="stroke-accent"
            />
            <Mini
              title="Features users actually got"
              values={SERIES[k].features}
              max={22}
              className="stroke-good"
            />
          </div>
          <FrameCaption
            frameKey={k}
            title={s.target ? "The number rises; nothing else does" : "An honest planning aid"}
            tone={s.target ? "bad" : undefined}
          >
            {s.target
              ? "The same work now earns more points. Nobody is lying exactly: every estimate just leans a little higher. The chart looks great and tells you nothing."
              : "Velocity wobbles around the team's real pace, so it's useful for forecasting the next Sprint. That's all it's for."}
          </FrameCaption>
          <p className="text-muted text-xs">Illustrative numbers.</p>
        </div>
      }
    >
      <p>
        A school judged only on its exam pass rate starts teaching to the test. Marks go up;
        understanding doesn&apos;t. The measure stopped measuring the moment it became the goal.
      </p>
      <p>
        Economist Charles Goodhart spotted this in 1975, and anthropologist Marilyn Strathern gave{" "}
        <Term id="goodharts-law">Goodhart&apos;s law</Term> its famous form in 1997: &ldquo;When a
        measure becomes a target, it ceases to be a good measure.&rdquo; Toggle what happens when{" "}
        <Term id="velocity">velocity</Term> becomes a target.
      </p>
    </StepLayout>
  );
}

/* 2 ─ The symptom clinic ⭐ (fix the problem) ----------------------------------------------------- */

const rotate = <T,>(xs: T[], n: number) => xs.map((_, i) => xs[(i + n) % xs.length]);

export function Clinic() {
  const [s, set] = useSceneState<AntiState>();
  const at = Math.min(s.at, CASES.length - 1);
  const c = CASES[at];
  const named = s.names[c.id];
  const fixes = rotate(
    c.fixes.map((f, i) => ({ ...f, i })),
    at % 3,
  );
  const fix = s.fixes[c.id];
  const chosen = fix !== undefined ? c.fixes[fix] : null;
  return (
    <StepLayout
      eyebrow="Fix the problem"
      title="The symptom clinic"
      stage={
        <div className="flex flex-1 flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {CASES.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => set({ at: i })}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs",
                  i === at ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                  s.fixes[x.id] !== undefined && i !== at && "text-muted",
                )}
              >
                Team {i + 1}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={c.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex flex-col gap-2"
            >
              <blockquote className="border-accent bg-surface rounded-r-xl border-l-4 px-3 py-2 text-sm">
                {c.symptom}
              </blockquote>
              <p className="text-muted text-xs">1. What&apos;s going on?</p>
              <div className="flex flex-wrap gap-1.5">
                {c.names.map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={named === n}
                    onClick={() => set({ names: { ...s.names, [c.id]: n } })}
                    className={cn(
                      "rounded-lg border px-2.5 py-1 text-xs",
                      named === n
                        ? n === c.name
                          ? "border-good bg-good/10"
                          : "border-bad bg-bad/10"
                        : "border-line bg-surface hover:bg-surface-2",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {named && (
                <motion.p
                  key={named}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-1.5 text-xs"
                >
                  {named === c.name ? (
                    <Check className="text-good mt-0.5 size-3.5 shrink-0" />
                  ) : (
                    <X className="text-bad mt-0.5 size-3.5 shrink-0" />
                  )}
                  <span>
                    {named === c.name ? "" : `Not quite: this is “${c.name}”. `}
                    {c.why}
                  </span>
                </motion.p>
              )}
              {named && (
                <>
                  <p className="text-muted text-xs">2. What would you try first?</p>
                  <div className="flex flex-col gap-1.5">
                    {fixes.map((f) => (
                      <button
                        key={f.i}
                        type="button"
                        aria-pressed={fix === f.i}
                        onClick={() => set({ fixes: { ...s.fixes, [c.id]: f.i } })}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-left text-xs",
                          fix === f.i
                            ? "border-accent bg-accent-soft"
                            : "border-line bg-surface hover:bg-surface-2",
                        )}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {chosen && (
                <motion.div
                  key={fix}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs",
                    chosen.good ? "border-good/50 bg-good/10" : "border-bad/50 bg-bad/10",
                  )}
                >
                  <p className="font-semibold">
                    {chosen.good ? "Likely to help" : "Unlikely to help"}
                  </p>
                  <p className="mt-1">{chosen.result}</p>
                </motion.div>
              )}
              {chosen && at < CASES.length - 1 && (
                <button
                  type="button"
                  onClick={() => set({ at: at + 1 })}
                  className="bg-accent text-accent-fg self-start rounded-full px-4 py-1.5 text-xs font-medium"
                >
                  Next team
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      }
    >
      <p>
        Six teams, six symptoms. For each, name the <Term id="anti-pattern">anti-pattern</Term>,
        then choose what to try first. Change your mind as often as you like.
      </p>
      <p className="text-muted text-sm">
        Most of these share a root: the rituals are there, but the inspecting and adapting
        isn&apos;t. Teams, numbers and quotes from the teams are made up; the pattern names are
        real.
      </p>
    </StepLayout>
  );
}

/* 3 ─ Healthy or anti-pattern? -------------------------------------------------------------------- */

export function HealthyOrNot() {
  return (
    <StepLayout
      eyebrow="Checkpoint"
      title="Healthy or anti-pattern?"
      stage={
        <div className="flex flex-1 flex-col justify-center">
          <SortCheckpoint
            id="healthy-or-not"
            prompt="Healthy practice, or an anti-pattern?"
            categories={[
              { id: "ok", label: "Healthy" },
              { id: "anti", label: "Anti-pattern" },
            ]}
            items={[
              {
                id: "change",
                label: "The Sprint Backlog changes mid-Sprint as the Developers learn more",
                category: "ok",
                why: "The Scrum Guide expects it: the Sprint Backlog is updated throughout the Sprint as more is learned. The Sprint Goal stays fixed.",
              },
              {
                id: "blame",
                label: "Any Sprint Backlog item left unfinished counts as a broken promise",
                category: "anti",
                why: "Since 2011 the Scrum Guide calls the selected work a forecast; only the Sprint Goal is a commitment.",
              },
              {
                id: "compare",
                label: "The manager ranks teams by velocity each quarter",
                category: "anti",
                why: "Each team's points mean something different, and ranking invites inflation. Velocity is a team's own planning aid.",
              },
              {
                id: "skip",
                label: "The team skips the Retrospective in busy Sprints",
                category: "anti",
                why: "Busy Sprints are exactly when there's most to learn. Dropping events “covers up problems”, says the Guide.",
              },
              {
                id: "reorder",
                label: "The Product Owner reorders the Product Backlog after the Sprint Review",
                category: "ok",
                why: "That's the Review working as intended: feedback changes what comes next.",
              },
            ]}
          />
        </div>
      }
    >
      <p>
        Not every change to &ldquo;by-the-book&rdquo; Scrum is an anti-pattern, and not every
        by-the-book move is healthy. Sort each one.
      </p>
    </StepLayout>
  );
}

/* 4 ─ Wrap --------------------------------------------------------------------------------------- */

const NAMES: [string, string][] = [
  ["ScrumBut", "Scrum.org's name for “We use Scrum, but…”: an excuse that hides a problem."],
  [
    "Scrum without engineering",
    "Martin Fowler (2009): the Scrum practices without code quality, until “progress is slow because the code base is a mess”.",
  ],
  [
    "Dark Scrum",
    "Ron Jeffries (2016): Scrum used to pressure and control a team instead of freeing it.",
  ],
  [
    "Zombie Scrum",
    "Verwijs, Schartau and Overeem: the rituals without the heart. Their book (2020) is a practical guide out.",
  ],
];

export function Wrap() {
  return (
    <StepLayout
      eyebrow="Wrap-up"
      title="What to remember"
      stage={
        <div className="flex flex-1 flex-col justify-center gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            {NAMES.map(([t, d], i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i }}
                className="border-line bg-surface rounded-xl border px-4 py-3"
              >
                <p className="text-sm font-semibold">{t}</p>
                <p className="text-muted mt-1 text-xs">{d}</p>
              </motion.div>
            ))}
          </div>
          <blockquote className="border-accent bg-surface rounded-r-xl border-l-4 px-4 py-3 text-sm">
            &ldquo;I like to say that I may have invented story points, and if I did, I&apos;m sorry
            now.&rdquo;
            <span className="text-muted mt-1 block text-xs">Ron Jeffries, 2019</span>
          </blockquote>
        </div>
      }
    >
      <p>
        The Scrum Guide is blunt about half-measures: &ldquo;Changing the core design or ideas of
        Scrum, leaving out elements, or not following the rules of Scrum, covers up problems and
        limits the benefits of Scrum.&rdquo;
      </p>
      <p>
        When you spot an anti-pattern, name it kindly and look for the cause. It&apos;s usually a
        system problem (a target, a contract, a missing stakeholder), not a lazy team.
      </p>
    </StepLayout>
  );
}
